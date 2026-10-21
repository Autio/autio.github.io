"""Independent exact transport tests of sharp finite-order and intercept bounds."""
from curvature_probe import complement,transport
from general_complement import preprocess,edge_curvature
from sharp_localization_probe import extremal
from quantized_defect import coefficients
from fractions import Fraction
from pathlib import Path
import json,time

def run():
    start=time.time();rows=[];checks=0
    for k in range(2,11):
        # Remove T from the sharp localization family. This realizes the
        # largest possible second-order intercept when the leading slope is 0.
        W=list(range(3,k+1));S=list(range(k+1,2*k+1))
        removed=[(0,s) for s in S]+[(2,s) for s in S]+[(1,2)]
        removed += [(w,s) for w in W for s in S]
        base=complement(2*k+1,removed)
        ell,m,threshold,forms,_=coefficients(base,0,1)
        assert (ell,m)==(0,(k-1)**2)
        for extra in (1,3):
            adj=complement(2*k+1+extra,removed)
            data=preprocess(adj,k)
            a,b=len(adj[0]),len(adj[1]);c=len(adj[0]&adj[1])
            expected=Fraction(c,b)-Fraction(m,a*b)
            assert transport(adj,0,1)==expected
            assert edge_curvature(adj,0,1,k,data,solver='cut')[0]==expected
            checks+=1
        row={'k':k,'maximal_second_order_intercept':m}
        if k>=3:
            # Negative-slope obstructions survive through n=k^2+k+1.
            core,_,desc=extremal(k);n0=len(core)
            removed2=desc['removed']+[(v,r) for r in range(n0,n0+k) for v in (0,1)]
            adj=complement(n0+k,removed2);data=preprocess(adj,k)
            a,b=len(adj[0]),len(adj[1]);c=len(adj[0]&adj[1])
            assert len(adj)==k*k+k+1
            assert len(adj[1]-adj[0])==k*k-k+1
            assert transport(adj,0,1)==Fraction(c,b)-Fraction(1,a*b)
            assert k+1-(k*k-k+1)<0
            checks+=1;row['last_transient_order']=len(adj)
            # Persistent beta=2k-2 and complement endpoint degree=3k-3.
            Z=list(range(2,k+1));S=list(range(k+1,2*k))
            T=list(range(2*k,3*k-2));R=list(range(3*k-2,4*k-2))
            removed3=[(0,s) for s in S+T]+[(z,s) for z in Z for s in S]
            removed3 += [(1,z) for z in Z]+[(v,r) for r in R for v in (0,1)]
            n=k*k+k+2;adj=complement(n,removed3);data=preprocess(adj,k)
            a,b=len(adj[0]),len(adj[1]);c=len(adj[0]&adj[1])
            assert len(adj[1]-adj[0])==2*k-2
            assert n-1-a==3*k-3
            expected=Fraction(c,b)-Fraction((k-2)*(k-1),a*b)
            assert transport(adj,0,1)==expected
            assert edge_curvature(adj,0,1,k,data,solver='cut')[0]==expected
            checks+=1;row['persistent_beta']=2*k-2
        rows.append(row)
    result={'passed':True,'full_exact_transport_checks':checks,'families':rows,
            'seconds':time.time()-start}
    Path(__file__).with_name('stabilization_verification.json').write_text(json.dumps(result,indent=2))
    print(json.dumps(result,indent=2))

if __name__=='__main__':run()
