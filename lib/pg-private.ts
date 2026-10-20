import { createCipheriv, createDecipheriv, createHash, randomBytes } from 'node:crypto';

const PREFIX = 'kg-db:v1';
const protectedFields: Record<string, string[]> = {
  users: ['email', 'name'],
  attempts: ['answer', 'assessment', 'finalPoints'],
  reviews: ['reason', 'points'],
  audits: ['details']
};

function key() {
  const secret = process.env.DATA_ENCRYPTION_KEY || '';
  if (secret.length < 32) throw new Error('PostgreSQL 模式需要长度至少 32 字符的 DATA_ENCRYPTION_KEY。');
  return createHash('sha256').update(secret, 'utf8').digest();
}

export function sealDbValue(value: unknown): string {
  const iv = randomBytes(12);
  const cipher = createCipheriv('aes-256-gcm', key(), iv);
  const bytes = Buffer.concat([cipher.update(JSON.stringify(value), 'utf8'), cipher.final()]);
  return [PREFIX, iv.toString('base64'), cipher.getAuthTag().toString('base64'), bytes.toString('base64')].join(':');
}

export function openDbValue<T>(raw: unknown): T {
  if (typeof raw !== 'string' || !raw.startsWith(`${PREFIX}:`)) throw new Error('数据库发现未加密的个人数据；请核对迁移和密钥。');
  const parts = raw.split(':');
  if (parts.length !== 5) throw new Error('数据库密文格式无效。');
  const decipher = createDecipheriv('aes-256-gcm', key(), Buffer.from(parts[2], 'base64'));
  decipher.setAuthTag(Buffer.from(parts[3], 'base64'));
  return JSON.parse(Buffer.concat([decipher.update(Buffer.from(parts[4], 'base64')), decipher.final()]).toString('utf8')) as T;
}

export function sealDbRow(table: string, row: Record<string, unknown>) {
  const data = { ...row };
  for (const field of protectedFields[table] || []) if (data[field] !== null && data[field] !== undefined) data[field] = sealDbValue(data[field]);
  return data;
}

export function openDbRow(table: string, row: Record<string, unknown>) {
  const data = { ...row };
  for (const field of protectedFields[table] || []) if (data[field] !== null && data[field] !== undefined) data[field] = openDbValue(data[field]);
  return data;
}

export function assertDbEncryptionKey() { key(); }

