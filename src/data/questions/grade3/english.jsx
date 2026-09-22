// src/data/questions/grade3/english.jsx

const grade3EnglishTemplates = [
  { q: 'Which word is a noun?', visual: '🌳', options: ['Tree', 'Jump', 'Run', 'Happy'], a: 'Tree', hint: 'A noun names a person, place, or thing.', reward: '🌳 Naming Word' },
  { q: 'Choose the correct spelling: b_ _k', visual: '📘', options: ['Book', 'Bok', 'Boook', 'Buk'], a: 'Book', hint: 'Book is spelled with oo.', reward: '📘 Spelling Star' },
  { q: 'Which word is the opposite of slow?', visual: '🐢 vs 🐇', options: ['Fast', 'Soft', 'Small', 'Cold'], a: 'Fast', hint: 'Fast is the opposite of slow.', reward: '⚡ Opposite Chase' },
  { q: 'Which sentence uses the correct punctuation?', visual: '❓', options: ['Where are you?', 'Where are you', 'Where are you!', 'Where are you.'], a: 'Where are you?', hint: 'Questions end with a question mark.', reward: '❓ Punctuation Power' },
  { q: 'Choose the word that rhymes with "light".', visual: '💡', options: ['Bright', 'House', 'Tree', 'Book'], a: 'Bright', hint: 'Bright rhymes with light.', reward: '🎶 Rhyme Time' },
  { q: 'Which word is a verb?', visual: '🏃', options: ['Run', 'Chair', 'Table', 'Mountain'], a: 'Run', hint: 'Run is an action word.', reward: '⚡ Action Word' },
  { q: 'Select the correct contraction for "I am".', visual: '🙂', options: ['I’m', 'I amn’t', 'Im', 'Iare'], a: 'I’m', hint: 'I am becomes I’m.', reward: '📝 Short Form' },
  { q: 'Which word is a synonym for happy?', visual: '😊', options: ['Joyful', 'Sad', 'Old', 'Slow'], a: 'Joyful', hint: 'Joyful means happy.', reward: '😊 Happy Word' },
  { q: 'Pick the sentence with the correct capitalization.', visual: '📝', options: ['The dog barked loudly.', 'the dog barked loudly.', 'The Dog barked loudly.', 'the Dog barked loudly.'], a: 'The dog barked loudly.', hint: 'The first word in a sentence starts with a capital letter.', reward: '✍️ Capital Start' },
  { q: 'Which word belongs in the sentence: I ___ a book.', visual: '📚', options: ['read', 'house', 'ball', 'tree'], a: 'read', hint: 'We read a book.', reward: '📚 Fill the Blank' },
  { q: 'Which word is a pronoun?', visual: '🙂', options: ['He', 'Table', 'Book', 'Tree'], a: 'He', hint: 'He takes the place of a noun.', reward: '🧠 Pronoun Power' },
  { q: 'Choose the correct plural form of "child".', visual: '👶', options: ['Childs', 'Children', 'Childes', 'Child'], a: 'Children', hint: 'Children is the irregular plural form.', reward: '👨‍👧 Plural Play' },
  { q: 'Which sentence is a question?', visual: '❔', options: ['The sky is blue.', 'I am happy.', 'Where are you going?', 'Please sit down.'], a: 'Where are you going?', hint: 'A question ends with a question mark.', reward: '❓ Question Time' },
  { q: 'Which word means the opposite of noisy?', visual: '🔇', options: ['Quiet', 'Loud', 'Fast', 'Tall'], a: 'Quiet', hint: 'Quiet is the opposite of noisy.', reward: '🤫 Quiet Word' },
  { q: 'Pick the correct word to complete the sentence: We ___ to school every day.', visual: '🏫', options: ['go', 'house', 'run', 'book'], a: 'go', hint: 'We go to school every day.', reward: '🏫 Daily Routine' }
];

export const grade3English = {};

for (let level = 1; level <= 15; level += 1) {
  grade3English[level] = Array.from({ length: 15 }, (_, index) => {
    const template = grade3EnglishTemplates[(level + index) % grade3EnglishTemplates.length];
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

export default grade3English;
