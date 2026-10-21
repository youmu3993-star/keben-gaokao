import type { Metadata } from 'next';
import './globals.css';
import './deep-insight.css';
import './revision.css';
import './learning-modes.css';
import './theme-unified.css';
import './text-study.css';
export const metadata: Metadata = {title:'课本里的高考 · 从一篇课文，读懂一类考点',description:'以统编高中语文《劝学》为起点，连接文言阅读、名句默写与作文表达。'};
export default function RootLayout({children}:{children:React.ReactNode}) { return <html lang="zh-CN"><body>{children}</body></html>; }


