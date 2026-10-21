"""Exact adversarial replay of the K_{2,3}-free complement theorem.

The prediction uses only the stated local obstruction and graph distances;
the comparison is a full integer min-cost-flow calculation.
"""
from curvature_probe import complement,connected,transport
from fractions import Fraction
from itertools import combinations
from pathlib import Path
import json,random,time
from fast_curvature import all_curvatures,ForbiddenComplement

def admissible(h):
    return all(len(h[u]&h[v])<=2 for u,v in combinations(range(len(h)),2))

def prediction(adj,x,y):
    if len(adj[x])>len(adj[y]): x,y=y,x
    a=len(adj[x]); b=len(adj[y]); C=adj[x]&adj[y]
    A=adj[x]-adj[y]; B=adj[y]-adj[x]
    upper=Fraction(len(C),b)
    if b!=a+1 or len(A)!=2 or len(B)!=3: return upper,0
    z=next(iter(A-{y})); S=B-{x}
    if adj[z]&S: return upper,0
    distance=[1000]*len(adj); distance[z]=0; queue=[z]
    for u in queue:
        for v in adj[u]:
            if distance[v]>distance[u]+1: distance[v]=distance[u]+1; queue.append(v)
    rho=min(distance[s] for s in S)
    assert rho in (2,3)
    assert (rho==3)==(len(adj[z])==1)
    return upper-Fraction(rho-1,a*b),rho-1

def run():
    start=time.time(); graphs=checks=0; gaps={0:0,1:0,2:0}; by_n={}
    # Exhaust all labelled graphs on <=6 vertices, without a deletion-budget cap.
    for n in range(2,7):
        pairs=list(combinations(range(n),2)); local_graphs=local_checks=0
        for mask in range(1<<len(pairs)):
            h=[set() for _ in range(n)]; removed=[]
            for k,(u,v) in enumerate(pairs):
                if mask>>k&1: h[u].add(v); h[v].add(u); removed.append((u,v))
            if not admissible(h): continue
            adj=complement(n,removed)
            if not connected(adj): continue
            fast,metadata=all_curvatures(adj)
            assert metadata['neighbor_pair_updates']<=n*(n-1)
            graphs+=1; local_graphs+=1
            for x,y in pairs:
                if y not in adj[x]: continue
                expected,gap=prediction(adj,x,y); actual=transport(adj,x,y)
                assert actual==expected,(n,removed,x,y,actual,expected)
                assert Fraction(*fast[(x,y)])==actual
                gaps[gap]+=1; checks+=1; local_checks+=1
        by_n[n]={'graphs':local_graphs,'edges':local_checks}
        print('exhaustive',n,by_n[n],flush=True)
    rng=random.Random(20261022); random_checks=0
    for n in range(7,21):
        for trial in range(16):
            h=[set() for _ in range(n)]; pairs=list(combinations(range(n),2)); rng.shuffle(pairs); removed=[]
            for u,v in pairs:
                if rng.random()>.3: continue
                h[u].add(v); h[v].add(u)
                if not admissible(h): h[u].remove(v); h[v].remove(u)
                else: removed.append((u,v))
            adj=complement(n,removed)
            if not connected(adj): continue
            fast,_=all_curvatures(adj)
            for x,y in pairs[:8]:
                if y not in adj[x]: continue
                expected,gap=prediction(adj,x,y)
                assert transport(adj,x,y)==expected,(n,removed,x,y)
                assert Fraction(*fast[tuple(sorted((x,y)))])==expected
                random_checks+=1
    # Adversarial infinite families realize both exceptional distance cases.
    families=[]
    for n in range(5,31):
        base=[(0,1),(0,2),(0,3),(1,4),(2,4)]
        for leaf in (False,True):
            removed=base+([(0,u) for u in range(5,n)] if leaf else [])
            adj=complement(n,removed)
            h=[set(range(n))-{u}-adj[u] for u in range(n)]
            assert admissible(h)
            expected,gap=prediction(adj,4,3)
            assert transport(adj,4,3)==expected
            assert gap==(2 if leaf or n==5 else 1)
            families.append({'n':n,'leaf_family':leaf,'gap_numerator':gap,'curvature':str(expected)})
    # The excluded K_{2,3} must be rejected by the fast recognizer.
    rejected=False
    try: all_curvatures(complement(6,[(u,v) for u in (0,1) for v in (2,3,4)]))
    except ForbiddenComplement: rejected=True
    assert rejected
    sharp_deleted=[(0,3),(0,4),(2,3),(2,4),(1,2),(0,5),(0,6),(1,5),(1,6)]
    sharp=complement(7,sharp_deleted)
    assert transport(sharp,0,1)==Fraction(-1,6)
    assert Fraction(*all_curvatures(sharp)[0][(0,1)])==Fraction(-1,6)
    result={'status':'passed','exhaustive_graphs':graphs,'exhaustive_edges':checks,'by_order':by_n,'gap_numerator_counts':gaps,'random_edge_checks':random_checks,'family_checks':len(families),'families':families,'sharpness':{'n':7,'deleted_edges':sharp_deleted,'edge':[0,1],'curvature':'-1/6'},'seconds':time.time()-start}
    Path(__file__).with_name('structural_verification.json').write_text(json.dumps(result,indent=2))
    print(json.dumps({k:v for k,v in result.items() if k not in ('families','by_order')},indent=2))

if __name__=='__main__': run()
