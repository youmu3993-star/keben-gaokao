import test from 'node:test';
import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import { transaction,initializeDatabase,isDemoStorage } from '../lib/store';
import { prisma } from '../lib/db';
import { hashPassword } from '../lib/auth';
import { demoGrade } from '../lib/grading';
import { exercises } from '../lib/content';
test('PostgreSQL 仓储事务回滚、并发写入与JSON评分持久化', {skip:process.env.RUN_POSTGRES_TESTS!=='true'},async()=>{
 assert.equal(isDemoStorage,false,'必须设置 DATABASE_URL 和 DEMO_MODE=false');
 assert.ok((process.env.DATA_ENCRYPTION_KEY||'').length>=32,'必须设置 DATA_ENCRYPTION_KEY');
 const dbName=new URL(process.env.DATABASE_URL!).pathname;
 assert.ok(dbName.endsWith('_test'),'只能对名称以 _test 结尾的独立测试数据库运行');
 const id=randomUUID(),at=new Date().toISOString();
 await initializeDatabase();
 try{
  await transaction(s=>s.users.push({id,email:`${id}@example.test`,name:'数据库测试',role:'STUDENT',passwordHash:hashPassword('test-only-password'),createdAt:at}));
  await assert.rejects(transaction(s=>{s.studyRecords.push({id:`${id}:rollback`,userId:id,annotationId:'yi',action:'READ',createdAt:at});throw new Error('回滚');}));
  assert.equal(await prisma.studyRecord.count({where:{userId:id}}),0);
  await Promise.all(Array.from({length:5},(_,i)=>transaction(s=>s.studyRecords.push({id:`${id}:${i}`,userId:id,annotationId:'yi',action:'REVISIT',createdAt:at}))));
  assert.equal(await prisma.studyRecord.count({where:{userId:id}}),5);
  await transaction(s=>s.attempts.push({id,userId:id,exerciseId:'translate',answer:'天性没有不同，善于借助外物。',assessment:demoGrade(exercises[0],'天性没有不同，善于借助外物。'),createdAt:at,reviewStatus:'PENDING',assignedTo:null,finalPoints:null}));
  await prisma.$disconnect();
  const found=await prisma.attempt.findUnique({where:{id}});assert.ok(found);assert.equal(found.finalPoints,null);assert.equal(typeof found.assessment,'string');assert.equal(JSON.stringify(found).includes('天性没有不同'),false);
  const storedUser=await prisma.user.findUnique({where:{id}});assert.ok(storedUser);assert.equal(storedUser.email.includes('@example.test'),false);
 }finally{
  await transaction(s=>{s.attempts=s.attempts.filter(a=>a.userId!==id);s.studyRecords=s.studyRecords.filter(r=>r.userId!==id);s.users=s.users.filter(u=>u.id!==id);});
  await prisma.$disconnect();
 }
});

