# Sharp localization and quantized asymptotic error

Working manuscript extension, 21 October 2026. These are candidate new results, with handwritten proofs, partial Lean formalization, and exact numerical corroboration. Their priority has not been established. The graph convention is the zero-idleness, open-neighborhood convention in `structural-theorem.md`.

## 1. Sharp localization

Let G be connected, let H be its complement, and suppose every distinct pair of H vertices has at most k common H neighbors. Orient a marked G edge xy so that a=d_G(x)<=b=d_G(y). Write

    A=N_G(x)\N_G(y), B=N_G(y)\N_G(x), C=N_G(x) intersect N_G(y),
    alpha=|A|, beta=|B|, c=|C|, d=b-a.

Thus a=alpha+c, b=a+d, beta=alpha+d, y belongs to A, and x belongs to B.

**Theorem 1.** For k>=2, failure of triangle-bound equality implies

    beta <= k^2-k+1,
    d_H(x), d_H(y) <= k^2.

The beta bound is sharp for every k>=2. For k=1 equality holds at every edge.

### Proof

After common-mass cancellation, each A source supplies 1/a, each C source supplies d/(ab), and each B target demands 1/b. Equality means feasibility using distance-one transfers. A deficient weighted Hall set S cannot contain x, cannot be a singleton, and cannot have more than k vertices. Put s=|S|, and let p,q be the numbers of A,C sources, respectively, adjacent in G to no member of S. Then

    2<=s<=k, p+q<=k-1, p+1<=alpha, q<=c,
    F=(s+p-beta)*a+d*(p+q)>0.                         (1)

The bound p+q<=k-1 follows by taking two targets of S: their common H neighbors already include x. The bound p+1<=alpha uses the source y, which sees every target.

If s<=k-1, the previous localization argument gives beta<k*s<=k*(k-1), a stronger bound than required. Explicitly, excluded mass E<=(k-1)/a and source y's available supply imply beta<s+(k-1)b/a and b/a<s.

Suppose s=k. We must have p<=1. Otherwise two excluded exclusive sources share all k targets and y as H neighbors, contradicting the codegree bound.

If beta<k+p, the conclusion is immediate. Otherwise define

    u=alpha-p>=1, e=p+q<=k-1.

Since a>=alpha+q and beta>=k+p, expression (1) satisfies

    F <= (k+p-beta)*(alpha+q)+(beta-alpha)*(p+q)
       = e*k-u*(beta+q-k)
       <= (e+1)*k-beta-q.

Here beta+q-k>=0, which justifies replacing u by one. Finally,

    k^2-k+2-[(e+1)*k-q]
      = (k-1-p-q)*(k-1)+(1-p) >=0.

Consequently 0<F<=k^2-k+2-beta, so beta<=k^2-k+1. For r=|N_H(x) intersect N_H(y)|<=k, the identity d_H(x)=beta-1+r gives d_H(x)<=k^2. The other endpoint has no larger H degree. The k=1 case has no possible deficient set. ∎

The numerical maximal-subset argument is checked in `lean/SharpLocalization.lean`. The actual G-neighborhood exclusion statements, including the two-exclusive-source restriction, are checked in `lean/GraphHall.lean`. The complete curvature-to-Hall equivalence is still supplied by the handwritten proof and standard finite transport theory, not an end-to-end Lean development.

### Sharp family

Use vertices x,y,z, a set W of k-2 vertices, a set S of k vertices, and a set T of k(k-2) vertices. In H place exactly the following edges:

    x--(S union T), z--(S union {y}), W--S.

The order is k^2+1. Every pair has at most k common H neighbors: pairs of targets in S have common neighbors {x,z} union W, and pairs among {x,z} union W have S as their largest common-neighbor set; the other pairs satisfy smaller bounds directly.

At xy in G,

    a=k, b=k^2-1, c=k-2, alpha=2, beta=k^2-k+1.

The S Hall set excludes z and W. Its scaled deficit is exactly one. For k>=3 every missing source-target transfer has distance at most two: a T vertex gives z a two-step path to S, while each W vertex reaches every S target through y. A proper subset of S has smaller demand with the same excluded sources, so its scaled deficit decreases by a for each removed target. A target subset containing a T vertex, or x, sees every source. Thus no Hall set has larger deficit. The exact diameter-two deficit formula gives

    kappa_0(x,y) = (k-2)/(k^2-1) - 1/[k*(k^2-1)], k>=3.

For k=2, W,T are empty and the distance-three correction gives kappa_0=-1/3. All cases fail equality and attain the beta bound. Adding a new T vertex increases beta by one and eliminates the deficit; this tests the sharp boundary.

`sharp_localization_probe.py` verifies k=2,...,10 by full exact transport and checks 27 cases immediately beyond the sharp boundary.

## 2. Quantized first-order error

Fix a finite deletion graph H containing the marked endpoints, with xy absent in H. Form H_n by adjoining isolated vertices and let G_n be its complement. At least one added isolated H vertex makes G_n connected with diameter at most two. The sets A,B and the degree difference d are fixed; C grows by universal G vertices.

For each nonempty S subset of B, let p_S,q_S be the numbers of excluded A,C sources. They are fixed under this padding, since a universal vertex sees every member of a nonempty S. Define

    L_S=|S|+p_S-beta, K_S=d*(p_S+q_S).

The exact diameter-two weighted Hall formula is

    Delta_n = c/b-kappa_0(x,y)
            = max_S [a*L_S+K_S]/(ab).               (2)

The set S=B gives L=K=0, so the maximum is nonnegative. Let (ell,m) be the lexicographically largest pair (L_S,K_S).

**Theorem 2.** Eventually the exact error is

    Delta_n = (ell*a+m)/(ab),
    ell = alpha-M,

where M is the maximum cardinality of a G matching between A and B. If H has maximum codegree at most k>=2, then

    ell belongs to {0,1,...,k-2},
    lim n*Delta_n = ell.

Every value in this set is attained within the class. Thus the sharp upper bound on the leading coefficient is k-2. For k=1 the deficit is identically zero.

### Proof

There are finitely many affine forms in (2), and a grows without bound. Their eventual maximum is their lexicographically largest slope/intercept pair. Since

    L_S=|S|-|N_A(S)|-d,

the standard maximum-matching deficiency formula gives max L_S=beta-M-d=alpha-M. This matching identity and the weighted Hall formula are established machinery, not claimed innovations.

It remains to bound the positive slopes. Any positive L_S has x outside S and |S|+1<=beta. Thus L_S<=p_S-1, so p_S>=2. Two excluded exclusive sources share all S vertices and y as H neighbors, giving |S|+1<=k. Also beta>=alpha>=p_S+1, and therefore

    L_S=|S|+p_S-beta <= |S|-1 <= k-2.

The actual finite-graph slope inequality, not just a conditional arithmetic version, is kernel-checked as `leading_hall_slope_bound` in `lean/GraphHall.lean`. Since a/n and b/n tend to one, the limit follows from (2).

For sharpness choose any r with 3<=r<=k. Let H be K_{r,r} with one cross edge xy removed, and pad with isolated H vertices. Equivalently, the unpadded G consists of two r-cliques joined by edge xy. For n>=2r+1,

    a=b=n-r, c=n-2r,
    Delta_n=(r-2)/(n-r),
    kappa_0(x,y)=(n-3r+2)/(n-r).

Indeed the exclusive source and target sets have r vertices each. Source y sees every target and target x sees every source; the other r-1 sources have no edges to the other r-1 targets. A maximum matching has size two; all remaining transfers have distance two through a universal vertex. The maximum H codegree is r. Vary r to realize ell=1,...,k-2; complete graphs realize zero. ∎

**Further consequence.** When m>0 or ell>0, a maximizing set has size between two and k and excludes at most k-1 sources. Thus m is a nonnegative multiple of d and m<=d*(k-1). If ell=0 and m>0, then beta=s+p<=2k-1 and d<=s-1<=k-1, giving m<=(k-1)^2. These bounds describe the eventual second-order coefficient; they do not classify every transient finite graph.

`quantized_defect.py` verifies the affine forms, the independent cardinality-matching calculation, stabilization, and sharp families against 999 exact full transport calculations.

### Sharpness of the second-order bound

The bound m<=(k-1)^2 when ell=0 is sharp for every k>=2. In the sharp family of Section 1, omit T, retaining x,y,z,W,S. Pad its 2k+1 vertices with at least one isolated H vertex. Here alpha=2, beta=k+1, d=k-1. The set S has s=k, p=1, q=k-2, so L=0 and K=(k-1)^2. Proper subsets of S have smaller slope, and a set containing x sees every source. Thus ell=0 and m=(k-1)^2, with exact error m/(ab) after padding. This is a statement about the asymptotic intercept m, not the number of deleted edges.

## 3. Sharp finite-order cutoff for transient obstructions

Call a deficient Hall set genuinely transient if L=s+p-beta<0. Such a witness becomes harmless when enough universal G vertices are added.

**Theorem 3.** For k>=2, any graph with a genuinely transient witness has

    n <= k^2+k+1.

Consequently, at n>=k^2+k+2, every deficient Hall set has nonnegative slope. Any edge failing triangle-bound equality then has

    beta <= max(k+1,2k-2).

For k>=3 this is beta<=2k-2, and both complement endpoint degrees are at most 3k-3. Both the order cutoff and the beta bound are sharp for every k>=3.

### Proof

Write e=p+q, u=a-e>=1, and h=beta-s-p>=1. The deficiency numerator can be rewritten as

    F=e*(s+p-alpha)-h*u>0.

Since alpha>=p+1 and all quantities are integers,

    h*u <= e*(s-1)-1.

The inequality (u-1)*(h-1)>=0 gives u+h<=h*u+1<=e*(s-1). Using beta=s+p+h and a=u+e, we obtain

    a+beta <= (e+1)*s+p.

If p<=1, the bounds e<=k-1 and s<=k give a+beta<=k^2+1. If p>=2, the two-excluded-exclusive-source restriction gives s<=k-1 and p<=k-1, yielding a+beta<=k^2-1. Finally n=a+beta+r and r<=k prove the order bound. This conditional integer argument is checked as `negative_slope_order_bound` in `lean/SharpLocalization.lean`.

Above the cutoff, choose a deficient S with L>=0, so beta<=s+p. If p<=1, this gives beta<=k+1. If p>=2, use s<=k-1 and p<=k-1 to get beta<=2k-2. The endpoint bound follows from d_H(x)=beta-1+r and r<=k.

For sharpness of the order cutoff, take the Section 1 sharp family and adjoin k vertices, each adjacent in H only to x and y. These vertices change neither a,b,c nor its Hall numerator. The complement codegree is still at most k: x,y share the k new vertices, while every other pair has the same or smaller common-neighbor bound. At n=k^2+k+1 the witness has

    L=k+1-(k^2-k+1)=2k-k^2<0, F=1, k>=3,

and beta=k^2-k+1>2k-2. Thus the order cutoff cannot be lowered.

For sharpness of the persistent beta and endpoint-degree bounds, use disjoint sets Z,S of size k-1, T of size k-2, and R of size k, together with x,y. In H place x--(S union T), Z--S, y--Z, and connect every R vertex only to x and y. Pad with isolated H vertices to any desired large order. The maximum H codegree is k, alpha=k, beta=2k-2, and d=k-2. The S witness has L=0, K=(k-2)*(k-1)>0, and the complement degree at x is 3k-3. No other witness has larger numerator: subsets of S have the same excluded Z and smaller demand; sets containing T or x see all sources. The exact gap is K/(ab).

`stabilization_families.py` verifies the maximal intercept families for k=2,...,10 and both finite-order sharpness families for k=3,...,10, using 34 full exact transport calculations and additional compressed min-cut comparisons.

## 4. Literature and scope

[Chen–Liu–You, arXiv:2605.03470](https://arxiv.org/abs/2605.03470) supplies the closest forbidden-complement framework for Lin–Lu–Yau curvature. In particular their Section 5 uses restrictions on common non-neighbors; this must be credited rather than presented as a new general technique. The present targets are zero-idleness equality defects and exact all-edge computation.

[Kelly, arXiv:1909.12156v2](https://arxiv.org/abs/1909.12156) establishes reduced linear programs and integer dual potentials. [Bhattacharya–Mukherjee, arXiv:1306.6741v3](https://arxiv.org/abs/1306.6741) establishes matching-based curvature results, including equal-degree equality criteria. Theorems here do not claim the matching-deficiency theorem or general LP reduction as novel.

The candidate package now consists of sharp localization, bounded source-type construction and all-edge algorithm, the exact codegree-two classification, and the optimal codegree-dependent asymptotic coefficient range. No priority claim, independent referee endorsement, or major breakthrough is established.
