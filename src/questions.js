// src/questions.js

// --- Grade 1 ---
import * as Grade1MathModule from './data/questions/grade1/math.jsx';
import * as Grade1EnglishModule from './data/questions/grade1/ReadingAndLiteracy.jsx';

// --- Grade 2 ---
import * as Grade2MathModule from './data/questions/grade2/math.jsx';
import * as Grade2EnglishModule from './data/questions/grade2/english.jsx';

// --- Grade 3 ---
import * as Grade3MathModule from './data/questions/grade3/math.jsx';
import * as Grade3EnglishModule from './data/questions/grade3/english.jsx';
import * as Grade3ScienceModule from './data/questions/grade3/science.jsx';

// --- Grade 4 ---
import * as Grade4MathModule from './data/questions/grade4/math.jsx';
import * as Grade4EnglishModule from './data/questions/grade4/english.jsx';
import * as Grade4ScienceModule from './data/questions/grade4/science.jsx';

// --- Grade 5 ---
import * as Grade5MathModule from './data/questions/grade5/math.jsx';
import * as Grade5EnglishModule from './data/questions/grade5/english.jsx';
import * as Grade5ScienceModule from './data/questions/grade5/science.jsx';

// --- Grade 6 ---
import * as Grade6MathModule from './data/questions/grade6/math.jsx';
import * as Grade6EnglishModule from './data/questions/grade6/english.jsx';
import * as Grade6ScienceModule from './data/questions/grade6/science.jsx';

// Helper to safely extract question objects whether exported named or default
const extractData = (mod, key) => {
  const moduleObj = mod && typeof mod === 'object' ? mod : {};
  return moduleObj[key] || moduleObj.default || {};
};

const grade1Math = extractData(Grade1MathModule, 'grade1Math');
const grade1English = extractData(Grade1EnglishModule, 'grade1English') || {};
const grade1Science = {};

const grade2Math = extractData(Grade2MathModule, 'grade2Math');
const grade2English = extractData(Grade2EnglishModule, 'grade2English');
const grade2Science = {};

const grade3Math = extractData(Grade3MathModule, 'grade3Math');
const grade3English = extractData(Grade3EnglishModule, 'grade3English');
const grade3Science = extractData(Grade3ScienceModule, 'grade3Science');

const grade4Math = extractData(Grade4MathModule, 'grade4Math');
const grade4English = extractData(Grade4EnglishModule, 'grade4English');
const grade4Science = extractData(Grade4ScienceModule, 'grade4Science');

const grade5Math = extractData(Grade5MathModule, 'grade5Math');
const grade5English = extractData(Grade5EnglishModule, 'grade5English');
const grade5Science = extractData(Grade5ScienceModule, 'grade5Science');

const grade6Math = extractData(Grade6MathModule, 'grade6Math');
const grade6English = extractData(Grade6EnglishModule, 'grade6English');
const grade6Science = extractData(Grade6ScienceModule, 'grade6Science');

const normalizeGradeKey = (grade = 'grade1') => {
  const cleaned = String(grade || 'grade1').trim().toLowerCase().replace(/[^a-z0-9]+/g, '');

  const numericGrade = cleaned.match(/^(?:grade)?([1-6])$/) || cleaned.match(/^ps([1-6])$/);
  if (numericGrade) return `grade${numericGrade[1]}`;

  if (cleaned === 'grade1' || cleaned === 'ps1grade1' || cleaned === 'gradeone') return 'grade1';
  if (cleaned === 'grade2' || cleaned === 'ps2grade2' || cleaned === 'gradetwo') return 'grade2';
  if (cleaned === 'grade3' || cleaned === 'ps3grade3' || cleaned === 'gradethree') return 'grade3';
  if (cleaned === 'grade4' || cleaned === 'gradefour') return 'grade4';
  if (cleaned === 'grade5' || cleaned === 'gradefive') return 'grade5';
  if (cleaned === 'grade6' || cleaned === 'gradesix') return 'grade6';

  if (cleaned.includes('grade1') || cleaned.includes('gradeone')) return 'grade1';
  if (cleaned.includes('grade2') || cleaned.includes('gradetwo')) return 'grade2';
  if (cleaned.includes('grade3') || cleaned.includes('gradethree')) return 'grade3';
  if (cleaned.includes('grade4') || cleaned.includes('gradefour')) return 'grade4';
  if (cleaned.includes('grade5') || cleaned.includes('gradefive')) return 'grade5';
  if (cleaned.includes('grade6') || cleaned.includes('gradesix')) return 'grade6';

  return cleaned || 'grade1';
};

// Keep authored questions from src/data/questions; missing levels remain empty.
const normalizeSubjectLevels = (_grade, _subject, subjectData = {}) => {
  const normalized = {};
  for (let level = 1; level <= 15; level += 1) {
    normalized[level] = Array.isArray(subjectData[level]) ? subjectData[level] : [];
  }
  return normalized;
};

// Master Question Bank strictly organized by Grade Folder > Subject > Level
export const questionBank = {
  grade1: {
    math: normalizeSubjectLevels('grade1', 'math', grade1Math),
    english: normalizeSubjectLevels('grade1', 'english', grade1English)
  },
  grade2: {
    math: normalizeSubjectLevels('grade2', 'math', grade2Math),
    english: normalizeSubjectLevels('grade2', 'english', grade2English)
  },
  grade3: {
    math: normalizeSubjectLevels('grade3', 'math', grade3Math),
    english: normalizeSubjectLevels('grade3', 'english', grade3English),
    science: normalizeSubjectLevels('grade3', 'science', grade3Science)
  },
  grade4: { math: normalizeSubjectLevels('grade4', 'math', grade4Math), english: normalizeSubjectLevels('grade4', 'english', grade4English), science: normalizeSubjectLevels('grade4', 'science', grade4Science) },
  grade5: { math: normalizeSubjectLevels('grade5', 'math', grade5Math), english: normalizeSubjectLevels('grade5', 'english', grade5English), science: normalizeSubjectLevels('grade5', 'science', grade5Science) },
  grade6: { math: normalizeSubjectLevels('grade6', 'math', grade6Math), english: normalizeSubjectLevels('grade6', 'english', grade6English), science: normalizeSubjectLevels('grade6', 'science', grade6Science) }
};

// Return authored questions only; missing grades, subjects, and levels stay empty.
export const getQuestionsForLevel = (grade = 'grade1', subject = 'math', level = 1) => {
  const normalizedGrade = normalizeGradeKey(grade);
  const normalizedSubject = (subject || 'math').toLowerCase();
  const selectedGrade = questionBank[normalizedGrade];

  return selectedGrade?.[normalizedSubject]?.[level] || [];
};

export const questionsData = getQuestionsForLevel('grade1', 'math', 1);
export default getQuestionsForLevel;
