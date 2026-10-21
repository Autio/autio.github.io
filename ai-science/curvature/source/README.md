# Exact graph-curvature research snapshot

21 October 2026. AI-assisted research by Petri Mikael Autio with Codex. Candidate novelty and independent mathematical review remain unresolved. This curated snapshot excludes private correspondence and machine-access details.

Start with structural-theorem.md for the exact complement-codegree-two formula, and mincut-algorithm.md for the general bounded-codegree construction. The deletion thresholds have separate manuscripts. Standard transport, matching, integral-potential and maximum-closure methods are credited in the texts. Chen-Liu-You's Figure 1 supplies the even-order sharp graph in one deletion construction.

The code is supplied under this repository's existing GPL licence; see LICENSE. Research claims remain preliminary.

## Reproduce

Python 3.10+; standard library only.

```text
python verify_structural_theorem.py
python verify_general_complement.py
python benchmark_public.py
python deletion_stability_probe.py --max-n 8
python negative_threshold_probe.py
```

The exhaustive checks may take several minutes. Benchmark inputs are synthetic eligible graphs, and the baseline is the project reference solver, not an optimised library. Fast timings include recognition and preprocessing; generation is excluded. Results depend on hardware and runtime.

For Lean, see lean/README.md and its pinned compiler/Mathlib versions. Thirty-five supporting lemmas compile. The full transport and curvature theorems are not end-to-end formalised.
