// src/data/questions/grade1/english.jsx

export const grade1EnglishTemplates = [
  {
    q: 'Choose the word that matches the picture: apple.',
    visual: '🍏',
    options: ['Apple', 'Ball', 'Book', 'Car'],
    a: 'Apple',
    hint: 'An apple is a fruit.',
    reward: '🍏 Word Match'
  },
  {
    q: 'Which word starts with the letter B?',
    visual: '🐝 🐱 🚗 🐼',
    options: ['Bee', 'Cat', 'Car', 'Panda'],
    a: 'Bee',
    hint: 'Bee begins with B.',
    reward: '🔤 Letter Hunt'
  },
  {
    q: 'Choose the correct vowel in the word "cat".',
    visual: 'C A T',
    options: ['A', 'E', 'I', 'O'],
    a: 'A',
    hint: 'The vowel in cat is A.',
    reward: '🎵 Vowel Fun'
  },
  {
    q: 'Which word is a color?',
    visual: '🟡 🟢 🔵 🔴',
    options: ['Yellow', 'House', 'Book', 'Tree'],
    a: 'Yellow',
    hint: 'Yellow is a color name.',
    reward: '🎨 Color Word'
  },
  {
    q: 'Pick the rhyming word for "cat".',
    visual: '🐱',
    options: ['Hat', 'Dog', 'Sun', 'Tree'],
    a: 'Hat',
    hint: 'Hat rhymes with cat.',
    reward: '🎶 Rhyme Time'
  },
  {
    q: 'Which word is a place to read books?',
    visual: '📚',
    options: ['School', 'Tree', 'Car', 'Ball'],
    a: 'School',
    hint: 'Children learn and read there.',
    reward: '📚 Book Place'
  },
  {
    q: 'Choose the word that matches the picture: dog.',
    visual: '🐶',
    options: ['Dog', 'Cat', 'Bird', 'Fish'],
    a: 'Dog',
    hint: 'A dog barks and plays.',
    reward: '🐶 Word Match'
  },
  {
    q: 'Which word is the opposite of big?',
    visual: '🐘 vs 🐭',
    options: ['Small', 'Tall', 'Fast', 'Happy'],
    a: 'Small',
    hint: 'Small means not big.',
    reward: '🔄 Opposite Game'
  },
  {
    q: 'Which word rhymes with "sun"?',
    visual: '☀️',
    options: ['Fun', 'Tree', 'Book', 'Ball'],
    a: 'Fun',
    hint: 'Fun sounds like sun.',
    reward: '🎶 Rhyme Time'
  },
  {
    q: 'Choose the correct sentence.',
    visual: '🧠',
    options: ['The sun shines.', 'The chair sings.', 'The box runs.', 'The tree jumps.'],
    a: 'The sun shines.',
    hint: 'The sun can shine.',
    reward: '💬 Sentence Sense'
  },
  {
    q: 'Which word means a place where you learn?',
    visual: '🏫',
    options: ['School', 'Kitchen', 'Park', 'Garden'],
    a: 'School',
    hint: 'School is where children learn.',
    reward: '📚 Learning Place'
  },
  {
    q: 'Which word ends with the sound "at"?',
    visual: '🎩 🐱 ☀️',
    options: ['Hat', 'Sun', 'Book', 'Ball'],
    a: 'Hat',
    hint: 'Hat ends with at.',
    reward: '🎵 Ending Sound'
  },
  {
    q: 'Which word is a noun?',
    visual: '🌳',
    options: ['Tree', 'Jump', 'Run', 'Happy'],
    a: 'Tree',
    hint: 'A noun is a thing.',
    reward: '🌳 Naming Word'
  },
  {
    q: 'Which word is a verb?',
    visual: '🏃',
    options: ['Run', 'Chair', 'Table', 'Tree'],
    a: 'Run',
    hint: 'A verb shows action.',
    reward: '⚡ Action Word'
  },
  {
    q: 'Pick the correct spelling for the word that means a place with books.',
    visual: '📘',
    options: ['Book', 'Bok', 'Boook', 'Buk'],
    a: 'Book',
    hint: 'The correct spelling is book.',
    reward: '📘 Spelling Star'
  }
];

export const grade1English = {};

for (let level = 1; level <= 15; level += 1) {
  grade1English[level] = Array.from({ length: 15 }, (_, index) => {
    const template = grade1EnglishTemplates[(level + index) % grade1EnglishTemplates.length];
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

export default grade1English;
