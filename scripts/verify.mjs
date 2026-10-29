import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
function walk(dir) { return readdirSync(dir, { withFileTypes: true }).flatMap(e => e.isDirectory() ? walk(join(dir,e.name)) : [join(dir,e.name)]); }
const files=walk('docs/.vuepress/dist');
const html=files.filter(p=>p.endsWith('.html'));
if (!html.length) throw new Error('No HTML output');
for (const p of html) { const s=readFileSync(p,'utf8'); if (!s.includes('noindex')) throw new Error(`Missing noindex: ${p}`); if (s.includes('data-website-id')) throw new Error('Production analytics present'); }
if (!readFileSync('docs/.vuepress/dist/robots.txt','utf8').includes('Disallow: /')) throw new Error('Robots guard missing');
console.log(`Verified ${html.length} HTML pages: trial noindex and no production analytics`);
