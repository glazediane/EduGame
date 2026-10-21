const gradeModules = {
  grade1: [() => import('./data/questions/grade1/math.jsx'), () => import('./data/questions/grade1/ReadingAndLiteracy.jsx'), null],
  grade2: [() => import('./data/questions/grade2/math.jsx'), () => import('./data/questions/grade2/english.jsx'), null],
  grade3: [() => import('./data/questions/grade3/math.jsx'), () => import('./data/questions/grade3/english.jsx'), () => import('./data/questions/grade3/science.jsx')],
  grade4: [() => import('./data/questions/grade4/math.jsx'), () => import('./data/questions/grade4/english.jsx'), () => import('./data/questions/grade4/science.jsx')],
  grade5: [() => import('./data/questions/grade5/math.jsx'), () => import('./data/questions/grade5/english.jsx'), () => import('./data/questions/grade5/science.jsx')],
  grade6: [() => import('./data/questions/grade6/math.jsx'), () => import('./data/questions/grade6/english.jsx'), () => import('./data/questions/grade6/science.jsx')]
}

const gradeCache = new Map()

export const normalizeGradeKey = (grade = 'grade1') => {
  const cleaned = String(grade || 'grade1').trim().toLowerCase().replace(/[^a-z0-9]+/g, '')
  const numericGrade = cleaned.match(/^(?:grade)?([1-6])$/) || cleaned.match(/^ps([1-6])$/)
  if (numericGrade) return `grade${numericGrade[1]}`
  const words = ['one', 'two', 'three', 'four', 'five', 'six']
  const wordGrade = words.findIndex((word, index) => cleaned.includes(`grade${word}`) || cleaned === `ps${index + 1}grade${index + 1}`)
  return wordGrade >= 0 ? `grade${wordGrade + 1}` : cleaned || 'grade1'
}

const moduleData = (module) => module?.default || Object.values(module || {}).find((value) => value && typeof value === 'object') || {}

function normalizeSubjectLevels(subjectData = {}) {
  return Object.fromEntries(Array.from({ length: 15 }, (_, index) => {
    const level = index + 1
    return [level, Array.isArray(subjectData[level]) ? subjectData[level] : []]
  }))
}

export async function getQuestionBankForGrade(grade = 'grade1') {
  const gradeKey = normalizeGradeKey(grade)
  if (gradeCache.has(gradeKey)) return gradeCache.get(gradeKey)
  const loaders = gradeModules[gradeKey]
  if (!loaders) return {}
  const bankPromise = Promise.all(loaders.map((load) => load ? load() : Promise.resolve(null))).then(([mathModule, englishModule, scienceModule]) => ({
    math: normalizeSubjectLevels(moduleData(mathModule)),
    english: normalizeSubjectLevels(moduleData(englishModule)),
    ...(scienceModule ? { science: normalizeSubjectLevels(moduleData(scienceModule)) } : {})
  }))
  gradeCache.set(gradeKey, bankPromise)
  try { return await bankPromise } catch (error) { gradeCache.delete(gradeKey); throw error }
}

export async function getQuestionsForLevel(grade = 'grade1', subject = 'math', level = 1) {
  const bank = await getQuestionBankForGrade(grade)
  const normalizedSubject = String(subject || 'math').toLowerCase()
  return bank?.[normalizedSubject]?.[level] || []
}

export const questionsData = getQuestionsForLevel('grade1', 'math', 1)
export default getQuestionsForLevel
