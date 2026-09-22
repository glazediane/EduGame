// src/data/questions/grade3/science.jsx

const grade3ScienceTemplates = [
  { q: 'Which part of the body helps us breathe?', visual: '🌬️', options: ['Lungs', 'Hands', 'Eyes', 'Knees'], a: 'Lungs', hint: 'Our lungs help us breathe in oxygen.', reward: '🌬️ Breath Builder' },
  { q: 'What do we call water falling from clouds?', visual: '☁️ 🌧️', options: ['Rain', 'Snow', 'Wind', 'Fog'], a: 'Rain', hint: 'Rain falls from clouds.', reward: '🌧️ Weather Wonder' },
  { q: 'Which habitat is hot and sandy?', visual: '🏜️', options: ['Desert', 'Forest', 'Ocean', 'Rainforest'], a: 'Desert', hint: 'Deserts are dry and sandy.', reward: '🌵 Habitat Explorer' },
  { q: 'What group of animals gives birth to live babies and feeds them milk?', visual: '🐼 🐶 🐯', options: ['Mammals', 'Birds', 'Fish', 'Reptiles'], a: 'Mammals', hint: 'Mammals are warm-blooded and feed milk to babies.', reward: '🐾 Mammal Quest' },
  { q: 'Which object is a conductor of electricity?', visual: '🔌', options: ['Metal spoon', 'Plastic toy', 'Wood block', 'Paper'], a: 'Metal spoon', hint: 'Metals let electricity pass through.', reward: '⚡ Electric Explorer' },
  { q: 'What do plants need to make food?', visual: '🌱 ☀️ 💧', options: ['Sunlight, water, and air', 'Only dirt', 'Only flowers', 'Only rocks'], a: 'Sunlight, water, and air', hint: 'Plants use sunlight, water, and air to make food.', reward: '🌞 Plant Power' },
  { q: 'Which material is best for making a boat?', visual: '⛵', options: ['Wood', 'Rock', 'Metal', 'Glass'], a: 'Wood', hint: 'Wood floats and is used in boats.', reward: '⛵ Float Builder' },
  { q: 'What do we call the change from a liquid to a solid?', visual: '💧 → 🧊', options: ['Freezing', 'Melting', 'Evaporation', 'Condensation'], a: 'Freezing', hint: 'Freezing turns liquid water into ice.', reward: '❄️ Cool Change' },
  { q: 'Which animal is known for living in the ocean?', visual: '🐠', options: ['Fish', 'Lion', 'Bear', 'Rabbit'], a: 'Fish', hint: 'Fish live in water.', reward: '🐠 Ocean Animal' },
  { q: 'Which part of the plant is colorful and attractive to insects?', visual: '🌼', options: ['Flower', 'Root', 'Stem', 'Leaf'], a: 'Flower', hint: 'Flowers are colorful and can attract pollinators.', reward: '🌼 Flower Finder' },
  { q: 'What do we need to breathe?', visual: '🌬️', options: ['Air', 'Stone', 'Paper', 'Milk'], a: 'Air', hint: 'Air is needed for breathing.', reward: '🌬️ Air Time' },
  { q: 'Which season is usually the hottest?', visual: '☀️', options: ['Summer', 'Winter', 'Autumn', 'Spring'], a: 'Summer', hint: 'Summer is usually warm and bright.', reward: '🌤️ Weather Fun' },
  { q: 'Which body part helps us hear?', visual: '👂', options: ['Ears', 'Eyes', 'Nose', 'Feet'], a: 'Ears', hint: 'Ears help us hear sounds.', reward: '🔊 Sound Sense' },
  { q: 'What can plants use to make their own food?', visual: '🌱', options: ['Sunlight', 'Sand', 'Plastic', 'Cloud'], a: 'Sunlight', hint: 'Plants use sunlight to make food.', reward: '🌞 Food Factory' },
  { q: 'Which state of matter is water?', visual: '💧', options: ['Solid', 'Liquid', 'Gas', 'Rock'], a: 'Liquid', hint: 'Water is a liquid under normal conditions.', reward: '💧 Liquid Lab' }
];

export const grade3Science = {};

for (let level = 1; level <= 15; level += 1) {
  grade3Science[level] = Array.from({ length: 15 }, (_, index) => {
    const template = grade3ScienceTemplates[(level + index) % grade3ScienceTemplates.length];
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

export default grade3Science;
