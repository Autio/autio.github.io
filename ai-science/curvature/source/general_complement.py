"""Exact bounded transport reduction for complements of bounded codegree.

Standard library only. Generalizes fast_curvature.py; the small min-cost-flow
solver is intentionally separate from the original full-neighborhood solver.
"""
from fractions import Fraction
from itertools import combinations, product
from cut_transport import closure_transport


def preprocess(adj, k):
    if not isinstance(k,int) or k<1: raise ValueError('k must be a positive integer')
    n = len(adj)
    h = [set(range(n)) - {u} - adj[u] for u in range(n)]
    common = [[[] for _ in range(n)] for _ in range(n)]
    updates = 0
    for v, ns in enumerate(h):
        for u, w in combinations(ns, 2):
            common[u][w].append(v)
            common[w][u].append(v)
            updates += 1
            if len(common[u][w]) > k:
                raise ValueError('Complement codegree exceeds parameter')
    return h, common, updates


def mincost(supplies, demands, costs):
    m, q = len(supplies), len(demands)
    src, sink = m + q, m + q + 1
    net = [[] for _ in range(sink + 1)]
    total = sum(supplies)
    assert total == sum(demands)
    def add(u, v, cap, cost):
        net[u].append([v, cap, cost, len(net[v])])
        net[v].append([u, 0, -cost, len(net[u])-1])
    for i, amount in enumerate(supplies):
        add(src, i, amount, 0)
        for j in range(q):
            add(i, m+j, total, costs[i][j])
    for j, amount in enumerate(demands):
        add(m+j, sink, amount, 0)
    flow = result = 0
    while flow < total:
        dist = [None]*len(net); prev = [None]*len(net); dist[src] = 0
        for _ in range(len(net)-1):
            changed = False
            for u in range(len(net)):
                if dist[u] is None: continue
                for z, (v, cap, cost, _) in enumerate(net[u]):
                    if cap and (dist[v] is None or dist[v] > dist[u]+cost):
                        dist[v] = dist[u]+cost; prev[v] = (u,z); changed = True
            if not changed: break
        assert prev[sink] is not None
        amount = total-flow; v = sink
        while v != src:
            u,z = prev[v]; amount = min(amount,net[u][z][1]); v = u
        v = sink
        while v != src:
            u,z = prev[v]; edge = net[u][z]
            edge[1] -= amount; net[v][edge[3]][1] += amount; v = u
        flow += amount; result += amount*dist[sink]
    return result


def bounded_dual(supplies, demands, costs):
    """Capacity-independent exact solver, at most 5^(q-1) dual candidates.

    Targets lie in one open neighborhood, so each pair has distance <=2.
    An integer optimal Kantorovich potential anchored at the first target
    lies in [-2,2] on all targets. This is fast only for small q.
    """
    best = None
    for tail in product(range(-2,3), repeat=len(demands)-1):
        potential = (0,)+tail
        value = sum(amount*min(c+g for c,g in zip(row,potential))
                    for amount,row in zip(supplies,costs))
        value -= sum(amount*g for amount,g in zip(demands,potential))
        if best is None or value>best: best=value
    return best


def edge_curvature(adj, x, y, k, data, force_reduce=False, solver='flow'):
    h, common, _ = data
    n = len(adj)
    if len(adj[x]) > len(adj[y]): x,y = y,x
    a,b = len(adj[x]),len(adj[y]); d = b-a
    rset = set(common[x][y])
    alpha = 1+len(h[y])-len(rset)
    beta = 1+len(h[x])-len(rset)
    c = a-alpha
    if (k==1 or beta >= k*k-k+2) and not force_reduce:
        return Fraction(c,b), {'shortcut':True, 'beta':beta}
    A = {y} | (h[y]-h[x]); B = sorted({x} | (h[x]-h[y]))
    assert len(A)==alpha and len(B)==beta
    outside = A | set(B) | rset
    # Only O(k * beta^2) common vertices can miss multiple targets.
    multiple = set()
    for s,t in combinations(B,2):
        multiple.update(v for v in common[s][t] if v not in outside)
    patterns = {}; masks = {}
    for v in multiple:
        mask = tuple(s for s in B if v in h[s])
        assert len(mask)>=2
        masks[v] = mask
        patterns[mask] = patterns.get(mask,0)+1
    single_total = 0
    for s in B:
        missing = len(h[s])-sum(v in h[s] for v in outside)
        single = missing-sum(s in mask for mask in masks.values())
        assert single>=0
        if single: patterns[(s,)] = single
        single_total += single
    all_adjacent = c-len(multiple)-single_total
    assert all_adjacent>=0
    if all_adjacent: patterns[()] = all_adjacent
    supplies=[]; costs=[]
    for u in sorted(A):
        supplies.append(b)
        row=[]
        for s in B:
            if s in adj[u]: row.append(1)
            else:
                # Here us is a complement edge: its two endpoints occur
                # in the union of H neighborhoods and must be removed.
                cg = n-len(h[u])-len(h[s])+len(common[u][s])
                row.append(2 if cg else 3)
        costs.append(row)
    if d:
        for mask,count in patterns.items():
            supplies.append(count*d)
            costs.append([2 if s in mask else 1 for s in B])
    if solver=='cut': value=closure_transport(supplies,[a]*beta,costs,B.index(x))
    elif solver in ('flow','dual'):
        value = (bounded_dual if solver=='dual' else mincost)(supplies,[a]*beta,costs)
    else: raise ValueError('Unknown solver')
    return 1-Fraction(value,a*b), {'shortcut':False,'beta':beta,
                                 'sources':len(supplies),'patterns':len(patterns)}


def all_curvatures(adj,k,solver='cut'):
    data=preprocess(adj,k)
    answer={}; reductions=0; largest=0
    for x in range(len(adj)):
        for y in sorted(adj[x]):
            if x>=y: continue
            value,meta=edge_curvature(adj,x,y,k,data,solver=solver)
            answer[x,y]=value
            if not meta['shortcut']:
                reductions+=1; largest=max(largest,meta['sources'])
    return answer,{'neighbor_pair_updates':data[2], 'reductions':reductions,
                   'largest_source_count':largest}
