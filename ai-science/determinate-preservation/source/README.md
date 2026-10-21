# Determinate Preservation

Website publication: 22 October 2026. The paper and this explanatory page are now public on autio.github.io. No arXiv submission or journal publication is claimed. The downloadable full archive preserves the research snapshot prepared before website publication.

**Petri Mikael Autio — 22 October 2026**

*Hegelian Sublation and the Homotopy of Resolving Levels*

## Deliverables

- `../determinate-preservation.pdf`: revised research manuscript.
- `../research-source.zip`: full research record, source, code, data, and Astra reviews.
- `../arxiv-source.zip`: TeX sources and reproducibility material under `anc/`, prepared for author-controlled upload.
- `submission-readiness.md`: contribution, scope, and remaining priority question.
- `research-claims.md`: distinctions between established machinery and the results offered here.

## Build and reproduce

Compile `main.tex` with Tectonic. The tested build used Tectonic 0.17.0. The source uses ordinary LaTeX packages and Latin Modern fonts, with no external figures or BibTeX run. PDFLaTeX is the intended arXiv processor; the local validation used Tectonic's XeTeX-based engine, so arXiv's own compilation preview remains to be checked during any eventual submission.

Run these standard-library Python 3 programs from this directory:

```
python verify_family.py
python verify_matching.py
python verify_nonconstant.py
python verify_models.py
python verify_reversal.py
python verify_reader.py
```

They regenerate their JSON reports. `verify_matching.py` checks 121,774 ordinary reconstruction comparisons; the nonconstant example adds 1,152; the shrinking example adds 2,212. The original Boolean checks exhaust 128 and 32,768 admissible full subposets for N=3 and N=4. The sphere-layer and smallest-witness checks, plus the reader-data audit, have separate explicit scopes in their reports. The written proofs handle all coefficient objects and homotopy assertions. This is not proof-assistant verification.

## What changed in this research round

The manuscript now proves a general matching-support formula, exact growing profiles, an optimal six-object first jump for initial-singleton generation, a nonconstant example, and a family whose least resolver shrinks when generation changes. The reader comparison shows that invariant profiles can still conceal different choices of represented relation. An infinite-chain example identifies a boundary of leastness existence.

The second Astra mathematical and philosophical reports cover these revisions. The philosophical recheck prompted explicit scope fixes around the shrinking family. AI assistance is disclosed in the manuscript; these are internal AI reviews, not external human peer review.

## Status and resources

Published on the author’s website as a research manuscript; external specialist review and mathematical priority remain open. No arXiv or journal submission has been made. No affiliation was invented. Priority for the exact families and their combined deployment remains a question for specialist comparison. See the readiness note for a concrete assessment.

The work used two expressly authorized Astra reviewers. No separate paid API jobs, purchases, deployments, or GPU runs were launched. IMT's RTX 5090 was available but unnecessary for the small exact computations. An authoritative per-task dollar ledger is unavailable, so no verified dollar expenditure is asserted.
