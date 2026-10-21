# The next threshold: strictly negative zero-idleness curvature

Working theorem and proof, 21 October 2026. The proof below covers arbitrary connected graphs, including the distance-three case. The numerical core of that additional argument is checked in Lean. The transport duality and full graph theorem are not formalized end to end. Novelty is unresolved; no independent human referee has reviewed the proof.

## Sharp extremal threshold

**Theorem.** For n>=5, the minimum number of edges deleted from K_n, leaving a connected graph with some edge of strictly negative zero-idleness curvature, is

    M(n)=n+floor(n/2)-2.

This is a different question from the first **nonpositive** edge, whose threshold n-2 is proved in `deletion-stability.md`. It is also different from the LLY edge-count threshold in [Chen–Liu–You](https://arxiv.org/html/2607.02297).

Equivalently, the maximum number of edges in an n-vertex connected graph having a negative kappa_0 edge is (n^2-3n)/2-floor(n/2)+2. This matches the numerical value of the LLY nonpositive extremal threshold for even n, and exceeds it by one for odd n, while the curvature and the strictness of the sign condition differ. This close relationship warrants particular care in the priority review.

## Sharp upper construction

Use vertices x,y,z, a set S of size s=floor(n/2), and a set T of size n-3-s. In the deletion graph H place exactly

    x--(S union T), y--z, z--S.

There are n-2+s=M(n) deleted edges. In G, x has neighbors y,z; y has neighbors x,S,T; and the marked edge xy has a=2, b=n-2, c=0.

**Attribution of the construction:** this deleted-edge pattern is already used by [Chen–Liu–You, Section 4, Figure 1](https://arxiv.org/html/2607.02297), with |S|=ceil(n/2), for their LLY extremal theorem. For even n our graph is exactly that known graph after exchanging endpoint names; it is not claimed as a new construction. For odd n we use floor(n/2) instead, one fewer deleted z--S edge and one additional T vertex at the same order. The candidate contribution is the zero-idleness sharp lower bound and its parity-dependent boundary, rather than invention of the even-order witness graph.

A direct certificate already proves negativity at every n>=5: set f(z)=1, f(S)=-1, and f=0 on x,y,T. Every surviving edge has potential difference at most one. Its transport dual objective is 1/2+s/(n-2)>1, because 2*floor(n/2)>n-2. Thus no exact-curvature calculation is needed to establish the upper construction; the exact values below give additional information.

For n>=7, T is nonempty and G has diameter at most two. The only positive Hall defect is supplied by S. Its scaled numerator is

    F=2*s-n+2,

which is 2 for even n and 1 for odd n. Thus

    kappa_0(x,y)=-1/(n-2)           for even n>=8,
    kappa_0(x,y)=-1/[2*(n-2)]       for odd n>=7.

For n=5,6 the source z is a leaf and the relevant transfers have distance three, giving kappa_0=-1/3 and -1/2 respectively. The graph is connected in every case.

### A second extremal family: even-order nonuniqueness

For every even n>=8 there is another extremal graph, with a universal endpoint. Use x,y,z and a set S of size n/2+1, plus a set T of size n/2-4. Delete all x--(S union T) edges and all z--S edges. There are (n-3)+(n/2+1)=M(n) deletions. Vertex y is universal; at xy we have a=2, b=n-1, c=1.

The S Hall set excludes the common source z, so its scaled deficiency is

    F=2*[n/2+1-(n-2)]+(n-3)=3.

Proper subsets of S have smaller deficiency, and sets containing x or T see all sources. Thus the exact curvature is 1/(n-1)-3/[2(n-1)]=-1/[2(n-1)]. This graph has a universal vertex, whereas the preceding sharp family has none. Hence the zero-idleness negative-threshold extremal graph is **not unique for any even n>=8**. This differs from the unique even-order n>=12 LLY extremal graph in Chen–Liu–You. We do not claim a complete extremal classification or established priority for this second family.

## Proved lower bound when the diameter is at most two

**Theorem.** If G has diameter at most two and a negative-curvature edge, its complement has at least M(n) edges.

Use the notation of `deletion-stability.md`. By the exact diameter-two formula, a negative-curvature edge has a target set S with

    a*(s+p-beta)+d*(p+q)>a*c.

Put e=p+q, u=a-e, and v=s+p-a. We have

    e>=1, u>=1, v>=1, q>=0,
    c<=u+q-1,
    s=u+q+v,
    d*u<(u+e)*v,
    d>=v+q+c+1-e.                                (1)

The last inequality uses s<=beta-1 and beta=a-c+d; c<=u+q-1 uses p<=alpha-1. Write

    L=s*e-c, D=2*s*e-c-2*a+1.

We claim d<=D. Since all variables are integers, (1) gives d*u<=(u+e)*v-1. It therefore suffices to prove

    u*D-(u+e)*v >= -1.                           (2)

Expanding the left side gives

    [(2e-1)u-e]*v + u*[2e(u+q-1)-c-2u+1].        (3)

If e>=2, the coefficient of v is nonnegative. Using v>=1 and c<=u+q-1, expression (3) is at least

    [(2e-1)u-e] + u*[(2e-3)u+(2e-1)q-2e+2].

For u=1 this is e-2+(2e-1)q>=0. For u>=2, the second bracket is at least 2e-4>=0 and the first bracket is nonnegative. Thus (2) holds.

If e=1, combining d>=v+q+c with d*u<(u+1)*v gives v>=u(c+q)+1. Expression (3) now equals

    (u-1)*v+u*(2q-c-1).

For u=1, c<=q makes this at least q-1>=-1. For u>=2, substitute the lower bound on v to obtain

    u*c*(u-2)+u*q*(u+1)-1 >= -1.

This proves (2), and hence d<=D. This numerical implication is kernel-checked as `hall_negative_budget` in `lean/NegativeThreshold.lean`. Therefore

    2a-c+d <= 2L+1.

For r=|N_H(x) intersect N_H(y)|, n=2a-c+d+r<=2(L+r)+1. It follows that floor(n/2)<=L+r. The missing-edge rectangle count gives

    m >= n-2+s*e-c+r = n-2+L+r >= M(n),

as required. QED.

## Completing the lower bound without a diameter assumption

The preceding counting argument in fact proves: **any adjacency-based Hall numerator F>a*c forces m>=M(n)**. Diameter at most two was needed only to infer that such a numerator exists. We now handle the remaining possibility with integer optimal transport potentials.

For a negative-curvature edge xy, choose an integer-valued optimal 1-Lipschitz potential f and shift it so f(x)=0. Existence of an integer optimum on an unweighted finite graph is established transport machinery; see [Kelly, Theorem 4](https://arxiv.org/html/1909.12156v2). Its objective is

    average_{N(x)} f - average_{N(y)} f > 1.       (4)

Since xy is an edge, f(y) is -1, 0, or 1. If f(y)=1, all source values are at most 1 and all target values are at least 0, contradicting (4).

If f(y)=0, all source and target values lie in [-1,1]. The same potential is a feasible bipartite transport dual for the modified metric min(distance,2): every source-target value difference is at most two and at most its original distance. Thus this modified transport still has cost greater than one. Common-mass cancellation and max-flow/min-cut for its one-/two-cost residual transport produce F>a*c. The preceding Hall counting argument applies, giving the desired deletion bound. The same reasoning works whenever the entire source-target value range has width at most two, whether or not f(y)=0.

It remains to treat f(y)=-1 with values of both 1 and -2 present. Clip f globally to [-2,1]; this preserves its edgewise Lipschitz property and leaves its values on N(x) and N(y) unchanged. Partition all vertices into the four integer levels

    P={f=1}, L={f=-1}, Z={f=0}, Q={f=-2},
    p=|P|, l=|L|, z=|Z|, q=|Q|.

We have p,q,l,z>=1, x in Z, y in L, and n=p+q+l+z. Every pair between P,Q, between P,L, and between Q,Z is a deleted edge. The three rectangles are disjoint, so

    m >= p*q+p*l+q*z.                            (5)

If p,q>=2, the right side is at least 2n-4, since its difference from 2n-4 is

    (p-2)*(q-2)+(p-2)*l+(q-2)*z >=0.

For n>=5, 2n-4>=M(n), proving the claim in this case.

Otherwise one of p,q equals one. Swapping x,y and replacing f by -1-f exchanges P,Q and L,Z while preserving (4). Thus assume p=1. This four-level argument does not require the degree orientation used in the separate Hall case.

For the purpose of a lower bound on deletions, add all missing allowed edges from x to P and from y to Q. They have potential difference one, so f remains 1-Lipschitz. Adding a neighbor of value 1 can only increase the source average, and adding a neighbor of value -2 can only decrease the target average. Thus (4) is preserved. The new graph has no more deletions; it suffices to bound its deletion count, also called m below.

Let k be the number of x-neighbors in L other than y; h the number of its neighbors in Z other than x. Let r be the number of y-neighbors in Z other than x; w the number of its neighbors in L other than y. The endpoint averages are exactly

    average_{N(x)} f = -k/(k+h+2),
    average_{N(y)} f = -(2q+w)/(q+r+w+1).

Equation (4), after multiplying positive denominators, becomes

    (h+2)*(q-r-1) > k*(2r+w+2).

It follows that q>=2 and, using h<=z-1,

    2*k < (z+1)*(q-1).                           (6)

Put Q0=q-1>=1 and E=m-n+2. Equation (5), now with p=1, gives E>=1+z*Q0. In addition, the l-1-k omitted edges from x to L\{y} are distinct from all rectangles counted in (5), giving

    E >= l+z*Q0-k.                               (7)

The integer inequalities (6)-(7) imply

    2E >= 2l+(z-1)*Q0+1.

If 2E<=n-2=l+z+Q0, combining this with E>=1+z*Q0 gives simultaneously

    l >= 2+2z*Q0-z-Q0,
    l <= z+(2-z)*Q0-1.

The lower bound exceeds the upper by

    1+(z-1)*(3Q0-2) >=1,

a contradiction. Hence 2E>=n-1, so the integrality of E gives E>=floor(n/2). Therefore m>=n+floor(n/2)-2. This completes the unrestricted lower bound and the theorem. QED.

The numerical conclusion from (6)-(7) is kernel-checked as `four_level_budget`, and the cleared-denominator profit implication (6) as `four_level_profit_reduction`, in `lean/NegativeThreshold.lean`. The four-level graph partition, endpoint augmentation, and integer-dual existence remain in the written proof, rather than a full Lean formalization. Equality cases for this negative threshold are not classified here.

## Verification and limits

The authorized RTX 5090 exhaustive dual scans found first-negative budgets 5, 7, and 8 at n=5,6,7 respectively. At n=8 the scan evaluated all **8,191,258** connected marked graphs with at most nine deletions and found none negative; the construction above gives a negative edge with ten deletions. These computations corroborate the theorem only at those orders. Saved samples are independently replayed with full exact CPU transport; the GPU uses an exhaustive bounded integer dual, not a learned prediction.

`negative_threshold_probe.py` additionally checked the sharp construction for every n=5,...,40 and seeded ordinary and endpoint-concentrated deletions below the threshold for n=5,...,25. With the additional 17 universal-endpoint sharp examples, all **2,153** full exact transport checks passed. These finite tests do not replace the proof or independent review. See `negative_threshold_verification.json` and the GPU JSON files.
