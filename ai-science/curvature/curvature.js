/* Exact integer-scaled zero-idleness curvature. No external libraries. */
(function (root) {
  'use strict';
  function graph(n, removed) {
    const a = Array.from({length:n}, (_,u) => Array.from({length:n}, (_,v) => u !== v));
    for (const [u,v] of removed) a[u][v] = a[v][u] = false;
    return a;
  }
  function degrees(a) { return a.map(row => row.filter(Boolean).length); }
  function connected(a) {
    const seen = new Set([0]), queue = [0];
    for (const u of queue) for (let v=0;v<a.length;v++) if(a[u][v]&&!seen.has(v)){seen.add(v);queue.push(v);}
    return seen.size===a.length;
  }
  function fast(a) {
    const n=a.length, deg=degrees(a), h=a.map((row,u)=>row.map((v,w)=>u!==w&&!v));
    const missing=h.map(row=>row.flatMap((v,w)=>v?[w]:[]));
    const common=Array.from({length:n},()=>Array(n).fill(0));
    for(let v=0;v<n;v++) for(let i=0;i<missing[v].length;i++) for(let j=i+1;j<missing[v].length;j++){
      const u=missing[v][i],w=missing[v][j];
      common[u][w]++;common[w][u]++;
      if(common[u][w]>2)return {eligible:false,witness:[u,w]};
    }
    const values=[];
    for(let u=0;u<n;u++)for(let v=u+1;v<n;v++)if(a[u][v]){
      const [x,y]=deg[u]<=deg[v]?[u,v]:[v,u], da=deg[x],db=deg[y],r=common[x][y];
      const c=n-2-missing[x].length-missing[y].length+r;
      let epsilon=0;
      if(db===da+1&&missing[y].length-r===1&&missing[x].length-r===2){
        const z=missing[y].find(w=>!h[x][w]);
        const targets=missing[x].filter(w=>!h[y][w]);
        if(targets.every(s=>h[z][s]))epsilon=deg[z]===1?2:1;
      }
      values.push({u,v,num:c*da-epsilon,den:da*db});
    }
    return {eligible:true,values};
  }
  function gcd(a,b){while(b){const t=a%b;a=b;b=t;}return a;}
  function referenceEdge(a,x,y) {
    const n=a.length,left=[],right=[];
    for(let i=0;i<n;i++){if(a[x][i])left.push(i);if(a[y][i])right.push(i);}
    const da=left.length,db=right.length,scale=da*db/gcd(da,db);
    const source=da+db,sink=source+1,size=sink+1,net=Array.from({length:size},()=>[]);
    function add(u,v,cap,cost){net[u].push({v,cap,cost,rev:net[v].length});net[v].push({v:u,cap:0,cost:-cost,rev:net[u].length-1});}
    left.forEach((_,i)=>add(source,i,scale/da,0));
    right.forEach((_,j)=>add(da+j,sink,scale/db,0));
    left.forEach((u,i)=>{
      const dist=Array(n).fill(n+1),queue=[u];dist[u]=0;
      for(const v of queue)for(let w=0;w<n;w++)if(a[v][w]&&dist[w]>dist[v]+1){dist[w]=dist[v]+1;queue.push(w);}
      right.forEach((v,j)=>add(i,da+j,scale,dist[v]));
    });
    let flow=0,cost=0;
    while(flow<scale){
      const dist=Array(size).fill(Infinity),prev=Array(size).fill(null);dist[source]=0;
      for(let step=0;step<size-1;step++){
        let changed=false;
        for(let u=0;u<size;u++)if(Number.isFinite(dist[u]))net[u].forEach((e,k)=>{
          if(e.cap>0&&dist[e.v]>dist[u]+e.cost){dist[e.v]=dist[u]+e.cost;prev[e.v]=[u,k];changed=true;}
        });
        if(!changed)break;
      }
      if(!prev[sink])throw new Error('No complete transport plan.');
      let amount=scale-flow;
      for(let v=sink;v!==source;){const [u,k]=prev[v];amount=Math.min(amount,net[u][k].cap);v=u;}
      for(let v=sink;v!==source;){const [u,k]=prev[v],e=net[u][k];e.cap-=amount;net[v][e.rev].cap+=amount;v=u;}
      flow+=amount;cost+=amount*dist[sink];
    }
    return {u:x,v:y,num:scale-cost,den:scale};
  }
  function reference(a) {
    const values=[];
    for(let u=0;u<a.length;u++)for(let v=u+1;v<a.length;v++)if(a[u][v])values.push(referenceEdge(a,u,v));
    return values;
  }
  function fraction(v){const d=gcd(Math.abs(v.num),v.den);return v.num===0?'0':v.den/d===1?String(v.num/d):`${v.num/d}/${v.den/d}`;}
  const api={graph,connected,fast,reference,referenceEdge,fraction};
  if(typeof module!=='undefined'&&module.exports)module.exports=api;
  else root.Curvature=api;
})(typeof globalThis!=='undefined'?globalThis:this);
