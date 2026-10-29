import { writeFileSync } from 'node:fs';
writeFileSync('docs/.vuepress/dist/robots.txt', 'User-agent: *\nDisallow: /\n');
