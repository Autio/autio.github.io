"""Exact finite checks for reciprocal causal abstraction (Python 3.10+).

No third-party dependencies. Models are deterministic, finite, and have no
self-dependent mechanisms. Simplicity means exactly one equilibrium for every
partial assignment of coordinates. Abstraction means componentwise surjections
with pointwise commuting mechanism equations; no equilibrium claim is assumed.

The enumeration uses equations directly. The graph criterion is checked only
after computing the solution sets. Results contain no clock-dependent fields.
"""

from __future__ import annotations

import argparse
import hashlib
import itertools as it
import json
import math
from collections import Counter
from pathlib import Path


def tuples(sizes):
    return tuple(it.product(*(range(n) for n in sizes)))


def partitions(n):
    """Canonical surjections: one restricted-growth string per set partition."""
    def extend(prefix):
        if len(prefix) == n:
            yield prefix
        else:
            for label in range(max(prefix) + 2):
                yield from extend(prefix + (label,))
    yield from extend((0,))


def kind(q):
    # A singleton map is both constant and injective; classify it as injective.
    if len(set(q)) == len(q):
        return "injective"
    if len(set(q)) == 1:
        return "constant"
    return "partial"


def clamps(sizes):
    return tuple(it.product(*((None,) + tuple(range(n)) for n in sizes)))


def solution_table(points, outputs, all_clamps):
    """Solve all interventions, directly filtering the finite Cartesian set."""
    answer = {}
    for clamp in all_clamps:
        answer[clamp] = tuple(
            x for x, fx in zip(points, outputs)
            if all(x[i] == (fx[i] if v is None else v)
                   for i, v in enumerate(clamp))
        )
    return answer


def is_simple(solutions):
    return all(len(v) == 1 for v in solutions.values())


def descend(points, outputs, qs):
    """Construct G only if qF is constant on each q-fibre, by direct comparison."""
    table = {}
    for x, fx in zip(points, outputs):
        y = tuple(q[xi] for q, xi in zip(qs, x))
        gy = tuple(q[fi] for q, fi in zip(qs, fx))
        if y in table and table[y] != gy:
            return None
        table[y] = gy
    sizes = tuple(max(q) + 1 for q in qs)
    yp = tuples(sizes)
    return yp, tuple(table[y] for y in yp), sizes


def matches_all_interventions(fine, coarse, qs):
    for clamp, sols in fine.items():
        macro_clamp = tuple(None if v is None else q[v]
                            for q, v in zip(qs, clamp))
        projected = {tuple(q[v] for q, v in zip(qs, x)) for x in sols}
        if projected != set(coarse[macro_clamp]):
            return False
    return True


def dependency_edges(points, outputs):
    """Actual table dependencies, not the solved-equation graph of an SCM."""
    n = len(points[0])
    edges = set()
    for j in range(n):
        seen = {}
        for x, fx in zip(points, outputs):
            key = x[:j] + x[j + 1:]
            if key in seen:
                for i in range(n):
                    if seen[key][i] != fx[i]:
                        edges.add((j, i))
            else:
                seen[key] = fx
    return edges


def directed_cycle(vertices, edges):
    vertices = set(vertices)
    children = {v: sorted(b for a, b in edges if a == v and b in vertices)
                for v in vertices}
    done = set()
    path = []
    visiting = set()

    def visit(v):
        if v in visiting:
            return tuple(path[path.index(v):])
        if v in done:
            return None
        visiting.add(v)
        path.append(v)
        for w in children[v]:
            found = visit(w)
            if found is not None:
                return found
        path.pop()
        visiting.remove(v)
        done.add(v)
        return None

    for v in sorted(vertices):
        found = visit(v)
        if found is not None:
            return found
    return None


def structural_certificate(points, outputs, qs):
    partial = {i for i, q in enumerate(qs) if kind(q) == "partial"}
    return directed_cycle(partial, dependency_edges(points, outputs)) is None


def hidden_dependency_edges(points, outputs, qs):
    """j -> i when F_i distinguishes values of j merged by q_j."""
    n = len(qs)
    edges = set()
    for j in range(n):
        seen = {}
        for x, fx in zip(points, outputs):
            key = (x[:j] + x[j + 1:], qs[j][x[j]])
            if key in seen:
                for i in range(n):
                    if fx[i] != seen[key][i]:
                        edges.add((j, i))
            else:
                seen[key] = fx
    return edges


def upgrade_checks(points, outputs, qs):
    """Compare the closure rule with actual descent for every full upgrade."""
    n = len(qs)
    eligible = [i for i, q in enumerate(qs) if len(set(q)) < len(q)]
    partial = {i for i, q in enumerate(qs) if kind(q) == "partial"}
    edges = dependency_edges(points, outputs)
    hidden = hidden_dependency_edges(points, outputs, qs)
    candidates = []
    for bits in it.product((False, True), repeat=len(eligible)):
        retained = {i for i, bit in zip(eligible, bits) if bit}
        refined = tuple(tuple(range(len(q))) if i in retained else q
                        for i, q in enumerate(qs))
        closed = all(i not in retained or j in retained for j, i in hidden)
        actually_descends = descend(points, outputs, refined) is not None
        assert closed == actually_descends
        graph_safe = directed_cycle(partial - retained, edges) is None
        candidates.append({"retained": sorted(retained), "closed": closed,
                           "descends": actually_descends, "graph_safe": graph_safe})
    graph_minimum = min(len(c["retained"]) for c in candidates if c["graph_safe"])
    actual_minimum = min(len(c["retained"]) for c in candidates
                         if c["graph_safe"] and c["descends"])
    assert graph_minimum <= actual_minimum
    return {"hidden_dependency_edges": sorted(hidden), "candidates": candidates,
            "graph_minimum": graph_minimum, "descending_certificate_minimum": actual_minimum}


def two_component_enumeration():
    records = []
    totals = Counter()
    upgrades = Counter()
    gap_example = None
    smallest = None
    for na in range(1, 4):
        for nb in range(1, 4):
            sizes = (na, nb)
            points = tuples(sizes)
            interventions = clamps(sizes)
            quotient_pairs = tuple(it.product(partitions(na), partitions(nb)))
            counts = Counter()
            by_types = {}
            unsafe_quotients = set()
            for f in it.product(range(na), repeat=nb):
                for g in it.product(range(nb), repeat=na):
                    outputs = tuple((f[b], g[a]) for a, b in points)
                    fine = solution_table(points, outputs, interventions)
                    simple = is_simple(fine)
                    counts["networks"] += 1
                    counts["simple_networks"] += int(simple)
                    for qs in quotient_pairs:
                        counts["network_quotient_pairs"] += 1
                        result = descend(points, outputs, qs)
                        if result is None:
                            continue
                        counts["compatible_pairs"] += 1
                        upgrade = upgrade_checks(points, outputs, qs)
                        upgrades["compatible_base_pairs"] += 1
                        upgrades["refinement_candidates_checked"] += len(upgrade["candidates"])
                        upgrades["descending_candidates"] += sum(c["descends"] for c in upgrade["candidates"])
                        gap = upgrade["descending_certificate_minimum"] > upgrade["graph_minimum"]
                        upgrades["base_pairs_with_graph_vs_descent_cost_gap"] += int(gap)
                        if simple and gap:
                            upgrades["simple_base_pairs_with_cost_gap"] += 1
                            if gap_example is None:
                                gap_example = {"sizes": sizes, "f_A_from_B": f,
                                               "f_B_from_A": g, "quotients": qs,
                                               **upgrade}
                        if not simple:
                            continue
                        counts["simple_compatible_pairs"] += 1
                        yp, gy, ysizes = result
                        coarse = solution_table(yp, gy, clamps(ysizes))
                        safe = matches_all_interventions(fine, coarse, qs)
                        assert safe == is_simple(coarse)
                        counts["safe_simple_pairs" if safe else "unsafe_simple_pairs"] += 1
                        key = "/".join(map(kind, qs))
                        rec = by_types.setdefault(key, Counter())
                        rec["compatible_simple"] += 1
                        rec["safe" if safe else "unsafe"] += 1
                        certificate = structural_certificate(points, outputs, qs)
                        counts["certified_simple_pairs"] += int(certificate)
                        if certificate:
                            assert safe
                        if not safe:
                            assert all(kind(q) == "partial" for q in qs)
                            unsafe_quotients.add(qs)
                            candidate = {
                                "sizes": sizes, "f_A_from_B": f,
                                "f_B_from_A": g, "quotients": qs,
                                "fine_equilibria": fine[(None, None)],
                                "coarse_equilibria": coarse[(None, None)],
                            }
                            if smallest is None or na * nb < math.prod(smallest["sizes"]):
                                smallest = candidate
            expected = {qs for qs in quotient_pairs
                        if all(kind(q) == "partial" for q in qs)}
            assert unsafe_quotients == expected
            counts["quotient_pairs_with_unsafe_simple_witness"] = len(unsafe_quotients)
            records.append({"sizes": sizes, "counts": dict(sorted(counts.items())),
                            "by_quotient_types": {k: dict(v) for k, v in sorted(by_types.items())}})
            totals.update(counts)
    return {"bounds": "Every no-self two-component function, domain sizes 1..3; every set partition once",
            "totals": dict(sorted(totals.items())), "cases": records,
            "retention_checks": {"counts": dict(sorted(upgrades.items())),
                                 "first_simple_cost_gap_example": gap_example},
            "smallest_unsafe_simple_pair": smallest}


def three_bit_enumeration():
    sizes = (2, 2, 2)
    points = tuples(sizes)
    interventions = clamps(sizes)
    local = tuple(it.product(range(2), repeat=4))
    qs_all = tuple(it.product(((0, 1), (0, 0)), repeat=3))
    parent_indices = tuple(tuple(2 * x[(i + 1) % 3] + x[(i + 2) % 3]
                                 for x in points) for i in range(3))
    counts = Counter()
    by_simple = Counter()
    for fs in it.product(local, repeat=3):
        outputs = tuple(tuple(fs[i][parent_indices[i][k]] for i in range(3))
                        for k in range(8))
        fine = solution_table(points, outputs, interventions)
        simple = is_simple(fine)
        counts["networks"] += 1
        counts["simple_networks"] += int(simple)
        for qs in qs_all:
            counts["network_quotient_pairs"] += 1
            result = descend(points, outputs, qs)
            if result is None:
                continue
            counts["compatible_pairs"] += 1
            if not simple:
                continue
            counts["simple_compatible_pairs"] += 1
            yp, gy, ysizes = result
            coarse = solution_table(yp, gy, clamps(ysizes))
            assert is_simple(coarse)
            assert matches_all_interventions(fine, coarse, qs)
            counts["safe_simple_pairs"] += 1
            by_simple[sum(kind(q) == "constant" for q in qs)] += 1
    return {"bounds": "All 4096 no-self three-bit networks; all 8 identity/erasure quotient tuples; all 27 fine interventions",
            "counts": dict(sorted(counts.items())),
            "simple_compatible_by_erased_coordinates": dict(sorted(by_simple.items()))}


def cycle_witnesses():
    """Check every obstructed 3-vertex graph/quotient-type combination."""
    points = tuples((3, 3, 3))
    interventions = clamps((3, 3, 3))
    possible_edges = tuple((i, j) for i in range(3) for j in range(3) if i != j)
    options = ((0, 1, 2), (0, 0, 0), (0, 1, 1))
    counts = Counter()
    examples = []
    for mask in range(64):
        edges = {e for k, e in enumerate(possible_edges) if mask >> k & 1}
        for qs in it.product(options, repeat=3):
            counts["graph_quotient_type_pairs"] += 1
            partial = {i for i, q in enumerate(qs) if kind(q) == "partial"}
            cycle = directed_cycle(partial, edges)
            if cycle is None:
                counts["acyclic_partial_subgraph"] += 1
                continue
            counts["cyclic_partial_subgraph"] += 1
            pred = {cycle[(j + 1) % len(cycle)]: cycle[j] for j in range(len(cycle))}
            flip = cycle[0]
            outputs = []
            for x in points:
                fx = []
                for i in range(3):
                    if i not in pred or x[pred[i]] == 0:
                        fx.append(0)
                    elif i == flip:
                        fx.append(3 - x[pred[i]])
                    else:
                        fx.append(x[pred[i]])
                outputs.append(tuple(fx))
            outputs = tuple(outputs)
            assert dependency_edges(points, outputs).issubset(edges)
            fine = solution_table(points, outputs, interventions)
            assert is_simple(fine)
            result = descend(points, outputs, qs)
            assert result is not None
            yp, gy, ysizes = result
            coarse = solution_table(yp, gy, clamps(ysizes))
            assert len(coarse[(None, None, None)]) == 2
            assert not matches_all_interventions(fine, coarse, qs)
            counts["simple_micro_witnesses_verified"] += 1
            if len(examples) < 2 and len(cycle) == len(examples) + 2:
                examples.append({"edges": sorted(edges), "quotients": qs,
                                 "obstruction_cycle": cycle,
                                 "fine_equilibria": fine[(None,) * 3],
                                 "coarse_equilibria": coarse[(None,) * 3]})
    return {"bounds": "All 64 loopless digraphs on 3 labelled vertices and all 27 injective/constant/partial quotient-type tuples",
            "counts": dict(sorted(counts.items())), "examples": examples,
            "scope": "Witnesses checked for every cyclic case; acyclic universal direction is a theorem, not an exhaustive enumeration of ternary networks"}


def scope_and_demo():
    points = tuples((2, 2, 2))
    outputs = tuple((y * (1 - z), z * (1 - x), x * (1 - y)) for x, y, z in points)
    sol = solution_table(points, outputs, clamps((2, 2, 2)))
    assert is_simple(sol)
    cycle = ((0, 0, 1), (0, 1, 1), (0, 1, 0),
             (1, 1, 0), (1, 0, 0), (1, 0, 1))
    lookup = dict(zip(points, outputs))
    updated = []
    for x, target in zip(cycle, cycle[1:] + cycle[:1]):
        changed = [i for i in range(3) if x[i] != target[i]]
        assert len(changed) == 1
        i = changed[0]
        assert target[i] == lookup[x][i]
        updated.append(i)
    assert set(updated) == {0, 1, 2}

    ternary = tuples((3, 3))
    swap = (0, 2, 1)
    f = tuple((b, swap[a]) for a, b in ternary)
    qs = ((0, 1, 1), (0, 1, 1))
    fine = solution_table(ternary, f, clamps((3, 3)))
    yp, gy, ysizes = descend(ternary, f, qs)
    coarse = solution_table(yp, gy, clamps(ysizes))
    assert is_simple(fine)
    assert set(coarse[(None, None)]) == {(0, 0), (1, 1)}
    intervention_rows = [
        {"fine_clamp": c, "coarse_clamp": tuple(None if v is None else q[v] for q, v in zip(qs, c)),
         "fine_solutions": sols,
         "coarse_solutions": coarse[tuple(None if v is None else q[v] for q, v in zip(qs, c))]}
        for c, sols in fine.items()
    ]
    weak_points = tuples((3, 2, 2))
    weak_outputs = tuple((0 if i == 0 else 1 + c, int(p == 1), int(p != 0))
                         for p, c, i in weak_points)
    weak_qs = ((0, 1, 1), (0, 0), (0, 1))
    weak_fine = solution_table(weak_points, weak_outputs, clamps((3, 2, 2)))
    weak_yp, weak_gy, weak_sizes = descend(weak_points, weak_outputs, weak_qs)
    weak_coarse = solution_table(weak_yp, weak_gy, clamps(weak_sizes))
    assert structural_certificate(weak_points, weak_outputs, weak_qs)
    assert len(weak_fine[(None,) * 3]) == 1
    assert len(weak_fine[(None, None, 1)]) == 0
    assert len(weak_coarse[(None,) * 3]) == 2
    return {
        "unique_equilibrium_does_not_imply_convergence": {
            "formula": "F(x,y,z)=(y(1-z),z(1-x),x(1-y))",
            "interventions_checked": len(sol), "each_solution_count": 1,
            "unintervened_equilibrium": sol[(None,) * 3],
            "fair_asynchronous_cycle": cycle, "updated_coordinates": updated,
            "priority": "Classical-type scope example; no novelty claim"},
        "minimal_two_component_counterexample": {
            "fine_sizes": [3, 3], "coarse_sizes": [2, 2],
            "formula": "F(a,b)=(b,s(a)), s=(0,2,1); q_A=q_B=(0,1,1)",
            "partial_coordinates": [0, 1], "dependency_edges": [[0, 1], [1, 0]],
            "structural_certificate": False,
            "fine_simple": True, "coarse_simple": False,
            "interventions": intervention_rows,
            "minimality_scope": "Two nonempty components, no self-dependencies; both quotient maps noninjective and nonconstant require at least3 fine states each"},
        "why_all_interventions_matter": {
            "formula": "F(p,c,i)=(0 if i=0 else 1+c, indicator(p=1), indicator(p!=0))",
            "fine_sizes": [3, 2, 2], "quotients": weak_qs,
            "partial_coordinates": [0], "structural_graph_condition": True,
            "fine_unintervened_solutions": weak_fine[(None,) * 3],
            "fine_solutions_after_do_i_1": weak_fine[(None, None, 1)],
            "macro_unintervened_solutions": weak_coarse[(None,) * 3],
            "fine_simple": False,
            "meaning": "Unique observational equilibrium cannot replace simplicity in the theorem"},
        "full_retention_requires_hidden_dependency_closure": upgrade_checks(ternary, f, qs),
    }


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--output-dir", type=Path, default=Path(__file__).resolve().parent)
    args = parser.parse_args()
    args.output_dir.mkdir(parents=True, exist_ok=True)
    # Check the independent combinatorial generator against Bell numbers.
    assert [len(tuple(partitions(n))) for n in range(1, 5)] == [1, 2, 5, 15]
    reports = {
        "two-component-results.json": two_component_enumeration(),
        "three-bit-results.json": three_bit_enumeration(),
        "cycle-witness-results.json": cycle_witnesses(),
        "worked-examples.json": scope_and_demo(),
    }
    manifest = {}
    for name, report in reports.items():
        raw = (json.dumps(report, indent=2, sort_keys=True) + "\n").encode()
        (args.output_dir / name).write_bytes(raw)
        manifest[name] = {"sha256": hashlib.sha256(raw).hexdigest(), "bytes": len(raw)}
    print(json.dumps({"two_component": reports["two-component-results.json"]["totals"],
                      "retention": reports["two-component-results.json"]["retention_checks"]["counts"],
                      "three_bit": reports["three-bit-results.json"]["counts"],
                      "cycle_witnesses": reports["cycle-witness-results.json"]["counts"],
                      "files": manifest}, indent=2, sort_keys=True))


if __name__ == "__main__":
    main()
