# Priority audit: reciprocity without losing causality

Research note, checked 2026-11-07. This is a targeted primary-source audit, not an exhaustive priority search or external review. The proposed theorem now has a direct proof and internal adversarial checks in the accompanying research files; those checks do not establish historical priority or constitute external peer review.

The promising claim is narrow: classify the componentwise value quotients that preserve **every compatible finite simple causal model on a specified dependency graph**. Cyclic causal abstraction, value merging, commuting mechanism squares, and fixed-point certificates already have substantial prior literature. None should be introduced as new mathematics.

## Precise target and distinctions

Let finite nonempty state sets be `X_i`, let `q_i: X_i -> Y_i` be surjective, and write `q = product(q_i)`. An update mechanism `F` respects a prescribed dependency bound `D` and descends to `G` when `q F = G q`, component by component. Call `F` simple here when every perfect intervention, including the empty intervention, has exactly one solution. The intended semantic conclusion is

`q(Fix(F_do(I,a))) = Fix(G_do(I,q_I(a)))`

for every fine intervention, with a unique macro solution and independence from the chosen representative `a` of its macro value. This is stronger than commutation of one update step.

The classification proved in the accompanying draft sets

`P = {i : q_i is neither injective nor constant}`

and asserts that universal preservation of simplicity and the displayed intervention semantics holds exactly when `D[P]` is acyclic. The quantifier ranges over all simple, `D`-respecting mechanisms that descend under the fixed `q`. The important distinction from an ordinary residual-DAG certificate is that entirely forgotten coordinates need not break cycles: the assumed simplicity of the original model can solve them. A theorem about one particular model is different from this universal classification.

The graph convention must be explicit. A graph of dependencies of the actual update tables is not automatically the graph of an SCM modulo equation equivalence. If self-dependent mechanisms are permitted, one-vertex cycles must be covered; if mechanisms are required to exclude their own coordinate, the statement must use that restriction consistently.

## Closest causal sources

**Lorenz and Tull, _Causal and Compositional Abstraction_ (2026), arXiv:2602.16612v1.** [Full text](https://arxiv.org/html/2602.16612v1), [version history](https://arxiv.org/abs/2602.16612).

Section 6, Definition 46 introduces component-level abstraction; Section 6.2, Definition 50 and Theorem 51 relate mechanism-level abstraction to constructive abstraction with suitable partitions and natural transformations. These results concern acyclic causal models. Section 8, “Cyclic structures and approximate versions,” explicitly identifies cyclic extensions as unfinished, and suggests parallel mechanisms plus trace. Appendix D, Lemma 75 and Remark 76 establish the trace presentation in their stated categorical setting; they do not supply a general consistency theorem for arbitrary cyclic deterministic mechanisms. The arXiv history showed only v1, submitted 18 February 2026, on the audit date.

Our inference: the proposed finite theorem would address a restricted obstruction relevant to that open direction. It would not resolve arbitrary cyclic, stochastic, or quantum abstraction, nor establish a full traced category.

**Bongers, Forré, Peters and Mooij, _Foundations of Structural Causal Models with Cycles and Latent Variables_ (2021), Annals of Statistics 49(5), 2885–2915; arXiv:1611.06221v6.** [Full text](https://arxiv.org/html/1611.06221v6).

Definition 8.1 defines simple SCMs through unique solvability for every variable subset. Proposition 8.2 proves closure under marginalization, perfect intervention and twin construction. Proposition 5.5 gives commutation of marginalization with suitable interventions and twin construction; Theorem 5.6 gives the corresponding semantic preservation when the marginalized subset is uniquely solvable. Proposition 3.4 covers acyclic SCMs. Proposition 3.7 relates singleton unique solvability to absence of self-cycles in their equation-equivalence graph. Appendix C, Propositions C.4–C.5 specialize solvability and marginalization to linear systems.

Priority consequence: eliminating uniquely solvable hidden variables is established mathematics. A componentwise quotient of values is a different operation; it cannot silently be identified with marginalization. Residual-coordinate constructions must prove their hypotheses rather than assume that an arbitrary quotient supplies uniquely solvable hidden variables.

**Beckers and Halpern, _Abstracting Causal Models_ (AAAI 2019), pp. 2678–2685.** [Author PDF](https://www.cs.cornell.edu/home/halpern/papers/abstraction.pdf).

Section 2, p. 2679, restricts the paper to recursive/acyclic models. Definitions 3.12–3.14, p. 2683, specify the induced intervention map, tau-abstraction and strong tau-abstraction. Definition 3.17, p. 2684, introduces constructive abstraction through variable partitions and component maps. Theorems 3.8–3.9 connect uniform transformations with exogenous maps and composition.

Priority consequence: intervention matching and representative-independent semantics are already central, not an optional addition invented here. A pair with a spurious macro solution fails semantic abstraction; it is not a counterexample to an established definition. Our issue is whether local mechanism descent implies that definition under stated cyclic hypotheses.

**Geiger et al., _Causal Abstraction: A Theoretical Foundation for Mechanistic Interpretability_ (JMLR 26, 2025), pp. 1–64.** [Journal PDF](https://jmlr.org/papers/volume26/23-0058/23-0058.pdf).

Definitions 5 and 8, pp. 7–8, allow cyclic deterministic mechanisms and set-valued solution semantics. Definition 25, p. 13, requires equality of translated solution sets under matched interventions. Definition 33, p. 17, defines constructive abstraction. Definition 38, p. 18, calls componentwise surjective value maps “value merge”; Proposition 40, p. 19, decomposes alignments into marginalization, variable merge and value merge. Section 2.7, pp. 27–30, gives a cyclic abstraction example. Theorem 30, pp. 14–15, handles bijective translations.

Priority consequence: this is the most direct causal vocabulary for the proposed result. It already formulates cyclic abstraction and value merging, but the inspected results do not classify graph/quotient pairs that preserve every compatible simple model. Use “value quotient” or “value merge,” with this citation, rather than claiming a new operation.

## Older finite-network obstruction

**Banks and Steggles, _An Abstraction Theory for Qualitative Models of Biological Systems_ (EPTCS 40, 2010), pp. 23–38, arXiv:1011.0489.** [Paper](https://arxiv.org/pdf/1011.0489).

Definitions 3–4, pp. 26–27, use componentwise surjective state maps, excluding constant maps. Definition 7, p. 29, defines exact synchronous trace abstraction. Definition 12, p. 31, constructs translated mechanism tables. Theorem 15, p. 33, characterizes exact abstraction by those translated tables yielding a single deterministic model. Theorem 11, p. 30, preserves attractors up to their abstract images.

Our inference: deterministic local descent is closely aligned with their singleton-table condition. A fine periodic orbit can have a constant abstract image, so preservation of abstract traces/attractors does not imply that every coarse fixed point lifts to a fine fixed point. The proposed theorem needs the additional causal intervention and simplicity structure to be distinctive.

**Steggles, _Abstracting Asynchronous Multi-Valued Networks_ (Scientific Annals of Computer Science 21(2), 2011), pp. 249–282.** [Journal PDF](https://publications.info.uaic.ro/files/sacs/XXI2/XXI2_3.pdf).

Section 3 develops componentwise state abstraction for asynchronous traces. Section 4 gives a finite decision procedure. Definition 15, pp. 264–265, explicitly permits a coarse point attractor to be represented either by a fine point attractor or by a fine cycle staying within the same abstract-state fibre. This is direct prior recognition of the distinction between observable stationarity and fine equilibrium.

Priority consequence: the bare fact that a quotient can turn hidden motion into a coarse fixed point is old. A counterexample is useful exposition, but that phenomenon alone is not a credible novelty claim.

## Hereditary unique solvability and coordinate elimination

**Paul Ruet, _Asynchronous Boolean networks and hereditarily bijective maps_ (Natural Computing 14, 2015), pp. 545–553.** [Author manuscript](https://www.irif.fr/~ruet/papiers/naco.pdf), [journal DOI](https://doi.org/10.1007/s11047-015-9523-4).

In the author manuscript, Section 3.1, Definition 4, p. 5, defines hereditary unique fixed-point solvability by requiring every projected restriction to a subcube to have one fixed point. Theorem 1, p. 6, equates this with hereditary bijectivity of `f + id` and absence of mirror pairs. Corollary 3, p. 11, collects further characterizations.

Priority consequence: the Boolean version of our fine-model simplicity is established under another name. These inspected results do not state the partial-value-quotient classification. A Boolean coordinate admits only injective or constant surjections, so `P` is empty in that case. Encoding larger coordinates by blocks of bits does not automatically transfer the theorem: arbitrary bit clamps are different from interventions on the original coordinates. Any reduction claiming otherwise must address that difference.

**Bernd Gärtner, Walter D. Morris Jr. and Leo Rüst, _Unique Sink Orientations of Grids_ (Algorithmica 51, 2008), pp. 200–235.** [Author conference version](https://people.inf.ethz.ch/gaertner/subdir/texts/own_work/ipco.pdf), [full manuscript](https://citeseerx.ist.psu.edu/document?doi=f1cf1480d8753b3bf167f91771031aea3f32db86&repid=rep1&type=pdf), [journal DOI](https://doi.org/10.1007/s00453-007-9090-x).

The full manuscript's Definitions 2.9–2.10 and Lemma 2.11, pp. 13–14, collapse whole coordinate dimensions and define inherited orientations using the unique sink of each resulting fibre; the inherited orientation remains a unique sink orientation. This is relevant prior art for solving away coordinates while preserving a hereditary uniqueness property. It is not a theorem about arbitrary within-coordinate value partitions. Moreover, a grid USO requires a unique sink on every nonempty product-subset face; our multivalued intervention hypothesis only fixes selected coordinates to single values. Treating these classes as identical would require an additional argument. The full manuscript's relevant passage was available through its indexed primary PDF text; a direct download was blocked during this audit.

## Fixed points and categorical feedback

**Adrien Richard, _Fixed point theorems for Boolean networks expressed in terms of forbidden subnetworks_, arXiv:1302.6346v3 (2014 revision).** [Full text](https://arxiv.org/html/1302.6346).

Section 3, Theorem 1 restates Robert's 1980 theorem: acyclic global interaction graph implies a unique fixed point. Theorem 5 is the stronger Boolean local-graph theorem of Shih and Dong. Corollary 2 characterizes networks whose every subnetwork has a unique fixed point by forbidden even/odd self-dual subnetworks. Remark 5 relates this to hereditary bijectivity. Corollary 4 supplies a shortest asynchronous path to the fixed point under its hypotheses; this should not be inflated into convergence of every fair schedule.

Priority consequence: applying topological evaluation to each invariant macro fibre is an elementary extension of the established acyclic-network argument. Boolean simplicity itself already has a substantive characterization. Partial nonconstant value quotients, however, require at least three fine values per affected coordinate and are absent from the purely Boolean one-coordinate case.

**Simpson and Plotkin, _Complete Axioms for Categorical Fixed-point Operators_ (2000).** [Author PDF](https://homepages.inf.ed.ac.uk/gdp/publications/fixpoints.pdf).

Proposition 2.5 gives Bekić decomposition. Definitions 2.7–2.8 give uniformity and parameterized uniformity: suitable commuting maps transport the chosen fixed point. Proposition 2.9 relates parameterized uniform Conway operators to iteration operators. The hypotheses include the relevant category and a designated class of morphisms; they are not automatic for arbitrary finite functions.

Our inference: the local-to-global feedback equation has a classical categorical name. A finite certificate may justify its applicability on a restricted class, but uniformity itself is not new. A fixed-point operator cannot be defined on every finite endomorphism because a two-element swap has no fixed point. Any categorical extension must prove closure of its admissible feedback class.

Contractivity-based fibre certificates should likewise be credited as applications of classical contraction arguments. A useful implementation or a new sharp hypothesis is possible; merely renaming convergence within fibres would not establish novelty.

## Recent work and forward citation check

**Madaleno, Pereira and Markham, _Coarsening Linear Non-Gaussian Causal Models with Cycles_ (2026), arXiv:2605.10163v1.** [Full text](https://arxiv.org/html/2605.10163v1).

Section 4.1, Proposition 1 gives the SCC partition as the finest partition whose node-cluster quotient is acyclic. Section 4.2, Theorem 1 concerns identifiability of the condensation of linear non-Gaussian SCMs. Remark 1 discusses possible broader cyclic coarsenings; Section 4.3 treats cluster interventions. This groups variables into clusters and targets a DAG summary. It is not the same operation as retaining coordinates and quotienting their value sets, nor the same universal simplicity question. It nevertheless prevents any broad claim that cyclic causal coarsening is untouched in 2026.

Two subsequent citations of Lorenz–Tull were verified in primary texts:

- [Gauderis et al., _From Mechanistic to Compositional Interpretability_, arXiv:2605.08934v2](https://arxiv.org/html/2605.08934v2), Section 5, relates syntactic refinement to strict component-level abstraction. The inspected discussion does not provide the finite cyclic value-quotient theorem.
- [Lobski and Zanasi, _Layered Monoidal Theories I_, arXiv:2602.19776v3](https://arxiv.org/pdf/2602.19776), Section 6.2, p. 51, identifies causal hierarchies as an application. The version history lists v3 on 15 October 2026. The inspected discussion does not supply the proposed classification.

This is a forward search, not a complete citation census. No claim about citation counts or absence of all later solutions follows from it.

## Candidate contribution assessment

| Claim | Priority assessment |
| --- | --- |
| A quotient can hide a cycle behind an apparent fixed point | Established phenomenon; explicit asynchronous treatment by Steggles |
| Componentwise value merging and cyclic solution-set abstraction | Established causal definitions, especially Geiger et al. |
| Acyclic residual dependency gives unique fibre fixed points | Elementary application of classical network fixed-point arguments |
| Uniformity transports selected fixed points along commuting maps | Established categorical fixed-point theory |
| A simple finite model can have a descending value quotient that is not simple | Useful focused counterexample; exact prior occurrence remains unlocated |
| Universal preservation iff the partially coarsened coordinates induce an acyclic graph | Strongest candidate contribution; direct proof and internal checks available; no exact prior theorem located, but priority remains open |
| Minimum loopless two-component failure is unique up to relabelling | Correct supporting classification on internal review; exact prior occurrence remains unlocated |
| Full-retention refinements descend exactly when closed under hidden-dependency predecessors | Useful elementary factorization/closure lemma; do not present it as a new general theory of congruences |
| Implementation returns certificates or counterexample witnesses | Useful research artifact; novelty depends on the theorem, algorithms and comparison |

The two-coordinate example under discussion is `F(a,b)=(b,s(a))` on `{0,1,2}²`, with `s(0)=0`, `s(1)=2`, `s(2)=1`, and `q(0)=0`, `q(1)=q(2)=1`. It is simple under all coordinate clamps. Its quotient is `G(u,v)=(v,u)`, with macro fixed points `(0,0)` and `(1,1)`, although only `(0,0)` is the image of a fine fixed point. This is our worked example, not a result attributed to the papers above. Its role is to demonstrate why ordinary simplicity plus local descent does not finish the causal argument.

A defensible paper would foreground the exact universal quantifiers, the injective/constant/partially merged distinction, a complete construction for necessity, and all matched interventions. It should describe the Hegelian motivation as a source of the question—when reciprocal dependence survives a change of description—rather than as evidence of priority or as a mathematical formalization of all of Hegel.

Search terms included the exact Lorenz–Tull title and identifier; cyclic causal abstraction; simple SCM quotient; value abstraction with feedback; coarsening preserving simplicity; fixed-point lifting under surjections; finite and multi-valued network abstraction; partial coarsening with feedback vertex sets; hereditary unique solvability; hereditarily bijective maps and quotients; congruences of finite dynamical systems; and projected/coarsened unique sink orientations. The extended search located the hereditary-solvability and whole-coordinate projection results above, without locating the exact `D[P]` classification. Older finite-network congruence theory and differently named preservation results remain priority risks. A short preprint may state the theorem while openly reporting this limited search; a claim of established priority needs further expert scrutiny.
