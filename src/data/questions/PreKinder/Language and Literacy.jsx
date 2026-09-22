// src/data/questions/PreKinder/Language and Literacy.jsx

export const preKinderWordBank = [
  { word: 'Apple', emoji: '🍏', clue: 'A red or green fruit.' },
  { word: 'Bird', emoji: '🐦', clue: 'It can fly and chirp.' },
  { word: 'Sun', emoji: '☀️', clue: 'It shines in the sky.' },
  { word: 'Book', emoji: '📘', clue: 'You read it.' },
  { word: 'Jump', emoji: '🏃', clue: 'You move with your feet.' },
  { word: 'School', emoji: '🏫', clue: 'A place for learning.' },
  { word: 'Tree', emoji: '🌳', clue: 'A tall plant with a trunk.' },
  { word: 'Happy', emoji: '😊', clue: 'A feeling of joy.' },
  { word: 'Rain', emoji: '🌧️', clue: 'Water falls from the clouds.' },
  { word: 'Orange', emoji: '🍊', clue: 'A fruit that is orange.' },
  { word: 'Green', emoji: '🟢', clue: 'The color of grass.' },
  { word: 'Blue', emoji: '🔵', clue: 'The color of the sky.' },
  { word: 'Read', emoji: '📖', clue: 'You do this with a book.' },
  { word: 'Sing', emoji: '🎵', clue: 'You do this with music.' },
  { word: 'Play', emoji: '🎈', clue: 'You have fun and move around.' }
];

const buildPreKinderEnglishQuestion = (level, index) => {
  const word = preKinderWordBank[(level * 3 + index) % preKinderWordBank.length];
  const alternatives = preKinderWordBank.filter((item) => item.word !== word.word).slice(0, 3);
  const options = [word.word, alternatives[0].word, alternatives[1].word, alternatives[2].word];
  const vowels = ['A', 'E', 'I', 'O'];

  const templates = [
    { q: 'What word matches the picture?', visual: word.emoji, options, a: word.word, hint: `This word is ${word.clue.toLowerCase()}.`, reward: '📚 Word Match' },
    { q: `What sound does "${word.word.toLowerCase()}" start with?`, visual: word.emoji, options: [word.word[0], 'M', 'S', 'T'], a: word.word[0], hint: `It starts with ${word.word[0]}.`, reward: '🔤 Sound Start' },
    { q: 'What is this picture called?', visual: word.emoji, options, a: word.word, hint: 'Look carefully at the picture.', reward: '🖼️ Picture Vocabulary' },
    { q: `Which letter is in "${word.word.toLowerCase()}"?`, visual: word.emoji, options: vowels, a: vowels[(index + 1) % vowels.length], hint: 'Think about the sound in the middle.', reward: '🎵 Letter Fun' },
    { q: `Which word sounds like "${word.word.toLowerCase()}"?`, visual: word.emoji, options: ['Sun', 'Tree', 'Book', 'Play'], a: 'Sun', hint: 'Listen for the matching sound.', reward: '🎶 Rhyme Time' }
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

export const preKinderEnglish = {};

for (let level = 1; level <= 15; level += 1) {
  preKinderEnglish[level] = Array.from({ length: 15 }, (_, index) => buildPreKinderEnglishQuestion(level, index));
}

export default preKinderEnglish;
