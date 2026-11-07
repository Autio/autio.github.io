# The minimum two-component failure is unique up to relabelling

7 November 2026. This is a direct proof and an independent computational check within the finite class stated below. It is not an external peer review or an established novelty claim.

## Statement

Let two finite nonempty component sets be \(A,B\), with mechanisms

\[
F(a,b)=(f(b),g(a)),\qquad f:B\to A,\quad g:A\to B.
\]

Thus there is no self-dependence in either mechanism. Let the componentwise surjections \(q_A:A\twoheadrightarrow U\), \(q_B:B\twoheadrightarrow V\) satisfy

\[
q_Af=\bar f q_B,\qquad q_Bg=\bar g q_A.
\]

Assume every fine coordinate-clamp intervention has exactly one solution, but the corresponding coarse model fails to have the same interventional solution semantics.

The smallest possible fine product has nine states, with \(|A|=|B|=3\) and \(|U|=|V|=2\). At these sizes there is exactly one counterexample up to independent relabelling of the two fine coordinate sets and the induced coarse sets. It is

\[
f(b)=b,\qquad g(a)=s(a),\qquad s=(0,2,1),
\]

with

\[
q_A=q_B=(0,1,1).
\]

The fine system has the unique equilibrium \((0,0)\). The coarse system is \((u,v)\mapsto(v,u)\), with equilibria \((0,0)\) and \((1,1)\). The latter has no fine equilibrium lift.

## Why failure requires two partial quotients

For two components with no self-dependence, any nonempty intervention is uniquely solvable at both levels: clamping one component determines the other, and clamping both specifies the state. The commuting equations make the unique fine solution project to the unique coarse solution. Consequently any semantic failure must occur without intervention, through an extra coarse equilibrium.

If either quotient is injective, any coarse equilibrium lifts uniquely. For example, if \(q_A\) is injective, take the unique \(a\) with \(q_A(a)=u\), and put \(b=g(a)\). Then \(q_B(b)=v\), and

\[
q_A(f(b))=\bar f(v)=u=q_A(a),
\]

so \(f(b)=a\). Each coarse equilibrium therefore lifts to a fine one; fine uniqueness excludes additional coarse equilibria.

If either quotient is constant, its coarse coordinate is a singleton. The other coarse equation then has a fixed argument and determines a unique value. Thus the coarse system is uniquely solvable, and the unique fine equilibrium projects to it.

Both quotients must therefore be neither injective nor constant. Each fine domain then needs at least three states and each coarse domain at least two. This proves the nine-state lower bound, and the example attains it. The lower bound is specific to the no-self-dependence class: a single three-state self-dependent equation already permits a collapsed two-cycle.

## Classification at the minimum size

At size three, every partial quotient has one singleton fibre and one two-element fibre. Label the singleton states \(a_0,b_0\), the two-element fibres \(A_1,B_1\), and their coarse values by 0 and 1 respectively.

The coarse system has two binary coordinates. Any coarse equilibrium is determined by its first coordinate, so there can be at most two. Fine existence gives at least one, and failure requires a second. Two equilibria force \(\bar f\) and \(\bar g\) to be bijections inverse to one another. There are then two possible configurations of equilibrium cells:

1. The cells are the singleton-by-singleton cell and the double-by-double cell.
2. The cells are singleton-by-double and double-by-singleton.

The second configuration is impossible. Any equilibrium cell with a singleton coordinate has exactly one fine equilibrium: fix its unique fine state, apply the other mechanism, and use the commuting equations and singleton fibre to check the remaining equation. The two cells would therefore give two fine equilibria, contradicting fine simplicity.

In the first configuration, the singleton-by-singleton cell has the fine equilibrium \((a_0,b_0)\). The double-by-double cell must have none. Commutation restricts the fine mechanisms to maps

\[
f_1:B_1\to A_1,\qquad g_1:A_1\to B_1.
\]

The composite \(f_1g_1:A_1\to A_1\) must be fixed-point-free. The only fixed-point-free self-map of a two-element set is its transposition. In particular both \(f_1\) and \(g_1\) must be bijections, with opposite parities after compatible labelling.

Relabel \(A_1\) and \(B_1\) so that \(f_1\) is the identity. Then \(g_1\) is the transposition. Label \(a_0,b_0\) by 0. This produces exactly the displayed identity/swap example. The relabelling also preserves the quotient fibre structure, so it is an isomorphism of the fine model, coarse model, and abstraction maps together.

## Independent finite check

`independent_check.py` does not import the main enumerator or use the graph criterion to determine solutions. It exhausts every pair of functions \(f:B\to A\), \(g:A\to B\), every canonical set partition on each coordinate, and every fine point-clamp intervention, for all \(1\leq |A|,|B|\leq3\). Solutions are found by directly filtering all simultaneous equations.

The enumeration contains 900 fine systems, of which 542 are simple. There are 7,476 compatible system/quotient pairs, including 5,206 with a simple fine model. Exactly 18 of those pairs fail: all have sizes \(3\times3\), both quotients partial, and only the un-intervened query fails. All 18 are explicitly checked against the identity/swap shape proved above.

There are three canonical partial partitions of a three-element set, hence nine pairs of such partitions. For each pair there are exactly two labelled fine systems of the required shape: choose either bijection between the double fibres for \(f_1\), after which \(g_1\) is forced by the fixed-point-free-composite condition. Thus the count is \(9\times2=18\), agreeing with the independent enumeration.

The same program also checks all 4,096 no-self-dependence three-bit systems and their eight identity/erasure quotient products. Of these fine systems, 744 are simple. All 2,928 simple compatible pairs preserve every matched fine intervention. Binary coordinate domains admit no partial quotient, so this provides a separate check of the injective/constant part of the theorem; it does not exhaust ternary systems or prove the general result computationally.
