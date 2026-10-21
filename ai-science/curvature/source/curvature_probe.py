"""Exact, dependency-free Ollivier curvature exploration. Python 3.10+."""
from fractions import Fraction
from itertools import combinations
from math import lcm
import json, time
from pathlib import Path

def transport(adj, x, y):
    """Integer min-cost flow; Bellman-Ford on residual network."""
    n=len(adj); a=len(adj[x]); b=len(adj[y]); scale=lcm(a,b)
    left=sorted(adj[x]); right=sorted(adj[y]); size=a+b+2; s=size-2; t=size-1
    net=[[] for _ in range(size)]
    def edge(u,v,cap,cost):
        net[u].append([v,cap,cost,len(net[v])])
        net[v].append([u,0,-cost,len(net[u])-1])
    for i in range(a): edge(s,i,scale//a,0)
    for j in range(b): edge(a+j,t,scale//b,0)
    for i,u in enumerate(left):
        dist=[n+1]*n; dist[u]=0; queue=[u]
        for v in queue:
            for w in adj[v]:
                if dist[w]>dist[v]+1: dist[w]=dist[v]+1; queue.append(w)
        for j,v in enumerate(right): edge(i,a+j,scale,dist[v])
    flow=cost=0
    while flow<scale:
        dist=[10**12]*size; dist[s]=0; prev=[None]*size
        for _ in range(size-1):
            changed=False
            for u in range(size):
                if dist[u]==10**12: continue
                for k,(v,cap,c,rev) in enumerate(net[u]):
                    if cap and dist[v]>dist[u]+c:
                        dist[v]=dist[u]+c; prev[v]=(u,k); changed=True
            if not changed: break
        assert prev[t] is not None
        amount=scale-flow; v=t
        while v!=s:
            u,k=prev[v]; amount=min(amount,net[u][k][1]); v=u
        v=t
        while v!=s:
            u,k=prev[v]; e=net[u][k]; e[1]-=amount; net[v][e[3]][1]+=amount; v=u
        flow+=amount; cost+=amount*dist[t]
    return 1-Fraction(cost,scale)

def complement(n, removed):
    adj=[set(range(n))-{i} for i in range(n)]
    for u,v in removed: adj[u].remove(v); adj[v].remove(u)
    return adj

def connected(adj):
    seen={0}; queue=[0]
    for u in queue:
        for v in adj[u]-seen: seen.add(v); queue.append(v)
    return len(seen)==len(adj)

def hall_formula(adj,x,y):
    """Exact diameter-two formula derived in the accompanying research note."""
    if len(adj[x])>len(adj[y]): x,y=y,x
    a=len(adj[x]); b=len(adj[y]); d=b-a
    A=adj[x]-adj[y]; B=adj[y]-adj[x]; C=adj[x]&adj[y]
    targets=sorted(B-{x}); deficit=0; witness=[]
    for mask in range(1<<len(targets)):
        S={v for i,v in enumerate(targets) if mask>>i&1}
        p=sum(bool(adj[u]&S) for u in A)
        q=sum(not bool(adj[u]&S) for u in C)
        value=a*len(S)-b*p-d*(len(C)-q)
        if value>deficit: deficit=value; witness=sorted(S)
    return Fraction(len(C),b)-Fraction(deficit,a*b), witness

def check(n, removed):
    adj=complement(n,removed)
    if not connected(adj): return []
    bad=[]
    for x in range(n):
        for y in sorted(adj[x]):
            if x>=y: continue
            upper=Fraction(len(adj[x]&adj[y]),max(len(adj[x]),len(adj[y])))
            actual=transport(adj,x,y)
            assert actual<=upper
            if actual!=upper: bad.append({'edge':[x,y],'actual':str(actual),'upper':str(upper)})
    return bad

def run():
    start=time.time(); summary={}; examples=[]
    # Exhaust every labelled deletion graph on <=6 vertices, with <=8 deleted edges.
    for n in range(2,7):
        pairs=list(combinations(range(n),2)); count=edges=badcount=0; minbad=None; deg2bad=0
        for m in range(min(8,len(pairs))+1):
            for removed in combinations(pairs,m):
                adj=complement(n,removed)
                if not connected(adj): continue
                count+=1; degrees=[n-1-len(a) for a in adj]; bad=check(n,removed)
                edges+=sum(map(len,adj))//2
                if bad:
                    badcount+=1; minbad=m if minbad is None else min(minbad,m)
                    if max(degrees)<=2: deg2bad+=1
                    if len(examples)<12: examples.append({'n':n,'m':m,'removed':removed,'degrees':degrees,'bad':bad})
        summary[n]={'connected_graphs':count,'edge_checks':edges,'bad_graphs':badcount,'min_deletions_for_failure':minbad,'max_complement_degree_2_failures':deg2bad}
        print(n,summary[n],flush=True)
    result={'summary':summary,'examples':examples,'seconds':time.time()-start}
    Path(__file__).with_name('probe_results.json').write_text(json.dumps(result,indent=2))

if __name__=='__main__': run()
