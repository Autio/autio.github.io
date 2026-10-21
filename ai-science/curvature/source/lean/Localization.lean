import Lean

/-!
Arithmetic foundations for the complement-codegree curvature manuscript.

Scope: the graph-theoretic and transport premises are NOT proved here.
The results below verify consequences of the explicitly listed natural-number
inequalities. No additional axioms, `sorry`, or `admit` are used.
-/

namespace Curvature

/-- Integer, denominator-cleared form of the localization argument.
`excluded` counts sources inaccessible to a deficient target subset.
The graph argument must supply each of the four hypotheses below. -/
theorem hall_localization
    (a b k s beta excluded : Nat)
    (hsize : s ≤ k)
    (hexcluded : excluded + 1 ≤ k)
    (hratio : b < s * a)
    (hdeficit : beta * a < s * a + excluded * b) :
    beta < k * k := by
  have hbound : s * a + excluded * b ≤ (k * k) * a := by
    calc
      s * a + excluded * b
          ≤ s * a + excluded * (s * a) :=
            Nat.add_le_add_left
              (Nat.mul_le_mul_left excluded (Nat.le_of_lt hratio)) (s * a)
      _ = ((excluded + 1) * s) * a := by
            simp [Nat.add_mul, Nat.mul_assoc, Nat.add_comm]
      _ ≤ (k * k) * a :=
            Nat.mul_le_mul_right a (Nat.mul_le_mul hexcluded hsize)
  by_cases h : beta < k * k
  · exact h
  · have hge : k * k ≤ beta := by omega
    have hm : (k * k) * a ≤ beta * a := Nat.mul_le_mul_right a hge
    omega

/-- Complement endpoint-degree bound once localization and bookkeeping hold. -/
theorem endpoint_degree_bound
    (k alpha beta r hx hy : Nat)
    (hbeta : beta < k * k)
    (hab : alpha ≤ beta)
    (hr : r ≤ k)
    (hx_eq : hx + 1 = beta + r)
    (hy_eq : hy + 1 = alpha + r) :
    hx + 2 ≤ k * k + k ∧ hy + 2 ≤ k * k + k := by
  omega

/-- For complement codegree two, excluding one common source cannot
produce a positive Hall deficit for a two-target subset. -/
theorem common_source_no_deficit
    (a d beta : Nat)
    (ha : 2 ≤ a)
    (hbeta : 3 ≤ beta)
    (hd : d + 1 ≤ beta) :
    d ≤ (beta - 2) * a := by
  have hm : (beta - 2) * 2 ≤ (beta - 2) * a :=
    Nat.mul_le_mul_left (beta - 2) ha
  omega

/-- The numerical part of the unique codegree-two Hall obstruction.
The positive deficiency can only have alpha=2, d=1, beta=3. -/
theorem exclusive_source_obstruction
    (a d alpha beta : Nat)
    (halpha : 2 ≤ alpha)
    (ha : alpha ≤ a)
    (hbalance : beta = alpha + d)
    (hbeta : 3 ≤ beta)
    (hdeficit : (beta - 2) * a < a + d) :
    alpha = 2 ∧ d = 1 ∧ beta = 3 := by
  have hb : beta ≤ 3 := by
    by_cases hnot : beta ≤ 3
    · exact hnot
    · apply False.elim
      have hfour : 4 ≤ beta := by omega
      have hsplit : beta - 2 = (beta - 3) + 1 := by omega
      have hprod : (beta - 2) * a = (beta - 3) * a + a := by
        rw [hsplit, Nat.add_mul]
        simp
      have hd : d ≤ (beta - 3) * a := by
        calc
          d ≤ beta - 2 := by omega
          _ ≤ (beta - 3) * 2 := by omega
          _ ≤ (beta - 3) * a :=
            Nat.mul_le_mul_left (beta - 3) (by omega)
      omega
  have hb_eq : beta = 3 := by omega
  rw [hb_eq] at hdeficit
  simp at hdeficit
  omega

/-- Positive numerator of every exceptional edge when its smaller degree
is at least three and its correction numerator is at most two. -/
theorem exceptional_numerator_positive
    (a epsilon : Nat) (ha : 3 ≤ a) (he : epsilon ≤ 2) :
    epsilon < a * (a - 2) := by
  have hm : 3 * 1 ≤ a * (a - 2) :=
    Nat.mul_le_mul ha (by omega)
  omega

/-- The order-eight consequence of the numerical exceptional-edge bound.
The graph proof must still establish n <= a+5 and the curvature formula. -/
theorem order_eight_exception_positive
    (n a epsilon : Nat) (hn : 8 ≤ n) (ha : n ≤ a + 5)
    (he : epsilon ≤ 2) : epsilon < a * (a - 2) := by
  exact exceptional_numerator_positive a epsilon (by omega) he

#print axioms hall_localization
#print axioms endpoint_degree_bound
#print axioms common_source_no_deficit
#print axioms exclusive_source_obstruction
#print axioms exceptional_numerator_positive
#print axioms order_eight_exception_positive

end Curvature
