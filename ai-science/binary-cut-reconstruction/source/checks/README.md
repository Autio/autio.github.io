# Exact verification scripts

Computational supplement to the binary-cut reconstruction and FI-homology results.

Requires **Python 3.10 or later**; tested with **CPython 3.14.7**. There are no third-party dependencies. All linear algebra uses exact arithmetic over the field with two elements. Run Python normally, without `-O`, because assertions report failed checks.

From this directory:

```text
python verify-cut.py
python verify-derived.py
python verify-fi-independent.py --max-n 8 --max-degree 5
python verify-natural-subfunctors.py --max-n 4
```

Each command writes its JSON result beside its own script, independently of the current working directory. To run from elsewhere, supply the path to the script. The included JSON files were regenerated from the scripts; all checks passed. Timing fields can vary between runs.

| Script | Construction and scope | Successful checks | Output |
|---|---|---|---|
| `verify-cut.py` | Actual cut restriction matrices and ordinary compatibility equations; 2≤n≤7, every cutoff 1≤r≤n | 27 kernel/cokernel cases | `cut-checks.json` |
| `verify-derived.py` | Normalized Roos complexes for the cut module V and augmentation quotients F_d; 1≤n≤5, every cutoff, and 2≤d≤n | 55 cohomology cases, including differential-square checks | `derived-checks.json` |
| `verify-derived.py` | Cochain pullbacks along every function between sets of sizes 1–3, cutoffs 1–3, for V, F_2, F_3 | 504 naturality cases, including noninjective maps | `derived-checks.json` |
| `verify-fi-independent.py` | Invariant bases solved directly from complementation matrices; FI Koszul complexes; 0≤n≤8 and Boolean degree 0≤a≤5 | 54 homology cases, 104,139 adjacent-transposition chain checks, 385 induced homology-action checks | `fi-independent-checks.json` |
| `verify-natural-subfunctors.py` | Exhaustive RREF enumeration of every subspace in original cut coordinates for 1≤n≤4, retaining spaces invariant under every set endomorphism; no ideal condition | 29,231 subspaces, 310 injection-image agreements, 2,161 maps of truncated diagrams | `natural-subfunctor-checks.json` |

The FI implementation imports none of the reconstruction code and does not use a rooted augmentation basis. It computes cycles and boundaries explicitly, then checks the symmetric-group action on the resulting quotient. Its a=0 cases test the zero module; the theorem's parameter is d=a+1≥2.

At four labels the new exhaustive check examines all 29,212 subspaces of the seven-dimensional cut module. Exactly four survive all 256 endomorphisms: 0, J³, J² and J, with dimensions 0, 1, 4 and 7. Enumeration counts agree with Gaussian binomial coefficients. Smaller components and compatibility under all maps are checked explicitly. This checks all candidate linear subspaces in the stated finite range rather than sampling only augmentation ideals.

The scripts establish the stated finite checks. The accompanying paper supplies the proofs for arbitrary parameters and the identification of the mathematical objects; computational agreement does not establish publication priority.

The two reconstruction scripts are copied unchanged except for the ordinary script's output-location adjustment. The independent FI script is copied unchanged. Version 2 adds the exhaustive subfunctor script and its results. `manifest.sha256` records the supplement's source and result files.
