# Partial Lean formalization

Pinned compiler: **Lean 4.19.0**. Mathlib files use **Mathlib v4.19.0**, commit `c44e0c8ee63ca166450922a373c7409c5d26b00b`.

All seven source files compile locally. Actual axiom reports are saved in their corresponding `.verification.log` files; `verification-manifest.json` records the compiler, Mathlib commit, and source SHA-256 hashes. Successful checks use only the standard foundational axioms `propext`, `Classical.choice`, and `Quot.sound`. There is no `sorryAx` or user-added axiom.

| Source | Checked scope |
|---|---|
| `Localization.lean` | Six original conditional arithmetic lemmas: coarse Hall localization, endpoint bounds, codegree-two obstruction arithmetic and positivity. Needs no Mathlib. |
| `SharpLocalization.lean` | Sharp maximal-subset numerical localization, finite-order cutoff for negative Hall slopes, and generic finite-graph exclusion bounds. |
| `GraphHall.lean` | Actual G-neighborhood definitions and finite-graph exclusion counts, degree orientation, endpoint exclusion, and leading Hall slope at most k-2. |
| `CutLabels.lean` | Exact finite-label distance-constraint encoding, target clipping, and the dual baseline for the maximum-closure solver. |
| `DeletionStability.lean` | Conditional Hall numerator and arbitrary-deletion budget inequalities, plus numerical equality rigidity. |
| `GraphDeletion.lean` | Actual finite-graph edge counts for a complete bipartite missing rectangle and endpoint deletions; at most n-2 deletions guarantee every distinct pair is adjacent or has a common neighbor. |
| `NegativeThreshold.lean` | Numerical lower-bound arguments for both the Hall witness and the four-level potential branches of the strictly-negative threshold. |

**This is not an end-to-end Lean proof of the curvature theorems.** Common-mass cancellation, weighted Hall/max-flow transport identities, integer-optimal-potential existence, the full potential-level reduction, and assembly into the final curvature statements remain handwritten. Algorithmic complexity and full sharpness constructions are also handwritten, with exact computational corroboration.

## Replay

Run `./check.ps1` for the original standalone arithmetic file. Run `./check_all.ps1` for all files in the workspace-local Mathlib project, or provide `-MathlibPath 'C:/path/to/mathlib4'` for another cached v4.19.0 installation. From that Mathlib project, `lake env lean /absolute/path/to/GraphHall.lean` checks an individual file.

Use the pinned dependencies and their Lake cache. No source uses `native_decide` or introduces axioms. The portable compiler, Mathlib checkout and caches are in workspace `work/`, excluded from the research ZIP because of their size; all proof sources and logs are included.
