import { createCipheriv, createHash, randomBytes } from 'node:crypto';
import { mkdir, readFile, rename, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';

const root=process.cwd();
const envPath=path.join(root,'.env.local');
let env='';
try{env=await readFile(envPath,'utf8');}catch(error){if(error.code!=='ENOENT')throw error;}

function current(name){return env.match(new RegExp(`^${name}=(.*)$`,'m'))?.[1]?.trim()||'';}
function set(name,value){const line=`${name}=${value}`;env=new RegExp(`^${name}=.*$`,'m').test(env)?env.replace(new RegExp(`^${name}=.*$`,'m'),line):`${env.trimEnd()}${env.trim()?"\n":""}${line}\n`;}

const secret=current('LOCAL_DATA_KEY')||randomBytes(32).toString('hex');
set('LOCAL_PRIVATE_MODE','true');
set('LOCAL_DATA_KEY',secret);
set('DATABASE_URL','');
set('DEMO_MODE','true');
set('DEMO_DATA_PATH','.demo-data/store.enc');
set('APP_ORIGIN','http://127.0.0.1:3000');
set('OPENAI_API_KEY','');
await writeFile(envPath,env,'utf8');

const source=path.join(root,'.demo-data','store.json');
const target=path.join(root,'.demo-data','store.enc');
let plaintext=null;
try{plaintext=await readFile(source,'utf8');}catch(error){if(error.code!=='ENOENT')throw error;}
if(plaintext!==null){
 JSON.parse(plaintext);
 try{await readFile(target,'utf8');throw new Error('加密目标已存在，未覆盖原数据。');}catch(error){if(error.code!=='ENOENT')throw error;}
 const iv=randomBytes(12),key=createHash('sha256').update(secret,'utf8').digest();
 const cipher=createCipheriv('aes-256-gcm',key,iv);
 const encrypted=Buffer.concat([cipher.update(plaintext,'utf8'),cipher.final()]);
 const encoded=['kg-private','v1',iv.toString('base64'),cipher.getAuthTag().toString('base64'),encrypted.toString('base64')].join(':');
 await mkdir(path.dirname(target),{recursive:true});
 const temp=`${target}.${process.pid}.tmp`;
 await writeFile(temp,encoded,'utf8');
 await rename(temp,target);
 await rm(source);
 console.log('已把本地学习数据迁移为 AES-256-GCM 加密文件。');
}else console.log('未发现旧的明文数据文件；已启用新的加密存储。');
console.log('本机密钥已写入 .env.local（该文件被 Git 忽略）。');

