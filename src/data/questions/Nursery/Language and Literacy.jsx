// src/data/questions/Nursery/Language and Literacy.jsx

export const nurseryWordBank = [
  { word: 'Cat', emoji: '🐱', clue: 'A pet that says meow.' },
  { word: 'Dog', emoji: '🐶', clue: 'A pet that barks.' },
  { word: 'Sun', emoji: '☀️', clue: 'It shines in the sky.' },
  { word: 'Ball', emoji: '⚽', clue: 'You kick or throw it.' },
  { word: 'Book', emoji: '📘', clue: 'You read it.' },
  { word: 'Apple', emoji: '🍏', clue: 'A fruit that is red or green.' },
  { word: 'Star', emoji: '⭐', clue: 'It shines at night.' },
  { word: 'Tree', emoji: '🌳', clue: 'It grows tall in the yard.' },
  { word: 'School', emoji: '🏫', clue: 'A place to learn.' },
  { word: 'Red', emoji: '🔴', clue: 'The color of an apple.' },
  { word: 'Blue', emoji: '🔵', clue: 'The color of the sky.' },
  { word: 'Happy', emoji: '😊', clue: 'A feeling of joy.' },
  { word: 'Run', emoji: '🏃', clue: 'You move fast on your feet.' },
  { word: 'Jump', emoji: '🤸', clue: 'You move up and down.' },
  { word: 'Sing', emoji: '🎵', clue: 'You do this with music.' }
];

const buildNurseryEnglishQuestion = (level, index) => {
  const word = nurseryWordBank[(level * 3 + index) % nurseryWordBank.length];
  const alternatives = nurseryWordBank.filter((item) => item.word !== word.word).slice(0, 3);
  const options = [word.word, alternatives[0].word, alternatives[1].word, alternatives[2].word];
  const templates = [
    { q: `Which word matches this picture?`, visual: word.emoji, options, a: word.word, hint: `This word is ${word.clue.toLowerCase()}.`, reward: '📚 Word Match' },
    { q: `What letter does the word "${word.word.toLowerCase()}" start with?`, visual: word.emoji, options: [word.word[0], 'M', 'S', 'T'], a: word.word[0], hint: `It starts with ${word.word[0]}.`, reward: '🔤 Letter Sound' },
    { q: `Which word is a picture of a ${word.word.toLowerCase()}?`, visual: word.emoji, options, a: word.word, hint: 'Look at the picture and choose the matching word.', reward: '🖼️ Picture Word' },
    { q: `Pick the word that means the same as ${word.word === 'Happy' ? 'happy' : 'cat'}.`, visual: word.emoji, options: ['Happy', 'Blue', 'Book', 'Sun'], a: word.word === 'Happy' ? 'Happy' : 'Happy', hint: 'Think about the feeling or picture.', reward: '😊 Vocabulary Fun' },
    { q: `Which word rhymes with ${word.word === 'Cat' ? 'cat' : 'sun'}?`, visual: word.emoji, options: ['Hat', 'Book', 'Ball', 'Tree'], a: 'Hat', hint: 'Look for a word that sounds alike.', reward: '🎶 Rhyme Time' }
  ];

  const chosen = templates[index % templates.length];
  return {
    q: chosen.q,
    visual: chosen.visual,
    options: chosen.options,
    optionIcons: ['✅', '🎯', '🌟', '✨'],
    a: chosen.a,
    hint: chosen.hint,
    reward: chosen.reward
  };
};

export const nurseryEnglish = {};

for (let level = 1; level <= 15; level += 1) {
  nurseryEnglish[level] = Array.from({ length: 15 }, (_, index) => buildNurseryEnglishQuestion(level, index));
}

export default nurseryEnglish;
