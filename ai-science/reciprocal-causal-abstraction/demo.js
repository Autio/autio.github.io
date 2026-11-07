(function () {
  "use strict";
  const showTuple = x => "(" + x.join(", ") + ")";
  let orbit = [1, 1], step = 0;
  document.getElementById("next-step").addEventListener("click", () => {
    orbit = CausalDemo.fineRule(orbit); step = (step + 1) % 4;
    document.querySelectorAll("[data-orbit]").forEach((el, i) => {
      el.classList.toggle("current", i === step);
      if (i === step) el.setAttribute("aria-current", "step"); else el.removeAttribute("aria-current");
    });
    document.getElementById("orbit-status").textContent = "Fine state " + showTuple(orbit) + ". Coarse description (ON, ON).";
  });
  const inputs = ["clamp-a", "clamp-b", "retention"].map(id => document.getElementById(id));
  const report = document.getElementById("solution-report");
  function update() {
    const result = CausalDemo.evaluate(inputs[2].value, inputs.slice(0, 2).map(el => Number(el.value)));
    report.replaceChildren();
    const line = (label, value) => {
      const p = document.createElement("p"), strong = document.createElement("strong");
      strong.textContent = label + " "; p.append(strong, document.createTextNode(value)); report.append(p);
    };
    line("Fine equilibrium:", result.fine.map(showTuple).join("; ") + ".");
    if (!result.descends) {
      report.className = "solution-report invalid";
      line("This interface does not define the original mechanisms.", "Fine inputs " + showTuple(result.witness.first) + " and " + showTuple(result.witness.second) + " have the same retained description but different retained outputs.");
      line("Repair:", "Retain both components fully. This checks the mechanism interface before intervention; a particular clamp does not repair the original interface.");
      return;
    }
    const macro = y => showTuple(y.map((v, i) => result.keep[i] ? String(v) : v === 0 ? "OFF" : "ON"));
    line("Coarse equilibria:", result.coarse.map(macro).join("; ") + ".");
    report.className = "solution-report" + (result.exact ? " exact" : "");
    if (result.exact) line("Exact for this intervention.", "The unique fine solution projects to the unique coarse solution.");
    else line("One coarse equilibrium has no fine lift.", result.spurious.map(macro).join("; ") + " satisfies the simplified equations but none of the fine solutions represents it. Local mechanism commutation alone is insufficient.");
  }
  inputs.forEach(el => el.addEventListener("change", update));
  update();
})();
