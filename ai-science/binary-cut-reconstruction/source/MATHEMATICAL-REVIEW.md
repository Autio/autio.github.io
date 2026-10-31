# Mathematical review of the actual preprint

31 October 2026. Reviewed `main.tex` and compared its arguments with the earlier reconstruction and FI-homology notes. This report concerns proof validity and the scope of statements, not certification of bibliographic priority.

## Findings and correction

**No outstanding mathematical blocker remains in the revised draft examined during this review.** One genuine naturality overstatement was found in the initial draft and was corrected while the review was running.

The original matching-attachment proposition said that its displayed square was “natural” without qualification. In this all-functions paper that permits the false reading “natural under all ambient finite-set maps.” The product over exactly \(r\)-element subsets has no such general naturality. For example, take the constant nonzero vector-space diagram \(X=k\), let \(r=2\), and collapse \(\{1,2\}\) to a singleton. The induced map on \(L_2X\) is the identity \(k\to k\). The upper-right product is zero on the singleton and \(k\) on the pair. Naturality of the upper horizontal arrow would force the identity to factor through zero.

The revised proposition now says “natural in \(X\) and under ambient injections.” That is correct and resolves the issue. The main reconstruction theorem still has all-map naturality: its proof uses image-subset functors and the norm exact sequence, not the false stronger naturality of the attachment square. The unqualified naturality wording must not be restored during editing.

A snapshot after this correction and the pointed-family attribution additions had SHA-256 `3E25C5B4E305EE2568E3FA3D716D4D1D90FC6BD370DC19CBD3E54255FF5EC8D4`. Subsequent editorial changes need not preserve this hash.

## Ordinary unit: the proof was transferred correctly

The untruncated calculation in the manuscript is sufficient and avoids a dimension-only argument. Applying right exactness to

\[
H\longrightarrow P\xrightarrow{\Delta}H\longrightarrow0
\]

gives the stated presentation because the colimit of \(P\) is \(P_r(S)\), while the image of the preceding colimit is exactly \(H_{r-1}(S)\). The resulting structural comparison is genuinely induced by \(\Delta\), not an unrelated vector-space isomorphism. Its image is \(H_{r-1}\) and its kernel is \(H_r/H_{r-1}\).

The removal of constants is also legitimate. Evaluation at zero splits the original \(H\)-diagram naturally, and the constant structural comparison is an isomorphism because the subset category is connected for \(r\ge2\). In the quotient presentation, the constant in the *target* is represented by the class of a coordinate \(x_s\), not by the class of the constant polynomial. This distinction could be explained if a reader asks, but no incorrect use of constants appears in the proof.

For the filtered ordinary unit, both cases are correct:

- If \(d\ge r\), the restricted coefficient diagram agrees with the full cut diagram. Factoring its unit through \(J_S/J_S^d\) gives exactly \(J_S^r/J_S^d\) as kernel and preserves the cokernel. At \(d=r\), this kernel is zero.
- If \(r>d\), writing \(a=d-1\), every polynomial support in \(P_{a+1}\) fits inside the cutoff. Every invariant of degree at most \(a+1\) is a sum of rooted monomials supported on at most \(a+2=d+1\le r\) labels. Right exactness therefore proves that the **comparison map** for \(H_a\) is an isomorphism. Removing constants and dualizing proves the asserted unit isomorphism.

The requirement of one extra label for an invariant monomial is retained in the manuscript. This is where an erroneous cutoff \(d\), rather than \(d+1\), could have entered; it has not.

## Derived groups and all-map naturality

The acyclic-support lemma is valid for every polynomial degree \(b\), including \(b>r\). On the subset category, nonconstant supports yield covariant representables, so the middle diagram is projective. This argument uses no semisimplicity of symmetric-group representations. Its ordinary colimit has degree cutoff \(\min(b,r)\), as stated.

The filtered norm exact sequence, splitting by evaluation at zero, and connecting homomorphisms are all natural under arbitrary substitutions \(x_s\mapsto x_{f(s)}\). Coordinate collisions lower degree and do not invalidate these maps. Thus the induction

\[
L_jW_{d-1}\cong\bigoplus_{t=1}^{d-1}L_{j+t}k
\]

is naturally defined. A potentially non-natural choice of support decomposition was used only to prove acyclicity, not to define the final identifications.

Since the only positive constant-coefficient homology occurs in degree \(r-1\), the nonzero interval is precisely

\[
\max(1,r-d)\le j\le r-2.
\]

There is a single contributing summand in each such degree. The endpoints and multiplicity agree with the previous notes. The simplex contraction argument identifies the homology with \(\Lambda^rU_S\), and the induced set-map chain map sends a repeated-vertex simplex to zero. Dualization supplies the claimed \(\Lambda^rQ_S\) with all-map contravariance.

The image reduction has the correct adjunction direction and applies to homotopy limits. Working with a skeleton and then with actual subsets is harmless up to the usual equivalence of indexing categories. Noninjective probes are included before the reduction.

## Reconstruction fiber: the degree shift is correct

For the cohomological fiber \(\mathcal E=\operatorname{fib}(F_d(S)\to R\lim F_d)\), the long exact sequence gives

\[
H^0\mathcal E=\ker\eta,
\qquad H^1\mathcal E=\operatorname{coker}\eta,
\qquad H^j\mathcal E=R^{j-1}\lim F_d\quad(j\ge2).
\]

Consequently the displayed positive interval

\[
\max(1,r-d+1)\le j\le r-1
\]

is correct. It combines the ordinary cokernel in degree one with the shifted positive derived limits. All rows in the \(d=3\) example agree with this interval. There is no additional negative cohomology. The draft correctly avoids asserting a natural or equivariant splitting of the resulting derived object.

## Eilenberg–Mac Lane spaces and leastness

The manuscript includes the precise spectrum argument that was abbreviated in one earlier note: \(K(A,h)=\Omega^\infty\Sigma^hHA\), with the spectral limit allowed to be nonconnective. The single coefficient row and finite cohomological dimension yield the stated formula through \(\pi_0\). Thus the first omitted obstruction really creates additional components; it is not merely a nonzero negative spectral homotopy group discarded by \(\Omega^\infty\).

At \(r=d+h\), \(n=r+1\), and \(h\ge1\), degree \(h\) belongs to the derived interval because \(d\ge2\). The target component group is \(k\), whereas the source is connected. At \(h=0\), the ordinary cokernel proves failure at \(r=d\). At \(r\ge d+h+1\), all groups visible to the space-valued limit vanish except the correctly reconstructed degree \(h\) group.

The argument excluding all smaller cutoffs is valid: a right-Kan presentation from a smaller full subcategory restricts to the corresponding presentation on an intermediate full subcategory, and composition of right Kan extensions recovers the original presentation. Failure at the preceding cutoff therefore proves leastness.

## FI calculation and its exact scope

The FI proof is correct independently of the all-cutoff calculation. In particular:

- The support modules \(M_j\) are shown FI-acyclic by contracting their Koszul complexes. The proof does **not** incorrectly claim that their inducing trivial symmetric-group modules are projective in characteristic two.
- The module \(C\) has zero value at the empty set. Its complex is missing the top exterior term, leaving the determinant representation in degree \(n-1\). This is trivial in characteristic two. Treating \(C\) as the usual constant FI-module would break the proof; the manuscript expressly avoids that error.
- The induction in positive FI homological degrees gives one trivial representation at each cardinality \(i+2,\ldots,i+d\). These cardinalities are distinct, so no unresolved representation extension is being suppressed.
- The degree-zero case is proved separately. Right exactness and equality of dimensions show that \(H_0(A_a)\to H_0(C\oplus W_{a-1})\) is an isomorphism, which justifies the additional connecting isomorphism for \(H_0(W_a)\).
- The total-cofiber interpretation has the correct shift. Duality sends homological degree \(i\) of the FI complex to cohomological degree \(i\) of the reconstruction fiber. Thus \(H_0^{\mathrm{FI}}\) detects the ordinary kernel, \(H_1^{\mathrm{FI}}\) the ordinary cokernel, and higher groups the shifted derived limits.
- That comparison applies to the **full proper-subset cube**, namely \(r=|S|-1\), and does not by itself compute an arbitrary smaller cutoff. The manuscript explicitly preserves this distinction.

The displayed FI degrees also agree numerically with the all-cutoff fiber formula when \(r=n-1\). The ordinary cutoff \(d+1\) is consistent with generating degree \(d\) and relation degree \(d+1\). The stated general Church–Ellenberg bound \(t_i\le i+2d\) is consistent with those inputs; the manuscript's stronger equality is its explicit calculation.

## Attribution, wording, and minor presentation points

The revised antecedents section now explicitly acknowledges Richter's pointed coefficient family and Powell's reduced polynomial injective. This removes the earlier draft's weak treatment of exact family-level predecessors, which had merely deferred pointed comparisons to a companion report. The paper does not need a new coefficient family for its reconstruction computation to be worth presenting, but it must continue to separate those claims.

I have not independently certified the full bibliographic identification or theorem-level priority of the newly added Richter and Powell references in this review. Their supplied identifications are mathematically compatible with the rooted description. The current contribution wording is appropriately limited to the explicit calculation and its consequences, with no guarantee of first discovery. A contribution claim is still not a novelty certification.

Minor improvements that do not affect validity:

1. Define \(t_i(M)=\sup\{n:H_i^{\mathrm{FI}}(M)([n])\ne0\}\) and the convention for regularity when first used. The earlier FI note gives the latter convention, while the preprint currently assumes familiarity.
2. In the paragraph computing the FI homology of \(C\), say “for \(n\ge1\)” before discussing the deleted top term, and add that the complex is zero for \(n=0\). The formula and subsequent proof already handle the empty case correctly.
3. Keep the matching square's injection-only ambient naturality distinct from the all-map naturality of the final cohomology formulas.

The numerical claims about the bundled verification scripts were not rerun as part of this proof audit. The manuscript appropriately treats them as corroboration rather than a substitute for proof or a claim of external peer review.

**Final assessment:** the actual manuscript preserves the substantive proofs and their shifts correctly. After the matching-square naturality qualification already made, I found no mathematical reason to withhold a research preprint presenting these results with the stated attribution and priority limitations.

Editorial follow-up: the final manuscript defines the FI homological degrees and regularity and explicitly handles the empty-set complex. The comparison proposition retains injection-only ambient naturality.
