import { exercises } from './content';
import type { Store } from './types';
export function updateMastery(s:Store,userId:string) {
 const sums=new Map<string,{earned:number;max:number;count:number}>();
 for(const a of s.attempts.filter(a=>a.userId===userId)) {
  const reviewed=a.reviewStatus==='COMPLETED'&&a.finalPoints;
  if(!reviewed&&(a.assessment.mode==='DEMO'||a.assessment.reviewRequired))continue;
  const e=exercises.find(e=>e.id===a.exerciseId);if(!e)continue;
  const points=reviewed||a.assessment.points;
  for(const r of e.rubric){const p=points.find(p=>p.id===r.id);if(!p)continue;const v=sums.get(r.annotationId)||{earned:0,max:0,count:0};v.earned+=p.earned;v.max+=r.max;v.count++;sums.set(r.annotationId,v);}
 }
 s.masteries=s.masteries.filter(m=>m.userId!==userId);
 for(const [annotationId,v] of sums)s.masteries.push({id:`${userId}:${annotationId}`,userId,annotationId,evidenceCount:v.count,ratio:v.max?v.earned/v.max:0,updatedAt:new Date().toISOString()});
}

