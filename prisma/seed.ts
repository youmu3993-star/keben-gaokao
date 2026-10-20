import 'dotenv/config';
import { prisma } from '../lib/db';
import { initializeDatabase } from '../lib/store';
if(!process.env.DATABASE_URL)throw new Error('db:seed 需要 DATABASE_URL；演示存储会自动初始化。');
initializeDatabase().then(()=>console.log('卷别目录及来源档案已初始化；没有默认密码，没有授权真题题干。')).finally(()=>prisma.$disconnect());

