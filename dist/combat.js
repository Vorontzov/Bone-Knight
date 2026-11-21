/** Bone Knight's deterministic, DOM-free dodge-and-strike battle engine. */
export const PLAYER_MAX_HP = 25;
export const SWORD_DAMAGE = 3;
export const WOLF_HP = 15;
export const WITCH_HP = 30;
export const WOLF_SCRATCHES = 4;
export const WOLF_DAMAGE = 3;
export const WITCH_DAMAGE = 5;
export const POTION_WARNING = 5;
export const WOLF_WARNING = 1.25;
export const WOLF_ATTEMPT_LENGTH = 2.6;
export const POTION_WAVE_LENGTH = 6;
export const WITCH_WAVES = 3;
export const INVULNERABILITY = 0.75;

const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
const finite = v => Number.isFinite(v) ? v : 0;

export class Battle {
  constructor({ type = 'wolf', playerHp = PLAYER_MAX_HP, onFinish = () => {}, random = Math.random } = {}) {
    if (type !== 'wolf' && type !== 'witch') throw new TypeError('Unknown battle creature: ' + type);
    this.type = type;
    this.maxEnemyHp = type === 'wolf' ? WOLF_HP : WITCH_HP;
    this.enemyHp = this.maxEnemyHp;
    this.playerHp = clamp(playerHp, 0, PLAYER_MAX_HP);
    this.onFinish = onFinish;
    this.random = random;
    this.arena = { x: 280, y: 254, w: 400, h: 184 };
    this.player = { x: 480, y: 346 };
    this.turn = 1;
    this.phase = 'dodge';
    this.time = 0;
    this.invulnerability = 0;
    this.hitFlash = 0;
    this.swordFlash = 0;
    this.hazards = [];
    this.particles = [];
    this.trail = [];
    this.shake = 0;
    this.attempts = 0;
    this.wavesSpawned = 0;
    this._finished = false;
    this._startDefense();
    if (this.playerHp <= 0) this._finish(false);
  }

  _startDefense() {
    this.phase = 'dodge';
    this.defenseTime = 0;
    this.attempts = 0;
    this.wavesSpawned = 0;
    this.hazards = [];
    this._nextSpawn = 0;
    this._spawnWave();
  }

  _spawnWave() {
    if (this.type === 'wolf') {
      this.hazards.push({
        kind: 'scratch', x: this.player.x, y: this.player.y,
        age: 0, warning: WOLF_WARNING, life: WOLF_ATTEMPT_LENGTH,
        radius: 30, activated: false, hit: false,
      });
      this.wavesSpawned++;
      this._nextSpawn = this.wavesSpawned * WOLF_ATTEMPT_LENGTH;
      return;
    }

    // The aimed bottle and two patterned bottles never fill the arena.
    // Every pattern leaves a full corner pocket wider than the bone's hitbox.
    const a = this.arena;
    const phase = (this.turn + this.wavesSpawned) % 4;
    const corners = [
      { x: a.x + 68, y: a.y + 47 },
      { x: a.x + a.w - 68, y: a.y + 47 },
      { x: a.x + a.w - 68, y: a.y + a.h - 47 },
      { x: a.x + 68, y: a.y + a.h - 47 },
    ];
    const aimed = {
      x: clamp(this.player.x, a.x + 36, a.x + a.w - 36),
      y: clamp(this.player.y, a.y + 36, a.y + a.h - 36),
    };
    const positions = [aimed, corners[phase], corners[(phase + 1) % 4]];
    for (let i = 0; i < positions.length; i++) {
      this.hazards.push({
        kind: 'potion', ...positions[i], age: 0,
        warning: POTION_WARNING, life: POTION_WAVE_LENGTH,
        radius: 44, activated: false, hit: false, color: (this.wavesSpawned + i) % 3,
      });
    }
    this.wavesSpawned++;
    this._nextSpawn = this.wavesSpawned * POTION_WAVE_LENGTH;
  }

  update(dt, input = {}) {
    if (!Number.isFinite(dt) || dt <= 0) return;
    // Small fixed substeps keep telegraphs and swept fire fair after a slow frame.
    let remaining = Math.min(dt, 60);
    while (remaining > 0.000001) {
      const step = Math.min(remaining, 1 / 60);
      this._step(step, input);
      remaining -= step;
    }
  }

  _step(dt, input) {
    this.time += dt;
    this.shake = Math.max(0, this.shake - dt);
    for(const p of this.particles){p.life-=dt;p.x+=p.vx*dt;p.y+=p.vy*dt;p.vy+=70*dt;}
    this.particles=this.particles.filter(p=>p.life>0);
    for(const p of this.trail)p.life-=dt;
    this.trail=this.trail.filter(p=>p.life>0);
    this.hitFlash = Math.max(0, this.hitFlash - dt);
    this.swordFlash = Math.max(0, this.swordFlash - dt);
    this.invulnerability = Math.max(0, this.invulnerability - dt);
    if (this.phase !== 'dodge') return;

    const a = this.arena;
    let x = finite(input.x), y = finite(input.y);
    const length = Math.hypot(x, y);
    if (length > 1) { x /= length; y /= length; }
    const speed = input.focus ? 100 : 190;
    this.player.x = clamp(this.player.x + x * speed * dt, a.x + 10, a.x + a.w - 10);
    this.player.y = clamp(this.player.y + y * speed * dt, a.y + 10, a.y + a.h - 10);
    if(length>0&&Math.floor(this.time*30)!==Math.floor((this.time-dt)*30))this.trail.push({x:this.player.x,y:this.player.y,life:.18});
    this.defenseTime += dt;

    for (const hazard of this.hazards) {
      hazard.age += dt;
      if (!hazard.activated && hazard.age + 1e-8 >= hazard.warning) {
        hazard.activated = true;
        this.burst(hazard.x,hazard.y,hazard.kind==='scratch'?'#f0d5b2':'#ffc881',hazard.kind==='scratch'?8:18);
        if(hazard.kind==='potion')this.shake=.14;
        this.attempts++;
      }
      if (!hazard.activated || hazard.hit) continue;
      const activeAge = hazard.age - hazard.warning;
      const duration = hazard.kind === 'scratch' ? 0.28 : 0.65;
      if (activeAge > duration || activeAge < -1e-8) continue;
      const radius = hazard.kind === 'scratch' ? hazard.radius :
        13 + 31 * clamp(activeAge / 0.3, 0, 1);
      if (Math.hypot(this.player.x - hazard.x, this.player.y - hazard.y) < radius + 5) {
        // One bottle can damage only once, including if invulnerability overlaps it.
        hazard.hit = true;
        this._damage(hazard.kind === 'scratch' ? WOLF_DAMAGE : WITCH_DAMAGE);
        if (this.phase === 'lost') return;
      }
    }
    this.hazards = this.hazards.filter(h => h.age < h.life - 1e-8);
    const count = this.type === 'wolf' ? WOLF_SCRATCHES : WITCH_WAVES;
    if (this.wavesSpawned < count && this.defenseTime + 1e-8 >= this._nextSpawn) this._spawnWave();
    const total = count * (this.type === 'wolf' ? WOLF_ATTEMPT_LENGTH : POTION_WAVE_LENGTH);
    if (this.defenseTime + 1e-8 >= total && this.phase === 'dodge') {
      this.phase = 'attack';
      this.hazards = [];
    }
  }

  _damage(amount) {
    if (this.invulnerability > 0 || this.phase !== 'dodge') return false;
    this.playerHp = Math.max(0, this.playerHp - amount);
    this.invulnerability = INVULNERABILITY;
    this.hitFlash = 0.35;
    this.shake=.22;this.burst(this.player.x,this.player.y,'#ef9b84',18);
    if (this.playerHp === 0) this._finish(false);
    return true;
  }

  attack() {
    if (this.phase !== 'attack') return false;
    this.enemyHp = Math.max(0, this.enemyHp - SWORD_DAMAGE);
    this.swordFlash = .5;
    this.shake=.24;this.burst(480,150,'#ffe6a0',30);
    if (this.enemyHp === 0) this._finish(true);
    else {
      this.turn++;
      this._startDefense();
    }
    return true;
  }

  burst(x,y,color,count){for(let i=0;i<count;i++){const angle=i*2.399963;const speed=35+(i%6)*23;this.particles.push({x,y,vx:Math.cos(angle)*speed,vy:Math.sin(angle)*speed-35,life:.35+(i%5)*.1,max:.75,color,size:2+i%3});}}

  _finish(won) {
    if (this._finished) return;
    this._finished = true;
    this.phase = won ? 'won' : 'lost';
    this.hazards = [];
    this.onFinish({ won, playerHp: this.playerHp, type: this.type });
  }

  get status() {
    if (this.phase === 'attack') return 'Your opening. Make it count.';
    if (this.phase === 'won') return this.type === 'wolf' ? 'The path is clear.' : 'The witch has fallen.';
    if (this.phase === 'lost') return 'Even small knights can try again.';
    return this.type === 'wolf'
      ? `Dodge the claw marks. ${Math.min(this.attempts, 4)} / 4 attempts`
      : `Bottles burst after 5 seconds. Wave ${this.wavesSpawned} / 3`;
  }

  draw(ctx, art, time = this.time) {
    const witch = this.type === 'witch';
    const bg = witch ? '#15121f' : '#0c1920';
    const gold = '#d9bb72', cream = '#e8e3cc', dim = '#8eaaa6';
    ctx.save();
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, 960, 540);
    if(this.shake>0&&!this.reducedMotion)ctx.translate(Math.round(Math.sin(this.time*103)*this.shake*15),Math.round(Math.cos(this.time*91)*this.shake*9));
    // An understated stage, not an unrelated battle screen.
    ctx.fillStyle = witch ? '#211c2d' : '#11262c';
    for (let i = 0; i < 14; i++) {
      const x = (i * 89 + 27) % 960;
      const h = 55 + (i * 29) % 110;
      ctx.fillRect(x, 205 - h, 8, h);
      for (let j = 0; j < 4; j++) ctx.fillRect(x - 16 - j * 6, 110 + j * 20, 40 + j * 12, 8);
    }
    ctx.fillStyle = witch ? '#292039' : '#173139';
    ctx.fillRect(0, 204, 960, 2);
    const txt = (s, x, y, size = 2, color = cream, align = 'left') => art.pixelText(ctx, s, x, y, size, color, align);
    txt('BONE KNIGHT', 34, 26, 2, dim);
    txt(witch ? 'THE WITCH OF PINEWOOD' : 'PINE FOREST WOLF', 34, 52, 3, cream);
    txt('ENEMY HP', 734, 34, 2, dim);
    txt(`${this.enemyHp} / ${this.maxEnemyHp}`, 734, 58, 3, cream);
    ctx.fillStyle = '#38323b'; ctx.fillRect(734, 91, 190, 8);
    ctx.fillStyle = witch ? '#ba76b6' : '#d5a665';
    ctx.fillRect(734, 91, Math.round(190 * this.enemyHp / this.maxEnemyHp), 8);
    if (this.swordFlash > 0) ctx.globalAlpha = 0.45 + 0.55 * (Math.floor(this.swordFlash * 30) % 2);
    art.drawSprite(ctx, this.type, 480, 207, { scale: witch ? 2.7 : 3, time, walking: false });
    ctx.globalAlpha = 1;
    if (this.swordFlash > 0) {
      ctx.fillStyle = '#fff1a9';
      for (let i = 0; i < 42; i++) ctx.fillRect(441 + i * 2, 190 - i * 2, 6, 9);
      txt('-3', 545, 140-(.5-this.swordFlash)*45, 3, gold);
    }
    txt(this.status, 480, 224, 2, dim, 'center');
    const a = this.arena;
    ctx.fillStyle = this.hitFlash > 0 ? '#48282d' : '#080d15';
    ctx.fillRect(a.x, a.y, a.w, a.h);
    ctx.fillStyle = '#14202a';
    for (let x = a.x + 16; x < a.x + a.w; x += 24)
      for (let y = a.y + 16; y < a.y + a.h; y += 24) ctx.fillRect(x, y, 2, 2);
    ctx.strokeStyle = cream; ctx.lineWidth = 3;
    ctx.strokeRect(a.x - 2, a.y - 2, a.w + 4, a.h + 4);
    ctx.strokeStyle = '#445359'; ctx.lineWidth = 1;
    ctx.strokeRect(a.x - 6, a.y - 6, a.w + 12, a.h + 12);
    for (const [x, y] of [[a.x - 7, a.y - 7], [a.x + a.w + 1, a.y - 7], [a.x - 7, a.y + a.h + 1], [a.x + a.w + 1, a.y + a.h + 1]]) {
      ctx.fillStyle = gold; ctx.fillRect(x, y, 7, 7);
    }

    ctx.save();
    ctx.beginPath(); ctx.rect(a.x, a.y, a.w, a.h); ctx.clip();
    for(const p of this.trail){ctx.globalAlpha=p.life*.8;art.drawSprite(ctx,'bone',p.x,p.y,{scale:1});}ctx.globalAlpha=1;
    for (const h of this.hazards) drawHazard(ctx, h, time);
    if (!(this.invulnerability > 0 && Math.floor(time * 14) % 2)) art.drawSprite(ctx, 'bone', this.player.x, this.player.y, {scale:1});
    ctx.restore();

    if (this.phase === 'attack') {
      ctx.fillStyle = '#31433a'; ctx.fillRect(300, 447, 360, 35);
      ctx.strokeStyle = gold; ctx.lineWidth = 2; ctx.strokeRect(300, 447, 360, 35);
      txt('E   SWING SWORD   -3 HP', 480, 458, 2, '#f4dc92', 'center');
    } else if (this.phase === 'dodge') {
      txt('WASD / ARROWS TO DODGE', 480, 456, 2, dim, 'center');
    }
    drawBone(ctx, 39, 485, 1.2, cream);
    txt('YIPS', 60, 476, 2, cream);
    txt(`${this.playerHp} / 25 HP`, 60, 499, 2, this.playerHp <= 8 ? '#ee8b7b' : gold);
    ctx.fillStyle = '#24363b'; ctx.fillRect(225, 481, 200, 12);
    ctx.fillStyle = this.playerHp <= 8 ? '#d17469' : '#7cb59b';
    ctx.fillRect(225, 481, 200 * this.playerHp / PLAYER_MAX_HP, 12);
    txt('LONGSWORD  /  3 DMG', 706, 484, 2, dim);
    txt('SHIFT: PRECISE MOVEMENT', 706, 509, 1, '#7c9796');
    for(const p of this.particles){ctx.globalAlpha=Math.min(1,p.life*3);ctx.fillStyle=p.color;ctx.fillRect(Math.round(p.x),Math.round(p.y),p.size,p.size);}ctx.globalAlpha=1;
    if(this.phase==='won')txt('VICTORY',480,304,5,'#f5dfa4','center');
    ctx.restore();
  }
}

function drawBone(ctx, x, y, scale, color) {
  const s = scale * 2;
  const px = Math.round(x - 5 * s), py = Math.round(y - 2 * s);
  ctx.fillStyle = '#10191d'; ctx.fillRect(px - s, py - s, 12 * s, 6 * s);
  ctx.fillStyle = color;
  ctx.fillRect(px, py, 2 * s, 4 * s);
  ctx.fillRect(px + 8 * s, py, 2 * s, 4 * s);
  ctx.fillRect(px + 2 * s, py + s, 6 * s, 2 * s);
  ctx.fillRect(px - s, py - s, 2 * s, 2 * s);
  ctx.fillRect(px - s, py + 3 * s, 2 * s, 2 * s);
  ctx.fillRect(px + 9 * s, py - s, 2 * s, 2 * s);
  ctx.fillRect(px + 9 * s, py + 3 * s, 2 * s, 2 * s);
}

function pixelRing(ctx, x, y, radius, color, fill = false) {
  ctx.fillStyle = color;
  for (let dy = -radius; dy <= radius; dy += 3) {
    const dx = Math.floor(Math.sqrt(Math.max(0, radius * radius - dy * dy)) / 3) * 3;
    if (fill) ctx.fillRect(Math.round(x - dx), Math.round(y + dy), 2 * dx + 3, 3);
    else {
      ctx.fillRect(Math.round(x - dx), Math.round(y + dy), 3, 3);
      ctx.fillRect(Math.round(x + dx), Math.round(y + dy), 3, 3);
    }
  }
}

function drawHazard(ctx, h, time) {
  const x = Math.round(h.x), y = Math.round(h.y);
  if (h.kind === 'scratch') {
    if (!h.activated) {
      pixelRing(ctx, x, y, h.radius, Math.floor(time * 7) % 2 ? '#e77b77' : '#a64b51');
      ctx.fillStyle = '#d96969';
      ctx.fillRect(x - 8, y - 1, 16, 2); ctx.fillRect(x - 1, y - 8, 2, 16);
      return;
    }
    if (h.age - h.warning > 0.38) return;
    ctx.fillStyle = h.age - h.warning < 0.15 ? '#ffe2bd' : '#b95b62';
    for (let claw = -1; claw <= 1; claw++)
      for (let i = 0; i < 13; i++) ctx.fillRect(x - 19 + i * 2 + claw * 9, y - 24 + i * 4, 5, 8);
    return;
  }
  const colors = ['#d795b5', '#a49ad7', '#b8ce86'];
  if (!h.activated) {
    ctx.globalAlpha = 0.2;
    pixelRing(ctx, x, y, h.radius, '#b86679', true);
    ctx.globalAlpha = 1;
    pixelRing(ctx, x, y, h.radius, h.age > 4 ? '#ffb795' : '#aa6479');
    const bob = Math.floor(Math.sin(time * 8) * 2);
    ctx.fillStyle = '#e9cda4'; ctx.fillRect(x - 3, y - 15 + bob, 6, 4);
    ctx.fillStyle = '#c7d3cf'; ctx.fillRect(x - 4, y - 11 + bob, 8, 6);
    ctx.fillRect(x - 8, y - 6 + bob, 16, 15);
    ctx.fillStyle = colors[h.color]; ctx.fillRect(x - 6, y - 2 + bob, 12, 9);
    ctx.fillStyle = '#f3e9cb'; ctx.fillRect(x - 5, y - 4 + bob, 2, 5);
    const left = Math.max(0, 1 - h.age / POTION_WARNING);
    ctx.fillStyle = '#4d354b'; ctx.fillRect(x - 12, y + 16, 24, 3);
    ctx.fillStyle = '#f2c789'; ctx.fillRect(x - 12, y + 16, Math.ceil(24 * left), 3);
    return;
  }
  const age = h.age - h.warning;
  if (age > 0.65) return;
  const radius = 13 + 31 * clamp(age / 0.3, 0, 1);
  ctx.globalAlpha = clamp((0.75 - age) * 2, 0, 0.8);
  pixelRing(ctx, x, y, radius, '#e77761', true);
  ctx.globalAlpha = 1;
  pixelRing(ctx, x, y, radius, '#ffd590');
  for (let i = 0; i < 9; i++) {
    const angle = i * Math.PI * 2 / 9;
    const fx = x + Math.cos(angle) * radius * 0.65;
    const fy = y + Math.sin(angle) * radius * 0.65;
    ctx.fillStyle = '#ffc977'; ctx.fillRect(Math.round(fx), Math.round(fy - 6), 5, 12);
    ctx.fillStyle = '#fff0b5'; ctx.fillRect(Math.round(fx + 1), Math.round(fy - 2), 3, 7);
  }
}
