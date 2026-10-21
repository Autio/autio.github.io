# Exact all-edge curvature with polynomial parameter dependence

Research extension, 21 October 2026. This improves the exponential-in-k solver in `general-theorem.md`. Novelty of the application remains unconfirmed; maximum closure and maximum flow are established methods.

## The result

Let H be the complement of a connected simple graph G, and suppose its maximum pair codegree is at most k. All zero-idleness, open-neighborhood edge curvatures can be recognized and computed exactly in

    O(poly(k) * n^2)

word-RAM operations and O(k*n^2) space, with unreduced rational output. A deliberately coarse explicit bound from the construction below and Edmonds–Karp is O(k^19*n^2). The exponent in k is not asserted optimal. This replaces the earlier sufficient exponential dependence; the quadratic dependence on n is unchanged and optimal for explicit output.

The bounded transport construction is in `general-theorem.md`; `sharp-theorems.md` improves its target bound to beta<=k^2-k+1 on exceptional edges. The new ingredient here is an explicit capacity-independent minimum-cut solver for that residual problem. The public `all_curvatures` function in `general_complement.py` now selects it by default; the old flow and dual-enumeration backends remain available as independent comparisons.

## Restricting the transport dual

After common-mass cancellation, sources lie in N_G(x) and targets in B=N_G(y)\N_G(x), with x in B. Scale all residual masses by ab. Let U_i be source supplies, V_j target demands, and M their common total. The distance matrix c_ij has values 1,2,3. Every source has distance one to target x, and every target has distance at most two to x, via y.

An optimal integer Kantorovich potential exists by the established integral difference-constraint formulation; see [Kelly, Theorem 4](https://arxiv.org/html/1909.12156v2). Anchor its value at x to zero. Its source values f_i lie in {-1,0,1}; its target values g_j lie in {-2,-1,0,1,2}. The bipartite transport dual is

    maximize sum_i U_i*f_i - sum_j V_j*g_j,
    subject to f_i-g_j <= c_ij.

Clip every positive target value to zero. Feasibility is preserved: f_i<=1<=c_ij whenever g_j was positive. The objective does not decrease. Since the starting solution is optimal and the clipped solution is a feasible transport dual, it remains optimal. Therefore an optimal dual exists with

    f_i in {-1,0,1}, g_j in {-2,-1,0}, g_x=0.       (1)

Not every bipartite dual potential need extend to a graph Lipschitz potential. This is harmless: bipartite dual feasibility always gives a lower bound, and the restricted family contains an optimum obtained from the original metric potential.

## Two threshold levels per variable

For each source i introduce two binary nodes:

    F_i^0 = [f_i>=0], F_i^1 = [f_i>=1],

each with weight +U_i and implication F_i^1 -> F_i^0. Thus f_i=-1+F_i^0+F_i^1.

For each target j introduce two nodes:

    G_j^-1 = [g_j>=-1], G_j^0 = [g_j>=0],

each with weight -V_j and implication G_j^0 -> G_j^-1. Thus g_j=-2+G_j^-1+G_j^0. Force G_x^0 to be selected.

Encode each distance constraint by implication arcs:

| Cost c_ij | Required implications |
|---|---|
| 1 | F_i^0 -> G_j^-1 and F_i^1 -> G_j^0 |
| 2 | F_i^1 -> G_j^-1 |
| 3 | None |

For the ranges (1), this table is exactly equivalent to f_i-g_j<=c_ij. This finite-label equivalence and the clipping step are kernel-checked in `lean/CutLabels.lean`.

The dual objective equals M plus the sum of the weights of the selected threshold nodes, because the constant contribution is -M+2M=M. Thus exact transport reduces to maximum-weight closure of this implication graph with a forced anchor.

## One ordinary minimum cut

Use the standard maximum-closure reduction: connect a super-source to positive-weight nodes, negative-weight nodes to a super-sink, and put sufficiently large capacities on implication arcs. Connect the super-source to G_x^0 with the same large capacity. A capacity of 4M+1 suffices: selecting all threshold nodes is a feasible closure and yields a cut of capacity 2M, so an optimum never cuts a large-capacity arc.

The sum of positive node weights is 2M. If lambda is the minimum-cut capacity, the maximum closure weight is 2M-lambda. Therefore the exact scaled residual transport cost is

    D = 3M-lambda,
    kappa_0(x,y) = 1-D/(ab).                       (2)

The solver returns and checks a maximum-flow/minimum-cut certificate and a feasible integer transport dual attaining D. `cut_transport.py` implements breadth-first augmenting paths, so the standard Edmonds–Karp bound is independent of capacity magnitudes.

The closure method is classical: [Picard, 1976](https://pubsonline.informs.org/doi/abs/10.1287/mnsc.22.11.1268). The flow algorithm is classical: [Edmonds–Karp, 1972](https://web.eecs.umich.edu/~pettie/matching/Edmonds-Karp-network-flow.pdf). Neither is claimed as a new algorithm here.

## Complexity

The bounded reduction has m=O(k^5) source types and beta=O(k^2) targets. The closure network has O(m+beta)=O(k^5) vertices and O(m*beta)=O(k^7) arcs. Edmonds–Karp requires O(V*E^2)=O(k^19) operations. The capacities, including 4M+1, are O(n^2); word size O(log n) suffices for fixed k. Recognition and indexed common-neighbor preprocessing require O(k*n^2) operations. Apply the reduction only at exceptional candidate edges and use triangle equality elsewhere.

This establishes the stated coarse polynomial parameter bound. Actual working memory is O(k*n^2): there are never more source types than original sources, nor more targets than original vertices, so each auxiliary network has O(n^2) arcs even when the coarse k-only bound is larger. Dense indexed adjacency provides the deterministic bound; Python set membership gives expected constant-time lookup in the implementation.

## Verification and limitations

The new backend agrees with full integer min-cost transport on every one of the 126,736 cases requiring a residual solve in the current replay. The overall replay checks 219,371 edges, including every connected labeled graph through six vertices, plus larger examples. A separate integer-potential enumerator also checks 125,628 cases. In particular, distance-three cases are included and are handled by the cost-three row of the table.

The runtime proof and the general maximum-closure correctness proof are handwritten, not fully Lean-formalized. The polynomial bound in k is intentionally coarse. A literature search has not established priority for this graph-class algorithm or for the specific curvature-to-closure specialization.
