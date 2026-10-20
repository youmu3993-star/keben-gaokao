import fs from 'node:fs';
import path from 'node:path';
import { decodePrivateData } from '../lib/private-data';

const filePath = path.resolve(process.env.DEMO_DATA_PATH || '.demo-data/store.enc');
const decoded = decodePrivateData(fs.readFileSync(filePath, 'utf8')) as Record<string, unknown>;

for (const key of ['users', 'sessions', 'attempts', 'reviews']) {
  if (!Array.isArray(decoded[key])) {
    throw new Error(`加密数据结构无效：缺少 ${key}`);
  }
}

console.log('本机加密数据验证通过（未输出任何学生内容）');

