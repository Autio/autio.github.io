"""Exact exhaustive marked-edge audit of the global deletion-stability bound.

Fixing edge (0,1) loses no marked-edge isomorphism types. Every deletion
subset avoiding (0,1) is enumerated through the configured order.
"""
from curvature_probe import complement,transport
from itertools import combinations
from fractions import Fraction
from pathlib import Path
import argparse,json,time


def run(max_n):
    start=time.time();rows=[];checks=equalities=zeros=0
    for n in range(3,max_n+1):
        pairs=[e for e in combinations(range(n),2) if e!=(0,1)]
        local=0
        for m in range(n-1):
            for removed in combinations(pairs,m):
                adj=complement(n,removed)
                a,b=sorted([len(adj[0]),len(adj[1])])
                c=len(adj[0]&adj[1]);t=n-2-m
                actual=transport(adj,0,1);bound=Fraction(t,b)
                assert actual>=bound,(n,removed,actual,bound)
                # Equality iff all deletions are at the marked endpoints,
                # with no common deleted neighbor: disjoint centered stars.
                expected=all(0 in e or 1 in e for e in removed)
                h0={v for u,v in removed if u==0}
                h1={v for u,v in removed if u==1}
                expected &= not bool(h0&h1)
                assert (actual==bound)==expected,(n,removed,actual,bound)
                if not expected:
                    assert actual>=Fraction(t+1,b),(n,removed,actual,t,b)
                assert (actual==0)==(m==n-2 and c==0)
                equalities+=actual==bound;zeros+=actual==0
                local+=1;checks+=1
        rows.append({'n':n,'marked_deletion_sets':local})
        print(json.dumps({'n':n,'checks':local,'elapsed':time.time()-start}),flush=True)
    result={'passed':True,'max_n':max_n,'exact_marked_edge_checks':checks,
            'equality_cases':equalities,'zero_cases':zeros,'by_order':rows,
            'seconds':time.time()-start}
    Path(__file__).with_name('deletion_stability_verification.json').write_text(json.dumps(result,indent=2))
    print(json.dumps(result,indent=2))

if __name__=='__main__':
    parser=argparse.ArgumentParser();parser.add_argument('--max-n',type=int,default=8)
    run(parser.parse_args().max_n)
