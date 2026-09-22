// src/data/questions/grade2/math.jsx

export const grade2MathTemplates = [
  {
    q: 'What is 10 + 5?',
    visual: '🔟 + 5️⃣',
    options: ['12', '14', '15', '16'],
    a: '15',
    hint: '10 and 5 make 15.',
    reward: '➕ Number Builder'
  },
  {
    q: 'Which number is even?',
    visual: '2️⃣ 3️⃣ 5️⃣ 7️⃣',
    options: ['2', '3', '5', '7'],
    a: '2',
    hint: 'Even numbers can be paired equally.',
    reward: '🎯 Even Pair'
  },
  {
    q: 'What is 9 - 4?',
    visual: '9️⃣ - 4️⃣',
    options: ['3', '4', '5', '6'],
    a: '5',
    hint: '9 minus 4 is 5.',
    reward: '➖ Subtract Splash'
  },
  {
    q: 'Which time is 2 o’clock?',
    visual: '🕑',
    options: ['2:00', '3:00', '1:00', '4:00'],
    a: '2:00',
    hint: '2 o’clock means 2:00.',
    reward: '🕒 Clock Time'
  },
  {
    q: 'What is 6 + 3?',
    visual: '6️⃣ + 3️⃣',
    options: ['8', '9', '10', '11'],
    a: '9',
    hint: '6 + 3 = 9.',
    reward: '🚀 Quick Sum'
  },
  {
    q: 'Which shape has 4 sides?',
    visual: '🟦 🔺 ⭕',
    options: ['Rectangle', 'Triangle', 'Circle', 'Oval'],
    a: 'Rectangle',
    hint: 'A rectangle has four sides.',
    reward: '🧩 Four Sides'
  },
  {
    q: 'What is 12 + 6?',
    visual: '1️⃣2️⃣ + 6️⃣',
    options: ['16', '18', '20', '22'],
    a: '18',
    hint: '12 + 6 = 18.',
    reward: '🎯 Add More'
  },
  {
    q: 'Which number is odd?',
    visual: '8️⃣ 9️⃣ 10️⃣ 12️⃣',
    options: ['9', '8', '10', '12'],
    a: '9',
    hint: '9 is odd because it cannot make pairs.',
    reward: '🌟 Odd One Out'
  },
  {
    q: 'What is 15 - 7?',
    visual: '1️⃣5️⃣ - 7️⃣',
    options: ['7', '8', '9', '10'],
    a: '8',
    hint: '15 take away 7 leaves 8.',
    reward: '➖ Deep Subtract'
  },
  {
    q: 'How many sides does a hexagon have?',
    visual: '🧩',
    options: ['5', '6', '7', '8'],
    a: '6',
    hint: 'Hexagon means six sides.',
    reward: '🧩 Six-Sided Hero'
  },
  {
    q: 'What is 7 + 8?',
    visual: '7️⃣ + 8️⃣',
    options: ['14', '15', '16', '17'],
    a: '15',
    hint: '7 + 8 = 15.',
    reward: '⭐ Sum Spark'
  },
  {
    q: 'What is 18 - 9?',
    visual: '1️⃣8️⃣ - 9️⃣',
    options: ['8', '9', '10', '11'],
    a: '9',
    hint: '18 minus 9 is 9.',
    reward: '🔢 Take Away'
  },
  {
    q: 'Which number is bigger: 13 or 17?',
    visual: '1️⃣3️⃣ vs 1️⃣7️⃣',
    options: ['13', '17', '15', '11'],
    a: '17',
    hint: '17 is greater than 13.',
    reward: '📈 Bigger Number'
  },
  {
    q: 'What is 5 x 2?',
    visual: '5️⃣ x 2️⃣',
    options: ['7', '9', '10', '12'],
    a: '10',
    hint: '5 groups of 2 make 10.',
    reward: '✖️ Multiply Magic'
  },
  {
    q: 'What is 16 ÷ 4?',
    visual: '1️⃣6️⃣ ÷ 4️⃣',
    options: ['3', '4', '5', '6'],
    a: '4',
    hint: '4 groups of 4 make 16.',
    reward: '➗ Divide Smarts'
  }
];

export const grade2Math = {};

for (let level = 1; level <= 15; level += 1) {
  grade2Math[level] = Array.from({ length: 15 }, (_, index) => {
    const template = grade2MathTemplates[(level + index) % grade2MathTemplates.length];
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

export default grade2Math;
