import { mkdir, readFile, rename, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { Prisma, type PrismaClient } from '@prisma/client';
import { prisma } from './db';
import { seedQuestions, papers, normalizeQuestion } from './exams';
import { decodePrivateData, encodePrivateData, isLocalPrivateMode } from './private-data';
import { assertDbEncryptionKey, openDbRow, sealDbRow } from './pg-private';
import type { Store } from './types';
export const isDemoStorage = !process.env.DATABASE_URL || process.env.DEMO_MODE==='true';
function guardMode() { if (isDemoStorage && process.env.NODE_ENV==='production' && process.env.DEMO_MODE!=='true') throw new Error('生产环境缺少 DATABASE_URL；需要显式 DEMO_MODE=true 才能启动演示。'); }
export function emptyStore():Store { return {users:[],sessions:[],attempts:[],reviews:[],studyRecords:[],masteries:[],questions:structuredClone(seedQuestions),audits:[],rateBuckets:[]}; }
// 本地演示只支持一个 Node 进程；生产持久化使用 PostgreSQL 的事务锁。
const globalQueue=globalThis as unknown as {storeQueue:Promise<unknown>|undefined};
async function fileTransaction<T>(fn:(state:Store)=>T|Promise<T>):Promise<T> {
 const task=(globalQueue.storeQueue??Promise.resolve()).catch(()=>{}).then(async()=>{
  const file=path.resolve(process.env.DEMO_DATA_PATH||'.demo-data/store.json');
  let state:Store;
  try{state=decodePrivateData<Store>(await readFile(file,'utf8'));}catch(e){if((e as NodeJS.ErrnoException).code!=='ENOENT')throw e;state=emptyStore();}
  state.questions=(state.questions||[]).map(normalizeQuestion);
  for(const q of seedQuestions)if(!state.questions.some(existing=>existing.id===q.id))state.questions.push(structuredClone(q));
  const result=await fn(state);
  await mkdir(path.dirname(file),{recursive:true});
  const temp=`${file}.${process.pid}.tmp`; await writeFile(temp,encodePrivateData(state),'utf8'); await rename(temp,file);
  return result;
 });globalQueue.storeQueue=task;return task;
}
type Tx=Prisma.TransactionClient;
const tables=['users','sessions','attempts','reviews','studyRecords','masteries','questions','audits','rateBuckets'] as const;
const models={users:'user',sessions:'session',attempts:'attempt',reviews:'review',studyRecords:'studyRecord',masteries:'mastery',questions:'examQuestion',audits:'audit',rateBuckets:'rateBucket'} as const;
// 集中仓储便于演示/正式使用同一权限逻辑。面向小班纵向闭环，所有写入串行化。
async function pgLoad(tx:Tx):Promise<Store> {
 const entries=await Promise.all(tables.map(async key=>{
  const model=tx[models[key]] as unknown as {findMany:()=>Promise<unknown[]>};
  return [key,(await model.findMany()).map(row=>openDbRow(key,row as Record<string,unknown>))] as const;
 }));
 const state=JSON.parse(JSON.stringify(Object.fromEntries(entries))) as Store;
 state.questions=state.questions.map(normalizeQuestion);
 return state;
}
function inputRow(row:Record<string,unknown>) {
 const r={...row};for(const key of ['createdAt','expiresAt','verifiedAt','resetAt','updatedAt']) if(typeof r[key]==='string')r[key]=new Date(r[key] as string);
 if('finalPoints' in r && r.finalPoints===null)r.finalPoints=Prisma.DbNull;
 return r;
}
async function pgFlush(tx:Tx,before:Store,after:Store) {
 // 删除依赖项优先，再按父子关系插入/更新；仅提交发生变化的行。
 for(const key of [...tables].reverse()) {
  const ids=before[key].filter(r=>!after[key].some(n=>n.id===r.id)).map(r=>r.id);
  if(ids.length)await (tx[models[key]] as unknown as {deleteMany:(q:unknown)=>Promise<unknown>}).deleteMany({where:{id:{in:ids}}});
 }
 for(const key of tables) for(const row of after[key]) {
  const old=before[key].find(r=>r.id===row.id); if(JSON.stringify(old)===JSON.stringify(row))continue;
  const data=inputRow(sealDbRow(key,row as unknown as Record<string,unknown>));
  await (tx[models[key]] as unknown as {upsert:(q:unknown)=>Promise<unknown>}).upsert({where:{id:row.id},create:data,update:data});
 }
}
export async function transaction<T>(fn:(state:Store)=>T|Promise<T>):Promise<T> {
 guardMode();if(isLocalPrivateMode()&&!isDemoStorage)throw new Error('本机隐私模式禁止连接远程 PostgreSQL。');if(isDemoStorage)return fileTransaction(fn);
 assertDbEncryptionKey();
 return prisma.$transaction(async tx=>{
  await tx.$executeRaw`SELECT pg_advisory_xact_lock(78210542)`;
  const state=await pgLoad(tx);const before=structuredClone(state);const result=await fn(state);await pgFlush(tx,before,state);return result;
 },{maxWait:10000,timeout:20000});
}
export async function initializeDatabase(db:PrismaClient=prisma) {
 for(const paper of papers)await db.paper.upsert({where:{id:paper.id},create:paper,update:paper});
 for(const q of seedQuestions){
  const existing=await db.examQuestion.findUnique({where:{id:q.id}});
  if(!existing)await db.examQuestion.create({data:q});
  else if(existing.version===1 && existing.knowledgePoints.length===0 && !existing.learningAnalysis)
   await db.examQuestion.update({where:{id:q.id},data:{knowledgePoints:q.knowledgePoints,learningAnalysis:q.learningAnalysis,commonMistake:q.commonMistake}});
 }
}

