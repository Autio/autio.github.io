# Sharp reconstruction for truncated binary-cut diagrams

Petri Mikael Autio · 31 October 2026 · Research preprint, version 2

This archive contains the LaTeX source, four exact verification programs, recorded results, and a theorem-level prior-work comparison. The paper computes the ordinary and derived cardinality reconstruction of the augmentation quotients of binary-cut diagrams in characteristic two. It proves the sharp cutoff d+h+1 for the associated Eilenberg–Mac Lane diagrams and gives the FI homology of the dual Boolean module.

Version 2 adds the universal necessity result: for fixed r≥h+3, every natural linear quotient whose degree-h Eilenberg–Mac Lane diagram reconstructs from cardinality r factors uniquely through J/J^(r−h−1). This follows from the sharp calculation and the elementary classification of subfunctors of J. The classification is credited as a consequence of classical pointed cross-effect theory; it is not claimed as an independently new method or theorem.

The underlying coefficient families and polynomial filtration have established antecedents. The specific reconstruction computation is presented for scrutiny with priority unconfirmed. This is AI-assisted research with separate internal mathematical critiques; no external peer review or proof-assistant verification is claimed.

## Build the paper

`main.tex` is self-contained. With a current TeX Live or MiKTeX installation:

```text
pdflatex main.tex
pdflatex main.tex
```

Alternatively:

```text
tectonic main.tex
```

The distributed PDF was built using Tectonic 0.17.0 and the standard Latin Modern fonts. The source uses ordinary LaTeX packages and does not require external data, shell escape, custom fonts, or a bibliography processor. The compiler may download standard packages on its first run. Final pagination can vary slightly between TeX distributions.

## Reproduce the finite checks

Run Python 3.10 or later normally, without `-O`. No third-party packages are needed.

```text
python checks/verify-cut.py
python checks/verify-derived.py
python checks/verify-fi-independent.py --max-n 8 --max-degree 5
python checks/verify-natural-subfunctors.py --max-n 4
```

The programs write JSON beside themselves and work independently of the current directory. All included results passed. See [checks/README.md](checks/README.md) for constructions, ranges, check counts, and limitations.

The [prior-work report](PRIOR-WORK.md) distinguishes existing families and general methods from the proposed calculation and records literature-access limitations. The [original mathematical review](MATHEMATICAL-REVIEW.md) and [version 2 review](V2-REVIEW.md) are AI-generated internal critiques. They are included for transparency, not as certification by an external reviewer. The [change log](CHANGELOG.md) identifies the additions; version 1 remains archived on the publication page.

`SHA256SUMS` records the exact files in this source archive. Timings inside regenerated JSON may differ, so rerunning checks can change their hashes without changing the results.
