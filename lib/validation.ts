import { z } from 'zod';
import { papers } from './exams';
import { annotations } from './content';
const https=z.string().url().refine(s=>new URL(s).protocol==='https:','来源必须是 HTTPS 链接');
export const questionInput=z.object({id:z.string().min(1).max(120),paperId:z.string().refine(v=>papers.some(p=>p.id===v),'未知卷别'),number:z.string().min(1).max(40),category:z.enum(['文言阅读','名句默写','作文应用']),title:z.string().min(1).max(200),sourceUrl:https,sourceTitle:z.string().min(1).max(200),body:z.string().max(20000).nullable(),reference:z.string().max(10000).nullable(),annotationIds:z.array(z.string().refine(id=>annotations.some(a=>a.id===id))).max(30),knowledgePoints:z.array(z.string().trim().min(1).max(40)).max(15).default([]),learningAnalysis:z.string().trim().max(4000).nullable().default(null),commonMistake:z.string().trim().max(2000).nullable().default(null)}).strict();
export const accountInput=z.object({email:z.string().email().max(200).transform(v=>v.trim().toLowerCase()),password:z.string().min(10,'密码至少 10 个字符').max(128),name:z.string().trim().min(1).max(40).optional()}).strict();

