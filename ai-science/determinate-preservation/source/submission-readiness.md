# Submission readiness — 22 October 2026

The result is a substantive research preprint in philosophy of mathematical formalization, with explicit categorical and homotopical propositions. It has a coherent affirmative thesis, complete written proofs, primary-source comparisons, reproducible finite checks, and two rounds of internal Astra critique. It is ready for the author's close reading and specialist feedback.

## Strongest contribution

The most distinctive mathematical addition is the shrinking family: the least resolver can drop after coefficient enrichment when left generation changes. The main growing family holds generation fixed, so the contrast establishes why that hypothesis matters. The reader audit independently shows why an invariant profile is insufficient to justify the represented relations. These three behaviors give the philosophical argument substance beyond a generic reminder that models have parameters.

## What has been checked

- The mathematical reviewer independently checked the general reconstruction theorem, increasing and decreasing families, small examples, six-object lower bound, infinite boundary, and reader proposition.
- The philosophical reviewer checked the strengthened thesis, textual scope, treatment of nLab, Priest and Brown, Hentrup comparison, DeBruce audit, and the final growth/shrinkage qualifications.
- Exact Python checks cover the explicitly enumerated finite cases. Homology is not used as a general substitute for simple connectivity or contractibility.
- The manuscript compiles locally; source dependencies, citations, and cross-reference targets are checked. The final PDF is visually inspected. A clean-package rebuild is recorded in `build-validation.json`.

## Remaining limits

Mathematical priority is not independently established. The exact formulations should be compared by a specialist with work on Reedy reconstruction, finite-space reductions, and higher cofinality. The existing ordinary results are credited explicitly.

No human external peer review has occurred. No theorem has been formally checked in a proof assistant. The DeBruce comparison inspects the public source and does not claim an independent Agda rebuild. Yang-related claims remain limited to the accessible publisher abstract. These boundaries are stated in the manuscript and audit.

## Prepared arXiv package

The archive provides `main.tex`, its included TeX files, and ancillary reproducibility files. It includes neither the compiled PDF nor internal review reports. The full research archive separately preserves those reports.

My suggested primary classification is **math.HO**, because the paper's central claim concerns philosophy of mathematical formalization; **math.CT** is a plausible secondary classification given the Kan-extension and level calculations. This is a recommendation based on the [official taxonomy](https://arxiv.org/category_taxonomy), not a moderation decision. The [official TeX guidance](https://info.arxiv.org/help/submit_tex.html) is the reference for the eventual upload and preview. The package has been locally tested with Tectonic; arXiv-side compilation and classification are not yet tested.

The manuscript is now public on the author’s website. No arXiv or journal submission has been initiated. Title, byline, and abstract are prepared in `submission-metadata.txt`; no affiliation or email has been invented.
