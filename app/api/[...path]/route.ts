import { NextRequest,NextResponse } from 'next/server';
import { randomUUID } from 'node:crypto';
import { z } from 'zod';
import { transaction,isDemoStorage } from '@/lib/store';
import { AppError,authenticate,hashPassword,checkPassword,newToken,tokenHash,publicUser,requireRole,rateLimit } from '@/lib/auth';
import { annotations,exercises } from '@/lib/content';
import { papers,publicQuestion } from '@/lib/exams';
import { grade } from '@/lib/grading';
import { generateTransfer } from '@/lib/transfer-generation';
import { transferTargets } from '@/lib/transfer-practice';
import { updateMastery } from '@/lib/mastery';
import { accountInput,questionInput } from '@/lib/validation';
import { assertLocalRequest,isLocalPrivateMode } from '@/lib/private-data';
import type { User,PointResult } from '@/lib/types';
export const runtime='nodejs';
export const dynamic='force-dynamic';
const now=()=>new Date().toISOString();
const json=(data:unknown,status=200)=>NextResponse.json(data,{status,headers:{'Cache-Control':'no-store'}});
function own<T extends {userId:string}>(row:T|undefined,u:User):T {if(!row||row.userId!==u.id)throw new AppError(404,'未找到这条记录');return row;}
async function body(req:NextRequest){const raw=await req.text();if(Buffer.byteLength(raw)>50000)throw new AppError(413,'请求内容过长');try{return JSON.parse(raw);}catch{throw new AppError(400,'请求 JSON 无效');}}
async function handle(req:NextRequest,write:boolean) {
 try{assertLocalRequest(req.nextUrl);}catch{throw new AppError(403,'本机隐私模式只允许在 localhost 或 127.0.0.1 使用。');}
 const route=req.nextUrl.pathname.replace('/api/','');
 if(write) {
  const expected=process.env.APP_ORIGIN||process.env.RENDER_EXTERNAL_URL||`${req.nextUrl.protocol}//${req.headers.get('host')}`;
  if(req.headers.get('origin')!==expected)throw new AppError(403,'请求来源不匹配；请检查 APP_ORIGIN 配置。');
  if(!req.headers.get('content-type')?.startsWith('application/json'))throw new AppError(415,'请使用 JSON 请求');
 }
 const token=req.cookies.get('kg_session')?.value;
 if(route==='status'&&!write)return json({storage:isLocalPrivateMode()?'LOCAL_ENCRYPTED':isDemoStorage?'DEMO_FILE':'POSTGRESQL_ENCRYPTED',grading:process.env.OPENAI_API_KEY?'AI':'DEMO',originalExercises:exercises.length,questionsDisclaimer:'七条固定资料原题供站内阅读，转载授权与正式核验状态另列；其他题干由授权及核验门控。'});
 if(route==='exams'&&!write) return transaction(s=>json({papers,questions:s.questions.map(publicQuestion)}));
 if(route==='session'&&!write){try {const u=await authenticate(token);return json({user:publicUser(u)});}catch(e){if(e instanceof AppError&&e.status===401)return json({user:null});throw e;}}
 if((route==='auth/register'||route==='auth/login')&&write) {
  const ip=process.env.TRUST_PROXY==='true'?(req.headers.get('x-forwarded-for')?.split(',')[0].trim()||'unknown'):'local';
  await rateLimit(`auth:${tokenHash(ip)}`,30,15*60*1000);
  const input=accountInput.parse(await body(req));
  const hash=route==='auth/register'?hashPassword(input.password):null;
  const rawToken=newToken();const expiresAt=new Date(Date.now()+7*86400000).toISOString();
  const u=await transaction(s=>{
   let u=s.users.find(u=>u.email===input.email);
   if(route==='auth/register'){if(u)throw new AppError(409,'该邮箱已注册');u={id:randomUUID(),email:input.email,name:input.name||'同学',passwordHash:hash!,role:'STUDENT',createdAt:now()};s.users.push(u);}
   else if(!u||!checkPassword(input.password,u.passwordHash))throw new AppError(401,'邮箱或密码不正确');
   s.sessions=s.sessions.filter(x=>new Date(x.expiresAt)>new Date());
   s.sessions.push({id:tokenHash(rawToken),userId:u!.id,expiresAt});return u!;
  });
  const res=json({user:publicUser(u)});res.cookies.set('kg_session',rawToken,{httpOnly:true,sameSite:'lax',secure:process.env.NODE_ENV==='production'&&!(process.env.APP_ORIGIN||'').startsWith('http://localhost')&&!(process.env.APP_ORIGIN||'').startsWith('http://127.0.0.1'),path:'/',expires:new Date(expiresAt)});return res;
 }
 const u=await authenticate(token);
 if(route==='auth/logout'&&write){await transaction(s=>{s.sessions=s.sessions.filter(x=>x.id!==tokenHash(token!));});const res=json({ok:true});res.cookies.delete('kg_session');return res;}
 if(route==='transfer/generate'&&write){
  if(!process.env.OPENAI_API_KEY)throw new AppError(503,'AI 出句暂未启用，请先使用本站预设练习');
  const input=z.object({targetId:z.string()}).strict().parse(await body(req));
  const target=transferTargets.find(t=>t.id===input.targetId);
  if(!target)throw new AppError(404,'未找到这个练习字词');
  await rateLimit('transfer:'+u.id,3,15*60*1000);
  try{return json({exercise:await generateTransfer(target)});}
  catch{return json({error:'AI 本次未生成可靠句子，请先使用本站预设练习'},503);}
 }
 if(route==='learning'&&!write)return transaction(s=>json({attempts:s.attempts.filter(a=>a.userId===u.id).sort((a,b)=>b.createdAt.localeCompare(a.createdAt)),records:s.studyRecords.filter(r=>r.userId===u.id),masteries:s.masteries.filter(m=>m.userId===u.id)}));
 if(route==='study'&&write){const input=z.object({annotationId:z.string().refine(id=>annotations.some(a=>a.id===id)),action:z.enum(['READ','SAVE','REVISIT'])}).strict().parse(await body(req));await rateLimit(`study:${u.id}`,120,60000);return transaction(s=>{s.studyRecords.push({id:randomUUID(),userId:u.id,...input,createdAt:now()});return json({ok:true});});}
 if(route==='attempts'&&write) {
  const input=z.object({exerciseId:z.string(),answer:z.string().trim().min(1,'先写下你的理解').max(3000)}).strict().parse(await body(req));
  const exercise=exercises.find(e=>e.id===input.exerciseId);if(!exercise)throw new AppError(404,'未找到练习');
  await rateLimit(`grade:${u.id}`,10,60000);
  const assessment=await grade(exercise,input.answer);
  return transaction(s=>{const attempt={id:randomUUID(),userId:u.id,...input,assessment,createdAt:now(),reviewStatus:assessment.reviewRequired?'PENDING' as const:'NONE' as const,assignedTo:null,finalPoints:null};s.attempts.push(attempt);updateMastery(s,u.id);return json({attempt},201);});
 }
 if(route==='reviews/request'&&write){const input=z.object({attemptId:z.string()}).strict().parse(await body(req));return transaction(s=>{const a=own(s.attempts.find(a=>a.id===input.attemptId),u);if(a.reviewStatus!=='COMPLETED'&&a.reviewStatus!=='IN_REVIEW')a.reviewStatus='PENDING';return json({ok:true});});}
 if(route==='reviews'&&!write){requireRole(u,['ADMIN','REVIEWER']);return transaction(s=>json({attempts:s.attempts.filter(a=>a.reviewStatus==='PENDING'||(a.reviewStatus==='IN_REVIEW'&&a.assignedTo===u.id)).map(a=>({...a,userId:'匿名学生'}))}));}
 if(route==='reviews/claim'&&write){requireRole(u,['ADMIN','REVIEWER']);const {attemptId}=z.object({attemptId:z.string()}).strict().parse(await body(req));return transaction(s=>{const a=s.attempts.find(a=>a.id===attemptId);if(!a||a.reviewStatus==='COMPLETED')throw new AppError(404,'未找到待复核答案');if(a.assignedTo&&a.assignedTo!==u.id)throw new AppError(409,'已有其他教师领取');a.assignedTo=u.id;a.reviewStatus='IN_REVIEW';return json({ok:true});});}
 if(route==='reviews/complete'&&write){requireRole(u,['ADMIN','REVIEWER']);const input=z.object({attemptId:z.string(),reason:z.string().trim().min(5).max(2000),points:z.array(z.object({id:z.string(),earned:z.number().int().nonnegative(),feedback:z.string().trim().min(1).max(1000)}).strict())}).strict().parse(await body(req));return transaction(s=>{
  const a=s.attempts.find(a=>a.id===input.attemptId);if(!a||a.assignedTo!==u.id||a.reviewStatus!=='IN_REVIEW')throw new AppError(403,'请先领取此答案');const e=exercises.find(e=>e.id===a.exerciseId)!;
  if(input.points.length!==e.rubric.length||new Set(input.points.map(p=>p.id)).size!==e.rubric.length)throw new AppError(400,'评分点缺失或重复');
  const points:PointResult[]=e.rubric.map(r=>{const p=input.points.find(p=>p.id===r.id);if(!p||p.earned>r.max)throw new AppError(400,'人工分值超出评分点范围');return {...p,max:r.max,evidence:'',confidence:1};});
  a.finalPoints=points;a.reviewStatus='COMPLETED';s.reviews.push({id:randomUUID(),attemptId:a.id,reviewerId:u.id,reason:input.reason,points,createdAt:now()});s.audits.push({id:randomUUID(),actorId:u.id,action:'REVIEW_COMPLETE',entityId:a.id,details:{reason:input.reason,points},createdAt:now()});updateMastery(s,a.userId);return json({ok:true});
 });}
 if(route==='admin/questions'&&!write){requireRole(u,['ADMIN']);return transaction(s=>json({questions:s.questions}));}
 if(route==='admin/questions'&&write){requireRole(u,['ADMIN']);const input=questionInput.parse(await body(req));return transaction(s=>{
  if(s.questions.some(q=>q.id!==input.id&&q.paperId===input.paperId&&q.number===input.number))throw new AppError(409,'该卷题号已有档案');
  const old=s.questions.find(q=>q.id===input.id);const q={...input,authorization:'UNKNOWN' as const,authorizationEvidence:null,verification:'PENDING' as const,verificationEvidence:null,verifiedBy:null,verifiedAt:null,version:(old?.version||0)+1};
  s.questions=s.questions.filter(x=>x.id!==q.id);s.questions.push(q);s.audits.push({id:randomUUID(),actorId:u.id,action:'QUESTION_UPSERT',entityId:q.id,details:{before:old||null,after:q},createdAt:now()});return json({question:publicQuestion(q)});
 });}
 if(route==='admin/questions/status'&&write){requireRole(u,['ADMIN']);const input=z.object({id:z.string(),authorization:z.enum(['UNKNOWN','APPROVED','DENIED']),authorizationEvidence:z.string().max(2000).nullable(),verification:z.enum(['PENDING','VERIFIED','REJECTED']),verificationEvidence:z.string().max(2000).nullable()}).strict().parse(await body(req));if(input.authorization==='APPROVED'&&!input.authorizationEvidence?.trim())throw new AppError(400,'批准授权必须填写授权凭证');if(input.verification==='VERIFIED'&&!input.verificationEvidence?.trim())throw new AppError(400,'核验通过必须填写原卷对照证据');return transaction(s=>{const q=s.questions.find(q=>q.id===input.id);if(!q)throw new AppError(404,'未找到题目');const before=structuredClone(q);Object.assign(q,input,{verifiedBy:input.verification==='VERIFIED'?u.id:null,verifiedAt:input.verification==='VERIFIED'?now():null,version:q.version+1});s.audits.push({id:randomUUID(),actorId:u.id,action:'QUESTION_STATUS',entityId:q.id,details:{before,after:q},createdAt:now()});return json({question:publicQuestion(q)});});}
 if(route==='admin/audit'&&!write){requireRole(u,['ADMIN']);return transaction(s=>json({audits:s.audits.slice(-100)}));}
 throw new AppError(404,'接口不存在');
}
async function run(req:NextRequest,write:boolean){try{return await handle(req,write);}catch(e){if(e instanceof z.ZodError)return json({error:e.issues.map(x=>x.message).join('；')},400);if(e instanceof AppError)return json({error:e.message},e.status);console.error('Request failed',e instanceof Error?e.name:'unknown');return json({error:'服务暂不可用，请检查数据库连接与服务日志。'},503);}}
export const GET=(r:NextRequest)=>run(r,false);
export const POST=(r:NextRequest)=>run(r,true);

