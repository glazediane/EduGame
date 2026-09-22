// src/data/questions/kinder/english.jsx

export const kinderWordBank = [
  { word: 'Apple', emoji: '🍏', clue: 'A fruit that is red or green.' },
  { word: 'Ball', emoji: '⚽', clue: 'You kick or throw it.' },
  { word: 'Sun', emoji: '☀️', clue: 'It shines in the sky.' },
  { word: 'Cat', emoji: '🐱', clue: 'A pet that meows.' },
  { word: 'Dog', emoji: '🐶', clue: 'A pet that barks.' },
  { word: 'Fish', emoji: '🐟', clue: 'It swims in water.' },
  { word: 'Book', emoji: '📘', clue: 'You read it.' },
  { word: 'School', emoji: '🏫', clue: 'A place to learn.' },
  { word: 'Star', emoji: '⭐', clue: 'It shines in the sky at night.' },
  { word: 'Tree', emoji: '🌳', clue: 'It grows in the ground.' },
  { word: 'Green', emoji: '🟢', clue: 'The color of grass.' },
  { word: 'Yellow', emoji: '🟡', clue: 'The color of a banana.' },
  { word: 'Read', emoji: '📖', clue: 'You do this with a book.' },
  { word: 'Jump', emoji: '🏃', clue: 'You do this with your feet.' },
  { word: 'Happy', emoji: '😊', clue: 'A feeling of joy.' }
];

const buildKinderEnglishQuestion = (level, index) => {
  const word = kinderWordBank[(level * 3 + index) % kinderWordBank.length];
  const choiceIndex = index % 4;
  const alternatives = kinderWordBank.filter((item) => item.word !== word.word).slice(0, 3);
  const options = [word.word, alternatives[0].word, alternatives[1].word, alternatives[2].word];
  const vowels = ['A', 'E', 'I', 'O'];

  const templates = [
    {
      q: `Choose the word that matches the picture: ${word.word}.`,
      visual: word.emoji,
      options,
      a: word.word,
      hint: `This word is ${word.clue.toLowerCase()}.`,
      reward: '📚 Word Match'
    },
    {
      q: `Which letter begins the word "${word.word.toLowerCase()}"?`,
      visual: word.emoji,
      options: [word.word[0], 'M', 'S', 'T'],
      a: word.word[0],
      hint: `The first letter is ${word.word[0]}.`,
      reward: '🔤 Letter Start'
    },
    {
      q: `Which word rhymes with "${word.word.toLowerCase()}"?`,
      visual: word.emoji,
      options: [word.word, 'Fun', 'Sun', 'Run'],
      a: 'Sun',
      hint: 'Look for a word that sounds alike.',
      reward: '🎶 Rhyme Time'
    },
    {
      q: `Choose the correct vowel in the word "${word.word.toLowerCase()}".`,
      visual: word.emoji,
      options: vowels,
      a: vowels[(choiceIndex + 1) % vowels.length],
      hint: 'Think about the sound in the word.',
      reward: '🎵 Vowel Fun'
    },
    {
      q: `Which word is the opposite of ${word.word === 'Happy' ? 'happy' : 'big'}?`,
      visual: word.emoji,
      options: ['Small', 'Tall', 'Fast', 'Happy'],
      a: 'Small',
      hint: 'Think of the opposite meaning.',
      reward: '🔄 Opposite Game'
    }
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

export const kinderEnglish = {};

for (let level = 1; level <= 15; level += 1) {
  kinderEnglish[level] = Array.from({ length: 15 }, (_, index) => buildKinderEnglishQuestion(level, index));
}

export default kinderEnglish;
