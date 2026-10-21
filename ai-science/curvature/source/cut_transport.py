"""Exact residual edge transport using a two-level maximum-closure network.

Input costs must be graph distances 1,2,3 between residual edge sources
and targets. A distinguished target is at distance one from every source;
all target pairs have distance at most two. These metric hypotheses ensure
an integer optimal dual with source labels -1,0,1 and target labels -2,-1,0.
The standard maximum-weight-closure/min-cut construction then solves it.
"""
from collections import deque


def closure_transport(supplies,demands,costs,anchor,certificate=False):
    m,q=len(supplies),len(demands)
    total=sum(supplies)
    assert total==sum(demands) and all(u>=0 for u in supplies+demands)
    assert 0<=anchor<q and all(row[anchor]==1 for row in costs)
    assert all(len(row)==q and all(c in (1,2,3) for c in row) for row in costs)
    src=2*(m+q);sink=src+1;net=[[] for _ in range(sink+1)]
    infinity=4*total+1
    original=[]
    def add(u,v,cap):
        net[u].append([v,cap,len(net[v])])
        net[v].append([u,0,len(net[u])-1])
        original.append((u,v,cap))
    for i,amount in enumerate(supplies):
        lo,hi=2*i,2*i+1
        add(src,lo,amount);add(src,hi,amount);add(hi,lo,infinity)
    for j,amount in enumerate(demands):
        lo,hi=2*m+2*j,2*m+2*j+1
        add(lo,sink,amount);add(hi,sink,amount);add(hi,lo,infinity)
    for i,row in enumerate(costs):
        for j,cost in enumerate(row):
            lo,hi=2*m+2*j,2*m+2*j+1
            if cost==1:
                add(2*i,lo,infinity);add(2*i+1,hi,infinity)
            elif cost==2:add(2*i+1,lo,infinity)
    add(src,2*m+2*anchor+1,infinity)
    flow=augmentations=0
    while True:
        prev=[None]*len(net);prev[src]=(-1,-1);queue=deque([src])
        while queue and prev[sink] is None:
            u=queue.popleft()
            for z,(v,cap,rev) in enumerate(net[u]):
                if cap>0 and prev[v] is None:
                    prev[v]=(u,z);queue.append(v)
        if prev[sink] is None:break
        amount=infinity;v=sink
        while v!=src:
            u,z=prev[v];amount=min(amount,net[u][z][1]);v=u
        v=sink
        while v!=src:
            u,z=prev[v];edge=net[u][z];edge[1]-=amount
            net[v][edge[2]][1]+=amount;v=u
        flow+=amount;augmentations+=1
    reachable={src};queue=deque([src])
    while queue:
        u=queue.popleft()
        for v,cap,rev in net[u]:
            if cap>0 and v not in reachable:reachable.add(v);queue.append(v)
    cut=sum(cap for u,v,cap in original if u in reachable and v not in reachable)
    assert cut==flow
    f=[-1+int(2*i in reachable)+int(2*i+1 in reachable) for i in range(m)]
    g=[-2+int(2*m+2*j in reachable)+int(2*m+2*j+1 in reachable) for j in range(q)]
    assert g[anchor]==0
    assert all(f[i]-g[j]<=costs[i][j] for i in range(m) for j in range(q))
    value=3*total-flow
    assert value==sum(u*v for u,v in zip(supplies,f))-sum(u*v for u,v in zip(demands,g))
    assert total<=value<=3*total
    if certificate:
        return value,{'source_potentials':f,'target_potentials':g,
                      'maxflow':flow,'cut_capacity':cut,'augmentations':augmentations,
                      'nodes':len(net),'arcs':len(original)}
    return value
