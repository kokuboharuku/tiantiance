import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { renderWeeklyReadme } from './weekly-readme.mjs'
const snapshot = JSON.parse(readFileSync(new URL('../data/weekly-ranking.json', import.meta.url)))
test('published frozen snapshot remains unchanged and contains only text reviews and scores', () => {
  const before = JSON.stringify(snapshot)
  const output = renderWeeklyReadme(snapshot)
  assert.equal(JSON.stringify(snapshot), before)
  assert.equal((output.match(/^### /gm) ?? []).length, snapshot.posts.length)
  assert.equal((output.match(/\*\*打分：\*\*/g) ?? []).length, snapshot.posts.length)
  assert.ok(output.includes(snapshot.week))
  assert.ok(!/!\[|<img\b|badge\.svg|discussions|<span|<div/i.test(output))
  let position = -1
  for (const post of snapshot.posts) { const next = output.indexOf(`### ${post.rank}. `); assert.ok(next > position); position = next }
})
test('embedded images and active markup cannot become README content', () => {
  const data = structuredClone(snapshot)
  data.posts = [data.posts[0]]
  data.posts[0].excerpt = '<p>原评价 &amp; 条件 ![图片](https://example.invalid/a.png)</p><img src="https://example.invalid/a.png"><script>secret()</script>' + data.posts[0].excerpt.slice(data.posts[0].excerpt.indexOf('<div class="ttc-rating-excerpt">'))
  const output = renderWeeklyReadme(data)
  assert.ok(output.includes('原评价 & 条件'))
  assert.ok(!output.includes('<img'))
  assert.ok(!output.includes('secret()'))
  assert.ok(output.includes('\\!\\[图片\\]'))
})
test('malformed frozen rank or rating blocks generation', () => {
  const data = structuredClone(snapshot)
  data.posts[0].rank = 2
  assert.throws(() => renderWeeklyReadme(data))
  data.posts[0].rank = 1
  data.posts[0].excerpt = '<p>只有评价，没有分项</p>'
  assert.throws(() => renderWeeklyReadme(data))
})
