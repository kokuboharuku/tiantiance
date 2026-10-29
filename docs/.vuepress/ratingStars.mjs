// Presentation only: source Markdown and score semantics remain unchanged.
export function ratingStars(md) {
  let editorialRendererInstalled = false
  md.core.ruler.after('inline', 'ttc-editorial-logo', () => {
    if (editorialRendererInstalled) return
    const original = md.renderer.rules.container_important_open
    if (!original) return
    md.renderer.rules.container_important_open = (tokens, index, ...args) => {
      const html = original(tokens, index, ...args)
      return /^important\s+天天测(?:打分|点评)\s*$/u.test(tokens[index].info.trim())
        ? html.replace('hint-container important', 'hint-container important ttc-editorial-block')
        : html
    }
    editorialRendererInstalled = true
  })
  md.core.ruler.after('inline', 'ttc-rating-stars', state => {
    let rating = false
    for (const token of state.tokens) {
      if (token.type === 'container_important_open') rating = /(?:打分|主观评分|评分)/u.test(token.info)
      if (token.type === 'container_important_close') rating = false
      if (!rating || token.type !== 'inline') continue
      token.children = token.children.flatMap(child => {
        if (child.type !== 'text' || !/^\s*[^：:]+[：:]\s*[★☆⭐\uFE0F\s]+$/u.test(child.content)) return [child]
        return child.content.split(/(★+|☆+)/u).filter(Boolean).flatMap(part => {
          const text = new state.Token('text', '', 0)
          text.content = part
          if (!/^[★☆]+$/u.test(part)) return [text]
          const open = new state.Token('html_inline', '', 0)
          open.content = part.startsWith('☆') ? '<span class="ttc-rating-star ttc-rating-empty">' : '<span class="ttc-rating-star">'
          const close = new state.Token('html_inline', '', 0)
          close.content = '</span>'
          return [open, text, close]
        })
      })
    }
  })
}
