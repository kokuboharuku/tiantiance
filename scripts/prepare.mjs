import { writeWeeklyReadme } from './weekly-readme.mjs';
import {readdirSync,readFileSync,writeFileSync,mkdirSync} from 'node:fs';
import {createHash} from 'node:crypto';
const unquote=s=>{s=s.trim();return /^'.*'$/.test(s)?s.slice(1,-1).replace(/''/g,"'"):s.startsWith('"')?JSON.parse(s):s};
const scalar=(s,k)=>{const m=s.match(new RegExp('^'+k+': *(.*)$','m'));return m?unquote(m[1]):''};
export const articles=readdirSync('docs/jccp').filter(f=>f.endsWith('.md')).map(f=>{const raw=readFileSync('docs/jccp/'+f,'utf8');const fm=raw.match(/^---\r?\n([\s\S]*?)\r?\n---/)[1];return {file:f,title:scalar(fm,'title'),merchant:scalar(fm,'titleSeries')||scalar(fm,'baseTitle')||scalar(fm,'title'),path:scalar(fm,'permalink'),date:scalar(fm,'createTime').slice(0,10),score:Number(scalar(fm,'scoreTotal')),hash:createHash('sha256').update(raw).digest('hex')};}).sort((a,b)=>b.date.localeCompare(a.date)||a.file.localeCompare(b.file));
if(articles.some(a=>!a.title||!/^\/jccp\/[^/]+\/$/.test(a.path)||!/^\d{4}-\d{2}-\d{2}$/.test(a.date)))throw Error('Invalid article metadata');
const groups=[['score-16','16–20 分',a=>a.score>=16],['score-12','12–15 分',a=>a.score>=12&&a.score<16],['score-8','8–11 分',a=>a.score>=8&&a.score<12],['score-under-8','低于 8 分',a=>a.score<8]];
const esc=s=>s.replace(/[\[\]<>]/g,'');
const listing=as=>as.map(a=>`- ${a.date} · [${esc(a.title)}](${a.path})`).join('\n');
const page=(name,title,body)=>{mkdirSync('docs/guides',{recursive:true});writeFileSync('docs/guides/'+name+'.md',`---\ntitle: ${title}\npermalink: /${name}/\narticle: false\n---\n# ${title}\n\n${body}\n`)};
page('topics','测评专题','按原文总分分组，便于查找历史测评；分组不改变原评分，也不表示当前服务状态。\n\n'+groups.map(([slug,title,fn])=>`- [${title}](/topics/${slug}/)（${articles.filter(fn).length} 篇）`).join('\n')+'\n\n[全部归档](/archive/) · [周榜说明](/reading/)');
for(const [slug,title,fn] of groups){mkdirSync('docs/guides/topics',{recursive:true});writeFileSync('docs/guides/topics/'+slug+'.md',`---\ntitle: ${title}测评\npermalink: /topics/${slug}/\narticle: false\n---\n# ${title}测评\n\n依据原文总分归类。请结合文章日期与测试条件阅读。\n\n${listing(articles.filter(fn))}\n\n[返回专题](/topics/)\n`)}
const months=[...new Set(articles.map(a=>a.date.slice(0,7)))];
page('archive','测评归档',`共 ${articles.length} 篇公开文章，按原始日期排列。按文章原始日期浏览，公开内容随正式发布更新。\n\n`+months.map(m=>`## ${m}\n\n${listing(articles.filter(a=>a.date.startsWith(m)))}`).join('\n\n'));
page('subscribe','订阅更新','复制下面的 RSS 地址到你的阅读器：\n\n```text\nhttps://tiantiance.blog/feed.xml\n```\n\n[打开 RSS](/feed.xml) · [测评归档](/archive/)\n\nRSS 按文章原始日期排列。只有实际内容更新才会出现新条目；不通过修改日期制造更新。');
page('reading','阅读与周榜','本站展示天天测公开测评与已发布周榜。文章与周榜沿现有内容流程更新。\n\n## 如何阅读\n\n使用右上角搜索查找文章，也可以通过[专题](/topics/)或[归档](/archive/)浏览。历史价格和体验反映文章所述时间，请结合测试条件与发布日期。部分旧图片仍依赖原有图片服务。\n\n## 周榜规则\n\n原站周一北京时间 14:00 截止，取最近 20 篇有效测评后按商家去重，同商家保留最新一篇，再按评分取前 10；不向 20 篇之外补位。未确认商家与综合多商家文章不参与单商家排行。网站展示已发布周榜，不在访问页面时重新计算评分。\n\n## 交流与反馈\n\n[公开讨论](https://github.com/kokuboharuku/tiantiance/discussions) · [内容纠错](https://github.com/kokuboharuku/tiantiance/issues/new?template=correction.yml) · [Wiki](https://github.com/kokuboharuku/tiantiance/wiki)\n\n问题反馈请附文章链接、具体位置与观察时间，勿附凭据或私人订阅链接。');
writeFileSync('data/articles.json',JSON.stringify(articles,null,2)+'\n');
console.log(`Prepared discovery pages for ${articles.length} unchanged articles`);

writeWeeklyReadme();
