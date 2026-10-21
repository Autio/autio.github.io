import Mathlib.Combinatorics.SimpleGraph.Finite
import Mathlib.Tactic

/-! Actual finite-graph missing-rectangle counts. No transport formalization. -/

namespace CurvatureDeletionGraph

variable {V : Type*} [Fintype V] [DecidableEq V]
variable (H : SimpleGraph V) [DecidableRel H.Adj]

omit [Fintype V] in
private theorem rectangle_card (U S : Finset V) (hdis : Disjoint U S) :
    ((U ×ˢ S).image (fun p => s(p.1,p.2))).card=U.card*S.card := by
  classical
  have hinj : Set.InjOn (fun p : V × V => s(p.1,p.2)) (↑(U ×ˢ S) : Set (V × V)) := by
    intro p hp q hq heq
    obtain ⟨hpu,hps⟩ := Finset.mem_product.mp hp
    obtain ⟨hqu,hqs⟩ := Finset.mem_product.mp hq
    rcases Sym2.eq_iff.mp heq with h | h
    · exact Prod.ext h.1 h.2
    · have : q.1 ∈ S := h.2 ▸ hps
      exact False.elim (Finset.disjoint_left.mp hdis hqu this)
  rw [Finset.card_image_of_injOn hinj,Finset.card_product]

/-- A complete bipartite rectangle between disjoint sets accounts for at
least |U||S| distinct missing edges. -/
theorem missing_rectangle_count (U S : Finset V) (hdis : Disjoint U S)
    (hrect : ∀ u ∈ U, ∀ s ∈ S, H.Adj u s) :
    U.card*S.card ≤ H.edgeFinset.card := by
  classical
  let rect := (U ×ˢ S).image (fun p => s(p.1,p.2))
  have hinj : Set.InjOn (fun p : V × V => s(p.1,p.2)) (↑(U ×ˢ S) : Set (V × V)) := by
    intro p hp q hq heq
    obtain ⟨hpu,hps⟩ := Finset.mem_product.mp hp
    obtain ⟨hqu,hqs⟩ := Finset.mem_product.mp hq
    rcases Sym2.eq_iff.mp heq with h | h
    · exact Prod.ext h.1 h.2
    · have : q.1 ∈ S := h.2 ▸ hps
      exact False.elim (Finset.disjoint_left.mp hdis hqu this)
  have hcard : rect.card=U.card*S.card := by
    rw [Finset.card_image_of_injOn hinj,Finset.card_product]
  have hsub : rect ⊆ H.edgeFinset := by
    intro e he
    obtain ⟨p,hp,rfl⟩ := Finset.mem_image.mp he
    obtain ⟨hu,hs⟩ := Finset.mem_product.mp hp
    simpa using hrect p.1 hu p.2 hs
  rw [←hcard]
  exact Finset.card_le_card hsub

#print axioms missing_rectangle_count

/-- The entire counting inequality used in deletion stability: endpoint
deletions plus the off-endpoint complete bipartite rectangle are distinct. -/
theorem endpoint_rectangle_count (x y : V) (hxy : x ≠ y) (hnot : ¬H.Adj x y)
    (U S : Finset V) (hdis : Disjoint U S)
    (hxU : x ∉ U) (hyU : y ∉ U) (hxS : x ∉ S) (hyS : y ∉ S)
    (hrect : ∀ u ∈ U, ∀ s ∈ S, H.Adj u s) :
    H.degree x + H.degree y + U.card*S.card ≤ H.edgeFinset.card := by
  classical
  let R := (U ×ˢ S).image (fun p => s(p.1,p.2))
  have hRcard : R.card=U.card*S.card := rectangle_card U S hdis
  have hRsub : R ⊆ H.edgeFinset := by
    intro e he
    obtain ⟨p,hp,rfl⟩ := Finset.mem_image.mp he
    obtain ⟨hu,hs⟩ := Finset.mem_product.mp hp
    simpa using hrect p.1 hu p.2 hs
  have no_endpoint : ∀ z, z ∉ U → z ∉ S → Disjoint R (H.incidenceFinset z) := by
    intro z hzU hzS
    apply Finset.disjoint_left.mpr
    intro e he hi
    obtain ⟨p,hp,rfl⟩ := Finset.mem_image.mp he
    obtain ⟨hu,hs⟩ := Finset.mem_product.mp hp
    rw [H.incidenceFinset_eq_filter] at hi
    rcases Sym2.mem_iff.mp (Finset.mem_filter.mp hi).2 with heq | heq
    · exact hzU (heq ▸ hu)
    · exact hzS (heq ▸ hs)
  have hxyDis : Disjoint (H.incidenceFinset x) (H.incidenceFinset y) := by
    apply Finset.disjoint_left.mpr
    intro e hex hey
    rw [H.incidenceFinset_eq_filter] at hex hey
    obtain ⟨he,hx⟩ := Finset.mem_filter.mp hex
    have hy := (Finset.mem_filter.mp hey).2
    have heq := (Sym2.mem_and_mem_iff hxy).mp ⟨hx,hy⟩
    subst e
    exact hnot (by simpa using he)
  have hRDis : Disjoint R (H.incidenceFinset x ∪ H.incidenceFinset y) := by
    exact Finset.disjoint_union_right.mpr ⟨no_endpoint x hxU hxS,no_endpoint y hyU hyS⟩
  have hsub : R ∪ (H.incidenceFinset x ∪ H.incidenceFinset y) ⊆ H.edgeFinset := by
    intro e he
    rcases Finset.mem_union.mp he with he | he
    · exact hRsub he
    · rcases Finset.mem_union.mp he with he | he
      · rw [H.incidenceFinset_eq_filter] at he
        exact (Finset.mem_filter.mp he).1
      · rw [H.incidenceFinset_eq_filter] at he
        exact (Finset.mem_filter.mp he).1
  have hc := Finset.card_le_card hsub
  rw [Finset.card_union_of_disjoint hRDis,Finset.card_union_of_disjoint hxyDis,hRcard] at hc
  simp only [H.card_incidenceFinset_eq_degree] at hc
  omega

#print axioms endpoint_rectangle_count

/-- Two incidence sets overlap in at most their joining edge. -/
theorem endpoint_degree_sum_bound (x y : V) (hxy : x ≠ y) :
    H.degree x + H.degree y ≤ H.edgeFinset.card + 1 := by
  classical
  have hinter : H.incidenceFinset x ∩ H.incidenceFinset y ⊆ {s(x,y)} := by
    intro e he
    obtain ⟨hex,hey⟩ := Finset.mem_inter.mp he
    rw [H.incidenceFinset_eq_filter] at hex hey
    have hx := (Finset.mem_filter.mp hex).2
    have hy := (Finset.mem_filter.mp hey).2
    simpa using (Sym2.mem_and_mem_iff hxy).mp ⟨hx,hy⟩
  have hi : (H.incidenceFinset x ∩ H.incidenceFinset y).card ≤ 1 := by
    simpa using Finset.card_le_card hinter
  have hunion : H.incidenceFinset x ∪ H.incidenceFinset y ⊆ H.edgeFinset := by
    intro e he
    rcases Finset.mem_union.mp he with he | he
    · rw [H.incidenceFinset_eq_filter] at he
      exact (Finset.mem_filter.mp he).1
    · rw [H.incidenceFinset_eq_filter] at he
      exact (Finset.mem_filter.mp he).1
  have hu := Finset.card_le_card hunion
  have hc := Finset.card_union_add_card_inter (H.incidenceFinset x) (H.incidenceFinset y)
  simp only [H.card_incidenceFinset_eq_degree] at hc
  omega

/-- With at most n-2 deleted edges, any two vertices are adjacent or have
a common neighbor. This is the actual graph form of diameter at most two. -/
theorem deletion_budget_two_step (G : SimpleGraph V) [DecidableRel G.Adj]
    (hbudget : Gᶜ.edgeFinset.card + 2 ≤ Fintype.card V)
    (u v : V) (huv : u ≠ v) :
    G.Adj u v ∨ ∃ w, G.Adj u w ∧ G.Adj v w := by
  classical
  by_contra h
  have hnot : ¬G.Adj u v := fun huv => h (Or.inl huv)
  have hcommon : ¬∃ w, G.Adj u w ∧ G.Adj v w := fun hc => h (Or.inr hc)
  have hcover : Gᶜ.neighborFinset u ∪ Gᶜ.neighborFinset v = Finset.univ := by
    apply Finset.eq_univ_of_forall
    intro w
    simp only [Finset.mem_union, SimpleGraph.mem_neighborFinset]
    by_cases hwu : w=u
    · subst w
      right
      exact (SimpleGraph.compl_adj G v u).2 ⟨huv.symm,fun hvu => hnot hvu.symm⟩
    by_cases hwv : w=v
    · subst w
      left
      exact (SimpleGraph.compl_adj G u v).2 ⟨huv,hnot⟩
    by_cases huw : G.Adj u w
    · right
      exact (SimpleGraph.compl_adj G v w).2 ⟨Ne.symm hwv,fun hvw => hcommon ⟨w,huw,hvw⟩⟩
    · left
      exact (SimpleGraph.compl_adj G u w).2 ⟨Ne.symm hwu,huw⟩
  have hc := Finset.card_union_le (Gᶜ.neighborFinset u) (Gᶜ.neighborFinset v)
  rw [hcover] at hc
  simp only [Finset.card_univ, SimpleGraph.card_neighborFinset_eq_degree] at hc
  have hd := endpoint_degree_sum_bound Gᶜ u v huv
  omega

#print axioms endpoint_degree_sum_bound
#print axioms deletion_budget_two_step

end CurvatureDeletionGraph
