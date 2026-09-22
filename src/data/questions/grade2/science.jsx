// src/data/questions/grade2/science.jsx

export const grade2ScienceTemplates = [
  {
    q: 'Which planet do we live on?',
    visual: '🌍',
    options: ['Earth', 'Mars', 'Jupiter', 'Moon'],
    a: 'Earth',
    hint: 'Earth is the planet where people live.',
    reward: '🌍 Home Planet'
  },
  {
    q: 'What helps plants make food?',
    visual: '☀️ 🌱',
    options: ['Sunlight', 'Stone', 'Plastic', 'Cloud'],
    a: 'Sunlight',
    hint: 'Plants use sunlight to make food.',
    reward: '🌞 Food Factory'
  },
  {
    q: 'Which animal is a mammal?',
    visual: '🐘 🐠 🐸 🐙',
    options: ['Elephant', 'Fish', 'Frog', 'Octopus'],
    a: 'Elephant',
    hint: 'Elephants are mammals and drink milk as babies.',
    reward: '🐘 Mammal Match'
  },
  {
    q: 'What do we use to measure temperature?',
    visual: '🌡️',
    options: ['Thermometer', 'Ruler', 'Scale', 'Clock'],
    a: 'Thermometer',
    hint: 'A thermometer tells how hot or cold something is.',
    reward: '🌡️ Weather Tool'
  },
  {
    q: 'Which is a source of water?',
    visual: '💧',
    options: ['River', 'Rock', 'Sand', 'Paper'],
    a: 'River',
    hint: 'A river is a natural source of water.',
    reward: '💧 Water Source'
  },
  {
    q: 'What do animals need to live?',
    visual: '🐾',
    options: ['Food, water, and air', 'Only toys', 'Only sunlight', 'Only rocks'],
    a: 'Food, water, and air',
    hint: 'Animals need food, water, and air to survive.',
    reward: '🐾 Animal Needs'
  },
  {
    q: 'Which state of matter is a liquid?',
    visual: '💧',
    options: ['Water', 'Ice', 'Air', 'Wood'],
    a: 'Water',
    hint: 'Water flows and takes the shape of its container.',
    reward: '💧 Liquid Lab'
  },
  {
    q: 'What do bees collect from flowers?',
    visual: '🐝 🌼',
    options: ['Nectar', 'Sand', 'Stone', 'Paper'],
    a: 'Nectar',
    hint: 'Bees collect nectar to make honey.',
    reward: '🐝 Bee Helper'
  },
  {
    q: 'Which force pulls things down?',
    visual: '🪂',
    options: ['Gravity', 'Light', 'Sound', 'Heat'],
    a: 'Gravity',
    hint: 'Gravity pulls objects toward the ground.',
    reward: '🪂 Gravity Game'
  },
  {
    q: 'Which body part helps us hear?',
    visual: '👂',
    options: ['Ears', 'Eyes', 'Hands', 'Feet'],
    a: 'Ears',
    hint: 'Ears help us hear sounds.',
    reward: '🎧 Sound Sense'
  },
  {
    q: 'Which part of the plant absorbs water?',
    visual: '🌱',
    options: ['Roots', 'Leaves', 'Flowers', 'Stem'],
    a: 'Roots',
    hint: 'Roots pull water from the soil.',
    reward: '🌿 Root Finder'
  },
  {
    q: 'What kind of weather has lots of ice and cold?',
    visual: '❄️',
    options: ['Winter', 'Summer', 'Spring', 'Autumn'],
    a: 'Winter',
    hint: 'Winter is the coldest season.',
    reward: '❄️ Frosty Forecast'
  },
  {
    q: 'Which animal lays eggs?',
    visual: '🐥',
    options: ['Bird', 'Cat', 'Dog', 'Cow'],
    a: 'Bird',
    hint: 'Birds lay eggs.',
    reward: '🐥 Egg Layer'
  },
  {
    q: 'What do plants need to make food besides sunlight?',
    visual: '🌱💧',
    options: ['Water', 'Sand', 'Plastic', 'Stone'],
    a: 'Water',
    hint: 'Plants need water and sunlight to make food.',
    reward: '🌱 Food Maker'
  },
  {
    q: 'Which material is a solid?',
    visual: '🧊',
    options: ['Ice', 'Water', 'Air', 'Steam'],
    a: 'Ice',
    hint: 'Ice is a solid because it keeps its shape.',
    reward: '🧊 Solid Match'
  }
];

export const grade2Science = {};

for (let level = 1; level <= 15; level += 1) {
  grade2Science[level] = Array.from({ length: 15 }, (_, index) => {
    const template = grade2ScienceTemplates[(level + index) % grade2ScienceTemplates.length];
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

export default grade2Science;
