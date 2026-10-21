import OpenAI from 'openai';
import { zodTextFormat } from 'openai/helpers/zod';
import { z } from 'zod';
import { paragraphs } from './content';
import { type TransferItem, type TransferTarget } from './transfer-practice';

const generated = z.object({
  sentence: z.string(),
  translation: z.string(),
  points: z.array(z.string()),
  explanation: z.string()
});

export async function generateTransfer(target: TransferTarget): Promise<TransferItem> {
  if (!process.env.OPENAI_API_KEY) throw new Error('AI 出句暂未启用');
  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY, timeout: 25000, maxRetries: 1 });
  const response = await client.responses.parse({
    model: process.env.OPENAI_MODEL || 'gpt-4.1-mini',
    store: false,
    max_output_tokens: 450,
    input: [
      { role: 'system', content: '你为高中生自拟一条简短、合乎古汉语习惯的文言迁移练习。必须原创，不能伪称古籍引文或高考真题；目标词在句中必须采用指定含义。句子独立可读，避免歧义和生僻典故。提供通顺的现代汉语译文、2到3个可核对的翻译点，以及一句说明如何从搭配和上下文定词义。只输出结构化内容。' },
      { role: 'user', content: JSON.stringify({ word: target.word, requiredSense: target.sense, textbookAnchor: target.anchor, avoidCopying: paragraphs.join('') }) }
    ],
    text: { format: zodTextFormat(generated, 'transfer_sentence') }
  });
  const result = response.output_parsed;
  if (response.status !== 'completed' || !result) throw new Error('AI 未产生完整练习');
  const sentence = result.sentence.trim();
  const translation = result.translation.trim();
  const points = result.points.map(point => point.trim());
  const explanation = result.explanation.trim();
  if (sentence.length < 8 || sentence.length > 50 || !sentence.includes(target.word) || paragraphs.some(p => p.includes(sentence))) throw new Error('生成句子未通过基本校验');
  if (translation.length < 8 || translation.length > 180 || points.length < 2 || points.length > 3 || points.some(p => !p || p.length > 70) || !explanation || explanation.length > 150) throw new Error('生成解析未通过基本校验');
  return { targetId: target.id, sentence, translation, points, explanation, origin: 'AI_DRAFT' };
}

