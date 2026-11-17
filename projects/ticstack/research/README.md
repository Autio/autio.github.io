# TicStack: finite-horizon search notes

Rules: 4x4, four-high stacks, four matching visible tops wins, last-used cell rests except when it is the sole cell with room, no passes or piece movement. Results recorded November 16, 2026.

Completed optimized empty-board searches exclude a finished forced win by P1 within 19 total placements and by P2 within 20. The P1 placement-21 probe exhausted 100,000,000 nodes and is unresolved. See extended-horizon-results.json. Separate unpruned AND/OR search, sharing the packed rules engine and merging only equivalent empty-board opening classes, completed P1 through 15 (independent-15-final.json). P2 through 14 completed in independent-15-checks.json. That latter file also records an earlier incomplete P1-15 attempt; the later completed P1-15 result is in independent-15-final.json.

These results exclude finished forced wins only within their horizons. They do not exclude reaching a winning position earlier, a longer simple winning strategy, or determine the perfect-play opening value. The software is experimental, not verified in a proof assistant. These are reproducible computational claims, not peer-reviewed theorems. Self-play outcomes do not measure human enjoyment or prove balance.

## Reproduce

Node.js; no external packages. Work in a fresh extracted folder: runners can overwrite JSON results next to themselves. Keep the published records separate if comparing them.

- node validate.cjs — compare packed and original rule transitions and run smoke checks.
- node exact-horizon.cjs — rerun the shorter 13/14/15 placement probes.
- node extended-horizon.cjs — rerun placements 16–21 with a 100-million-node and 60-second cap per probe. The result can be unknown if a machine reaches its time limit first.
- node -e "console.log(require('./independent-symmetry-proof.cjs')({opening:[],target:0,depth:15,budget:100000000}))" — independent P1-15 search.
- node -e "console.log(require('./independent-symmetry-proof.cjs')({opening:[],target:1,depth:14,budget:30000000}))" — independent P2-14 search.

Search may consume substantial CPU and memory. The packed solver's default table is approximately 44 MiB, while the independent search's Map can use more. Runtime is hardware-dependent. The published results are retained in this archive; no fresh heavy search was required to publish the game.

The archived rules engine includes the original bounded computer policy. Exact search uses legal moves and terminal outcomes rather than that heuristic's ratings. The playable page includes both the original and stronger opponents, plus optional independent move commentary; none of those changes alter the rules used by these searches.
