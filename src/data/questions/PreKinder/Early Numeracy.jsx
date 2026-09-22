// src/data/questions/PreKinder/Early Numeracy.jsx

export const preKinderMathTemplates = [
  { q: 'Count the ducks: 🦆🦆🦆🦆🦆', visual: '🦆🦆🦆🦆🦆', options: ['4', '5', '6', '7'], a: '5', hint: 'Count all the ducks.', reward: '🦆 Duck Count' },
  { q: 'What is 3 + 2?', visual: '3️⃣ + 2️⃣', options: ['4', '5', '6', '7'], a: '5', hint: '3 and 2 make 5.', reward: '➕ Add It Up' },
  { q: 'What is 6 - 2?', visual: '6️⃣ - 2️⃣', options: ['3', '4', '5', '6'], a: '4', hint: 'Take away 2 from 6.', reward: '➖ Take Away' },
  { q: 'Which number is next after 8?', visual: '8️⃣ ?', options: ['7', '8', '9', '10'], a: '9', hint: 'The next number after 8 is 9.', reward: '🔢 Number Jump' },
  { q: 'Which is a square?', visual: '🟦 🔺 🔴 ⭕', options: ['Square', 'Triangle', 'Circle', 'Star'], a: 'Square', hint: 'A square has four equal sides.', reward: '🧩 Shape Match' },
  { q: 'How many flowers are here? 🌼🌼🌼🌼', visual: '🌼🌼🌼🌼', options: ['3', '4', '5', '6'], a: '4', hint: 'Count each flower.', reward: '🌼 Flower Count' },
  { q: 'What is 5 + 1?', visual: '5️⃣ + 1️⃣', options: ['5', '6', '7', '8'], a: '6', hint: 'One more than 5 is 6.', reward: '✨ One More' },
  { q: 'Which number is bigger: 7 or 4?', visual: '7️⃣ vs 4️⃣', options: ['4', '7', '6', '5'], a: '7', hint: '7 is larger than 4.', reward: '🚀 Bigger Number' },
  { q: 'What comes before 10?', visual: '? 1️⃣0️⃣', options: ['8', '9', '10', '11'], a: '9', hint: 'The number before 10 is 9.', reward: '⏮️ Before Me' },
  { q: 'What is 8 - 3?', visual: '8️⃣ - 3️⃣', options: ['4', '5', '6', '7'], a: '5', hint: '8 minus 3 leaves 5.', reward: '🧮 Subtract Fun' },
  { q: 'Which shape has 3 sides?', visual: '🔺', options: ['Triangle', 'Square', 'Circle', 'Rectangle'], a: 'Triangle', hint: 'A triangle has three sides.', reward: '🔺 Side Count' },
  { q: 'How many balls? ⚽⚽⚽⚽⚽⚽', visual: '⚽⚽⚽⚽⚽⚽', options: ['5', '6', '7', '8'], a: '6', hint: 'Count the balls carefully.', reward: '⚽ Ball Count' },
  { q: 'What is 2 + 5?', visual: '2️⃣ + 5️⃣', options: ['6', '7', '8', '9'], a: '7', hint: 'Two and five make seven.', reward: '🌟 Number Boost' },
  { q: 'Which number is smaller: 9 or 2?', visual: '9️⃣ vs 2️⃣', options: ['2', '9', '8', '7'], a: '2', hint: '2 is smaller than 9.', reward: '📉 Small Number' },
  { q: 'How many crayons are there? 🖍️🖍️🖍️🖍️🖍️🖍️', visual: '🖍️🖍️🖍️🖍️🖍️🖍️', options: ['5', '6', '7', '8'], a: '6', hint: 'Count each crayon.', reward: '🖍️ Crayon Count' }
];

export const preKinderMath = {};

for (let level = 1; level <= 15; level += 1) {
  preKinderMath[level] = Array.from({ length: 15 }, (_, index) => {
    const template = preKinderMathTemplates[(level + index) % preKinderMathTemplates.length];
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

export default preKinderMath;
