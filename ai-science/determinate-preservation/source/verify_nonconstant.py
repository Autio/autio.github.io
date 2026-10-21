"""Direct Set-valued right-Kan checks for the nonconstant nine-object example.

Uses independently enumerated compatible-tuple limits from verify_matching.
All nine pairs of canonical input sets of sizes 0, 1, 2 are used. This
supplements the written universal and higher-coefficient proofs.
"""
from itertools import product
from pathlib import Path
import json
from verify_matching import comparison_is_bijection


# p,a,q precede the six nonempty proper faces of a 3-element set.
names = ["p", "a", "q", "1", "2", "3", "12", "13", "23"]
face = {3: 1, 4: 2, 5: 4, 6: 3, 7: 5, 8: 6}
rel = {(0, 1)} | {(i, j) for i in (0, 1) for j in face}
rel |= {(i, j) for i in face for j in face
        if i != j and face[i] & face[j] == face[i]}
rel |= {(2, j) for j in (3, 6, 7)}
upper = [{j for i, j in rel if i == x} for x in range(9)]


def diagram(na, nb):
    tags = []
    for x in range(9):
        has_a = x != 2
        has_b = x in (2, 3, 6, 7)
        tags.append(tuple([("A", i) for i in range(na) if has_a]
                          + [("B", i) for i in range(nb) if has_b]))
    sizes = tuple(map(len, tags))
    maps = {(i, j): tuple(tags[j].index(tag) for tag in tags[i])
            for i, j in rel}
    # Check all composites rather than assuming the formulas are functorial.
    for i, j in rel:
        for j2, k in rel:
            if j == j2:
                assert (i, k) in rel
                assert tuple(maps[j, k][v] for v in maps[i, j]) == maps[i, k]
    return sizes, maps


if __name__ == "__main__":
    candidates = []
    checks = 0
    for mask in range(1 << 7):
        chosen = {0, 2} | {x for bit, x in enumerate([1, 3, 4, 5, 6, 7, 8])
                          if mask & (1 << bit)}
        works = True
        for na, nb in product(range(3), repeat=2):
            sizes, maps = diagram(na, nb)
            observed = all(comparison_is_bijection(x, upper[x] & chosen, sizes, maps)
                           for x in range(9) if x not in chosen)
            works &= observed
            checks += 1
        if works:
            candidates.append([names[x] for x in sorted(chosen)])
    predicted = [[n for n in names if n != "a"], names]
    assert sorted(map(sorted, candidates)) == sorted(map(sorted, predicted))
    result = {"objects": names, "input_set_sizes": [0, 1, 2],
              "admissible_full_subposets": 128, "diagram_reconstruction_checks": checks,
              "set_resolvers_for_test_family": candidates,
              "least_size": 8,
              "limitations": "Finite Set checks; written proof handles arbitrary sets and higher types."}
    Path(__file__).with_name("nonconstant-verification.json").write_text(
        json.dumps(result, indent=2) + "\n", encoding="utf-8")
    print(json.dumps(result, indent=2))
