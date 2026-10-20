import { randomBytes, scryptSync, timingSafeEqual, createHash } from 'node:crypto';
import type { User } from './types';
import { transaction } from './store';
export class AppError extends Error { constructor(public status:number,message:string){super(message);} }
export function hashPassword(password:string){const salt=randomBytes(16).toString('hex');return `${salt}:${scryptSync(password,salt,64).toString('hex')}`;}
export function checkPassword(password:string,hash:string){const [salt,key]=hash.split(':');if(!salt||!key)return false;const expected=Buffer.from(key,'hex');const actual=scryptSync(password,salt,64);return expected.length===actual.length&&timingSafeEqual(expected,actual);}
export const tokenHash=(token:string)=>createHash('sha256').update(token).digest('hex');
export const newToken=()=>randomBytes(32).toString('hex');
export const publicUser=(u:User)=>({id:u.id,email:u.email,name:u.name,role:u.role,createdAt:u.createdAt});
export async function authenticate(token:string|undefined):Promise<User> {
 if(!token)throw new AppError(401,'请先登录，学习记录才能保存到你的账号。');
 return transaction(s=>{const session=s.sessions.find(x=>x.id===tokenHash(token)&&new Date(x.expiresAt)>new Date());const u=session&&s.users.find(x=>x.id===session.userId);if(!u)throw new AppError(401,'登录已过期，请重新登录。');return u;});
}
export function requireRole(u:User,roles:User['role'][]){if(!roles.includes(u.role))throw new AppError(403,'此操作需要教师复核或管理员权限。');}
export async function rateLimit(key:string,limit:number,windowMs:number){await transaction(s=>{const now=Date.now();s.rateBuckets=s.rateBuckets.filter(x=>new Date(x.resetAt).getTime()>now);let b=s.rateBuckets.find(x=>x.id===key);if(!b){b={id:key,count:0,resetAt:new Date(now+windowMs).toISOString()};s.rateBuckets.push(b);}if(b.count>=limit)throw new AppError(429,'操作较频繁，请稍后重试。');b.count++;});}

