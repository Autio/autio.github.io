# Stage 2 priority and substantiality audit

**Date:** 21 October 2026. **Object:** `manuscript/main.tex`, including its final solver, experiment, and limitation sections. **Recommendation: REWORK before submission.** This audit does not certify priority, establish a duplicate result, or recommend withdrawal. It used a bounded pass of 20 targeted search queries followed by primary-source inspection and citation-chain reads. No external submission, contact, or publication was made.

## Decision

The paper has a defensible candidate contribution, but the current algorithm headline bundles a potentially new structural argument with familiar optimization machinery. Once a transport instance with size polynomial in the complement-codegree parameter has been constructed in polynomial-parameter time, an exact `poly(k) n²` all-edge result follows from established polynomial transportation algorithms. The substantial mathematical questions are therefore **whether the sharp localization and cutoff are new, whether the indexed construction is necessary and new, and what the sparse representation improves over the strongest classical rectangular-transport baseline**.

The most relevant forbidden-complement paper overlaps with the proof more closely than “same graph class, different curvature convention” suggests. It already uses the bounded missing-neighbor argument that produces small transport masks, and related pair counting with a reserved common nonneighbor. Nevertheless, its inspected results are positivity criteria for Lin–Lu–Yau curvature, not exact zero-idleness values or the manuscript's triangle-defect localization. Distinct conventions alone are insufficient evidence of novelty; the different conclusion and the additional argument must be shown explicitly.

The sparse closure construction is a useful implementation and analysis of classical methods. Identical-row aggregation, integer transport duality, maximum closure, segment-tree encodings, and short-path blocking-flow analysis should not be presented as new principles. The cubic distinct-row construction proves a limitation of identical-row aggregation, not a lower bound for computing curvature. The manuscript already makes several of these qualifications correctly.

## What the manuscript claims

For connected simple `G`, let `H` be its complement and assume every pair of distinct vertices has at most `k` common neighbors in `H`, equivalently `H` contains no `K₂,k+1` as a subgraph. The measure is uniform on the **open** neighborhood, with idleness zero.

The inspected draft gives:

* Sharp localization of triangle-defective edges: the exceptional target size `β ≤ k²−k+1`, and complement endpoint degrees at most `k²`.
* A finite-order cutoff: a negative-slope Hall obstruction requires `n ≤ k²+k+1`; above it, `β ≤ max(k+1, 2k−2)`.
* At large order, `O(k³)` distinct source rows and total missing-mask incidence `O(k³)`; at small order, `O(k²)` vertices and `O(k³)` incidence.
* Indexed construction that avoids a fresh linear scan of all common neighbors for each edge.
* `O(k⁷ log(k+1)n²)` with the implemented Dinic backend, or `O(k⁵ log(k+1)n²)` with a theoretical hybrid using an established `O(VE)` maximum-flow backend at small order. The latter backend is not implemented.

These are word-operation claims with `O(log n)`-bit quantities and unreduced exact output, rather than a proof of matching Python wall-clock performance. The `n²` factor is optimal for explicitly listing all edges on a class containing complete graphs; that fact says nothing about optimal dependence on `k`.

## Closest curvature literature: inspected scope and exact overlap

### Chen, Liu, and You, arXiv:2605.03470

[Primary full text](https://arxiv.org/html/2605.03470), especially Theorems 1.1–1.2 and Section 5, Claims 5.1–5.6. Theorem 1.2 concerns positive **LLY** curvature when the complement excludes `K₂,t` and `n ≥ max(t²−2t+2,8t)`. Substitution `t=k+1` gives `max(k²+1,8k+8)`.

Claim 5.2 bounds missing neighbors in endpoint-exclusive sets by `t−1`: this is the same combinatorial mechanism as the manuscript's `|M(u)|≤k`. Later Section 5 pair counting reserves an already shared nonneighbor and reduces the remaining allowance by one. Their proof also localizes bad transport configurations under an assumption of nonpositive LLY curvature. Thus the manuscript should cite this proof-level overlap, not only the graph-class connection.

The inspected theorem does not state exact open-neighborhood zero-idleness curvature, the manuscript's weighted Hall criterion, its sharp triangle-defect cutoff, or an all-edge runtime. Its lazy transport plan uses positive idleness and an anchored endpoint transfer, so its proof cannot simply be relabeled as the zero-idleness proof. **Priority of the additional localization statements remains unresolved.**

### Kelly, arXiv:1909.12156v2

[Primary full text](https://arxiv.org/html/1909.12156v2), Theorem 4, Corollary 5, and Theorem 9 including equations (42)–(44). This directly studies the relevant open-neighborhood curvature. Integral Lipschitz potentials and finitely many anchored endpoint cases are prior art. Theorem 9 reduces the calculation to local-core component linear programs.

The displayed programs have variables indexed by vertices in those components; the number of blocks is not a bound on their dimensions. The inspected theorem does not itself bound those dimensions by complement codegree. A common-neighbor core can contain arbitrarily many vertices even when complement codegree is bounded. The manuscript's safe distinction is therefore **a parameter-bounded weighted instance and its efficient construction**, not the first exact local LP reduction or first small-range integral potential formulation.

### Hehl, regular graphs

[Primary full text, arXiv:2407.08854](https://arxiv.org/html/2407.08854), Theorems 4.3, 4.8, 4.10, and 4.11. Theorem 4.8 is an exact assignment formula for zero-idleness curvature when the endpoint degrees agree, after canceling common-neighbor mass. Theorem 4.3 concerns LLY; the later results relate the two in that equal-degree setting.

Consequently, once the residual side is bounded, the equal-degree subcase is already a standard small assignment problem. The manuscript should identify unequal endpoint degrees—and the positive residual common-source mass they leave—as the reason its weighted row treatment is needed. Merely canceling common mass is not a contribution.

### Hehl, nonnegative LLY condition

[Primary full text, arXiv:2502.03896](https://arxiv.org/html/2502.03896), Theorem 1.1 and Section 2, including Theorems 2.5–2.6. The minimum-degree criterion concerns nonnegative LLY. The final linear interval of the idleness function does not generally extend to idleness zero. The transport interpretation by mass moved distances zero through three is established background, not a new algorithmic ingredient.

### Recent computation papers

* **Zhou and Jiao, “Ollivier–Ricci curvature in cycle overlap mode,” arXiv:2606.03317:** [primary PDF](https://arxiv.org/pdf/2606.03317). Inspected abstract, zero-idleness definition in Section 2.1, Theorem 1, and Sections 4–5. The paper formulates an exact distance-level mass principle, while its proposed CCOM procedure uses greedy/pruning approximations and analyzes approximation error. Its inspected complexity is expressed using original degrees and cycle processing. This is relevant recent zero-idleness algorithm literature, but the inspected statements are not the manuscript's exact parameterized theorem. The full correctness of its exact principle was not independently audited here.
* **Nghiem et al., arXiv:2512.09822:** [primary full text](https://arxiv.org/html/2512.09822). Inspected open-neighborhood definition, classical transport discussion, and special-case quantum constructions. The citation chain leads to classical minimum-cost flow. Generic transport complexity cannot be treated as new to curvature, and special quantum input assumptions do not yield the manuscript's classical all-edge theorem.
* **Gu, Zhang, and Sun, “A residual-shell-based lower bound for Ollivier–Ricci curvature”:** [publisher page](https://www.sciencedirect.com/science/article/abs/pii/S0893965926002260), [arXiv record](https://arxiv.org/abs/2604.12211). Only the primary abstract and publisher section previews were available in this pass. They describe a lower bound/proxy, not an exact solver. This limited inspection does not support claims about every theorem in the paper.
* **DasGupta, Grigorescu, and Mukherjee:** [author-hosted primary manuscript](https://bdasgup.github.io/resume/publ/papers/local-ricci.pdf), previously inspected Fact 1 and Theorem 3; [published article](https://www.sciencedirect.com/science/article/pii/S0304397523004401). Its closed-neighborhood measure and matching reductions require an explicit convention warning. It establishes relevant algorithmic context, but cannot be cited as an exact statement about the manuscript's open-neighborhood zero-idleness measure without translation.

## Classical transportation is a required comparison

The residual problem is a rectangular Hitchcock transportation problem: complete source-target pairs, prescribed supplies and demands, and finite costs in `{1,2,3}`. Missing graph adjacencies change costs; they do not prohibit transport. Therefore classical unbalanced transportation applies directly after the reduction, even without the sparse closure representation.

| Primary source | What was actually inspected | Consequence for this paper |
|---|---|---|
| Tokuyama and Nakano, “Efficient Algorithms for the Hitchcock Transportation Problem,” SIAM J. Comput. 24 (1995), [DOI](https://epubs.siam.org/doi/10.1137/S0097539792236729) | Publisher abstract with explicit expected runtime regimes in the two side sizes and supply ratio | Exploiting a small transport side has a long history. The strongest comparison must distinguish randomization and supply dependence. |
| Brenner, “A faster polynomial algorithm for the unbalanced Hitchcock transportation problem,” ORL 36 (2008), [publisher](https://www.sciencedirect.com/science/article/abs/pii/S0167637708000138), [DOI](https://doi.org/10.1016/j.orl.2008.01.011) | Primary abstract/introductory search extract; full text inaccessible | Directly relevant rectangular transport baseline. No exact runtime substitution is certified here because the accessible primary extract did not expose the formula reliably. |
| Matsui and Scheifele, “A linear time algorithm for the unbalanced Hitchcock transportation problem,” Networks 67 (2016), [publisher](https://onlinelibrary.wiley.com/doi/abs/10.1002/net.21668) | Abstract and reference list; full-text link returned the abstract; runtime was an inaccessible equation image | Confirms algorithms linear in the larger side and a systematic comparison with min-cost flow. Its precise smaller-side dependence must be read before claiming the strongest parameter exponent or a new unbalanced-transport improvement. |
| Ahuja, Orlin, Stein, and Tarjan, “Improved Algorithms for Bipartite Network Flow,” [primary technical report](https://www.cs.princeton.edu/techreports/1991/338.pdf) | Existing project audit and manuscript citation; report fetch blocked in this pass | Appropriate prior art for small-side/short-path flow analysis. The manuscript's helper-node deletion proof is needed to transfer that analysis to its actual network. |

The Matsui–Scheifele references also identify Matsui's 1993 fixed-number-of-supply-points report, Kleinschmidt–Schannath's 1995 strongly polynomial transportation paper, and Vaidyanathan's 2013 unbalanced transportation/Monge-cost paper. These are **uninspected citation leads**, not evidence that their theorems apply. In particular, no Monge property has been proved for the manuscript's costs.

The inspected Tokuyama–Nakano abstract gives near-linear expected behavior in the larger side only in a sufficiently unbalanced regime, with supply-ratio dependence. The manuscript's `m=O(k³), β=O(k)` regime does not automatically fall into that regime. This is a reason to do an actual substitution rather than dismissing the theorem by a paper title. Conversely, the much more general fact that polynomial transportation exists is already enough to make the **coarse** `poly(k)n²` claim a corollary of the structural reduction.

No exact optimality claim about `k⁵ log k` is supported by this audit. Resolving the inaccessible rectangular-transport formulas is a concrete remaining literature task. It should not be replaced by quoting a secondary website's formula or asserting that the segment-tree gadget must be asymptotically superior.

## Is the result an easy known corollary?

There are three different questions:

1. **Given the manuscript's localized instance and construction bound, is polynomial-parameter exact computation routine? Yes.** A standard polynomial transport solver suffices. The sparse network supplies a more explicit exponent and representation, not the existence of tractability after a polynomial-size reduction.
2. **Do the inspected curvature theorems already give that localized instance and construction? Not established.** Chen–Liu–You supplies a closely related combinatorial restriction within a different optimization argument; Kelly supplies exact local LPs without the required parameter-size bound. Neither inspected statement alone yields the sharp weighted-Hall localization plus indexed construction. This is a positive comparison of actual hypotheses and conclusions, not an inference from missing search results.
3. **Could an expert derive the remaining lemma quickly from those papers? Plausibly.** Its ingredients are elementary Hall inequalities and shared-nonneighbor counting. A focused note may still be publishable if the sharp cutoff, extremal examples, and algorithmic construction are correct and genuinely unrecorded. The appropriate test is expert assessment of those specific lemmas, rather than advertising a general optimization breakthrough.

An additional comparison from the earlier audit remains relevant: every cut-induced matching in `G` has size at most `k+2`, because two matched left vertices have the other `r−2` matched right vertices as common neighbors in `H`. Thus this graph class has bounded mim-width under every decomposition. That elementary observation does not supply an inspected exact-curvature theorem or remove the polynomial-parameter construction requirement. Similarly, bounded complement codegree does not bound neighborhood diversity: complements of long paths already give a family with unbounded distinct neighborhood types. These facts guide structural comparisons; they do not establish priority.

## Specific revisions before a submission decision

1. **Reframe the contribution around sharp structural localization.** State the exact weighted-Hall lemma, finite-order cutoff, extremal examples, and indexed construction first. Label the flow consequence and classical subroutines accordingly.
2. **Add proof-level attribution to Chen–Liu–You.** Cite Claim 5.2 and the Section 5 pair-counting argument. Explain precisely which new conclusion requires a new inequality, rather than relying on the idleness distinction alone.
3. **Add a table of actual classical solver substitutions.** Use the manuscript's two regimes, include input construction, bit/word assumptions, randomization, and dependence on supply magnitude. Resolve Brenner and Matsui–Scheifele from accessible primary full text. Until then, do not claim the displayed exponent is best known.
4. **Separate equal- and unequal-degree cases.** Credit Hehl's assignment formula, explain the residual common-source mass, and identify the part that cannot be obtained by a small assignment problem alone.
5. **Keep the cubic example's interpretation narrow.** It is a sharp type-count example; many distinct rows do not demonstrate that all rows matter to the optimum. The manuscript explicitly notes this and should retain it.
6. **Seek independent mathematical review of the structural proof and constructions.** Tests, the CUDA replay, and partial formalization are corroboration. They cannot establish priority, substantiality, or the universal theorem. The matched benchmarks also provide no general practical speedup: the sparse closure encoding loses at every reported main-table size, and the one-level crossover is unstable on replay.

After these revisions and human review, a modest, focused theoretical submission may be reasonable. At present, **submit now** would overstate readiness; **withdraw** would overstate the negative evidence. No inspected primary theorem was shown to reproduce the complete result, and that limited observation is not proof of novelty.

## Search coverage and limits

The bounded queries covered: forbidden `K₂,t` complements and common nonneighbors; exact/open-neighborhood/zero-idleness curvature; the Chen and Kelly citation chains; recent exact and approximate curvature algorithms; unbalanced Hitchcock transportation; almost-complete bipartite min-cost flow; and small-side flow. Some broad queries returned irrelevant results. The decision above rests on the primary texts actually inspected, not the apparent absence of hits.

The strongest unresolved issue is classical rectangular-transport comparison, followed by whether the sharp Hall localization is already implicit in earlier proof methods. This pass did not exhaust all languages, theses, inaccessible papers, or citations. It did not independently re-prove every external theorem or certify the manuscript's correctness. Only this review file was authored for this stage; the manuscript was not changed.
