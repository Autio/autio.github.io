# Internal publication review

7 November 2026. This is an independent AI review within the same project, not external peer review. It covers `theorem.md`, `retention.md`, `minimal-counterexample.md`, the accompanying proof review, and the primary-source comparisons in `PRIOR-WORK.md`. It does not certify the eventual rendered PDF, public website, or archive.

## Recommendation

A concise research preprint is defensible. The strongest result is the exact universal classification: for fixed allowed dependency graph `D` and product surjection `q`, every compatible simple finite model descends to a simple model precisely when `D[P]` is acyclic, where `P` consists of coordinates whose maps are neither injective nor constant. I found no mathematical counterexample or missing proof obligation in the stated finite, loopless setting.

This is a plausible narrow contribution, not established priority. The proof uses familiar methods, and a short proof does not establish that the classification is old or new. The literature search found close foundations and older versions of the generic obstruction, but not this exact graph/quotient theorem. Publish with that uncertainty stated, rather than claiming a first solution to cyclic causal abstraction. External review remains open; its absence need not prevent a clearly labelled preprint.

## Mathematical claim assessment

| Claim | Review finding |
| --- | --- |
| The universal `D[P]` classification | Main theorem survives adversarial review. Fixed `D,q`, universal quantification over compatible simple mechanisms, and allowed rather than mandatory graph edges are essential. |
| All matched fine point interventions | Covered. The auxiliary clamp on retained coordinates is legitimate because simplicity includes every fine clamp value; surjectivity covers every macro clamp. |
| Constant maps and singleton domains | Correctly handled. Singleton fine domains belong to the injective class. Wholly erased coordinates are solved using the original model's simplicity, not a hidden assumption of acyclicity. |
| Sharp cycle construction | Correct on all input values, not only the three selected states. Any clamped cycle vertex breaks the remaining equations into chains, so the witness is genuinely simple. |
| Minimum two-component classification | The nine-state minimum and uniqueness up to relabelling follow. The only unliftable equilibrium cell at the minimum is double-by-double; its two-state composite must be the transposition. This is a useful supporting proposition. |
| Refinement and retention | The hidden-dependency predecessor-closure criterion correctly tests descent for full-retention upgrades. Combined with the graph test it yields an exact condition for those two certificates. It is not a necessary condition for semantic correctness of an individual installed model, nor a general bit-optimal abstraction theorem. |
| Cyclic dynamics | No convergence conclusion is proved. Unique interventional equilibria can coexist with oscillatory update trajectories. |

The minimum-example enumeration and independent proof checks strengthen confidence in implementation and edge cases; they do not substitute for the proof or establish priority. The internal proof-review record documents their precise scope.

## Priority pressure

The most important comparisons are already detailed in [PRIOR-WORK.md](PRIOR-WORK.md). Their practical implication is to keep the paper's claim small:

- Cyclic solution-set abstraction and componentwise value merging are established, including Geiger et al., Definitions 25 and 38. The theorem supplies a sufficient-and-necessary universal interface condition under additional simplicity assumptions, not a definition of causal abstraction. [Journal paper](https://jmlr.org/papers/volume26/23-0058/23-0058.pdf).
- Hidden cyclic motion appearing as an abstract point attractor is explicit in Steggles, Definition 15. The motivating example illustrates this older obstruction within simple causal models. [Journal paper](https://publications.info.uaic.ro/files/sacs/XXI2/XXI2_3.pdf).
- Hereditary unique fixed-point solvability is established in Boolean-network theory; Ruet's Definition 4 and Theorem 1 are direct comparisons for the fine-model assumption. Boolean one-coordinate quotients alone cannot contain partial nonconstant merges. [Author manuscript](https://www.irif.fr/~ruet/papiers/naco.pdf).
- Solving away whole coordinates already preserves appropriate uniqueness properties in simple SCM marginalization and in inherited grid unique-sink orientations. Those operations must be distinguished from partial merges of values inside retained coordinates. [Bongers et al., Proposition 8.2](https://arxiv.org/html/1611.06221v6), [Gärtner–Morris–Rüst, Lemma 2.11](https://citeseerx.ist.psu.edu/document?doi=f1cf1480d8753b3bf167f91771031aea3f32db86&repid=rep1&type=pdf).

The plausible distinctive package is therefore the universal `D[P]` theorem, its smallest sharp witness, and a practical test for full-retention refinements. The feedback-vertex-set optimization and the factorization lemma should be described as consequences and useful supporting facts. Neither needs an inflated independent novelty claim.

## Hegelian source and defensible interpretation

The direct source is the transition from causality through reciprocity to the Concept, not a generic claim that everything affects everything. In the *Encyclopaedia Logic*, §§154–155 make cause and effect reciprocal; §156 treats their unity as actual in the process. The criticism that merely invoking reciprocity leaves mediation unexplained is specifically in the **Addition (Zusatz) to §156**. Its example concerns the reciprocal explanation of a people's constitution and character. §§157–159 continue to necessity, freedom, and the Concept. Cite the Addition explicitly when using that criticism. [English text](https://www.marxists.org/reference/archive/hegel/works/sl/slactual.htm), [German text, §156 and Zusatz, Werke 8, pp. 300–302](https://hegel-system.de/de/werke/08/08-01.htm).

The direct *Science of Logic* passage is Book II, Section III, Chapter 3, **C. Reciprocity**, paragraphs 1272–1276 in the linked site's numbering. It treats the overcoming of externally presupposed causal substances and the manifestation of their mediated unity; it does not identify freedom with the disappearance of necessity. The opening of the Doctrine of the Concept, paragraphs 1281–1286, retrospectively describes this transition. These paragraph numbers are locator numbers for the cited English presentation, not universal section numbers across editions. [Reciprocity](https://www.marxists.org/reference/archive/hegel/works/hl/hlessenc.htm), [opening of the Doctrine of the Concept](https://www.marxists.org/reference/archive/hegel/works/hl/hlnotion.htm).

A defensible connection is methodological: agreement among descriptions of separate mechanisms is insufficient to explain the reciprocal whole. The mathematical question asks when a change of description preserves that whole's interventional solutions. The counterexample gives a precise failure: the coarse description presents an equilibrium that the fine equations cannot realize. The theorem identifies exactly when the declared graph and value maps exclude that failure for every compatible simple system.

That last paragraph is our interpretation and research design, not a theorem extracted from Hegel. Finite state sets, an externally chosen dependency graph, product surjections, point interventions, and hereditary unique solvability are imposed formal assumptions. The quotient is supplied by the modeller; the paper does not derive it immanently from the reciprocal relation. Neither fixed-point existence nor acyclicity among partially merged coordinates is a mathematical definition of Hegel's Concept or freedom. Complete coordinate erasure being safe under this theorem also does not identify erasure with sublation, or show that the erased content is philosophically dispensable.

For Hegelese, the concrete promise is a checkable distinction between retaining a coordinate, forgetting it completely, and merging some of its values. A language could require a mechanism-descent check, an independent simplicity justification, and the `D[P]` certificate when a universally safe recursive interface is requested. This would be a proposed application; the present project does not by itself demonstrate an implemented language feature or a formalization of dialectical development.

## Release conditions and blockers

No internal mathematical blocker was identified. Before the public version is called ready, its final prose should preserve the following points:

1. State the exact universal quantifiers and graph convention in the theorem, not only in supplementary notes.
2. Give the hereditary-solvability and value-merge citations; distinguish generic hidden-cycle examples from the proposed classification.
3. Correct any attribution of the explanatory criticism to bare §156 to “§156 and its Addition,” and use the direct *Science of Logic* reciprocity passage alongside the later retrospective discussion.
4. Keep “priority not established” and “not externally peer reviewed” visible; describe computation with its actual finite scope.
5. Check the final PDF and downloadable archive separately. This review has not inspected those final publication artifacts.

These are concrete editorial and artifact checks, not a request to postpone indefinitely for external approval. An unsupported claim of first discovery, a claim to solve general cyclic causal abstraction, or an identification of the formal assumptions with Hegel's own derivation would be a substantive publication blocker. The narrow, qualified preprint described above avoids those claims.
