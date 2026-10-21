# Independent mathematical review of *Determinate Preservation*

Reviewed 22 October 2026. This report concerns the manuscript supplied at the start of the review, before revisions prompted by the review. It is an AI mathematical audit, not external human peer review. I inspected the six TeX files, the verification program and its report, and relevant primary literature. I did not alter the manuscript. I independently reran the finite calculations without overwriting the supplied report; all results agreed.

**Verdict.** The central finite-family theorem is correct as stated, including the orientation of the Kan extensions, every connectivity index, the sphere multiplicities, the all-full-subposet leastness claim, and the cohomological witnesses. I found no mathematical blocker to that theorem. Publication does require a correction to the research positioning: the ordinary minimal-full-subposet mechanism has close and stronger existing results, and the appendix's suggestion that the present finite-poset problem may yield incomparable minimal resolvers is misleading. In fact there is a general strict-upper-interval criterion, proved below. The ordinary-topos identification is valid but deserves a more explicit order argument. The higher result must retain its stated admissible-family qualification.

**1. Main calculation: independently checked.**

For covariant diagrams the right Kan extension really is indexed by `(x ↓ R)`, whose objects are arrows `x → r`. Using `(R ↓ x)` instead would give a different and here incorrect theorem. Conversely, the left extension from `D={b}` uses `(D ↓ x)`. Initiality of `b` makes that category a singleton and makes the left extension naturally constant. No comparison of ordinary and homotopy colimits is smuggled into this step.

For a space `A`, the homotopy limit of its constant diagram over `J` is `Map(BJ,A)`. Limits of k-types are computed in spaces, and mapping into a k-type depends only on the k-truncation of the source. Thus the canonical unit is an equivalence for every k-type precisely when `τ≤k B(x ↓ R) ≃ *`. The converse really does follow from the mapping-space version of Yoneda; it is not merely a cohomological detection argument. Empty comma categories fail: their mapping space into `A` is terminal, and the comparison fails, for example, when `A=∅` or a two-element set. This handles the maximal-face base case.

The convention that “k-connected” means nonempty with trivial homotopy groups through degree k is stated clearly. In Du's terminology the same inclusion is **right (k+1)-cofinal**, because his n-connective condition is invisibility to `(n−1)`-types. His Proposition 5.10 supplies the constant-limit formula and Theorem 6.2 supplies the relevant truncated cofinality theorem, after taking the appropriate opposite. These are established background, not new machinery. [Du, version 5](https://arxiv.org/html/2308.01798v5).

For `R_k`, complementation sends its selected upper faces, with order reversed, to the nonempty subsets of `[N]` of size at most `k+2`. Their order complex is the barycentric subdivision of the `(k+1)`-skeleton of the simplex on N vertices. At an omitted face `S`, the same construction takes place on the `m=N−|S|` elements outside S. Omission implies `m≥k+3`, exactly the range needed by the simplex-skeleton lemma. Consequently the claimed wedges have dimension `k+1` and multiplicities `binom(N−1,k+2)` and `binom(m−1,k+2)`. No rank or dimension shift is missing.

The proof of the skeleton lemma is valid: the closed star of a vertex contains the entire `(q−1)`-skeleton; every remaining q-simplex has its boundary in that star; quotienting the nonempty contractible subcomplex is a homotopy equivalence. In the boundary case `q=m−2` the multiplicity is one, as required.

Leastness is stronger than minimality and is actually established. Maximal proper faces are forced by nonemptiness. Descending induction then forces a face with complement size m whenever `m−2≤k`, since its entire strict upper interval has already been forced and is a sphere of dimension `m−2`. The two special objects cannot repair this interval because both are below the face. For `k≥N−2`, all proper faces are forced and omitting `a` leaves `S^(N−2)`, so `a` is forced too. Including `a` early does not evade any of the face obstructions. The argument therefore covers every full subposet containing b, whether or not it belongs to the displayed chain of rank cuts.

The source of the witness `K(Z,k+1) → Map(∨^h S^(k+1),K(Z,k+1))` is connected and the target has components `Z^h`. Unbased homotopy classes into the Eilenberg–Mac Lane space do represent ordinary cohomology here, including `k=0`, where the target is `K(Z,1)`. Constants occupy the zero component. This is a valid failure witness, not an unjustified inference from homology to homotopy.

The cardinality formula, the `N−1` distinct levels, and the examples for N=3,4,5 all check. The persistence proposition is also correct: on an already k-truncated input, both the constant left extension and the right-extension limit agree in every larger coefficient category.

**2. Required correction: the general finite-poset question has a clean answer in this setting.**

Here is a useful stronger statement. Its proof is included so that the proposed correction does not rest on a literature analogy.

Let P be any finite poset. For finite `k≥0`, put

\[
E_k(P)=\{x\in P:\tau_{\leq k}B(P_{>x})\not\simeq *\}.
\]

For `k=∞`, use noncontractibility instead. The empty strict upper interval counts as an obstruction. For a full subposet `R⊆P`, the following are equivalent:

1. Every `B(x ↓ R)` is k-connected, or contractible when `k=∞`.
2. `E_k(P)⊆R`.

Therefore `E_k(P)` is the least such full subposet. If one additionally requires a specified subset `D_0` to be included, the least one is `D_0∪E_k(P)`. In the manuscript's initial-object situation this gives

\[
\mathsf A_k(\{b\})=\{b\}\cup E_k(P).
\]

The last formula uses the initial-object constant-diagram reduction; it does not assert the same resolution formula for arbitrary noninitial D.

*Proof of necessity.* Assume (1), and fix `x∉R`. Set `Q=P_{>x}` and `T=R∩Q`. For every `y∈Q`, the upper comma category `(y ↓ T)` for `T→Q` is exactly `(y ↓ R)` in P: any `r≥y>x` already lies in Q. Hence `T→Q` is right `(k+1)`-cofinal, or homotopy final for `k=∞`. Applying truncated cofinality to the constant point diagram shows

\[
\tau_{\leq k}BT\simeq\tau_{\leq k}BQ,
\]

with an untruncated equivalence for `k=∞`. Since `x∉R`, the category `(x ↓ R)` equals T; its classifying space is k-connected by assumption. Therefore the same is true of `BQ`, so `x∉E_k(P)`. This proves `E_k(P)⊆R`.

*Proof of sufficiency.* Assume `E_k(P)⊆R`. Proceed downward through any reverse linear extension of P, proving the comma condition at x after it is known at every `y>x`. If `x∈R`, `(x,id)` is initial in `(x ↓ R)`. Otherwise use the same Q and T as above. The inductive hypothesis says that every upper comma of `T→Q` is k-connected. Truncated cofinality again identifies the k-truncations of BT and BQ. Since x is not in `E_k(P)`, BQ is k-connected. Thus BT, which is `B(x ↓ R)`, is k-connected. The same argument without truncation proves the unrestricted case. Finiteness makes this induction terminate. This proves (1).

The classification also proves upward closure of the resolver condition in this setting. The manuscript is right not to assume an arbitrary monotonicity assertion, but one can now establish it rather than merely avoid it. In particular, the enumeration's “contains the predicted least level” condition describes exactly the resolvers, not just a necessary condition.

For the Boolean family, `P_{>S}` is empty when `|S|=N−1` and is `S^(N−|S|−2)` otherwise; `P_{>a}` is `S^(N−2)`; `P_{>b}` is contractible because it has initial object a. This recovers the theorem immediately. The additional wedge calculations remain useful because they quantify the residual obstruction of the least resolver rather than only deciding which objects are mandatory.

The original appendix, lines 87–93, should therefore not suggest that initial-object resolution over a general finite poset might have several incomparable minimal full resolvers. Restrict that future question to a noninitial or nontrivial starting level, a different class of indexing categories, or a different class of admissible subcategories. The general theorem is an intrinsic characterization, not a claim of an effective general algorithm for recognizing contractibility.

**3. Required literature and novelty revision.**

Dey and Lesnick's *Limit Computation Over Posets via Minimal Initial Functors* contains the ordinary full-subposet result in Remark 3.6: the least initial full subposet consists of the objects whose strict lower intervals are disconnected, with empty intervals counted as disconnected. Take opposites for the final/upper-interval version relevant here. Their more ambitious “initial scaffold” also minimizes relations and is generally not full. The manuscript must keep these two admissible classes distinct. [Dey–Lesnick, arXiv:2601.00209v2, 20 January 2026](https://arxiv.org/html/2601.00209v2).

Brüstle, Desrochers and Leblanc explicitly give a minimal final full subposet in Theorem C and state the strict-upper-interval formula for finite upsets in Remark 2, crediting the earlier Dey–Lesnick result. Every finite poset is covered. Their current version is arXiv:2510.10837v5, 17 August 2026, listed as the version to appear in *Linear Algebra and its Applications*. [Primary text](https://arxiv.org/html/2510.10837v5). The publisher assigns volume 753 (15 January 2027), pages 57–81, DOI [10.1016/j.laa.2026.08.021](https://doi.org/10.1016/j.laa.2026.08.021). Cite its online/accepted status appropriately for an October 2026 manuscript, rather than pretending the 2027 issue date has already occurred.

These results do not, in the inspected statements, supply the entire higher-coefficient Boolean profile. They do show that the ordinary leastness mechanism and its finite-poset generalization are already known. The higher upper-interval theorem above follows directly by substituting standard truncated cofinality into the same local reasoning. A responsible novelty statement is consequently modest: an explicit calculation and application of this machinery to coefficient-dependent resolving levels, with a fully quantified example. Calling the formula an elementary consequence does not undermine its illustrative use; calling its familiar underlying mechanism a new discovery would.

The `k=∞` deletion step also belongs to old finite-poset homotopy methods. Barmak and Minian discuss deleting points with homotopically trivial upper or lower intervals, including the earlier Walker result, and develop the broader theory of γ-points and one-point reductions. [Barmak–Minian, *Algebraic & Geometric Topology* 8 (2008), 1763–1780, especially Definition 3.9, Proposition 3.10 and its following discussion](https://msp.org/agt/2008/8-3/agt-v8-n3-p21-p.pdf). A least full **homotopy-final** subposet is not the same object as a Stong core, a general γ-core, or a smallest finite model of a homotopy type. Those permit different reductions or optimize a different property. I did not locate an exact prior statement of the entire higher upper-interval classification during this focused search; that is not evidence of priority.

The sphere calculation itself is also standard in a particularly transparent form: the complex in question is the independence complex of the uniform matroid whose independent sets have size at most `k+2`, namely a simplex skeleton. No separate novelty claim should attach to its wedge decomposition or multiplicity.

Kennett–Riehl–Roy–Zaks establishes the relevant ordinary use of levels, skeletal and coskeletal images, and Aufhebung, and performs substantial computations for different indexing categories. It does not automatically transport these computations to truncated-space coefficients. The manuscript's use of it as background, rather than as a higher transfer theorem, is sound. [Author-hosted published paper](https://math.jhu.edu/~eriehl/levels.pdf).

**4. Ordinary essential subtoposes: valid, but make the argument explicit.**

The adjoint triple exists and both Kan extensions are fully faithful for a full inclusion. Restriction is left exact, so `u* ⊣ u_*` defines a geometric inclusion; its additional left adjoint makes the inclusion essential. Composition of Kan extensions gives the asserted ordering when subsets are nested.

The converse order issue matters when calling `A_0(D)` the actual ordinary Aufhebung. Apply rigidity to `C_N^op`, the actual presheaf indexing category. It is finite and Cauchy complete, so every subtopos is induced by a full subcategory and is essential. The published Marquès paper supports this, including the finite-slice criterion in its introduction and the identification via irreducible objects in Section 2. [Marquès, published article](https://link.springer.com/article/10.1007/s10485-025-09833-z).

A short direct order check would remove any remaining ambiguity. For a subset R, the induced topology `J_R` on `C_N^op` declares a sieve U on x covering exactly when U contains every arrow `r→x` with `r∈R`. Its irreducible objects are exactly R: at an included object a proper sieve omits the identity, while at an omitted object the sieve of all nonidentity arrows covers. Moreover,

\[
R\subseteq R'\quad\Longleftrightarrow\quad J_R\supseteq J_{R'}
\quad\Longleftrightarrow\quad\operatorname{Sh}(J_R)\subseteq\operatorname{Sh}(J_{R'}).
\]

For the nontrivial direction of the first equivalence, if `r∈R\R'`, its strict incoming sieve covers in `J_R'` and fails to cover in `J_R`. Thus subtopos order really matches subset order. Together with rigidity, the theorem minimizes over every ordinary level above D. Its ordinary claim is not merely a rank-cut computation.

The analogous classification has not been supplied for the higher coefficient categories. Preserve the manuscript's explicit “full-subcategory level” qualification there. In particular, finite-k diagram categories should not be casually treated as unrestricted infinity-toposes, and an essential localization should not be identified with an arbitrary reflective subcategory without checking the relevant hypotheses.

**5. Scope of the nLab comparison.**

A brief scope note is advisable. The nLab “Over cohesive sites” statement explicitly includes a higher version, while its displayed minimality proof identifies the sharp-modal base with Set and invokes an ordinary Boolean-subtopos argument. In the usual higher cohesive setting the corresponding base is spaces, so that sentence requires a distinct higher justification. This identifies a gap in the displayed proof's stated scope; it does not by itself establish that the conclusion is false. [nLab Aufhebung, “Over cohesive sites”](https://ncatlab.org/nlab/show/Aufhebung).

The present family is not a counterexample to that special cohesive-site result. In `C_N^op`, b is terminal but `Hom(b,x)=∅` for every `x≠b`, contrary to the usual condition that site objects have points. More intrinsically, the canonical components functor `colim_C` fails to preserve binary products. For distinct maximal faces p and q, the covariant representables `Hom_C(p,−)` and `Hom_C(q,−)` each have singleton colimit, but their pointwise product is empty and has empty colimit. Hence the standard canonical adjoint structure here is not cohesive. The theorem can motivate attention to coefficient changes; a refutation of a specific cohesive theorem would require matching its hypotheses and its starting level.

**6. Reproducibility and small improvements.**

I reran `exhaustive(3)`, `exhaustive(4)`, and `family_checks(N)` for N=3,4,5,6, importing the program without triggering its report-writing entry point. All assertions passed, and the returned structures exactly matched `verification.json`. The enumeration checks 128 and 32,768 subposets and returns counts `[2,1]` and `[32,2,1]`. The bitset boundary calculation and Betti-number formula are internally consistent. The report properly distinguishes necessary mod-2 homology checks from homotopy proofs. Retain that distinction even after adding the general criterion.

For exposition, add an explicit sentence that a groupoid means a model for a 1-type with homotopy-coherent limits, rather than silently inviting ordinary strict limits in the 1-category of groupoids. Also give the precise Du index translation, since the bibliography currently leaves that conversion to the reader.

The most useful revision is not more computation. It is to integrate the general upper-interval criterion, credit the ordinary prior work, retain the Boolean family as the exact quantitative example, and keep the philosophical conclusion conditional on the admitted coefficient category. With those changes, the mathematics supports the manuscript's modest methodological claim. It does not support a priority claim for cofinality machinery or a general refutation of cohesive Aufhebung results.

## Addendum: targeted check of the revised manuscript

I rechecked the revised `02-mathematics.tex`, the abstract in `main.tex`, and the directly relevant bibliography and appendix passages. **No mathematical blockers remain in this revision.** This is a targeted confirmation of the integration, not a claim to exhaustive literature clearance or formal proof verification.

The upper-interval theorem, lines 109–173 of the revised mathematics file, is valid. Necessity identifies the upper commas of `R∩C_{>x}→C_{>x}` correctly and applies the truncated Theorem A in the correct direction. Sufficiency uses a well-founded downward induction; at each step all the required commas are among those already established. The `k=∞` argument uses the untruncated theorem and introduces no acyclicity assumption. The stated conversion to Du's cofinality index `k+1` is correct. Adding b to `E_k(C)` gives exactly the least admissible resolver by the constant-diagram criterion.

The shortened Boolean-family proof preserves the correct thresholds. A maximal face is essential because its upper interval is empty; every other face with complement size m is essential exactly when `m−2≤k`; a becomes essential at `k=N−2`. The wedge dimensions, multiplicities, cohomological witness, cardinalities and final strict inclusion remain correct.

The revised ordinary-topos paragraph applies rigidity to the correct opposite category and supplies the induced covering-sieve description. Its conclusion that subset order agrees with subtopos order is valid, so the ordinary result does minimize over all levels above D. The higher qualification is retained. The noncohesive paragraph correctly separates this family from the special cohesive-site statement; both its missing-points observation and its representable-product counterexample are valid.

The abstract accurately describes the stronger finite-poset criterion and the Boolean profile, and it preserves the restriction to full-subcategory levels. Its statement that earlier comparisons remain unchanged is supported by the persistence proposition in this initial-object setting. The added prior-work citations and the rewritten appendix remove the substantive positioning problems identified in the original review.

Two optional precision edits remain: (i) the abstract's “proper Boolean lattice” is better written “proper part of a Boolean lattice,” since the poset with both extrema removed is not itself a lattice; (ii) in the upper-interval theorem statement, explicitly write “for finite `k≥0`” before the displayed truncated equivalence, leaving the following sentence to handle `k=∞`. Both meanings are already recoverable from context. Neither affects validity. The higher criterion is a short derivation from standard machinery; the revised attribution appropriately avoids claiming a new cofinality theorem, but mathematical priority for that exact formulation remains unestablished.
