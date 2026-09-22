// src/data/questions/kinder/science.jsx

export const kinderScienceFacts = [
  { word: 'Fish', emoji: '🐟', clue: 'Lives in water.' },
  { word: 'Water', emoji: '💧', clue: 'A liquid we drink.' },
  { word: 'Air', emoji: '🌬️', clue: 'We breathe it.' },
  { word: 'Sun', emoji: '☀️', clue: 'A bright star that gives light.' },
  { word: 'Plant', emoji: '🌱', clue: 'It grows in soil.' },
  { word: 'Tree', emoji: '🌳', clue: 'A tall plant.' },
  { word: 'Bird', emoji: '🐦', clue: 'It has wings.' },
  { word: 'Moon', emoji: '🌙', clue: 'It shines at night.' },
  { word: 'Winter', emoji: '❄️', clue: 'A cold season.' },
  { word: 'Spring', emoji: '🌷', clue: 'Flowers bloom in this season.' },
  { word: 'Rock', emoji: '🪨', clue: 'A hard solid object.' },
  { word: 'Eyes', emoji: '👀', clue: 'We use them to see.' },
  { word: 'Ears', emoji: '👂', clue: 'We use them to hear.' },
  { word: 'Flower', emoji: '🌼', clue: 'A colorful part of a plant.' },
  { word: 'Lamp', emoji: '💡', clue: 'It gives light.' }
];

const buildKinderScienceQuestion = (level, index) => {
  const fact = kinderScienceFacts[(level * 3 + index) % kinderScienceFacts.length];
  const otherOptions = kinderScienceFacts.filter((item) => item.word !== fact.word).slice(0, 3);
  const options = [fact.word, otherOptions[0].word, otherOptions[1].word, otherOptions[2].word];

  const templates = [
    {
      q: `Which animal or thing matches this picture?`,
      visual: fact.emoji,
      options,
      a: fact.word,
      hint: `This is ${fact.clue.toLowerCase()}`,
      reward: '🧪 Science Match'
    },
    {
      q: `What do we breathe?`,
      visual: '🌬️',
      options: ['Air', 'Water', 'Sand', 'Wood'],
      a: 'Air',
      hint: 'We need it to live.',
      reward: '🌬️ Breathe'
    },
    {
      q: 'Which thing helps plants grow?',
      visual: '🌱',
      options: ['Water', 'Stone', 'Paper', 'Toy'],
      a: 'Water',
      hint: 'Plants need it to grow.',
      reward: '🌱 Plant Care'
    },
    {
      q: 'Which season is cold?',
      visual: '❄️',
      options: ['Winter', 'Summer', 'Spring', 'Autumn'],
      a: 'Winter',
      hint: 'This season can be snowy.',
      reward: '❄️ Weather Fun'
    },
    {
      q: 'What do we use to see?',
      visual: '👀',
      options: ['Eyes', 'Ears', 'Hands', 'Feet'],
      a: 'Eyes',
      hint: 'They help us watch the world.',
      reward: '👀 See It'
    }
  ];

  const chosen = templates[index % templates.length];
  return {
    q: chosen.q,
    visual: chosen.visual,
    options: chosen.options,
    optionIcons: ['✅', '🔬', '🌟', '✨'],
    a: chosen.a,
    hint: chosen.hint,
    reward: chosen.reward
  };
};

export const kinderScience = {};

for (let level = 1; level <= 15; level += 1) {
  kinderScience[level] = Array.from({ length: 15 }, (_, index) => buildKinderScienceQuestion(level, index));
}

export default kinderScience;
