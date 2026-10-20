'use client';
import { ArrowRight,BookMarked,Compass } from 'lucide-react';
import { methodCards,revisionSections } from '@/lib/revision';
import type { Annotation } from '@/lib/content';

type Props={onSelect:(annotation:Annotation,tab:'meaning'|'exam'|'role'|'transfer')=>void;annotations:Annotation[]};
export default function RevisionGuide({onSelect,annotations}:Props){
 const go=(id:string,tab:'meaning'|'exam'|'role'|'transfer')=>{const a=annotations.find(a=>a.id===id);if(a)onSelect(a,tab);};
 return <section className="revision-guide" aria-label="复习速览">
  <div className="revision-heading"><span><BookMarked size={17}/>复习速览 · 先抓四段论证</span><p>这四张卡对应教材选文的四段结构，是阅读路线，不是只需背四个考点。先试着回答卡片的问题，再点进原句核对证据；真题频次另按已核验档案统计。</p></div>
  <div className="revision-grid">{revisionSections.map((item,i)=><button key={item.label} onClick={()=>go(item.annotationId,'role')}><small>0{i+1} · {item.label}</small><strong>{item.summary}</strong><span>{item.check}</span><em>{item.trap}</em><ArrowRight size={15}/></button>)}</div>
  <div className="method-triad"><span>第四段还要分清三种方法：</span><button onClick={()=>go('kui','role')}>积累 · 小步怎样通向千里</button><button onClick={()=>go('nu','role')}>坚持 · 为什么“功在不舍”</button><button onClick={()=>go('yi2','role')}>专一 · 蚯蚓与蟹的对比</button></div>
  <details className="method-lookup"><summary><Compass size={16}/>按题型查漏：遇到具体问题时再展开<span>7 种作答动作</span></summary><div className="method-grid">{methodCards.map(m=><button key={m.title} onClick={()=>go(m.annotationId,'transfer')}><strong>{m.title}</strong><span>{m.action}</span><small>回到《劝学》例句 <ArrowRight size={12}/></small></button>)}</div><p>题型、题号和分值依具体原卷。可参考用户提供的<a href="https://fcfabff851e1429caa0129c2b360e181.app.workbuddy.host/" target="_blank" rel="noreferrer">文言文复习网页</a>，本页方法已按课文语境重新整理。</p></details>
 </section>;
}

