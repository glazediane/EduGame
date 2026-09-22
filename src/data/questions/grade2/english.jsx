// src/data/questions/grade2/english.jsx

export const grade2EnglishTemplates = [
  {
    q: 'Which word is the opposite of happy?',
    visual: '😊 vs 😢',
    options: ['Sad', 'Big', 'Fast', 'Old'],
    a: 'Sad',
    hint: 'Sad is the opposite of happy.',
    reward: '🔄 Opposite Pair'
  },
  {
    q: 'Choose the correct spelling of the word for a pet that barks.',
    visual: '🐶',
    options: ['Dog', 'Dgo', 'Dg', 'Ddog'],
    a: 'Dog',
    hint: 'A dog is a friendly pet.',
    reward: '🐶 Pet Word'
  },
  {
    q: 'Which word rhymes with "sun"?',
    visual: '☀️',
    options: ['Fun', 'Tree', 'Ball', 'Book'],
    a: 'Fun',
    hint: 'Fun rhymes with sun.',
    reward: '🎶 Rhyme Time'
  },
  {
    q: 'Which sentence is correct?',
    visual: '🧠',
    options: ['I am playing.', 'I playing am.', 'Am I playing.', 'Playing I am.'],
    a: 'I am playing.',
    hint: 'This sentence has the correct word order.',
    reward: '💬 Sentence Builder'
  },
  {
    q: 'Pick the word that means a place where children learn.',
    visual: '🏫',
    options: ['School', 'Park', 'Kitchen', 'Garden'],
    a: 'School',
    hint: 'Children learn at school.',
    reward: '📚 Learning Place'
  },
  {
    q: 'Choose the correct plural word for "box".',
    visual: '📦',
    options: ['Boxes', 'Boxs', 'Boxeses', 'Box'],
    a: 'Boxes',
    hint: 'Boxes is the correct plural form.',
    reward: '📦 Plural Play'
  },
  {
    q: 'Which word tells a person what to do?',
    visual: '🧍',
    options: ['Verb', 'Noun', 'Color', 'Shape'],
    a: 'Verb',
    hint: 'A verb shows an action.',
    reward: '⚡ Action Word'
  },
  {
    q: 'Which word has the long vowel sound in "cake"?',
    visual: '🎂',
    options: ['Cake', 'Cat', 'Car', 'Cap'],
    a: 'Cake',
    hint: 'Cake has the long a sound.',
    reward: '🎵 Long Vowel'
  },
  {
    q: 'Which word is a noun?',
    visual: '🌳',
    options: ['Tree', 'Jump', 'Run', 'Happy'],
    a: 'Tree',
    hint: 'A noun names a person, place, or thing.',
    reward: '🌳 Naming Word'
  },
  {
    q: 'Pick the correct sentence.',
    visual: '✍️',
    options: ['We run to school.', 'Run we to school.', 'School run we.', 'We school run.'],
    a: 'We run to school.',
    hint: 'This sentence has the correct order.',
    reward: '🏫 Good Grammar'
  },
  {
    q: 'Which word is the opposite of fast?',
    visual: '⚡ vs 🐢',
    options: ['Slow', 'Big', 'Happy', 'Cold'],
    a: 'Slow',
    hint: 'Slow is the opposite of fast.',
    reward: '🔄 Opposite Match'
  },
  {
    q: 'Choose the correct pronoun to finish the sentence: ___ am ready.',
    visual: '🙂',
    options: ['I', 'You', 'He', 'We'],
    a: 'I',
    hint: 'The sentence is about yourself.',
    reward: '🧠 Pronoun Power'
  },
  {
    q: 'Which word is a synonym for happy?',
    visual: '😊',
    options: ['Joyful', 'Sad', 'Cold', 'Slow'],
    a: 'Joyful',
    hint: 'Joyful means happy.',
    reward: '😊 Happy Word'
  },
  {
    q: 'Which sentence uses correct capitalization?',
    visual: '📝',
    options: ['The dog barked loudly.', 'the dog barked loudly.', 'The Dog barked loudly.', 'the Dog barked loudly.'],
    a: 'The dog barked loudly.',
    hint: 'The first word in the sentence should start with a capital letter.',
    reward: '✍️ Capital Start'
  },
  {
    q: 'Which word belongs in the sentence: I ___ a book.',
    visual: '📚',
    options: ['read', 'house', 'ball', 'tree'],
    a: 'read',
    hint: 'We read a book.',
    reward: '📚 Fill the Blank'
  }
];

export const grade2English = {};

for (let level = 1; level <= 15; level += 1) {
  grade2English[level] = Array.from({ length: 15 }, (_, index) => {
    const template = grade2EnglishTemplates[(level + index) % grade2EnglishTemplates.length];
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

export default grade2English;
