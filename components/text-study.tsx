'use client';

import { useState } from 'react';
import { ArrowRight, BookOpen, Check, ChevronDown, Sparkles } from 'lucide-react';
import { paragraphs } from '@/lib/content';
import { paragraphStudy, priorTextLinks } from '@/lib/text-study';
import { curatedTransfer, transferTargets, type TransferItem } from '@/lib/transfer-practice';

type Props = {
  aiAvailable: boolean;
  signedIn: boolean;
  onLogin: () => void;
  onAnnotation: (id: string) => void;
};

export default function TextStudy({ aiAvailable, signedIn, onLogin, onAnnotation }: Props) {
  const [targetId, setTargetId] = useState('jia');
  const [bankIndex, setBankIndex] = useState(0);
  const [exercise, setExercise] = useState<TransferItem>(() => curatedTransfer('jia'));
  const [draft, setDraft] = useState('');
  const [revealed, setRevealed] = useState(false);
  const [checked, setChecked] = useState<number[]>([]);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  const target = transferTargets.find(t => t.id === targetId)!;

  function reset(next: TransferItem, id = targetId) {
    setTargetId(id);
    setExercise(next);
    setDraft('');
    setRevealed(false);
    setChecked([]);
    setMessage('');
  }
  function chooseTarget(id: string) {
    setBankIndex(0);
    reset(curatedTransfer(id), id);
  }
  function nextCurated() {
    const next = bankIndex + 1;
    setBankIndex(next);
    reset(curatedTransfer(targetId, next));
  }
  async function generate() {
    if (!signedIn) { onLogin(); return; }
    setBusy(true);
    setMessage('');
    try {
      const response = await fetch('/api/transfer/generate', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ targetId }) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || '暂时无法生成');
      reset(data.exercise as TransferItem);
    } catch (error) {
      setMessage((error as Error).message + '；可先做本站预设练习。');
    } finally {
      setBusy(false);
    }
  }
  function togglePoint(index: number) {
    setChecked(current => current.includes(index) ? current.filter(x => x !== index) : [...current, index]);
  }

  return <section className="text-study" aria-label="课文注释与迁移练习">
    <div className="study-resources-heading">
      <span>读完原文之后</span>
      <h2>一处查清，再换一句用</h2>
      <p>注释按课文顺序放在这里；旧课文只挑能帮助辨义的例子。陌生句练习和全文翻译都可以按需打开。</p>
    </div>

    <section className="study-block" aria-labelledby="notes-heading">
      <div className="study-block-head"><div><small>01 · 查</small><h3 id="notes-heading">课文注释索引</h3></div><span>{paragraphStudy.reduce((total, section) => total + section.notes.length, 0)} 条 · 按原文顺序</span></div>
      <p className="study-source-note">以下覆盖本站所选四段的重点字词与句式，是本站重新撰写的释义，<strong>不是教材原注逐字转录</strong>；教材原注的版次与转载授权尚待逐条核对。</p>
      <div className="study-note-groups">
        {paragraphStudy.map((section, sectionIndex) => <details key={section.label} className="study-note-group" open={sectionIndex === 0}>
          <summary><span><b>0{sectionIndex + 1}</b>{section.label}</span><small>{section.notes.length} 条</small><ChevronDown size={18} aria-hidden="true"/></summary>
          <dl className="study-note-list">{section.notes.map((note, index) => <div key={section.label + note.term + index}>
            <dt>{note.term}<span>{note.kind}</span></dt>
            <dd>{note.explanation}{note.annotationId && <button type="button" onClick={() => onAnnotation(note.annotationId!)}>回原文定位 <ArrowRight size={13}/></button>}</dd>
          </div>)}</dl>
        </details>)}
      </div>
    </section>

    <section className="study-block" aria-labelledby="old-heading">
      <div className="study-block-head"><div><small>02 · 连</small><h3 id="old-heading">这个字，以前在哪见过？</h3></div><span>先对照词义，再看新语境</span></div>
      <p className="study-block-intro">篇名便于找回旧课文；不同年级的教材编排可能有差别。这里比的是词在句中的意思，不是背一个固定译法。</p>
      <div className="prior-text-grid">{priorTextLinks.map(link => <article key={link.id} className="prior-text-card">
        <div className="prior-text-top"><strong>{link.word}</strong><span className={link.relation === '不同' ? 'different' : ''}>{link.relation === '不同' ? '这次意思不同' : '意思相通'}</span></div>
        <div className="prior-text-line"><small>这篇《劝学》</small><p>{link.nowQuote}</p><b>{link.nowSense}</b></div>
        <div className="prior-text-line"><small>以前 · {link.oldTitle}</small><p>{link.oldQuote}</p><b>{link.oldSense}</b></div>
        <p className="prior-text-compare">{link.comparison}</p>
        <button type="button" onClick={() => onAnnotation(link.annotationId)}>回到《劝学》这句 <ArrowRight size={14}/></button>
      </article>)}</div>
    </section>

    <section className="study-block transfer-block" aria-labelledby="transfer-heading">
      <div className="study-block-head"><div><small>03 · 试</small><h3 id="transfer-heading">换一句，自己翻译</h3></div><span>可跳过 · 不计分</span></div>
      <p className="study-block-intro">先选一个字，再试译一句没见过的短句。对照时只看自己是否把字义和前后关系译对。</p>
      <div className="transfer-targets" role="group" aria-label="选择练习字词">{transferTargets.map(t => <button type="button" key={t.id} className={targetId === t.id ? 'active' : ''} aria-pressed={targetId === t.id} onClick={() => chooseTarget(t.id)}>{t.word}</button>)}</div>
      <div className="transfer-workspace">
        <div className="transfer-memory"><span>课内提示</span><strong>{target.anchor}</strong><small>{target.word}：{target.sense}</small></div>
        <div className="transfer-question"><span>{exercise.origin === 'CURATED' ? '本站自拟短句 · 非真题' : 'AI 即时自拟 · 未经教师审阅'}</span><p>{exercise.sentence}</p></div>
        <label htmlFor="transfer-answer">你会怎么译？</label>
        <textarea id="transfer-answer" value={draft} onChange={event => setDraft(event.target.value)} placeholder="先写下自己的译文。写不出来也可以直接看参考。" maxLength={500} rows={3}/>
        <div className="transfer-actions">
          <button type="button" className="primary-button" onClick={() => setRevealed(true)}>{draft.trim() ? '写好了，对照一下' : '直接看参考译文'} <ArrowRight size={15}/></button>
          <button type="button" className="secondary-button" onClick={nextCurated}>换一道预设练习</button>
          {aiAvailable && <button type="button" className="secondary-button" disabled={busy} onClick={() => void generate()}><Sparkles size={15}/>{busy ? '正在生成…' : signedIn ? 'AI 出新句' : '登录后 AI 出句'}</button>}
        </div>
        {!aiAvailable && <p className="transfer-availability">当前未配置 OpenAI 密钥；可继续使用本站预设短句，不会把预设内容冒称为 AI 即时生成。</p>}
        {message && <p className="transfer-message" role="status">{message}</p>}
        {revealed && <div className="transfer-feedback" aria-live="polite">
          {draft.trim() && <div className="transfer-own"><small>我的初稿</small><p>{draft}</p></div>}
          <div className="transfer-reference"><small>本站参考译文 · 合理表达不必逐字相同</small><p>{exercise.translation}</p></div>
          <strong>逐点看看自己译出了什么</strong>
          <div className="transfer-point-list">{exercise.points.map((point, index) => <button type="button" key={point} aria-pressed={checked.includes(index)} onClick={() => togglePoint(index)}><span>{checked.includes(index) ? <Check size={15}/> : index + 1}</span>{point}</button>)}</div>
          <p className="transfer-explanation">{exercise.explanation}</p>
          <small className="transfer-review-note">{exercise.origin === 'AI_DRAFT' ? 'AI 生成的句子和译文未经教师审阅；若句义或语法可疑，以课文和已核对资料为准。' : '自查仅帮助比较答案，不生成分数，也不写入知识掌握度。'}</small>
        </div>}
      </div>
    </section>

    <section className="study-block translation-block" aria-labelledby="translation-heading">
      <div className="study-block-head"><div><small>04 · 通</small><h3 id="translation-heading">全文白话对照</h3></div><span>四段完整译文</span></div>
      <details className="full-translation"><summary><BookOpen size={18}/>需要时展开逐段译文 <ChevronDown size={18}/></summary>
        <p className="study-source-note">译文由本站编写，用于先读通大意；遇到多义字，仍应回到原句和上方注释核对。</p>
        {paragraphStudy.map((section, index) => <article key={section.label} className="translation-pair"><h4>0{index + 1} · {section.label}</h4><div><section><small>原文</small><p>{paragraphs[index]}</p></section><section><small>白话译文</small><p>{section.translation}</p></section></div></article>)}
      </details>
    </section>
  </section>;
}

