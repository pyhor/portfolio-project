const TECH_CLASS = {
  html: 'tech-badge--html',
  javascript: 'tech-badge--js',
  js: 'tech-badge--js',
  css: 'tech-badge--css',
  php: 'tech-badge--php',
  xampp: 'tech-badge--xampp',
  react: 'tech-badge--react',
  vite: 'tech-badge--vite',
  sass: 'tech-badge--sass',
  scss: 'tech-badge--sass',
}

function techClassName(label) {
  const key = label.trim().toLowerCase().replace(/\s+/g, '')
  return TECH_CLASS[key] || 'tech-badge--default'
}

function parseTechItems(techString) {
  if (!techString?.trim()) return []
  return techString
    .split(/[,·|/]/)
    .map((item) => item.trim())
    .filter(Boolean)
}

export function TechStackBadges({ techString, className = '' }) {
  const items = parseTechItems(techString)
  if (!items.length) return null

  return (
    <span className={`tech-stack ${className}`.trim()}>
      {items.map((item) => (
        <span key={item} className={`tech-badge ${techClassName(item)}`}>
          {item}
        </span>
      ))}
    </span>
  )
}
