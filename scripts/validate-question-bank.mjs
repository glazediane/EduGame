import { readdirSync, readFileSync } from 'node:fs'

const root = new URL('../src/data/questions/', import.meta.url)
const quotePattern = /"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'/g
const failures = []
let checked = 0

function decodeLiteral(literal) {
  if (literal.startsWith('"')) return JSON.parse(literal)
  return literal.slice(1, -1).replace(/\\(['"\\])/g, '$1').replace(/\\n/g, '\n')
}

for (const gradeDir of readdirSync(root, { withFileTypes: true }).filter((entry) => entry.isDirectory())) {
  for (const file of readdirSync(new URL(`${gradeDir.name}/`, root)).filter((name) => name.endsWith('.jsx'))) {
    const fileUrl = new URL(`${gradeDir.name}/${file}`, root)
    const lines = readFileSync(fileUrl, 'utf8').split(/\r?\n/)
    lines.forEach((line, index) => {
      const row = line.match(/options\s*:\s*\[([\s\S]*?)\]\s*,\s*a\s*:\s*("(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*')/)
      if (!row) return
      const choices = [...row[1].matchAll(quotePattern)].map(([literal]) => decodeLiteral(literal))
      const answer = decodeLiteral(row[2])
      checked += 1
      if (!choices.includes(answer)) failures.push(`${gradeDir.name}/${file}:${index + 1} answer is not one of its options`)
    })
  }
}

if (failures.length) {
  console.error(`Found ${failures.length} invalid answer key(s) among ${checked} checked questions:`)
  failures.forEach((failure) => console.error(`- ${failure}`))
  process.exitCode = 1
} else {
  console.log(`Validated ${checked} question answer keys.`)
}
