"""Audit the supplied reader hierarchy and the two stipulated encodings.

Offline, standard-library only. This checks the actual branching hypothesis
used in the tree/chain proposition. Topological sufficiency is proved in
the manuscript; no textual dependency is inferred from the labels.
"""
from pathlib import Path
from collections import Counter
import json

if __name__ == "__main__":
    source = json.loads(Path(__file__).with_name("reader-positions.json").read_text())
    positions = source["positions"]
    assert len({p["id"] for p in positions}) == len(positions)
    children = {p["id"]: [] for p in positions}
    for p in positions:
        if p["parent"] is not None:
            assert p["parent"] < p["id"]
            children[p["parent"]].append(p["id"])
    assert all(len(c) >= 2 for c in children.values() if c)
    assert len(positions) == 120
    # Preorder identifiers already give a total order extending ancestry.
    final = positions[-1]["id"]
    assert final != 0
    result = {"source_blob_sha": source["source_blob_sha"],
              "positions_including_synthetic_root": len(positions),
              "child_count_distribution": dict(sorted(Counter(map(len, children.values())).items())),
              "all_internal_vertices_have_at_least_two_children": True,
              "tree_least_level_size_for_all_k": len(positions),
              "linear_least_level_size_for_all_k": 2,
              "last_position_in_chosen_preorder": positions[-1]["name"],
              "scope": "These are stipulated containment and succession encodings, not assertions of Hegelian logical dependence."}
    Path(__file__).with_name("reader-verification.json").write_text(
        json.dumps(result,indent=2)+"\n",encoding="utf-8")
    print(json.dumps(result,indent=2))
