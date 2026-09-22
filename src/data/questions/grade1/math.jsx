// src/data/questions/grade1/math.jsx

export const grade1MathTemplates = [
  {
    q: 'How many stars do you see?',
    visual: '⭐ ⭐ ⭐ ⭐',
    options: ['3', '4', '5', '6'],
    a: '4',
    hint: 'Count all the stars together.',
    reward: '⭐ Star Count'
  },
  {
    q: 'What is 3 + 2?',
    visual: '3️⃣ + 2️⃣',
    options: ['4', '5', '6', '7'],
    a: '5',
    hint: 'Add the two numbers together.',
    reward: '➕ Add It Up'
  },
  {
    q: 'What is 6 - 1?',
    visual: '6️⃣ - 1️⃣',
    options: ['4', '5', '6', '7'],
    a: '5',
    hint: 'Take away 1 from 6.',
    reward: '➖ Minus Fun'
  },
  {
    q: 'Which number comes after 7?',
    visual: '7️⃣ ?',
    options: ['6', '7', '8', '9'],
    a: '8',
    hint: 'Think of the next number.',
    reward: '🔢 Number Jump'
  },
  {
    q: 'Which shape is a square?',
    visual: '🟦 🔺 🔴 ⭕',
    options: ['Square', 'Triangle', 'Circle', 'Star'],
    a: 'Square',
    hint: 'A square has 4 equal sides.',
    reward: '🧩 Shape Match'
  },
  {
    q: 'What is 5 + 3?',
    visual: '5️⃣ + 3️⃣',
    options: ['7', '8', '9', '10'],
    a: '8',
    hint: '5 and 3 make 8.',
    reward: '🚀 Number Boost'
  },
  {
    q: 'Which number is bigger: 9 or 2?',
    visual: '9️⃣ vs 2️⃣',
    options: ['9', '2', '7', '5'],
    a: '9',
    hint: 'Compare both numbers and choose the larger one.',
    reward: '📈 Bigger Number'
  },
  {
    q: 'What is 4 + 4?',
    visual: '4️⃣ + 4️⃣',
    options: ['7', '8', '9', '10'],
    a: '8',
    hint: 'Double 4 is 8.',
    reward: '🎯 Double Up'
  },
  {
    q: 'What number comes before 10?',
    visual: '? 1️⃣0️⃣',
    options: ['8', '9', '10', '11'],
    a: '9',
    hint: 'Find the number right before 10.',
    reward: '⏮️ Before Me'
  },
  {
    q: 'Which number is smaller: 3 or 6?',
    visual: '3️⃣ vs 6️⃣',
    options: ['3', '6', '8', '9'],
    a: '3',
    hint: 'The smaller number is the one that comes first.',
    reward: '📉 Small Number'
  },
  {
    q: 'How many sides does a triangle have?',
    visual: '🔺',
    options: ['2', '3', '4', '5'],
    a: '3',
    hint: 'A triangle has three sides.',
    reward: '🔺 Side Count'
  },
  {
    q: 'Which is longer?',
    visual: '📏 vs 🪵',
    options: ['Ruler', 'Stick', 'Both same', 'None'],
    a: 'Ruler',
    hint: 'The ruler is longer than the stick.',
    reward: '📏 Measure It'
  },
  {
    q: 'What is 2 + 5?',
    visual: '2️⃣ + 5️⃣',
    options: ['6', '7', '8', '9'],
    a: '7',
    hint: '2 and 5 make 7.',
    reward: '✨ Number Hooray'
  },
  {
    q: 'What is 8 - 2?',
    visual: '8️⃣ - 2️⃣',
    options: ['5', '6', '7', '8'],
    a: '6',
    hint: 'Take 2 away from 8.',
    reward: '🔢 Subtract Fun'
  },
  {
    q: 'Which one is a circle?',
    visual: '🔴 🟦 🔺 🟩',
    options: ['Circle', 'Square', 'Triangle', 'Rectangle'],
    a: 'Circle',
    hint: 'A circle is round.',
    reward: '🌈 Shape Spotter'
  }
];

export const grade1Math = {};

for (let level = 1; level <= 15; level += 1) {
  grade1Math[level] = Array.from({ length: 15 }, (_, index) => {
    const template = grade1MathTemplates[(level + index) % grade1MathTemplates.length];
    return {
      q: template.q,
      visual: template.visual,
      options: template.options,
      optionIcons: ['1️⃣', '2️⃣', '3️⃣', '4️⃣'],
      a: template.a,
      hint: template.hint,
      reward: template.reward
    };
  });
}

export default grade1Math;
