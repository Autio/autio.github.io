import Mathlib.Tactic

/-! Conditional arithmetic for arbitrary complete-graph deletions.
Graph counting and the transport/max-flow identification remain handwritten.
This file does not assert a full formal curvature theorem. -/

namespace CurvatureDeletion

/-- No excluded sources means no positive Hall deficiency. -/
theorem no_exclusion_deficit (a s beta : ℤ)
    (ha : 0 ≤ a) (hs : s ≤ beta) :
    a * (s - beta) ≤ 0 := by
  exact mul_nonpos_of_nonneg_of_nonpos ha (by omega)

/-- The endpoint source y forces a simple bound on any Hall numerator. -/
theorem hall_numerator_bound (a alpha beta d s p q : ℤ)
    (ha : 0 ≤ a) (hd : 0 ≤ d)
    (hbeta : beta = alpha + d)
    (hp : p + 1 ≤ alpha) (he : p + q ≤ a - 1) :
    a*(s+p-beta)+d*(p+q) ≤ a*(s-1) := by
  have h1 : 0 ≤ a*(alpha-p-1) := mul_nonneg ha (by omega)
  have h2 : 0 ≤ d*(a-p-q) := mul_nonneg hd (by omega)
  rw [hbeta]
  nlinarith

/-- Counting the deleted complete bipartite rectangle gives a unit gap. -/
theorem deletion_budget_gap (a c t r s p q : ℤ)
    (ha : 0 ≤ a) (hr : 0 ≤ r) (hs : 0 ≤ s)
    (he : 1 ≤ p+q) (hbudget : t+r+s*(p+q) ≤ c) :
    a*(s-1) ≤ a*(c-t-1) := by
  have h1 : 0 ≤ s*(p+q-1) := mul_nonneg hs (by omega)
  have h2 : s ≤ c-t := by nlinarith
  exact mul_le_mul_of_nonneg_left (by omega : s-1 ≤ c-t-1) ha

/-- Equality in the graph count forces no off-endpoint deletion and no
common deleted neighbor. The graph supplies the identity c-t=z+r. -/
theorem equality_rigidity (c t z r : ℤ)
    (hz : 0 ≤ z) (hr : 0 ≤ r) (hid : c-t=z+r) :
    c=t ↔ z=0 ∧ r=0 := by omega

#print axioms no_exclusion_deficit
#print axioms hall_numerator_bound
#print axioms deletion_budget_gap
#print axioms equality_rigidity

end CurvatureDeletion
