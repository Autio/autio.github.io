# Reciprocity without losing causality

Publication preparation, 7 November 2026. A proved universal classification, a smallest obstruction, and an exact information-retention criterion. Internally reviewed by AI agents, including separate proof and computational reviews and an authoring-agent re-audit. Two separately written finite enumerators agree. **Mathematical priority and external review remain open.**

Start with the full [research preprint](reciprocity-preprint.pdf), or the earlier three-page [research brief](research-brief.pdf). The preprint supplies the complete proofs and Hegelian motivation; its editable source is [preprint.tex](preprint.tex). The working proofs are also available in [theorem.md](theorem.md), [minimal-counterexample.md](minimal-counterexample.md), and [retention.md](retention.md). The [prior-work audit](PRIOR-WORK.md) explains what is already known; the [publication review](PUBLICATION-REVIEW.md), [adversarial review](PROOF-REVIEW.md), and [mathematical re-audit](MATHEMATICAL-REVIEW.md) record internal checks and their limits. [PREPRINT-CHECK.md](PREPRINT-CHECK.md) records proof transcription, counts and fresh reproduction.

## The result in ordinary language

Suppose interacting components have a uniquely determined joint state, even when we externally fix any selection of them. We simplify each component, checking that its rule still makes sense through the simplified descriptions. Does the simplified whole retain those uniquely determined states?

Not always. A simplification can make an ongoing disagreement look like agreement.

There are three different kinds of simplification:

| Kind | What the description retains | Example |
| --- | --- | --- |
| Fully retained | Every fine distinction | `0,1,2 -> 0,1,2` |
| Wholly erased | No distinction in that component | `0,1,2 -> *` |
| Partially simplified | Some distinctions, with others merged | `0,1,2 -> OFF,ON,ON` |

**Sharp universal rule:** given an allowed dependency graph and component maps, every compatible simple fine system preserves its unique solutions under every matched point intervention if and only if there is no directed cycle entirely among the partially simplified components.

Here *simple* means exactly one solution under every point intervention, including the empty intervention. A point intervention replaces chosen component equations by fixed values. Compatibility means the mechanism equations commute pointwise with the component maps. These are substantive assumptions. The graph rule transfers an existing solvability guarantee; it does not prove the fine system has that guarantee.

The whole graph may have cycles. Wholly retained and wholly erased components are treated differently from partial simplifications. This is the main improvement over a blanket ban on hidden feedback. Whole erasure can still discard observations the user requires; a causal-preservation theorem does not authorize that information loss.

The theorem concerns a guarantee for **every compatible mechanism system** on a fixed allowed graph. For a particular installed system, a cyclic partial graph can still be harmless. Failure of this certificate is not itself evidence of a false equilibrium.

## A nine-state example

Two components each take values 0, 1 and 2. The first copies the second. The second swaps 1 and 2 while keeping 0 fixed:

`F(a,b) = (b,s(a)), where s=(0,2,1).`

Their only equilibrium is `(0,0)`. Fixing either component externally determines the other uniquely, so the fine system satisfies the full intervention assumption.

Now report 0 as OFF and both 1 and 2 as ON. Both coarse rules copy the other's coarse value. The coarse equations have two equilibria, `(OFF,OFF)` and `(ON,ON)`. The latter has no fine equilibrium. Its fine states instead form this synchronous cycle:

`(1,1) -> (1,2) -> (2,2) -> (2,1) -> (1,1)`.

Every step is described as `(ON,ON)`. An unchanging description has concealed continuing change.

This is the smallest counterexample in the stated loopless finite class: at least two partial coordinates are needed, each requiring at least three fine states. All minimum two-component failures are this example up to independent relabelling. The classification is proved, not inferred solely from the enumeration.

There is a useful linear comparison. The fine example is linear over the three-element field: `s(a)=-a`, so `F(a,b)=(b,-a)`. The map identifying 1 and 2 is not a linear quotient. For a finite-dimensional linear system and an invariant-subspace quotient, invertibility of `I-A` passes to the quotient: its restriction to the invariant subspace is injective and therefore surjective, and the induced quotient map is invertible. Thus the example does not contradict the classical linear baseline; its value merge is the crucial extra operation.

## Repairing a proposed interface

Keeping more detail in one output can require keeping more detail in its inputs. Define a hidden-dependency edge `j -> i` when the full mechanism output of component `i` distinguishes two values of input `j` that the old interface merges, with all other inputs held fixed.

For refinements that either leave a coordinate map unchanged or retain that coordinate fully, [retention.md](retention.md) proves:

1. The actual mechanisms remain well-defined exactly when the upgraded coordinates are closed under these hidden-input predecessors.
2. Combining that closure with the removal of all cycles among the remaining partial coordinates gives the theorem's causal certificate.
3. With nonnegative prescribed costs, the exact certificate optimum is the least cost of the ancestor closure of a directed feedback vertex set. Shared ancestors are counted once.

In the nine-state example, one upgrade breaks the graph cycle, but both components must be upgraded to keep their mechanisms well-defined. The optimization concerns this specified certificate and whole-coordinate upgrades. It does not optimize every valid causal abstraction or arbitrary intermediate partitions.

## Exact checks

| Finite family | Exhaustive coverage | Outcome |
| --- | --- | --- |
| Two loopless components, each of size 1 through 3 | 900 systems; 19,768 system/partition pairs; 7,476 descending pairs | 5,206 descending simple pairs: 5,188 safe and 18 unsafe |
| Three loopless Boolean components | All 4,096 networks and all 8 identity/erasure interfaces | 2,928 descending simple pairs; all safe |
| Three-vertex sharpness construction | All 64 loopless graphs and all 27 representative interface-type assignments | 135 cyclic partial-graph cases; a simple fine counterexample verified for each |
| Full-retention refinement | All 23,276 upgrade candidates across the 7,476 descending two-component pairs | Direct factorization agrees with predecessor closure in every case |

For the retention search, 17,980 refinements descend. There are 324 base pairs where the graph-only minimum understates the minimum cost of a descending certificate, including 18 with simple fine systems. Two independently written programs agree on all overlapping counts, including every two-component domain subtotal. The independent checker directly verifies 80,140 matched fine interventions in the two-component search and 79,056 in the Boolean search.

The sharpness search checks witnesses in the 135 obstructed cases; it does **not** enumerate all ternary three-component mechanisms in the 1,593 unobstructed cases. The proof supplies the general direction. The Boolean search contains no partially simplified coordinate, because a two-state domain has only injective or constant surjections.

## Failed shortcuts and limits

| Tempting claim | What happened |
| --- | --- |
| Local mechanism commutation plus fine simplicity is enough | False: the nine-state example creates a spurious coarse equilibrium. |
| Every noninjective coordinate must be excluded from cycles | Too strong: wholly erased coordinates can be solved using fine simplicity. The exact universal test only concerns partial coordinates. |
| A unique observational equilibrium can replace all-intervention simplicity | False: the included `3 x 2 x 2` example has one fine equilibrium but becomes inconsistent under a point intervention, while its quotient gains a false equilibrium. |
| One graph cycle-breaking upgrade is automatically an implementable repair | False: hidden-input dependencies can force additional retention. |
| Simplicity implies convergence under fair asynchronous updates | False: a three-bit network has a unique solution under all 27 interventions and still has a fair six-state update cycle. |

The theorem does not solve arbitrary generalized interventions, stochastic feedback, overlapping variable alignments, or dynamic convergence. General mechanism replacements are covered only when the resulting fine system remains simple, the local equations continue to descend, and the relevant graph condition holds. Separate module guarantees do not establish that a newly connected fine system is simple.

## Hegelian source and the Hegelese prospect

The question came from [Hegel Reader, Day 93: Formal causality](https://autio.github.io/hegel-reader/#day-93) and [Day 97: The Universal Concept](https://autio.github.io/hegel-reader/#day-97). The source blob and retrieval metadata are recorded in [source-provenance.json](source-provenance.json). Some Reader chapter labels and analogies are inaccurate, so the interpretation was checked against Hegel's [Encyclopaedia, sections 154-159](https://www.marxists.org/reference/archive/hegel/works/sl/slactual.htm), especially section 156 and its Addition, the direct [Science of Logic reciprocity passage](https://www.marxists.org/reference/archive/hegel/works/hl/hlessenc.htm) (online paragraphs 1272-1276), and [the retrospective account and immanent criticism](https://www.marxists.org/reference/archive/hegel/works/hl/hlnotion.htm) (online paragraphs 1281-1288).

Hegel's demand to understand reciprocal sides through their mediation within the whole motivates an operational question: does the higher-level description preserve the interacting system's causal possibilities, or does it manufacture an apparent unity by hiding a failure of its parts to agree? The theorem answers a finite version of that question. The intervention and uniqueness assumptions are our formal choices, not deductions from Hegel. Neither a feedback graph nor an equilibrium is identified with his whole Concept or with freedom.

For Hegelese, the concrete opportunity is a research certificate for revisions of interacting components. Such a certificate would combine local mechanism checks, a separate justification of fine simplicity, and the graph condition. It could return a hidden-input witness when an upgrade is ill-defined, or identify a cycle showing that a universal guarantee is unavailable. A particular semantic failure would require an actual counterexample rather than a failed graph test alone. This is an extension proposal; the current Hegelese language has not been changed.

## Novelty and next question

The prior-work audit found clear precedents for cyclic abstraction, value merging, and a coarse fixed point representing a hidden fine cycle. Generic fibre-acyclicity and fixed-point uniformity are also classical. The best candidate for a distinctive result is the exact universal classification by `D[P]`, together with the minimum-obstruction classification. No matching theorem was located in the targeted sources or the inspected follow-up papers. This does not establish priority.

The next substantive question is **how to certify a fixed installed mechanism system when `D[P]` has cycles**, while avoiding a global enumeration of all its equilibria. A related problem is to optimize genuinely partial interface refinements, beyond the whole-coordinate upgrades solved here. Either requires more mathematics; the current proof should not be stretched to imply an answer.

## Reproduce

Both checkers use only the Python standard library, version 3.10 or later. They were run with Python 3.14.7. From this directory:

```text
python enumerate_models.py --output-dir /path/to/check-results
python independent_check.py --output /path/to/independent-results.json
```

The website's small JavaScript model is also included as `demo-model.js`. With Node.js installed, run `node check_demo.cjs` to check all 64 combinations of the four retention choices and 16 fine interventions, plus the displayed four-state orbit. It does not replace either exhaustive Python search.

The main program writes four JSON reports. The independent report also records its source hash and interpreter version. Numerical coverage and claims are the same across suitable interpreters; metadata and line endings may change byte hashes. The programs test semantic solution sets directly before comparing them with the proposed graph rules.

Build the preprint with `tectonic preprint.tex` (or a current LaTeX installation with the named packages). This emits `preprint.pdf`; the distributed copy is named `reciprocity-preprint.pdf`. Tectonic may download TeX packages unless a complete local cache is available. The brief can be rebuilt with `python build_brief.py` in an environment with ReportLab installed. Both enumerators run without network access. Final rendering and packaging checks are recorded in [validation.json](validation.json). [SHA256SUMS](SHA256SUMS) records the packaged files.

This package accompanies the [version 1 preprint and interactive page](https://autio.github.io/ai-science/reciprocal-causal-abstraction/). The paper explicitly links the theorem to a proposed research certificate for [Hegelese](https://github.com/Mikael-Codes/hegelese). The general mathematics and reproducible archive live with this publication; a language-specific connection note is proposed for the Hegelese repository. No Hegelese language implementation is changed by this research package. Deployment evidence is recorded separately from this pre-deployment validation snapshot.
