"""Exact fixed-complement asymptotic defect coefficients and replay."""
from curvature_probe import complement,transport
from fractions import Fraction
from itertools import combinations
from math import ceil
from pathlib import Path
import random,json,time


def coefficients(adj,x,y):
    if len(adj[x])>len(adj[y]):x,y=y,x
    A=adj[x]-adj[y];B=adj[y]-adj[x];C=adj[x]&adj[y]
    a,b=len(adj[x]),len(adj[y]);d=b-a
    vertices=sorted(B); forms=[]
    for mask in range(1,1<<len(vertices)):
        S={u for i,u in enumerate(vertices) if mask>>i&1}
        p=sum(not bool(adj[u]&S) for u in A)
        q=sum(not bool(adj[u]&S) for u in C)
        forms.append((len(S)+p-len(B),d*(p+q)))
    ell,intercept=max(forms)
    assert ell>=0 and intercept>=0
    threshold=a+1
    for slope,constant in forms:
        if slope<ell:
            threshold=max(threshold,ceil(Fraction(constant-intercept,ell-slope)))
    # Independent cardinality matching, not weighted Hall enumeration.
    matched={}
    def augment(u,seen):
        for v in adj[u]&B:
            if v in seen:continue
            seen.add(v)
            if v not in matched or augment(matched[v],seen):
                matched[v]=u;return True
        return False
    M=sum(augment(u,set()) for u in A)
    assert ell==len(A)-M
    return ell,intercept,threshold,forms,(x,y)


def run():
    start=time.time();rng=random.Random(20261021);checks=0;cases=0;observed=set()
    for n0 in range(3,9):
        pairs=list(combinations(range(n0),2))
        for trial in range(20):
            removed=[e for e in pairs if rng.random()<rng.choice([.2,.4,.65])]
            base=complement(n0,removed)
            surviving=[e for e in pairs if e[1] in base[e[0]]]
            h=[set(range(n0))-{v}-base[v] for v in range(n0)]
            k=max(1,max(len(h[u]&h[v]) for u,v in pairs))
            for x,y in rng.sample(surviving,min(3,len(surviving))):
                ell,m,threshold,forms,(x,y)=coefficients(base,x,y)
                assert ell<=max(0,k-2)
                a0=len(base[x]);cases+=1;observed.add((k,ell))
                for extra in sorted({1,2,5,max(1,threshold-a0)}):
                    adj=complement(n0+extra,removed)
                    a,b=len(adj[x]),len(adj[y]);c=len(adj[x]&adj[y])
                    actual=transport(adj,x,y)
                    exact=Fraction(c,b)-Fraction(max(a*L+K for L,K in forms),a*b)
                    assert actual==exact
                    if a>=threshold:
                        assert actual==Fraction(c,b)-Fraction(a*ell+m,a*b)
                    checks+=1
    family=[]
    for r in range(3,11):
        x,y=0,1;Z=list(range(2,r+1));S=list(range(r+1,2*r))
        removed=[(u,v) for u in [x]+Z for v in S]+[(y,z) for z in Z]
        base=complement(2*r,removed)
        ell,m,threshold,forms,_=coefficients(base,x,y)
        assert ell==r-2 and m==0
        for extra in (1,3,8):
            n=2*r+extra;adj=complement(n,removed)
            actual=transport(adj,x,y)
            assert actual==Fraction(n-3*r+2,n-r)
            checks+=1
        family.append({'codegree_bound':r,'leading_coefficient':ell,
                       'exact_gap':f'{r-2}/(n-{r})','core_order':2*r})
    result={'passed':True,'fixed_core_edge_cases':cases,'exact_transport_checks':checks,
            'observed_codegree_and_slope':sorted(observed),'sharp_family':family,
            'seconds':time.time()-start}
    Path(__file__).with_name('quantized_verification.json').write_text(json.dumps(result,indent=2))
    print(json.dumps(result,indent=2))

if __name__=='__main__':run()
