import {execFileSync} from 'node:child_process';
import { readdirSync, readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import {join,relative} from 'node:path';
const root='docs/.vuepress/dist',base='https://tiantiance.blog';
const articles=JSON.parse(readFileSync('data/articles.json','utf8'));
const xml=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&apos;'}[c]));
const walk=d=>readdirSync(d,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(join(d,e.name)):[join(d,e.name)]);
const paths=[];
for(const file of walk(root).filter(f=>f.endsWith('.html'))){let s=readFileSync(file,'utf8');const name=relative(root,file);const path='/'+name.replace(/index\.html$/,'');
 s=s.replace(/<link\b[^>]*rel="canonical"[^>]*>/g,'').replace(/<meta\b[^>]*(?:property="(?:og:[^"]+|article:[^"]+)"|name="(?:twitter:[^"]+|robots)")[^>]*>/g,'');
 if(name==='404.html'){s=s.replace('</head>','<meta name="robots" content="noindex,follow"></head>');writeFileSync(file,s);continue}
 const article=articles.find(a=>a.path===path);const title=article?.title||(s.match(/<title>([^<]*)<\/title>/)?.[1]||'天天测');
 const desc=article?`${article.date} · ${article.title}。历史测评，请结合原文测试条件与日期阅读。`:'天天测：公开测评、周榜、专题、归档与订阅。';
 const url=base+path;paths.push(url);
 const breadcrumbs={'@context':'https://schema.org','@type':'BreadcrumbList',itemListElement:[{'@type':'ListItem',position:1,name:'天天测',item:base+'/'},...path==='/'?[]:[{'@type':'ListItem',position:2,name:title,item:url}]]};
 const schema=article?{'@context':'https://schema.org','@type':'Article',headline:article.title,datePublished:article.date,mainEntityOfPage:url,image:base+'/social-card.png',author:{'@type':'Organization',name:'天天测'}}:null;
 const tags=`<link rel="canonical" href="${xml(url)}"><meta name="robots" content="index,follow"><meta property="og:type" content="${article?'article':'website'}"><meta property="og:title" content="${xml(title)}"><meta property="og:description" content="${xml(desc)}"><meta property="og:url" content="${xml(url)}"><meta property="og:image" content="${base}/social-card.png"><meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="${xml(title)}"><meta name="twitter:image" content="${base}/social-card.png"><script type="application/ld+json">${JSON.stringify(breadcrumbs).replace(/</g,'\\u003c')}</script>${schema?'<script type="application/ld+json">'+JSON.stringify(schema).replace(/</g,'\\u003c')+'</script>':''}`;
 s=s.replace('</head>',tags+'</head>');writeFileSync(file,s);
}
writeFileSync(root+'/robots.txt',`User-agent: *\nAllow: /\nSitemap: ${base}/sitemap.xml\n`);
const urls=[...new Set(paths)].sort();
writeFileSync(root+'/sitemap.xml','<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'+urls.map(u=>`<url><loc>${xml(u)}</loc></url>`).join('')+'</urlset>');
writeFileSync(root+'/feed.xml','<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>天天测</title><link>'+base+'/</link><description>公开测评更新；按原始发布日期排列。</description><language>zh-CN</language>'+articles.map(a=>`<item><title>${xml(a.title)}</title><link>${base}${xml(a.path)}</link><guid isPermaLink="true">${base}${xml(a.path)}</guid><pubDate>${new Date(a.date+'T00:00:00+08:00').toUTCString()}</pubDate><description>${xml(a.date+' '+a.title)}</description></item>`).join('')+'</channel></rss>');
writeFileSync(root+'/search-notification.json',JSON.stringify({urls},null,2)+'\n');
console.log(`Finalized ${urls.length} canonical URLs, RSS and sitemap`);

writeFileSync(root+'/release.json',JSON.stringify({commit:execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).trim(),articles:articles.length,site:base},null,2)+'\n');
