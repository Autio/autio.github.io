"""Independent finite Set-valued checks of the matching-support criterion.

Enumerates all naturally labelled posets on at most four objects and every
functor whose object sets are the canonical sets of cardinality 0, 1, or 2.
For every full subposet, compares the actual pointwise right-Kan unit with
the support predicted by the strict-upper matching maps. All finite limits
are enumerated as compatible tuples, with no homology or nerve shortcut.
This is a finite test of the ordinary case, not a proof of the infinity-
categorical assertion. Run with Python 3; no third-party packages needed.
"""

from itertools import combinations, product
from pathlib import Path
import json


def posets(n):
    pairs = list(combinations(range(n), 2))
    for bits in range(1 << len(pairs)):
        rel = {pair for j, pair in enumerate(pairs) if bits & (1 << j)}
        if all((i, k) in rel for i, j in rel for j2, k in rel if j == j2):
            yield tuple(sorted(rel))


def functions(a, b):
    return tuple(product(range(b), repeat=a))


def diagrams(n, rel):
    triples = [(i, j, k) for i, j in rel for j2, k in rel if j == j2]
    for sizes in product(range(3), repeat=n):
        choices = [functions(sizes[i], sizes[j]) for i, j in rel]
        for selected in product(*choices):
            maps = dict(zip(rel, selected))
            if all(tuple(maps[j, k][v] for v in maps[i, j]) == maps[i, k]
                   for i, j, k in triples):
                yield sizes, maps


def finite_limit(objects, sizes, maps):
    """The empty limit is represented by the singleton empty tuple."""
    objects = tuple(sorted(objects))
    positions = {v: i for i, v in enumerate(objects)}
    arrows = [(i, j) for i, j in maps if i in positions and j in positions]
    return {
        values for values in product(*(range(sizes[i]) for i in objects))
        if all(maps[i, j][values[positions[i]]] == values[positions[j]]
               for i, j in arrows)
    }


def comparison_is_bijection(x, upper, sizes, maps):
    upper = tuple(sorted(upper))
    target = finite_limit(upper, sizes, maps)
    image = [tuple(maps[x, y][v] for y in upper) for v in range(sizes[x])]
    return len(set(image)) == len(image) and set(image) == target


def check(n):
    nposets = ndiagrams = ncomparisons = nonconstant = 0
    for rel in posets(n):
        nposets += 1
        strict_upper = [{y for a, y in rel if a == x} for x in range(n)]
        for sizes, maps in diagrams(n, rel):
            ndiagrams += 1
            if len(set(sizes)) > 1:
                nonconstant += 1
            support = {x for x in range(n)
                       if not comparison_is_bijection(x, strict_upper[x], sizes, maps)}
            for mask in range(1 << n):
                chosen = {i for i in range(n) if mask & (1 << i)}
                actual = all(
                    comparison_is_bijection(x, strict_upper[x] & chosen, sizes, maps)
                    for x in range(n) if x not in chosen
                )
                assert actual == (support <= chosen), (n, rel, sizes, maps, chosen)
                ncomparisons += 1
    return {"objects": n, "naturally_labelled_posets": nposets,
            "set_valued_diagrams": ndiagrams,
            "diagrams_with_varying_cardinality": nonconstant,
            "full_subposet_reconstruction_checks": ncomparisons}


if __name__ == "__main__":
    result = {"method": "Exhaustive compatible-tuple finite limits in Set.",
              "cases": [check(n) for n in range(1, 5)],
              "limitations": "Canonical object sets have cardinalities 0, 1, 2; this is not proof-assistant verification."}
    output = Path(__file__).with_name("matching-verification.json")
    output.write_text(json.dumps(result, indent=2) + "\n", encoding="utf-8")
    print(json.dumps(result, indent=2))
