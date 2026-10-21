import Mathlib.Combinatorics.SimpleGraph.Finite
import Mathlib.Tactic

/-! Sharper localization: arithmetic and actual finite-graph exclusion bounds.
This file is checked in the workspace-local Mathlib v4.19.0 project.
The connection to curvature via weighted Hall remains separately stated.
-/

namespace Curvature

/-- Numerical bound when a deficient Hall subset has maximal size k.
Here p,q count excluded exclusive/common sources, respectively. -/
theorem maximal_hall_subset_bound
    (k a b alpha beta d p q : ℤ)
    (hk : 2 ≤ k) (hp : 0 ≤ p) (hp1 : p ≤ 1) (hq : 0 ≤ q)
    (htotal : p + q ≤ k - 1)
    (ha : alpha + q ≤ a) (halpha : p + 1 ≤ alpha)
    (hb : b = a + d) (hbeta : beta = alpha + d)
    (hdef : beta * a < k * a + p * b + q * d) :
    beta < k * k - k + 2 := by
  have hd : d = beta - alpha := by omega
  rw [hb, hd] at hdef
  by_cases hsmall : beta < k + p
  · nlinarith [sq_nonneg (k - 1)]
  · have h1 : 0 ≤ (beta - k - p) * (a - alpha - q) :=
      mul_nonneg (by omega) (by omega)
    have h2 : 0 ≤ (alpha - p - 1) * (beta + q - k) :=
      mul_nonneg (by omega) (by omega)
    have h3 : beta < (p + q + 1) * k - q := by
      nlinarith
    have h4 : 0 ≤ (k - 1 - p - q) * (k - 1) :=
      mul_nonneg (by omega) (by omega)
    nlinarith

/-- Any genuinely transient (negative-slope) Hall obstruction has bounded
total graph order, once the graph supplies its neighborhood identities. -/
theorem negative_slope_order_bound
    (k a alpha beta d p q s r : ℤ)
    (hk : 2 ≤ k) (hp : 0 ≤ p) (hq : 0 ≤ q) (hs : 2 ≤ s)
    (hsk : s ≤ k) (htotal : p + q ≤ k - 1)
    (ha : alpha + q ≤ a) (halpha : p + 1 ≤ alpha)
    (hd : d = beta - alpha) (hr : r ≤ k)
    (hpair : 2 ≤ p → s + 1 ≤ k)
    (hnegative : s + p < beta)
    (hdef : beta * a < s * a + p * (a+d) + q * d) :
    a + beta + r ≤ k*k+k+1 := by
  rw [hd] at hdef
  have hpq : 0 ≤ p+q := by omega
  have h0 : 0 ≤ (alpha-p-1)*(p+q) := mul_nonneg (by omega) hpq
  have hprod : (beta-s-p)*(a-p-q) < (p+q)*(s-1) := by nlinarith
  have hprod' : (beta-s-p)*(a-p-q)+1 ≤ (p+q)*(s-1) := by omega
  have h1 : 0 ≤ (beta-s-p-1)*(a-p-q-1) := mul_nonneg (by omega) (by omega)
  have hsum : a+beta ≤ (p+q+1)*s+p := by nlinarith
  have h2 : 0 ≤ (k-p-q-1)*s := mul_nonneg (by omega) (by omega)
  by_cases hp1 : p ≤ 1
  · have h3 : 0 ≤ k*(k-s) := mul_nonneg (by omega) (by omega)
    nlinarith
  · have hpair' : s+1 ≤ k := hpair (by omega)
    have h3 : 0 ≤ k*(k-1-s) := mul_nonneg (by omega) (by omega)
    nlinarith

section FiniteGraph

variable {V : Type*} [Fintype V] [DecidableEq V]
variable (H : SimpleGraph V) [DecidableRel H.Adj]

/-- Complement codegree hypothesis, stated directly on a simple graph H. -/
def CodegreeBound (k : ℕ) : Prop :=
  ∀ u v : V, u ≠ v →
    (H.neighborFinset u ∩ H.neighborFinset v).card ≤ k

/-- Vertices nonadjacent in G to every target of S are common H neighbors.
This is the graph-theoretic step bounding the size of a deficient target set. -/
theorem common_target_card_bound (k : ℕ) (hcode : CodegreeBound H k)
    (x z : V) (hxz : x ≠ z) (S : Finset V)
    (hx : ∀ s ∈ S, H.Adj x s)
    (hz : ∀ s ∈ S, H.Adj z s) : S.card ≤ k := by
  apply le_trans (Finset.card_le_card ?_) (hcode x z hxz)
  intro s hs
  simp only [Finset.mem_inter, SimpleGraph.mem_neighborFinset]
  exact ⟨hx s hs, hz s hs⟩

/-- Two excluded exclusive sources share y as well as every target.
This forces |S|+1<=k, the extra restriction absent in the earlier bound. -/
theorem two_exclusive_sources_bound (k : ℕ) (hcode : CodegreeBound H k)
    (z w y : V) (hzw : z ≠ w) (S : Finset V) (hy : y ∉ S)
    (hzy : H.Adj z y) (hwy : H.Adj w y)
    (hz : ∀ s ∈ S, H.Adj z s)
    (hw : ∀ s ∈ S, H.Adj w s) : S.card + 1 ≤ k := by
  have hi : insert y S ⊆ H.neighborFinset z ∩ H.neighborFinset w := by
    intro s hs
    simp only [Finset.mem_inter, SimpleGraph.mem_neighborFinset]
    rcases Finset.mem_insert.mp hs with rfl | hs
    · exact ⟨hzy,hwy⟩
    · exact ⟨hz s hs,hw s hs⟩
  have hc := le_trans (Finset.card_le_card hi) (hcode z w hzw)
  simpa [Finset.card_insert_of_not_mem hy] using hc

/-- Any two targets already have x as a common H neighbor. Excluded
sources distinct from x therefore number at most k-1. -/
theorem excluded_sources_card_bound (k : ℕ) (hcode : CodegreeBound H k)
    (s t x : V) (hst : s ≠ t) (U : Finset V) (hx : x ∉ U)
    (hsx : H.Adj s x) (htx : H.Adj t x)
    (hs : ∀ u ∈ U, H.Adj s u)
    (ht : ∀ u ∈ U, H.Adj t u) : U.card + 1 ≤ k := by
  exact two_exclusive_sources_bound H k hcode s t x hst U hx hsx htx hs ht

end FiniteGraph

#print axioms maximal_hall_subset_bound
#print axioms negative_slope_order_bound
#print axioms common_target_card_bound
#print axioms two_exclusive_sources_bound
#print axioms excluded_sources_card_bound

end Curvature
