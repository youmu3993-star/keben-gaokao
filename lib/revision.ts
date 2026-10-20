import type { Category } from './content';

// 本站编写的课文复习路线。与真题样本频率分开，避免把教学选择冒充统计。
export const revisionSections=[
 {label:'先抓主张',summary:'学习不可停止',annotationId:'yi',check:'“已”在这里是什么意思？',trap:'勿译成“已经”。'},
 {label:'再看意义',summary:'学习能提升并改变人',annotationId:'rou',check:'木材为何“不复挺”？',trap:'分清“輮”的动作与结果。'},
 {label:'看清作用',summary:'借助外物扩大能力',annotationId:'xing',check:'车马、舟楫共同证明什么？',trap:'“假”是借助，“生”同“性”。'},
 {label:'最后记方法',summary:'积累、坚持、专一',annotationId:'kui',check:'“无以”怎样译？',trap:'避免只背名句，不解释因果。'}
] as const;

export const methodCards:{title:string;action:string;annotationId:string;category:Category}[]=[
 {title:'字词推断',action:'先看位置和搭配，再把词义放回句子检验。',annotationId:'jia',category:'文言阅读'},
 {title:'断句与句式',action:'找完整的主谓、修饰关系，再核对语意；虚词只是线索。',annotationId:'ding',category:'文言阅读'},
 {title:'文意判断',action:'把人物、时间、因果、范围分别回原文定位。',annotationId:'qing',category:'文言阅读'},
 {title:'句子翻译',action:'逐字落实关键词，补省略、调语序，再读通全句。',annotationId:'xing',category:'文言阅读'},
 {title:'主观概括',action:'按设问找句子，分点说明“原文证据→结论”。',annotationId:'sheng',category:'文言阅读'},
 {title:'情境默写',action:'用提示语定位原句，逐字核对通假和形近字。',annotationId:'nu',category:'名句默写'},
 {title:'作文迁移',action:'先立观点，再说明课文论据为何适用。',annotationId:'kui',category:'作文应用'}
];
export const priorityAnnotationIds=new Set(['yi','rou','bao','xing','kui','qiji','nu','ding']);
export const reviewLevelByPoint:Record<string,'字'|'词'|'句'|'篇'>={nature:'字',same:'词',borrow:'词',line1:'字',line2:'字',claim:'篇',quote:'字',example:'句',link:'篇'};

