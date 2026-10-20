import type { Paper, ExamQuestion } from './types';
import { embeddedOriginals } from './embedded-originals';
export const papers:Paper[] = [];
// 用户提供的参考资料覆盖2015—2026；目录不代表题干已经收录。
for(let year=2015;year<=2026;year++) {
 const families = year<=2019?['LEGACY']:year===2020?['LEGACY','NEW']:year<=2024?['NEW']:['NATIONAL'];
 for(const family of families) for(const n of [1,2]) {
   const name=family==='LEGACY'?`${year<=2016?'新课标':'全国'}${n===1?'Ⅰ':'Ⅱ'}卷`:family==='NEW'?`${year>=2023?'新课标':'新高考'}${n===1?'Ⅰ':'Ⅱ'}卷`:`全国${n===1?'一':'二'}卷`;
   papers.push({id:`${year}-${family}-${n}`,year,name,family:family as Paper['family'],variant:'标准版',sourceUrl:null,note:'卷别目录已建；未收齐授权原卷。题号与题目独立核验，不由目录推定。'});
 }
}
papers.push({id:'2022-NEW-1-OLD',year:2022,name:'新高考Ⅰ卷',family:'NEW',variant:'旧课标版',sourceUrl:null,note:'名句默写存在课标版本差异；不得混用第17题。'});
// 真题种子保存档案元数据；七条固定资料原题的站内阅读摘录见 embedded-originals.ts。
const question=(id:string,paperId:string,number:string,category:ExamQuestion['category'],title:string,sourceUrl:string,sourceTitle:string,annotationIds:string[],verificationEvidence:string,knowledgePoints:string[],learningAnalysis:string,commonMistake:string):ExamQuestion=>({id,paperId,number,category,title,sourceUrl,sourceTitle,annotationIds,knowledgePoints,learningAnalysis,commonMistake,authorization:'UNKNOWN',authorizationEvidence:null,verification:'PENDING',verificationEvidence,verifiedBy:null,verifiedAt:null,body:null,reference:null,version:1});
export const seedQuestions:ExamQuestion[] = [
 question('2016-I-10-1','2016-LEGACY-1','10(1)','名句默写','《劝学》· 蚯蚓用心专一','https://tiku.baidu.com/tikupc/paperdetail/c6d288eb6294dd88d0d26b04?key=20170214','百度题库 · 2016 全国Ⅰ卷（二级存档）',['yi2','ding'],'用户提供的2016新课标Ⅰ卷空白卷PDF第5页出现《劝学》蚯蚓默写；该汇编页将小题重排为第4题，百度题库所载原卷题号为10(1)。需正式原卷核验。',['情境默写','词类活用与字形'],'题干以蚯蚓外在条件较弱、用心专一为线索；先在末段找到条件、结果和原因，再辨认题目要填的是“上食埃土，下饮黄泉”。原题已在站内展示；按提示语分清条件、结果和原因，再定位设空处。','不能误填“蚓无爪牙之利”等条件句；“埃”与“黄泉”要按课文字形核对。'),
 question('2019-I-13','2019-LEGACY-1','13','文言阅读','《史记·屈原贾生列传》句子翻译','https://cdn.gaokzx.com/zixunzhan/202403/161a0d0d-340f-4499-a73f-104c921fa64d.pdf','北京高考在线 · 2019 全国Ⅰ卷 PDF（二级存档）',['jia','ding'],'研究记录：PDF第8页13题。只是翻译方法的教学迁移，不是该题直接引用《劝学》。仍需教师对原卷签核。',['语境推断','文言翻译'],'先判断实词在句中的作用，再补出省略成分，核对整句的人物和事件。课内“假”的语境判断与“爪牙之利”的语序还原，是可迁移的方法；这道题并未直接考《劝学》。','不要把课内例句当成该题原句，也不要只写词义而遗漏整句关系。'),
 question('2020-II-16-1','2020-LEGACY-2','16(1)','名句默写','《劝学》· 木材加工与学习改变','https://gaokao.eol.cn/shiti/zhenti/202007/t20200708_1737320.shtml','中国教育在线 · 2020 全国Ⅱ卷（二级存档）',['rou','bao'],'已交叉查到来源线索；扫描原卷题号与字形仍需人工核验。',['情境默写','通假字与字形'],'看到木材被加工后改变形状的情境，先定位“木直中绳—輮以为轮—不复挺”的因果链，再回原文核对要填写的字句。原题设空已在站内展示，先按“加工过程—变化结果—变化原因”定位。','“虽有槁暴”是同段理解线索，不能据此认定它就是题目要求填写的答案。'),
 question('2022-I-OLD-17-1','2022-NEW-1-OLD','17(1)','名句默写','《劝学》· 劣马喻持之以恒','https://edu.sina.com.cn/gaokao/2022-06-08/doc-imizirau7276509.shtml','新浪教育 · 2022 新高考Ⅰ卷（二级存档）',['nu','qie'],'人民网转载考试院评析明确2022名句默写有新旧课标两版，《劝学》在旧课标版。二级存档不能当作官方原卷。',['情境默写','对比论证'],'从“资质与坚持”的语境辨认骐骥、驽马的对比，再核对对应原句和字形。题目属于旧课标版，使用时要先确认版本。','不能把旧课标版的《劝学》默写标到同年另一版本上；“锲而不舍”只是同段迁移。'),
 question('2023-I-14','2023-NEW-1','14','文言阅读','韩非与子鲋 · 论证比较','https://news.cctv.cn/2023/06/07/ARTIXCWzuuHC6HzA1kEQsC9k230607.shtml','央视网 · 教育考试院 2023 语文评析转载',['qing','qie'],'评析中的创新命题段落提及第14题。教学迁移关联，不是该题直接引用《劝学》。设问已对照用户提供的汇编 PDF 第7页转录；正式原卷与评分点仍待核验。',['论证比较','主观概括'],'先分别找到双方论据与结论，再解释推理环节的差别。《劝学》中的“青于蓝”和“锲而不舍”可练习这一分析过程；并非该题原文。','只报“用了对比论证”不足以回答比较类设问，应指出各自论据怎样支持结论。'),
 question('2024-I-23','2024-NEW-1','23','作文应用','答案与问题 · 技术与自主思考','https://static.nfnews.com/content/202406/08/c8975704.html','南方+ · 教育考试院 2024 语文解析转载',['xing','si'],'新课标I卷写作试题“答案与问题”第23题。善假于物的关联由本项目教学设计建立；无官方评分标准。',['作文审题','课内论据迁移'],'把“善假于物”用于讨论工具与人的关系时，先明确自己的问题，再解释工具如何帮助思考、何处仍需判断。这是本站提供的论据迁移建议，不代表官方立意或评分标准。','不要写成“用了工具就不必思考”；也不要把课文原句机械堆进作文。'),
 question('2026-II-17-1','2026-NATIONAL-2','17(1)','名句默写','《劝学》· 骐骥与驽马的对比','https://m.sohu.com/a/1063529710_121124323','2026 全国Ⅱ卷试题与分析转载（二级来源）',['qiji','nu'],'用户提供的2026全国Ⅱ卷试题PDF第6页、答案PDF第2页均出现第17(1)题；网络二级来源交叉核对。官方原卷与授权仍待确认。',['情境默写','对比论证','课内语境定位'],'题干以“骏马说理”为线索，应回到骐骥与驽马的对比，先判断骏马指“骐骥”，再定位“骐骥一跃，不能十步”。2022年旧课标版提示的是劣马，答案方向相反；两题并读能练习精确读取提示语。','把“骏马”看成“驽马”会误填另一半对比；注意“骐骥”的字形。')
];
const catalogSources:Record<number,string>={2019:'https://cdn.gaokzx.com/zixunzhan/202403/161a0d0d-340f-4499-a73f-104c921fa64d.pdf',2020:'https://www.moe.gov.cn/jyb_xwfb/s5147/202007/t20200708_470708.html',2021:'https://www.moe.gov.cn/jyb_xwfb/s5147/202106/t20210608_536477.html',2022:'https://edu.people.com.cn/n1/2022/0607/c1053-32440586.html',2023:'https://news.cctv.cn/2023/06/07/ARTIXCWzuuHC6HzA1kEQsC9k230607.shtml',2024:'https://static.nfnews.com/content/202406/08/c8975704.html',2025:'https://paper.people.com.cn/rmrb/pc/attachement/202506/08/5c9b4abc-e775-4f93-bdd8-00ed8c99a6b9.pdf',2026:'https://www.moe.gov.cn/jyb_xwfb/xw_zt/moe_357/2026/2026_zt08/mtbd/202606/t20260610_1440059.html'};
for(const p of papers)p.sourceUrl=catalogSources[p.year]??null;
export function canDisplayQuestion(q:ExamQuestion) { return q.authorization==='APPROVED' && !!q.authorizationEvidence && q.verification==='VERIFIED' && !!q.verificationEvidence && !!q.verifiedBy && !!q.verifiedAt; }
export function normalizeQuestion(q:ExamQuestion):ExamQuestion {const seeded=seedQuestions.find(s=>s.id===q.id);return {...q,knowledgePoints:q.knowledgePoints??seeded?.knowledgePoints??[],learningAnalysis:q.learningAnalysis===undefined?seeded?.learningAnalysis??null:q.learningAnalysis,commonMistake:q.commonMistake===undefined?seeded?.commonMistake??null:q.commonMistake};}
export function publicQuestion(question:ExamQuestion) {
 const q=normalizeQuestion(question),allowed=canDisplayQuestion(q);
 const seed=seedQuestions.find(s=>s.id===q.id);
 const excerpt=q.authorization!=='DENIED'&&q.verification!=='REJECTED'&&seed&&q.paperId===seed.paperId&&q.number===seed.number&&q.title===seed.title?embeddedOriginals[q.id]:undefined;
 return {...q,body:allowed?q.body??excerpt?.body??null:excerpt?.body??null,reference:allowed?q.reference??excerpt?.reference??null:excerpt?.reference??null,displayBasis:allowed&&q.body?'LICENSED' as const:excerpt?'USER_MATERIAL' as const:'RESTRICTED' as const,sourceLocator:excerpt?.locator??null};
}

