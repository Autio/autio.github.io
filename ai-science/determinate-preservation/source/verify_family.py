"""Reproducible finite checks for Determinate Preservation (Python stdlib).

Computes order-complex homology over F_2 using bitset Gaussian elimination.
Homology is an obstruction test, not a general contractibility oracle.
The manuscript supplies the homotopy and leastness proofs.
Exhausts every admissible full subposet for N=3,4; checks larger family members.
"""
from functools import lru_cache
from itertools import combinations
from math import comb
import json
from pathlib import Path


def gf2_rank(columns):
    pivots = {}
    for col in columns:
        while col:
            p = col.bit_length() - 1
            if p in pivots:
                col ^= pivots[p]
            else:
                pivots[p] = col
                break
    return len(pivots)


def strict_subset(x, y):
    return x != y and x & y == x


@lru_cache(None)
def homology(poset):
    """Nonreduced Betti numbers; an empty tuple means the empty complex."""
    if not poset:
        return ()
    simplices = [(v,) for v in poset]
    dimensions = []
    ranks = [0]
    previous = None
    while simplices:
        dimensions.append(len(simplices))
        if previous is not None:
            index = {s: i for i, s in enumerate(previous)}
            boundary = []
            for s in simplices:
                col = 0
                for j in range(len(s)):
                    col ^= 1 << index[s[:j] + s[j + 1:]]
                boundary.append(col)
            ranks.append(gf2_rank(boundary))
        previous = simplices
        simplices = [s + (v,) for s in previous for v in poset
                     if strict_subset(s[-1], v)]
    ranks.append(0)
    return tuple(dimensions[i] - ranks[i] - ranks[i + 1]
                 for i in range(len(dimensions)))


def acyclic_through(betti, k):
    return bool(betti) and betti[0] == 1 and not any(betti[1:k + 1])


def required_faces(n, k):
    if k >= n - 2:
        return set(range(1, (1 << n) - 1)), True
    return {s for s in range(1, (1 << n) - 1)
            if s.bit_count() >= n - k - 2}, False


def necessary_resolution(n, selected, include_a, k):
    """Check necessary homology conditions on every comma nerve.

    b is always included. At any included object the comma has an initial
    object. At an omitted nonempty face, its upper comma has just the
    selected strict supersets. At a it has all selected faces.
    """
    faces = range(1, (1 << n) - 1)
    if not include_a and not acyclic_through(homology(tuple(sorted(selected))), k):
        return False
    for s in faces:
        if s not in selected:
            upper = tuple(sorted(t for t in selected if strict_subset(s, t)))
            if not acyclic_through(homology(upper), k):
                return False
    return True


def exhaustive(n):
    faces = list(range(1, (1 << n) - 1))
    counts = [0] * (n - 1)
    examined = 0
    for mask in range(1 << (len(faces) + 1)):
        selected = {s for i, s in enumerate(faces) if mask & (1 << i)}
        include_a = bool(mask & (1 << len(faces)))
        examined += 1
        for k in range(n - 1):
            observed = necessary_resolution(n, selected, include_a, k)
            required, a_required = required_faces(n, k)
            predicted = required <= selected and (include_a or not a_required)
            assert observed == predicted, (n, k, selected, include_a)
            counts[k] += observed
    return {"N": n, "admissible_subposets_examined": examined,
            "homological_candidate_counts_by_k": counts,
            "least_level_cardinalities": [
                1 + len(required_faces(n, k)[0]) + required_faces(n, k)[1]
                for k in range(n - 1)],
            "interpretation": "Exhaustive necessary conditions agree with the proved levels."}


def family_checks(n):
    checks = []
    for k in range(n - 2):
        selected, _ = required_faces(n, k)
        betti = homology(tuple(sorted(selected)))
        expected = [1] + [0] * (k + 1)
        expected[k + 1] = comb(n - 1, k + 2)
        assert tuple(expected) == betti, (n, k, betti, expected)
        assert necessary_resolution(n, selected, False, k)
        assert not necessary_resolution(n, selected, False, k + 1)
        # Each mandatory face must really be mandatory, even when all other
        # objects (including a) are available.
        all_faces = set(range(1, (1 << n) - 1))
        for face in selected:
            assert not necessary_resolution(n, all_faces - {face}, True, k)
        checks.append({"k": k, "level_size": 1 + len(selected),
                       "comma_at_a_betti_F2": list(betti),
                       "predicted_sphere_dimension": k + 1,
                       "predicted_sphere_count": comb(n - 1, k + 2)})
    return {"N": n, "profile_checks": checks}


if __name__ == "__main__":
    results = {
        "method": "Exact finite-field arithmetic; homology checks supplement the written proof.",
        "exhaustive": [exhaustive(n) for n in (3, 4)],
        "larger_profiles": [family_checks(n) for n in (3, 4, 5, 6)],
        "limitations": "Homology does not generally certify simple connectivity or contractibility."
    }
    dest = Path(__file__).with_name("verification.json")
    dest.write_text(json.dumps(results, indent=2) + "\n", encoding="utf-8")
    print(json.dumps({"output": str(dest), "exhaustive": results["exhaustive"],
                      "larger_profiles_checked": [3, 4, 5, 6]}, indent=2))
