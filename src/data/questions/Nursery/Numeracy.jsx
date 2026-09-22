// src/data/questions/Nursery/Numeracy.jsx

export const nurseryMathTemplates = [
  { q: 'How many apples do you see?', visual: '🍏🍏🍏', options: ['2', '3', '4', '5'], a: '3', hint: 'Count each apple one by one.', reward: '🍏 Count Fun' },
  { q: 'What is 1 + 1?', visual: '1️⃣ + 1️⃣', options: ['1', '2', '3', '4'], a: '2', hint: 'One more than one is two.', reward: '➕ Number Friends' },
  { q: 'Which number comes after 4?', visual: '4️⃣ ?', options: ['3', '4', '5', '6'], a: '5', hint: 'The next number after 4 is 5.', reward: '🔢 Next Number' },
  { q: 'What is 3 - 1?', visual: '3️⃣ - 1️⃣', options: ['1', '2', '3', '4'], a: '2', hint: 'Take away 1 from 3.', reward: '➖ Take Away' },
  { q: 'Which shape is round?', visual: '🔵 🔺 🟦 🟩', options: ['Circle', 'Triangle', 'Square', 'Rectangle'], a: 'Circle', hint: 'A circle is round with no corners.', reward: '🌈 Shape Match' },
  { q: 'How many stars are here?', visual: '⭐ ⭐ ⭐ ⭐', options: ['3', '4', '5', '6'], a: '4', hint: 'Count the stars carefully.', reward: '⭐ Star Count' },
  { q: 'Which number is bigger: 2 or 5?', visual: '2️⃣ vs 5️⃣', options: ['2', '5', '3', '4'], a: '5', hint: '5 is more than 2.', reward: '🚀 Bigger Number' },
  { q: 'What is 2 + 2?', visual: '2️⃣ + 2️⃣', options: ['2', '3', '4', '5'], a: '4', hint: 'Two and two make four.', reward: '✨ Double Up' },
  { q: 'Which number comes before 7?', visual: '? 7️⃣', options: ['5', '6', '7', '8'], a: '6', hint: 'The number before 7 is 6.', reward: '⏮️ Before Me' },
  { q: 'How many blocks do you see?', visual: '🧱🧱🧱🧱🧱', options: ['4', '5', '6', '7'], a: '5', hint: 'Count each block.', reward: '🧱 Block Count' },
  { q: 'What is 4 + 1?', visual: '4️⃣ + 1️⃣', options: ['4', '5', '6', '7'], a: '5', hint: 'Add one more to 4.', reward: '🎯 One More' },
  { q: 'Which number is smaller: 3 or 1?', visual: '3️⃣ vs 1️⃣', options: ['1', '3', '4', '5'], a: '1', hint: '1 is less than 3.', reward: '📉 Small Number' },
  { q: 'How many cookies are there?', visual: '🍪🍪🍪🍪', options: ['3', '4', '5', '6'], a: '4', hint: 'Count the cookies.', reward: '🍪 Cookie Count' },
  { q: 'What is 5 - 2?', visual: '5️⃣ - 2️⃣', options: ['2', '3', '4', '5'], a: '3', hint: 'Take away 2 from 5.', reward: '🧮 Minus Fun' },
  { q: 'Which shape has 3 sides?', visual: '🔺', options: ['Triangle', 'Circle', 'Square', 'Rectangle'], a: 'Triangle', hint: 'A triangle has three sides.', reward: '🔺 Sides Count' }
];

export const nurseryMath = {};

for (let level = 1; level <= 15; level += 1) {
  nurseryMath[level] = Array.from({ length: 15 }, (_, index) => {
    const template = nurseryMathTemplates[(level + index) % nurseryMathTemplates.length];
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

export default nurseryMath;
