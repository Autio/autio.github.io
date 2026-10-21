"""Exact small-poset and compact-sphere checks for the new examples.

The six-object lower-bound check collapses each relevant small order
complex to a graph, so simple connectivity is decided there by graph
cycle rank, not inferred from homology in an arbitrary complex.
"""
from itertools import combinations
from pathlib import Path
from functools import lru_cache
import json
from verify_matching import posets
from verify_family import gf2_rank


def order_complex(vertices, rel):
    simplices = {(v,) for v in vertices}
    frontier = list(simplices)
    while frontier:
        frontier = [s + (v,) for s in frontier for v in vertices
                    if (s[-1], v) in rel]
        simplices.update(frontier)
    return simplices


def graph_reduction(simplices):
    current = set(simplices)
    while any(len(s) >= 3 for s in current):
        facets = [s for s in current if len(s) >= 3
                  and not any(set(s) < set(t) for t in current)]
        free = None
        for sigma in facets:
            for tau in combinations(sigma, len(sigma) - 1):
                cofaces = [s for s in current if set(tau) < set(s)]
                if cofaces == [sigma]:
                    free = sigma, tau
                    break
            if free:
                break
        assert free is not None, "Small complex did not collapse to a graph"
        current.difference_update(free)
    vertices = {s[0] for s in current if len(s) == 1}
    edges = [s for s in current if len(s) == 2]
    components = 0
    unseen = set(vertices)
    while unseen:
        components += 1
        todo = [unseen.pop()]
        while todo:
            x = todo.pop()
            adjacent = {v for e in edges if x in e for v in e} & unseen
            unseen -= adjacent
            todo.extend(adjacent)
    return components, len(edges) - len(vertices) + components


def first_jump_checks():
    result = []
    for n in range(1, 7):
        examined = jumps = 0
        for above in posets(n - 1):
            rel = {(i + 1, j + 1) for i, j in above}
            rel |= {(0, j) for j in range(1, n)}
            examined += 1
            changes = []
            for x in range(1, n):
                upper = [j for i, j in rel if i == x]
                assert len(upper) <= 4
                components, cycles = graph_reduction(order_complex(upper, rel))
                if components == 1 and cycles:
                    changes.append(x)
            jumps += bool(changes)
        assert jumps == (1 if n == 6 else 0), (n, jumps)
        result.append({"objects": n, "initial_posets_examined": examined,
                       "naturally_labelled_posets_with_first_jump": jumps})
    return result


@lru_cache(None)
def layered_homology(m):
    vertices = list(range(2 * m))
    rel = {(i, j) for i in vertices for j in vertices if i // 2 < j // 2}
    simplices = order_complex(vertices, rel)
    chains = [sorted(s for s in simplices if len(s) == d + 1) for d in range(m)]
    ranks = [0]
    for d in range(1, m):
        index = {s: i for i, s in enumerate(chains[d - 1])}
        columns = []
        for s in chains[d]:
            bits = 0
            for i in range(len(s)):
                bits ^= 1 << index[s[:i] + s[i + 1:]]
            columns.append(bits)
        ranks.append(gf2_rank(columns))
    ranks.append(0)
    betti = [len(chains[d]) - ranks[d] - ranks[d + 1] for d in range(m)]
    expected = [1] + [0] * (m - 1)
    expected[m - 1] += 1
    assert betti == expected, (m, betti)
    return betti


if __name__ == "__main__":
    result = {"smallest_jump": first_jump_checks(),
              "sphere_layer_checks": [{"layers": m, "vertices": 2 * m,
                                       "betti_F2": layered_homology(m)}
                                      for m in range(1, 9)],
              "limits": "Only small upper intervals are collapsed to graphs; larger homology checks supplement the written sphere-join proof."}
    Path(__file__).with_name("models-verification.json").write_text(
        json.dumps(result, indent=2) + "\n", encoding="utf-8")
    print(json.dumps(result, indent=2))
