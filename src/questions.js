// src/questions.js

// --- Kinder ---
import * as KinderMathModule from './data/questions/kinder/math.jsx';
import * as KinderEnglishModule from './data/questions/kinder/english.jsx';
import * as KinderScienceModule from './data/questions/kinder/science.jsx';

// --- Grade 1 ---
import * as Grade1MathModule from './data/questions/grade1/math.jsx';
import * as Grade1EnglishModule from './data/questions/grade1/english.jsx';
import * as Grade1ScienceModule from './data/questions/grade1/science.jsx';

// --- Grade 2 ---
import * as Grade2MathModule from './data/questions/grade2/math.jsx';
import * as Grade2EnglishModule from './data/questions/grade2/english.jsx';
import * as Grade2ScienceModule from './data/questions/grade2/science.jsx';

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
const extractData = (mod, key) => mod[key] || mod.default || {};

const kinderMath = extractData(KinderMathModule, 'kinderMath');
const kinderEnglish = extractData(KinderEnglishModule, 'kinderEnglish');
const kinderScience = extractData(KinderScienceModule, 'kinderScience');

const grade1Math = extractData(Grade1MathModule, 'grade1Math');
const grade1English = extractData(Grade1EnglishModule, 'grade1English');
const grade1Science = extractData(Grade1ScienceModule, 'grade1Science');

const grade2Math = extractData(Grade2MathModule, 'grade2Math');
const grade2English = extractData(Grade2EnglishModule, 'grade2English');
const grade2Science = extractData(Grade2ScienceModule, 'grade2Science');

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

// Master Question Bank strictly organized by Grade Folder > Subject > Level
export const questionBank = {
  kinder: { math: kinderMath, english: kinderEnglish, science: kinderScience },
  grade1: { math: grade1Math, english: grade1English, science: grade1Science },
  grade2: { math: grade2Math, english: grade2English, science: grade2Science },
  grade3: { math: grade3Math, english: grade3English, science: grade3Science },
  grade4: { math: grade4Math, english: grade4English, science: grade4Science },
  grade5: { math: grade5Math, english: grade5English, science: grade5Science },
  grade6: { math: grade6Math, english: grade6English, science: grade6Science }
};

// Fallback riddle question generator if a level isn't explicitly detailed yet
const generateRiddleQuestions = (grade, subject, level) => {
  return Array.from({ length: 10 }, (_, i) => ({
    q: `[${grade.toUpperCase()} - ${subject.toUpperCase()} - Level ${level}] Question #${i + 1}`,
    options: ["Option A", "Option B", "Option C"],
    a: "Option A",
    hint: `Riddle: Choose Option A to clear level ${level}!`
  }));
};

// Strictly pulls questions matching the student's assigned grade
export const getQuestionsForLevel = (grade = 'kinder', subject = 'math', level = 1) => {
  const normalizedGrade = (grade || 'kinder').toLowerCase().replace(/\s+/g, '');
  const selectedGrade = questionBank[normalizedGrade];

  if (selectedGrade && selectedGrade[subject] && selectedGrade[subject][level]) {
    return selectedGrade[subject][level];
  }

  return generateRiddleQuestions(normalizedGrade, subject, level);
};

export const questionsData = getQuestionsForLevel('kinder', 'math', 1);
export default getQuestionsForLevel;