/* Bone Knight — original, deterministic world layout.
 * All coordinates are world pixels; x/y on props and actors are their feet.
 * Forest walkability and maps are derived from the same visible path geometry.
 */

const rect = (x, y, w, h, type = 'dirt') => ({ x, y, w, h, type });
const line = (speaker, text) => ({ speaker, text });
const inspect = (id, x, y, label, text, speaker = 'Yips') => ({
  id, kind: 'inspect', x, y, label, lines: [line(speaker, text)],
});
const exit = (id, x, y, label, toArea, toX, toY) => ({
  id, kind: 'exit', x, y, label, toArea, toX, toY,
});
const rest = (id, x, y, label = 'Rest by the lantern') => ({ id, kind: 'rest', x, y, label });

function random(seed) {
  let a = seed >>> 0;
  return () => {
    a += 0x6D2B79F5;
    let n = Math.imul(a ^ (a >>> 15), 1 | a);
    n ^= n + Math.imul(n ^ (n >>> 7), 61 | n);
    return ((n ^ (n >>> 14)) >>> 0) / 4294967296;
  };
}

const inside = (r, x, y, margin = 0) =>
  x >= r.x - margin && x <= r.x + r.w + margin && y >= r.y - margin && y <= r.y + r.h + margin;

function area(id, label, width, height, spawn, extra = {}) {
  return {
    id, label, subtitle: '', width, height, spawn,
    paths: [], water: [], bridges: [], buildings: [], props: [], trees: [], walls: [], interactables: [],
    ground: '#233d35', biome: 'town', ...extra,
  };
}

const town = area('town', 'Bramblewick', 1400, 1200, { x: 700, y: 850 }, {
  subtitle: 'A little town at the edge of something bigger',
  paths: [
    rect(130, 365, 1140, 90, 'stone'),
    rect(125, 660, 1150, 95, 'stone'),
    rect(620, 120, 150, 870, 'stone'),
    rect(455, 750, 490, 175, 'stone'),
    rect(650, 915, 100, 250, 'stone'),
    rect(125, 350, 85, 390, 'stone'),
    rect(1185, 350, 90, 390, 'stone'),
  ],
  water: [rect(60, 60, 1280, 65), rect(60, 60, 65, 975), rect(1275, 60, 65, 975), rect(60, 970, 1280, 65)],
  bridges: [rect(642, 945, 116, 120, 'wood')],
});

const homes = [
  { id: 'house1', x: 170, y: 165, w: 180, h: 180, label: 'WREN COTTAGE', style: 'house' },
  { id: 'house2', x: 410, y: 165, w: 180, h: 180, label: 'MOSS COTTAGE', style: 'house' },
  { id: 'house3', x: 800, y: 165, w: 180, h: 180, label: 'THISTLE COTTAGE', style: 'house' },
  { id: 'house4', x: 1040, y: 165, w: 180, h: 180, label: 'FERN COTTAGE', style: 'house' },
];
const shops = [
  { id: 'tavern', x: 170, y: 460, w: 220, h: 185, label: 'THE CROOKED BONE', style: 'tavern' },
  { id: 'smith', x: 430, y: 470, w: 170, h: 175, label: 'IRON & ASH', style: 'smith' },
  { id: 'bakery', x: 800, y: 470, w: 180, h: 175, label: 'CRUMB & CRUST', style: 'shop' },
  { id: 'apothecary', x: 1020, y: 470, w: 200, h: 175, label: 'MOTH & MINT', style: 'shop' },
];
town.buildings = [...homes, ...shops].map(b => ({ ...b, door: { x: b.x + b.w / 2, y: b.y + b.h + 10 } }));
town.paths.push(...town.buildings.map(b => rect(b.door.x - 29, b.door.y - 15, 58, 45, 'stone')));
town.walls.push(rect(672, 774, 56, 44));
town.props.push(
  { type: 'fountain', x: 700, y: 812 },
  { type: 'bench', x: 545, y: 828 }, { type: 'bench', x: 855, y: 828 },
  { type: 'cart', x: 1050, y: 815 }, { type: 'well', x: 1090, y: 390 },
  { type: 'barrel', x: 401, y: 637 }, { type: 'barrel', x: 146, y: 638 },
  { type: 'crate', x: 1240, y: 636 }, { type: 'crate', x: 997, y: 626 },
  { type: 'sign', x: 783, y: 920, text: 'PINE FOREST' },
  { type: 'sign', x: 380, y: 705, text: 'TAVERN' },
  { type: 'lantern', x: 606, y: 930 }, { type: 'lantern', x: 794, y: 930 },
  { type: 'lantern', x: 430, y: 762 }, { type: 'lantern', x: 970, y: 762 },
  { type: 'lantern', x: 150, y: 427 }, { type: 'lantern', x: 1250, y: 427 },
);
town.interactables.push(
  { id: 'tavern-door', kind: 'door', ...town.buildings.find(b => b.id === 'tavern').door, label: 'Enter the tavern', toArea: 'tavern', toX: 350, toY: 405 },
  exit('town-forest', 700, 1120, 'Enter Pine Forest', 'forest', 240, 2200),
  { id: 'smith-npc', kind: 'npc', x: 514, y: 686, label: 'Talk to Flint', sprite: 'villager', name: 'Flint', lines: [
    line('Flint', 'That sword is nearly as tall as you are.'),
    line('Yips', 'I am growing into it. Probably.'),
    line('Flint', 'A longsword does three good points of damage. Keep your feet moving between swings, little knight.'),
  ] },
  { id: 'baker-npc', kind: 'npc', x: 890, y: 689, label: 'Talk to Pippa', sprite: 'villager', name: 'Pippa', lines: [
    line('Pippa', 'Fresh bread! Warm bread! Bread with absolutely no curses in it!'),
    line('Yips', 'That last part feels important.'),
    line('Pippa', 'It has been a difficult week.'),
  ] },
  { id: 'gardener', kind: 'npc', x: 1020, y: 845, label: 'Talk to Rowan', sprite: 'villager', name: 'Rowan', lines: [
    line('Rowan', 'The witch has put a thorn spell over the old trail. Eight wolves guard the way to her den.'),
    line('Yips', 'Eight? I only have one sword.'),
    line('Rowan', 'Then use it eight times. Well. A few more than eight, probably.'),
  ] },
  inspect('fountain', 700, 859, 'Look at the fountain', 'Someone has tossed a button into the fountain. A very small wish.'),
  inspect('bridge-sign', 781, 918, 'Read the trail sign', 'PINE FOREST. Follow the lantern road. Rest at the blue lanterns. Do not drink the glowing puddles.', 'Trail sign'),
  inspect('apothecary-shop', 1120, 674, 'Read the shop notice', 'CLOSED WHILE THE FOREST IS HEXED. If you are the witch: we want our jars back.', 'Shop notice'),
  inspect('house1-door', 260, 366, 'Knock on Wren Cottage', 'A voice from inside says, "If you are here about the roof, it only leaks when it rains."'),
  inspect('house2-door', 500, 366, 'Look at Moss Cottage', 'A tiny pair of boots is drying on the doorstep. Both are full of moss.'),
  inspect('house3-door', 890, 366, 'Knock on Thistle Cottage', 'A sleepy voice answers, "Adventure starts after breakfast."'),
  inspect('house4-door', 1130, 366, 'Look at Fern Cottage', 'There is a sign in the window: HOME SWEET HOME. A fern has eaten the last word.'),
);

// Town planting is sparse enough for free exploration around the central square.
for (const [x, y, seed] of [[190, 840, 1], [275, 870, 2], [350, 915, 3], [1175, 875, 4], [1215, 785, 5], [135, 910, 6], [1235, 370, 7], [154, 360, 8]]) {
  town.trees.push({ x, y, seed });
}
for (let i = 0; i < 32; i++) {
  town.props.push({ type: 'flower', x: 160 + (i * 89) % 1080, y: 880 + (i * 13) % 65, seed: i });
}

const tavern = area('tavern', 'The Crooked Bone', 700, 500, { x: 350, y: 405 }, {
  subtitle: 'Good company. Questionable soup.', biome: 'interior', interior: true, ground: '#50382d',
  paths: [rect(40, 65, 620, 395, 'wood')],
  walls: [rect(0, 0, 700, 65), rect(0, 0, 38, 500), rect(662, 0, 38, 500), rect(0, 464, 700, 36), rect(190, 198, 300, 30)],
  props: [
    { type: 'counter', x: 340, y: 227, w: 300 },
    { type: 'shelf', x: 175, y: 112 }, { type: 'shelf', x: 365, y: 112 },
    { type: 'questboard', x: 566, y: 130 },
    { type: 'barrel', x: 110, y: 145 }, { type: 'barrel', x: 145, y: 150 },
    { type: 'table', x: 150, y: 330 }, { type: 'table', x: 530, y: 330 },
    { type: 'candle', x: 150, y: 320 }, { type: 'candle', x: 530, y: 320 },
    { type: 'rug', x: 350, y: 360, w: 130, h: 95 },
    { type: 'lantern', x: 84, y: 244 }, { type: 'lantern', x: 616, y: 244 },
    { type: 'crate', x: 85, y: 430 }, { type: 'crate', x: 620, y: 430 },
  ],
  interactables: [
    { id: 'keeper', kind: 'keeper', x: 350, y: 180, label: 'Talk to the tavern keeper', sprite: 'keeper', name: 'Bram' },
    { id: 'board', kind: 'board', x: 566, y: 152, label: 'Read the quest board' },
    exit('tavern-exit', 350, 445, 'Leave the tavern', 'town', 280, 694),
    inspect('tavern-menu', 210, 244, 'Read the menu', 'SOUP OF THE DAY: yes. BREAD OF THE DAY: also yes.', 'Chalkboard'),
    inspect('tavern-barrels', 110, 190, 'Inspect the barrels', 'One barrel is marked APPLE JUICE. The other is marked BETTER APPLE JUICE.'),
  ],
});

function pathBetween(a, b, width = 128) {
  if (a.x === b.x) return rect(a.x - width / 2, Math.min(a.y, b.y) - width / 2, width, Math.abs(a.y - b.y) + width);
  if (a.y === b.y) return rect(Math.min(a.x, b.x) - width / 2, a.y - width / 2, Math.abs(a.x - b.x) + width, width);
  throw new Error('World paths use orthogonal, contiguous segments.');
}

function forestArea(id, label, seed, reversed) {
  const left = 240, right = 2960;
  const rows = [2200, 1880, 1560, 1240, 920, 600, 280];
  const start = { x: reversed ? right : left, y: rows[0] };
  const a = area(id, label, 3200, 2400, start, {
    subtitle: id === 'forest' ? 'Lanterns in the pine needles' : 'Where the old trees keep their secrets',
    biome: 'forest', restrictedToPaths: true,
    ground: id === 'forest' ? '#203d35' : '#18332f',
  });
  const route = [{ ...start }];
  for (let i = 0; i < rows.length; i++) {
    const goesRight = (i % 2 === 0) !== reversed;
    const endX = goesRight ? right : left;
    route.push({ x: endX, y: rows[i] });
    if (i < rows.length - 1) route.push({ x: endX, y: rows[i + 1] });
  }
  for (let i = 1; i < route.length; i++) a.paths.push(pathBetween(route[i - 1], route[i]));
  a.route = route;
  a.routeLength = route.slice(1).reduce((n, p, i) => n + Math.abs(p.x - route[i].x) + Math.abs(p.y - route[i].y), 0);
  // Spacious clearings interrupt the narrow trail; the branches are true side paths.
  const sites = [
    { x: 1100, y: 2200, label: id === 'forest' ? 'The Needlepath' : 'Old Root Road' },
    { x: 2200, y: 1880, label: id === 'forest' ? 'Foxglove Hollow' : 'The Fallen King' },
    { x: 750, y: 1560, label: id === 'forest' ? 'The Quiet Pond' : 'Mothlight Bend' },
    { x: 2100, y: 1240, label: id === 'forest' ? 'Watchman’s Rest' : 'The Crooked Oak' },
    { x: 900, y: 920, label: id === 'forest' ? 'Mossbell Crossing' : 'Whispering Stones' },
    { x: 2100, y: 600, label: id === 'forest' ? 'The Old Camp' : 'Witchlight Reach' },
    { x: 1500, y: 280, label: id === 'forest' ? 'Beyond the Pines' : 'The Last Lantern' },
  ];
  a.landmarks = sites;
  for (const [i, s] of sites.entries()) {
    a.paths.push(rect(s.x - 140, s.y - 105, 280, 210));
    a.props.push({ type: 'sign', x: s.x - 100, y: s.y - 35, text: s.label.toUpperCase(), seed: i });
    a.props.push({ type: 'lantern', x: s.x + 105, y: s.y - 45, seed: i });
    if (i % 2 === 1) {
      a.props.push({ type: 'bench', x: s.x, y: s.y - 45 }, { type: 'lantern', x: s.x - 60, y: s.y - 50, blue: true });
      a.interactables.push(rest(`${id}-rest-${i}`, s.x, s.y - 10, `Rest at ${s.label}`));
    }
  }
  // A short optional branch contains each region's pond and its little story.
  a.paths.push(rect(730, 1380, 75, 180), rect(655, 1350, 230, 100));
  a.water.push(rect(420, 1295, 220, 160));
  a.props.push({ type: 'log', x: 710, y: 1400 }, { type: 'flower', x: 735, y: 1375, seed: 72 });
  a.interactables.push(inspect(`${id}-pond`, 725, 1400, 'Look into the pond', id === 'forest'
    ? 'My reflection has a very impressive helmet. I hope I look that brave from the front, too.'
    : 'The pond is full of tiny lights. For a moment, it looks like the stars fell asleep here.'));

  const descriptions = id === 'forest' ? [
    'A trail marker reads: KEEP TO THE LANTERNS. Someone has added: ESPECIALLY IF YOU ARE SMALL.',
    'The foxgloves are taller than me. Everything is taller than me. I am choosing not to take it personally.',
    'There are wolf tracks in the mud. Four feet. I only have two. That feels a little unfair.',
    'An old blanket and an empty cup. Someone stayed here and made it home. I can do that too.',
    'A tiny brass bell hangs from the branch. It is completely filled with moss.',
    'A faded note: If the wolves mark the ground red, MOVE. They always leap where you were, not where you are going.',
    'The pines are so tall that the sky looks like a narrow blue ribbon.',
  ] : [
    'An old boot sits in a tree. I have several questions and no one to ask them.',
    'A fallen tree has become a kingdom for mushrooms. Their king is extremely small and very orange.',
    'The moths keep circling the lantern. Maybe they are also following the road.',
    'Someone has carved a smiling face into the bark. It has fewer teeth than I do.',
    'The stones are warm. I am going to stand a little farther away from the stones.',
    'A weathered warning: Bottles glow for FIVE SECONDS before bursting. Watch the circle, not the bottle.',
    'The last lantern. Beyond it, the air smells of burnt sugar and trouble.',
  ];
  sites.forEach((s, i) => a.interactables.push(inspect(`${id}-marker-${i}`, s.x - 100, s.y - 15, `Read about ${s.label}`, descriptions[i])));
  const wolfPoints = reversed
    ? [[1500, 2200], [1900, 1560], [1150, 1240], [1650, 600]]
    : [[1650, 2200], [1250, 1560], [2050, 1240], [1500, 600]];
  wolfPoints.forEach(([x, y], i) => {
    const n = (id === 'forest' ? 0 : 4) + i + 1;
    a.interactables.push({ id: `wolf${n}`, kind: 'wolf', x, y, label: 'Face the pine wolf', sprite: 'wolf', name: 'Pine wolf', encounter: n });
    a.paths.push(rect(x - 125, y - 100, 250, 200));
    a.props.push({ type: 'rock', x: x - 100, y: y - 65, seed: n }, { type: 'stump', x: x + 104, y: y + 55, seed: n });
  });

  if (id === 'forest') {
    a.interactables.push(exit('forest-town', 240, 2232, 'Return to Bramblewick', 'town', 700, 1080));
    a.interactables.push(exit('forest-deepwood', 2960, 250, 'Enter the Deepwood', 'deepwood', 2960, 2200));
  } else {
    a.interactables.push(exit('deepwood-forest', 2960, 2232, 'Return to Pine Forest', 'forest', 2960, 280));
    a.interactables.push(exit('deepwood-clearing', 240, 250, 'Enter Witchlight Clearing', 'clearing', 500, 790));
  }
  // Dense foliage forms the boundaries. Trunks stay outside the clear walkways.
  const rng = random(seed);
  for (let y = 55; y < a.height - 20; y += 66) {
    for (let x = 35; x < a.width - 25; x += 61) {
      const tx = Math.round(x + (rng() - .5) * 25), ty = Math.round(y + (rng() - .5) * 25);
      if (a.paths.some(p => inside(p, tx, ty, 28)) || a.water.some(p => inside(p, tx, ty, 26))) continue;
      a.trees.push({ x: tx, y: ty, seed: Math.floor(rng() * 10000) });
    }
  }
  // A continuous trail of lights is useful both in the game and on the map.
  rows.forEach((y, row) => {
    for (let x = 420; x < 2900; x += 580) {
      a.props.push({ type: 'lantern', x: x + (row % 2) * 85, y: y - 48, seed: row });
    }
  });
  for (let i = 0; i < 360; i++) {
    const x = Math.floor(100 + rng() * (a.width - 200)), y = Math.floor(100 + rng() * (a.height - 200));
    if (!a.paths.some(p => inside(p, x, y, 5))) continue;
    if (a.interactables.some(p => Math.hypot(p.x - x, p.y - y) < 48)) continue;
    a.props.push({ type: ['flower', 'mushroom', 'rock'][i % 3], x, y, seed: i });
  }
  return a;
}

const forest = forestArea('forest', 'Pine Forest', 381, false);
const deepwood = forestArea('deepwood', 'The Deepwood', 762, true);

const clearing = area('clearing', 'Witchlight Clearing', 1000, 900, { x: 500, y: 790 }, {
  subtitle: 'A light burns in the crooked window', biome: 'forest', restrictedToPaths: true, ground: '#21352f',
  paths: [rect(425, 440, 150, 410), rect(235, 430, 530, 170), rect(180, 555, 240, 145), rect(580, 555, 240, 145)],
  buildings: [{ id: 'witch-shack', x: 355, y: 180, w: 290, h: 250, label: 'THE WITCH’S DEN', style: 'witch', door: { x: 500, y: 448 } }],
  props: [
    { type: 'lantern', x: 410, y: 717, blue: true }, { type: 'bench', x: 330, y: 623 },
    { type: 'cauldron', x: 720, y: 586 }, { type: 'crate', x: 682, y: 513 },
    { type: 'barrel', x: 750, y: 523 }, { type: 'mushroom', x: 606, y: 555 },
    { type: 'obelisk', x: 300, y: 480 }, { type: 'obelisk', x: 700, y: 480 },
    { type: 'sign', x: 580, y: 750, text: 'NO SOLICITORS. OR KNIGHTS.' },
    { type: 'lantern', x: 440, y: 470 }, { type: 'lantern', x: 560, y: 470 },
  ],
  interactables: [
    exit('clearing-deepwood', 500, 825, 'Return to the Deepwood', 'deepwood', 240, 280),
    { id: 'den-door', kind: 'door', x: 500, y: 454, label: 'Enter the witch’s den', toArea: 'den', toX: 350, toY: 405 },
    rest('clearing-rest', 330, 640, 'Rest before the witch’s den'),
    inspect('witch-sign', 580, 750, 'Read the witch’s sign', 'NO SOLICITORS. NO HEROES. NO BORROWING MY SPOONS. The last line is underlined four times.', 'Crooked sign'),
    inspect('clearing-cauldron', 720, 632, 'Inspect the cauldron', 'The soup is purple. The soup is also looking at me. I do not think this is soup.'),
    inspect('thorn-seal', 300, 513, 'Inspect the thorn stones', 'Eight carved wolf heads circle the stone. The witch has bound the forest pack to her doorstep.'),
  ],
});
{
  const rng = random(997);
  for (let y = 55; y < 870; y += 66) for (let x = 35; x < 980; x += 61) {
    const tx = Math.round(x + rng() * 22), ty = Math.round(y + rng() * 22);
    if (clearing.paths.some(p => inside(p, tx, ty, 30)) || clearing.buildings.some(p => inside(p, tx, ty, 45))) continue;
    clearing.trees.push({ x: tx, y: ty, seed: Math.floor(rng() * 1000) });
  }
}

const den = area('den', 'The Witch’s Den', 700, 500, { x: 350, y: 405 }, {
  subtitle: 'Careful. Everything here is breakable. Including you.', biome: 'interior', interior: true, ground: '#352c3f',
  paths: [rect(40, 65, 620, 395, 'wood')],
  walls: [rect(0, 0, 700, 65), rect(0, 0, 38, 500), rect(662, 0, 38, 500), rect(0, 464, 700, 36)],
  props: [
    { type: 'shelf', x: 150, y: 115 }, { type: 'shelf', x: 515, y: 115 },
    { type: 'cauldron', x: 350, y: 260 }, { type: 'rug', x: 350, y: 340, w: 140, h: 110 },
    { type: 'table', x: 140, y: 305 }, { type: 'table', x: 554, y: 305 },
    { type: 'candle', x: 140, y: 290 }, { type: 'candle', x: 554, y: 290 },
    { type: 'barrel', x: 95, y: 175 }, { type: 'crate', x: 610, y: 405 },
    { type: 'mushroom', x: 602, y: 190 }, { type: 'mushroom', x: 110, y: 420 },
    { type: 'lantern', x: 72, y: 240 }, { type: 'lantern', x: 630, y: 240 },
  ],
  interactables: [
    { id: 'witch', kind: 'witch', x: 350, y: 160, label: 'Talk to the witch', sprite: 'witch', name: 'Morrow' },
    exit('den-exit', 350, 445, 'Leave the den', 'clearing', 500, 510),
    inspect('witch-recipes', 150, 335, 'Read the recipe book', 'One pinch of nettle. Two drops of spite. Bake at an unreasonable temperature.', 'Recipe book'),
    inspect('witch-jars', 550, 150, 'Read the jar labels', 'FROG OPINIONS. UNHELPFUL THOUGHTS. CINNAMON. I am not touching any of these.'),
  ],
});

export const AREAS = { town, tavern, forest, deepwood, clearing, den };
export const allQuestWolves = Array.from({ length: 8 }, (_, i) => `wolf${i + 1}`);
export const routeLength = forest.routeLength + deepwood.routeLength;
export const getArea = id => AREAS[id] || AREAS.town;

/** True if a circular player at x/y would cross solid world geometry. */
export function isBlocked(areaId, x, y, r = 8) {
  const a = typeof areaId === 'string' ? AREAS[areaId] : areaId;
  if (!a || !Number.isFinite(x) || !Number.isFinite(y)) return true;
  if (x < r || y < r || x > a.width - r || y > a.height - r) return true;
  const points = [[x, y], [x - r, y], [x + r, y], [x, y - r], [x, y + r]];
  if (a.restrictedToPaths && points.some(([px, py]) => !a.paths.some(p => inside(p, px, py)))) return true;
  for (const [px, py] of points) {
    if (a.water.some(w => inside(w, px, py)) && !a.bridges.some(b => inside(b, px, py))) return true;
  }
  const hitsRect = b => x + r > b.x && x - r < b.x + b.w && y + r > b.y && y - r < b.y + b.h;
  if (a.walls.some(hitsRect) || a.buildings.some(hitsRect)) return true;
  // Only the trunks are solid; Yips can walk behind the pine boughs.
  if (a.trees.some(t => Math.abs(x - t.x) < 11 + r && y + r > t.y - 16 && y - r < t.y + 3)) return true;
  return false;
}

