const grade3MathTemplates = [
  { q: 'What is 12 + 8?', visual: '1️⃣2️⃣ + 8️⃣', options: ['18', '19', '20', '21'], a: '20', hint: '12 + 8 = 20.', reward: '➕ Big Sum' },
  { q: 'Which number is a multiple of 5?', visual: '5️⃣ 10️⃣ 15️⃣', options: ['15', '11', '13', '17'], a: '15', hint: 'Multiples of 5 end with 0 or 5.', reward: '🎯 Multiple Match' },
  { q: 'What is 7 x 3?', visual: '7️⃣ x 3️⃣', options: ['20', '21', '24', '27'], a: '21', hint: '7 groups of 3 make 21.', reward: '✖️ Multiply Magic' },
  { q: 'Which fraction is bigger: 1/2 or 1/4?', visual: '½ ¼', options: ['1/2', '1/4', 'Equal', 'None'], a: '1/2', hint: 'Half is larger than a quarter.', reward: '🍕 Fraction Fun' },
  { q: 'What is 20 - 9?', visual: '2️⃣0️⃣ - 9️⃣', options: ['10', '11', '12', '13'], a: '11', hint: '20 minus 9 is 11.', reward: '➖ Quick Takeaway' },
  { q: 'How many minutes are in 1 hour?', visual: '🕒', options: ['30', '60', '90', '120'], a: '60', hint: 'There are 60 minutes in one hour.', reward: '⏰ Time Travel' },
  { q: 'What is 24 ÷ 6?', visual: '2️⃣4️⃣ ÷ 6️⃣', options: ['3', '4', '5', '6'], a: '4', hint: '6 groups of 4 make 24.', reward: '➗ Divide Delight' },
  { q: 'Which number is in the hundreds place in 456?', visual: '4️⃣5️⃣6️⃣', options: ['4', '5', '6', '0'], a: '4', hint: 'The 4 is in the hundreds place.', reward: '🏷️ Place Value' },
  { q: 'What is 8 + 7?', visual: '8️⃣ + 7️⃣', options: ['13', '14', '15', '16'], a: '15', hint: '8 and 7 make 15.', reward: '💡 Sum Spark' },
  { q: 'Which shape has 3 sides?', visual: '🔺', options: ['Triangle', 'Circle', 'Square', 'Rectangle'], a: 'Triangle', hint: 'A triangle has three sides.', reward: '🔺 Triangle Time' },
  { q: 'What is 15 + 7?', visual: '1️⃣5️⃣ + 7️⃣', options: ['20', '21', '22', '23'], a: '22', hint: '15 and 7 make 22.', reward: '✨ Number Boost' },
  { q: 'What is 18 - 6?', visual: '1️⃣8️⃣ - 6️⃣', options: ['10', '11', '12', '13'], a: '12', hint: '18 minus 6 is 12.', reward: '➖ Subtract Smart' },
  { q: 'What is 9 x 4?', visual: '9️⃣ x 4️⃣', options: ['32', '34', '36', '38'], a: '36', hint: '9 groups of 4 make 36.', reward: '✖️ Multiply Power' },
  { q: 'Which fraction is equal to 1/2?', visual: '½', options: ['2/4', '1/3', '3/4', '1/5'], a: '2/4', hint: 'Two quarters is the same as one half.', reward: '🧮 Equal Fractions' },
  { q: 'How many minutes are in 2 hours?', visual: '🕒', options: ['60', '90', '120', '150'], a: '120', hint: '1 hour = 60 minutes, so 2 hours = 120 minutes.', reward: '⏱️ Time Count' }
];

export const grade3Math = {};

for (let level = 1; level <= 15; level += 1) {
  grade3Math[level] = Array.from({ length: 15 }, (_, index) => {
    const template = grade3MathTemplates[(level + index) % grade3MathTemplates.length];
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

export default grade3Math;
