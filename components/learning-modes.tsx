'use client';

import { ArrowRight, BookOpen, ShieldCheck } from 'lucide-react';
import { deepGuides } from '@/lib/deep-content';
import { learningCues } from '@/lib/learning-cues';
import { exercises, type Annotation, type Category } from '@/lib/content';
import { seedQuestions } from '@/lib/exams';
import type { ExamQuestion, Paper } from '@/lib/types';

export type StudyMode = 'quick' | 'question' | 'deep';
type Props = {
  annotation: Annotation;
  mode: StudyMode;
  questions: ExamQuestion[];
  papers: Paper[];
  onQuestion: (question: ExamQuestion) => void;
  onPractice: (kind: Category) => void;
};

const writingPoints = new Set(['yi', 'qing', 'xing', 'kui', 'qiji']);
const relationOrder = { '原句考查': 0, '同段定位': 1, '阅读方法迁移': 2, '作文迁移': 3 } as const;

export default function LearningModes({ annotation: a, mode, questions, papers, onQuestion, onPractice }: Props) {
  const guide = deepGuides[a.id];
  const cue = learningCues[a.id];
  const practice = exercises.find(e => e.rubric.some(point => point.annotationId === a.id) && e.kind !== '作文应用');
  const connections = guide.connections.flatMap(link => {
    const question = questions.find(q => q.id === link.questionId);
    const seed = seedQuestions.find(q => q.id === link.questionId);
    if (!question || question.title !== seed?.title) return [];
    return [{ link, question, paper: papers.find(p => p.id === question.paperId) }];
  }).sort((x, y) => relationOrder[x.link.relation] - relationOrder[y.link.relation]);
  const imported = questions.filter(q => q.annotationIds.includes(a.id) && !connections.some(c => c.question.id === q.id));
  const shortMistake = a.id === 'xing'
    ? '“生”按原文字形记；“假”在这里是借助，不是“虚假”。'
    : guide.mistake;

  if (mode === 'quick') return <div className="mode-content" role="tabpanel" id="mode-panel" aria-label="30 秒看懂">
    <div className="mode-eyebrow">01　先读懂原句</div>
    <h4>换成白话</h4>
    <p className="mode-translation">{guide.translation}</p>
    <h4>先记住这些字词</h4>
    <dl className="mode-words">{guide.words.slice(0, a.id === 'xing' ? 3 : 2).map(w => <div key={w.word}><dt>{w.word}</dt><dd>{w.explanation}</dd></div>)}</dl>
    <div className="mode-warning"><strong>易错提醒</strong><p>{shortMistake}</p></div>
    <p className="mode-end">读懂这些就可以继续读课文。</p>
  </div>;

  if (mode === 'question') return <div className="mode-content" role="tabpanel" id="mode-panel" aria-label="放进题里">
    <div className="mode-eyebrow">02　题里怎么用</div>
    <div className="mode-example">
      <span className="mode-example-label">{practice ? '原创体验题 · 非高考真题' : '原创情境提示 · 非高考真题'}</span>
      <h4>题目</h4>
      <p className="mode-prompt">{practice?.prompt ?? guide.recite.prompt}</p>
      <h4>直接看答案</h4>
      <p className="mode-answer">{practice?.reference ?? guide.recite.answer}</p>
      {practice && <ul className="mode-scoring">{practice.rubric.slice(0, 3).map(point => <li key={point.id}>{point.description}</li>)}</ul>}
      <p className="mode-answer-why"><b>答案从哪来：</b>{cue.evidence}</p>
    </div>
    {practice && <button className="mode-optional-button" onClick={() => onPractice(practice.kind)}>想自己写一次，再看逐点反馈 <ArrowRight size={16} /></button>}
    <section className="mode-sources">
      <h4>与真题的关系</h4>
      {connections.length || imported.length ? <>
        {connections.slice(0, 2).map(({ link, question, paper }) => <div className="mode-source" key={question.id}>
          <span className="mode-relation">{link.relation}</span>
          <b>{paper?.year} · {paper?.name} · 第 {question.number} 题</b>
          <small>{question.verification === 'VERIFIED' ? '原卷已核验' : '原卷待核验'} · {question.authorization === 'APPROVED' ? '已授权' : '授权待确认'}</small>
          <p>{link.explanation}</p>
          {question.body && <button onClick={() => onQuestion(question)}>站内看原题与解析 <ArrowRight size={14}/></button>}
        </div>)}
        {imported.slice(0, 1).map(question => <div className="mode-source" key={question.id}>
          <span className="mode-relation">管理员标注关联</span><b>{question.title}</b>
          <small>{question.verification === 'VERIFIED' ? '原卷已核验' : '原卷待核验'} · {question.authorization === 'APPROVED' ? '已授权' : '授权待确认'}</small>
          {question.body && <button onClick={() => onQuestion(question)}>站内看原题与解析 <ArrowRight size={14}/></button>}
        </div>)}
      </> : <p className="mode-no-source">目前没有收录可追溯的直接关联真题。上面的题目是本站原创示例。</p>}
      <p className="mode-source-note"><ShieldCheck size={14}/>“同段定位”或“方法迁移”不表示真题考过当前原句。</p>
    </section>
  </div>;

  return <div className="mode-content" role="tabpanel" id="mode-panel" aria-label="多想一步">
    <div className="mode-eyebrow">03　想知道为什么，再读这里</div>
    <h4 className="mode-deep-question">{cue.question}</h4>
    <div className="mode-reason"><span>回原文找依据</span><p>{cue.evidence}</p></div>
    <div className="mode-reason"><span>由依据推出什么</span><p>{cue.inference}</p></div>
    <div className="mode-boundary"><strong>用到哪里为止</strong><p>{cue.boundary}</p></div>
    {guide.logic.length > 1 && <details className="mode-more"><summary><BookOpen size={15}/>展开完整论证链</summary><ol>{guide.logic.map(step => <li key={step}>{step}</li>)}</ol></details>}
    {writingPoints.has(a.id) && <details className="mode-more"><summary>这句适合积累到作文里吗？</summary><p>{guide.writing.example}</p><small>本站原创表达示例。引用时要说明原文观点与具体情境的关系，不把它当万能素材。</small></details>}
  </div>;
}

