'use client';
import { useState } from 'react';
import { examGuides, type ReadingScaffold } from '@/lib/exam-guides';
import { seedQuestions } from '@/lib/exams';
import { embeddedOriginals } from '@/lib/embedded-originals';
import type { ExamQuestion } from '@/lib/types';
import ExamCheck from './exam-check';

function Scaffold({ scaffold }: { scaffold: ReadingScaffold }) {
  return <section className="guide-scaffold" aria-label={scaffold.title}>
    <div className="guide-section-title"><span>{scaffold.kind}</span><h4>{scaffold.title}</h4></div>
    <p>{scaffold.purpose}</p>
    <div className={`scaffold-steps ${scaffold.kind === '对比图' ? 'compare' : ''}`}>
      {scaffold.items.map((item, index) => <div className="scaffold-step" key={`${item.label}-${index}`}>
        <b>{item.label}</b><span>{item.text}</span>
      </div>)}
    </div>
  </section>;
}

export function hasExamGuide(question: ExamQuestion) {
  const seed = seedQuestions.find(q => q.id === question.id);
  const original = embeddedOriginals[question.id];
  return Boolean(original && question.body === original.body && question.reference === original.reference && seed && seed.title === question.title && seed.paperId === question.paperId && seed.number === question.number && examGuides[question.id]);
}

export default function ExamGuide({ question }: { question: ExamQuestion }) {
  const guide = hasExamGuide(question) ? examGuides[question.id] : undefined;
  const [step, setStep] = useState(0);
  const [draft, setDraft] = useState('');
  const [revision, setRevision] = useState('');
  const [lockedDraft, setLockedDraft] = useState('');

  const advance = () => {
    if (step === 0) { setLockedDraft(draft.trim()); setRevision(draft.trim()); }
    setStep(value => Math.min(value + 1, 4));
  };

  const reveal = <section className="guide-reveal" aria-label="分步查看解析">
    <div className="guide-reveal-head"><strong>自己想 → 找依据 → 对照 → 修改</strong><span>{step + 1} / 5</span></div>
    <ol className="guide-reveal-track" aria-label="解析进度">{['先作答','题干提示','原文依据','评价要点','参考表达'].map((label, index) => <li key={label} className={index <= step ? 'active' : ''}>{label}</li>)}</ol>
    {step === 0 ? <><label className="form-label" htmlFor={`exam-draft-${question.id}`}>先写下你的判断（可跳过，不计分）</label><textarea id={`exam-draft-${question.id}`} value={draft} onChange={event => setDraft(event.target.value)} rows={3} maxLength={3000} placeholder={guide?.kind === 'essay' ? '这道作文题，你会怎样立意？试写一句中心判断。' : '先写答案，再想它对应题干的哪个词。'} /><p className="guide-reveal-note">这里的文字只留在当前页面，不上传，也不计入掌握度。</p></> : <>{lockedDraft && <div className="guide-first-draft"><b>我的初稿</b><p>{lockedDraft}</p></div>}{!lockedDraft && <p className="guide-reveal-note">本次跳过了初稿；仍可按需逐层查看解析。</p>}</>}
    {step >= 1 && <section className="guide-reveal-layer"><h4>① 题干提示</h4>{guide?.kind === 'objective' ? <><p>先圈题干里的这些限定词，想清它们分别指向对象、动作、结果还是原因：</p><ul>{guide.points.map(point => <li key={point.clue}><strong>{point.clue}</strong></li>)}</ul></> : guide?.kind === 'essay' ? <p>先确定题目在追问什么，再想《劝学》中的观点能解释其中哪一层；引用原句本身还不是论证。</p> : <p>先圈出题干的对象、动作和设问范围，再回题源核对。</p>}</section>}
    {step >= 2 && <section className="guide-reveal-layer"><h4>② 原文依据</h4>{guide ? <><blockquote>{guide.originalEvidence}</blockquote>{guide.kind === 'essay' ? <p>{guide.bridge}</p> : <div className="guide-evidence-list">{guide.points.map(point => <p key={point.clue}><b>{point.clue}</b> → {point.evidence}<small>{point.why}</small></p>)}</div>}</> : <p>这条档案尚无逐点核对的原文依据，请先查看题源。</p>}</section>}
    {step >= 3 && <section className="guide-reveal-layer"><h4>③ 本站自查要点</h4>{guide ? <ul>{guide.criteria.map(item => <li key={item}>{item}</li>)}</ul> : <p>逐点评价尚待编校，不能把未核验材料当作官方评分标准。</p>}<small>用于修改自己的答案，不代表原卷官方评分细则。</small></section>}
    {step >= 4 && <section className="guide-reveal-layer final"><h4>④ 参考表达</h4>{guide?.kind === 'essay' ? <><p><strong>一种立意：</strong>{guide.position}</p><blockquote>{guide.modelParagraph}</blockquote><p>另一条合理思路：{guide.alternate}</p></> : <><p className="guide-answer">{question.reference ?? (guide?.kind === 'objective' ? guide.answer : '尚无可核对的参考答案')}</p>{guide?.kind === 'objective' && <><p>{guide.modelExpression}</p><small>{guide.answerBasis}</small></>}</>}<small>本站学习示范，教师审阅待完成；不是唯一答案或官方评分标准。</small></section>}
    {step < 4 && <button className="primary-button guide-next" type="button" onClick={advance}>{['锁定初稿，查看提示','查看原文依据','查看自查要点','查看参考表达'][step]}</button>}
    {step >= 4 && <section className="guide-revision"><label className="form-label" htmlFor={`exam-revision-${question.id}`}>修改后的答案</label><textarea id={`exam-revision-${question.id}`} value={revision} onChange={event => setRevision(event.target.value)} rows={4} maxLength={3000} placeholder="把缺的依据或表达补进自己的答案。" /><div className="guide-revision-compare"><div><b>初稿</b><p>{lockedDraft || '本次未写初稿'}</p></div><div><b>修改稿</b><p>{revision.trim() || '还没有修改'}</p></div></div><p className="guide-reveal-note">比较两稿时，重点说清补了哪个依据或判断。此处修改不作为独立掌握证据。</p></section>}
  </section>;

  if (!guide) return <section className="teacher-guide guide-fallback"><h3>先试着作答，再核对</h3>{reveal}</section>;

  return <section className="teacher-guide" aria-label="逐点讲解">
    <header className="teacher-guide-header"><div><small>从题干走回原文</small><h3>{guide.kind === 'essay' ? '作文：从立意到一段表达' : '参考答案与逐点依据'}</h3></div><span>本站编写 · 教师审阅待完成</span></header>
    {reveal}
    {step >= 4 && <ExamCheck key={question.id} questionId={question.id} />}
    {step >= 2 && <details className="guide-scaffold-disclosure"><summary>需要时再看：{guide.scaffold.title}</summary><Scaffold scaffold={guide.scaffold} /></details>}
    {step >= 2 && <p className="guide-relation">{guide.relation}</p>}
    {!!guide.sources?.length && <details className="guide-sources"><summary>查看公开参考来源与审核边界</summary><ul>{guide.sources.map(source => <li key={source.url}><a href={source.url} target="_blank" rel="noreferrer">{source.title}</a><small>{source.note}</small></li>)}</ul></details>}
  </section>;
}

