import { test,expect } from '@playwright/test';

test('精读默认速懂，真题先作答后分层看解析',async({page})=>{
 await page.goto('/');
 await page.getByRole('button',{name:'君子生非异也，善假于物也',exact:true}).click();
 await expect(page.getByRole('tab',{name:'30 秒看懂'})).toHaveAttribute('aria-selected','true');
 await expect(page.getByText('君子的天性（禀赋）并没有什么不同，只是善于借助外物罢了。')).toBeVisible();
 await page.getByRole('tab',{name:'放进题里'}).click();
 await expect(page.getByText('原创体验题 · 非高考真题')).toBeVisible();
 await expect(page.getByRole('heading',{name:'直接看答案'})).toBeVisible();
 await expect(page.getByText('“生”同“性”，译为天性或禀赋')).toBeVisible();
 await page.getByRole('tab',{name:'多想一步'}).click();
 await expect(page.getByText('回原文找依据')).toBeVisible();
 await expect(page.getByText('由依据推出什么')).toBeVisible();
 await page.getByText('展开完整论证链').click();
 await expect(page.getByText('禀赋并无特别')).toBeVisible();
 await page.getByRole('button',{name:'真题档案',exact:true}).click();
 const caseCard=page.locator('.case-pair article').first();
 await expect(caseCard.locator('.case-prompt')).toBeVisible();
 await expect(caseCard.locator('.case-answer')).toHaveCount(0);
 await page.locator('.exam-row').filter({has:page.getByRole('heading',{name:'答案与问题 · 技术与自主思考'})}).getByRole('button',{name:'先作答，再看解析'}).click();
 await expect(page.getByLabel('先写下你的判断（可跳过，不计分）')).toBeVisible();
 await expect(page.getByRole('heading',{name:'④ 参考表达'})).toHaveCount(0);
 await page.getByLabel('先写下你的判断（可跳过，不计分）').fill('答案来得快，问题未必减少。');
 await page.getByRole('button',{name:'锁定初稿，查看提示'}).click();
 await expect(page.getByText('答案来得快，问题未必减少。')).toBeVisible();
 await page.getByRole('button',{name:'查看原文依据'}).click();
 await page.getByRole('button',{name:'查看自查要点'}).click();
 await page.getByRole('button',{name:'查看参考表达'}).click();
 await expect(page.getByRole('heading',{name:'④ 参考表达'})).toBeVisible();
 await expect(page.getByLabel('修改后的答案')).toBeVisible();
 await expect(page.getByText('本站编写 · 教师审阅待完成')).toBeVisible();
 await expect(page.getByRole('heading',{name:'看完答案，试着判断一次'})).toBeVisible();
 await page.locator('.exam-check-options button').first().click();
 await expect(page.getByText('这里容易混淆')).toBeVisible();
 await page.locator('.exam-check-options button').nth(1).click();
 await expect(page.getByText('这个理由站得住')).toBeVisible();
 await expect(page.getByText('不计分，也不写入知识掌握度。')).toBeVisible();
});
test('阅读 → 注册 → 收藏 → 逐点评分 → 历史，以及窄屏原文',async({page})=>{
 await page.goto('/');await expect(page.getByRole('heading',{name:'今天，从《劝学》读起。'})).toBeVisible();await page.getByRole('button',{name:'君子生非异也，善假于物也',exact:true}).click();await page.getByRole('tab',{name:'放进题里'}).click();await expect(page.getByRole('heading',{name:'直接看答案'})).toBeVisible();
 await page.getByRole('button',{name:'加入我的复习本',exact:true}).click();const dialog=page.getByRole('dialog');await dialog.getByLabel('昵称').fill('测试同学');await dialog.getByLabel('邮箱').fill(`e2e-${Date.now()}@example.test`);await dialog.getByLabel('密码').fill('test-password-2026');await dialog.getByRole('button',{name:'注册并开始阅读'}).click();await expect(dialog).toHaveCount(0);await page.getByRole('button',{name:'加入我的复习本',exact:true}).click();await expect(page.getByRole('button',{name:'已加入我的复习本'})).toBeVisible();
 await page.getByRole('button',{name:'想自己写一次，再看逐点反馈'}).click();await page.getByLabel('你的答案').fill('君子的天性没有不同，只是善于借助外物。');await page.getByRole('button',{name:'查看逐点反馈'}).click();await expect(page.getByText('规则演示 · 估计反馈')).toBeVisible();await expect(page.getByText('已进入人工复核队列')).toBeVisible();await page.getByRole('button',{name:'关闭窗口'}).click();await page.getByRole('button',{name:'学习足迹',exact:true}).click();await expect(page.getByRole('button',{name:/一句读懂 · 善假于物/})).toBeVisible();await page.reload();await expect(page.getByRole('button',{name:'测试同学 学生学习空间'})).toBeVisible();
 await page.setViewportSize({width:390,height:844});await page.getByRole('button',{name:'展开导航'}).click();await page.getByRole('button',{name:'课文精读',exact:true}).click();await expect(page.getByText('用心躁也', {exact:true})).toBeVisible();expect(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth)).toBe(true);
});
test('学生互相隔离，教师复核需要角色和领取，来源/授权不绕过',async({playwright})=>{
 const origin=process.env.TEST_BASE_URL||'http://127.0.0.1:3000';const first=await playwright.request.newContext({baseURL:origin,extraHTTPHeaders:{origin}});const second=await playwright.request.newContext({baseURL:origin,extraHTTPHeaders:{origin}});
 for(const [c,n] of [[first,'a'],[second,'b']] as const){const r=await c.post('/api/auth/register',{data:{email:`isolation-${n}-${Date.now()}@example.test`,password:'test-password-2026',name:n}});expect(r.status()).toBe(200);}
 const answer=await first.post('/api/attempts',{data:{exerciseId:'translate',answer:'天性没有不同，善于借助外物。'}});expect(answer.status()).toBe(201);const a=(await answer.json()).attempt;
 const other=await second.get('/api/learning');expect((await other.json()).attempts).toHaveLength(0);expect((await second.post('/api/reviews/request',{data:{attemptId:a.id}})).status()).toBe(404);expect((await second.get('/api/reviews')).status()).toBe(403);expect((await second.post('/api/reviews/claim',{data:{attemptId:a.id}})).status()).toBe(403);expect((await second.post('/api/admin/questions/status',{data:{id:'2020-II-16-1',authorization:'APPROVED',verification:'VERIFIED'}})).status()).toBe(403);
 expect((await first.post('/api/study',{data:{annotationId:'yi',action:'SAVE'},headers:{origin:'https://evil.test'}})).status()).toBe(403);const exams=await first.get('/api/exams');expect((await exams.json()).questions.some((q:{displayBasis?:string;body:unknown})=>q.displayBasis==='USER_MATERIAL'&&Boolean(q.body))).toBe(true);const history=await first.get('/api/learning');expect((await history.json()).masteries).toHaveLength(0);await first.dispose();await second.dispose();
});

