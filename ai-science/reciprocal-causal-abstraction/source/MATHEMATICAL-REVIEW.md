# Adversarial mathematical review

7 November 2026.

**Verdict.** I found no gap in the main universal graph theorem, its arbitrary-surjection obstruction construction, the minimum two-component classification, or the retention propositions, under the hypotheses stated in the reviewed files. One peripheral probabilistic extension needs an explicit measurability qualification before publication. There is no blocker to the main finite deterministic result identified by this review.

This is an internal AI re-audit. The reviewing agent previously contributed to the theorem and retention proofs, so this report is not an independent authorship-blind review, a proof-assistant verification, or external peer review. Independent computational and other mathematical reviews are separate records. This review does not establish priority.

## Reviewed versions

The audit reread these files in full. SHA-256 values identify the versions reviewed, before any subsequent editorial corrections:

| File | SHA-256 |
|---|---|
| theorem.md | 0ac1ef9a878ba49a231878cb9e19c4742d9254f4d75fc9cd702fc44faf65cb1b |
| retention.md | b64150a0079697ffd52a258bd0d0af4a369b17eabde0b65cd23cd1058166cfc7 |
| minimal-counterexample.md | ad3c290e6a035841aef1b29641b5cf3885e1d7f90e35303b6f42712ab552b25e |

The proof audit did not rely on the numerical experiments. In particular, finite testing is not used to justify the universal quantifier over all finite component cardinalities.

## 1. Exact scope of the universal statement

The data fixed before the universal quantifier are:

- a finite component set, with finite nonempty fine and coarse state sets;
- one surjective map per component;
- a loopless graph of allowed mechanism dependencies.

The quantified systems are all fine systems which respect the allowed graph, descend componentwise through the fixed maps, and have exactly one solution after every point-clamp intervention. An allowed edge is not required to be used.

The criterion concerns the induced graph on coordinates whose maps are **neither injective nor constant**. This distinction is essential. Replacing that set by all noninjective coordinates would give a stronger and generally unnecessary graph condition. Treating a singleton-domain map as injective, rather than placing it in both retained and erased classes, is a consistent convention.

The claimed equivalence is valid as a guarantee for all compatible systems. It is not a characterization of exactness for one installed system. For instance, constant mechanisms can be harmless under a graph containing many unused cycles. The necessity construction is valid because respecting an allowed graph permits unused edges.

**Publication caution:** do not replace “respects the allowed graph” with “has exactly this essential dependency graph” without a new argument. Do not shorten the conclusion to “a partial-coordinate cycle makes an abstraction incorrect.” The correct conclusion is that such a cycle admits a compatible simple system for which correctness fails.

## 2. Simplicity and subset solvability

The finite, fixed-context definition in theorem.md is accurate. Here is the equivalence explicitly.

For a subset $O$ of components, clamp its complement $B=V\setminus O$ to an arbitrary value $b$. Fixed points of that intervened whole system correspond exactly to solutions of the equations indexed by $O$, with the complement held at $b$. Thus unique solutions after all point clamps are equivalent to unique solutions of every subsystem for every assignment of the variables outside it.

The resulting solution function depends only on outside variables that occur as parents in the subsystem's equations: if two assignments agree on those parents, they give identical equations and hence the same unique solution. For finite state spaces the function is automatically measurable under the discrete sigma-algebras. The converse follows by evaluating the subsystem solution function at each clamp assignment.

This agrees with the finite deterministic specialization of unique solvability for every subset in Bongers, Forré, Peters and Mooij, Definitions 3.3 and 8.1. Their general framework has measurable spaces, exogenous randomness and almost-sure qualifications; the present fixed-context theorem does not claim those generalities. See [the definitions and discussion of solvability](https://arxiv.org/html/1611.06221v6#S3) and [simple SCMs](https://arxiv.org/html/1611.06221v6#S8).

The main theorem requires all complement assignments, including assignments not attained at the observational equilibrium. Replacing that requirement by unique observational solvability, unique solutions only on reachable states, or unique solutions only for a selected list of interventions does not justify the proof. The three-coordinate example in theorem.md correctly demonstrates failure when only observational uniqueness is retained.

## 3. Sufficiency proof

The auxiliary-clamp proof is valid.

1. Surjectivity makes the macro mechanisms unique and lets each macro assignment be represented by fine coordinates. It also shows that the descended mechanisms respect the same allowed graph.
2. A solution of any fine point intervention projects to a solution of the matched macro intervention. Therefore the macro solution set is nonempty.
3. Given an arbitrary macro solution, the proof clamps the already intervened fine coordinates and all additionally retained injective coordinates. Fine simplicity supplies a solution of this stronger intervention.
4. The projections agree with the proposed macro solution on the original clamps, on injective coordinates and on constant coordinates. The remaining partial-coordinate equations form an acyclic subsystem with the same fixed external inputs. Their unique solution therefore forces agreement everywhere.
5. Injectivity on the auxiliary retained coordinates restores their original fine equations. No original intervention is undone, and no hidden equation at an erased coordinate was discarded.
6. Every macro solution consequently lifts to a fine solution of the original intervention. That fine solution is unique. This proves macro uniqueness and the stated singleton-to-singleton bijection.

The argument works with arbitrary finite fibre cardinalities. It does not require a uniform fibre size, a chosen global section, an order on the state sets, or equal fine and coarse domains at retained coordinates. It also handles an empty partial set, empty intervention set, full intervention set and singleton coordinates.

Fine representatives of a coarse clamp need not be unique. The proof establishes the same coarse solution for **each** permitted fine representative separately. Thus no representative-selection convention is silently introduced.

## 4. Necessity for arbitrary surjections

The cycle construction is valid for every directed cycle in the partial-coordinate graph, without assumptions on the unused states.

At each cycle vertex, noninjectivity supplies two states in one fibre, and nonconstancy supplies a state in a different fibre. The classifier is defined on the entire fine domain. Its “other fibre” output is always the selected good state, and its two hidden outputs lie in the same selected bad fibre, so the mechanism descends even when other fibres or extra elements are present.

Every un-intervened fine cycle solution must lie in the selected three-state product. A good state propagates around the whole cycle. Otherwise the two hidden states would have to copy around a cycle with one flip, which is impossible. There is exactly one fine solution.

Any intervention touching the cycle breaks its remaining equations into directed chains. Arbitrary clamp values are permitted because the classifier is total. Interventions avoiding the cycle leave its unique good solution unchanged. Constant off-cycle mechanisms introduce no further solvability issue. Hence the constructed fine system is simple, not merely observationally uniquely solvable.

Every coarse fixed point lies in the selected two-label product. Bad/good membership must agree around the cycle, giving exactly two coarse solutions. The bad one has no fine fixed-point lift. This proves the universal converse and does not rely on any dynamics.

## 5. Minimum-size obstruction and uniqueness

The nine-state lower bound and the classification at that size are correct in the loopless two-component class.

- Any nonempty point intervention fixes at least one coordinate and thereby determines the other; commutation makes these unique solutions correspond. Failure must therefore occur without intervention.
- If either map is injective, every macro equilibrium lifts by evaluating the other fine mechanism and then using injectivity to close the remaining equation.
- If either map is constant, its coarse coordinate is a singleton and the other macro equation has a fixed argument. There is one coarse equilibrium.
- Failure thus requires two partial maps, each with at least three fine states and two coarse states.

At sizes three and three, each partial quotient has a singleton fibre and a double fibre. A binary two-component coarse model can have at most two equilibria. If it has two, its two mechanisms must be inverse bijections. The crossed configuration of equilibrium cells would give a fine equilibrium in each cell, because each has a singleton coordinate, contradicting fine uniqueness. Therefore the cells must be singleton-by-singleton and double-by-double.

The double-cell composite must be fixed-point-free on two elements. It is consequently the transposition; both component maps are bijections on those fibres. Independent relabelling makes one the identity and the other the transposition. This establishes uniqueness of the entire fine/coarse/quotient diagram up to the relabelling stated in minimal-counterexample.md.

The count of 18 labelled failures in the canonical-partition enumeration also follows from this classification: nine pairs of three-state partial partitions, and two possible fibre bijections for the first mechanism per pair. This is a check on that count; the remaining numerical census counts were not rederived in this proof audit.

**Publication caution:** keep “no self-dependence” attached to the minimum claim. One three-state self-dependent equation permits the same collapsed-two-cycle obstruction.

## 6. Hidden-dependence and retention propositions

The graph $H$ is correctly defined on all declared fine input states, not only on equilibrium or observed states. Its edge condition detects the full fine output's response to a change hidden by one old coordinate map.

The original commuting equations imply that $H$ has no edges into an injective output. It also has no edges from an injective input and is a subgraph of the allowed dependency graph.

For the restricted upgrade family “retain the entire coordinate or leave its old map unchanged,” descent is equivalent to predecessor closure:

- A missing predecessor gives two equal refined inputs with unequal fully observed output, directly contradicting factorization.
- With predecessor closure, two points in one refined product fibre can be joined by changing un-upgraded coordinates one at a time. None of those changes can alter an upgraded output. Un-upgraded outputs retain their original factorization.

This uses the product interface and the full state-space commuting equations. It is not proved for correlated admissible state subsets, overlapping coordinate maps, or factorization checked only on an empirical sample.

Full upgrades leave the partial set exactly $P\setminus R$. Combining predecessor closure with acyclicity of $D[P\setminus R]$ therefore gives the stated necessary-and-sufficient condition for the **pair of certificates**. It is not necessary for actual semantic exactness of a particular quotient.

For nonnegative upgrade costs, the optimization identity is valid. Closing a feedback vertex set under $H$ gives a feasible upgrade set. Conversely, for any feasible closed upgrade set, its intersection with $P$ meets all original partial cycles, and the predecessor closure of that intersection is a subset of the original upgrade set. Nonnegative costs give the required inequality. The proof also handles zero costs and the empty partial graph.

The cost must be assigned to the union of predecessor closures. The warning against independently adding closure costs is justified because closures can overlap.

The two-component identity/transposition example correctly separates the graph-only bound of one from the exact full-upgrade certificate cost of two. Neither singleton upgrade descends. Both coordinates must be retained in full.

## 7. Composition and intervention wording

The composition paragraph is sound because it assumes that the **connected fine system** is simple and rechecks the connected graph. It does not establish simplicity of a feedback composition merely from simplicity of its separate modules.

The generalized-intervention paragraph is a conditional application of the main theorem to each replacement system: it requires retained fine simplicity, retained mechanism commutation and an appropriate graph condition. It is not a theorem that arbitrary mechanism replacements preserve those properties.

For publication, use “all matched point-clamp interventions” for the main result. Broader phrases such as “all interventions” should be accompanied by the exact admissibility conditions. No equilibrium-selection rule, scheduler or optimization policy has been added to the macro model.

## 8. One correction before publication

In theorem.md Section 7, the pointwise extension to an exogenous parameter $e\in E$ is valid as stated. The subsequent assertion that an arbitrary distribution on $E$ can be pushed forward through the solution maps needs measurability.

A sufficient correction is either:

- restrict this sentence to finite $E$ with its discrete sigma-algebra; or
- assume a measurable parameter space and measurable mechanism maps $e\mapsto F_i(x,e)$ for every finite fine input $x$.

Under the latter assumption, the set of parameters at which a given state is the unique interventional solution is a finite intersection of measurable equation events. The solution map is consequently measurable, and the pushforward assertion follows.

This is a qualification of an optional probabilistic corollary. It does not affect the finite deterministic theorem, the counterexample classification or the retention results.

## 9. Editorial and claim cautions

- In the necessity construction, the labels presently written “(0)” and “(1)” are numerical classifier values, not equation references. They should be typeset as $0$ and $1$.
- The raw allowed dependency graph must remain distinct from the equation-equivalence causal graph used in the general SCM literature. The existing self-loop caveat is appropriate; Bongers et al. Proposition 3.7 makes this distinction consequential.
- The exact theorem proves preservation of simultaneous solutions under interventions. It proves no convergence, stability, attractor or scheduling property.
- Binary-coordinate experiments cannot exercise a partial quotient. Their role is checking the retained/erased cases, as minimal-counterexample.md already states.
- “Minimal information” would overstate the retention result. Its optimization is over full coordinate upgrades satisfying the chosen graph certificate and factorization conditions, with prescribed nonnegative costs.
- The current proof uses classical ingredients. Its validity does not establish that the exact classification or minimal witness is previously unpublished. Literature and priority conclusions must remain separate from this mathematical verdict.

No further proof gap was identified in the reviewed statements.
