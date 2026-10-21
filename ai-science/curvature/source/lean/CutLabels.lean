import Mathlib.Tactic

namespace CurvatureCut

/-- The exact finite-label implication encoding used by cut_transport.py.
This checks the cost constraints, not the max-flow implementation. -/
theorem distance_constraint_encoding (f g c : ℤ)
    (hf : -1 ≤ f ∧ f ≤ 1) (hg : -2 ≤ g ∧ g ≤ 0)
    (hc : c = 1 ∨ c = 2 ∨ c = 3) :
    (f-g ≤ c) ↔
      ((c=1 → ((0≤f → -1≤g) ∧ (1≤f → 0≤g))) ∧
       (c=2 → (1≤f → -1≤g))) := by omega

/-- Positive target labels can be clipped to zero in the bipartite dual. -/
theorem clip_target_label (f g c : ℤ)
    (hf : f ≤ 1) (hc : 1 ≤ c) (hfeasible : f-g ≤ c) :
    f-min g 0 ≤ c := by omega

/-- Baseline dual objective for labels initialized at source -1, target -2. -/
theorem baseline_objective (supply demand : ℤ) (h : supply=demand) :
    -supply+2*demand=supply := by omega

#print axioms distance_constraint_encoding
#print axioms clip_target_label
#print axioms baseline_objective

end CurvatureCut
