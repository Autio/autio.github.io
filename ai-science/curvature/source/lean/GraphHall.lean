import Mathlib.Combinatorics.SimpleGraph.Finite
import Mathlib.Tactic

namespace CurvatureGraph

variable {V : Type*} [Fintype V] [DecidableEq V]
variable (G : SimpleGraph V) [DecidableRel G.Adj]

def sourcesA (x y : V) : Finset V := G.neighborFinset x \ G.neighborFinset y
def sourcesC (x y : V) : Finset V := G.neighborFinset x ∩ G.neighborFinset y
def targetsB (x y : V) : Finset V := G.neighborFinset y \ G.neighborFinset x

def excluded (U S : Finset V) : Finset V :=
  U.filter (fun u => ∀ s ∈ S, ¬G.Adj u s)

def CodegreeBound (k : ℕ) : Prop :=
  ∀ u v : V, u ≠ v →
    (Gᶜ.neighborFinset u ∩ Gᶜ.neighborFinset v).card ≤ k

theorem target_in_ny_not_nx {x y s : V} {S : Finset V}
    (hS : S ⊆ targetsB G x y) (hs : s ∈ S) :
    G.Adj y s ∧ ¬G.Adj x s := by
  simpa [targetsB, Finset.mem_sdiff] using hS hs

theorem source_ne_target {x y u s : V} {S : Finset V}
    (hS : S ⊆ targetsB G x y) (hu : u ∈ G.neighborFinset x)
    (hs : s ∈ S) : u ≠ s := by
  intro heq
  subst s
  exact (target_in_ny_not_nx G hS hs).2 (by simpa using hu)

theorem source_target_compl {x y u s : V} {S : Finset V}
    (hS : S ⊆ targetsB G x y) (hu : u ∈ G.neighborFinset x)
    (hs : s ∈ S) (hnot : ¬G.Adj u s) : Gᶜ.Adj u s := by
  exact (SimpleGraph.compl_adj G u s).2
    ⟨source_ne_target G hS hu hs,hnot⟩

theorem excluded_set_card (k : ℕ) (hcode : CodegreeBound G k)
    (x y : V) (S : Finset V) (hS : S ⊆ targetsB G x y)
    (hx : x ∉ S) (hU : (excluded G (G.neighborFinset x) S).Nonempty) :
    S.card ≤ k := by
  obtain ⟨z,hz⟩ := hU
  obtain ⟨hzx,hzs⟩ := Finset.mem_filter.mp hz
  have hxz : x ≠ z := by
    intro heq
    subst z
    simp at hzx
  have hi : S ⊆ Gᶜ.neighborFinset x ∩ Gᶜ.neighborFinset z := by
    intro s hs
    simp only [Finset.mem_inter, SimpleGraph.mem_neighborFinset]
    constructor
    · exact (SimpleGraph.compl_adj G x s).2
        ⟨(fun heq => hx (heq ▸ hs)), (target_in_ny_not_nx G hS hs).2⟩
    · exact source_target_compl G hS hzx hs (hzs s hs)
  exact le_trans (Finset.card_le_card hi) (hcode x z hxz)

theorem excluded_sources_count (k : ℕ) (hcode : CodegreeBound G k)
    (x y : V) (S : Finset V) (hS : S ⊆ targetsB G x y)
    (hx : x ∉ S) (hs : 2 ≤ S.card) :
    (excluded G (G.neighborFinset x) S).card + 1 ≤ k := by
  obtain ⟨s,hsS,t,htS,hst⟩ := Finset.one_lt_card.mp (by omega : 1 < S.card)
  let U := excluded G (G.neighborFinset x) S
  have hxU : x ∉ U := by simp [U,excluded]
  have hi : insert x U ⊆ Gᶜ.neighborFinset s ∩ Gᶜ.neighborFinset t := by
    intro u hu
    simp only [Finset.mem_inter, SimpleGraph.mem_neighborFinset]
    rcases Finset.mem_insert.mp hu with heq | hu
    · subst u
      constructor
      · exact SimpleGraph.Adj.symm ((SimpleGraph.compl_adj G x s).2
          ⟨(fun heq => hx (heq ▸ hsS)),(target_in_ny_not_nx G hS hsS).2⟩)
      · exact SimpleGraph.Adj.symm ((SimpleGraph.compl_adj G x t).2
          ⟨(fun heq => hx (heq ▸ htS)),(target_in_ny_not_nx G hS htS).2⟩)
    · obtain ⟨hux,huS⟩ := Finset.mem_filter.mp hu
      exact ⟨(source_target_compl G hS hux hsS (huS s hsS)).symm,
             (source_target_compl G hS hux htS (huS t htS)).symm⟩
  have hc := le_trans (Finset.card_le_card hi) (hcode s t hst)
  simpa [Finset.card_insert_of_not_mem hxU,U] using hc

theorem two_excluded_exclusive_sources (k : ℕ) (hcode : CodegreeBound G k)
    (x y : V) (S : Finset V) (hS : S ⊆ targetsB G x y)
    (hne : S.Nonempty)
    (hp : 2 ≤ (excluded G (sourcesA G x y) S).card) : S.card + 1 ≤ k := by
  obtain ⟨z,hz,w,hw,hzw⟩ := Finset.one_lt_card.mp (by omega :
    1 < (excluded G (sourcesA G x y) S).card)
  obtain ⟨hzA,hzS⟩ := Finset.mem_filter.mp hz
  obtain ⟨hwA,hwS⟩ := Finset.mem_filter.mp hw
  obtain ⟨hzx,hzy⟩ := Finset.mem_sdiff.mp hzA
  obtain ⟨hwx,hwy⟩ := Finset.mem_sdiff.mp hwA
  obtain ⟨s,hs⟩ := hne
  have hzy_ne : z ≠ y := by
    intro heq
    subst z
    exact hzS s hs (target_in_ny_not_nx G hS hs).1
  have hwy_ne : w ≠ y := by
    intro heq
    subst w
    exact hwS s hs (target_in_ny_not_nx G hS hs).1
  have hyS : y ∉ S := by
    intro hy
    exact G.loopless y (target_in_ny_not_nx G hS hy).1
  have hi : insert y S ⊆ Gᶜ.neighborFinset z ∩ Gᶜ.neighborFinset w := by
    intro v hv
    simp only [Finset.mem_inter, SimpleGraph.mem_neighborFinset]
    rcases Finset.mem_insert.mp hv with heq | hv
    · subst v
      constructor
      · exact (SimpleGraph.compl_adj G z y).2 ⟨hzy_ne,by simpa [G.adj_comm] using hzy⟩
      · exact (SimpleGraph.compl_adj G w y).2 ⟨hwy_ne,by simpa [G.adj_comm] using hwy⟩
    · exact ⟨source_target_compl G hS hzx hv (hzS v hv),
             source_target_compl G hS hwx hv (hwS v hv)⟩
  have hc := le_trans (Finset.card_le_card hi) (hcode z w hzw)
  simpa [Finset.card_insert_of_not_mem hyS] using hc

theorem exclusive_source_card_le_targets (x y : V)
    (hdegree : G.degree x ≤ G.degree y) :
    (sourcesA G x y).card ≤ (targetsB G x y).card := by
  have ha := Finset.card_sdiff_add_card_inter (G.neighborFinset x) (G.neighborFinset y)
  have hb := Finset.card_sdiff_add_card_inter (G.neighborFinset y) (G.neighborFinset x)
  rw [Finset.inter_comm] at hb
  change (G.neighborFinset x).card ≤ (G.neighborFinset y).card at hdegree
  unfold sourcesA targetsB
  omega

theorem excluded_exclusive_card (x y : V) (hxy : G.Adj x y)
    (S : Finset V) (hS : S ⊆ targetsB G x y) (hne : S.Nonempty) :
    (excluded G (sourcesA G x y) S).card + 1 ≤ (sourcesA G x y).card := by
  let U := excluded G (sourcesA G x y) S
  have hyA : y ∈ sourcesA G x y := by simp [sourcesA,hxy]
  have hyU : y ∉ U := by
    intro hy
    obtain ⟨s,hs⟩ := hne
    exact (Finset.mem_filter.mp hy).2 s hs (target_in_ny_not_nx G hS hs).1
  have hi : insert y U ⊆ sourcesA G x y := by
    intro v hv
    rcases Finset.mem_insert.mp hv with heq | hv
    · simpa [heq] using hyA
    · exact (Finset.mem_filter.mp hv).1
  have hc := Finset.card_le_card hi
  simpa [Finset.card_insert_of_not_mem hyU,U] using hc

theorem target_subset_card (x y : V) (hxy : G.Adj x y)
    (S : Finset V) (hS : S ⊆ targetsB G x y) (hx : x ∉ S) :
    S.card + 1 ≤ (targetsB G x y).card := by
  have hxB : x ∈ targetsB G x y := by simp [targetsB,hxy.symm]
  have hi : insert x S ⊆ targetsB G x y := Finset.insert_subset hxB hS
  have hc := Finset.card_le_card hi
  simpa [Finset.card_insert_of_not_mem hx] using hc

/-- Actual graph-theoretic bound on every leading Hall-defect slope.
This is the source of the finite spectrum of first-order asymptotic errors. -/
theorem leading_hall_slope_bound (k : ℕ) (hk : 2 ≤ k)
    (hcode : CodegreeBound G k) (x y : V) (hxy : G.Adj x y)
    (hdegree : G.degree x ≤ G.degree y)
    (S : Finset V) (hS : S ⊆ targetsB G x y) (hx : x ∉ S)
    (hne : S.Nonempty) :
    (S.card : ℤ) + ((excluded G (sourcesA G x y) S).card : ℤ) -
      ((targetsB G x y).card : ℤ) ≤ (k : ℤ) - 2 := by
  have hsb := target_subset_card G x y hxy S hS hx
  have hpa := excluded_exclusive_card G x y hxy S hS hne
  have hab := exclusive_source_card_le_targets G x y hdegree
  by_cases hp : 2 ≤ (excluded G (sourcesA G x y) S).card
  · have hsk := two_excluded_exclusive_sources G k hcode x y S hS hne hp
    omega
  · omega

#print axioms leading_hall_slope_bound
#print axioms excluded_set_card
#print axioms excluded_sources_count
#print axioms two_excluded_exclusive_sources

end CurvatureGraph
