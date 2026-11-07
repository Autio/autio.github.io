# A sharp graph criterion for preserving finite causal solutions under abstraction

Research note, 7 November 2026. Status: direct mathematical proof, with internally independent AI review and finite checks. The completed checks cover 900 two-component systems (5,206 simple compatible system/interface pairs, including 18 failures outside the safe graph class), 4,096 three-component Boolean systems (2,928 simple compatible pairs, all safe), and 135 cycle witnesses across the three-vertex obstruction graphs. These are finite computational checks, not external mathematical review. Priority is not established. The elementary ingredients—unique solvability, point interventions, triangular systems, and cycle counterexamples—are classical. The specific universal classification below is the candidate result to compare with the literature.

## 1. Setting and question

Let $V$ be a finite set of components. For each $i\in V$, let $X_i,Y_i$ be finite nonempty sets and let

\[
q_i:X_i\twoheadrightarrow Y_i,
\qquad X=\prod_{i\in V}X_i,\quad Y=\prod_{i\in V}Y_i,\quad q=\prod_iq_i.
\]

Let $D$ be a loopless directed graph on $V$. A deterministic system $F:X\to X$ **respects $D$** if its component $F_i$ depends only on coordinates $j$ with an allowed edge $j\to i$. An allowed edge need not be used. In particular, $F_i$ does not depend on $x_i$.

Assume there are mechanisms $G_i:Y\to Y_i$ satisfying the componentwise equations

\[
q_i(F_i(x))=G_i(q(x))\qquad(i\in V, x\in X). \tag{1}
\]

Surjectivity of $q$ makes $G$ unique, and also ensures that $G$ respects $D$: changing a macro coordinate outside the allowed parents can be lifted to changing only that fine coordinate, on which $F_i$ does not depend. Equation (1) is a local mechanism condition. We do not assume in advance that $q$ is an exact causal abstraction of closed systems.

For $B\subseteq V$ and $b\in X_B$, the point intervention $\operatorname{do}(B=b)$ replaces $F_i$ by the constant $b_i$ for $i\in B$. Write $F^{B=b}$ for the resulting system. Its matched macro intervention is $G^{B=q_B(b)}$, where $q_B=\prod_{i\in B}q_i$. Then (1) remains true after the interventions.

Call $F$ **simple** if $F^{B=b}$ has exactly one fixed point for every $B,b$, including $B=\varnothing$. This is the finite deterministic, fixed-context version of unique solvability for every subset of equations. It is stronger than unique solvability without intervention. No update schedule or convergence claim is part of this definition.

Classify the coordinates into disjoint sets:

\[
\begin{aligned}
I&=\{i:q_i\text{ is injective}\},\\
C&=\{i:q_i\text{ is constant and not injective}\},\\
P&=\{i:q_i\text{ is neither injective nor constant}\}.
\end{aligned} \tag{2}
\]

Thus $I$ retains the whole coordinate, $C$ deletes its distinctions entirely, and $P$ retains some distinctions while merging others. If $X_i$ is a singleton, its coordinate belongs to $I$; this convention removes the overlap between “injective” and “constant.” For $i\in P$, necessarily $|X_i|\geq3$ and $|Y_i|\geq2$.

The question is universal: for the fixed interface data $D,(q_i)$, do **all** compatible simple systems retain their unique interventional solutions after abstraction?

## 2. Universal preservation theorem

**Theorem.** The following statements are equivalent.

1. The induced graph $D[P]$ is acyclic.
2. For every simple $D$-respecting $F$ satisfying (1), the induced $G$ is simple.
3. For every such $F$, and every fine point intervention $B=b$, the map $q$ restricts to a bijection

   \[
   \operatorname{Fix}(F^{B=b})\;\xrightarrow{\;q\;}\;
   \operatorname{Fix}(G^{B=q_B(b)}). \tag{3}
   \]

When $D[P]$ contains a directed cycle, one can construct a compatible simple $F$ whose un-intervened system has exactly one fixed point, while $G$ has exactly two. The extra macro fixed point has no fine fixed-point lift.

The theorem is a classification of a guarantee based on the declared graph and the coordinate maps. It does **not** say that $D[P]$ must be acyclic for a particular abstraction to work. A cyclic allowed graph may admit safe mechanisms, including constant mechanisms. It says that a cycle prevents a guarantee valid for every compatible simple mechanism system.

### Proof that acyclicity suffices

Fix a compatible simple $F$. A fine solution always projects to a macro solution, by (1). Therefore, for every fine intervention, the corresponding macro system has at least one solution.

Fix $B=b$, and let $y\in\operatorname{Fix}(G^{B=q_B(b)})$ be any macro solution. For every $i\in I\setminus B$, there is a unique $a_i\in X_i$ with $q_i(a_i)=y_i$. Make an auxiliary fine intervention that clamps all coordinates in $B\cup I$: use $b$ on $B$, and $a_i$ on $I\setminus B$. By simplicity of $F$, this auxiliary system has a unique solution $x\in X$.

Set $z=q(x)$. By construction,

\[
z_i=y_i\quad\text{for }i\in B\cup I\cup C.
\]

For $C$, this follows because $Y_i$ is a singleton. At every remaining coordinate $i\in P\setminus B$, the auxiliary intervention has left the mechanism untouched, so

\[
z_i=q_i(F_i(x))=G_i(z).
\]

Thus $z_{P\setminus B}$ and $y_{P\setminus B}$ solve the same macro equations, with all other macro coordinates fixed to the same values. These equations respect $D[P\setminus B]$, a directed acyclic graph. Evaluating the mechanisms in a topological order gives exactly one solution. Consequently, $z=y$.

It remains to undo the auxiliary clamps on $I\setminus B$. For such an $i$, equation (1), the identity $q(x)=y$, and the macro fixed-point equation give

\[
q_i(F_i(x))=G_i(y)=y_i=q_i(x_i).
\]

Injectivity of $q_i$ yields $F_i(x)=x_i$. Hence $x$ satisfies the original fine intervention $F^{B=b}$, not merely the auxiliary one.

Every macro solution of the matched intervention therefore lifts to a solution of $F^{B=b}$. That fine system has exactly one solution, so the macro system also has exactly one solution, and (3) holds. Every macro clamp value has a fine representative because the $q_i$ are surjective. Thus $G$ is simple. This proves $1\Rightarrow3\Rightarrow2$.

### Proof that the condition is sharp

Suppose $D[P]$ contains a simple directed cycle

\[
i_1\to i_2\to\cdots\to i_m\to i_1.
\]

Since the graph is loopless, $m\geq2$. For each cycle coordinate $i$, choose distinct states $a_i^0,a_i^1,c_i\in X_i$ with

\[
q_i(a_i^0)=q_i(a_i^1)=u_i,
\qquad q_i(c_i)=v_i\neq u_i. \tag{4}
\]

These choices are possible precisely because $q_i$ is neither injective nor constant. Define a three-valued classifier

\[
\kappa_i(x_i)=
\begin{cases}
* & q_i(x_i)\neq u_i,\\
1 & x_i=a_i^1,\\
0 & q_i(x_i)=u_i\text{ and }x_i\neq a_i^1.
\end{cases}
\]

At each cycle coordinate, the mechanism uses only its predecessor. It sends $*$ to $c_i$, $0$ to $a_i^0$, and $1$ to $a_i^1$, except at one selected coordinate where the outputs for $0$ and $1$ are exchanged. At every off-cycle coordinate use an arbitrary constant mechanism.

These mechanisms respect $D$. They descend through $q$: on the cycle the macro mechanism is

\[
G_i(y)=
\begin{cases}
u_i & y_{\operatorname{pred}(i)}=u_{\operatorname{pred}(i)},\\
v_i & y_{\operatorname{pred}(i)}\neq u_{\operatorname{pred}(i)}.
\end{cases} \tag{5}
\]

The exchange of $0,1$ is invisible after applying $q_i$.

A fine fixed point must use one of the three selected states at each cycle coordinate. If any cycle coordinate uses $c_i$, equation (5)'s fine counterpart forces every cycle coordinate to use $c_i$. This gives one fixed point. Otherwise every cycle coordinate is $a_i^0$ or $a_i^1$; their binary indices must copy around the cycle with exactly one flip, which is impossible. Hence the fine system has exactly one fixed point.

It is also simple. If an intervention clamps no cycle coordinate, the cycle retains the unique all-$c_i$ solution. If it clamps at least one cycle coordinate, the equations at unclamped cycle coordinates become disjoint directed chains. Their values are uniquely determined by the clamped predecessors. Clamped states can be arbitrary members of $X_i$; the classifier was defined on all of them. Off-cycle equations are constant, unless clamped. Thus every point intervention has exactly one solution.

In the macro system, the cycle coordinates of a fixed point must all be $u_i$, or must all be $v_i$. Both choices solve (5), and there are no others. The all-$v_i$ solution lifts to the fine fixed point, whereas the all-$u_i$ solution does not lift. Thus $G$ is not simple and $2\Rightarrow1$. This completes the proof.

## 3. Smallest two-component obstruction

Take

\[
X_1=X_2=\{0,1,2\},\qquad Y_1=Y_2=\{0,1\},
\]

and let $q_i(0)=0, q_i(1)=q_i(2)=1$. Let $s(0)=0, s(1)=2, s(2)=1$, and set

\[
F(a,b)=(b,s(a)),\qquad G(u,v)=(v,u).
\]

Then $qF=Gq$. The fine equations imply $a=b=s(a)$, so their unique solution is $(0,0)$. Clamping either component determines the other; clamping both is also uniquely solvable. Thus the fine system is simple.

The macro system has solutions $(0,0)$ and $(1,1)$. The second macro solution corresponds to the four fine states $(1,1),(1,2),(2,1),(2,2)$, none of which satisfies the fine equations. It is a spurious equilibrium, not merely a duplicate description of a fine equilibrium.

This example has the smallest possible component sizes for a counterexample in the class of two loopless interacting components with both coordinate maps proper and nonconstant. Every such map needs at least three fine states and two macro states. Consequently the fine product has at least $3\times3=9$ states, and this example attains the bound. More generally, the theorem rules out a failure with fewer than two partially abstracted coordinates in a loopless system, regardless of how many wholly retained or wholly erased coordinates are added.

For exactly two loopless components, the theorem reduces to a particularly simple classification. With both directions permitted, universal preservation holds if and only if at least one coordinate map is injective or constant. If a direction is not permitted, the graph is already acyclic and every compatible simple system is safe.

## 4. What the theorem permits and what it assumes

The entire fine system need not be acyclic. Cycles may pass through fully retained coordinates, wholly erased coordinates, or both. Only cycles lying entirely among the partially abstracted coordinates prevent this universal guarantee. Treating every noninjective coordinate as the same kind of information loss would therefore give an unnecessarily strong restriction.

The existing simplicity of $F$ is essential. Acyclicity of $D[P]$ alone does not establish existence or uniqueness of fine solutions. For example, if every $q_i$ is constant, then $P=\varnothing$, regardless of any inconsistency in $F$. The theorem transfers an existing interventional solvability guarantee; it does not manufacture one.

Even an additional hypothesis of a unique un-intervened fine solution is insufficient. Let the three fine coordinates be $p\in\{0,1,2\}$, $c\in\{0,1\}$, and $i\in\{0,1\}$. Partially abstract $p$ by $q_p=(0,1,1)$, erase $c$ constantly, and retain $i$ injectively. Define

\[
F_p(p,c,i)=\begin{cases}0&i=0,\\1+c&i=1,\end{cases}
\qquad F_c(p,c,i)=\mathbf{1}_{p=1},
\qquad F_i(p,c,i)=\mathbf{1}_{p\neq0}.
\]

There is only one partially abstracted coordinate, and none of the mechanisms depends on its own coordinate. Hence $D[P]$ is acyclic. The fine system has the sole fixed point $(0,0,0)$, but its macro equations are $y_p=i$ and $i=y_p$, with two solutions. The missing hypothesis is exposed by the intervention $i=1$: it requires $p=1+c$ and $c=\mathbf{1}_{p=1}=1-c$, which has no solution. Thus $F$ is not simple. The auxiliary interventions in the proof are substantive, not an expendable technical device.

The graph must bound the actual dependencies of the mechanisms. A certificate for a smaller graph does not cover an unrecorded extra parent edge. The proof uses the same coordinate interface at both levels; it does not cover overlapping variable alignments, arbitrary aggregation of several coordinates into one, probabilistic mechanisms, or arbitrary observational maps.

Equilibrium existence and uniqueness are distinct from convergence. Nothing in the theorem guarantees termination of synchronous iteration, convergence under fair asynchronous schedules, or the absence of oscillatory trajectories. Those require additional hypotheses and separate tests.

## 5. Composition and generalized interventions

For a collection of modules, form the allowed dependency graph after the proposed connections are made. Assume the connected fine system is simple and its component mechanisms obey (1). If the connected graph induced by $P$ is acyclic, the theorem certifies all matched point interventions on the connected system. This gives a check at the interface level once fine simplicity is justified independently.

Individual module certificates do not make a feedback connection safe by themselves. Two modules can each have an acyclic graph while the new connections form a directed cycle entirely in $P$. The construction in Section 2 shows that this is a sharp failure of a guarantee based only on the allowed interfaces. It does not say that every such connection fails for the mechanisms actually installed.

For a declared family of generalized mechanism replacements, apply the theorem separately to every resulting pair $F',G'$, provided that:

1. $F'$ remains simple;
2. $F'$ respects an allowed graph whose induced graph on $P$ is acyclic;
3. the replacement mechanisms still satisfy $q_iF'_i=G'_iq$.

No further claim follows for arbitrary replacements. A replacement may destroy fine solvability or introduce a new cycle of partially abstracted coordinates. If all replacements share one allowed graph $D$, the same acyclicity certificate covers the whole family once conditions 1 and 3 are checked for its members.

## 6. Refining the interface: a feedback vertex set interpretation

Suppose the original distinctions must be preserved, so a replacement interface consists of surjections $r_i:X_i\twoheadrightarrow Z_i$ through which $q_i$ factors:

\[
q_i=h_i\circ r_i.
\]

For an originally partially abstracted coordinate $i\in P$, the refined map $r_i$ cannot be constant: otherwise $q_i$ would also be constant. Therefore such a coordinate ceases to be partially abstracted only when $r_i$ becomes injective. A further partial refinement which still merges some states does not remove that vertex from the forbidden-cycle test.

**Corollary.** Keep the maps at the originally injective and constant coordinates unchanged. The sets $S\subseteq P$ whose full retention—replacing $q_i$ by the identity on $X_i$ for $i\in S$—makes the refined interface universally safe in the theorem's sense are exactly the directed feedback vertex sets of $D[P]$: the sets meeting every directed cycle. With prescribed nonnegative costs $w_i$ for fully retaining coordinate $i$, the least total such cost is

\[
\min\left\{\sum_{i\in S}w_i:
S\subseteq P,\ D[P\setminus S]\text{ is acyclic}\right\}. \tag{6}
\]

**Proof.** After these refinements the partially abstracted coordinates are exactly $P\setminus S$, so the theorem applies directly. More generally, any refinement of the original interface that is universally safe must make injective a set of original $P$-coordinates meeting every original cycle in $D[P]$. Extra partial refinements cannot avoid this necessity. Leaving the original constant maps unchanged attains the bound without introducing additional partially abstracted vertices. $\square$

Equation (6) is a standard directed feedback vertex set optimization, not a new graph-theoretic problem. Its content here is an interpretation of how much **coordinate-level full retention** is needed for this worst-case causal guarantee. It is not an optimality statement about the number of states or bits needed to abstract one particular installed system.

There is an essential implementation qualification. An existing system that descends through $q$ need not descend through a refinement $r$. Newly observing a fine distinction in one output can expose dependence on input distinctions that the other $r_j$ still merge. Consequently, before applying the theorem to a refined interface, one must again establish mechanisms $H_i$ with $r_iF_i=H_ir$. The feedback vertex set test establishes the graph condition; it does not establish these new commuting equations. Further refinement can be necessary for that separate reason. Refining an originally constant coordinate into a partial one can also create new forbidden cycles.

The example in Section 3 already exhibits this gap. Its graph has a one-vertex feedback vertex set. But fully retaining only the first coordinate fails descent because $F_1(a,b)=b$ distinguishes $b=1$ from $b=2$, which the second interface still merges. Fully retaining only the second coordinate likewise fails because the permutation $s(a)$ distinguishes the merged values of $a$. Both coordinates must be retained fully to obtain a safe descending refinement in this example. Thus one graph upgrade is sufficient to remove the cycle, but two are required to satisfy both the graph condition and the actual mechanisms' commuting equations.

## 7. Self-dependent equations and exogenous contexts

The algebraic theorem and proof also allow a graph with self-loops, when “simple” is understood solely as unique fixed points after every point clamp. A self-loop at a partially abstracted coordinate is a length-one forbidden cycle, and the sharp witness is a three-state map with one fixed state and a two-cycle collapsed to a second macro fixed state. This extension is about raw fixed-point equations. It should not be identified uncritically with the canonical causal graph of a simple SCM, which uses an equation-equivalence notion and has no self-cycles in the framework of Bongers et al.

If exogenous parameters $e\in E$ are present, the same proof applies separately at each fixed $e$, with $q_i$ independent of $e$, a common allowed graph, and simplicity and commutation assumed for every $e$. This yields equality of the deterministic interventional solution maps. If $E$ is finite with its discrete sigma-algebra, a distribution on $E$ can then be pushed forward through those maps. More generally, this holds for measurable $E$ if every map $e\mapsto F_i(x,e)$ is measurable: with finite state sets, each event that a given state solves the intervened equations is a finite intersection of measurable events, so the unique solution map is measurable. This is a corollary of pointwise equality, not a new probabilistic theorem.

## 8. Literature and scope of the claim

Unique solvability under interventions and its closure properties are developed in Bongers, Forré, Peters and Mooij, *Foundations of Structural Causal Models with Cycles and Latent Variables*, especially Definition 8.1 and Proposition 8.2. Their marginalization operation is not the arbitrary state lumping considered here. See [the paper](https://arxiv.org/html/1611.06221v6#S8).

Lorenz and Tull, *Causal and Compositional Abstraction* (2026), formulate mechanism-level consistency in Section 6, and explicitly identify cyclic causal abstraction with nontrivial interventions and consistency requirements as a direction for further work in Section 8. Their work is a motivation and close comparator, not evidence that the present special case has no predecessor. See [the discussion of cyclic structures](https://arxiv.org/html/2602.16612v1#S8.SS0.SSS8).

The theorem's sufficiency proof combines an auxiliary intervention, the classical unique solution of an acyclic system, and injectivity on retained coordinates. The necessity proof uses a hidden two-cycle. These ingredients carry no novelty claim. A complete priority assessment must check whether the exact universal graph criterion on coordinates that are neither retained injectively nor erased constantly is already stated, or follows immediately from a more general published theorem.
