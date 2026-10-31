"""Independent exact FI-homology check of invariant Boolean polynomials.

No prior Roos, cut, rooted-coordinate, or augmentation-ideal implementation is
imported.  Invariant bases are solved as kernels of actual complementation
matrices.  FI Koszul homology is computed from inclusions of polynomials.
Adjacent transpositions are checked on chains and on cycle/boundary quotients.

Run: python outputs/verify-fi-independent.py --max-n 8 --max-degree 5
Python standard library only; all arithmetic is exact GF(2).
"""
from __future__ import annotations

import argparse
from functools import lru_cache
import hashlib
import json
from pathlib import Path
import time


def bits(x):
    while x:
        b = x & -x
        yield b.bit_length() - 1
        x ^= b


def linear_apply(columns, vector):
    out = 0
    for i in bits(vector):
        out ^= columns[i]
    return out


class Span:
    def __init__(self, vectors=()):
        self.pivots = {}
        for v in vectors:
            self.add(v)

    def reduce(self, value):
        while value:
            p = value.bit_length() - 1
            if p not in self.pivots:
                break
            value ^= self.pivots[p]
        return value

    def add(self, value):
        value = self.reduce(value)
        if not value:
            return False
        self.pivots[value.bit_length() - 1] = value
        return True

    def __len__(self):
        return len(self.pivots)


def nullspace(columns):
    """Return a kernel basis by keeping actual column-dependency certificates."""
    pivots = {}
    dependencies = []
    for j, column in enumerate(columns):
        relation = 1 << j
        while column:
            p = column.bit_length() - 1
            if p in pivots:
                previous_column, previous_relation = pivots[p]
                column ^= previous_column
                relation ^= previous_relation
            else:
                pivots[p] = column, relation
                break
        if not column:
            dependencies.append(relation)
    return dependencies


def complement_difference(monomial):
    """(1+tau)x_A is the sum of x_B over all proper B subset A."""
    out = 0
    b = monomial
    while b:
        b = (b - 1) & monomial
        out ^= 1 << b
    return out


@lru_cache(None)
def invariant_basis(size, degree):
    # The constant monomial is excluded, imposing f(0)=0 independently.
    monomials = [m for m in range(1, 1 << size) if m.bit_count() <= degree]
    columns = [complement_difference(m) for m in monomials]
    dependencies = nullspace(columns)
    polys = [sum(1 << monomials[j] for j in bits(dep)) for dep in dependencies]
    for p in polys:
        assert not p & 1, "normalization failed"
        assert not linear_apply(columns, sum(1 << monomials.index(m) for m in bits(p))), "noninvariant basis polynomial"
    return tuple(polys)


def relabel_mask(mask, image):
    out = 0
    for i in bits(mask):
        out |= 1 << image[i]
    return out


def relabel_polynomial(poly, image):
    out = 0
    for m in bits(poly):
        out ^= 1 << relabel_mask(m, image)
    return out


class PolynomialBasis:
    def __init__(self, vectors):
        self.vectors = tuple(vectors)
        self.pivots = {}
        for j, v in enumerate(self.vectors):
            coordinates = 1 << j
            while v:
                p = v.bit_length() - 1
                if p in self.pivots:
                    previous, previous_coordinates = self.pivots[p]
                    v ^= previous
                    coordinates ^= previous_coordinates
                else:
                    self.pivots[p] = v, coordinates
                    break
            assert v, "dependent invariant basis"

    def coordinates(self, poly):
        out = 0
        while poly:
            p = poly.bit_length() - 1
            assert p in self.pivots, "polynomial outside invariant target"
            v, coordinates = self.pivots[p]
            poly ^= v
            out ^= coordinates
        return out


def build_complex(n, degree):
    full = (1 << n) - 1
    spaces = {}
    for subset in range(1 << n):
        labels = tuple(bits(subset))
        polys = [relabel_polynomial(p, labels)
                 for p in invariant_basis(len(labels), degree)]
        spaces[subset] = PolynomialBasis(polys)
    chain_basis = [[] for _ in range(n + 1)]
    offsets = {}
    for subset, space in spaces.items():
        i = n - subset.bit_count()
        offsets[subset] = len(chain_basis[i])
        chain_basis[i].extend((subset, p) for p in space.vectors)
    differentials = []
    for i, basis in enumerate(chain_basis):
        columns = []
        for subset, poly in basis:
            result = 0
            for s in bits(full ^ subset):
                bigger = subset | (1 << s)
                # Inclusions do not change the polynomial; only its basis.
                result ^= spaces[bigger].coordinates(poly) << offsets[bigger]
            columns.append(result)
        if i == 0:
            assert not any(columns)
        differentials.append(columns)
    return spaces, chain_basis, offsets, differentials


def check_case(n, degree):
    started = time.perf_counter()
    spaces, bases, offsets, differentials = build_complex(n, degree)
    for i in range(2, len(differentials)):
        for col in differentials[i]:
            assert linear_apply(differentials[i - 1], col) == 0, "differential squared nonzero"
    boundaries, homology_reps, dimensions, ranks = [], [], [], []
    for i, basis in enumerate(bases):
        incoming = differentials[i + 1] if i + 1 < len(bases) else []
        boundary = Span(incoming)
        boundaries.append(boundary)
        cycles = nullspace(differentials[i])
        quotient_span = Span(incoming)
        representatives = []
        for z in cycles:
            if quotient_span.add(z):
                representatives.append(z)
        homology_reps.append(representatives)
        dimensions.append(len(representatives))
        ranks.append(len(Span(differentials[i])))
        assert len(cycles) == len(basis) - ranks[-1]
        assert dimensions[-1] == len(cycles) - len(boundary)
    expected = [int(i + 2 <= n <= i + degree + 1) for i in range(n + 1)]
    # degree zero is independently included as an edge case; its interval is empty.
    assert dimensions == expected, (n, degree, dimensions, expected)

    chain_commutations = 0
    homology_actions = 0
    for s in range(max(0, n - 1)):
        permutation = list(range(n))
        permutation[s], permutation[s + 1] = permutation[s + 1], permutation[s]
        action = []
        for basis in bases:
            columns = []
            for subset, poly in basis:
                target = relabel_mask(subset, permutation)
                target_poly = relabel_polynomial(poly, permutation)
                coords = spaces[target].coordinates(target_poly)
                columns.append(coords << offsets[target])
            action.append(columns)
        for i in range(1, len(bases)):
            for j, col in enumerate(differentials[i]):
                lhs = linear_apply(differentials[i], action[i][j])
                rhs = linear_apply(action[i - 1], col)
                assert lhs == rhs, (n, degree, s, i, j, "action not a chain map")
                chain_commutations += 1
        for i, reps in enumerate(homology_reps):
            for z in reps:
                difference = linear_apply(action[i], z) ^ z
                assert boundaries[i].reduce(difference) == 0, (n, degree, s, i, "nontrivial homology action")
                homology_actions += 1
    return {
        "n": n, "polynomial_degree_a": degree, "augmentation_cutoff_d": degree + 1,
        "invariant_space_dimension": len(spaces[(1 << n) - 1].vectors),
        "chain_dimensions": [len(b) for b in bases], "differential_ranks": ranks,
        "homology_dimensions": dimensions, "expected_dimensions": expected,
        "d_squared_zero": True, "adjacent_transposition_chain_commutations": chain_commutations,
        "homology_generator_action_checks": homology_actions,
        "homology_action_is_trivial": True, "elapsed_seconds": round(time.perf_counter() - started, 6),
        "pass": True,
    }


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--max-n", type=int, default=8)
    parser.add_argument("--max-degree", type=int, default=5)
    parser.add_argument("--output", type=Path)
    args = parser.parse_args()
    started = time.perf_counter()
    results = []
    for n in range(args.max_n + 1):
        for degree in range(args.max_degree + 1):
            result = check_case(n, degree)
            results.append(result)
            print(json.dumps({"n": n, "a": degree, "homology": result["homology_dimensions"],
                              "seconds": result["elapsed_seconds"]}), flush=True)
    report = {
        "field": "F_2", "implementation": "translation-kernel Boolean basis + FI Koszul matrices",
        "imports_prior_reconstruction_code": False, "max_n": args.max_n, "max_polynomial_degree": args.max_degree,
        "cases": results, "case_count": len(results),
        "adjacent_transposition_chain_commutations": sum(r["adjacent_transposition_chain_commutations"] for r in results),
        "homology_generator_action_checks": sum(r["homology_generator_action_checks"] for r in results),
        "all_pass": all(r["pass"] for r in results),
        "elapsed_seconds": round(time.perf_counter() - started, 6),
        "script_sha256": hashlib.sha256(Path(__file__).read_bytes()).hexdigest(),
    }
    target = args.output or Path(__file__).with_name("fi-independent-checks.json")
    target.write_text(json.dumps(report, indent=2) + "\n", encoding="utf-8")
    print(json.dumps({key: value for key, value in report.items() if key != "cases"}), flush=True)


if __name__ == "__main__":
    main()
