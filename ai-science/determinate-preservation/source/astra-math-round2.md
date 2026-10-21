# Second mathematical audit: matching support, examples, and boundaries

Independent Astra review, 22 October 2026. No manuscript files edited. Supplement to the review in outputs/determinate-preservation/astra-math-review.md.

**Verdict.** The stronger matching-support statement is true, with finite limits sufficient. It settles existence and uniqueness of a least full resolver for every starting full subposet of a finite poset. The integrated proof presently in 02-mathematics.tex is correct. The Boolean family and its indexing remain correct. The compact sphere-layer family proposed during this round is also correct and yields an optimal six-object first Set-to-groupoid jump. No fatal mathematical issue found.

## 1. Full matching-support theorem

Let \(C\) be a finite poset, let \(\mathcal V\) be an infinity-category with finite limits, and let \(X:C\to\mathcal V\). Define
\[
M_xX=\lim_{y\in C_{>x}}X(y),\qquad
S(X)=\{x:X(x)\longrightarrow M_xX\text{ is not an equivalence}\}.
\]
The map is the canonical cone map. For maximal \(x\), the matching object is terminal.

**Theorem.** For every full \(R\subseteq C\),
\[
X\xrightarrow{\sim}\operatorname{Ran}_R(X|_R)
\quad\Longleftrightarrow\quad S(X)\subseteq R.
\]
For any family \(\mathcal F\) of diagrams, the least full reconstruction subset is
\[
S(\mathcal F)=\bigcup_{X\in\mathcal F}S(X).
\]
If a specified subset \(D_0\) must be retained, the answer is \(D_0\cup S(\mathcal F)\).

**Proof.** First consider deleting one object \(x\). For the full inclusion \(j:C\setminus\{x\}\hookrightarrow C\), the pointwise right-Kan unit is an equivalence at every retained object, because its comma category has the identity as an initial object. At \(x\), its target is precisely the limit over \(C_{>x}\). Hence \(X\) is right Kan extended from \(C\setminus\{x\}\) if and only if its matching map at \(x\) is an equivalence.

Suppose \(X\) is right Kan extended from \(R\), and take \(x\notin R\). Factor \(R\hookrightarrow C\) through \(C\setminus\{x\}\). Composition of right Kan extensions puts \(X\) in the essential image of right Kan extension from this intermediate full subposet. Because right Kan extension along a full inclusion is fully faithful, its canonical unit is an equivalence. The one-object observation gives \(x\notin S(X)\).

Conversely, assume \(S(X)\subseteq R\). Order the omitted objects by an increasing linear extension of \(C\), and delete them in that order. At the moment \(x\) is deleted, every \(y>x\) is still present: a greater omitted element occurs later, and an element of \(R\) is never deleted. The current matching diagram at \(x\) is therefore exactly the original one. Its map is an equivalence. Each current diagram is right Kan extended from the next restricted diagram. Composing the finitely many right Kan extensions proves the result. Apply the equivalence to each family member to obtain the union formula. \(\square\)

This proof is coherent in infinity-categories: it uses pointwise Kan formulas and composition of right adjoints, not a strict model-dependent choice of cones. The indexing nerves are finite because \(C\) is a finite poset, so finite limits suffice.

**Arbitrary starting level.** If \(\mathcal V\) also admits the relevant left Kan extensions and \(D\subseteq C\) is full, the least full resolver containing \(D\) is
\[
\mathsf A_{\mathcal V}(D)
=D\cup\bigcup_{A\in\operatorname{Fun}(D,\mathcal V)}
S(\operatorname{Lan}_D A).
\]
Neither noninitiality nor nontriviality of \(D\) can produce incomparable minimal full resolvers over a finite poset. Both changes can complicate calculation but do not threaten existence or uniqueness. The formula is not a general effective algorithm.

**Upper-interval theorem.** For \(X=\Delta A\), the matching map is
\[
A\longrightarrow\operatorname{Map}(B(C_{>x}),A).
\]
Yoneda in \(\mathcal S_{\le k}\) says that the union of the supports of all constant \(k\)-type diagrams is exactly \(E_k(C)\). Thus the support theorem and constant-comma criterion prove the upper-interval theorem directly. The longer truncated-Quillen-A argument is valid but redundant. If using the shorter proof, revise the abstract's “obtained from truncated cofinality.” Du remains useful context, with the already checked index \(k+1\).

These are matching objects for an inverse Reedy structure assigning smaller degrees to greater objects. Riehl–Verity, The theory and practice of Reedy categories, TAC 29(9) (2014), 256–301, §3, supplies the standard matching-object and inductive-extension background. The support formulation is an elementary deduction from that machinery; it should not be marketed as a new foundational theorem of Kan extensions. [Author PDF](https://emilyriehl.github.io/files/reedy.pdf)

## 2. Exact coefficient-persistence hypotheses

Let \(i:\mathcal V\hookrightarrow\mathcal W\) be fully faithful and preserve the limits indexed by the strict upper intervals of \(C\). For every fixed \(X:C\to\mathcal V\),
\[
S_{\mathcal V}(X)=S_{\mathcal W}(iX).
\]
Preservation identifies matching maps, and full faithfulness reflects equivalences.

Monotonicity for families generated from \(D\) additionally follows if
\[
i\,\operatorname{Lan}^{\mathcal V}_D A
\simeq
\operatorname{Lan}^{\mathcal W}_D(iA)
\]
for every old input \(A\), compatibly with the extension. Under this hypothesis old supports occur among new supports, giving
\[
\mathsf A_{\mathcal V}(D)\subseteq\mathsf A_{\mathcal W}(D).
\]
A sufficient condition is preservation of the colimits indexed by every \(D\downarrow x\). Limit preservation alone does not establish the statement for generated families. The focused follow-up below supplies an explicit counterexample, so the extra hypothesis cannot simply be dropped.

For \(\mathcal S_{\le k}\hookrightarrow\mathcal S_{\le\ell}\), all limits are preserved, but general colimits need not be. Sufficient cases for generation to commute are:

* Every \(D\downarrow x\) has a terminal object. The inclusion has a right adjoint, and left Kan extension is evaluation at that right adjoint.
* Every component of \(D\downarrow x\) has a terminal object. The formula is a coproduct of evaluations, unchanged by the coefficient inclusion.
* In particular, an antichain \(D\) has discrete lower commas.

The manuscript's initial-singleton family satisfies the first condition.

## 3. Nonconstant examples

### Three objects: the structure maps matter

Let \(C=\{b<x<t\}\), \(D=\{b,t\}\). An input is a map \(f:U\to V\); its left extension has values \(U,U,V\). The matching map at \(x\) is \(f\). Choosing \(\varnothing\to *\) forces \(x\), so the least resolver containing \(D\) is \(C\), for sets and all space coefficients. The initial singleton \(\{b\}\) in the same chain has least resolver \(\{b,t\}\). Unweighted upper-interval topology does not calculate arbitrary-\(D\) resolution: the generated maps supply additional information.

### Nine objects: a nonconstant Set/groupoid jump

Start with \(p<a<P_3\), and add a second minimal object \(q\), with \(q<1\) and hence \(q<12,13\), and no further relations except transitivity. The objects are
\[
p,q,a,1,2,3,12,13,23.
\]
Take the antichain \(D=\{p,q\}\). For input \((A,B)\), left extension \(X\) has
\[
X(p)=X(a)=X(2)=X(3)=X(23)=A,\qquad X(q)=B,
\]
\[
X(1)=X(12)=X(13)=A\amalg B.
\]
The maps are identities or the indicated summand inclusions. All left-Kan comma categories are discrete, so the formula is unchanged by coefficient inclusion.

All six face objects are forced already in Set: choose \(B=\varnothing\), \(A\) a two-element set. At an edge the matching map is \(A\to *\); at a vertex it is \(A\to A\times A\). Both fail. The objects \(p,q\) are retained by definition. Only \(a\) remains in question.

Put \(J=P_3\), with \(BJ\simeq S^1\). On \(J\), there is a natural color map \(X\to\Delta 2\) identifying the \(A\)- and \(B\)-summands. Since \(BJ\) is connected, the canonical map
\[
2\longrightarrow\lim_J\Delta2=\operatorname{Map}(BJ,2)
\]
is an equivalence. The fiber of \(\lim_JX\to2\) over the \(A\)-color is \(\lim_J\Delta A=\operatorname{Map}(S^1,A)\). The fiber over the \(B\)-color is empty, because its pointwise fiber diagram is empty at \(2,3,23\), and a cone to a diagram with an empty value must be empty. Limits preserve the pullbacks computing these fibers. Hence
\[
M_aX\simeq\operatorname{Map}(S^1,A),
\]
with the canonical matching map identified with constant maps.

Therefore
\[
\mathsf A_0(D)=C\setminus\{a\},\qquad
\mathsf A_k(D)=C\quad(k\ge1,\text{ including }\infty).
\]
The choice \(A=K(\mathbb Z,1)\), \(B=*\) supplies a nonconstant generated diagram and detects failure through target components \(\mathbb Z\).

The scratch program work/check_nonconstant_round2.py enumerates all pairs of finite sets of cardinality at most two, computes the local matching sets, and obtains the predicted union of supports. This supports the argument; the proof above handles arbitrary spaces. The mechanism deliberately inherits the constant \(A\)-sector, so it is a scope example, not a new independent homotopy phenomenon.

## 4. Compact layered family and optimal first jump

Let \(L_1,\ldots,L_m\) be two-point antichains and
\[
Q_m=L_1\star\cdots\star L_m,\qquad
C'_m=\{b<a\}\star Q_m,\qquad m\ge2.
\]
The order complex of an ordinal sum is the simplicial join, giving
\[
BQ_m=S^0*\cdots*S^0\cong S^{m-1}.
\]
This is the standard iterated non-Hausdorff suspension sphere model. Barmak–Minian, Minimal Finite Models, JHRS 2(1) (2007), 127–140, Theorem 2.13, establishes the minimal finite sphere models; its introduction credits McCord's construction. [Author PDF](https://mate.dm.uba.ar/~jbarmak/minimalrevised.pdf); [journal metadata](https://tcms.org.ge/Journals/JHRS/volumes/2007/n1a7/abstract.htm).

For \(D=\{b\}\),
\[
\mathsf A_k(D)=\{b\}\cup L_{m-k-1}\cup\cdots\cup L_m
\quad(0\le k\le m-2),
\]
with cardinality \(2k+5\). For finite \(k\ge m-1\) and for unrestricted spaces,
\[
\mathsf A_k(D)=C'_m,\qquad |C'_m|=2m+2.
\]
Thus there are \(m\) distinct levels in a linearly sized indexing poset.

Indeed, \(C'_{>b}\) has initial object \(a\). At \(a\) the strict upper interval is \(Q_m\). At layer \(L_j\), \(j<m\), it is \(Q_{m-j}\), with nerve \(S^{m-j-1}\); at the last layer it is empty. Apply the upper-interval criterion. Every omitted \(x\ne b\) lies below all selected layers, so its selected upper comma is \(Q_{k+2}\simeq S^{k+1}\). The next coefficient detects it with \(K(\mathbb Z,k+1)\).

**Six objects are optimal for a Set-to-groupoid jump with an initial singleton.** If \(\mathsf A_0(\{b\})\ne\mathsf A_1(\{b\})\), some \(x\ne b\) has connected, nonsimply-connected \(B(C_{>x})\). Every connected order complex on at most three poset objects is contractible: without a three-chain it is a tree, while a three-chain supplies a filled triangle. Thus \(C_{>x}\) has at least four objects, distinct from both \(x\) and the initial object \(b\); hence \(|C|\ge6\). The case \(m=2\) attains the bound.

This compact family shows that exponential Boolean size is a choice for obtaining wedge multiplicities, not a requirement for arbitrarily long coefficient profiles. No general optimal-size claim for all numbers of levels has been proved here.

## 5. Finiteness is a real boundary

Take \(C=\mathbb N\) with its usual order and \(D=\{0\}\). Every strict upper interval has initial object \(n+1\), so every constant diagram has empty matching support, even when its value is nonterminal.

A full \(R\) containing \(0\) nevertheless resolves all constants exactly when \(R\) is unbounded. If unbounded, every upper tail \(R\cap[n,\infty)\) is nonempty and has a least element, so its nerve is contractible. If bounded, some upper comma is empty and a nonterminal coefficient detects the failure. Deleting any positive element from an unbounded \(R\) preserves unboundedness. Thus there is no inclusion-minimal resolver and no least resolver.

This replaces the obsolete suggestion that noninitial \(D\) might produce ambiguous minimal full resolvers over finite posets. Infinite bottom-up deletion does not provide the final finite composition used by the theorem. The failure already occurs for sets.

## 6. Rooted tree versus linear order

Let \(T\) be a finite rooted tree ordered by ancestry, root \(b\), with every internal vertex having at least two children. At an internal \(x\), the strict upper interval is a disjoint union of descendant subtrees rooted at its children. Each component has an initial object, so the upper nerve is equivalent to the discrete set of children and is disconnected. At a leaf it is empty. Consequently \(E_k(T)=T\), and \(\mathsf A_k(\{b\})=T\), for all finite \(k\ge0\) and unrestricted spaces.

On the same vertices, any linear extension of ancestry with \(b\) first and \(t\) last has contractible strict upper intervals except at \(t\). Thus \(E_k(L)=\{t\}\) and \(\mathsf A_k(\{b\})=\{b,t\}\) at every coefficient level.

Unary internal vertices would invalidate the claim that all tree vertices are essential: their upper intervals are contractible. The checked premise about the pruned reader tree having no unary internal vertices is material. The comparison does not identify the synthetic root with Pure Being or turn an editorial order into philosophical implication. It shows that stable coefficient profiles can coexist with sharply different dependence on relations.

## 7. Novelty and remaining revision priorities

The defensible contribution is a transparent coefficient-profile calculation and its philosophical application, with useful elementary formulations and examples. Standard ingredients include matching objects, right-Kan composition, constant-limit mapping-space formulas, truncated cofinality, finite sphere models, and simplex-skeleton wedge calculations. The ordinary least-full-subposet criterion is already in Dey–Lesnick and Brüstle–Desrochers–Leblanc. This search did not establish priority for the matching-support formulation or higher upper-interval characterization. Failure to locate an identical statement does not justify priority claims.

Related stable-coefficient literature exists: Brown–Draganov, Discrete microlocal Morse theory, discusses finite-poset sheaves and !-support via minimal injective complexes. In stable settings the fiber of a matching map is naturally a local-cohomology/costalk object on the minimal open upper neighborhood. This cautions against presenting “support” as a new concept; no such sheaf-theoretic claim is needed for the elementary proof. [Published primary text](https://research-explorer.ista.ac.at/download/20323/20886/2025_JourPureAppliedAlgebra_Brown.pdf)

Revision priorities, some already implemented during this round:

1. Keep the correct support theorem and its arbitrary-\(D\) corollary.
2. Remove the obsolete finite noninitial-\(D\) ambiguity suggestion; use the infinite-chain boundary.
3. Give persistence both its limit-preservation and left-extension-preservation hypotheses.
4. Use the support-based short upper-interval proof, or label Quillen A an independent alternative.
5. Credit standard sphere models in the compact family and restrict optimality to the proved six-object claim.
6. Keep the higher full-subcategory qualification, ordinary all-level rigidity justification, and noncohesive scope restriction. Their checked formulations are sound.

No blocker remains in the checked proofs. Do not claim a new general cofinality theory or optimal efficiency of the Boolean construction.

## Final integration check

At approximately 22:48 UTC on 21 October (01:48 local on 22 October), I reread the integrated support proposition, shortened upper-interval proof, infinite-chain example, compact-family proposition and six-object lower bound, nine-object nonconstant proof, tree/linear-order proposition, appendix future-work revision, and abstract. All substantive mathematical statements checked are correct, including the unrestricted-space endpoints.

One small citation-scope repair was sent to the parent: the upper-interval theorem applies to arbitrary \(C,R\), whereas the stated constant-diagram lemma assumes an initial \(b\) and \(b\in R\). Cite “the pointwise mapping-space calculation in the proof of the lemma,” which needs neither assumption, rather than formally applying the narrower lemma. Alternatively broaden that lemma. This is a presentation gap, not a failed mathematical argument.

The abstract at that checkpoint still described the upper-interval criterion as obtained from truncated cofinality; the current proof obtains it from matching maps, so update that phrase. The rewritten appendix now correctly recognizes existence for arbitrary starting \(D\).

The finite-set scratch check was rerun successfully after integration: all nine pairs \((|A|,|B|)\in\{0,1,2\}^2\) give the claimed matching limit at \(a\), and their union of supports is precisely \(\{q,1,2,3,12,13,23\}\). Adding the mandatory \(D=\{p,q\}\) yields all positions except \(a\). No claim of proof-assistant verification is made.

## Focused follow-up: coefficient monotonicity fails for arbitrary starting levels

At the parent's request I investigated whether the preservation-of-generation hypothesis could be discarded. It cannot. The following six-object counterexample is complete and requires no unproved computational inference.

Let \(J=Q_2\) be the ordinal sum of two two-element antichains: two incomparable lower objects are each below both incomparable upper objects. Its order complex is a four-cycle, so \(BJ\simeq S^1\). Put
\[
C=\{x\}\star J\star\{t\},\qquad D=J,\qquad U=J\star\{t\}.
\]
Thus \(C\) has six objects, \(x\) is initial, and \(t\) is terminal, but the starting subposet \(D\) consists of the four middle objects.

**Proposition.**
\[
\mathsf A_0(D)=C,\qquad
\mathsf A_k(D)=U=C\setminus\{x\}
\quad\text{for finite }k\ge1\text{ and }k=\infty.
\]
In particular, coefficient-relative Aufhebungen need not increase with the coefficient category for arbitrary starting levels.

**Proof.** Every left extension \(X=\operatorname{Lan}_D A\) has \(X(x)=\varnothing\), because \(D\downarrow x\) is empty. Its restriction to \(D\) is \(A\), and
\[
X(t)=\operatorname{colim}_D A
\]
in the chosen coefficient category, with its canonical cocone.

First take the constant terminal input \(A=1\), and write \(F=\operatorname{Lan}_D1|_U\). For sets, \(F(t)=\pi_0 BJ=*\), so \(F\) is constant terminal on \(U\). Therefore the matching map at \(x\) is \(\varnothing\to *\), forcing \(x\).

For \(k\ge1\), including unrestricted spaces, put \(Y=F(t)=\tau_{\le k}BJ\simeq S^1\). A cone over \(F\) consists of a cone over its terminal restriction to \(J\), a point of \(Y\), and compatibility with the canonical cocone. This gives a homotopy pullback formula
\[
\lim_UF
\simeq
Y\times_{\operatorname{Map}(BJ,Y)}\{\eta\},
\]
where \(Y\to\operatorname{Map}(BJ,Y)\) sends a point to a constant map and \(\eta:BJ\to\tau_{\le k}BJ\) is the truncation map determined by the canonical cocone. For \(k\ge1\), \(\eta\) represents the degree-one component of \(\operatorname{Map}(S^1,S^1)\); constant maps lie in the degree-zero component. The pullback is consequently empty.

For an arbitrary input \(A\), its unique map to the terminal diagram induces
\[
\lim_U(\operatorname{Lan}_DA|_U)\longrightarrow\lim_UF=\varnothing.
\]
In spaces or truncated spaces, an object admitting a map to the empty object is empty. Thus the matching map at \(x\) is \(\varnothing\to\varnothing\) for every input. The full subposet \(U\) resolves \(D\).

Finally, \(t\) must occur in every resolver at every coefficient level. The input \(A=\varnothing\) gives \(X(t)=\varnothing\); because \(t\) is maximal, its matching map is \(\varnothing\to *\). The four objects of \(D\) are required by definition. Combining these facts gives the displayed least resolvers. \(\square\)

**Justification of the cone formula.** More generally, a diagram on \(J^\triangleright\) is a diagram \(A:J\to\mathcal S\), an object \(Y\), and a cocone \(A\to\Delta_JY\). Its limit is
\[
\left(\lim_JA\right)
\times_{\operatorname{Map}(BJ,Y)}Y.
\]
The first map is induced by the cocone; the second is the constant-map map. This follows by describing maps from a test space \(Z\): a cone over \(J^\triangleright\) consists of a natural transformation \(\Delta_JZ\to A\), a map \(Z\to Y\), and a homotopy between the resulting maps \(\Delta_JZ\to\Delta_JY\). When \(A=1\), the first factor is terminal, and the cocone for \(F\) represents the truncation map \(\eta\). The same argument applies to truncated spaces, whose limits and mapping spaces agree with those in spaces.

This is a deliberate generation-change example: the terminal input has value \(*\) at \(t\) in Set and \(S^1\) at \(t\) in groupoids. It does not challenge the monotonicity proved for the initial-singleton family or the nine-object example, both of which preserve left generation on old inputs. Its role is to show that this hypothesis separates two mathematically different regimes.

## General reversal theorem

The parent's proposed generalization is valid. For every nonempty finite poset \(J\), put \(C=\{x\}\star J\star\{t\}\), \(D=J\), \(U=J\star\{t\}\), and \(T_k=\tau_{\le k}BJ\), with \(T_\infty=BJ\). Then
\[
\mathsf A_k(D)=C\quad\text{if }T_k\simeq *,
\qquad
\mathsf A_k(D)=U\quad\text{otherwise}.
\]

In the cone calculation, truncation's universal property identifies
\[
\operatorname{Map}(BJ,T_k)\simeq\operatorname{Map}(T_k,T_k).
\]
The canonical cocone \(\eta\) becomes the identity, and constant maps remain constant. Hence the relevant pullback is the space of pairs consisting of a point of \(T_k\) and a homotopy from the identity to its constant map. It is nonempty precisely when \(T_k\) is contractible. This holds equally for disconnected \(T_k\): an identity map on a space with multiple components cannot be homotopic to a constant.

If the space is noncontractible, the same map-to-empty argument applies to every input diagram, not just the terminal one. If it is contractible, the terminal input already forces \(x\). The empty input forces \(t\) in both cases. There is no vacuous quantifier or omitted possibility, because the required subposet \(D\) leaves exactly the two candidates \(x,t\).

For \(J=Q_{d+1}\), \(d\ge1\), this gives an exact downward step at every desired degree: the least resolver has \(2d+4\) objects for \(k<d\), and \(2d+3\) objects for \(k\ge d\), including unrestricted spaces. A self-contained TeX statement and proof is saved in work/reversal.tex. This establishes a genuine obstruction to a general monotonicity theorem; the sufficient generation-preservation hypothesis was not just a convenience of the earlier proof.
