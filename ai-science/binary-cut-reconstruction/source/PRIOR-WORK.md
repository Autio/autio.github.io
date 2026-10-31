# Prior work and scope of the calculation

31 October 2026. Updated for version 2, including the universal quotient consequence.

The coefficient family, its polynomial filtration, its pointed restriction, and the general machinery of finite reconstruction all have substantial antecedents. This preprint presents a specific calculation within that established theory. The comparisons below explain its scope and record unresolved literature gaps; they do not guarantee first discovery.

## The calculation under examination

Work over a field `k` of characteristic two. On nonempty finite sets with **all** functions, let

\[
E_S=\mathbb F_2^S/\langle\mathbf1\rangle,
\qquad F_d(S)=J(k[E_S])/J(k[E_S])^d,\qquad d\ge2.
\]

Write `W_a=F_{a+1}^*`, extending its value at the empty set by zero when restricting to FI. It is the space of normalized Boolean polynomials of degree at most `a` invariant under simultaneous complementation.

The preprint computes the ordinary cardinality-reconstruction kernel and cokernel, every positive derived comparison group, and their natural maps. For `2 <= r < |S|`, with `Q_S=k^S/k1`, the positive groups are

\[
R^q\!\lim_{\varnothing\ne T\subseteq S,\ |T|\le r}^{\mathrm{op}}F_d(T)
\cong
\begin{cases}
\Lambda^rQ_S,&\max(1,r-d)\le q\le r-2,\\
0,&\text{otherwise},
\end{cases}\qquad q\ge1.
\]

It deduces the least uniform cardinality cutoff `d+h+1` for homotopy reconstruction of `K(F_d,h)`. An independent FI calculation gives

\[
H_i^{\mathrm{FI}}(W_{d-1})_n\cong
\begin{cases}
k_{\mathrm{triv}},&i+2\le n\le i+d,\\
0,&\text{otherwise},
\end{cases}\qquad i\ge0.
\]

These explicit formulas, including the all-map comparison and sharpness, are the results whose priority remains under examination. Version 2 also combines the sharp bound with a classical subfunctor classification to characterize every reconstructed natural linear quotient of `J`; that consequence is discussed separately below. The [finite verification supplement](checks/README.md) corroborates the proofs in bounded examples; it supplies no evidence about publication priority.

## Direct antecedents

| Source and checked location | Established content and relation to this preprint |
|---|---|
| [Greene–Welker–Wille, *On the homology of simplicial and cubical sets with symmetries*, §5.1, pp. 23–24; Theorem 2.2](https://arxiv.org/pdf/2508.14639v1) | The binary-string diagram modulo simultaneous complement, with deletion, duplication, and permutations, already appears explicitly. The cut module is its reduced linearization. Their example and theorem also exhibit coefficient-dependent homology. The underlying diagram and its use for a homological obstruction are not new. |
| [Powell, *The structure of the tensor product of F₂[−] with a finite functor between F₂-vector spaces* (2000), §2, p. 784](https://www.numdam.org/article/AIF_2000__50_3_781_0.pdf), and [*On artinian objects in the category of functors between F₂-vector spaces*, §2, pp. 7–8](https://math.univ-angers.fr/~powell/documents/1998/biel1998.pdf) | The reduced standard injective `Ī` and its polynomial filtration `p_a Ī`, with exterior-power factors, are classical. The exact identification here is `W_a(S) ≅ k ⊗ (p_a Ī)(U_S^0)`, where `U_S^0=ker(F₂[S]→F₂)`. The cited filtration statements are unnumbered; they should not be assigned a nearby definition's number. |
| [Richter, *Taylor towers for Γ-modules* (2001), §4.3, pp. 1007–1009](https://numdam.org/item/10.5802/aif.1842.pdf) | There is an exact pointed antecedent: `W_a` on root-preserving maps is Richter's `B_a`, and `F_{a+1}` is its ordinary objectwise linear dual `t^a`. Lemma 4.3 establishes polynomial degree; Lemma 4.4 gives a projective resolution; Theorem 4.5 computes the Taylor approximation through `Tor^Γ(t^a,−)`; Proposition 4.7 treats its layer. |
| [Pirashvili, *Hodge decomposition for higher order Hochschild homology* (2000), §1.4, p. 156, and §1.10, pp. 159–160](https://www.numdam.org/item/10.1016/s0012-9593%2800%2900107-5.pdf) | The pointed subset-basis functor `B` and its filtration `B_a` already occur here; removing the empty-subset constant gives the pointed `W_a`. The cross-effect equivalence with functors on finite sets and surjections makes the subfunctor classification used in version 2 an elementary corollary. The field in §1.1 is arbitrary; these particular results do not require characteristic zero. |
| [Andriatahiny, *The Generalized Reed–Muller codes and the radical powers of a modular algebra*, Theorem 3.6](https://arxiv.org/html/1601.07633) | The Berman–Charpin correspondence identifies generalized Reed–Muller codes with appropriate radical powers. Boolean degree, augmentation powers, and the associated binomial dimension counts are established mathematics. |
| [Powell–Vespa, *A Pirashvili-type theorem for functors on non-empty finite sets*, Corollary 7.4 and Theorem 6.15](https://arxiv.org/html/2009.10966), and [Powell, *Filtering the linearization of the category of surjections*, Definition 3.3, Theorem 4.5, Example 3.21](https://arxiv.org/html/2407.11627v6) | Labeled-surjection deletion kernels and their Koszul complexes are already computed. Powell's deletion filtration includes kernels of all bounded-subset restrictions. His characteristic-zero filtration theorem does not directly cover the characteristic-two unordered-cut quotient: taking target-`S₂` coinvariants need not preserve kernels or homology. Neither the deletion filtration nor a labeled two-color generator is new. |
| [Church–Ellenberg, *Homology of FI-modules*, Theorems A and C](https://arxiv.org/html/1506.01022), and [Gan–Li, *A remark on FI-module homology*, Theorem 1](https://doi.org/10.1307/mmj/1480734023) | The least ordinary FI presentation cutoff is already characterized by `max(t_0,t_1)`, and FI homology is computed by an established Koszul complex. Here the specific calculation gives `t_i=i+d` and regularity `d`. Inserting `t_0=d`, `t_1=d+1` into Church–Ellenberg's general bound gives only `t_i≤i+2d`; it does not give the exact homology strip or its representations. |
| [Miller–Patzt–Wilson, *Central stability for the homology of congruence subgroups and the second homology of Torelli groups*, Theorems 4.2, 3.26 and 3.30](https://arxiv.org/html/1704.04449v2) | Their Torelli example uses all Boolean polynomials of degree at most two in paired variables, not the normalized complement-invariant kernel `W_2`. Its displayed Boolean module decomposes into induced FI summands. The general stability and polynomial-degree results do not specify the homology strip above. This resolves that particular apparent match, not the entire Boolean-module literature. |
| [Hora–Kamio–Maehara, *Lawvere's fourth open problem: Levels in the topos of symmetric simplicial sets*, Lemma 2.3.6, Proposition 2.3.7 and Theorem 3.7.1](https://arxiv.org/html/2503.03439v2) | Ordinary symmetric-simplicial reconstruction through compatible subset data and cycle filling is explicit prior work. The set-valued dimensional bounds cannot simply be transferred to additive or homotopy Kan reconstruction. The subset formulation itself is not a new recognition theorem. |

The exact Richter identification can be seen without comparing dimensions. On a pointed set with root `0`, put `y_i=x_i+x_0`. The nonconstant squarefree `y`-monomials of degree at most `a` form a basis of `W_a`. A root-preserving map sends their supports to their images, killing a monomial if its image meets the root; repetitions reduce by `y_i²=y_i`. This is precisely `B_a`. An unpointed reconstruction calculation still needs compatibility as the root changes. Restricting to subsets containing one chosen root is not cofinal at the same cutoff: adjoining the root can increase cardinality from `r` to `r+1`.

The finite-vector-space identification is equally substantive. Functions on `(U_S^0)^*=E_S` pull back to complement-invariant functions on the Boolean cube; normalization removes constants. Thus this is a calculation after composition of a classical polynomial functor with the deleted permutation representation, not the introduction of a new polynomial family.

## Version 2: classification and the sharp universal quotient

The added algebraic lemma says that every natural linear subfunctor of `W_∞` is `W_a`, including `a=0,∞`. Dually, every natural linear subfunctor of `J` is zero or `J^d` for an integer `d≥1`. An objectwise ideal assumption is therefore unnecessary.

This classification should not be presented as an independent new recognition theorem. Under the classical cross-effect equivalence, the pointed restriction of `W_∞` has value `k` in each positive arity, generated by the full rooted monomial. Every surjection carries that generator to the corresponding generator. Its subfunctors have values zero or `k`, and their nonzero arities must form an initial segment. Exactness of the equivalence yields precisely the pointed `W_a`; restricting an unpointed subfunctor to pointed sets gives the same classification, because every nonempty set admits a root. This is an immediate application of the verified [Pirashvili §1.10 correspondence](https://www.numdam.org/item/10.1016/s0012-9593%2800%2900107-5.pdf), rather than a claim that the source states this unpointed corollary verbatim. [Powell–Vespa, Theorem 3.7](https://arxiv.org/html/2009.10966), also states the equivalence.

The direct proof uses commuting coordinate-erasure maps to project onto individual monomial lines, followed by identifications of variables to force all lower degrees. This mechanism is explicitly established in [Powell, *Functors on the category of finite sets revisited*, Definition 4.1, Lemma 4.2 and Proposition 4.3](https://arxiv.org/html/2407.11623v3): the Möbius idempotents are exactly the support projectors used here. Those results lie in Part I over an arbitrary unital commutative ring. The field hypothesis in our classification permits division by a nonzero extracted coefficient.

The consequence of combining that classification with the computed **unpointed** sharp cutoff is

\[
K(J/K_0,h)\text{ reconstructs from cardinalities at most }r
\quad\Longleftrightarrow\quad
J^{r-h-1}\subseteq K_0,
\qquad r\ge h+3,
\]

for every natural linear subfunctor `K_0⊂J`. Thus the universal largest such quotient is `J/J^(r-h-1)`: every qualifying specified quotient map factors uniquely through it. For positive `r<h+3`, only the zero quotient reconstructs. The unquotiented `J` never reconstructs at a finite cutoff.

The candidate new assertion here is the combined exact bound for **all quotients of this fixed functor**, not the classification mechanism or the polynomial filtration separately. Neither the classical equivalence nor the support projectors alone computes the all-cutoff unpointed right-Kan unit. Conversely, the necessity result does not classify arbitrary diagrams, choose the coefficient functor or observational cutoff, or extend to general coefficient rings or injection-only naturality. The algebra has independent proofs on the Boolean and augmentation sides; the sharp universal quotient consequence additionally uses the reconstruction calculation.

## General reconstruction and polynomial calculus

The following results provide established reconstruction frameworks. Differences of domain or variance identify a comparison that must be proved; they are not, by themselves, proofs of novelty.

| Checked source | Relevant statement and scope |
|---|---|
| [Arone–Ching, *Cross-effects and the classification of Taylor towers*, Proposition 3.15 and Theorems 3.78, 3.82](https://arxiv.org/pdf/1404.1417) | Reconstruction uses cross-effect comodule data and finite-set/surjection models for pointed spectrum-valued functors. The finite-set model uses left Kan extension. |
| [Arone–Ching, *A classification of Taylor towers of functors of spaces and spectra*, Corollary 3.16 and Theorem 3.19](https://arxiv.org/pdf/1209.5661) | Truncated derivatives with their coalgebra structure classify polynomial functors; a graded derivative sequence alone is insufficient. |
| [Glasman, *Goodwillie calculus and Mackey functors*, Theorem 6.1](https://arxiv.org/html/1610.03127v3), and [Barthel–Hilman–Konovalov, *On the universality of multiexcisive functors*, Theorem 5.2.4 and Corollary 5.3.2](https://arxiv.org/pdf/2604.02232) | Excisive functors admit finite-data classifications through spectral Mackey functors. Span/transfer structure and the stable targets are part of the hypotheses. |
| [Barnes–Kędziorek–Taggart, *A Dwyer–Rezk classification for polynomial functors in Weiss calculus*, Theorems 3.7–3.8](https://arxiv.org/html/2508.03808v2) | Polynomial Weiss functors are classified using bounded-dimensional inner-product spaces, with epimorphism and left-Kan models. |
| [Arro, *FI-calculus and representation stability*, Definition 2.1 and Theorem 2.9](https://kayaarro.site/pdf/FI-calculus.pdf) | Stable FI objects satisfying a specified Cartesian-cube polynomial condition are homotopy left Kan extensions from bounded cardinality. Boolean degree must not be identified with that condition without proof. |
| [Hem, *Cross effects for functors from posets*, Theorems 4.16–4.17, Proposition 4.20 and Theorems 5.15–5.16](https://arxiv.org/pdf/2604.09264) | Ordinary cross-degree approximation and projective-dimension recognition are established for specified posets. Ordinary total fibers do not detect the full derived matching obstruction. |
| [Turchin–Willwacher, *Hochschild–Pirashvili homology on suspensions and representations of Out(F_n)* (2019), Proposition 4.8, p. 781](https://www.numdam.org/item/10.24033/asens.2396.pdf) | The cardinality cofiltration is expressed by truncated cross-effects of right Γ-modules. The proof uses the truncated Γ–Ω equivalence. Cardinality/rank cofiltration is therefore established derived machinery. |

Other ingredients also have classical sources. [Powell, *Finite presheaves and A-finite generation of unstable algebras mod nilpotents*, Proposition 8.10 and Lemma 8.11](https://www.numdam.org/article/AIF_2019__69_5_2169_0.pdf) uses augmentation quotients and modular nilpotence to prove coanalyticity. [Wildon, §2](https://arxiv.org/html/1803.00465) describes the familiar exterior-power simplex-boundary modules. Neither augmentation polynomiality nor the representation `Λ^r Q` alone is a new assertion here. Classical Brunnian/sphere constructions, such as [Bartholdi–Mikhailov, equation (1.2)](https://londmathsoc.onlinelibrary.wiley.com/doi/full/10.1112/topo.12301), should likewise not be conflated with a new calculation for this finite-set diagram.

## Unresolved source gaps

**Intermont–Johnson–McCarthy remains a material gap.** Their [*The rank filtration and Robinson's complex*, JPAA 212 (2008), 735–752](https://doi.org/10.1016/j.jpaa.2007.07.009), directly relates bounded-cardinality left Kan approximations to a normalized complex computing stable derived invariants. The official abstract was available, but a readable full text was not obtained. No theorem number or assertion that their results cannot imply this calculation is made here. The exact approximation functors, comparison units, and any applicable examples still require full-text examination.

Full readable texts were also not obtained for Kuhn's [*Invariant subspaces of the ring of functions on a vector space over a finite field* (1997)](https://doi.org/10.1006/jabr.1996.6922) or *Generic representations of the finite general linear groups and the Steenrod algebra: I* (1994). Powell's accessible texts establish the classical-object identification above, but do not replace an exhaustive comparison with Kuhn's work.

The report consequently supports a narrow presentation: an explicit all-cutoff reconstruction and FI-homology calculation for an established modular functor, together with the resulting sharp universal quotient consequence. Its pointed family, filtration, and subfunctor-classification mechanism are credited to prior work. A matching formula not found in the inspected sources may exist under another description. This preprint makes no claim of a new general theory, a new coefficient family, or guaranteed first discovery.
