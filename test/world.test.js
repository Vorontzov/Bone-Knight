import test from 'node:test';
import assert from 'node:assert/strict';
import { AREAS, allQuestWolves, getArea, isBlocked, routeLength } from '../dist/world.js';

test('the chapter has eight distinct wolves and one connected world graph', () => {
  const wolves = Object.values(AREAS).flatMap(a => a.interactables.filter(i => i.kind === 'wolf').map(i => i.id));
  assert.deepEqual([...wolves].sort(), [...allQuestWolves].sort());
  assert.equal(new Set(wolves).size, 8);
  const seen = new Set(['town']), queue = ['town'];
  while (queue.length) {
    for (const i of AREAS[queue.shift()].interactables) {
      if (i.toArea && !seen.has(i.toArea)) { seen.add(i.toArea); queue.push(i.toArea); }
    }
  }
  assert.equal(seen.size, Object.keys(AREAS).length);
  assert.ok(routeLength / 130 >= 300, 'forest traversal should contribute at least five minutes of real movement');
  assert.ok(routeLength / 130 < 420, 'forest traversal should not become a padded walk');
});

test('every spawn and transition arrival is clear of collision', () => {
  for (const a of Object.values(AREAS)) {
    assert.equal(isBlocked(a.id, a.spawn.x, a.spawn.y), false, `${a.id} spawn`);
    for (const i of a.interactables) if (i.toArea) {
      assert.ok(AREAS[i.toArea], `${i.id} destination exists`);
      assert.equal(isBlocked(i.toArea, i.toX, i.toY), false, `${i.id} arrival`);
    }
  }
  assert.equal(getArea('unknown').id, 'town');
});

test('all interaction points can be approached from their area spawn', () => {
  const step = 32;
  for (const a of Object.values(AREAS)) {
    const cols = Math.ceil(a.width / step), rows = Math.ceil(a.height / step);
    const visited = new Uint8Array(cols * rows);
    const sx = Math.round((a.spawn.x - step / 2) / step), sy = Math.round((a.spawn.y - step / 2) / step);
    const point = (x, y) => [x * step + step / 2, y * step + step / 2];
    const [startX, startY] = point(sx, sy);
    assert.equal(isBlocked(a.id, startX, startY), false, `${a.id} flood start`);
    const q = [[sx, sy]], reached = [];
    visited[sy * cols + sx] = 1;
    for (let head = 0; head < q.length; head++) {
      const [x, y] = q[head];
      reached.push(point(x, y));
      for (const [nx, ny] of [[x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]]) {
        if (nx < 0 || ny < 0 || nx >= cols || ny >= rows) continue;
        const k = ny * cols + nx;
        if (visited[k]) continue;
        visited[k] = 1;
        const [px, py] = point(nx, ny);
        const [cx, cy] = point(x, y);
        if (!isBlocked(a.id, px, py) && !isBlocked(a.id, (px + cx) / 2, (py + cy) / 2)) q.push([nx, ny]);
      }
    }
    for (const i of a.interactables) {
      assert.ok(reached.some(([x, y]) => Math.hypot(i.x - x, i.y - y) < 60), `${a.id}/${i.id} is reachable within E interaction range`);
    }
  }
});

test('moat blocks movement while its bridge is traversable', () => {
  assert.equal(isBlocked('town', 500, 1000), true);
  assert.equal(isBlocked('town', 700, 1000), false);
  assert.equal(isBlocked('forest', 1000, 2040), true, 'dense forest cannot be used to skip the trail');
  assert.equal(isBlocked('forest', 1000, 2200), false);
  assert.equal(isBlocked('town', NaN, 400), true);
});
