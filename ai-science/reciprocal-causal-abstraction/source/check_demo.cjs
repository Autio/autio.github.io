const assert = require('node:assert/strict');
const model = require('./demo-model.js');
let cases = 0, descending = 0, exact = 0, spurious = 0;
for (const retention of ['none', 'a', 'b', 'both']) {
  for (const a of [-1, 0, 1, 2]) for (const b of [-1, 0, 1, 2]) {
    const r = model.evaluate(retention, [a, b]); cases++;
    assert.equal(r.fine.length, 1);
    const f = r.fine[0];
    assert.equal(f[0], a < 0 ? f[1] : a);
    assert.equal(f[1], b < 0 ? [0, 2, 1][f[0]] : b);
    assert.equal(r.descends, retention === 'none' || retention === 'both');
    if (r.descends) {
      descending++;
      const failure = retention === 'none' && a === -1 && b === -1;
      assert.equal(r.exact, !failure);
      assert.equal(r.coarse.length, failure ? 2 : 1);
      assert.equal(r.spurious.length, failure ? 1 : 0);
      if (r.exact) exact++; else spurious++;
    } else {
      assert.notDeepEqual(r.witness.outputs[0], r.witness.outputs[1]);
    }
  }
}
let x = [1, 1];
const orbit = [];
for (let n=0; n<4; n++) { orbit.push(x); x = model.fineRule(x); }
assert.deepEqual(orbit, [[1,1],[1,2],[2,2],[2,1]]);
assert.deepEqual(x, [1,1]);
const result = {cases, descending, exact, spurious, orbit_checked: true};
console.log(JSON.stringify(result));
