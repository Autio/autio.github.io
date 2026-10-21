"""All zero-idleness edge curvatures when the complement is K_{2,3}-free.

Deterministic O(n^2) time and memory with dense indexed tables. Returned
fractions are deliberately unreduced integer pairs: avoiding gcd preserves
the stated word-RAM arithmetic operation bound.
"""

class ForbiddenComplement(ValueError):
    pass

def all_curvatures(adj):
    n=len(adj)
    # adj is an indexed sequence of neighbor sets of a simple undirected graph.
    h=[[False]*n for _ in range(n)]; lists=[[] for _ in range(n)]
    degrees=[len(a) for a in adj]
    for u in range(n):
        for v in range(n):
            if u!=v and v not in adj[u]: h[u][v]=True; lists[u].append(v)
    common=[[0]*n for _ in range(n)]
    updates=0
    for v in range(n):
        ns=lists[v]
        for i in range(len(ns)):
            u=ns[i]
            for j in range(i+1,len(ns)):
                w=ns[j]; common[u][w]+=1; common[w][u]+=1; updates+=1
                if common[u][w]>2:
                    raise ForbiddenComplement(f'Complement vertices {u},{w} have at least three common neighbors')
    answer={}; exceptions=[]
    for u in range(n):
        for v in range(u+1,n):
            if h[u][v]: continue
            x,y=(u,v) if degrees[u]<=degrees[v] else (v,u)
            a=degrees[x]; b=degrees[y]; r=common[x][y]
            c=n-2-len(lists[x])-len(lists[y])+r
            epsilon=0
            # |A|=1+h_y-r=2, |B|=1+h_x-r=3.
            if b==a+1 and len(lists[y])-r==1 and len(lists[x])-r==2:
                assert len(lists[x])<=4 and len(lists[y])<=3
                z=next(w for w in lists[y] if not h[x][w])
                targets=[w for w in lists[x] if not h[y][w]]
                if all(h[z][s] for s in targets):
                    epsilon=2 if degrees[z]==1 else 1
                    exceptions.append({'edge':[u,v],'oriented_edge':[x,y],'source':z,'targets':targets,'epsilon':epsilon})
            answer[(u,v)]=(c*a-epsilon,a*b)
    return answer,{'neighbor_pair_updates':updates,'exceptions':exceptions}
