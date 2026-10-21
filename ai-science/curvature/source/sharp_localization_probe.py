"""Exact witnesses for the candidate sharp localization bound."""
from curvature_probe import complement,transport,connected
from general_complement import preprocess,edge_curvature
from itertools import combinations
from fractions import Fraction
from pathlib import Path
import json


def extremal(k):
    assert k>=2
    x,y,z=0,1,2
    W=list(range(3,k+1))
    S=list(range(k+1,2*k+1))
    T=list(range(2*k+1,k*k+1))
    n=k*k+1
    removed=[(x,s) for s in S+T]+[(z,s) for s in S]+[(y,z)]
    removed += [(w,s) for w in W for s in S]
    return complement(n,removed),(x,y),{'W':W,'S':S,'T':T,'removed':removed}


def run():
    rows=[]
    for k in range(2,11):
        adj,(x,y),desc=extremal(k)
        assert connected(adj)
        data=preprocess(adj,k)
        actual=transport(adj,x,y)
        reduced,_=edge_curvature(adj,x,y,k,data)
        a,b=len(adj[x]),len(adj[y]); c=len(adj[x]&adj[y])
        beta=len(adj[y]-adj[x])
        assert a==k and b==k*k-1 and c==k-2
        assert beta==k*k-k+1
        gap=Fraction(c,b)-actual
        assert gap==Fraction(2 if k==2 else 1,a*b)
        assert actual==reduced
        # Adding a new T vertex crosses the bound exactly and removes all
        # Hall deficiency. Exercise the newly strengthened early shortcut.
        for extra in range(1,4):
            boundary=complement(len(adj)+extra,desc['removed']+
                [(x,u) for u in range(len(adj),len(adj)+extra)])
            bdata=preprocess(boundary,k)
            bvalue,bmeta=edge_curvature(boundary,x,y,k,bdata)
            bactual=transport(boundary,x,y)
            bupper=Fraction(len(boundary[x]&boundary[y]),
                            max(len(boundary[x]),len(boundary[y])))
            assert bactual==bvalue==bupper
            assert bmeta['shortcut']
        rows.append({'k':k,'n':len(adj),'beta':beta,'degrees':[a,b],
                     'curvature':str(actual),'triangle_gap':str(gap)})
    result={'passed':True,'sharp_families':rows,'boundary_shortcut_checks':27}
    Path(__file__).with_name('sharp_localization_verification.json').write_text(json.dumps(result,indent=2))
    print(json.dumps(result,indent=2))

if __name__=='__main__':run()
