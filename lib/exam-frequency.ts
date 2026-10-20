import type { ExamQuestion,Paper } from './types';

// 只报告已核验档案的样本内复现，永远不推断全部高考试卷的出题概率。
export function verifiedFrequency(questions:ExamQuestion[],papers:Paper[]){
 const paperYear=new Map(papers.map(p=>[p.id,p.year]));
 const stats=new Map<string,{questions:number;years:Set<number>}>();
 for(const q of questions){
  if(q.verification!=='VERIFIED'||!q.verificationEvidence||!q.verifiedBy||!q.verifiedAt)continue;
  const year=paperYear.get(q.paperId);if(!year)continue;
  for(const point of new Set(q.knowledgePoints||[])){
   const item=stats.get(point)||{questions:0,years:new Set<number>()};
   item.questions++;item.years.add(year);stats.set(point,item);
  }
 }
 return [...stats].map(([point,item])=>({point,questions:item.questions,years:item.years.size})).sort((a,b)=>b.years-a.years||b.questions-a.questions||a.point.localeCompare(b.point,'zh-CN'));
}

