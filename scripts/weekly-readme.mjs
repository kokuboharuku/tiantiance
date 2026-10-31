import { readFileSync, writeFileSync } from 'node:fs'
import { pathToFileURL } from 'node:url'

function text(html) {
  const entities = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ' }
  return String(html ?? '')
    .replace(/<(script|style)\b[^>]*>[\s\S]*?<\/\1\s*>/gi, '')
    .replace(/<[^>]*>/g, ' ')
    .replace(/&(#x[\da-f]+|#\d+|amp|lt|gt|quot|apos|nbsp);/gi, (_, entity) => {
      if (entity[0] !== '#') return entities[entity.toLowerCase()]
      const number = entity[1].toLowerCase() === 'x' ? parseInt(entity.slice(2), 16) : Number(entity.slice(1))
      return number > 0 && number <= 0x10ffff ? String.fromCodePoint(number) : ''
    })
    .replace(/\s+/g, ' ').trim()
}
const markdown = value => text(value).replace(/([\\`*_{}\[\]<>#!|])/g, '\\$1')

export function renderWeeklyReadme(snapshot) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(snapshot.week) || !Array.isArray(snapshot.posts)) throw Error('Invalid weekly snapshot')
  const sections = snapshot.posts.map((post, index) => {
    if (post.rank !== index + 1 || !/^\/jccp\/[^\s?#]+\/$/.test(post.path) || post.path.includes('..')) throw Error('Invalid frozen ranking order or URL')
    const parts = String(post.excerpt ?? '').split(/<div\s+class=["']ttc-rating-excerpt["']\s*>/i)
    if (parts.length !== 2) throw Error('Missing published review or score')
    const review = markdown(parts[0])
    const scores = text(parts[1]).replace(/([★☆])\s+(?=[★☆])/g, '$1').replace(/\s*(稳定|速度|延迟|性价比)：\s*/g, '\n$1：').trim().split('\n')
    if (scores.length !== 4 || scores.some(s => !/^(稳定|速度|延迟|性价比)：[★☆]{5}$/.test(s))) throw Error('Invalid published score dimensions')
    return `### ${post.rank}. [${markdown(post.title)}](https://tiantiance.blog${post.path})\n\n**打分：** ${scores.join(' · ')}\n\n**评价：** ${review || '暂无评价。'}`
  })
  return `# 天天测｜机场实测与每周评分榜

> 每天测试机场和免费节点。

天天测持续记录机场和免费节点的实测表现，保留每次测评的具体评价与多维评分，方便比较不同服务，也方便回看同一服务在不同时期的表现。

[访问网站](https://tiantiance.blog/) · [每周评分榜](https://tiantiance.blog/weekly-ranking/) · [RSS 订阅](https://tiantiance.blog/feed.xml)

## 如何阅读这份榜单

- **看评分，也看评价。** 稳定、速度、延迟、性价比四个维度各以五星展示；评价补充当次测试的体验与条件。点击名称可查看完整测评。
- **每周固定范围。** 每周一北京时间 14:00 截止，从最近 20 篇有效测评中按商家去重，每家采用最新一次测评，再按分数取前 10 家。
- **保留当时的结果。** 榜单按周保存，展示该期已发布的评价和分数，反映对应测评时的表现。

## 本周评分榜

**${snapshot.week} 周榜 · ${sections.length} 家**

${sections.length ? sections.join('\n\n---\n\n') : '本周暂无已发布榜单。'}

---

## 关于这个项目

本站持续发布机场测速与测评，并整理每周评分榜。本仓库保存网站前端及已公开内容；这里的榜单与网站使用同一份已发布周榜，随内容发布自动更新。想阅读完整文章可以访问网站，也可以通过 RSS 跟进新内容。
`
}

export function writeWeeklyReadme() {
  writeFileSync('README.md', renderWeeklyReadme(JSON.parse(readFileSync('data/weekly-ranking.json', 'utf8'))))
}
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) writeWeeklyReadme()
