// src/data/questions/kinder/math.jsx

const shapeNames = ['Circle', 'Square', 'Triangle', 'Rectangle'];
const colorWords = ['Red', 'Blue', 'Yellow', 'Green', 'Orange'];
const animalNames = ['Cat', 'Dog', 'Cow', 'Bird', 'Fish'];

const normalizeOptions = (options, answer) => {
  const cleanAnswer = String(answer);
  const uniqueOptions = [...new Set((options || []).map((item) => String(item)))];
  const withoutAnswer = uniqueOptions.filter((item) => item !== cleanAnswer);
  const finalOptions = [cleanAnswer, ...withoutAnswer].slice(0, 4);

  while (finalOptions.length < 4) {
    finalOptions.push('Option');
  }

  return finalOptions.slice(0, 4);
};

const buildKinderMathQuestion = (level, index) => {
  const levelSeed = level + index + 1;
  const countValue = (level + index) % 7 + 2;
  const left = (level % 6) + 2;
  const right = (index % 5) + 1;
  const sum = left + right;
  const diff = left >= right ? left - right : right - left;
  const nextNumber = level + index + 2;
  const patternStart = (level % 4) + 2;
  const bigger = level + 3;
  const smaller = level + 1;

  const templates = [
    {
      q: 'How many stars do you see?',
      visual: `${'⭐ '.repeat(countValue).trim()}`,
      options: [String(countValue - 1), String(countValue), String(countValue + 1), String(countValue + 2)],
      a: String(countValue),
      hint: 'Count the stars one by one.',
      reward: '⭐ Star Count'
    },
    {
      q: `What is ${left} + ${right}?`,
      visual: `${left}️⃣ + ${right}️⃣`,
      options: [String(sum - 1), String(sum), String(sum + 1), String(sum + 2)],
      a: String(sum),
      hint: 'Add both numbers together.',
      reward: '➕ Add It Up'
    },
    {
      q: `What is ${left + 2} - ${right}?`,
      visual: `${left + 2}️⃣ - ${right}️⃣`,
      options: [String(diff), String(diff + 1), String(diff + 2), String(diff + 3)],
      a: String(diff),
      hint: 'Take away the smaller number.',
      reward: '➖ Minus Fun'
    },
    {
      q: 'Which one is a circle?',
      visual: '🔴🟦🔺🟩',
      options: shapeNames,
      a: 'Circle',
      hint: 'A circle is round and does not have corners.',
      reward: '🌈 Shape Spotter'
    },
    {
      q: `What comes next: ${patternStart}, ${patternStart + 1}, ${patternStart + 2}, __?`,
      visual: `${patternStart}️⃣ ${patternStart + 1}️⃣ ${patternStart + 2}️⃣ ?`,
      options: [String(patternStart + 3), String(patternStart + 4), String(patternStart + 5), String(patternStart + 6)],
      a: String(patternStart + 3),
      hint: 'The pattern is adding 1 each time.',
      reward: '🔢 Number Jump'
    },
    {
      q: `Which number is bigger: ${bigger} or ${smaller}?`,
      visual: `${bigger}️⃣ vs ${smaller}️⃣`,
      options: [String(smaller), String(bigger), String(bigger - 1), String(smaller - 1)],
      a: String(bigger),
      hint: 'Compare the numbers and choose the larger one.',
      reward: '🚀 Big Number'
    },
    {
      q: `What is ${countValue} + 1?`,
      visual: `${countValue}️⃣ + 1️⃣`,
      options: [String(countValue - 1), String(countValue), String(countValue + 1), String(countValue + 2)],
      a: String(countValue + 1),
      hint: 'Count 1 more.',
      reward: '🎯 One More'
    },
    {
      q: `What is ${countValue} - 1?`,
      visual: `${countValue}️⃣ - 1️⃣`,
      options: [String(countValue - 2), String(countValue - 1), String(countValue), String(countValue + 1)],
      a: String(countValue - 1),
      hint: 'Take away 1.',
      reward: '🎯 One Less'
    },
    {
      q: `Which color is blue?`,
      visual: '🔵🟡🟢🔴',
      options: colorWords,
      a: 'Blue',
      hint: 'Blue is the color of the sky.',
      reward: '🎨 Color Fun'
    },
    {
      q: `Which animal says "meow"?`,
      visual: '🐱🐶🐮🐥',
      options: animalNames,
      a: 'Cat',
      hint: 'A cat says meow.',
      reward: '🐾 Animal Sound'
    },
    {
      q: `What number comes before ${level + 2}?`,
      visual: `? ${level + 2}️⃣`,
      options: [String(level + 1), String(level + 2), String(level + 3), String(level + 4)],
      a: String(level + 1),
      hint: 'Think of the number right before it.',
      reward: '⏮️ Before Me'
    },
    {
      q: `Count the apples: ${'🍎 '.repeat(level + 2).trim()}`,
      visual: `${'🍎 '.repeat(level + 2).trim()}`,
      options: [String(level + 1), String(level + 2), String(level + 3), String(level + 4)],
      a: String(level + 2),
      hint: 'Count the apples carefully.',
      reward: '🍎 Apple Count'
    },
    {
      q: `Which number is smaller: ${nextNumber} or ${nextNumber + 1}?`,
      visual: `${nextNumber}️⃣ vs ${nextNumber + 1}️⃣`,
      options: [String(nextNumber), String(nextNumber + 1), String(nextNumber + 2), String(nextNumber + 3)],
      a: String(nextNumber),
      hint: 'The smaller number is the one that comes first.',
      reward: '📉 Small Number'
    },
    {
      q: `What is ${left} + 1?`,
      visual: `${left}️⃣ + 1️⃣`,
      options: [String(left - 1), String(left), String(left + 1), String(left + 2)],
      a: String(left + 1),
      hint: 'Add one more to the number.',
      reward: '✨ Number Plus One'
    },
    {
      q: `What is ${right + 3} - ${right}?`,
      visual: `${right + 3}️⃣ - ${right}️⃣`,
      options: [String(2), String(3), String(4), String(5)],
      a: String(3),
      hint: 'Take away the same number from a larger number.',
      reward: '🧮 Quick Take Away'
    }
  ];

  const chosen = templates[(level + index) % templates.length];
  const safeOptions = normalizeOptions(chosen.options, chosen.a);

  return {
    q: chosen.q,
    visual: chosen.visual,
    options: safeOptions,
    optionIcons: ['1️⃣', '2️⃣', '3️⃣', '4️⃣'],
    a: String(chosen.a),
    hint: chosen.hint,
    reward: chosen.reward
  };
};

export const kinderMath = {};

for (let level = 1; level <= 15; level += 1) {
  kinderMath[level] = Array.from({ length: 15 }, (_, index) => buildKinderMathQuestion(level, index));
}

export default kinderMath;
