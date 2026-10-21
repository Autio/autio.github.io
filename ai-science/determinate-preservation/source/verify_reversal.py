"""Direct finite Set checks for the six-object shrinking example.

For D=Q_2, enumerate all Set diagrams with object sizes 0,1,2, form
their actual quotient-set colimits, and test every full resolver. The
higher result is a written proof; the JSON also records its degree
obstruction for the terminal input, not a proof-assistant certificate.
"""
from pathlib import Path
import json
from verify_matching import diagrams, comparison_is_bijection


J_REL = ((0, 2), (0, 3), (1, 2), (1, 3))
C_REL = {(0, j) for j in range(1, 6)}
C_REL |= {(i + 1, j + 1) for i, j in J_REL}
C_REL |= {(j, 5) for j in range(1, 5)}
UPPER = [{j for i, j in C_REL if i == x} for x in range(6)]


def extend(sizes, arrows):
    elements = [(d, v) for d in range(4) for v in range(sizes[d])]
    parent = {e: e for e in elements}

    def find(e):
        while parent[e] != e:
            parent[e] = parent[parent[e]]
            e = parent[e]
        return e

    for (i, j), values in arrows.items():
        for v, w in enumerate(values):
            parent[find((i, v))] = find((j, w))
    representatives = sorted({find(e) for e in elements})
    label = {e: representatives.index(find(e)) for e in elements}
    extended_sizes = (0,) + sizes + (len(representatives),)
    extended_maps = {(i + 1, j + 1): f for (i, j), f in arrows.items()}
    extended_maps.update({(0, j): () for j in range(1, 6)})
    extended_maps.update({(d + 1, 5): tuple(label[d, v] for v in range(sizes[d]))
                          for d in range(4)})
    for i, j in C_REL:
        for j2, k in C_REL:
            if j == j2:
                assert tuple(extended_maps[j, k][v] for v in extended_maps[i, j]) == extended_maps[i, k]
    return extended_sizes, extended_maps


if __name__ == "__main__":
    candidates = [{1, 2, 3, 4} | extras for extras in
                  (set(), {0}, {5}, {0, 5})]
    works = [True] * len(candidates)
    inputs = comparisons = 0
    for sizes, maps in diagrams(4, J_REL):
        inputs += 1
        xsizes, xmaps = extend(sizes, maps)
        for i, selected in enumerate(candidates):
            actual = all(comparison_is_bijection(x, UPPER[x] & selected, xsizes, xmaps)
                         for x in range(6) if x not in selected)
            works[i] &= actual
            comparisons += 1
    assert works == [False, False, False, True]
    # The degree data below recall the written proof, not an additional
    # numerical verification of arbitrary higher-coefficient diagrams.
    result = {"input_diagrams_examined": inputs,
              "direct_Set_reconstruction_comparisons": comparisons,
              "least_Set_resolver_size": 6,
              "terminal_input_higher_obstruction": {
                  "classifying_space": "S^1", "canonical_cocone_degree": 1,
                  "constant_map_degree": 0,
                  "conclusion_in_written_proof": "The coherent cone space is empty."},
              "scope": "Numerical enumeration is Set-valued only. All higher coefficients and all inputs are handled by the written map-to-empty argument."}
    Path(__file__).with_name("reversal-verification.json").write_text(
        json.dumps(result, indent=2) + "\n", encoding="utf-8")
    print(json.dumps(result, indent=2))
