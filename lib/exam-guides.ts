/** 本站编写的学习示范。公开点评只供审题参考，不代表点评教师审阅或认可本站文字。 */
export type GuideSource = { title: string; url: string; note: string };
export type ReadingScaffold = {
  kind: '分类图' | '对比图' | '过程图';
  title: string;
  purpose: string;
  items: { label: string; text: string }[];
};
type GuideBase = {
  originalEvidence: string;
  relation: string;
  scaffold: ReadingScaffold;
  sources?: GuideSource[];
};
export type ObjectiveGuide = GuideBase & {
  kind: 'objective';
  answer: string;
  answerBasis: string;
  points: { clue: string; evidence: string; why: string }[];
  modelExpression: string;
  criteria: string[];
};
export type EssayGuide = GuideBase & {
  kind: 'essay';
  position: string;
  bridge: string;
  modelParagraph: string;
  criteria: string[];
  alternate: string;
};
export type ExamGuide = ObjectiveGuide | EssayGuide;

export const examGuides: Record<string, ExamGuide> = {
  '2016-I-10-1': {
    kind: 'objective', answer: '上食埃土，下饮黄泉', answerBasis: '用户提供试卷资料附参考答案；正式原卷与评分说明待核验。',
    originalEvidence: '蚓无爪牙之利，筋骨之强，上食埃土，下饮黄泉，用心一也。',
    relation: '原句考查：题干要的是蚯蚓取得的结果，而非先天条件或最后的原因。',
    points: [
      { clue: '“身体柔弱”', evidence: '蚓无爪牙之利，筋骨之强', why: '这是对照线索，帮助找到蚯蚓段，不是设空答案。' },
      { clue: '“却能……”', evidence: '上食埃土，下饮黄泉', why: '设空落在行为与结果；两句都要写，字形逐字核对。' },
      { clue: '“用心专一”', evidence: '用心一也', why: '这是原因，能校验定位，但不要把它添进两空。' }
    ],
    modelExpression: '题干说“却能”，先找蚯蚓做到了什么，再写“上食埃土，下饮黄泉”。',
    criteria: ['两空与设问范围一致', '“埃”“黄泉”字形准确', '不把条件句或原因句写入答案'],
    scaffold: { kind: '分类图', title: '把同一句分成三类', purpose: '先判题干问条件、结果，还是原因。', items: [
      { label: '条件', text: '无爪牙之利，筋骨之强' }, { label: '结果', text: '上食埃土，下饮黄泉' }, { label: '原因', text: '用心一也' }
    ] }
  },
  '2019-I-13': {
    kind: 'objective', answer: '①于是他们诋毁贾谊说：“这个洛阳人，年纪轻、学识浅，只想独揽权力，把各种事情弄得纷乱。”\n②贾谊多次上书，说有的诸侯封地连接几个郡，不符合古代制度，可以逐渐削减他们的封地。',
    answerBasis: '本站据题干和公开解析编写的参考译文；不是已核验的官方答案或逐字评分标准。',
    originalEvidence: '乃短贾生曰……专欲擅权，纷乱诸事。／贾生数上疏……诸侯或连数郡……可稍削之。',
    relation: '方法迁移：本题出自《史记》，并未考《劝学》原句；课内可练“看语境定词义、补全句中关系”。',
    points: [
      { clue: '乃短贾生', evidence: '乃、短', why: '补出前文主语；“乃”表承接，“短”是诋毁、说坏话。' },
      { clue: '专欲擅权，纷乱诸事', evidence: '擅权、纷乱', why: '译出独揽权力，以及使事情纷乱的动作关系。' },
      { clue: '数、或、稍、削之', evidence: '贾生数上疏……诸侯或连数郡……可稍削之', why: '分别落为多次、有的、逐渐，并交代削减的是封地。' }
    ],
    modelExpression: '先译“谁做什么”，再把“数／或／稍”逐一放回句中，最后通读人物和事件是否连贯。',
    criteria: ['两句均交代清楚人物与动作', '重点实词结合语境译出', '补足省略成分但不添加原文没有的结论'],
    scaffold: { kind: '过程图', title: '翻译时走三步', purpose: '课内方法能迁移，不能把课内词句当成这道题的原文。', items: [
      { label: '定主体', text: '谁在说、谁在上书' }, { label: '落词义', text: '短／擅／数／或／稍' }, { label: '通句意', text: '核对动作对象和因果' }
    ] },
    sources: [{ title: '2019 全国Ⅰ卷题目与译文参考', url: 'https://www.szxuexiao.com/zuoti/html/1332.html', note: '二级公开解析，仅作交叉参考' }]
  },
  '2020-II-16-1': {
    kind: 'objective', answer: '輮以为轮；輮使之然也', answerBasis: '用户提供试卷资料附参考答案；正式原卷与评分说明待核验。',
    originalEvidence: '木直中绳，輮以为轮，其曲中规。虽有槁暴，不复挺者，輮使之然也。',
    relation: '原句考查：第一空问加工动作，第二空问“不复挺”的原因。',
    points: [
      { clue: '“就会弯曲到符合圆规的标准”', evidence: '輮以为轮，其曲中规', why: '“輮以为轮”是使木材弯曲的动作，填第一空。' },
      { clue: '“因为……”', evidence: '不复挺者，輮使之然也', why: '“輮使之然也”直接解释不再挺直的原因，填第二空。' },
      { clue: '“再经曝晒”', evidence: '虽有槁暴', why: '这是帮助定位的条件，不在两处设空范围内。' }
    ],
    modelExpression: '第一空找“怎样加工”，第二空找“为什么不再挺直”，分别回填动作与成因。',
    criteria: ['两空先后顺序正确', '“輮”的字形按所用教材版次核对', '不把“虽有槁暴”当成设空答案'],
    scaffold: { kind: '过程图', title: '木材变化的因果链', purpose: '过程图只帮助定位，不替代逐字核对原文。', items: [
      { label: '起点', text: '木直中绳' }, { label: '加工', text: '輮以为轮' }, { label: '结果', text: '虽有槁暴，不复挺' }, { label: '成因', text: '輮使之然也' }
    ] }
  },
  '2022-I-OLD-17-1': {
    kind: 'objective', answer: '驽马十驾，功在不舍', answerBasis: '用户提供旧课标版试卷资料附参考答案；原卷版本与评分说明仍待核验。',
    originalEvidence: '骐骥一跃，不能十步；驽马十驾，功在不舍。',
    relation: '原句考查：题干限定“劣马的执着”，落在对比的后半句。',
    points: [
      { clue: '“劣马”', evidence: '驽马', why: '先锁定对象，排除“骐骥”。' },
      { clue: '“执着／持之以恒”', evidence: '十驾，功在不舍', why: '“十驾”写持续行动，“不舍”点明坚持。' },
      { clue: '“两句”', evidence: '驽马十驾，功在不舍', why: '写完整对比后半句，不顺手补上“锲而不舍”。' }
    ],
    modelExpression: '抓“劣马”先定驽马，再抓“执着”确认“不舍”，最后写完整两句。',
    criteria: ['确认 2022 旧课标版', '“驽”“驾”字形准确', '不误填骐骥或锲而不舍'],
    scaffold: { kind: '对比图', title: '同段两匹马，题干指向不同', purpose: '先看题干对象，再决定填对比的哪一边。', items: [
      { label: '骐骥', text: '一跃 → 不能十步' }, { label: '驽马', text: '十驾 → 功在不舍' }
    ] }
  },
  '2023-I-14': {
    kind: 'objective', answer: '赵襄子奖赏有功之臣时，孔子已经去世多年，不可能对此事表示赞许；子鲋据这一时间先后矛盾批驳韩非。',
    answerBasis: '本站据公开解析编写的参考作答；原卷材料尚未站内完整展示，正式答案待核验。',
    originalEvidence: '题目所附两则材料须结合“赵襄子赏赐群臣”与孔子去世的时间先后阅读。',
    relation: '方法迁移：本题并未考《劝学》；可迁移“找事实依据，再说明它如何推翻对方说法”的阅读方法。',
    points: [
      { clue: '“事实依据”', evidence: '赵襄子赏赐群臣与孔子去世的时间', why: '要报出可核对的史事和时间关系，不能只写“韩非错了”。' },
      { clue: '“批驳韩非”', evidence: '孔子无法在身后赞许此事', why: '点出时间矛盾如何使韩非的说法不成立。' }
    ],
    modelExpression: '子鲋依据事件发生与孔子去世的先后：奖赏发生时孔子已去世多年，因此“孔子赞许”的记述不可能成立。',
    criteria: ['写明两个时间事实', '说明事实怎样反驳韩非', '不把课内《劝学》例句写成该题原文'],
    scaffold: { kind: '对比图', title: '把两种说法摆在一起', purpose: '主观简答题要写出矛盾如何成立。', items: [
      { label: '韩非所述', text: '孔子赞许赵襄子赏赐' }, { label: '子鲋所据', text: '赏赐发生时孔子已去世' }, { label: '判断', text: '时间冲突 → 记述难成立' }
    ] },
    sources: [{ title: '2023 新课标Ⅰ卷公开解析参考', url: 'https://www.yeyulingfeng.com/wendang/91874.html', note: '二级公开解析，仅作交叉参考' }]
  },
  '2024-I-23': {
    kind: 'essay',
    position: '答案更容易获得，不等于问题自然减少。旧问题可能很快解决，新的、更深的问题仍要由人发现和判断。',
    originalEvidence: '《劝学》：“君子生非异也，善假于物也。”前文以登高、顺风、舆马、舟楫说明借助外物能扩展人的能力。',
    relation: '作文迁移：这句只提供“借助工具”的论据角度；原题真正追问的是“我们的问题是否会越来越少”。《劝学》并未谈人工智能。',
    bridge: '先回答题目，再引用“善假于物”解释工具如何帮助求知；继续追问：答案到手后，哪些判断、核验与新问题仍需人来完成？',
    modelParagraph: '答案来得快，并不意味着问题会消失。查阅工具能告诉我“假”有“借助”之意，却不能替我判断《劝学》为什么连续写登高、顺风、舆马与舟楫。把现成解释放回原文核对时，我会追问：这些例子都改变了什么条件，又为何归结为“善”？荀子说“君子生非异也，善假于物也”，可见借力的价值在于人的选择与运用。技术缩短了寻找信息的时间，也给认真提问留下了更多空间。',
    criteria: ['我明确回应了“问题会不会越来越少”，而非泛谈 AI 好坏', '我说清“善假于物”能证明借助工具，却不能单独证明问题数量的变化', '我用一个具体情境说明：工具解决了什么，人还需判断什么'],
    alternate: '也可以主张某些重复性问题确实减少，再讨论新问题如何出现；只要始终回应题干、论据具体且推理自洽，就不必照搬示范观点。',
    scaffold: { kind: '过程图', title: '把引用与观点之间的推理补上', purpose: '先说课文能证明什么，再用具体情境回答作文题；它只是按需回看的提示。', items: [
      { label: '作文题', text: '答案快了，问题会变少吗？' }, { label: '课文能证明', text: '善假于物：人借助外物扩大能力' }, { label: '具体情境', text: '查到“假”的词义，还要核对上下文' }, { label: '回题目', text: '旧问题可解，解释是否成立仍需判断' }
    ] },
    sources: [
      { title: '教育部教育考试院 · 2024 作文试题解析', url: 'https://fx.xwapp.moe.gov.cn/article/202406/6662af88813bc8035af97f4e.html', note: '公开命题解读；不提供本站范文审核' },
      { title: '广州五中语文教师刘继斌 · 公开审题点评', url: 'https://finance.sina.com.cn/tech/roll/2024-06-08/doc-inaxxupq3818651.shtml', note: '公开报道中的教师观点；该教师未审阅本站示范' },
      { title: '深圳新闻网 · 陈冬平教师点评', url: 'https://www.sznews.com/news/content/mb/2024-06/07/content_31003329.htm', note: '公开教师点评；不代表该教师审阅本站示范' },
      { title: '羊城晚报 · 广州师生作文与点评', url: 'https://ep.ycwb.com/epaper/ycwb/html/2024-06/17/content_8_651660.htm', note: '公开师生作品与点评；本站未转载范文' }
    ]
  },
  '2026-II-17-1': {
    kind: 'objective', answer: '骐骥一跃，不能十步', answerBasis: '用户提供试卷与答案资料；正式原卷及授权状态待核验。',
    originalEvidence: '骐骥一跃，不能十步；驽马十驾，功在不舍。',
    relation: '原句考查：题干只提示“骏马”，应选对比前半句。',
    points: [
      { clue: '“骏马”', evidence: '骐骥', why: '先辨认对象；“驽马”是劣马。' },
      { clue: '“用骏马说理”', evidence: '骐骥一跃，不能十步', why: '把对象所在的完整两句写出，不补后半句。' }
    ],
    modelExpression: '“骏马”对应骐骥，写“骐骥一跃，不能十步”。与 2022 年旧课标版的“劣马”提示相反。',
    criteria: ['“骐骥”字形准确', '不误写“驽马十驾”', '按本卷题干设空范围作答'],
    scaffold: { kind: '对比图', title: '同一段，两个题干方向相反', purpose: '让题干限定词决定答案，不靠模糊印象。', items: [
      { label: '骏马', text: '骐骥一跃，不能十步' }, { label: '劣马', text: '驽马十驾，功在不舍' }
    ] }
  }
};

