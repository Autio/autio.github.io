/* Exact finite demo. No external packages, analytics or network calls. */
(function (root) {
  "use strict";
  const fineStates = Array.from({length: 9}, (_, n) => [Math.floor(n / 3), n % 3]);
  const swap = [0, 2, 1];
  const key = x => x.join(",");
  const fineRule = x => [x[1], swap[x[0]]];
  function evaluate(retention = "none", clamp = [-1, -1]) {
    if (!["none", "a", "b", "both"].includes(retention) || clamp.length !== 2 ||
        clamp.some(x => !Number.isInteger(x) || x < -1 || x > 2)) throw new Error("Invalid demo input");
    const keep = [retention === "a" || retention === "both", retention === "b" || retention === "both"];
    const project = x => x.map((v, i) => keep[i] ? v : Number(v !== 0));
    const fine = fineStates.filter(x => fineRule(x).every((v, i) => x[i] === (clamp[i] < 0 ? v : clamp[i])));
    const table = new Map();
    let witness = null;
    // Check the original mechanism interface before applying any clamp.
    for (const x of fineStates) {
      const input = key(project(x)), output = project(fineRule(x));
      const old = table.get(input);
      if (old && key(old.output) !== key(output) && !witness) witness = {first: old.state, second: x, input: project(x), outputs: [old.output, output]};
      if (!old) table.set(input, {state: x, output});
    }
    if (witness) return {descends: false, fine, keep, witness};
    const macroClamp = clamp.map((v, i) => v < 0 ? -1 : keep[i] ? v : Number(v !== 0));
    const macroStates = [...table.keys()].map(k => k.split(",").map(Number));
    const coarse = macroStates.filter(y => table.get(key(y)).output.every((v, i) => y[i] === (macroClamp[i] < 0 ? v : macroClamp[i])));
    const projected = new Set(fine.map(x => key(project(x))));
    const spurious = coarse.filter(y => !projected.has(key(y)));
    return {descends: true, fine, coarse, spurious, keep, exact: spurious.length === 0 && coarse.length === fine.length};
  }
  const api = {evaluate, fineRule};
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  else root.CausalDemo = api;
})(typeof globalThis !== "undefined" ? globalThis : this);
