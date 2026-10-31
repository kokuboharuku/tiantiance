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
    return `## ${post.rank}. [${markdown(post.title)}](https://tiantiance.blog${post.path})\n\n**评价：** ${review || '暂无评价。'}\n\n**打分：** ${scores.join(' · ')}`
  })
  return `# 每周评分榜\n\n${snapshot.week} 周榜\n\n${sections.length ? sections.join('\n\n') : '本周暂无已发布榜单。'}\n`
}

export function writeWeeklyReadme() {
  writeFileSync('README.md', renderWeeklyReadme(JSON.parse(readFileSync('data/weekly-ranking.json', 'utf8'))))
}
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) writeWeeklyReadme()
