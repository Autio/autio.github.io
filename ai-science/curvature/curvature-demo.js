(function(){
  'use strict';
  const C=window.Curvature,select=document.getElementById('scenario');
  const first=document.getElementById('town-a'),second=document.getElementById('town-b');
  let a;
  function preset(name){
    if(name==='correction')return C.graph(6,[[0,1],[0,2],[0,3],[1,4],[2,4]]);
    if(name==='zero')return C.graph(10,Array.from({length:8},(_,i)=>[0,i+2]));
    if(name==='negative')return C.graph(10,[[1,2],...Array.from({length:7},(_,i)=>[0,i+3]),...Array.from({length:5},(_,i)=>[2,i+3])]);
    return C.graph(10,Array.from({length:10},(_,i)=>[i,(i+1)%10]));
  }
  function reset(){
    a=preset(select.value);
    for(const el of [first,second]){
      el.replaceChildren(...a.map((_,i)=>{const o=document.createElement('option');o.value=i;o.textContent=String.fromCharCode(65+i);return o;}));
    }
    second.value='1';render();
  }
  function render(){
    const status=document.getElementById('solver-status'),table=document.getElementById('edge-values');
    document.getElementById('check-result').textContent='';
    const edgeCount=a.reduce((total,row)=>total+row.filter(Boolean).length,0)/2;
    document.getElementById('network-size').textContent=`${a.length} towns · ${edgeCount} links · ${a.length*(a.length-1)/2-edgeCount} missing`;
    if(!C.connected(a)){status.textContent='The network is disconnected. Restore a link to continue this connected-network experiment.';status.className='solver-status fallback';document.getElementById('lowest-value').textContent='—';document.getElementById('calculation-time').textContent='—';table.replaceChildren();draw([]);return;}
    const t=performance.now(),quick=C.fast(a),values=quick.eligible?quick.values:C.reference(a),elapsed=performance.now()-t;
    const minimum=values.reduce((best,v)=>v.num/v.den<best.num/best.den?v:best,values[0]);
    const removed=a.length*(a.length-1)/2-values.length;
    document.getElementById('network-size').textContent=`${a.length} towns · ${values.length} links · ${removed} missing`;
    document.getElementById('lowest-value').textContent=C.fraction(minimum);
    document.getElementById('calculation-time').textContent=`${elapsed.toFixed(2)} ms`;
    status.textContent=quick.eligible?'Fast exact rule applies: the missing-link pattern passes the structural check.':'Outside the fast rule: the exact reference transport solver is being used.';
    status.className=quick.eligible?'solver-status eligible':'solver-status fallback';
    table.replaceChildren(...values.map(v=>{
      const tr=document.createElement('tr');
      for(const text of [`${String.fromCharCode(65+v.u)}–${String.fromCharCode(65+v.v)}`,C.fraction(v)]){const td=document.createElement('td');td.textContent=text;tr.append(td);}return tr;
    }));
    draw(values);
  }
  function draw(values){
    const svg=document.getElementById('network'),ns='http://www.w3.org/2000/svg',points=a.map((_,i)=>[240+185*Math.cos(2*Math.PI*i/a.length-Math.PI/2),240+185*Math.sin(2*Math.PI*i/a.length-Math.PI/2)]);
    const map=new Map(values.map(v=>[`${v.u},${v.v}`,v]));svg.replaceChildren();
    const title=document.createElementNS(ns,'title');title.textContent='Network links coloured by exact curvature; dashed grey lines are missing links.';svg.append(title);
    for(let u=0;u<a.length;u++)for(let v=u+1;v<a.length;v++){
      const line=document.createElementNS(ns,'line'),value=map.get(`${u},${v}`);
      for(const [key,val] of Object.entries({x1:points[u][0],y1:points[u][1],x2:points[v][0],y2:points[v][1]}))line.setAttribute(key,val);
      line.setAttribute('stroke',!a[u][v]?'#b8c4cf':!value?'#94a3b8':value.num<0?'#b83232':value.num===0?'#af7200':'#1976a2');
      line.setAttribute('stroke-width',value&&value.num<=0?'3':'1.4');
      if(!a[u][v])line.setAttribute('stroke-dasharray','4 7');
      line.setAttribute('opacity',!a[u][v]?'.45':'.75');
      const hint=document.createElementNS(ns,'title');hint.textContent=`${String.fromCharCode(65+u)}–${String.fromCharCode(65+v)}: ${value?C.fraction(value):a[u][v]?'not calculated':'missing'}`;line.append(hint);svg.append(line);
    }
    points.forEach(([x,y],i)=>{
      const circle=document.createElementNS(ns,'circle');circle.setAttribute('cx',x);circle.setAttribute('cy',y);circle.setAttribute('r','17');circle.setAttribute('fill','#102b46');svg.append(circle);
      const text=document.createElementNS(ns,'text');text.setAttribute('x',x);text.setAttribute('y',y+5);text.setAttribute('text-anchor','middle');text.setAttribute('fill','white');text.setAttribute('font-size','14');text.textContent=String.fromCharCode(65+i);svg.append(text);
    });
  }
  select.addEventListener('change',reset);document.getElementById('reset-network').addEventListener('click',reset);
  document.getElementById('toggle-link').addEventListener('click',()=>{
    const u=Number(first.value),v=Number(second.value);
    if(u===v){document.getElementById('solver-status').textContent='Choose two different towns.';return;}
    a[u][v]=a[v][u]=!a[u][v];render();
  });
  document.getElementById('check-reference').addEventListener('click',()=>{
    if(!C.connected(a))return;
    const quick=C.fast(a);
    if(!quick.eligible){document.getElementById('check-result').textContent='This network already uses the reference solver.';return;}
    const exact=C.reference(a),ok=exact.every((v,i)=>v.num*quick.values[i].den===quick.values[i].num*v.den);
    document.getElementById('check-result').textContent=ok?`All ${exact.length} edge values agree exactly with the reference solver.`:'The solvers disagree. Please report this example.';
  });
  select.addEventListener('change',()=>document.getElementById('check-result').textContent='');
  document.getElementById('toggle-link').addEventListener('click',()=>document.getElementById('check-result').textContent='');
  reset();
})();
