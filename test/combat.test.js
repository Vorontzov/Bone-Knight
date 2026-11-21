import test from 'node:test';
import assert from 'node:assert/strict';
import {
  Battle, PLAYER_MAX_HP, SWORD_DAMAGE, WOLF_HP, WITCH_HP,
  WOLF_SCRATCHES, WOLF_ATTEMPT_LENGTH, WOLF_WARNING,
  POTION_WARNING, POTION_WAVE_LENGTH, WITCH_WAVES,
} from '../dist/combat.js';

// Follow a safe destination away from the currently aimed hazard.
function dodgeDefense(battle) {
  let ticks = 0;
  while (battle.phase === 'dodge' && ticks++ < 1600) {
    const active = battle.hazards.filter(h => h.age < h.warning + 0.65);
    const a = battle.arena;
    const options = [
      { x: a.x + 12, y: a.y + 12 },
      { x: a.x + a.w - 12, y: a.y + 12 },
      { x: a.x + 12, y: a.y + a.h - 12 },
      { x: a.x + a.w - 12, y: a.y + a.h - 12 },
    ];
    const target = options.sort((p, q) => {
      const clearance = r => Math.min(...active.map(h => Math.hypot(r.x - h.x, r.y - h.y)));
      return clearance(q) - clearance(p);
    })[0];
    const dx = target.x - battle.player.x, dy = target.y - battle.player.y;
    const length = Math.hypot(dx, dy);
    battle.update(1 / 60, { x: length > 2 ? dx / length : 0, y: length > 2 ? dy / length : 0 });
  }
  assert.equal(battle.phase, 'attack', 'a safely dodged defense turn should reach the attack phase');
}

test('requested health and sword statistics are preserved', () => {
  assert.equal(PLAYER_MAX_HP, 25);
  assert.equal(SWORD_DAMAGE, 3);
  assert.equal(new Battle({ type: 'wolf' }).enemyHp, 15);
  assert.equal(new Battle({ type: 'witch' }).enemyHp, 30);
  assert.equal(WOLF_HP, 15);
  assert.equal(WITCH_HP, 30);
});

test('four wolf attempts advance the turn even when all are dodged', () => {
  const b = new Battle({ type: 'wolf' });
  assert.equal(b.attack(), false);
  dodgeDefense(b);
  assert.equal(b.attempts, WOLF_SCRATCHES);
  assert.equal(b.playerHp, 25);
  assert.ok(b.defenseTime >= WOLF_SCRATCHES * WOLF_ATTEMPT_LENGTH - 0.001);
  assert.equal(b.attack(), true);
  assert.equal(b.enemyHp, 12);
  assert.equal(b.phase, 'dodge');
  assert.equal(b.attack(), false, 'one opening cannot be used twice');
  assert.equal(b.enemyHp, 12);
});

test('wolf telegraph does not damage early, then damages once per scratch', () => {
  const b = new Battle({ type: 'wolf' });
  b.update(WOLF_WARNING - 0.01);
  assert.equal(b.playerHp, 25);
  b.update(0.02);
  assert.equal(b.playerHp, 22);
  b.update(0.3);
  assert.equal(b.playerHp, 22);
  assert.equal(b.attempts, 1);
});

test('potions glow for five seconds and cannot repeatedly hit', () => {
  const b = new Battle({ type: 'witch' });
  b.update(POTION_WARNING - 0.01);
  assert.equal(b.playerHp, 25);
  assert.ok(b.hazards.every(h => !h.activated));
  b.update(0.02);
  assert.equal(b.playerHp, 20);
  b.update(0.64);
  assert.equal(b.playerHp, 20, 'the same bottle must not apply another five damage');
});

test('three witch potion waves leave reachable safe space', () => {
  const b = new Battle({ type: 'witch' });
  dodgeDefense(b);
  assert.equal(b.wavesSpawned, WITCH_WAVES);
  assert.equal(b.playerHp, 25);
  assert.ok(b.defenseTime >= WITCH_WAVES * POTION_WAVE_LENGTH - 0.001);
});

test('wolf victory takes five attacks and sends one completion callback', () => {
  const results = [];
  const b = new Battle({ type: 'wolf', onFinish: r => results.push(r) });
  for (let attack = 0; attack < 5; attack++) {
    dodgeDefense(b);
    assert.equal(b.attack(), true);
  }
  assert.equal(b.phase, 'won');
  assert.equal(b.enemyHp, 0);
  assert.equal(b.attack(), false);
  b.update(30, { x: 1 });
  assert.deepEqual(results, [{ won: true, playerHp: 25, type: 'wolf' }]);
});

test('witch victory takes ten attacks and prevents damage after completion', () => {
  const results = [];
  const b = new Battle({ type: 'witch', onFinish: r => results.push(r) });
  for (let attack = 0; attack < 10; attack++) {
    dodgeDefense(b);
    b.attack();
  }
  assert.equal(b.enemyHp, 0);
  assert.equal(b.playerHp, 25);
  b.update(30);
  assert.equal(results.length, 1);
  assert.equal(results[0].won, true);
});

test('defeat clamps hp at zero and fires callback once', () => {
  const results = [];
  const b = new Battle({ type: 'witch', playerHp: 5, onFinish: r => results.push(r) });
  b.update(6);
  assert.equal(b.phase, 'lost');
  assert.equal(b.playerHp, 0);
  b.update(60);
  assert.equal(b.attack(), false);
  assert.deepEqual(results, [{ won: false, playerHp: 0, type: 'witch' }]);
});

test('movement remains inside the arena and diagonal movement is normalized', () => {
  const b = new Battle();
  const start = { ...b.player };
  b.update(0.1, { x: 1, y: 1 });
  assert.ok(Math.abs(Math.hypot(b.player.x - start.x, b.player.y - start.y) - 19) < 0.001);
  b.update(1, { x: -1, y: -1 });
  assert.ok(b.player.x >= b.arena.x + 10);
  assert.ok(b.player.y >= b.arena.y + 10);
  b.update(0.2, { x: NaN, y: Infinity });
  assert.ok(Number.isFinite(b.player.x) && Number.isFinite(b.player.y));
});
