export type TransferTarget = { id: string; word: string; sense: string; anchor: string; oldText: string };
export type TransferItem = {
  targetId: string;
  sentence: string;
  translation: string;
  points: string[];
  explanation: string;
  origin: 'CURATED' | 'AI_DRAFT';
};
export const transferTargets: TransferTarget[] = [
  { id: 'jia', word: '假', sense: '借助、利用', anchor: '善假于物也', oldText: '《送东阳马生序》“每假借于藏书之家”' },
  { id: 'jue', word: '绝', sense: '横渡', anchor: '而绝江河', oldText: '《三峡》“沿溯阻绝”' },
  { id: 'ji', word: '疾', sense: '声音强、宏大', anchor: '声非加疾也', oldText: '《三峡》“不以疾也”' },
  { id: 'zhi', word: '知', sense: '同“智”，智慧', anchor: '则知明而行无过矣', oldText: '《论语》十二章“知之者不如好之者”' },
  { id: 'she', word: '舍', sense: '停止、放弃', anchor: '锲而不舍', oldText: '《鱼我所欲也》“舍生而取义者也”' },
  { id: 'yu', word: '于', sense: '依据上下文判断来源或比较', anchor: '取之于蓝，而青于蓝', oldText: '同句中两个“于”用法不同' },
  { id: 'wuyi', word: '无以', sense: '没有用来……的办法', anchor: '无以至千里', oldText: '由“不……无以……”判断条件和结果' },
  { id: 'zhong', word: '中', sense: '符合', anchor: '木直中绳', oldText: '先看后面接的是否是准则' }
];
const item = (targetId: string, sentence: string, translation: string, points: string[], explanation: string): TransferItem => ({
  targetId, sentence, translation, points, explanation, origin: 'CURATED'
});
// 本站自拟短句。只作迁移练习，不冒充古籍原句或高考真题。
export const curatedTransfers: Record<string, TransferItem[]> = {
  jia: [
    item('jia', '学者假师友之言，以解其惑。', '求学的人借助老师和朋友的话，来解开自己的疑惑。', ['假＝借助，不是虚假', '以＝用来、以便', '其惑＝自己的疑惑'], '“假”后接可借助的言语；先判断动作对象，再译整句。'),
    item('jia', '客假舟以渡河，非其善水也。', '旅人借助船渡河，并不是因为他擅长游泳。', ['假舟＝借助船', '以渡河＝用来渡河', '善水＝擅长游泳'], '“船”是解决渡河问题的工具；不能把“假”译成真假。')
  ],
  jue: [
    item('jue', '客乘舟而绝河，日暮乃至。', '旅人乘船横渡河流，到了傍晚才抵达。', ['绝河＝横渡河流', '乃＝才', '日暮＝傍晚'], '把“河”作为动作对象，就能排除“断绝”义。'),
    item('jue', '舟小而河广，众人终绝之。', '船虽小、河虽宽，众人最终还是横渡了它。', ['绝之＝渡过它', '之指前面的河', '而在这里连接转折'], '这里的“绝”有渡过的对象，和《三峡》“阻绝”不同。')
  ],
  ji: [
    item('ji', '军士顺风而呼，声虽不疾，远者皆闻。', '士兵顺着风呼喊，声音虽然不宏亮，远处的人都听见了。', ['疾＝声音宏亮', '虽＝虽然', '远者＝远处的人'], '先看“疾”修饰的是“声”，再比较声音本身与传播效果。'),
    item('ji', '其声疾而辞清，众皆听之。', '他的声音洪亮，言辞也清楚，众人都听他说话。', ['声疾＝声音洪亮', '辞清＝话语清楚', '之指他说话的内容或行为'], '“声”限定了“疾”的语境义；不宜机械译为速度快。')
  ],
  zhi: [
    item('zhi', '日省其过，则知益明。', '每天反省自己的过错，智慧就会更加明达。', ['日＝每天', '省其过＝反省自己的过错', '知＝智慧'], '“知”与“明”搭配，指智慧明达，不是知道某一件事。'),
    item('zhi', '学而不省，知未必明。', '学习却不反省，智慧未必会明达。', ['而＝却', '省＝反省', '知＝智慧'], '和《劝学》“博学而日参省乎己”对照，保留学习与反省两层。')
  ],
  she: [
    item('she', '锲石而中途舍之，终无所得。', '雕刻石头却在中途停下来，最终不会有所收获。', ['锲＝雕刻', '舍之＝停止这件事', '终＝最终'], '“舍”的对象是雕刻这件事，不能按现代名词理解为房舍。'),
    item('she', '事虽难，勤行不舍。', '事情虽然困难，仍勤奋地做下去、不停下来。', ['虽＝虽然', '不舍＝不停止', '勤行＝勤奋地实行'], '把“不舍”接回前面的持续行动，句意才完整。')
  ],
  yu: [
    item('yu', '书得于友，见解深于前日。', '书从朋友那里得到，见解比从前更加深入。', ['得于友＝从朋友那里得到', '深于前日＝比以前深入', '两个“于”不能同译'], '前一个“于”引出来源，后一个引出比较对象。'),
    item('yu', '取法于师，而所成胜于师。', '向老师学习方法，最终取得的成果却胜过老师。', ['取法于师＝从老师那里学习方法', '胜于师＝比老师更好', '而＝却'], '用前后动词“取法”“胜”帮助判断两个“于”的关系。')
  ],
  wuyi: [
    item('wuyi', '不识其字，无以通其意。', '不认识那些字，就无法理解其中的意思。', ['无以＝无法', '通其意＝理解其中的意思', '前后是条件与结果'], '“无以”不是“没有因为”；先译前面的条件，再译结果。'),
    item('wuyi', '不察其由，无以定是非。', '不查明事情的缘由，就没有办法判断是非。', ['察其由＝查明缘由', '无以＝没有办法', '定是非＝判断是非'], '把“无以”带入整个句式，不要孤立背一个词。')
  ],
  zhong: [
    item('zhong', '木虽直，未必中规。', '木材虽然笔直，却未必符合圆规画出的弧度。', ['中＝符合', '规＝圆规', '虽＝虽然'], '“规”是标准，所以“中”读 zhòng，意思是符合。'),
    item('zhong', '其言中理，众皆服之。', '他的话符合道理，众人都信服。', ['中理＝合乎道理', '服＝信服', '之指他的话'], '看“中”后面的“理”，判断它表示合乎准则。')
  ]
};
export const curatedTransfer = (targetId: string, index = 0): TransferItem => {
  const bank = curatedTransfers[targetId] || curatedTransfers.jia;
  return bank[index % bank.length];
};

