// src/data/questions/Nursery/Art and Craft.jsx

export const nurseryScienceTemplates = [
  { q: 'Which color is the sky on a sunny day?', visual: '☀️🌤️', options: ['Blue', 'Red', 'Black', 'Green'], a: 'Blue', hint: 'The sky is often blue.', reward: '🌤️ Sky Colors' },
  { q: 'What do we use to paint?', visual: '🎨', options: ['Paint', 'Stone', 'Book', 'Chair'], a: 'Paint', hint: 'Paint helps us color pictures.', reward: '🎨 Art Tools' },
  { q: 'Which sense helps us hear music?', visual: '🎵', options: ['Hearing', 'Touch', 'Smell', 'Sight'], a: 'Hearing', hint: 'We hear sounds with our ears.', reward: '🎵 Sound Sense' },
  { q: 'Which animal lives in water?', visual: '🐟', options: ['Fish', 'Lion', 'Dog', 'Bird'], a: 'Fish', hint: 'Fish swim in water.', reward: '🐟 Water Animal' },
  { q: 'What do plants need to grow?', visual: '🌱☀️💧', options: ['Sunlight and water', 'Rock and sand', 'Only air', 'Only toys'], a: 'Sunlight and water', hint: 'Plants need sunlight and water.', reward: '🌱 Plant Growth' },
  { q: 'Which part of our body helps us see?', visual: '👀', options: ['Eyes', 'Hands', 'Feet', 'Ears'], a: 'Eyes', hint: 'We see with our eyes.', reward: '👀 Looking Sense' },
  { q: 'What do we call the sound a dog makes?', visual: '🐶', options: ['Bark', 'Meow', 'Quack', 'Roar'], a: 'Bark', hint: 'Dogs bark.', reward: '🐾 Animal Sound' },
  { q: 'Which object is soft?', visual: '🧸', options: ['Pillow', 'Rock', 'Door', 'Car'], a: 'Pillow', hint: 'A pillow feels soft.', reward: '🧸 Soft Feeling' },
  { q: 'What grows from the ground?', visual: '🌼', options: ['Flower', 'Chair', 'Toy', 'Book'], a: 'Flower', hint: 'Flowers grow in soil.', reward: '🌼 Grow and Glow' },
  { q: 'Which sense helps us smell?', visual: '🌷', options: ['Smell', 'Hearing', 'Touch', 'Sight'], a: 'Smell', hint: 'We smell with our nose.', reward: '🌷 Scent Sense' },
  { q: 'What color is a banana?', visual: '🍌', options: ['Yellow', 'Red', 'Blue', 'Purple'], a: 'Yellow', hint: 'Bananas are yellow.', reward: '🍌 Fruit Color' },
  { q: 'Which animal says "meow"?', visual: '🐱', options: ['Cat', 'Cow', 'Duck', 'Horse'], a: 'Cat', hint: 'A cat says meow.', reward: '🐱 Cat Sound' },
  { q: 'Which weather is rainy?', visual: '☁️🌧️', options: ['Rainy day', 'Snowy day', 'Sunny day', 'Windy day'], a: 'Rainy day', hint: 'Rainy weather has water falling from clouds.', reward: '🌧️ Weather Watch' },
  { q: 'What do we use to cut paper?', visual: '✂️', options: ['Scissors', 'Spoon', 'Brush', 'Pencil'], a: 'Scissors', hint: 'Scissors help cut paper.', reward: '✂️ Craft Tools' },
  { q: 'What is smooth?', visual: '🪨', options: ['Stone', 'Cloud', 'Pillow', 'Cotton'], a: 'Stone', hint: 'A stone feels smooth and hard.', reward: '🪨 Touching Texture' }
];

export const nurseryScience = {};

for (let level = 1; level <= 15; level += 1) {
  nurseryScience[level] = Array.from({ length: 15 }, (_, index) => {
    const template = nurseryScienceTemplates[(level + index) % nurseryScienceTemplates.length];
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

export default nurseryScience;
