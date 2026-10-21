"""Reproducible timings against this project's transparent exact reference.

This is not a comparison with an optimized library or state of the art.
Both timings include calculating every surviving edge. Graph generation is
excluded; fast timings include eligibility recognition and preprocessing.
"""
from fast_curvature import all_curvatures
from curvature_probe import complement,transport,connected
from fractions import Fraction
from itertools import combinations
from pathlib import Path
from statistics import median
import json,platform,random,time

def sample(n,seed):
    rng=random.Random(seed);h=[set() for _ in range(n)];removed=[]
    pairs=list(combinations(range(n),2));rng.shuffle(pairs)
    for u,v in pairs:
        h[u].add(v);h[v].add(u)
        if any(len(h[a]&h[b])>2 for a,b in combinations(range(n),2)):
            h[u].remove(v);h[v].remove(u)
        else:removed.append((u,v))
    adj=complement(n,removed);assert connected(adj)
    return adj,removed

def run():
    rows=[]
    for n in (8,12,16,24,32):
        adj,removed=sample(n,20261021+n)
        edges=[(u,v) for u,v in combinations(range(n),2) if v in adj[u]]
        expected=None;slow=[]
        for repeat in range(3):
            t=time.perf_counter();expected={e:transport(adj,*e) for e in edges}
            slow.append(time.perf_counter()-t)
        quick=[]
        for repeat in range(51):
            t=time.perf_counter();actual,meta=all_curvatures(adj)
            quick.append(time.perf_counter()-t)
        assert all(Fraction(*actual[e])==expected[e] for e in edges)
        row={'vertices':n,'edges':len(edges),'deleted_edges':len(removed),
             'fast_median_ms':1000*median(quick),'reference_median_ms':1000*median(slow),
             'reference_over_fast':median(slow)/median(quick),'all_values_equal':True}
        rows.append(row);print(json.dumps(row),flush=True)
    result={'date':'2026-10-21','python':platform.python_version(),
            'platform':platform.platform(),'processor':platform.processor(),
            'seed_rule':'20261021+n','reference_repetitions':3,'fast_repetitions':51,
            'baseline':'Project dependency-free Bellman-Ford integer min-cost-flow reference, not an optimized library',
            'timed_scope':'All edge values; fast eligibility/preprocessing included; graph generation excluded',
            'limitations':'Synthetic eligible graphs only; small orders; same machine; no claim of application benefit or comparison to optimized solvers',
            'rows':rows}
    Path(__file__).with_name('public_benchmark.json').write_text(json.dumps(result,indent=2))

if __name__=='__main__':run()
