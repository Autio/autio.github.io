# Exact zero-idleness curvature for complements without K₂,₃

Working research manuscript, 21 October 2026. This replaces the small deletion-budget classification as the main research direction. The arguments below are analytic; computer enumeration is corroboration. Novelty remains a literature-review judgment, not an established fact. No human referee has reviewed this manuscript.

## Abstract

Let \(G\) be a finite connected simple graph whose complement contains no \(K_{2,3}\) as a subgraph. We derive an exact formula for zero-idleness Ollivier curvature. Its deficit from the triangle-count upper bound is either \(0\), \(1/(d_xd_y)\), or \(2/(d_xd_y)\). A nonzero deficit occurs precisely at a specified five-vertex configuration with endpoint degrees differing by one; the larger correction occurs exactly when a specified vertex is a leaf. Consequences include a sharp order-eight threshold for nonnegative curvature, exact triangle-bound equality for complements of forests, and an algorithm computing every edge curvature in quadratic time. The earlier four-/five-deletion statements follow directly, without computer-assisted classification.

## 1. Definitions and theorem

Use open-neighborhood, zero-idleness measures: \(\mu_x\) assigns mass \(1/d_x\) to each neighbor of \(x\), and zero elsewhere. On an edge,

\[
 \kappa_0(x,y)=1-W_1(\mu_x,\mu_y).
\]

Let \(H=\overline G\). The forbidden-subgraph condition is **non-induced**: equivalently,

\[
 |N_H(u)\cap N_H(v)|\le2\quad\text{for every distinct }u,v.
 \tag{1}
\]

Orient an edge so that \(a=d_x\le b=d_y\). Set

\[
 A=N_G(x)\setminus N_G(y),\quad
 B=N_G(y)\setminus N_G(x),\quad C=N_G(x)\cap N_G(y),
\]

and write \(c=|C|\), \(\alpha=|A|\), \(\beta=|B|\), \(d=b-a\). Thus \(y\in A\), \(x\in B\), \(\beta=\alpha+d\), and \(a=\alpha+c\).

**Theorem 1 (exact defect).** Suppose (1) holds. Unless all of the following conditions hold, \(\kappa_0(x,y)=c/b\):

* \(b=a+1\);
* \(A=\{y,z\}\) and \(B=\{x,s_1,s_2\}\);
* neither \(zs_1\) nor \(zs_2\) is an edge of \(G\).

When these conditions hold, define \(\varepsilon=2\) if \(d_G(z)=1\), and \(\varepsilon=1\) otherwise. Then

\[
 \boxed{\kappa_0(x,y)=\frac cb-\frac{\varepsilon}{ab}.} \tag{2}
\]

There is no assumption on the diameter, maximum degree, or number of deleted edges.

## 2. Transport reduction

An optimal transport plan can retain mass \(1/b\) at each vertex of \(C\). This is the standard common-mass cancellation lemma, following from the triangle inequality. Its established form appears, for example, in [Hehl, Lemma 2.5](https://link.springer.com/article/10.1007/s00208-026-03327-6).

After cancellation, the sources are the vertices of \(A\), each supplying \(1/a\), and vertices of \(C\), each supplying \(d/(ab)\). The targets are vertices of \(B\), each demanding \(1/b\). Total residual mass is

\[
 T=1-\frac cb=\frac\beta b.
\]

Its cost is at least \(T\). Equality occurs if and only if these supplies and demands admit a plan using only edges of \(G\). Weighted Hall's theorem gives the precise condition: every target subset must have at least its demand available among adjacent sources. This equivalence needs no diameter hypothesis.

Subsets containing \(x\) are harmless because every source lies in \(N_G(x)\). A singleton target is harmless because source \(y\) is adjacent to every vertex of \(B\), and its supply \(1/a\) is at least the target demand \(1/b\).

If \(S\subseteq B\setminus\{x\}\) has at least three vertices, every residual source is adjacent to at least one vertex of \(S\). Otherwise that source and \(x\), together with three vertices of \(S\), form a \(K_{2,3}\) in \(H\). Hence such a subset sees all residual supply \(T\), enough for its demand.

It remains to examine two-target subsets.

## 3. The only Hall obstruction

Fix \(S\subseteq B\setminus\{x\}\) with \(|S|=2\). Both targets have \(x\) as a common neighbor in \(H\). By (1), at most one other residual source can fail to be adjacent in \(G\) to both targets.

If no source is excluded, the Hall condition holds. If the excluded source is common, its supply is \(d/(ab)\). Since \(c\ge1\), we have \(a\ge2\); also \(\beta\ge3\), \(\alpha\ge1\), and \(d\le\beta-1\). The possible deficit, multiplied by \(ab\), is

\[
 d-(\beta-2)a\le\beta-1-2(\beta-2)=3-\beta\le0.
\]

If the excluded source \(z\) lies in \(A\), then \(z\ne y\), so \(\alpha\ge2\) and \(a\ge\alpha\ge2\). The possible deficit, multiplied by \(ab\), is

\[
 b-(\beta-2)a=d-(\beta-3)a. \tag{3}
\]

For \(\beta\ge4\), this is at most

\[
 (\beta-2)-2(\beta-3)=4-\beta\le0.
\]

For \(\beta=3\), expression (3) is \(d\). Since \(\alpha\ge2\), the only positive possibility is \(\alpha=2,d=1\), giving deficit \(1/(ab)\). Then \(S=B\setminus\{x\}\), and the configuration is exactly that stated in Theorem 1.

If this configuration does not occur, every weighted Hall condition holds and \(W_1=T\). This proves the equality part of the theorem.

## 4. Exact cost in the exceptional case

Now \(a=c+2\), \(b=a+1\), and the sources are \(z,y\), each supplying \(1/a\), plus \(c\) common sources, each supplying \(1/(ab)\). Every common source is adjacent to at least one of \(s_1,s_2\), since \(x,z\) already exhaust their possible common neighbors in \(H\).

Put

\[
 \rho=\min\{d_G(z,s_1),d_G(z,s_2)\}.
\]

Both distances are at least two, and the path \(z,x,y,s_i\) shows \(\rho\le3\).

**Upper bound.** Retain the common mass. Send \(1/b\) from \(z\) to \(x\), and the remaining \(1/(ab)\) from \(z\) to a closest target \(s_i\), at cost \(\rho\). Send each residual common source to an adjacent target. Even if all common residual mass goes to one target, it totals only \((a-2)/(ab)\), less than either remaining target demand, whose minimum is \((a-1)/(ab)\). Thus source \(y\), adjacent to both targets, fills exactly the remaining demands. This is a feasible plan of cost

\[
 T+\frac{\rho-1}{ab}.
\]

**Lower bound.** In any plan after maximal common-mass cancellation, sources other than \(z\) supply less than the total demand of \(\{s_1,s_2\}\) by \(1/(ab)\). At least that much mass must travel from \(z\) to this target pair, costing at least \(\rho\). All other residual mass costs at least one. Therefore no plan costs less than the displayed value.

Finally, \(\rho=3\) if and only if \(z\) is a leaf. The forward implication is the only nontrivial one. If \(z\) has a neighbor \(v\ne x\), then \(v\notin\{y,s_1,s_2\}\). If \(v\in C\), it is adjacent to at least one target, giving a two-step path. Otherwise \(v\notin N_G(x)\cup N_G(y)\). Again \(v\) is adjacent to at least one target, because their common neighbors in \(H\) are already \(x,z\). This also gives a two-step path. Conversely, when \(z\) is a leaf with neighbor \(x\), and \(x\) is adjacent to neither target, both target distances are three. This completes the proof of Theorem 1. ∎

## 5. Consequences

**Corollary 2 (sharp nonnegative threshold).** If (1) holds and \(n\ge8\), then every edge has nonnegative zero-idleness curvature. The threshold eight cannot be lowered.

For an exceptional edge, let \(r=|N_H(x)\cap N_H(y)|\le2\). The neighborhood conditions imply

\[
 d_H(y)=r+1\le3,\qquad d_H(x)=r+2\le4.
\]

Therefore \(a\ge n-5\ge3\), \(c=a-2\), and

\[
 \kappa_0(x,y)=\frac{a(a-2)-\varepsilon}{a(a+1)}>0.
\]

Every non-exceptional edge has curvature \(c/b\ge0\).

For sharpness, take seven vertices \(x,y,z,s_1,s_2,r_1,r_2\). Let the deletion graph consist of the cycles \(x,s_1,z,s_2,x\) and \(x,r_1,y,r_2,x\), together with edge \(yz\). Directly from these neighborhoods, every pair has at most two common neighbors in \(H\). In \(G\), edge \(xy\) has \(a=2,b=3,c=0\), and \(z\) is not a leaf, so \(\kappa_0(x,y)=-1/6\). ∎

Strict positivity cannot replace nonnegativity at any universal order threshold. For arbitrarily large \(n\), delete two disjoint stars with centers \(x,y\), partitioning the other vertices into their nonempty leaf sets. The surviving edge \(xy\) has no common neighbor, and its curvature is zero by the next corollary.

**Corollary 3 (forest and four-cycle-free deletions).** If \(H\) contains no four-cycle, then every edge has \(\kappa_0=c/b\). In particular this holds for every deleted forest, regardless of its size or maximum degree. The exceptional configuration would contain the four-cycle \(x,s_1,z,s_2,x\) in \(H\).

**Corollary 4 (earlier finite results, now analytic).** If \(\Delta(H)\le2\), or if \(|E(H)|\le4\), every edge satisfies equality. The exceptional configuration requires three deleted incidences at \(z\) and five distinct deleted edges. If exactly five edges are deleted, any exception forces precisely a four-cycle with a pendant edge, plus isolated vertices. Its unique exceptional surviving edge joins the pendant vertex to the opposite cycle vertex. At \(n=5\) the deficit is \(2/(ab)\); at every \(n\ge6\) it is \(1/(ab)\).

**Corollary 5 (uniform second-order error).** Throughout this entire graph class, for \(n\ge8\),

\[
 0\le\frac cb-\kappa_0(x,y)\le\frac{2}{(n-5)(n-4)}.
\]

Unlike the earlier fixed-deletion-pattern limit, this bound allows the deletion graph itself to change with \(n\).

## 6. Quadratic algorithm for all edges

**Theorem 6.** Given a simple graph on \(n\) indexed vertices, the complement condition can be recognized and, when it holds, every edge curvature can be output in \(O(n^2)\) word-RAM operations using \(O(n^2)\) memory. Output each rational as an unreduced numerator/denominator pair. This is worst-case optimal for explicitly listing all edge values.

Build the complement adjacency table and its neighbor lists. For each vertex \(v\) of \(H\), enumerate unordered pairs in \(N_H(v)\), incrementing their common-neighbor counts. Stop and reject upon a third increment for any pair. Before rejection, or throughout a successful run, there are at most \(2\binom n2+1\) increments. Thus recognition, including construction of the complement, costs \(O(n^2)\).

For each surviving edge \(xy\), obtain \(r\) from that table and calculate

\[
 c=n-2-d_H(x)-d_H(y)+r.
\]

An exceptional edge must have complement degrees at most four and three. Its neighborhood differences and the two required deleted incidences can therefore be checked in constant time. A degree lookup at \(z\) determines \(\varepsilon\). Return

\[
 (ca-\varepsilon,ab),
\]

using \(\varepsilon=0\) when non-exceptional. There are at most \(\binom n2\) edge outputs. Complete graphs belong to the class and have quadratically many outputs, establishing the explicit-output lower bound. ∎

`fast_curvature.py` implements this algorithm with indexed tables and neighbor sets; the theoretical deterministic bound assumes constant-time adjacency access. It does not solve a transport LP.

## 7. Relation to existing work and status

[Chen–Liu–You, arXiv:2605.03470](https://arxiv.org/abs/2605.03470), already establish a forbidden-complement framework for **Lin–Lu–Yau** curvature. Our target is an exact formula at **zero idleness**, including all exceptional edges and an output-optimal algorithm. The distinction is essential; these results should be presented as an adjacent contribution, not as introducing that framework or improving their threshold for the same quantity.

The accompanying `literature-review.md` records the inspected results, convention mismatches, and unresolved priority checks. The current assessment is a plausible short-paper contribution if the exact classification is new. It is not a major mathematical breakthrough. The earlier deletion-budget statements alone would be too small to justify that description.

`verify_structural_theorem.py` compares the theorem and the fast algorithm with full exact min-cost transport on all 21,199 connected labelled admissible graphs of orders two through six: 179,074 edges. It also checks 1,243 seeded larger random edges and 52 family cases. All pass. These computations corroborate the analytic proof; they do not replace independent mathematical review.
