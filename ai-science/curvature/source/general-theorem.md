# Bounded transport for complements of bounded codegree

Research extension, 21 October 2026. Candidate results with analytic proofs and exact computational corroboration. Priority has not been established. This extends `structural-theorem.md`; the earlier exact classification for codegree two remains stronger within that subclass.

**Later developments:** `sharp-theorems.md` improves localization to the sharp beta<=k^2-k+1, describes quantized asymptotic errors and a sharp finite-order cutoff. `mincut-algorithm.md` replaces the exponential dual enumeration below with a polynomial-parameter maximum-closure construction, giving a coarse O(k^19 n^2) all-edge bound. This manuscript records the earlier, still valid weaker construction. `deletion-stability.md` is a separate sharp theorem for arbitrary deletions, without a codegree assumption.

## Statement

Let G be a connected finite simple graph, H its complement, and suppose every pair of vertices in H has at most k common neighbors, where k is a positive integer. Equivalently, H has no non-induced K_{2,k+1} subgraph. Use open-neighborhood, zero-idleness measures throughout.

For an edge xy, orient a=d_G(x)<=b=d_G(y), and put

    A=N(x)\N(y), B=N(y)\N(x), C=N(x) intersect N(y),
    alpha=|A|, beta=|B|, c=|C|, d=b-a.

Then y belongs to A, x belongs to B, alpha<=beta, and beta=alpha+d.

**Theorem A (localization).** If kappa_0(x,y)<c/b, then

    beta < k^2,
    d_H(x), d_H(y) <= k^2+k-2.

In particular all edges with beta>=k^2 attain the triangle upper bound exactly. These bounds are sufficient localization bounds; their numerical constants are not asserted sharp.

**Theorem B (bounded transport).** On each remaining edge, its exact curvature is the value of a transportation problem with fewer than k^2 targets and at most

    alpha + 1 + q + (k-1)*binomial(q,2)

source types, where q=beta-1. This is O(k^5), independent of graph order. After O(k*n^2) preprocessing, each such problem can be constructed using a number of operations depending only on k.

**Corollary C (all edges).** There is a deterministic algorithm recognizing the complement condition and computing every edge curvature in F(k)*n^2 word-RAM operations and O(k*n^2) space. One may take F(k) bounded by a polynomial in k times 5^(k^2), with unreduced rational output and O(log n)-bit arithmetic for fixed k. The dependence on n is optimal for explicit output. This is a theoretical fixed-parameter statement; its exponential dependence on k is not a claim of practical speed for large k.

## Proof of localization

Cancel maximal common mass, retaining 1/b at each C vertex. The remaining A supplies are 1/a each, C supplies are d/(ab) each, and each B target demands 1/b. Total residual mass is T=beta/b=1-c/b. Curvature equals c/b exactly when all this mass can be transported at distance one. Weighted Hall characterizes that event.

Any target subset containing x sees every source. Any singleton target sees source y, whose supply 1/a is at least 1/b. If a target subset S excluding x has at least k+1 vertices, every source sees some target of S: otherwise that source and x share k+1 neighbors in H. Consequently a deficient Hall set must have size 2<=s<=k.

At most k-1 sources can be excluded from such an S. Indeed, fix any two targets in S. Their common H neighbors include x, leaving at most k-1 additional vertices. Every excluded source has supply at most 1/a, so excluded mass E<=(k-1)/a.

Deficiency means s/b > T-E, hence

    beta < s + b*E <= s+(k-1)*b/a.

Also source y alone sees S, so deficiency requires s/b>1/a, or b/a<s. Combining gives

    beta < s+(k-1)*s = k*s <= k^2.

For r=|N_H(x) intersect N_H(y)|<=k, neighborhood bookkeeping gives d_H(x)=beta-1+r and d_H(y)=alpha-1+r. The degree bounds follow. For k=1 no deficient set is possible. This proves Theorem A.

## Constructing the bounded transport problem

Precompute H adjacency, degrees, and the lists L(u,v)=N_H(u) intersect N_H(v). Enumerate pairs in every H neighborhood, storing the witnessing center; stop upon a (k+1)st witness. There are at most k*binomial(n,2)+1 updates before termination, and O(k*n^2) storage suffices. Thus even rejected inputs need only this bounded preprocessing work after dense input construction.

For an edge not handled by Theorem A, both endpoint H degrees are bounded. Obtain A, B, and R=V\(N(x) union N(y)) from those endpoint lists. The sets A,B,C,R partition V, and |R|<=k. Hence A,B,R have bounded size.

Write Q=B\{x}, q=|Q|. Each common source u in C is described by the set M(u) of targets in Q nonadjacent to it. Its distance to a target is one outside M(u) and two inside M(u), the latter using the path through y. Sources with identical M(u) can be aggregated because their transportation cost rows agree.

There may be many common sources missing just one target or no targets. However, a common source missing at least two targets s,t lies in L(s,t). This list has at most k members, one of which is x. Therefore the number of common sources missing two or more targets is at most

    (k-1)*binomial(q,2).

Enumerate their identities from the precomputed lists and record their masks individually, combining identical masks if desired. For each target s, the total number of C sources missing s is

    d_H(s) - |N_H(s) intersect (A union B union R)|.

Subtract the already recorded multiple-miss sources to obtain the singleton mask count. The remaining C sources have empty mask. All these operations depend only on k, without scanning C.

Retain every A source individually. For a nonadjacent source-target pair u,s, their number of common G neighbors is

    n-d_H(u)-d_H(s)+|L(u,s)|.

This expression applies because us is an H edge; the corresponding formula for a G edge has an extra -2. A positive count means distance two. Otherwise the distance is three, using u,x,y,s. Adjacent pairs have distance one. Thus all transport costs are available in constant time after preprocessing.

Scale masses by ab: each A source supplies b; a common-source type containing m vertices supplies m*d; each B target demands a. Remove zero-supply types. Solve this finite transportation problem, with optimum integer cost D. The required curvature is exactly 1-D/(ab). Aggregation is exact: a plan for an aggregated row can be split among its original sources because all rows have the same costs and each original source has equal mass.

## A capacity-independent exact solver

This also makes the runtime claim constructive. Every two targets in B are at graph distance at most two, via y. An optimal Kantorovich potential on an unweighted graph can be chosen integer valued: the shortest-path Lipschitz inequalities are difference constraints with an integral constraint matrix. Normalize its value at target x to zero. On every target its value is then in {-2,-1,0,1,2}.

This integrality is established machinery; see [Kelly, Theorem 4](https://arxiv.org/html/1909.12156v2). Enumerate these 5^(beta-1) target assignments g, anchoring any one target at zero (x in the proof, the first indexed target in the implementation). For transportation costs c_ij, source supplies U_i, and target demands V_j, evaluate

    sum_i U_i * min_j(c_ij+g_j) - sum_j V_j*g_j.

For every assignment this is a feasible transportation dual value, even if the target assignment itself fails some metric constraints. At least one enumerated assignment is the restriction of an integer optimal Kantorovich potential. For that assignment the displayed value is at least the optimal potential's objective and, by dual feasibility, at most the transportation optimum. Thus the maximum enumerated value equals D exactly.

The number of types and assignments depends only on k; all masses and costs have O(log n) bits for fixed k. Recognition, construction, enumeration, and output establish Corollary C. The special k=2 classifier in `fast_curvature.py` is far more efficient in constants.

## A sharp change in the order of the triangle error

The O(1/n^2) uniform deficit for k=2 cannot extend to k=3. Label six vertices x,y,z1,z2,s1,s2. Let H have all six edges between {x,z1,z2} and {s1,s2}, together with yz1,yz2. Add n-6 isolated H vertices, equivalently universal G vertices.

The maximum H codegree is three. For edge xy, a=b=n-3, A={y,z1,z2}, B={x,s1,s2}, and c=n-6. The target pair {s1,s2} sees only y among residual sources, so Hall forces mass 1/a to travel at distance at least two. For n>=7 a universal vertex supplies a length-two path, and a plan routing one z source to x, y to one s target, and the other z source to the other s target attains the bound. Therefore

    kappa_0(x,y) = (n-7)/(n-3),
    c/b-kappa_0(x,y) = 1/(n-3), for every n>=7.

At n=6 the relevant distance is three and curvature is -2/3. This is a negative control for any calculation assuming diameter two.

Conversely, for fixed k every exceptional edge has beta<=k^2-1 and b>=n-(k^2+k-1). Every residual source-target distance is at most three, so

    0 <= c/b-kappa_0 <= 2*beta/b
       <= 2*(k^2-1)/(n-(k^2+k-1)),

when the denominator is positive. Thus the worst-case order is O(1/n) throughout each fixed-codegree class, and the family above attains that order for every k>=3. The k=2 exact theorem improves the order to O(1/n^2); k=1 has zero deficit.

## Evidence and literature status

`general_complement.py` implements both compressed min-cost flow and the capacity-independent dual enumeration. The default uses flow for practical speed; `solver='dual'` implements the stated capacity-independent enumeration. Python sets provide expected constant-time membership; deterministic word-RAM bounds use dense adjacency tables in the theoretical construction. `verify_general_complement.py` compares with the original, separately implemented full-neighborhood integer transport solver. It checks all 27,475 connected labeled graphs on two through six vertices (218,494 edges), plus seeded larger graphs and adversarial families: 219,371 edges total. A further 125,628 of those edges are checked using the bounded dual solver as well. All checks pass. An initial implementation incorrectly used the common-neighbor formula for adjacent G pairs when evaluating nonadjacent pairs; the five-vertex diameter-three negative control caught it, and the corrected formula above passes the replay.

The forbidden-complement perspective is prior work: [Chen–Liu–You, May 2026](https://arxiv.org/abs/2605.03470). A further inspected paper, [Chen–Liu–You, July 2026](https://arxiv.org/abs/2607.02297), gives a sharp extremal edge-count theorem for positive Lin–Lu–Yau curvature. Its introduction, definitions, and main theorem were checked; its entire proof has not been independently audited here. Neither the different idleness convention nor an absent search result establishes priority for our exact algorithm. The present candidate contribution is the localization, bounded source-type construction, parameterized all-edge algorithm, and the error-order boundary. The general matching and transportation dual methods are established tools, not claimed discoveries.

[Kelly, Theorem 9](https://arxiv.org/html/1909.12156v2) already reduces general zero-idleness curvature to smaller linear programs associated with components of a local core. We inspected its notation, integrality theorem and proof, and the reduced-program theorem statement. The candidate distinction here is a bound on the total transport dimension depending only on complement codegree, its construction without scanning large common neighborhoods, and the consequent quadratic all-edge bound. Reduced linear programming itself is not new. Kelly also identifies failures in older bipartite/girth-five formulas; our argument does not rely on those formulas.

No external referee has checked this extension. It strengthens the research package but does not establish a major breakthrough.
