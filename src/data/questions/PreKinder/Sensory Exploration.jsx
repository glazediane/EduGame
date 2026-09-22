// src/data/questions/PreKinder/Sensory Exploration.jsx

export const preKinderScienceTemplates = [
  { q: 'Which sense helps us smell flowers?', visual: '🌷', options: ['Smell', 'Taste', 'Hearing', 'Touch'], a: 'Smell', hint: 'We smell with our nose.', reward: '🌷 Scent Sense' },
  { q: 'What do plants need to grow?', visual: '🌱☀️💧', options: ['Sunlight and water', 'Rock and toys', 'Only shade', 'Only books'], a: 'Sunlight and water', hint: 'Plants need sunlight and water to grow.', reward: '🌱 Plant Growth' },
  { q: 'Which thing is soft?', visual: '🧸', options: ['Pillow', 'Stone', 'Door', 'Table'], a: 'Pillow', hint: 'A pillow feels soft.', reward: '🧸 Soft Touch' },
  { q: 'What do we see with?', visual: '👀', options: ['Eyes', 'Ears', 'Hands', 'Feet'], a: 'Eyes', hint: 'We look with our eyes.', reward: '👀 Visual Sense' },
  { q: 'Which weather is hot and sunny?', visual: '☀️', options: ['Sunny', 'Rainy', 'Windy', 'Cloudy'], a: 'Sunny', hint: 'Sunny weather is bright and warm.', reward: '🌤️ Weather Fun' },
  { q: 'Which animal can swim?', visual: '🐟', options: ['Fish', 'Cat', 'Bird', 'Horse'], a: 'Fish', hint: 'Fish live and swim in water.', reward: '🐟 Water Animals' },
  { q: 'What do we hear with?', visual: '👂', options: ['Ears', 'Nose', 'Eyes', 'Mouth'], a: 'Ears', hint: 'Ears help us hear sounds.', reward: '🎵 Hearing Sense' },
  { q: 'Which one is a living thing?', visual: '🌱', options: ['Plant', 'Rock', 'Toy', 'Bottle'], a: 'Plant', hint: 'Plants grow and need water.', reward: '🌿 Living Things' },
  { q: 'What color is grass?', visual: '🌿', options: ['Green', 'Red', 'Blue', 'Yellow'], a: 'Green', hint: 'Grass is green.', reward: '🌿 Nature Color' },
  { q: 'Which sense helps us feel cold or warm?', visual: '🧤', options: ['Touch', 'Smell', 'Hear', 'See'], a: 'Touch', hint: 'We feel touch with our skin.', reward: '🧤 Touch Sense' },
  { q: 'Which animal makes a quack sound?', visual: '🦆', options: ['Duck', 'Dog', 'Cow', 'Cat'], a: 'Duck', hint: 'A duck says quack.', reward: '🦆 Animal Sound' },
  { q: 'What do we use to drink water?', visual: '🥤', options: ['Cup', 'Book', 'Ruler', 'Pencil'], a: 'Cup', hint: 'A cup holds water.', reward: '🥤 Everyday Use' },
  { q: 'Which kind of day is rainy?', visual: '☁️🌧️', options: ['Rainy day', 'Snowy day', 'Sunny day', 'Windy day'], a: 'Rainy day', hint: 'Rainy days have water falling from clouds.', reward: '🌧️ Rain Watch' },
  { q: 'Which sense helps us taste food?', visual: '🍓', options: ['Taste', 'Hearing', 'Sight', 'Touch'], a: 'Taste', hint: 'We taste with our tongue.', reward: '🍓 Taste Sense' },
  { q: 'What do we use to draw a picture?', visual: '🖍️', options: ['Crayon', 'Shoe', 'Stone', 'Cup'], a: 'Crayon', hint: 'A crayon helps us draw and color.', reward: '🖍️ Drawing Time' }
];

export const preKinderScience = {};

for (let level = 1; level <= 15; level += 1) {
  preKinderScience[level] = Array.from({ length: 15 }, (_, index) => {
    const template = preKinderScienceTemplates[(level + index) % preKinderScienceTemplates.length];
    return {
      q: template.q,
      visual: template.visual,
      options: template.options,
      optionIcons: ['✅', '🔬', '🌟', '✨'],
      a: template.a,
      hint: template.hint,
      reward: template.reward
    };
  });
}

export default preKinderScience;
