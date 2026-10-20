'use client';
import { useState } from 'react';
import { examChecks, unavailableExamChecks } from '@/lib/exam-checks';

export default function ExamCheck({ questionId }: { questionId: string }) {
  const [selected, setSelected] = useState<string | null>(null);
  const check = examChecks[questionId];
  if (!check) return unavailableExamChecks[questionId] ? <aside className="exam-check-unavailable"><strong>这题暂不做理解检测</strong><p>{unavailableExamChecks[questionId]}</p></aside> : null;
  const chosen = check.options.find(option => option.id === selected);

  return <section className="exam-check" aria-label="一题看懂了吗">
    <div className="exam-check-heading"><span>自愿 · 约 30 秒</span><h4>看完答案，试着判断一次</h4></div>
    <p className="exam-check-goal">这次只检查：{check.goal}</p>
    <p className="exam-check-prompt">{check.prompt}</p>
    <div className="exam-check-options" role="group" aria-label="选择你的判断理由">
      {check.options.map(option => <button key={option.id} type="button" aria-pressed={selected === option.id} className={selected === option.id ? 'selected' : ''} onClick={() => setSelected(option.id)}><b>{option.id}</b><span>{option.text}</span></button>)}
    </div>
    {chosen && <div className={`exam-check-feedback ${chosen.id === check.correct ? 'correct' : 'revise'}`} aria-live="polite"><strong>{chosen.id === check.correct ? '这个理由站得住' : '这里容易混淆'}</strong><p>{chosen.feedback}</p><div><b>下一步</b><span>{chosen.nextStep}</span></div>{chosen.id === check.correct && <small>换个题干再想：{check.transfer}</small>}</div>}
    <small className="exam-check-note">本站原创理解检查，选项反映可能的误解，尚非真实学生错因统计；不计分，也不写入知识掌握度。</small>
  </section>;
}

