"use strict";
const examples = {
  diagonal: {cells: ["00", "11"], caption: "Two correlated global states", result: "No universal least-loss choice.", explanation: "Keeping A and collapsing B works; keeping B and collapsing A also works. The two choices are incomparable. Their common refinement retains both views and still misses two combinations."},
  corners: {cells: ["00", "01", "10"], caption: "Three corners of the view product", result: "Connectedness does not resolve the choice.", explanation: "Every view state occurs, and the relation is connected, but (1, 1) is missing. Collapsing either view yields a qualifying two-state quotient. Neither choice preserves all the distinctions preserved by the other."},
  full: {cells: ["00", "01", "10", "11"], caption: "Every combination is realized", result: "A universal least-loss quotient exists.", explanation: "The four global states already cover the full product of the views. Keeping both views and all four states is the universal choice. If several source states shared one tuple, exactly those duplicates would be merged."}
};
for (const button of document.querySelectorAll("[data-example]")) {
  button.addEventListener("click", () => {
    const example = examples[button.dataset.example];
    for (const other of document.querySelectorAll("[data-example]")) other.setAttribute("aria-pressed", String(other === button));
    for (const pair of ["00", "01", "10", "11"]) {
      const present = example.cells.includes(pair);
      const cell = document.getElementById("cell-" + pair);
      cell.className = present ? "present" : "absent";
      cell.textContent = (present ? "Realized" : "Missing") + " · (" + pair[0] + ", " + pair[1] + ")";
    }
    document.getElementById("matrix-caption").textContent = example.caption;
    const result = document.getElementById("demo-result");
    const title = document.createElement("strong");
    title.textContent = example.result;
    result.replaceChildren(title, document.createTextNode(" " + example.explanation));
    result.className = "demo-status" + (button.dataset.example === "full" ? " universal" : "");
  });
}
