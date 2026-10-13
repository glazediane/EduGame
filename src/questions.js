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

const SUBJECT_THEME = {
  math: {
    visuals: ['🔢', '🍎', '⭐', '📐', '🧮', '🎯', '🎲', '🌟', '🍉', '📏', '🔷', '🧩', '⚽', '🌈', '🏆'],
    prompts: [
      'Count the objects carefully.',
      'Choose the correct number.',
      'Solve the number pattern.',
      'Find the right answer to the sum.',
      'Pick the correct shape or number.',
      'Which answer is correct?',
      'Look closely and count again.',
      'Find the missing value.',
      'Choose the best answer.',
      'Count, compare, and decide.',
      'Solve the quick math challenge.',
      'Which option matches the problem?',
      'Try the pattern and choose wisely.',
      'Use number sense to decide.',
      'Pick the right answer.'
    ]
  },
  english: {
    visuals: ['📚', '🔤', '✨', '📝', '🎵', '🌈', '📖', '🧠', '🔠', '📘', '🎨', '🌟', '📒', '🪄', '💡'],
    prompts: [
      'Read the word carefully.',
      'Choose the correct word.',
      'Find the matching word.',
      'Pick the right spelling.',
      'Which word belongs here?',
      'Listen to the sound and choose.',
      'Read the sentence and decide.',
      'Find the rhyming word.',
      'Pick the best answer.',
      'Choose the correct vowel.',
      'Match the picture to the word.',
      'Find the right sentence.',
      'Read and select the correct option.',
      'Choose the correct spelling.',
      'Pick the best word choice.'
    ]
  },
  science: {
    visuals: ['🌍', '🔬', '🌱', '🌞', '🐠', '🌧️', '🦁', '⚡', '🌿', '🌙', '🪐', '🌊', '🧪', '🐝', '🌼'],
    prompts: [
      'Observe the picture and choose.',
      'Which answer makes sense?',
      'Look at the science clue.',
      'Pick the correct science fact.',
      'Which option is correct?',
      'Use what you know about nature.',
      'Choose the best observation.',
      'Find the right science answer.',
      'Think about the living thing.',
      'Which answer fits the question?',
      'Use the clue to choose wisely.',
      'Look closely and decide.',
      'Which option matches the fact?',
      'Select the correct answer.',
      'Think and choose the best response.'
    ]
  }
};

const createInteractiveQuestion = (grade, subject, level, index) => {
  const safeSubject = (subject || 'math').toLowerCase();
  const safeGrade = normalizeGradeKey(grade);
  const theme = SUBJECT_THEME[safeSubject] || SUBJECT_THEME.math;
  const visual = theme.visuals[(level + index) % theme.visuals.length];
  const prompt = theme.prompts[(level * 3 + index) % theme.prompts.length];
  const baseNumber = (level * 7 + index + 2);
  const optionSet = [
    `${baseNumber - 2}`,
    `${baseNumber}`,
    `${baseNumber + 2}`,
    `${baseNumber + 5}`
  ];

  const answerPool = {
    math: [
      `${baseNumber}`,
      `${baseNumber + 1}`,
      `${baseNumber + 3}`,
      `${baseNumber + 5}`
    ],
    english: [
      'Read',
      'Write',
      'Play',
      'Learn'
    ],
    science: [
      'Sunlight',
      'Water',
      'Air',
      'Plant'
    ]
  };

  const correct = answerPool[safeSubject]?.[(level + index) % answerPool[safeSubject].length] || `${baseNumber}`;

  return {
    q: `[${safeGrade.toUpperCase()} - ${safeSubject.toUpperCase()}] Level ${level}: ${prompt}`,
    visual,
    options: safeSubject === 'math'
      ? optionSet
      : [correct, 'Option B', 'Option C', 'Option D'],
    optionIcons: safeSubject === 'math'
      ? ['1️⃣', '2️⃣', '3️⃣', '4️⃣']
      : ['✅', '🎯', '🌟', '✨'],
    a: safeSubject === 'math' ? `${baseNumber}` : correct,
    hint: `Try again: ${prompt}`,
    reward: `${visual} Learning Boost`
  };
};

const buildLevelQuestions = (grade, subject, level, existing = []) => {
  const questions = Array.isArray(existing) ? [...existing] : [];
  while (questions.length < 15) {
    questions.push(createInteractiveQuestion(grade, subject, level, questions.length));
  }
  return questions.slice(0, 15);
};

const normalizeSubjectLevels = (grade, subject, subjectData = {}) => {
  const normalized = {};
  for (let level = 1; level <= 15; level += 1) {
    const existing = Array.isArray(subjectData[level]) ? subjectData[level] : [];
    normalized[level] = Array.isArray(existing) && existing.length > 0
      ? existing.slice(0, 15).map((item) => ({
          q: item.q || item.question || `Question ${level}`,
          visual: item.visual || item.emoji || '',
          options: Array.isArray(item.options) && item.options.length ? item.options : ['A', 'B', 'C', 'D'],
          optionIcons: Array.isArray(item.optionIcons) && item.optionIcons.length ? item.optionIcons : ['1️⃣', '2️⃣', '3️⃣', '4️⃣'],
          a: String(item.a ?? item.answer ?? item.options?.[0] ?? 'A'),
          hint: item.hint || 'Think carefully and choose the best answer.',
          reward: item.reward || '🎉 Learning Boost'
        }))
      : buildLevelQuestions(grade, subject, level, existing);
    if (normalized[level].length < 15) {
      while (normalized[level].length < 15) {
        normalized[level].push(createInteractiveQuestion(grade, subject, level, normalized[level].length));
      }
    }
  }
  return normalized;
};

// Master Question Bank strictly organized by Grade Folder > Subject > Level
export const questionBank = {
  grade1: {
    math: normalizeSubjectLevels('grade1', 'math', grade1Math),
    english: normalizeSubjectLevels('grade1', 'english', grade1English),
    science: normalizeSubjectLevels('grade1', 'science', grade1Science)
  },
  grade2: {
    math: normalizeSubjectLevels('grade2', 'math', grade2Math),
    english: normalizeSubjectLevels('grade2', 'english', grade2English),
    science: normalizeSubjectLevels('grade2', 'science', grade2Science)
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

// Fallback riddle question generator if a level isn't explicitly detailed yet
const generateRiddleQuestions = (grade, subject, level) => {
  return Array.from({ length: 15 }, (_, i) => createInteractiveQuestion(grade, subject, level, i));
};

// Strictly pulls questions matching the student's assigned grade
export const getQuestionsForLevel = (grade = 'grade1', subject = 'math', level = 1) => {
  const normalizedGrade = normalizeGradeKey(grade);
  const normalizedSubject = (subject || 'math').toLowerCase();
  const selectedGrade = questionBank[normalizedGrade];

  if (selectedGrade && selectedGrade[normalizedSubject] && selectedGrade[normalizedSubject][level]) {
    return selectedGrade[normalizedSubject][level];
  }

  return generateRiddleQuestions(normalizedGrade, normalizedSubject, level);
};

export const questionsData = getQuestionsForLevel('grade1', 'math', 1);
export default getQuestionsForLevel;