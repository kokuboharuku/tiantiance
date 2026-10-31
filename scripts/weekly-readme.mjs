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

速度快不快、晚高峰稳不稳、价格值不值？天天测通过实际测速和使用体验，记录机场的表现。这里每周整理一份评分榜，把具体评价和评分放在一起，帮你找到值得进一步了解的机场。

[访问网站](https://tiantiance.blog/) · [每周评分榜](https://tiantiance.blog/weekly-ranking/) · [RSS 订阅](https://tiantiance.blog/feed.xml)

## 先看评价，再做选择

每家机场都有**稳定、速度、延迟、性价比**四项评分，每项满分五星。除了星级，也看看评价里提到的运营商、晚高峰表现和使用感受，是否符合你的需要。

点击机场名称可查看完整测评。网络表现会随时间和使用环境变化，请结合测评日期参考。

## 本周评分榜

**${snapshot.week} 周榜 · ${sections.length} 家**

${sections.length ? sections.join('\n\n---\n\n') : '本周暂无已发布榜单。'}

---

## 发现更多测评

榜单之外，还有更多机场的测速记录和使用评价。前往[天天测](https://tiantiance.blog/)查看完整文章，或通过[RSS 订阅](https://tiantiance.blog/feed.xml)跟进新测评。

`
}

export function writeWeeklyReadme() {
  writeFileSync('README.md', renderWeeklyReadme(JSON.parse(readFileSync('data/weekly-ranking.json', 'utf8'))))
}
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) writeWeeklyReadme()
