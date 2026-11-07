# Internal adversarial proof review

Reviewed 2026-11-07: [theorem.md](theorem.md) and [retention.md](retention.md). This is an internal AI review, not external peer review. It is separate from the literature audit and does not establish priority.

**Finding:** no mathematical counterexample or proof gap found in the stated universal classification or the full-retention descent criterion. One typesetting correction is listed below. The results depend on the assumptions and quantifiers actually stated; the review does not endorse broader interpretations.

## Universal classification

- **Quantifiers:** `D` and all `q_i` are fixed; `F` ranges over all simple mechanisms respecting the allowed graph and descending through those maps. The induced `G` varies with `F`. The necessity construction uses this freedom correctly. The result does not classify safety for a fixed `G` or a single installed `F`.
- **Allowed edges:** an edge need not be used. The necessity witness can therefore ignore every chord and off-cycle edge. It would not immediately prove a version requiring the exact functional dependency graph to equal `D`.
- **Macro dependency graph:** product surjectivity lets a change of one macro coordinate be represented by a change of only the corresponding fine coordinate. Thus descent really preserves the dependency bound used in the topological step.
- **All interventions:** the auxiliary intervention keeps every originally clamped fine value `b_i`, including values inside nontrivial fibres. It only adds clamps on the previously unclamped injective coordinates. Original simplicity supplies the auxiliary solution. After the topological argument, injectivity restores exactly the equations that were temporarily removed.
- **Erased coordinates:** their macro values are unique, so they agree automatically in the two macro assignments. Their fine values need not be fixed in advance; simplicity solves them along with the residual coordinates. This is why replacing `P` by all noninjective coordinates would be unnecessarily restrictive.
- **Singletons:** assigning a singleton coordinate to `I` is consistent with both the inverse-image step and the partition into `I,C,P`. Empty sets of coordinates and empty residual systems create no exceptional case.
- **Sharpness for arbitrary maps:** every `P` coordinate has a two-element fibre and a state in another fibre. The classifier handles all remaining states, including additional fibres. Any intervention on the cycle breaks it into chains even when its clamped value is not one of the three selected states. The witness is therefore simple under all fine clamps, not merely the selected ternary ones. The macro equations have exactly the two claimed solutions.
- **What is not proved:** uniqueness does not establish synchronous or asynchronous convergence. The manuscript states this limitation correctly. The self-loop extension is about actual fixed-point mechanisms, with the separate causal-graph qualification retained.

The three-coordinate example showing that global uniqueness is weaker than simplicity checks out: the original fine solution is `(0,0,0)`, while clamping the retained coordinate to `1` yields the inconsistent residual equations stated in the note.

## Full-retention refinement

The predecessor-closure criterion is exact for the permitted choices `r_i = q_i` or `r_i = identity`.

Necessity uses a legitimate pair of inputs in one refined fibre whenever an upgraded output has an un-upgraded hidden predecessor. Sufficiency is not defeated by multivariate interactions: two points in a product fibre can be joined by individual coordinate changes, and absence of the corresponding `H` edges controls every such change in every context. Originally injective outputs have no incoming hidden-dependence edges because original descent and output injectivity already force their full outputs to be constant on old fibres.

The combined condition correctly certifies both descent of the actual mechanisms and the universal graph guarantee. It is not necessary for semantic correctness of one installed model. This distinction, and the exclusion of intermediate state partitions, are explicit and essential.

The weighted identity is valid: the ancestor closure of any feedback vertex set is feasible, while the closure of `R intersect P` is contained in any feasible `R`. Nonnegative costs justify discarding unnecessary upgrades. Shared ancestors must be charged once; the manuscript correctly warns against replacing the union cost by a sum of separate closure costs.

## Independent finite comparison

An additional checker was executed in memory for this review; it did not modify the research scripts or results files. It enumerated all 729 pairs of loopless mechanisms on two ternary coordinates, and all nine pairs of representative interface types: identity, constant, and `(0,1,1)`.

Results:

| Check | Count | Outcome |
| --- | ---: | --- |
| Descending mechanism/interface pairs | 2,817 | Enumerated |
| Full-retention subsets: direct factorization versus predecessor closure | 7,785 | All agreed |
| Simple descending mechanism/interface pairs | 1,851 | Enumerated |
| Allowed-graph instances for those simple pairs | 2,958 | Enumerated |
| Matched fine-intervention instances covered by the acyclicity certificate | 44,784 | Exact singleton projection in every case |
| Unsafe simple proper/proper examples | 2 | Found, consistent with sharpness |

The factorization check grouped inputs and outputs directly; it did not infer descent from `H`. Fine simplicity was checked by counting solutions for every fine point intervention. These finite results support the proofs in their tested scope; they do not replace the proofs or cover arbitrary cardinalities by enumeration.

## Corrections and optional strengthening

1. **Typesetting only, resolved before packaging:** in retention.md, equation (3), `i\in R,quad j\to i` was corrected to `i\in R,\quad j\to i`.
2. **Optional scope observation:** the direct arguments appear not to use finiteness of each state set. They use finitely many coordinates, surjections, and the stated all-intervention simplicity. Keeping finite state sets is a reasonable deliberate scope for executable checking; a broader theorem would need its assumptions and priority assessed explicitly.

No change to the mathematical statements is requested by this review.
