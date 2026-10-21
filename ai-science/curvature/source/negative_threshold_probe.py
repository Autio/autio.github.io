"""Exact transport audit of the proposed unrestricted negative threshold."""
from curvature_probe import complement,transport
from fractions import Fraction
from itertools import combinations
from pathlib import Path
import random,json,time

def run():
    start=time.time();rng=random.Random(2026102102);checks=0;families=[]
    for n in range(5,41):
        s=n//2;S=list(range(3,3+s));T=list(range(3+s,n))
        removed=[(0,v) for v in S+T]+[(1,2)]+[(2,v) for v in S]
        assert len(removed)==n+n//2-2
        actual=transport(complement(n,removed),0,1)
        expected=Fraction(-1,3) if n==5 else Fraction(-1,2) if n==6 else Fraction(-(2*s-n+2),2*(n-2))
        assert actual==expected,(n,actual,expected)
        families.append({'n':n,'deletions':len(removed),'curvature':str(actual)});checks+=1
    universal=[]
    for n in range(8,41,2):
        S=list(range(3,3+n//2+1));T=list(range(3+n//2+1,n))
        removed=[(0,v) for v in S+T]+[(2,v) for v in S]
        assert len(removed)==n+n//2-2
        adj=complement(n,removed)
        assert len(adj[1])==n-1
        actual=transport(adj,0,1)
        assert actual==Fraction(-1,2*(n-1))
        universal.append({'n':n,'deletions':len(removed),'curvature':str(actual)})
        checks+=1
    for n in range(5,26):
        pairs=[e for e in combinations(range(n),2) if e!=(0,1)]
        threshold=n+n//2-2
        for trial in range(100):
            # Bias half the samples towards deletions near the marked edge.
            if trial%2:
                ordered=sorted(pairs,key=lambda e:(not(0 in e or 1 in e),rng.random()))
                removed=ordered[:threshold-1]
                rng.shuffle(removed)
                if trial%4==1:removed=removed[:rng.randrange(threshold)]
            else:removed=rng.sample(pairs,rng.randrange(threshold))
            adj=complement(n,removed)
            # Deletions may isolate a vertex at the larger budgets.
            seen={0};queue=[0]
            for u in queue:
                for v in adj[u]-seen:seen.add(v);queue.append(v)
            if len(seen)!=n:continue
            actual=transport(adj,0,1)
            assert actual>=0,(n,removed,actual,threshold)
            checks+=1
    result={'passed':True,'full_exact_transport_checks':checks,'sharp_families':families,
            'universal_endpoint_extremal_families':universal,
            'seconds':time.time()-start,'random_seed':2026102102}
    Path(__file__).with_name('negative_threshold_verification.json').write_text(json.dumps(result,indent=2))
    print(json.dumps({k:v for k,v in result.items() if k!='sharp_families'},indent=2))

if __name__=='__main__':run()
