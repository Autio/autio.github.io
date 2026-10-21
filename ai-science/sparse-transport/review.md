# Stage-three review and release status

21 October 2026. A compiled, reproducible research draft; independent human
mathematical review and priority remain open. This is not an arXiv submission.

The 22-page paper now includes a quantitative sharp Hall cutoff, two numerical
boundary types with exact deficit and one-vertex repair, and a complete
large-order single-matching treatment of distance-three stars. The short
[two-page note](theorem-note.pdf) isolates the structural cutoff for focused review.
See [priority-review.md](priority-review.md) for the close construction overlap
and explicit credit to prior weighted Hall, assignment, complement counting
and flow results.

The implemented hybrid bound is O(k⁵n²), with O(k³n²) at large order using
matching or shortcuts alone. The codegree-two argument removes the earlier
apparent eight-vertex exception. The O(k⁴n²) all-orders result uses a
classical AOST backend that has not been implemented. All bounds use indexed
word arithmetic and unreduced rational output, not a unit-cost assumption for
arbitrary-precision normalized Python Fractions.

## Checks and limits

- The final optional backend agrees with independent exact full transport on
  164,594 eligible edges in all 27,475 connected labeled graphs through six
  vertices; 53,900 ineligible edges are skipped by that optional-backend test.
  An independent star audit checks 35,072 cases. The default all-orders wrapper
  passes 5,659 edges of 839 graphs, including 1,418 fallback calls. These suites
  overlap; their counts are not independent graph coverage.
- The quantitative/boundary audit checks 366 full transport instances. A second
  boundary protocol checks 40 graph variations, all 168,320 target subsets,
  and 80 full transport values. These finite protocols corroborate the proofs.
- Fifteen substantive Lean modules compile with Lean/Mathlib 4.19.0. They include actual graph
  set/count bridges, weighted Hall by cloning, integer clone-transport baseline,
  real/integer unit-baseline feasibility, the graph quantitative bound and
  canonical maximizer, boundary paths and the four-codegree cover. The scalar
  restricted-set correction is conditional on an explicit margin. This is partial formalization;
  metric cancellation, general higher-cost integrality, the complete algorithm and
  runtime theorem remain outside an end-to-end formal proof.
- Five-trial comparisons include NetworkX, SciPy/HiGHS/assignment and POT.
  Baselines already use common-mass cancellation and appropriate aggregation.
  POT wins all ten generic transport-matrix medians. Dense all-edge structural
  workloads can benefit, but cold indexing loses badly on small batches and
  sparse graphs. The final star supplement is especially noisy on the shared
  host; exact coverage is stronger evidence than small timing differences.
- A separate full-size dual verifier passes 3,734 eligible small-graph edges
  and six larger controls and rejects three corrupted certificates. It checks
  every actual residual inequality and the exact objective, using BFS distances.
  This slow verifier is outside the fast algorithm and its benchmark clock.
  A feasible dual alone is a lower bound, not a primal plan; the independent
  transport comparison checks optimality on these test instances only.

## Reproducibility and submission

An additional all-orders codegree-two corollary classifies every defective
edge by A={y,z}, B={x,s,t}, with z nonadjacent to both s,t. Its curvature
deficit is (1+indicator(deg(z)=1))/(ab). A direct transport construction
proves this value without the general nested dual identity. Exact checks pass
179,074 edges and 622,148 Hall subsets on 21,199 eligible graphs through order
six. These overlap previous coverage. Its numerical witness type is checked
in Lean; the complete transport construction remains handwritten. The focused
primary-source search did not find this classification stated explicitly;
that does not establish priority.

The new [focused reproducibility archive](reproducibility-stage3.zip) includes
the final code and dependency closure, independent checks, recorded benchmark
observations, Lean sources/log, and source hashes. Only absolute local runtime
paths in public JSON/logs are redacted; observations and code are preserved.
The separate [arXiv source draft](arxiv-source-draft.zip) contains only main.tex
with an embedded bibliography. It compiles locally; arXiv's own processing
and preview have not been exercised.

The [historical stage-two archive](reproducibility-draft.zip), explicitly
approved for public inclusion, remains unchanged. Its SHA-256 is
9DD2EE4092AB275D9E395471CAB5B54808668FBE1CB17B80C1C838AF826CF22A.
It contains broader previous research artifacts and does not contain the new
single-matching revision.

The paper discloses substantial Codex/Astra assistance. Human authorship and
responsibility for the final contents, arXiv account/endorsement status,
category and license selection remain release decisions. arXiv requires
significant AI use to be reported and the human authors to take responsibility;
see its [AI policy](https://info.arxiv.org/help/moderation/index.html#policy-for-authors-use-of-generative-ai-language-tools).
Preparing sources or a public draft does not establish novelty or arXiv acceptance.
