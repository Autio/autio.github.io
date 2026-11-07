# Assembled preprint and reproduction check

7 November 2026.

**Verdict:** no mathematical transcription error, numerical discrepancy, or unsupported strengthening of the proved statements was identified in the reviewed preprint. Both standard-library checkers completed successfully in a separate reproduction directory, and all five result JSON files match their originals byte-for-byte. One nonblocking status inconsistency in the accompanying prior-work note is recorded below.

This is an internal AI review, not external peer review, proof-assistant verification, or a new priority audit. The reviewer wrote the independent enumerator and contributed the minimum-counterexample classification earlier in this project. This is therefore an independent implementation comparison and an assembled-manuscript audit, not an authorship-blind mathematical review. The preprint was not edited by this check.

## Reviewed version

The audited source is `preprint.tex`, titled *Reciprocity without losing causality: A sharp graph criterion for finite causal value quotients*, version 1, dated 7 November 2026.

**Preprint SHA-256:**

`e79f216bbb6c55127584a18c53011bacd4a767c7c15212c9cc855664e9cef518`

The comparison sources had these hashes:

| File | SHA-256 |
| --- | --- |
| theorem.md | `cbad661a2d937f9f0473040a6a55597b46b5e2b44c9d853de0690aa4d7960644` |
| retention.md | `b64150a0079697ffd52a258bd0d0af4a369b17eabde0b65cd23cd1058166cfc7` |
| minimal-counterexample.md | `ad3c290e6a035841aef1b29641b5cf3885e1d7f90e35303b6f42712ab552b25e` |
| enumerate_models.py | `e900e394caf4f57a43df4222cb9cd2bb3763fa5b8d8fd351aeac8af354b75cbe` |
| independent_check.py | `fa0fa04bece8012412faf39d65f3afb45059a1e7939ef75f9a60e8ad4da352fb` |
| PRIOR-WORK.md | `81af75a44faf09c40b69e6284dc527ff66e7e783b89cd2bb31bf584aa844b935` |

This verdict applies to that preprint source. It does not certify later edits or the visual layout of its PDF rendering.

## Mathematical transfer and scope

The assembled theorem preserves the essential quantifiers: the allowed graph and componentwise surjections are fixed; the fine mechanisms range over all compatible simple systems; and the induced coarse mechanisms vary with the fine system. “Respects the graph” permits unused edges, as required by the necessity construction. The manuscript explicitly distinguishes this universal guarantee from a test of exactness for a single installed system.

The sufficiency proof correctly retains every original fine clamp, adds clamps only on previously un-clamped injective coordinates, obtains a fine conditional solution by simplicity, and uses topological evaluation only on the remaining partial coordinates. Injectivity then restores the temporarily removed equations. Erased coordinates are still solved at the fine level rather than being silently discarded. Surjectivity covers every coarse clamp value and every allowed choice of its fine representative.

The necessity construction is total on all fine states. A partial map supplies two states in one fibre and a third in another, but the argument does not assume those are the whole domain. The single hidden reversal prevents a fine solution in the bad fibre, and all nonempty cycle clamps break the residual cycle into chains. Thus the constructed system is simple under all fine point interventions, not just observationally uniquely solvable. Its macro system has exactly two un-intervened equilibria.

The nine-state lower bound follows from the universal theorem and looplessness: a failure needs at least two partial coordinates, each of size at least three. The separate isomorphism classification is correctly restricted to the two-component minimum. The singleton/double-fibre case split and the fixed-point-free two-element composite are transcribed faithfully. The displayed synchronous four-cycle in the minimum example is correct. The linear comparison is also correct: this fine map is linear over the field with three elements, while its value quotient is nonlinear; the stated finite-dimensional invariant-subspace argument applies only to linear quotients.

The retention propositions preserve the restricted refinement class: retain an entire coordinate or leave its original quotient unchanged. The hidden-dependency graph is checked on all declared input states. Predecessor closure is exactly the factorization condition because each product fibre is connected by one-coordinate changes. The weighted formula correctly uses the union of predecessor closures and nonnegative costs. It is an optimum for the combined descent and graph certificates, not an optimum over all semantically exact abstractions.

The limits section retains the necessary qualifications:

- unique observational equilibrium cannot replace simplicity under all point clamps;
- unique simultaneous solutions do not imply convergence under synchronous or fair asynchronous updates;
- connected fine simplicity must be justified separately after feedback composition;
- generalized replacements are covered only when the resulting models retain the stated hypotheses;
- the allowed table-dependency graph is not identified with a causal graph modulo equation equivalence;
- arbitrary stochastic mechanisms and overlapping variable alignments are not covered;
- the optional measurable-context extension now includes the required measurability assumption.

For the last point, finite-state solution maps are measurable when each mechanism's dependence on the context is measurable: the event that a fixed state solves a given intervention is a finite intersection of measurable equation events. Uniqueness partitions the context space into these events. The earlier missing qualification has therefore been repaired in the preprint.

The Hegelese paragraph reports a proposed certificate, not an implemented feature or demonstrated programming benefit. The philosophical discussion labels the finite mechanisms and intervention assumptions as modelling choices. The manuscript does not identify feedback with the Concept or claim a formalization of Hegel's whole system.

## Reproduction

From the project workspace, the following commands were executed with Python **3.14.7**:

```text
python outputs/reciprocal-causal-abstraction/enumerate_models.py --output-dir work/reciprocal-causal-abstraction/publication-reproduction/main
python outputs/reciprocal-causal-abstraction/independent_check.py --output work/reciprocal-causal-abstraction/publication-reproduction/independent/independent-check-results.json
```

Both exited successfully with every assertion passing. The reproduced files were parsed and compared structurally, then compared byte-for-byte with the originals. All comparisons passed. No interpreter or source-hash metadata differences arose on this run.

| Result file | Bytes | Reproduced SHA-256 |
| --- | ---: | --- |
| two-component-results.json | 9,725 | `c7e9ee56974144daba77c7d84326984ab52113c6c780d80ce87de36528653793` |
| three-bit-results.json | 432 | `74719ee93be606761494d560ec56c10c0b52e9b0ba3a595c738712cc132d4b91` |
| cycle-witness-results.json | 1,810 | `f766597b613bc5b51c4d4399455988263ac7fc187c957415bf86d2de992f70c4` |
| worked-examples.json | 8,291 | `f8da4174fade5ba6950b2d236d9cd8748391046e947e13940aedfaa22b9e611b` |
| independent-check-results.json | 22,550 | `c24464ccc625a11e8179e242c1afe8bdb68f20128186ab63862ab91440f2f791` |

The two programs have separate partition routines, separate graph routines, and separate implementations of factorization and equation solving; neither imports the other. The independent implementation constructs hidden dependencies from explicit pairs of states. Their common finite mathematical specification is intentional. Their agreement does not replace the general proof.

## Count audit

Every count stated in the preprint agrees with the reproduced files:

| Claim | Verified count |
| --- | ---: |
| Two-component fine systems, sizes 1 through 3 | 900 |
| Two-component system/partition pairs before descent filtering | 19,768 |
| Descending two-component pairs | 7,476 |
| Simple descending two-component pairs | 5,206 |
| Safe / unsafe simple descending pairs | 5,188 / 18 |
| Matched fine interventions checked by the independent two-component audit | 80,140 |
| Three-bit fine systems | 4,096 |
| Identity/erasure interfaces per three-bit system | 8 |
| Simple descending three-bit pairs, all safe | 2,928 |
| Matched fine interventions checked by the independent three-bit audit | 79,056 |
| Three-vertex allowed graphs / representative quotient-type assignments | 64 / 27 |
| Cyclic partial cases with verified simple witnesses | 135 |
| Remaining graph/type cases, not exhaustively enumerated over mechanisms | 1,593 |
| Full-retention refinements checked | 23,276 |
| Descending refinements | 17,980 |
| Base pairs with graph-only versus descending-certificate cost gap | 324 |
| Such cost gaps with simple fine systems | 18 |

The minimum-obstruction count also agrees with its proof: nine pairs of canonical three-state partial partitions, with two labelled fine mechanisms per pair, give 18 failures. The independent checker explicitly tests each failure against that normal form.

The distinction between the three-bit exhaustive search and the ternary cycle-witness construction is stated accurately. Binary coordinates have no partial quotient. The 135 cycle cases are constructed witnesses; they are not a census of all mechanisms on three ternary coordinates. The general acyclic direction is proved mathematically rather than inferred from those finite checks.

## Bibliography and claim audit

The preprint's author names, titles, years, journal information and cited definition/section numbers agree with the locally available primary-source audit where that audit records the metadata. The Reader day numbers and provenance agree with `source-provenance.json`. There are twelve distinct bibliography keys, all cited, and no unresolved or duplicate citation keys. All source `ref` and `eqref` labels resolve, with no duplicate labels.

This review did not freshly retrieve the cited publications. In particular, metadata details absent from the local audit, such as the JMLR article number and the LICS pagination, were not independently reverified here. Primary-source verification of those items remains with the literature audit/publication editor. No conflicting local bibliographic metadata was found.

The manuscript explicitly credits prior value merging, cyclic solution-set abstraction, hidden motion appearing stationary, simple-SCM theory and fixed-point arguments. Its narrower candidate contribution and its unresolved priority status are stated appropriately. An unsuccessful targeted search is not presented as proof of novelty, and internal AI reviews are not described as external peer review.

## Accompanying-note inconsistency, resolved

At the audited hash, `PRIOR-WORK.md` still called the universal classification a research target whose “proof and priority remain open.” The current package supplies a complete proof and internal reviews, while priority and external review remain open. This was an archive-consistency issue; it did not contradict the mathematical statements in the reviewed preprint.

The literature agent corrected that wording during this audit. A direct read of the updated note confirmed that it now distinguishes the available proof and internal checks from unresolved historical priority. The corrected note had SHA-256 `30c2ab80771e994ca662e01c03427f82b8cb9d63b99402c5b32a3c02d678c096`. Additional literature material in that later note and planned subsequent preprint edits are outside the reviewed source snapshot above. No deliverable other than this check report was changed by this reviewer during this audit.

## Final-source addendum

Later on 7 November 2026, the complete final `preprint.tex` was read again after the publication editor's source, related-work and layout edits. This addendum extends the source-content verdict above to:

**Final preprint SHA-256:**

`d5e05f390b54836839282910427a1aacc2ee282658e8c0d87661ab3ec7f6b489`

No changed mathematical claim or proof step was identified in the universal theorem, the minimum-obstruction classification, the retention propositions or the scope examples. The counts and reproduction claims remain the same as those checked above. The measurable-context qualification remains explicit. The shortened process statement still distinguishes internal AI critiques from external review and leaves priority open; the shorter Hegelese reference does not change the explicit statement that the feedback certificate is proposed rather than implemented.

The added direct *Science of Logic* reciprocity reference complements the retrospective Notion reference without turning the philosophical motivation into a mathematical premise. The added Ruet and grid unique-sink-orientation paragraph is consistent with the updated local prior-work audit: it credits established hereditary uniqueness and whole-coordinate elimination, and does not claim that those results establish the new partial-value-quotient classification. The grid-face qualification remains visible. These additions were checked against the local audit, not freshly retrieved external papers in this pass.

The final source contains **15 distinct bibliography keys**, all cited, **12 distinct labels**, and **8 referenced labels**. Automated checks found no unresolved citation or equation-reference key and no duplicate key or label. The ragged table and bibliography changes do not alter their mathematical content; rendered-page inspection remains a separate publication check.

The two checker source hashes still equal the values recorded above. The enumerators were therefore not rerun for these source-only edits; the earlier successful reproduction and byte comparisons continue to support the unchanged numerical claims. No additional issue was found in this final-source pass.
