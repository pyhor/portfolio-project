import { readFileSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'

const base = resolve('public/locales')
const en = JSON.parse(readFileSync(resolve(base, 'en.json'), 'utf8'))
const langs = ['zh-cn', 'zh-tw', 'yue-hk', 'ms']

for (const lang of langs) {
  const path = resolve(base, `${lang}.json`)
  const current = JSON.parse(readFileSync(path, 'utf8'))
  const merged = { ...en, ...current }
  writeFileSync(path, `${JSON.stringify(merged, null, 2)}\n`)
  console.log(`Merged ${lang}: ${Object.keys(merged).length} keys`)
}
