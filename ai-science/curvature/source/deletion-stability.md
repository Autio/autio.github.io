# Sharp stability under arbitrary deletions from a complete graph

Working theorem and proof, 21 October 2026. Open-neighborhood, zero-idleness Ollivier curvature throughout. Priority is unresolved; this is an unrefereed research result, not a claim of a major breakthrough. This result has **no forbidden-complement or regularity assumption**.

## Statement

Let G be obtained from K_n, n>=3, by deleting m<=n-2 edges. For any surviving edge xy, put b=max(d_G(x),d_G(y)) and t=n-2-m. Then

    kappa_0(x,y) >= t/b >= t/(n-1).                 (1)

Equality in the first inequality holds if and only if the deletion graph H consists of two vertex-disjoint stars centered at x and y, together with isolated vertices. Either star may be empty. More strongly, outside this equality configuration,

    kappa_0(x,y) >= (t+1)/b.                       (2)

Consequently:

* Deleting at most n-3 edges preserves strictly positive curvature at every surviving edge.
* Deleting at most n-2 edges preserves nonnegative curvature at every surviving edge.
* Exactly n-2 deletions are necessary and sufficient for the **first nonpositive edge**. At this budget its curvature is zero, and the deleted edges must be two disjoint stars centered at that edge's endpoints, with every other vertex a leaf of exactly one star.
* The uniform bound t/(n-1) is sharp: delete m edges of a single star centered at x, and take y to be a vertex whose edge to x survives. Then y has degree n-1 and kappa_0(x,y)=t/(n-1).

The separate theorem in `negative-threshold.md` determines the first budget allowing **strictly negative** curvature. The present theorem does not classify all graphs beyond m=n-2.

## Proof

### Diameter and transport formula

If distinct u,v have neither an edge nor a common G neighbor, H contains uv and at least one of uw,vw for each of the n-2 other vertices. These are n-1 distinct deleted edges. Thus m<=n-2 guarantees a connected G of diameter at most two.

Orient xy so a=d_G(x)<=b=d_G(y). Use

    A=N_G(x)\N_G(y), B=N_G(y)\N_G(x), C=N_G(x) intersect N_G(y),
    alpha=|A|, beta=|B|, c=|C|, d=b-a>=0.

Then a=alpha+c, beta=alpha+d, y belongs to A and x belongs to B. Standard common-mass cancellation leaves A sources of mass 1/a, C sources of mass d/(ab), and B targets of demand 1/b. The residual total is beta/b=1-c/b.

For S subset of B, let p and q count respectively the A and C sources with no G neighbor in S, and let s=|S|. Its scaled deficiency is

    F_S = a*(s+p-beta) + d*(p+q).                  (3)

Indeed its demand is s/b and its available supply is (alpha-p)/a+(c-q)*d/(ab). Subtracting and clearing ab gives (3). The empty set and sets containing x have nonpositive deficiency. We may restrict to nonempty S subset of B\{x}. In this case y is never excluded, so p<=alpha-1 and e=p+q<=a-1.

Because all residual source-target distances are one or two, a maximum flow through distance-one pairs leaves exactly the maximum positive Hall deficiency unassigned. Every remaining pair can then be filled at cost two. Therefore

    D=max(0,max_S F_S),
    kappa_0(x,y)=c/b-D/(ab).                      (4)

For completeness, the flow assertion follows from the source-to-target capacity network: a cut indexed by the target subset S has capacity total supply minus [demand(S)-supply(N(S))]. The minimum cut thus gives the maximum feasible distance-one mass. After a maximum flow, any source with residual mass and any target with residual demand cannot be a distance-one pair, or the flow could be augmented directly. They are at distance two, so arbitrary pairing of the residuals attains (4). These are applications of classical max-flow/min-cut, not a new transport principle.

### Counting missing edges

Put r=|N_H(x) intersect N_H(y)|. The vertex partition gives

    n=alpha+beta+c+r.

There are beta-1+r deleted edges at x and alpha-1+r at y. These sets are disjoint since xy survives. Every one of the e excluded sources is joined in H to every vertex of S. These s*e deleted edges are distinct from the endpoint edges: S excludes x,y; excluded sources exclude x,y; and sources and targets are disjoint. Hence

    m >= alpha+beta+2*r-2+s*e.

Substituting m=n-2-t gives

    c >= t+r+s*e.                                (5)

Without the s*e term the same count proves c>=t.

If e=0, (3) equals a*(s-beta)<=0. If e>=1, rewrite it as

    F_S = a*(s+p-alpha)-d*(a-e)
        <= a*(s-1),                              (6)

using p<=alpha-1, d>=0, and a-e>=1. Equation (5) gives c-t>=s*e+r>=s. Thus every such subset satisfies

    F_S <= a*(c-t-1).                            (7)

If c=t, no subset with e>=1 can exist, so D=0 and (4) gives kappa_0=t/b. If c>t, its integrality gives c-t>=1, so (7), the e=0 case, and the baseline zero together give D<=a*(c-t-1). Substitution in (4) proves (2) and hence (1).

### Equality and the first zero

Let z be the number of H edges incident to neither x nor y. Directly from the endpoint counts,

    c-t=z+r.

Both z and r are nonnegative. Thus c=t holds exactly when every deleted edge is incident to x or y and no vertex is adjacent in H to both endpoints. This is precisely the pair of disjoint stars in the statement. The previous argument also shows kappa_0=t/b in this case, proving both directions of the equality characterization.

Since t>=0, (1) is strictly positive if m<=n-3. At m=n-2 the equality case is zero, while (2) makes all other cases strictly positive. There are n-2 star edges and n-2 other vertices, so disjointness forces them to cover all those vertices. This proves the threshold and its rigidity. QED.

## Independent verification

`deletion_stability_probe.py --max-n 8` enumerated **420,914** deletion sets avoiding a fixed marked edge, for all orders 3 through 8 and budgets 0 through n-2. Relabeling a general marked edge to the fixed edge loses no marked-edge type. An independent full exact integer transport solver verified (1), its equality characterization, and the first-zero characterization in every case. There were 1,092 equality cases and 126 zero cases. The output is `deletion_stability_verification.json`. These finite checks corroborate the proof; they do not establish it for arbitrary n.

The arithmetic in (6)-(7) is separately checked in `lean/DeletionStability.lean`. Actual graph edge counting and the two-step property are checked in `lean/GraphDeletion.lean`. The transport identity and assembly of these ingredients into the full theorem are **not yet formalized end to end in Lean**.

## Literature position

[Asai–Yamada, arXiv:2605.30830v2](https://arxiv.org/html/2605.30830v2) motivates the least-deletion question and analyzes matching, star, and cycle deletions. Its star result already supplies a sharp example for the threshold above. The proposed contribution here is the arbitrary-deletion lower bound and complete equality characterization, rather than the star example or the question itself.

[Chen–Liu–You, arXiv:2607.02297](https://arxiv.org/html/2607.02297) proves an extremal edge-count theorem for **Lin–Lu–Yau curvature**. Its Theorem 1.1 and definitions explicitly concern that different curvature, even though its title and abstract use broader terminology. The present threshold concerns kappa_0 and should not be advertised as improving their numerical threshold for the same invariant.

[Jost–Liu, arXiv:1103.4037](https://arxiv.org/abs/1103.4037) provides the triangle upper bound and foundational degree/triangle lower bounds. [Kelly, arXiv:1909.12156v2](https://arxiv.org/abs/1909.12156) and the matching literature supply relevant transport methodology. A broader primary-source search found no identical arbitrary-deletion zero-idleness theorem, but a failed search is not proof of novelty. Author feedback and further bibliographic checking are still needed.
