"""Exact independent finite checks of cut-module right Kan reconstruction.
Only Python standard library. GF(2) ranks use bit rows, not numerical tolerance.
"""
from itertools import combinations
from math import comb
import json
from pathlib import Path

def cuts(s):
    # Unique representative excludes least element; empty is trivial.
    t=s[1:]
    return [frozenset(t[i] for i in range(len(t)) if m>>i&1)
            for m in range(1,1<<len(t))]

def restricted(a,t):
    b=a.intersection(t)
    if t[0] in b: b=frozenset(t)-b
    return frozenset(b)

def rank2(rows):
    basis={}
    for row in rows:
        while row:
            p=row.bit_length()-1
            if p in basis: row^=basis[p]
            else:
                basis[p]=row
                break
    return len(basis)

def check(n,r):
    s=tuple(range(n))
    subsets=[t for j in range(2,r+1) for t in combinations(s,j)]
    bases={t:cuts(t) for t in subsets}
    offsets={}; count=0
    for t in subsets:
        offsets[t]=count
        count+=len(bases[t])
    relations=[]
    for t in subsets:
        if len(t)==2: continue
        for u in combinations(t,len(t)-1):
            for j,b in enumerate(bases[u]):
                row=1<<(offsets[u]+j)
                for i,a in enumerate(bases[t]):
                    if restricted(a,u)==b: row^=1<<(offsets[t]+i)
                relations.append(row)
    limit_dim=count-rank2(relations)
    global_cuts=cuts(s)
    probes=[]
    for t in subsets:
        for b in bases[t]:
            row=0
            for i,a in enumerate(global_cuts):
                if restricted(a,t)==b: row^=1<<i
            probes.append(row)
    image_rank=rank2(probes)
    kernel_dim=len(global_cuts)-image_rank
    coker_dim=limit_dim-image_rank
    predicted_kernel=sum(comb(n-1,j) for j in range(r,n))
    predicted_coker=comb(n-1,r) if 2<=r<n else 0
    # r=1 target is zero; all cuts are invisible.
    assert kernel_dim==predicted_kernel,(n,r,kernel_dim,predicted_kernel)
    assert coker_dim==predicted_coker,(n,r,coker_dim,predicted_coker)
    return dict(n=n,r=r,source_dim=len(global_cuts),limit_dim=limit_dim,
                rank=image_rank,kernel_dim=kernel_dim,cokernel_dim=coker_dim,
                compatibility_equations=len(relations))

if __name__=='__main__':
    results=[check(n,r) for n in range(2,8) for r in range(1,n+1)]
    path=Path(__file__).resolve().with_name('cut-checks.json')
    path.write_text(json.dumps({'arithmetic':'exact GF(2)','checks':results},indent=2))
    print(json.dumps(results,indent=2))
