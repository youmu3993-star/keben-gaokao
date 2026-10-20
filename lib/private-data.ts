import { createCipheriv, createDecipheriv, createHash, randomBytes } from 'node:crypto';

const PREFIX='kg-private:v1';

export function isLocalPrivateMode(){return process.env.LOCAL_PRIVATE_MODE==='true';}

function encryptionKey(){
 const secret=process.env.LOCAL_DATA_KEY||'';
 if(secret.length<32)throw new Error('本机隐私模式需要 LOCAL_DATA_KEY，且长度至少为 32 个字符。');
 return createHash('sha256').update(secret,'utf8').digest();
}

export function encodePrivateData(value:unknown){
 const json=JSON.stringify(value);
 if(!isLocalPrivateMode())return json;
 const iv=randomBytes(12);
 const cipher=createCipheriv('aes-256-gcm',encryptionKey(),iv);
 const ciphertext=Buffer.concat([cipher.update(json,'utf8'),cipher.final()]);
 const tag=cipher.getAuthTag();
 return [PREFIX,iv.toString('base64'),tag.toString('base64'),ciphertext.toString('base64')].join(':');
}

export function decodePrivateData<T>(raw:string):T{
 if(!raw.startsWith(`${PREFIX}:`)){
  if(isLocalPrivateMode())throw new Error('发现未加密的本地数据文件；请先运行 scripts/setup-private-local.mjs 完成迁移。');
  return JSON.parse(raw) as T;
 }
 const parts=raw.split(':');
 if(parts.length!==5||parts[0]!=='kg-private'||parts[1]!=='v1')throw new Error('本地加密数据格式无效。');
 const [, ,ivText,tagText,cipherText]=parts;
 const decipher=createDecipheriv('aes-256-gcm',encryptionKey(),Buffer.from(ivText,'base64'));
 decipher.setAuthTag(Buffer.from(tagText,'base64'));
 const json=Buffer.concat([decipher.update(Buffer.from(cipherText,'base64')),decipher.final()]).toString('utf8');
 return JSON.parse(json) as T;
}

export function assertLocalRequest(url:URL){
 if(!isLocalPrivateMode())return;
 if(url.hostname!=='127.0.0.1'&&url.hostname!=='localhost')throw new Error('本机隐私模式只允许从 localhost 或 127.0.0.1 访问。');
}

