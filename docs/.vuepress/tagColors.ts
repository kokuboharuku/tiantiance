import configured from './tag-styles.json'
import presets from './tag-presets.json'

// Exact Plume preset tuples, not generated random class identifiers.
const styles: Record<string, string> = Object.create(null)
for (const [tag, raw] of Object.entries(configured)) {
  const choice = typeof raw === 'string' ? raw.trim().toLowerCase() : ''
  if (!tag.trim() || tag !== tag.trim() || [...tag].length > 100 || /[\x00-\x1F\x7F]/u.test(tag)
    || typeof raw !== 'string' || !['auto', 'gray', 'brand', ...Object.keys(presets)].includes(choice))
    throw new Error(`Invalid tag style configuration: ${tag}`)
  styles[tag] = choice
}
export function tagColorStyle(tag: string) {
  const choice = styles[tag]
  if (!choice || choice === 'auto') return undefined
  if (choice === 'gray') return { '--vp-tag-color': 'var(--vp-c-text-3)', '--vp-tag-bg': 'var(--vp-c-default-soft)', '--vp-tag-hover-color': 'var(--vp-c-text-3)' }
  if (choice === 'brand') return { '--vp-tag-color': 'var(--vp-c-brand-1)', '--vp-tag-bg': 'var(--vp-c-brand-soft)', '--vp-tag-hover-color': 'var(--vp-c-brand-2)' }
  const [color, hover, background] = presets[choice as keyof typeof presets]
  return { '--vp-tag-color': color, '--vp-tag-hover-color': hover, '--vp-tag-bg': background }
}
