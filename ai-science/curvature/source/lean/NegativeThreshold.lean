import Mathlib.Tactic

/-! Numerical core of the four-level integer-potential deletion bound.
The existence and reduction of optimal transport potentials is not formalized.
-/

namespace CurvatureNegative

/-- Denominator-cleared transport profit in the one-top-vertex case
forces the inequality used by four_level_budget. -/
theorem four_level_profit_reduction (k h q r w z : ℤ)
    (hk : 0 ≤ k) (hh : 0 ≤ h) (hr : 0 ≤ r) (hw : 0 ≤ w)
    (hz : h+1 ≤ z)
    (hprofit : (q+r+w+1)*(2*k+h+2) < (2*q+w)*(k+h+2)) :
    1 ≤ q-1 ∧ 2*k < (z+1)*(q-1) := by
  have h1 : 0 ≤ k*(2*r+w+2) := mul_nonneg hk (by omega)
  have hpos : 0 < (h+2)*(q-r-1) := by nlinarith
  have hq : 1 ≤ q-r-1 := by
    by_contra hnq
    have hnonpos : (h+2)*(q-r-1) ≤ 0 :=
      mul_nonpos_of_nonneg_of_nonpos (by omega) (by omega)
    omega
  have h2 : 0 ≤ k*(2*r+w) := mul_nonneg hk (by omega)
  have h3 : 0 ≤ (h+2)*r := mul_nonneg (by omega) hr
  have h4 : 0 ≤ (z-h-1)*(q-1) := mul_nonneg (by omega) (by omega)
  constructor
  · omega
  · nlinarith

/-- Integer numerical core of a negative adjacency-based Hall witness. -/
theorem hall_negative_budget (u e v q c d : ℤ)
    (hu : 1 ≤ u) (he : 1 ≤ e) (hv : 1 ≤ v)
    (hq : 0 ≤ q) (hc : 0 ≤ c) (hcupper : c ≤ u+q-1)
    (hdlower : v+q+c+1-e ≤ d)
    (hnegative : d*u < (u+e)*v) :
    d ≤ 2*(u+q+v)*e-c-2*(u+e)+1 := by
  let D := 2*(u+q+v)*e-c-2*(u+e)+1
  have hbound : -1 ≤ u*D-(u+e)*v := by
    by_cases he1 : e=1
    · subst e
      have hdl : 0 ≤ u*(d-v-q-c) := mul_nonneg (by omega) (by omega)
      have hvlower : u*(c+q)+1 ≤ v := by nlinarith
      by_cases hu1 : u=1
      · subst u
        dsimp [D]
        nlinarith
      · have h1 : 0 ≤ (u-1)*(v-u*(c+q)-1) := mul_nonneg (by omega) (by omega)
        have h2 : 0 ≤ u*c*(u-2) := mul_nonneg (mul_nonneg (by omega) hc) (by omega)
        have h3 : 0 ≤ u*q*(u+1) := mul_nonneg (mul_nonneg (by omega) hq) (by omega)
        dsimp [D]
        nlinarith
    · have he2 : 2 ≤ e := by omega
      by_cases hu1 : u=1
      · subst u
        have h1 : 0 ≤ (e-1)*(v-1) := mul_nonneg (by omega) (by omega)
        have h2 : 0 ≤ (2*e-1)*q := mul_nonneg (by omega) hq
        dsimp [D]
        nlinarith
      · have hu2 : 2 ≤ u := by omega
        have h1 : 0 ≤ (2*e-1)*(u-1) := mul_nonneg (by omega) (by omega)
        have hC : 0 ≤ (2*e-1)*u-e := by nlinarith
        have h2 : 0 ≤ (2*e-3)*(u-2) := mul_nonneg (by omega) (by omega)
        have h3 : 0 ≤ (2*e-1)*q := mul_nonneg (by omega) hq
        have hB : 0 ≤ 2*e*(u+q-1)-c-2*u+1 := by nlinarith
        have h4 := mul_nonneg hC (show 0 ≤ v by omega)
        have h5 := mul_nonneg (show 0 ≤ u by omega) hB
        dsimp [D]
        nlinarith
  have hprod : d*u ≤ (u+e)*v-1 := by omega
  by_contra h
  have hgap : 0 ≤ u*(d-D-1) := mul_nonneg (by omega) (by omega)
  nlinarith

/-- With one top-level vertex, the forced deleted rectangles and omitted
endpoint edges force at least half the order in excess of n-2 deletions. -/
theorem four_level_budget (M l z Q k : ℤ)
    (hz : 1 ≤ z) (hQ : 1 ≤ Q)
    (hbase : 1+z*Q ≤ M) (hextra : l+z*Q-k ≤ M)
    (hnegative : 2*k < (z+1)*Q) :
    l+z+Q+1 ≤ 2*M := by
  have hgap : 0 ≤ (z-1)*(3*Q-2) := mul_nonneg (by omega) (by omega)
  nlinarith

#print axioms four_level_budget
#print axioms hall_negative_budget
#print axioms four_level_profit_reduction

end CurvatureNegative
