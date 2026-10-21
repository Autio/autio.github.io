# Priority review: claims retained and narrowed

21 October 2026. This is a research audit, not independent expert review or a
certificate of novelty. It replaces the earlier, less complete priority summary.

## Closest predecessors

- [Chen, Liu and You, arXiv:2605.03470v1](https://arxiv.org/html/2605.03470v1):
  Claim 5.2 already bounds missing-neighbor masks under the complement-codegree
  condition. Claim 5.4 uses related distance-cover counting, and Section 5 uses
  the reserved-endpoint counting underlying our incidence bound. These proof
  ingredients are credited. The persistent extremal construction in our paper
  is exactly their Section 6 four-block family after relabeling. The finite-cutoff
  construction modifies that same template by deleting k−2 complement edges.
  Their unmodified template already has a transient zero-idleness defect at
  n=k²+k−1. Distinguishing their positive LLY theorem from our zero-idleness
  equality problem does not establish priority for the new claims.
- [Li and Lu, arXiv:2409.15667v2](https://arxiv.org/html/2409.15667v2),
  Theorem 4 and Corollaries 2–3, give an unequal-degree weighted assignment
  formula and explicit weighted Hall criteria for an LLY equality bound.
  Under the scaling used here, their residual removes target x of demand a and
  reduces source y from b to b−a; their nonempty-set Hall numerator is F(S)+a.
  Thus weighted Hall, the two-weight supply pattern, and unequal-degree
  matching reductions are established background. Their Figure 1 also gives
  a weighted distance-three row bottleneck. The new claim concerns its complete
  localized treatment by one canonical matching, not invention of that phenomenon.
- [Asai and Yamada, arXiv:2605.30830v2](https://arxiv.org/html/2605.30830v2)
  directly study zero-idleness triangle equality for complete graphs with
  matchings, certain stars and cycles removed. These are relevant special-family
  predecessors and are now explicitly discussed.
- [Jost and Liu, arXiv:1103.4037v3](https://arxiv.org/abs/1103.4037v3)
  supply established triangle-based curvature bounds. [Kelly](https://arxiv.org/abs/1909.12156v2)
  supplies integral potentials and reduced local programs; [Hehl](https://arxiv.org/abs/2407.08854v3)
  supplies regular-graph assignment formulas. Common-mass cancellation,
  matching deficiency, minimum-cut lattices and transport duality are classical.
- [Ahuja, Orlin, Stein and Tarjan (1994)](https://doi.org/10.1137/S0097539791199334),
  Theorem 5.2 and Section 8, give a specialized O(tE+t³) flow bound extended to
  a known vertex cover of size t. The [primary report](https://www.cs.princeton.edu/techreports/1991/338.pdf)
  and indexed primary-paper passages support the applicability audit. This is
  a classical theoretical substitution, not an implemented new solver.

## Proposed contributions requiring specialist assessment

For a connected simple graph whose complement has pair codegree at most k:

1. A transient Hall numerator satisfies F≤k²+k+2−n. For k≥3 the order cutoff
   k²+k+1 and the quantitative bound are sharp on the stated interval. For k=2
   no positive negative-slope witness exists.
2. At that boundary the witness has one of two numerical parameter types,
   the curvature deficit is exactly 1/(ab), and one universal vertex repairs
   equality. This is not a classification of the entire graph up to isomorphism.
3. Above the cutoff, the codegree bounds localize defective targets, and the
   residual distance-three support is a star (with the fixed k=2,n=8 fallback).
   Under a>d(k−1), one inclusion-minimal maximum-slope Hall set evaluates the
   full weighted deficit and decides the row-star correction. No second matching
   or common-source row construction is needed on that branch.
4. The implemented matching/dense-Dinic hybrid has the stated O(k⁵n²) word
   bound; the large-order branch takes O(k³n²). A classical unimplemented AOST
   small-order substitution gives O(k⁴n²). No optimality or best-known exponent
   claim is made, and Python timings are not a proof of these asymptotic bounds.

No inspected primary theorem was found that directly implies this entire
combination. The search is incomplete: especially close proof-level overlap
means a reference query is warranted before treating it as publishable novelty.
Partial Lean checking and finite exact tests support correctness, not priority
or scientific significance. Benchmark evidence supports removing specific flow
calls, while native transport wins the generic solver comparison.
