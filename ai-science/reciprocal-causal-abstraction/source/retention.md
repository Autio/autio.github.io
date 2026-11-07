# Full retention that still commutes with the mechanisms

Research note, 7 November 2026. This note gives an exact finite certificate calculation for a fixed system and a restricted class of interface refinements. It does not claim a new feedback vertex set algorithm or a globally optimal causal abstraction.

Use the definitions and theorem in [theorem.md](theorem.md). Fix the fine mechanisms $F$, the surjective coordinate maps $q_i$, and an allowed dependency graph $D$, with

\[
q_iF_i=G_iq.
\]

Assume $F$ is simple when invoking the causal-preservation conclusion below. The algebraic criterion for descent does not itself require simplicity.

## 1. Allowed refinements

Let $N=V\setminus I=P\cup C$ be the coordinates on which $q_i$ is not injective. For an upgrade set $R\subseteq N$, define

\[
r_i^R=
\begin{cases}
\mathrm{id}_{X_i}&i\in R,\\
q_i&i\notin R.
\end{cases} \tag{1}
\]

Thus each coordinate is either left as it was or retained fully. We do not allow a new intermediate partition of its states in this optimization. Every $q_i$ factors through $r_i^R$, so an upgrade retains all the original distinctions.

The new map $r^R=\prod_ir_i^R$ need not commute with the existing mechanisms. We need to determine exactly when there are mechanisms $K_i$ with

\[
r_i^RF_i=K_ir^R. \tag{2}
\]

When they exist they are unique, because $r^R$ is surjective, and they respect $D$.

## 2. Hidden dependence

Define a directed graph $H=H(F,q)$ by putting an edge $j\to i$ exactly when there are $x,x'\in X$ such that

1. $x_k=x'_k$ for all $k\neq j$;
2. $q_j(x_j)=q_j(x'_j)$;
3. $F_i(x)\neq F_i(x')$.

Such an edge means that the full fine output of component $i$ distinguishes two inputs of component $j$ which the old interface merges. Each edge has a concrete two-state witness.

The graph $H$ is a subgraph of $D$. It has no edges from an injective coordinate, because condition 2 would then force $x_j=x'_j$. It also has no edges into an injective coordinate: if $q_i$ is injective, the original equation $q_iF_i=G_iq$ implies that $F_i$ is constant on every $q$-fibre. Thus $H$ can be regarded as a graph on $N$.

Call $R\subseteq N$ **closed under predecessors in $H$** if

\[
i\in R,\quad j\to i\text{ in }H\quad\Longrightarrow\quad j\in R. \tag{3}
\]

## 3. Exact descent criterion

**Proposition.** The refined mechanisms (2) exist if and only if $R$ is closed under predecessors in $H$.

**Proof, necessity.** Suppose $i\in R$, $j\notin R$, and $j\to i$ in $H$. Choose the witnessing $x,x'$. Their refined inputs agree: every coordinate except $j$ is unchanged, and the un-upgraded coordinate $j$ still merges $x_j,x'_j$. Hence $r^R(x)=r^R(x')$. But the upgraded output $i$ is observed in full, so $r_i^R(F_i(x))=F_i(x)\neq F_i(x')=r_i^R(F_i(x'))$. This contradicts (2).

**Proof, sufficiency.** For $i\notin R$, the observed output is still $q_iF_i=G_iq$. Since $q$ factors through $r^R$, this already factors through the refined input.

For $i\in R$, take any $x,x'\in X$ with $r^R(x)=r^R(x')$. At upgraded coordinates the two fine values are equal. At an un-upgraded coordinate $j$, they have the same $q_j$-value. Connect $x$ to $x'$ by changing the un-upgraded coordinates one at a time. There is no $H$-edge from any such $j$ to $i$, by predecessor closure. Therefore each coordinate change leaves $F_i$ unchanged. It follows that $F_i(x)=F_i(x')$, so the full output $F_i$ factors through $r^R$. This proves (2) for every $i$. $\square$

The product form of the interface matters in this proof: two inputs in one fibre can be connected by changing a single coordinate at a time while remaining in the fibre.

## 4. Combining descent with the causal certificate

Full upgrades turn coordinates of $P$ into injective coordinates, and turn coordinates of $C$ directly into injective coordinates. They do not introduce new partially abstracted coordinates. Thus the partial set for $r^R$ is exactly $P\setminus R$.

**Corollary.** A full-upgrade set $R\subseteq N$ satisfies both

- the actual mechanisms descend through $r^R$, and
- the refined interface has the universal graph guarantee from the theorem,

if and only if

\[
R\text{ is predecessor-closed in }H,
\qquad D[P\setminus R]\text{ is acyclic}. \tag{4}
\]

If $F$ is simple, every $R$ satisfying (4) therefore gives exact unique solutions under all matched point interventions.

Condition (4) is necessary and sufficient for this **particular pair of certificates**. It is not necessary for an individual quotient to preserve causal solutions: an installed mechanism system can be safe even when its allowed graph has a cycle among partial coordinates. Accordingly, an optimum calculated from (4) is a certificate optimum, not an optimum over every semantically valid abstraction.

## 5. Weighted optimization

Let $w_i\geq0$ be a prescribed cost for fully retaining coordinate $i\in N$. Define $\operatorname{cl}_H(S)$ to be the set consisting of $S$ and all its ancestors in $H$; it is the smallest predecessor-closed set containing $S$.

**Proposition.** The minimum cost of a set satisfying (4) is

\[
\min_{\substack{R\subseteq N\\R\text{ predecessor-closed in }H\\D[P\setminus R]\text{ acyclic}}}
\ \sum_{i\in R}w_i

=
\min_{\substack{S\subseteq P\\S\text{ meets every directed cycle of }D[P]}}
\ \sum_{i\in\operatorname{cl}_H(S)}w_i. \tag{5}
\]

**Proof.** If $S$ meets every directed cycle of $D[P]$, then $R=\operatorname{cl}_H(S)$ is predecessor-closed and contains $S$. Consequently $D[P\setminus R]$ is a subgraph of the acyclic graph $D[P\setminus S]$, and $R$ satisfies (4).

Conversely, if $R$ satisfies (4), then $S=R\cap P$ meets every directed cycle of $D[P]$. Predecessor closure gives $\operatorname{cl}_H(S)\subseteq R$. Since the costs are nonnegative, the closure costs no more than $R$. Taking minima gives equality. $\square$

This is a directed feedback vertex set problem with the additional cost of retaining all hidden predecessors. The ancestor closures can overlap, so their costs should be calculated on the union, not added separately per selected cycle-breaking vertex. In particular, merely attaching each vertex the cost of its own ancestor closure and solving an ordinary weighted feedback vertex set problem can double-count shared ancestors and need not optimize (5).

The formulation provides a finite search procedure and a useful audit trail. It does not imply a polynomial-time algorithm. The graph $H$ can be checked by enumerating local mechanism tables and pairs of inputs in each coordinate fibre; a declared sparse parent set can reduce that calculation.

## 6. Why one cycle-breaking upgrade can force two

Use the smallest obstruction from the theorem:

\[
F(a,b)=(b,s(a)),\quad
s(0)=0, s(1)=2, s(2)=1,
\quad q_1=q_2=(0,1,1).
\]

The allowed graph and the hidden-dependence graph are both the two-cycle $1\rightleftarrows2$. For the edge $2\to1$, hold $a$ fixed and compare $b=1,2$: the old $q_2$ merges them while $F_1=b$ distinguishes them. For $1\to2$, hold $b$ fixed and compare $a=1,2$: their old labels agree, while $s(a)$ differs.

The graph-only feedback vertex set number is one. But each singleton upgrade set is not predecessor-closed: observing either output in full forces full retention of the other's hidden input distinction. The smallest nonempty predecessor-closed set is $R=\{1,2\}$, and this is the minimum full-upgrade set satisfying (4). With unit costs the graph-only lower bound is one and the exact certificate cost is two.

This illustrates the distinction between retaining enough information to break a potentially harmful feedback cycle and retaining enough input information to define the newly observed mechanisms at all.

## 7. Status and further scope

The descent proposition is an elementary factorization criterion on product partitions. The optimization identity follows directly from it and the universal graph theorem. Neither constitutes a new general theory of congruences or a new feedback vertex set algorithm.

The practical research direction is their combination: a revision checker could reject a proposed retained-output interface with a concrete hidden-input witness, close a requested retention set under those dependencies, and then test the partial-coordinate graph. This would still require a separate justification of fine simplicity. Allowing genuinely partial refinements instead of full coordinate upgrades leads to a richer partition-refinement problem not solved by this note.
