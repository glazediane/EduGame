// src/data/questions/grade1/science.jsx

export const grade1ScienceTemplates = [
  {
    q: 'Which part of the plant grows underground?',
    visual: '🌱',
    options: ['Roots', 'Leaves', 'Flowers', 'Stem'],
    a: 'Roots',
    hint: 'Roots hold the plant in the soil.',
    reward: '🌱 Plant Explorer'
  },
  {
    q: 'Which animal lives in water?',
    visual: '🐟 🐰 🐼 🦊',
    options: ['Fish', 'Rabbit', 'Panda', 'Fox'],
    a: 'Fish',
    hint: 'Fish swim in water.',
    reward: '🐠 Water Animal'
  },
  {
    q: 'What do we need to live and breathe?',
    visual: '🌬️',
    options: ['Air', 'Stone', 'Table', 'Paper'],
    a: 'Air',
    hint: 'We need air to breathe.',
    reward: '🌬️ Breathe Right'
  },
  {
    q: 'Which is a natural source of light?',
    visual: '☀️ 💡 🔦 🕯️',
    options: ['Sun', 'Lamp', 'Flashlight', 'Candle'],
    a: 'Sun',
    hint: 'The sun gives natural light.',
    reward: '☀️ Light Finder'
  },
  {
    q: 'Which season is warm and sunny?',
    visual: '🌞',
    options: ['Summer', 'Winter', 'Autumn', 'Spring'],
    a: 'Summer',
    hint: 'Summer is usually hot and bright.',
    reward: '🌤️ Weather Watch'
  },
  {
    q: 'What do plants need to grow?',
    visual: '🌱💧☀️',
    options: ['Water and sunlight', 'Rock and paper', 'Snow and sand', 'Cloud and milk'],
    a: 'Water and sunlight',
    hint: 'Plants need water and sunlight to grow.',
    reward: '🌞 Grow Big'
  },
  {
    q: 'Which material is soft?',
    visual: '🧸 🪨 🧱 🪵',
    options: ['Pillow', 'Stone', 'Brick', 'Wood'],
    a: 'Pillow',
    hint: 'A pillow is soft and fluffy.',
    reward: '🧸 Texture Test'
  },
  {
    q: 'What do birds use to fly?',
    visual: '🪽',
    options: ['Wings', 'Feet', 'Horns', 'Teeth'],
    a: 'Wings',
    hint: 'Birds flap their wings to fly.',
    reward: '🐦 Fly High'
  },
  {
    q: 'Which of these is a solid?',
    visual: '🧊 💧 🌬️',
    options: ['Ice', 'Water', 'Air'],
    a: 'Ice',
    hint: 'Ice keeps its own shape.',
    reward: '🧊 Solid Match'
  },
  {
    q: 'What animal hatches from an egg?',
    visual: '🥚',
    options: ['Chicken', 'Car', 'Book', 'Table'],
    a: 'Chicken',
    hint: 'Chickens come from eggs.',
    reward: '🥚 Egg Watch'
  },
  {
    q: 'Which body part helps us see?',
    visual: '👀',
    options: ['Eyes', 'Ears', 'Hands', 'Feet'],
    a: 'Eyes',
    hint: 'Our eyes help us see.',
    reward: '👀 Sight Sense'
  },
  {
    q: 'What do animals need to stay alive?',
    visual: '🐾',
    options: ['Food, water, and air', 'Only toys', 'Only sunlight', 'Only rocks'],
    a: 'Food, water, and air',
    hint: 'Animals need food, water, and air to survive.',
    reward: '🐾 Animal Needs'
  },
  {
    q: 'Which is a liquid?',
    visual: '💧',
    options: ['Water', 'Rock', 'Wood', 'Paper'],
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
    q: 'What do we use to measure temperature?',
    visual: '🌡️',
    options: ['Thermometer', 'Ruler', 'Scale', 'Clock'],
    a: 'Thermometer',
    hint: 'A thermometer tells us how hot or cold it is.',
    reward: '🌡️ Weather Tool'
  }
];

export const grade1Science = {};

for (let level = 1; level <= 15; level += 1) {
  grade1Science[level] = Array.from({ length: 15 }, (_, index) => {
    const template = grade1ScienceTemplates[(level + index) % grade1ScienceTemplates.length];
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

export default grade1Science;
