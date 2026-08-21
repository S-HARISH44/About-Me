const boot = document.querySelector('#boot');
const bootBar = document.querySelector('#bootBar');
const bootPercent = document.querySelector('#bootPercent');
const bootStatus = document.querySelector('#bootStatus');
const enter = document.querySelector('#enter');
const stages = ['INITIALIZING SYSTEMS','LOADING DATA CORE','CALIBRATING NEURAL GRAPHICS','MAPPING EXPERIENCE','SYSTEM ONLINE'];
let value=0;
const loader=setInterval(()=>{value+=Math.ceil(Math.random()*8); value=Math.min(value,100);bootBar.style.width=value+'%';bootPercent.textContent=String(value).padStart(2,'0');bootStatus.textContent=stages[Math.min(4,Math.floor(value/23))];if(value===100){clearInterval(loader);enter.hidden=false;}},130);
enter.addEventListener('click',()=>boot.classList.add('done'));
setTimeout(()=>{ if(!enter.hidden) boot.classList.add('done') },4000);

const nav=document.querySelector('#nav'), menu=document.querySelector('#menu');
menu.addEventListener('click',()=>{nav.classList.toggle('open');menu.setAttribute('aria-expanded',nav.classList.contains('open'));menu.querySelector('span').textContent=nav.classList.contains('open')?'-':'+'});
nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>nav.classList.remove('open')));
const details={SOURCE:'Operational feeds, store data, delivery records, and raw business events start here.',ADF:'Azure Data Factory schedules ingestion, monitoring, triggers, and dependable orchestration.',ADLS:'ADLS Gen2 becomes the durable landing zone for governed cloud storage.',DATABRICKS:'Databricks and PySpark clean, dedupe, enforce schemas, and transform 50+ tables.',DELTA:'Delta Lake partitioning and Z-Ordering reduce processing time by 40%.',GOLD:'Gold data powers analytics, dashboards, products, and decision-ready reporting.'};
const detail=document.querySelector('#pipelineDetail');
const nodes=[...document.querySelectorAll('[data-node]')];
let activeNode=0;
function setNode(next){const node=nodes[next%nodes.length];activeNode=next%nodes.length;nodes.forEach(x=>x.classList.remove('active'));node.classList.add('active');detail.classList.add('is-changing');setTimeout(()=>{detail.textContent=details[node.dataset.node];detail.classList.remove('is-changing')},130)}
nodes.forEach((n,i)=>n.addEventListener('mouseenter',()=>setNode(i)));
setNode(0);
setInterval(()=>setNode(activeNode+1),4200);

const chapter=document.querySelector('#chapter'), pLine=document.querySelector('#progressLine');
const panels=[...document.querySelectorAll('[data-chapter]')];
const navLinks=[...nav.querySelectorAll('a')];
function scrollState(){const y=scrollY/(document.documentElement.scrollHeight-innerHeight||1);pLine.style.width=(y*100)+'%';let near=panels.reduce((a,b)=>Math.abs(b.getBoundingClientRect().top)<Math.abs(a.getBoundingClientRect().top)?b:a);chapter.textContent=near.dataset.chapter;scene.progress=y;scene.speed+=(y-scene.lastProgress)*30;scene.lastProgress=y;navLinks.forEach(a=>a.classList.toggle('active',a.getAttribute('href')==='#'+near.id))}
addEventListener('scroll',scrollState,{passive:true});

const revealTargets=[...document.querySelectorAll('.panel,.reveal')];
const io=new IntersectionObserver(entries=>{entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('in-view');}else{entry.target.classList.remove('in-view');}})},{threshold:.18});
revealTargets.forEach(el=>io.observe(el));

const canvas=document.querySelector('#world'),ctx=canvas.getContext('2d');let w,h,dpr,mouse={x:0,y:0,tx:0,ty:0},scene={progress:0,lastProgress:0,speed:0,t:0};
const rand=(a,b)=>a+Math.random()*(b-a);let stars=[];
function resize(){dpr=Math.min(devicePixelRatio,2);w=innerWidth;h=innerHeight;canvas.width=w*dpr;canvas.height=h*dpr;canvas.style.width=w+'px';canvas.style.height=h+'px';ctx.setTransform(dpr,0,0,dpr,0,0);stars=Array.from({length:Math.min(360,Math.round(w*h/5200))},()=>({x:rand(-1,1),y:rand(-1,1),z:rand(.15,1),s:rand(.5,2),p:rand(0,Math.PI*2),v:rand(.35,1.4)}))}resize();addEventListener('resize',resize);addEventListener('pointermove',e=>{mouse.tx=e.clientX/w-.5;mouse.ty=e.clientY/h-.5});
function draw(){scene.t+=.009+Math.min(.025,Math.abs(scene.speed)*.01);scene.speed*=.9;mouse.x+=(mouse.tx-mouse.x)*.06;mouse.y+=(mouse.ty-mouse.y)*.06;ctx.clearRect(0,0,w,h);let mode=scene.progress;let isNeural=false;let cx=w*.5+mouse.x*54,cy=h*.47+mouse.y*42;let glow=ctx.createRadialGradient(cx,cy,0,cx,cy,Math.min(w,h)*.58);glow.addColorStop(0,isNeural?'rgba(167,131,255,.16)':'rgba(87,230,255,.11)');glow.addColorStop(.35,'rgba(188,255,77,.08)');glow.addColorStop(1,'rgba(5,7,13,0)');ctx.fillStyle=glow;ctx.fillRect(0,0,w,h);
 let nodes=[];for(const s of stars){let depth=.28+s.z*1.25;let orbit=scene.t*s.v+s.p+mode*4;let warp=1+Math.abs(scene.speed)*.045;let x=cx+s.x*w*.62/depth+Math.sin(orbit)*22*warp+mouse.x*s.z*30;let y=cy+s.y*h*.55/depth+Math.cos(orbit*.82)*15*warp+mouse.y*s.z*28;let focus=mode<.22?1:mode<.45?(.75+Math.sin(s.p*3)*.25):isNeural?.95:.55;let alpha=(.12+s.z*.48)*focus;ctx.fillStyle=`rgba(${isNeural?'167,131,255':'188,255,77'},${alpha})`;ctx.beginPath();ctx.arc(x,y,s.s*depth*(1+Math.abs(scene.speed)*.018),0,7);ctx.fill();if(s.z>.65)nodes.push({x,y,z:s.z})}
 ctx.lineWidth=.45;ctx.strokeStyle=isNeural?'rgba(167,131,255,.2)':'rgba(87,230,255,.16)';for(let i=0;i<nodes.length;i+=2){const a=nodes[i],b=nodes[(i*7+3)%nodes.length];if(b&&Math.hypot(a.x-b.x,a.y-b.y)<165){ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.stroke()}}
 for(let i=0;i<5;i++){let y=(h*((scene.t*.06+i*.22+mode*.9)%1));ctx.strokeStyle=`rgba(188,255,77,${.02+i*.005})`;ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(w,y+mouse.y*26);ctx.stroke()}
 let r=Math.min(w,h)*(mode<.25?.13:mode<.46?.21:isNeural?.115:.17);ctx.save();ctx.translate(cx,cy);ctx.rotate(scene.t*.32+mode*8);ctx.strokeStyle=isNeural?'rgba(167,131,255,.52)':'rgba(220,255,171,.48)';ctx.lineWidth=1;for(let i=0;i<4;i++){ctx.rotate(Math.PI/4);ctx.beginPath();ctx.ellipse(0,0,r*(1+i*.08),r*(.24+i*.025),0,0,Math.PI*2);ctx.stroke()}ctx.strokeStyle='rgba(87,230,255,.24)';ctx.beginPath();ctx.arc(0,0,r*.48+Math.sin(scene.t*2)*5,0,Math.PI*2);ctx.stroke();ctx.fillStyle=isNeural?'rgba(167,131,255,.95)':'rgba(188,255,77,.95)';ctx.beginPath();ctx.arc(0,0,4+Math.sin(scene.t*4),0,7);ctx.fill();ctx.restore();requestAnimationFrame(draw)}
scrollState();draw();
