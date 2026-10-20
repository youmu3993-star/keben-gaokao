import 'dotenv/config';
import { transaction } from '../lib/store';
import { prisma } from '../lib/db';
const [email,role]=process.argv.slice(2);
if(!email||!['STUDENT','REVIEWER','ADMIN'].includes(role))throw new Error('用法：pnpm account:role 邮箱 STUDENT|REVIEWER|ADMIN');
transaction(s=>{const u=s.users.find(u=>u.email===email.toLowerCase());if(!u)throw new Error('请先在网页注册该账号');u.role=role as typeof u.role;s.audits.push({id:crypto.randomUUID(),actorId:'operator-cli',action:'SET_ROLE',entityId:u.id,details:{role},createdAt:new Date().toISOString()});})
 .then(()=>console.log('角色已更新'))
 .catch(e=>{console.error((e as Error).message);process.exitCode=1;})
 .finally(()=>prisma.$disconnect());

