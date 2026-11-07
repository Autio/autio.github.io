"""Independent finite checks for reciprocal causal abstraction.

This program uses direct filtering of simultaneous equations under every
coordinate-clamp intervention.  It does not use a graph criterion to decide
solvability, nor import the main project enumerator.

Run with Python 3.10 or later.  All enumeration bounds are explicit below.
The output is deterministic except for the recorded Python version.
"""

from __future__ import annotations

import argparse
import hashlib
import itertools
import json
from pathlib import Path
import platform


def tuples(sizes):
    return list(itertools.product(*(range(n) for n in sizes)))


def clamps(sizes):
    """-1 means leave this mechanism in place; other values clamp it."""
    return list(itertools.product(*([[-1] + list(range(n)) for n in sizes])))


def partitions(n):
    """Canonical restricted-growth encodings, checked without recursion."""
    answer = []
    for candidate in itertools.product(range(n), repeat=n):
        if candidate[0] != 0:
            continue
        if all(candidate[i] <= 1 + max(candidate[:i]) for i in range(1, n)):
            answer.append(candidate)
    return answer


def q_type(q):
    # On a one-element domain the map is both injective and constant.  We
    # assign it to "injective" for disjoint reporting categories only.
    if len(set(q)) == len(q):
        return "injective"
    if len(set(q)) == 1:
        return "constant"
    return "partial"


def project(state, quotient):
    return tuple(q[value] for q, value in zip(quotient, state))


def clamp_projection(intervention, quotient):
    return tuple(-1 if value == -1 else q[value]
                 for q, value in zip(quotient, intervention))


def solution_set(state_space, outputs, intervention):
    """Direct simultaneous-equation semantics, not trajectory simulation."""
    return frozenset(
        state for state in state_space
        if all(
            state[i] == (intervention[i] if intervention[i] != -1 else outputs[state][i])
            for i in range(len(intervention))
        )
    )


def factor_outputs(state_space, outputs, quotient):
    """Exhaust the commuting square, returning None when it does not factor."""
    factored = {}
    for state in state_space:
        argument = project(state, quotient)
        value = project(outputs[state], quotient)
        if argument in factored and factored[argument] != value:
            return None
        factored[argument] = value
    return factored


def pairwise_dependencies(state_space, outputs, quotient=None):
    """Find influence by inspecting pairs of states differing in one coordinate.

    If quotient is supplied, permit only changes that its coordinate map merges.
    This uses explicit pairs, independently of the main checker's table grouping.
    """
    edges = set()
    for before, after in itertools.combinations(state_space, 2):
        changed = [i for i in range(len(before)) if before[i] != after[i]]
        if len(changed) != 1:
            continue
        source = changed[0]
        if quotient is not None and quotient[source][before[source]] != quotient[source][after[source]]:
            continue
        for target, (first, second) in enumerate(zip(outputs[before], outputs[after])):
            if first != second:
                edges.add((source, target))
    return edges


def acyclic(vertices, edges):
    """Kahn elimination, independent of the main checker's DFS cycle finder."""
    remaining = set(vertices)
    while remaining:
        removable = {
            vertex for vertex in remaining
            if not any(target == vertex and source in remaining for source, target in edges)
        }
        if not removable:
            return False
        remaining -= removable
    return True


def retention_audit(state_space, outputs, quotient, ordinary_edges):
    eligible = {i for i, q in enumerate(quotient) if len(set(q)) < len(q)}
    partial = {i for i, q in enumerate(quotient) if q_type(q) == "partial"}
    hidden_edges = pairwise_dependencies(state_space, outputs, quotient)
    assert hidden_edges <= ordinary_edges
    assert all(source in eligible and target in eligible for source, target in hidden_edges)
    candidates = []
    for count in range(len(eligible) + 1):
        for selected in itertools.combinations(sorted(eligible), count):
            retained = set(selected)
            refined = tuple(tuple(range(len(q))) if i in retained else q
                            for i, q in enumerate(quotient))
            descends = factor_outputs(state_space, outputs, refined) is not None
            closed = all(target not in retained or source in retained
                         for source, target in hidden_edges)
            assert descends == closed
            graph_safe = acyclic(partial - retained, ordinary_edges)
            candidates.append({
                "retained": sorted(retained),
                "actual_descent": descends,
                "predecessor_closed": closed,
                "partial_graph_acyclic": graph_safe,
            })
    graph_minimum = min(len(c["retained"]) for c in candidates if c["partial_graph_acyclic"])
    certificate_minimum = min(len(c["retained"]) for c in candidates
                              if c["partial_graph_acyclic"] and c["actual_descent"])
    return {
        "hidden_edges": [list(e) for e in sorted(hidden_edges)],
        "candidates": candidates,
        "graph_minimum": graph_minimum,
        "descending_certificate_minimum": certificate_minimum,
    }


def empty_counts():
    return {
        "compatible_pairs": 0,
        "simple_compatible_pairs": 0,
        "safe_simple_pairs": 0,
        "unsafe_simple_pairs": 0,
        "matched_micro_interventions_checked": 0,
        "spurious_macro_solutions_across_matched_interventions": 0,
    }


def add_counts(destination, source):
    for key, value in source.items():
        destination[key] += value


def semantics_audit(state_space, micro_solutions, quotient, macro_outputs):
    macro_sizes = tuple(max(q) + 1 for q in quotient)
    macro_states = tuples(macro_sizes)
    spurious = 0
    missing = 0
    failures = []
    # Every fine intervention is checked, including different representatives
    # that induce the same coarse intervention.
    for intervention, fine_set in micro_solutions.items():
        coarse_clamp = clamp_projection(intervention, quotient)
        coarse_set = solution_set(macro_states, macro_outputs, coarse_clamp)
        projected = frozenset(project(state, quotient) for state in fine_set)
        extra = coarse_set - projected
        lost = projected - coarse_set
        spurious += len(extra)
        missing += len(lost)
        if extra or lost:
            failures.append({
                "fine_intervention": list(intervention),
                "coarse_intervention": list(coarse_clamp),
                "fine_solutions": [list(x) for x in sorted(fine_set)],
                "projected_solutions": [list(x) for x in sorted(projected)],
                "coarse_solutions": [list(x) for x in sorted(coarse_set)],
            })
    assert missing == 0, "A commuting mechanism quotient must map solutions forward."
    return spurious, failures


def two_component_checks():
    domains = []
    by_types = {}
    totals = empty_counts()
    raw_systems = 0
    simple_systems = 0
    first_failure = None
    minimal_shape_checked = 0
    unsafe_by_quotient = {}
    retention_counts = {
        "compatible_base_pairs": 0,
        "refinement_candidates_checked": 0,
        "descending_candidates": 0,
        "base_pairs_with_graph_vs_descent_cost_gap": 0,
        "simple_base_pairs_with_cost_gap": 0,
    }
    # Domain order also tests all smaller total state spaces before 3 x 3.
    for a_size, b_size in sorted(itertools.product(range(1, 4), repeat=2),
                                 key=lambda pair: (pair[0] * pair[1], sum(pair), pair)):
        sizes = (a_size, b_size)
        states = tuples(sizes)
        interventions = clamps(sizes)
        quotient_pairs = list(itertools.product(partitions(a_size), partitions(b_size)))
        counts = empty_counts()
        domain_raw = 0
        domain_simple = 0
        for f in itertools.product(range(a_size), repeat=b_size):
            for g in itertools.product(range(b_size), repeat=a_size):
                domain_raw += 1
                outputs = {(a, b): (f[b], g[a]) for a, b in states}
                ordinary_edges = pairwise_dependencies(states, outputs)
                micro_solutions = {
                    intervention: solution_set(states, outputs, intervention)
                    for intervention in interventions
                }
                simple = all(len(values) == 1 for values in micro_solutions.values())
                if simple:
                    domain_simple += 1
                for quotient in quotient_pairs:
                    macro_outputs = factor_outputs(states, outputs, quotient)
                    if macro_outputs is None:
                        continue
                    retention = retention_audit(states, outputs, quotient, ordinary_edges)
                    retention_counts["compatible_base_pairs"] += 1
                    retention_counts["refinement_candidates_checked"] += len(retention["candidates"])
                    retention_counts["descending_candidates"] += sum(c["actual_descent"] for c in retention["candidates"])
                    cost_gap = retention["descending_certificate_minimum"] > retention["graph_minimum"]
                    retention_counts["base_pairs_with_graph_vs_descent_cost_gap"] += int(cost_gap)
                    retention_counts["simple_base_pairs_with_cost_gap"] += int(simple and cost_gap)
                    type_key = "/".join(q_type(q) for q in quotient)
                    type_counts = by_types.setdefault(type_key, empty_counts())
                    case = empty_counts()
                    case["compatible_pairs"] = 1
                    if simple:
                        case["simple_compatible_pairs"] = 1
                        case["matched_micro_interventions_checked"] = len(interventions)
                        spurious, failures = semantics_audit(
                            states, micro_solutions, quotient, macro_outputs)
                        case["spurious_macro_solutions_across_matched_interventions"] = spurious
                        case["unsafe_simple_pairs" if failures else "safe_simple_pairs"] = 1
                        if failures and first_failure is None:
                            first_failure = {
                                "sizes": list(sizes),
                                "f_B_to_A": list(f),
                                "g_A_to_B": list(g),
                                "quotients": [list(q) for q in quotient],
                                "failures": failures,
                            }
                        if failures:
                            assert all(q_type(q) == "partial" for q in quotient)
                            # Independently check the complete isomorphism shape
                            # of every minimum-size failure, not just its count.
                            assert sizes == (3, 3)
                            qa, qb = quotient
                            a_single = next(a for a in range(3) if qa.count(qa[a]) == 1)
                            b_single = next(b for b in range(3) if qb.count(qb[b]) == 1)
                            a_double = set(range(3)) - {a_single}
                            b_double = set(range(3)) - {b_single}
                            assert f[b_single] == a_single and g[a_single] == b_single
                            assert {f[b] for b in b_double} == a_double
                            assert {g[a] for a in a_double} == b_double
                            assert all(f[g[a]] != a for a in a_double)
                            assert len(failures) == 1
                            assert failures[0]["fine_intervention"] == [-1, -1]
                            minimal_shape_checked += 1
                            quotient_key = str(quotient)
                            unsafe_by_quotient[quotient_key] = unsafe_by_quotient.get(quotient_key, 0) + 1
                    add_counts(counts, case)
                    add_counts(type_counts, case)
        raw_systems += domain_raw
        simple_systems += domain_simple
        add_counts(totals, counts)
        domains.append({
            "sizes": list(sizes),
            "raw_systems": domain_raw,
            "simple_raw_systems": domain_simple,
            "canonical_partition_pairs": len(quotient_pairs),
            **counts,
        })
    assert minimal_shape_checked == 18
    assert len(unsafe_by_quotient) == 9
    assert set(unsafe_by_quotient.values()) == {2}
    return {
        "bounds": "All 1 <= |A|, |B| <= 3, all f:B->A and g:A->B, all canonical set partitions.",
        "raw_systems": raw_systems,
        "simple_raw_systems": simple_systems,
        **totals,
        "by_domain": domains,
        "by_quotient_type": by_types,
        "smallest_failure_in_search": first_failure,
        "minimal_failure_classification": {
            "all_unsafe_pairs_checked_against_identity_swap_shape": minimal_shape_checked,
            "canonical_quotient_pairs_with_failure": len(unsafe_by_quotient),
            "unsafe_systems_per_such_quotient_pair": 2,
            "isomorphism_classes_at_size_3_by_3": 1,
            "meaning_of_isomorphism": "Independent relabellings of each fine coordinate and the induced coarse labels, preserving both mechanisms and quotient maps.",
        },
        "full_retention_checks": retention_counts,
    }


def three_bit_checks():
    sizes = (2, 2, 2)
    states = tuples(sizes)
    interventions = clamps(sizes)
    quotients = list(itertools.product(((0, 0), (0, 1)), repeat=3))
    tables = list(itertools.product((0, 1), repeat=4))
    totals = empty_counts()
    masks = {}
    raw = 0
    simple_raw = 0
    for mechanisms in itertools.product(tables, repeat=3):
        raw += 1
        outputs = {}
        for state in states:
            value = []
            for i, table in enumerate(mechanisms):
                others = [state[j] for j in range(3) if j != i]
                value.append(table[2 * others[0] + others[1]])
            outputs[state] = tuple(value)
        micro_solutions = {
            intervention: solution_set(states, outputs, intervention)
            for intervention in interventions
        }
        simple = all(len(values) == 1 for values in micro_solutions.values())
        simple_raw += int(simple)
        for quotient in quotients:
            macro_outputs = factor_outputs(states, outputs, quotient)
            if macro_outputs is None:
                continue
            key = "".join("I" if q == (0, 1) else "E" for q in quotient)
            mask_counts = masks.setdefault(key, empty_counts())
            case = empty_counts()
            case["compatible_pairs"] = 1
            if simple:
                case["simple_compatible_pairs"] = 1
                case["matched_micro_interventions_checked"] = len(interventions)
                spurious, failures = semantics_audit(
                    states, micro_solutions, quotient, macro_outputs)
                case["spurious_macro_solutions_across_matched_interventions"] = spurious
                case["unsafe_simple_pairs" if failures else "safe_simple_pairs"] = 1
                assert not failures, (mechanisms, quotient, failures)
            add_counts(totals, case)
            add_counts(mask_counts, case)
    assert raw == 4096
    return {
        "bounds": "All 4096 no-self-dependence three-bit networks and all 8 identity/erasure quotient products.",
        "raw_systems": raw,
        "simple_raw_systems": simple_raw,
        **totals,
        "by_quotient_mask_I_identity_E_erasure": masks,
    }


def explicit_examples():
    states = tuples((3, 3))
    swap = (0, 2, 1)
    outputs = {(a, b): (b, swap[a]) for a, b in states}
    quotient = ((0, 1, 1), (0, 1, 1))
    micro_solutions = {
        intervention: solution_set(states, outputs, intervention)
        for intervention in clamps((3, 3))
    }
    assert all(len(values) == 1 for values in micro_solutions.values())
    macro_outputs = factor_outputs(states, outputs, quotient)
    assert macro_outputs is not None
    spurious, failures = semantics_audit(states, micro_solutions, quotient, macro_outputs)
    assert spurious == 1 and len(failures) == 1
    assert failures[0]["fine_intervention"] == [-1, -1]
    retention = retention_audit(states, outputs, quotient, pairwise_dependencies(states, outputs))
    assert retention["graph_minimum"] == 1
    assert retention["descending_certificate_minimum"] == 2

    bit_states = tuples((2, 2, 2))
    bit_outputs = {
        (x, y, z): (y * (1 - z), z * (1 - x), x * (1 - y))
        for x, y, z in bit_states
    }
    intervention_counts = [
        {"clamp": list(intervention),
         "solutions": [list(s) for s in sorted(solution_set(bit_states, bit_outputs, intervention))]}
        for intervention in clamps((2, 2, 2))
    ]
    assert len(intervention_counts) == 27
    assert all(len(case["solutions"]) == 1 for case in intervention_counts)
    cycle = [(0, 0, 1), (0, 1, 1), (0, 1, 0), (1, 1, 0), (1, 0, 0), (1, 0, 1)]
    coordinates = []
    for before, after in zip(cycle, cycle[1:] + cycle[:1]):
        changed = [i for i in range(3) if before[i] != after[i]]
        assert len(changed) == 1
        coordinate = changed[0]
        expected = list(before)
        expected[coordinate] = bit_outputs[before][coordinate]
        assert tuple(expected) == after
        coordinates.append(coordinate)
    assert set(coordinates) == {0, 1, 2}

    weak_states = tuples((3, 2, 2))
    weak_outputs = {
        (p, c, i): (0 if i == 0 else 1 + c, int(p == 1), int(p != 0))
        for p, c, i in weak_states
    }
    weak_q = ((0, 1, 1), (0, 0), (0, 1))
    weak_solutions = {
        intervention: solution_set(weak_states, weak_outputs, intervention)
        for intervention in clamps((3, 2, 2))
    }
    weak_macro = factor_outputs(weak_states, weak_outputs, weak_q)
    assert weak_macro is not None
    weak_coarse_solutions = solution_set(tuples((2, 1, 2)), weak_macro, (-1, -1, -1))
    weak_edges = pairwise_dependencies(weak_states, weak_outputs)
    weak_partial = {i for i, q in enumerate(weak_q) if q_type(q) == "partial"}
    assert acyclic(weak_partial, weak_edges)
    assert weak_solutions[(-1, -1, -1)] == frozenset({(0, 0, 0)})
    assert weak_solutions[(-1, -1, 1)] == frozenset()
    assert weak_coarse_solutions == frozenset({(0, 0, 0), (1, 0, 1)})
    weak_distribution = {}
    for values in weak_solutions.values():
        weak_distribution[len(values)] = weak_distribution.get(len(values), 0) + 1
    return {
        "three_by_three_simple_counterexample": {
            "f_B_to_A": [0, 1, 2],
            "g_A_to_B": list(swap),
            "quotients": [list(q) for q in quotient],
            "fine_interventions": len(micro_solutions),
            "all_fine_interventions_uniquely_solvable": True,
            "failures": failures,
            "full_retention_audit": retention,
        },
        "equilibrium_not_fair_asynchronous_convergence": {
            "mechanisms": ["y*(1-z)", "z*(1-x)", "x*(1-y)"],
            "clamped_solution_sets": intervention_counts,
            "cycle": [list(s) for s in cycle],
            "zero_based_update_coordinates": coordinates,
            "periodic_schedule_is_fair": True,
        },
        "unique_unintervened_equilibrium_does_not_replace_simplicity": {
            "sizes": [3, 2, 2],
            "mechanisms": ["0 if i=0 else 1+c", "indicator(p=1)", "indicator(p!=0)"],
            "quotients": [list(q) for q in weak_q],
            "ordinary_edges": [list(e) for e in sorted(weak_edges)],
            "partial_coordinates": sorted(weak_partial),
            "partial_graph_acyclic": True,
            "fine_unintervened_solutions": [list(s) for s in sorted(weak_solutions[(-1, -1, -1)])],
            "fine_solutions_after_do_i_1": [],
            "macro_unintervened_solutions": [list(s) for s in sorted(weak_coarse_solutions)],
            "fine_intervention_solution_count_distribution": weak_distribution,
        },
    }


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--output", type=Path,
                        default=Path(__file__).with_name("independent-check-results.json"))
    args = parser.parse_args()
    assert [len(partitions(n)) for n in range(1, 4)] == [1, 2, 5]
    report = {
        "checker": "Independent direct-equation enumeration; no imports from the main checker.",
        "python_version": platform.python_version(),
        "checker_sha256": hashlib.sha256(Path(__file__).read_bytes()).hexdigest(),
        "reporting_convention": "A map on a singleton is classified as injective; it is also constant. Partial means neither.",
        "two_component": two_component_checks(),
        "three_bit": three_bit_checks(),
        "explicit_examples": explicit_examples(),
    }
    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_text(json.dumps(report, indent=2, sort_keys=True) + "\n", encoding="utf-8")
    print(json.dumps({
        "output": str(args.output.resolve()),
        "two_component": {key: value for key, value in report["two_component"].items()
                          if key not in {"by_domain", "by_quotient_type", "smallest_failure_in_search"}},
        "three_bit": {key: value for key, value in report["three_bit"].items()
                      if key != "by_quotient_mask_I_identity_E_erasure"},
        "explicit_examples_passed": True,
    }, indent=2))


if __name__ == "__main__":
    main()
