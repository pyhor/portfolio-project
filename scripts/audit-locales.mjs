import { createHash } from 'node:crypto'
import { readFileSync, readdirSync, statSync } from 'node:fs'
import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { parseSync } from 'rolldown/utils'

export const LOCALE_IDS = ['en', 'zh-cn', 'zh-tw', 'yue-hk', 'ms']
const root = resolve(fileURLToPath(new URL('..', import.meta.url)))
const read = path => readFileSync(resolve(root, path), 'utf8')
const files = dir => readdirSync(resolve(root, dir)).flatMap(name => {
  const path = `${dir}/${name}`
  return statSync(resolve(root, path)).isDirectory() ? files(path) : /\.(jsx|js)$/.test(path) ? [path] : []
})
// Names, brands, evidence IDs, source filenames, and mathematical axes remain
// recognizable in every language. These are not untranslated interface prose.
const invariantText = new Set([
  '@pyhor', 'JOMGO /', 'BR-01', 'FR-01', 'UAT-01', 'Gmail', 'registration.flow', 'X / Y / Z',
  'Pei Yu Hor', 'JomGo', 'p.', 'PYHOR /', 'pyhor', 'GitHub', 'LinkedIn',
  'React', 'PHP', 'JavaScript', 'XAMPP', 'ERP / UAT', 'React / TanStack · GTFS · Leaflet',
])
// Reviewed exceptions: shared product names, official names, technical stacks,
// repository identifiers, and vocabulary that is also standard Malay.
const invariantKeys = new Set([
  'why_me_langs_fallback', 'cta_github', 'traj_code_1_project', 'traj_code_1_tech',
  'traj_code_2_project', 'traj_code_2_tech', 'traj_code_3_project', 'traj_code_3_tech',
  'proj_asean_tool', 'contact_linkedin_label', 'home_sec_github', 'proj_hotel_tech',
  'proj_cinema_tech', 'contact_email_placeholder', 'ref_copyright', 'bsa_actor3_title',
  'bsa_actor4_title', 'bsa_jomgo_tech', 'home_jomgo_title', 'home_asean_title',
  'traj_work_1_company', 'traj_work_2_company',
])
const malaySharedKeys = new Set([
  'metric_location', 'edu_1_school', 'edu_1_period', 'edu_2_school', 'edu_2_period',
  'vol_1_org', 'vol_2_org', 'site_title', 'intro_portfolio', 'engineering_layer_0',
  'bsa_id', 'bsa_status', 'bsa_data', 'bsa_input', 'bsa_output', 'traj_work_2_location',
])
const humanText = value => typeof value === 'string' && /[\p{L}]/u.test(value) && !invariantText.has(value.trim())
const expressionStrings = node => {
  if (!node) return []
  if (node.type === 'Literal') return typeof node.value === 'string' ? [node.value] : []
  if (node.type === 'ConditionalExpression') return [...expressionStrings(node.consequent), ...expressionStrings(node.alternate)]
  if (node.type === 'LogicalExpression') return expressionStrings(node.right)
  return []
}

export function auditProjectLocales() {
  const catalogs = Object.fromEntries(LOCALE_IDS.map(id => [id, JSON.parse(read(`public/locales/${id}.json`))]))
  const source = catalogs.en
  const sourceKeys = Object.keys(source)
  const failures = []
  const sourceRevision = createHash('sha256').update(JSON.stringify(Object.entries(source).sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0)))).digest('hex')
  const reviewed = JSON.parse(read('scripts/locale-review.json'))
  for (const id of LOCALE_IDS.filter(id => id !== 'en')) {
    if (reviewed.sourceRevisions[id] !== sourceRevision) failures.push(`${id}: English source changed; review translation meanings and record the new source revision`)
  }
  const coverage = {}
  const tokens = value => [...value.matchAll(/\{\{([^}]+)\}\}/g)].map(match => match[1]).sort().join('|')
  const markup = value => [...value.matchAll(/<\/?[a-z][^>]*>/gi)].map(match => match[0]).join('|')
  for (const [id, catalog] of Object.entries(catalogs)) {
    const missing = sourceKeys.filter(key => typeof catalog[key] !== 'string' || !catalog[key].trim())
    const extra = Object.keys(catalog).filter(key => !Object.hasOwn(source, key))
    coverage[id] = { entries: Object.keys(catalog).length, missing: missing.length, extra: extra.length }
    missing.forEach(key => failures.push(`${id}: missing ${key}`))
    extra.forEach(key => failures.push(`${id}: obsolete ${key}`))
    for (const key of sourceKeys.filter(key => typeof catalog[key] === 'string')) {
      if (tokens(catalog[key]) !== tokens(source[key])) failures.push(`${id}: token mismatch ${key}`)
      if (markup(catalog[key]) !== markup(source[key])) failures.push(`${id}: markup mismatch ${key}`)
      if (id !== 'en' && catalog[key] === source[key] && /[A-Za-z]/.test(source[key]) && !invariantKeys.has(key) && !(id === 'ms' && malaySharedKeys.has(key))) failures.push(`${id}: untranslated English value ${key}`)
    }
  }
  const sourceFiles = files('src').filter(path => !path.includes('.test.'))
  let visibleStrings = 0
  const visit = (node, file, code, parent) => {
    if (!node || typeof node !== 'object') return
    const check = (value, kind) => {
      if (typeof value !== 'string' || !value.trim()) return
      visibleStrings++
      if (humanText(value)) failures.push(`${file}:${code.slice(0, node.start).split('\n').length}: untranslated ${kind} ${JSON.stringify(value.trim())}`)
    }
    if (node.type === 'JSXText') check(node.value.trim(), 'JSX text')
    if (node.type === 'TemplateElement' && node.value.raw.includes('<')) {
      for (const [, text] of node.value.raw.matchAll(/>([^<>]*)</g)) check(text.replace(/&(?:[a-z]+|#\d+);/gi, '').trim(), 'HTML template text')
    }
    if (node.type === 'AssignmentExpression' && ['textContent', 'innerHTML'].includes(node.left?.property?.name) && node.right?.type === 'Literal') check(node.right.value, 'DOM text')
    if (node.type === 'JSXAttribute' && ['aria-label', 'placeholder', 'title', 'alt', 'label'].includes(node.name.name) && node.value?.type === 'Literal') check(node.value.value, 'accessible label')
    if (node.type === 'JSXExpressionContainer' && (parent?.type !== 'JSXAttribute' || ['aria-label', 'placeholder', 'title', 'alt', 'label'].includes(parent.name.name))) expressionStrings(node.expression).forEach(value => check(value, 'rendered expression'))
    if (node.type === 'CallExpression' && node.callee?.name === 't' && node.arguments[0]?.type === 'Literal') {
      const key = node.arguments[0].value
      if (!Object.hasOwn(source, key)) failures.push(`${file}: missing literal key ${key}`)
    }
    for (const value of Object.values(node)) if (value && typeof value === 'object') {
      if (Array.isArray(value)) value.forEach(child => visit(child, file, code, node))
      else visit(value, file, code, node)
    }
  }
  for (const file of sourceFiles) {
    const code = read(file)
    const result = parseSync(file, code)
    result.errors.forEach(error => failures.push(`${file}: ${error.message}`))
    visit(result.program, file, code)
  }
  const caseStudy = JSON.parse(read('src/data/jomgoCaseStudy.json'))
  const checkData = value => {
    if (typeof value === 'string' && value.startsWith('bsa_') && !Object.hasOwn(source, value)) failures.push(`case-study data: missing ${value}`)
    if (value && typeof value === 'object') Object.values(value).forEach(checkData)
  }
  checkData(caseStudy)
  return { coverage, sourceFiles: sourceFiles.length, visibleStrings, failures }
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const result = auditProjectLocales()
  console.log(JSON.stringify(result, null, 2))
  process.exitCode = result.failures.length ? 1 : 0
}
