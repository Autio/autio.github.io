"""Exhaustive exact subfunctor check for the binary-cut module over F_2.

Enumerate ALL linear subspaces of J([N]), in the original nontrivial-cut basis,
and retain exactly those stable under every self-map of [N]. No ideal condition
is imposed. An elementary set of self-maps is used only for early rejection;
every surviving space is checked against the full N^N endomorphism set.

For every survivor, restrict to smaller sets and verify every map in F_{<=N}.
Only after enumeration compare the survivors with augmentation-power spaces.

Run: python verify-natural-subfunctors.py --max-n 4
Standard library only. Output JSON is written beside this script.
"""
from itertools import combinations, permutations, product
from pathlib import Path
import argparse
import hashlib
import json
import time


def bits(x):
    while x:
        bit=x & -x
        yield bit.bit_length()-1
        x^=bit


def all_subspaces(dimension):
    """Each subspace exactly once, via canonical reduced-row-echelon bases."""
    for rank in range(dimension+1):
        for pivots in combinations(range(dimension),rank):
            free=[j for j in range(dimension) if j not in pivots]
            cells=[(i,j) for i,pivot in enumerate(pivots) for j in free if j>pivot]
            for assignment in range(1<<len(cells)):
                rows=[1<<pivot for pivot in pivots]
                for k,(i,j) in enumerate(cells):
                    if assignment>>k&1:
                        rows[i]^=1<<j
                yield tuple(rows)


def gaussian_counts(dimension):
    """Independent count of rank-k subspaces via the Gaussian-binomial recurrence."""
    counts=[1]
    for n in range(1,dimension+1):
        counts=[(counts[k-1] if k else 0)
                +(2**k*counts[k] if k<len(counts) else 0)
                for k in range(n+1)]
    return counts


def rref(vectors):
    pivots={}
    for value in vectors:
        while value:
            pivot=(value & -value).bit_length()-1
            if pivot in pivots:
                value^=pivots[pivot]
            else:
                pivots[pivot]=value
                break
    # Remove later pivot coefficients from earlier rows.
    for pivot in sorted(pivots,reverse=True):
        for earlier in pivots:
            if earlier<pivot and (pivots[earlier]>>pivot&1):
                pivots[earlier]^=pivots[pivot]
    return tuple(pivots[p] for p in sorted(pivots))


def contains(basis,value):
    for row in basis:
        pivot=row & -row
        if value & pivot:
            value^=row
    return value==0


def apply(columns,value):
    out=0
    for j in bits(value):
        out^=columns[j]
    return out


def cuts(n):
    # The block avoiding label0 represents each complement pair uniquely.
    return tuple(mask for mask in range(1,1<<n) if not mask&1)


def pullback_matrix(domain,codomain,f):
    """Actual cut pullback for f:[domain]->[codomain], not a power formula."""
    target_cuts=cuts(domain)
    index={mask:i for i,mask in enumerate(target_cuts)}
    full=(1<<domain)-1
    columns=[]
    for cut in cuts(codomain):
        image=sum(1<<i for i in range(domain) if cut>>f[i]&1)
        if image&1:
            image^=full
        columns.append(0 if image==0 else 1<<index[image])
    return tuple(columns)


def stable(basis,columns):
    return all(contains(basis,apply(columns,row)) for row in basis)


def augmentation_power_basis(n,degree):
    # A degree-|A| product of ([delta_i]+1) expands in the cut basis below.
    cut_list=cuts(n)
    index={mask:i for i,mask in enumerate(cut_list)}
    vectors=[]
    for support in cut_list:
        if support.bit_count()<degree:
            continue
        monomial=0
        sub=support
        while sub:
            monomial^=1<<index[sub]
            sub=(sub-1)&support
        vectors.append(monomial)
    return rref(vectors)


def check_n(n):
    started=time.perf_counter()
    dimension=len(cuts(n))
    maps=list(product(range(n),repeat=n))
    matrices={f:pullback_matrix(n,n,f) for f in maps}
    early_maps=[]
    for i in range(n-1):
        f=list(range(n));f[i],f[i+1]=f[i+1],f[i]
        early_maps.append(tuple(f))
    if n>=2:
        f=list(range(n));f[n-1]=0
        early_maps.append(tuple(f))
    early=[matrices[f] for f in early_maps]
    enumerated=0;early_survivors=0;survivors=[]
    rank_counts=[0]*(dimension+1)
    for basis in all_subspaces(dimension):
        enumerated+=1
        rank_counts[len(basis)]+=1
        if not all(stable(basis,matrix) for matrix in early):
            continue
        early_survivors+=1
        if all(stable(basis,matrix) for matrix in matrices.values()):
            survivors.append(basis)
    assert len(set(survivors))==len(survivors)
    assert rank_counts==gaussian_counts(dimension),(n,rank_counts,gaussian_counts(dimension))
    expected={augmentation_power_basis(n,d):d for d in range(1,n+1)}
    assert set(survivors)==set(expected),(n,survivors,expected)
    details=[];injection_checks=0;all_map_checks=0
    for ambient_basis in survivors:
        values={}
        for size in range(1,n+1):
            image_bases=[]
            for injection in permutations(range(n),size):
                matrix=pullback_matrix(size,n,injection)
                image_bases.append(rref(apply(matrix,row) for row in ambient_basis))
                injection_checks+=1
            assert all(b==image_bases[0] for b in image_bases)
            values[size]=image_bases[0]
        for domain in range(1,n+1):
            for codomain in range(1,n+1):
                for f in product(range(codomain),repeat=domain):
                    matrix=pullback_matrix(domain,codomain,f)
                    assert all(contains(values[domain],apply(matrix,row)) for row in values[codomain]),(n,domain,codomain,f)
                    all_map_checks+=1
        details.append({
            'ambient_dimension':len(ambient_basis),
            'ambient_rref_basis_cut_coordinates':list(ambient_basis),
            'matching_augmentation_power':expected[ambient_basis],
            'restricted_dimensions':{str(s):len(b) for s,b in values.items()},
        })
    return {
        'maximum_cardinality':n,'ambient_module_dimension':dimension,
        'all_linear_subspaces_enumerated':enumerated,'self_maps':len(maps),
        'subspace_counts_by_dimension':rank_counts,
        'gaussian_binomial_enumeration_count_verified':True,
        'early_filter_survivors':early_survivors,'all_endomorphism_invariant_subspaces':len(survivors),
        'survivors':details,'all_injection_image_agreement_checks':injection_checks,
        'all_truncated_category_map_checks':all_map_checks,
        'ideal_hypothesis_imposed':False,'all_survivors_are_augmentation_powers':True,
        'cut_basis_masks':list(cuts(n)),'elapsed_seconds':round(time.perf_counter()-started,6),
    }


def main():
    parser=argparse.ArgumentParser()
    parser.add_argument('--max-n',type=int,default=4)
    args=parser.parse_args()
    if not 1<=args.max_n<=4:
        parser.error('exhaustive mode supports 1<=max-n<=4; larger ambient spaces need a different search')
    started=time.perf_counter()
    cases=[check_n(n) for n in range(1,args.max_n+1)]
    report={
        'field':'F_2','method':'exhaustive RREF subspaces in cut coordinates; actual all-map matrices',
        'cases':cases,'total_subspaces_enumerated':sum(c['all_linear_subspaces_enumerated'] for c in cases),
        'total_injection_image_agreement_checks':sum(c['all_injection_image_agreement_checks'] for c in cases),
        'total_truncated_category_map_checks':sum(c['all_truncated_category_map_checks'] for c in cases),
        'all_pass':True,'elapsed_seconds':round(time.perf_counter()-started,6),
        'script_sha256':hashlib.sha256(Path(__file__).read_bytes()).hexdigest(),
    }
    target=Path(__file__).with_name('natural-subfunctor-checks.json')
    target.write_text(json.dumps(report,indent=2)+'\n',encoding='utf-8')
    print(json.dumps(report,indent=2))


if __name__=='__main__':
    main()
