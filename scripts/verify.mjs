import {readdirSync,readFileSync,existsSync} from 'node:fs';
import {join} from 'node:path';
import {createHash} from 'node:crypto';
const root='docs/.vuepress/dist',base='https://gd.tiantiance.blog';
const assert=(v,m)=>{if(!v)throw Error(m)};
const walk=d=>readdirSync(d,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(join(d,e.name)):[join(d,e.name)]);
const files=walk(root),html=files.filter(f=>f.endsWith('.html'));
const articles=JSON.parse(readFileSync('data/articles.json','utf8'));
assert(articles.length===92,'Unexpected article count: review snapshot change explicitly');
for(const a of articles){assert(createHash('sha256').update(readFileSync('docs/jccp/'+a.file)).digest('hex')===a.hash,'Article content changed');const s=readFileSync(root+a.path+'index.html','utf8');assert(s.includes(a.path)&&s.includes('application/ld+json')&&s.includes('相关测评')&&s.includes('复制文章链接'),'Missing article reading/discovery features: '+a.path)}
for(const f of html){const s=readFileSync(f,'utf8');assert(!s.includes('data-website-id'),'Production analytics present');if(f.endsWith('/404.html')){assert(s.includes('noindex')&&!s.includes('rel="canonical"'),'404 indexing guard');continue}assert(!s.includes('noindex'),'Unexpected noindex: '+f);assert((s.match(/rel="canonical"/g)||[]).length===1,'Canonical uniqueness');assert(s.includes('property="og:image"')&&s.includes('summary_large_image'),'Share metadata');}
for(const p of ['/topics/','/archive/','/subscribe/','/reading/'])assert(existsSync(root+p+'index.html'),'Missing discovery page');
const sitemap=readFileSync(root+'/sitemap.xml','utf8');const urls=[...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m=>m[1]);assert(new Set(urls).size===urls.length,'Duplicate sitemap URL');for(const u of urls){assert(u.startsWith(base+'/')&&!u.endsWith('404.html'),'Invalid sitemap URL');let p=u.slice(base.length);assert(existsSync(root+p+(p.endsWith('/')?'index.html':'')),'Sitemap target missing: '+p)}
assert(!readFileSync(root+'/robots.txt','utf8').includes('Disallow: /'),'Crawl still blocked');
const feed=readFileSync(root+'/feed.xml','utf8');assert((feed.match(/<item>/g)||[]).length===articles.length,'RSS article coverage');
const key=readFileSync('indexnow-key.txt','utf8').trim();assert(/^[a-z0-9-]{8,128}$/i.test(key)&&readFileSync(root+'/'+key+'.txt','utf8').trim()===key,'IndexNow verification file');
assert(existsSync(root+'/social-card.png'),'Social preview missing');
console.log(`Verified ${html.length} HTML, ${articles.length} unchanged articles, ${urls.length} sitemap URLs, RSS, 404 and metadata`);
