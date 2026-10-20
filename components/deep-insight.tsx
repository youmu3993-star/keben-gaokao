'use client';
import { ArrowRight,ChevronRight,FileSearch,Lightbulb,BookOpen } from 'lucide-react';
import { paragraphs,type Annotation,type Category } from '@/lib/content';
import { deepGuides,readingSteps,type InsightTab } from '@/lib/deep-content';
import { learningCues } from '@/lib/learning-cues';
import { seedQuestions } from '@/lib/exams';
import type { ExamQuestion,Paper } from '@/lib/types';
type Props={annotation:Annotation;tab:InsightTab;transfer:Category;onTransfer:(kind:Category)=>void;onPractice:(kind:Category)=>void;questions:ExamQuestion[];papers:Paper[];onQuestion:(question:ExamQuestion)=>void};
const categories:Category[]=['文言阅读','名句默写','作文应用'];
export default function DeepInsight({annotation:a,tab,transfer,onTransfer,onPractice,questions,papers,onQuestion}:Props){
 const guide=deepGuides[a.id];
 const cue=learningCues[a.id];
 const curated=guide.connections.flatMap(link=>{const q=questions.find(q=>q.id===link.questionId),seed=seedQuestions.find(s=>s.id===link.questionId);return q&&q.title===seed?.title?[{link,q,p:papers.find(p=>p.id===q.paperId)}]:[];});
 const known=new Set(curated.map(x=>x.q.id));
 const imported=questions.filter(q=>q.annotationIds.includes(a.id)&&!known.has(q.id)).map(q=>({q,p:papers.find(p=>p.id===q.paperId),link:{relation:'管理员标注的课内关联',focus:q.title,explanation:q.learningAnalysis||'管理员把这道题与此处课文关联；请对照设问与原卷，再判断能迁移哪一种方法。'}}));
 const connections=[...curated,...imported];
 return <div className={`insight-body deep-insight theme-${tab}`} role="tabpanel" aria-label={`${a.phrase} · ${{meaning:'释义',exam:'考点',role:'原文作用',transfer:'知识迁移'}[tab]}`}>
  <div className="dimension-label"><span className="dimension-dot"/>{{meaning:'原文解释',exam:'高考考点',role:'文章论证',transfer:'知识迁移'}[tab]}<small>{{meaning:'读懂字词与句意',exam:'从题源认识考法',role:'看懂为什么这样写',transfer:'把规律用到新情境'}[tab]}</small></div>
  {tab==='meaning'&&<>
   <section className="deep-section"><h4>关键字词，逐个拆开</h4><dl className="word-definitions">{guide.words.map(w=><div key={w.word}><dt>{w.word}</dt><dd>{w.explanation}</dd></div>)}</dl></section>
   <section className="learning-block"><h4>把整句译清楚</h4><p>{guide.translation}</p></section>
   <section className="deep-section"><h4>句式与前后关系</h4><p>{guide.syntax}</p></section>
   <div className="misread"><Lightbulb size={16}/><div><strong>留意这个区别</strong><p>{guide.mistake}</p></div></div>
  </>}
  {tab==='exam'&&<>
   <div className="source-label"><FileSearch size={15}/><span>考点提炼 · 本站教学解读</span></div>
   {connections.length?connections.map(({link,q,p})=><section className="exam-connection" key={q.id}>
    <div className="connection-meta"><span>{link.relation}</span><small>{p?.year} · {p?.name} · {q.number}</small></div>
    {p?.variant!=='标准版'&&<p className="connection-variant">{p?.variant}</p>}
    <h4>{link.focus}</h4>
    <div className="connection-status"><span>{q.verification==='VERIFIED'?'原卷已核验':'原卷待人工核验'}</span><span>{q.authorization==='APPROVED'?'已授权':q.authorization==='DENIED'?'禁止发布':'授权待确认'}</span></div>
    {q.body&&<blockquote className="connection-original">{q.body}</blockquote>}
    <details className="answer-reveal"><summary>我已定位，核对原句与考法</summary><p>{link.explanation}</p></details>
    <div className="connection-actions"><button onClick={()=>onQuestion(q)}>站内看原题与解析<ChevronRight size={13}/></button></div>
   </section>):<p className="no-direct-question">目前没有收录可追溯的关联题源。本句的语法与论证要点仍可用于阅读；不据此声称某年真题考过它。</p>}
   <section className="deep-section"><h4>高考会从这里考什么</h4><div className="focus-chips">{guide.focus.map((f,i)=><span key={f}><b>{i+1}</b>{f}</span>)}</div></section>
   <section className="deep-section"><h4>读题时，怎样找对应知识</h4><ol className="learning-steps"><li>先分清设问要你做什么：解释字词、翻译句子、定位默写，还是分析论证。</li><li>回到具体语境，找到本句的字词、前后关系和论据；别只写一个术语。</li><li>按设问组织表达：翻译要完整，默写要准确，论证分析要说明“怎样支持观点”。</li></ol></section>
   <p className="teaching-note">已收录的原题可直接在站内阅读；题源、版本和授权状态分别标明。本站拆解不是官方评分标准。</p>
  </>}
  {tab==='role'&&<>
   <section className="close-reading-cue"><span>先想，再看解析 · 本站原创追问</span><h4>{cue.question}</h4><details className="answer-reveal"><summary>核对原文证据与推论</summary><dl><dt>原文依据</dt><dd>{cue.evidence}</dd><dt>由此推出</dt><dd>{cue.inference}</dd><dt>容易误读</dt><dd>{cue.pitfall}</dd></dl></details></section>
   <details className="role-analysis"><summary>继续读：段落位置与完整论证链</summary>
   <section className="deep-section"><h4>在全文的哪个位置</h4><div className="paragraph-position">第 {a.paragraph+1} 段 <span>{['提出中心论点','说明学习的意义','说明学习的作用','说明学习的方法与态度'][a.paragraph]}</span></div></section>
   <section className="learning-block"><h4>这一句如何帮助文章说理</h4><p>{guide.roleExplanation}</p></section>
   <section className="deep-section"><h4>把论证关系串起来</h4><ol className="logic-chain">{guide.logic.map((step,i)=><li key={step}><span>{i+1}</span>{step}</li>)}</ol></section>
   <section className="deep-section"><h4>表达示例 · 本站教学参考</h4><p>{a.role} {guide.logic.length>1?`分析时，把“${guide.logic[0]}”与“${guide.logic[guide.logic.length-1]}”的关系说清，不能只报出修辞名称。`:''}</p></section>
   <details className="context-detail"><summary><BookOpen size={14}/>展开本段原文，核对上下文</summary><p>{paragraphs[a.paragraph]}</p></details>
   </details>
  </>}
  {tab==='transfer'&&<>
   <div className="transfer-tabs" aria-label="迁移方向">{categories.map(c=><button className={transfer===c?'active':''} aria-pressed={transfer===c} onClick={()=>onTransfer(c)} key={c}>{c}</button>)}</div>
   <div className={`transfer-content transfer-${categories.indexOf(transfer)}`}>
    <h4 className="transfer-title">换一个情境，仍然用得上</h4>
    {transfer==='文言阅读'?<>
     <section className="deep-section"><h4>能带走的阅读规律</h4><p>{a.transfer[transfer]}</p></section>
     <section className="deep-section"><h4>拿到新句，按这三步判断</h4><ol className="learning-steps">{readingSteps(a).map(step=><li key={step}>{step}</li>)}</ol></section>
     <section className="learning-block"><h4>换句试读 · 教学自拟句</h4><blockquote>{guide.reading.example}</blockquote><details className="answer-reveal"><summary>想过词义后，核对推断依据</summary><p>{guide.reading.explanation}</p></details></section>
    </>:transfer==='名句默写'?<>
     <section className="deep-section"><h4>先看情境，再找原句</h4><p>{guide.recite.prompt}</p><small className="example-label">原创情境提示 · 非高考题干</small></section>
     <details className="learning-block answer-reveal"><summary>先在心里写出原句，再核对答案</summary><blockquote>{guide.recite.answer}</blockquote></details>
     <section className="deep-section"><h4>这样记，才不容易写错</h4><p>{a.transfer[transfer]}</p><ol className="learning-steps"><li>圈出情境中的意思，与原句逐项对应；不要只靠熟悉的几个字猜。</li><li>注意本句与前后句的范围，核对通假字、形近字和易漏字。</li></ol></section>
    </>:<>
     <section className="deep-section"><h4>适合支持什么观点</h4><p>{a.transfer[transfer]}</p></section>
     <section className="learning-block"><h4>作文片段 · 本站原创示例</h4><blockquote>{guide.writing.example}</blockquote></section>
     <section className="deep-section"><h4>让引用站得住：逐层核对</h4><dl className="argument-map"><div><dt>原文机制</dt><dd>{cue.inference}</dd></div><div><dt>现实对照</dt><dd>{guide.writing.explanation}</dd></div><div><dt>适用边界</dt><dd>{cue.boundary}</dd></div></dl><p>动笔时先写自己的观点，再解释原文机制如何对应具体经历；若条件不同，主动说清限制。</p></section>
    </>}
    <div className="misread"><Lightbulb size={16}/><div><strong>迁移时别踩这个坑</strong><p>{guide.mistake}</p></div></div>
    {transfer!=='作文应用'&&<section className="transfer-boundary"><h4>这条理解用到哪里为止</h4><p>{cue.boundary}</p></section>}
   </div>
   <button className="text-link practice-link" onClick={()=>onPractice(transfer)}>自愿试一试 · 原创体验题<ArrowRight size={15}/></button>
  </>}
 </div>;
}

