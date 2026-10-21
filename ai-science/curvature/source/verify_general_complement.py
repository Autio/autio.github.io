"""Adversarial exact checks of localization and compressed transport."""
from curvature_probe import complement, connected, transport
from general_complement import preprocess, edge_curvature
from itertools import combinations
from fractions import Fraction
from pathlib import Path
import random,time,json


def run():
    start=time.time(); checks=graphs=shortcuts=0; max_sources=0; dual_checks=0;cut_checks=0
    def check(adj,pairs):
        nonlocal checks,graphs,shortcuts,max_sources,dual_checks,cut_checks
        n=len(adj); h=[set(range(n))-{v}-adj[v] for v in range(n)]
        k=max(1,max((len(h[u]&h[v]) for u,v in combinations(range(n),2)),default=0))
        data=preprocess(adj,k); graphs+=1
        for x,y in pairs:
            if y not in adj[x]: continue
            actual=transport(adj,x,y)
            value,meta=edge_curvature(adj,x,y,k,data)
            assert actual==value,(n,k,x,y,actual,value,h)
            if not meta['shortcut']:
                cut,_=edge_curvature(adj,x,y,k,data,solver='cut')
                assert cut==actual
                cut_checks+=1
            if not meta['shortcut'] and meta['beta']<=4:
                dual,_=edge_curvature(adj,x,y,k,data,solver='dual')
                assert dual==actual
                dual_checks+=1
            checks+=1; shortcuts+=meta['shortcut']
            max_sources=max(max_sources,meta.get('sources',0))
            upper=Fraction(len(adj[x]&adj[y]),max(len(adj[x]),len(adj[y])))
            if actual<upper:
                assert meta['beta']<=k*k-k+1
                assert len(h[x])<=k*k+k-2 and len(h[y])<=k*k+k-2
    for n in range(2,7):
        pairs=list(combinations(range(n),2))
        for mask in range(1<<len(pairs)):
            adj=complement(n,[e for i,e in enumerate(pairs) if mask>>i&1])
            if connected(adj): check(adj,pairs)
    exhaustive_checks=checks; exhaustive_graphs=graphs
    rng=random.Random(20261021)
    for n in range(6,31):
        pairs=list(combinations(range(n),2))
        for trial in range(12):
            p=rng.choice([.08,.18,.35,.6,.8])
            adj=complement(n,[e for e in pairs if rng.random()<p])
            if connected(adj): check(adj,rng.sample(pairs,min(5,len(pairs))))
    # Large neighborhood differences must be harmless, without solving transport.
    for n in (12,20,40):
        adj=complement(n,[(0,v) for v in range(2,n-1)])
        check(adj,[(0,1),(1,n-1)])
    # K_{2,4}-free family has a first-order gap; no second-order extension.
    families=[]
    removed=[(u,v) for u in (0,2,3) for v in (4,5)]+[(1,2),(1,3)]
    for n in (6,7,8,12,20,40):
        adj=complement(n,removed); check(adj,[(0,1)])
        actual=transport(adj,0,1)
        expected=Fraction(n-7,n-3) if n>=7 else Fraction(-2,3)
        assert actual==expected
        families.append({'n':n,'curvature':str(actual),
                         'triangle_gap':str(Fraction(1,n-3) if n>=7 else Fraction(2,3))})
    result={'passed':True,'exhaustive_graphs':exhaustive_graphs,
            'exhaustive_edges':exhaustive_checks,'total_graphs':graphs,
            'total_edges':checks,'shortcut_edges':shortcuts,'bounded_dual_checks':dual_checks,
            'closure_mincut_checks':cut_checks,
            'largest_compressed_source_count':max_sources,'boundary_family':families,
            'seconds':time.time()-start}
    Path(__file__).with_name('general_verification.json').write_text(json.dumps(result,indent=2))
    print(json.dumps(result,indent=2))

if __name__=='__main__': run()
