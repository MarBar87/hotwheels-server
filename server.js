const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json({ limit: '10mb' }));

const API_KEY = process.env.ANTHROPIC_API_KEY;

// Serve the app HTML directly - no file needed
const APP_HTML = `<!DOCTYPE html>
<html lang="de">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
<meta name="apple-mobile-web-app-title" content="Hot Wheels">
<meta name="theme-color" content="#080808">
<title>Hot Wheels Sammlung</title>
<style>
*{box-sizing:border-box;-webkit-tap-highlight-color:transparent;margin:0;padding:0}
body{background:#080808;color:#fff;font-family:'Arial Narrow',Arial,sans-serif;min-height:100vh;overflow-x:hidden;padding-top:env(safe-area-inset-top);padding-bottom:env(safe-area-inset-bottom)}
input,button{font-family:inherit}
input::placeholder{color:#2a2a2a}
button:active{opacity:.82}
@keyframes spin{to{transform:rotate(360deg)}}
@keyframes fadeIn{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:none}}
.spinner{width:34px;height:34px;border:3px solid #FFD700;border-top-color:transparent;border-radius:50%;animation:spin .8s linear infinite}
body::before{content:'';position:fixed;inset:0;z-index:0;background-image:linear-gradient(rgba(255,59,0,.025) 1px,transparent 1px),linear-gradient(90deg,rgba(255,59,0,.025) 1px,transparent 1px);background-size:36px 36px;pointer-events:none}
#app{position:relative;z-index:1;max-width:500px;margin:0 auto}
.header{background:linear-gradient(135deg,#190400,#080808);border-bottom:3px solid #FF3B00;padding:13px 16px 9px;display:flex;align-items:center;gap:11px;position:sticky;top:0;z-index:10}
.hicon{width:38px;height:38px;border-radius:8px;background:linear-gradient(135deg,#FF3B00,#ff6d00);display:flex;align-items:center;justify-content:center;font-size:19px;box-shadow:0 0 14px rgba(255,59,0,.33);flex-shrink:0}
.htitle{font-size:21px;font-weight:900;letter-spacing:2px;line-height:1;text-transform:uppercase}
.hsub{font-size:10px;color:#FF3B00;letter-spacing:4px;text-transform:uppercase}
.hcount{margin-left:auto;background:#151515;border-radius:20px;padding:3px 11px;border:1px solid #2a2a2a;font-size:11px;color:#666;flex-shrink:0}
.tabs{display:flex;border-bottom:1px solid #1a1a1a;position:sticky;top:63px;z-index:9;background:#080808}
.tab{flex:1;padding:11px 2px;border:none;cursor:pointer;background:transparent;color:#3a3a3a;font-size:10px;font-weight:700;letter-spacing:.3px;text-transform:uppercase;border-bottom:3px solid transparent;transition:all .15s;line-height:1.4;font-family:inherit}
.tab.active{background:#130200;color:#FF3B00;border-bottom-color:#FF3B00}
.content{padding:14px 13px 100px}
.slabel{font-size:11px;color:#444;margin-bottom:13px;letter-spacing:1px;text-transform:uppercase}
.photo-area{border:2px dashed #252525;border-radius:13px;padding:28px 18px;text-align:center;cursor:pointer;margin-bottom:11px;background:#0d0d0d;position:relative;overflow:hidden;transition:border-color .3s}
.photo-area.has-img{padding:10px}
.photo-area.loading{border-color:#FFD700}
.photo-area img{max-width:100%;max-height:175px;border-radius:8px;object-fit:contain;display:block;margin:0 auto}
.pa-icon{font-size:36px;margin-bottom:7px}
.pa-text{font-size:14px;font-weight:700;color:#bbb}
.photo-ov{position:absolute;inset:0;background:rgba(0,0,0,.82);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:10px}
.photo-ov-text{font-size:12px;color:#FFD700;letter-spacing:2px}
.big-btn{width:100%;padding:13px;border:none;border-radius:12px;background:linear-gradient(135deg,#FF3B00,#ff6d00);color:#fff;font-size:14px;font-weight:900;letter-spacing:2px;text-transform:uppercase;cursor:pointer;box-shadow:0 4px 18px rgba(255,59,0,.27);margin-bottom:16px;font-family:inherit}
.add-btn{width:100%;padding:11px;border-radius:10px;border:none;background:linear-gradient(135deg,#00b248,#007a30);color:#fff;font-size:13px;font-weight:900;cursor:pointer;text-transform:uppercase;font-family:inherit}
.card{background:#0f0f0f;border-radius:13px;border:1px solid #1e1e1e;margin-bottom:11px;overflow:hidden}
.result-card{background:#0f0f0f;border-radius:13px;overflow:hidden;margin-bottom:13px}
.rc-owned{border:2px solid #00e676}
.rc-new{border:2px solid #FF3B00}
.rh{padding:15px 17px;text-align:center}
.rh-owned{background:linear-gradient(135deg,#002e12,#001209);border-bottom:1px solid rgba(0,230,118,.12)}
.rh-new{background:linear-gradient(135deg,#2e0000,#120000);border-bottom:1px solid rgba(255,59,0,.12)}
.r-emoji{font-size:34px}
.r-status{font-size:19px;font-weight:900;text-transform:uppercase;letter-spacing:2px;margin-top:5px}
.r-owned{color:#00e676}
.r-new{color:#FF3B00}
.r-match{font-size:11px;color:rgba(0,230,118,.47);margin-top:3px}
.r-body{padding:14px}
.r-name{font-size:17px;font-weight:800;margin-bottom:4px}
.r-meta{font-size:12px;color:#555;margin-bottom:11px}
.conf-row{display:flex;align-items:center;gap:6px;background:#151515;border-radius:8px;padding:7px 10px;margin-bottom:11px}
.cdot{width:7px;height:7px;border-radius:50%;flex-shrink:0}
.ctext{font-size:11px;color:#666}
.rnote{font-size:11px;color:#444;font-style:italic;margin-bottom:11px}
.confirm-top{display:flex;gap:11px;padding:12px;border-bottom:1px solid #1a1a1a;align-items:center}
.confirm-top img{width:54px;height:54px;border-radius:7px;object-fit:cover;flex-shrink:0;border:1px solid #222}
.confirm-body{padding:13px}
.fl{font-size:10px;color:#444;margin-bottom:3px;text-transform:uppercase;letter-spacing:1px}
.fi{width:100%;padding:9px 12px;border-radius:8px;border:1px solid #242424;background:#0a0a0a;color:#fff;font-size:14px;outline:none;font-family:inherit;margin-bottom:9px}
.btn-row{display:flex;gap:8px;margin-top:2px}
.cancel-btn{flex:1;padding:10px;border-radius:10px;border:1px solid #222;background:transparent;color:#444;font-size:13px;font-weight:700;cursor:pointer;font-family:inherit}
.confirm-btn{flex:2;padding:10px;border-radius:10px;border:none;color:#fff;font-size:13px;font-weight:900;text-transform:uppercase;letter-spacing:1px;font-family:inherit}
.confirm-btn.on{background:linear-gradient(135deg,#00b248,#007a30);cursor:pointer}
.confirm-btn.off{background:#1a1a1a;color:#2a2a2a;cursor:not-allowed}
.divider{display:flex;align-items:center;gap:10px;margin:16px 0 13px}
.dline{flex:1;height:1px;background:#1a1a1a}
.dtext{font-size:10px;color:#2a2a2a;text-transform:uppercase;letter-spacing:2px}
.manual-row{display:flex;gap:8px}
.manual-inp{flex:1;padding:10px 13px;border-radius:10px;border:1px solid #222;background:#0f0f0f;color:#fff;font-size:14px;outline:none;font-family:inherit}
.plus-btn{padding:10px 15px;border-radius:10px;border:none;background:linear-gradient(135deg,#FF3B00,#ff6d00);color:#fff;font-size:20px;cursor:pointer}
.err-card{background:#160200;border:1px solid #FF3B00;border-radius:12px;padding:16px;text-align:center;margin-bottom:13px}
.retry-btn{margin-top:9px;padding:8px 16px;border-radius:8px;border:none;background:#222;color:#999;cursor:pointer;font-size:13px;font-family:inherit}
.empty{text-align:center;padding:48px 18px;color:#252525}
.empty-icon{font-size:44px;margin-bottom:10px}
.info-box{background:#0f0f0f;border-radius:11px;padding:16px;text-align:center;border:1px solid #1a1a1a}
.col-label{font-size:11px;color:#333;text-transform:uppercase;letter-spacing:1px;margin-bottom:11px}
.car-row{display:flex;align-items:center;gap:10px;background:#0f0f0f;border-radius:10px;padding:9px 10px;border:1px solid #1a1a1a;margin-bottom:7px;animation:fadeIn .2s ease}
.car-thumb{width:40px;height:40px;border-radius:7px;object-fit:cover;flex-shrink:0;border:1px solid #222}
.car-num{width:40px;height:40px;border-radius:7px;flex-shrink:0;background:linear-gradient(135deg,rgba(255,59,0,.09),#150000);display:flex;align-items:center;justify-content:center;font-size:10px;color:rgba(255,59,0,.5);font-weight:800}
.car-info{flex:1;min-width:0}
.car-name{font-size:13px;color:#ccc;font-weight:700;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.car-badges{display:flex;gap:4px;margin-top:3px;flex-wrap:wrap}
.badge{font-size:10px;padding:2px 6px;border-radius:20px;font-weight:700}
.b-series{background:rgba(255,59,0,.15);color:#FF3B00;border:1px solid rgba(255,59,0,.2)}
.b-num{background:rgba(255,215,0,.1);color:#FFD700;border:1px solid rgba(255,215,0,.2)}
.b-color{background:#1a1a1a;color:#666;border:1px solid #222}
.remove-btn{background:none;border:none;color:#2a2a2a;font-size:15px;cursor:pointer;padding:3px 5px;flex-shrink:0;line-height:1}
.toast{position:fixed;bottom:24px;left:50%;transform:translateX(-50%);padding:10px 20px;border-radius:30px;font-size:13px;font-weight:700;z-index:100;white-space:nowrap;box-shadow:0 4px 20px rgba(0,0,0,.7)}
.toast-ok{background:#00200c;border:1px solid #00e676;color:#00e676}
.toast-warn{background:#2e1a00;border:1px solid #FFD700;color:#FFD700}
.set-card{background:#0f0f0f;border:1px solid #1a1a1a;border-radius:13px;padding:16px;margin-bottom:13px}
.set-title{font-size:13px;font-weight:700;color:#aaa;text-transform:uppercase;letter-spacing:1px;margin-bottom:13px}
.set-inp{width:100%;padding:9px 12px;border-radius:8px;border:1px solid #242424;background:#0a0a0a;color:#fff;font-size:13px;outline:none;font-family:inherit;margin-bottom:8px}
.set-btn{width:100%;padding:11px;border:none;border-radius:10px;background:linear-gradient(135deg,#FF3B00,#ff6d00);color:#fff;font-size:13px;font-weight:900;cursor:pointer;text-transform:uppercase;font-family:inherit;margin-bottom:6px}
.set-btn.sec{background:#1a1a1a;color:#666;border:1px solid #222}
.set-btn.danger{background:linear-gradient(135deg,#8b0000,#500000)}
.set-hint{font-size:11px;color:#333;margin-top:6px;line-height:1.5}
.key-status{display:flex;align-items:center;gap:8px;padding:8px 10px;border-radius:8px;background:#0a0a0a;border:1px solid #1a1a1a;margin-bottom:9px;font-size:11px;color:#555}
.key-dot{width:7px;height:7px;border-radius:50%;background:#00e676;flex-shrink:0}
.setup-wrap{padding:18px 14px}
.setup-card{background:#0f0f0f;border:1px solid #2a2a2a;border-radius:13px;padding:20px}
.setup-title{font-size:18px;font-weight:900;margin-bottom:6px}
.setup-sub{font-size:13px;color:#555;margin-bottom:16px;line-height:1.6}
.setup-inp{width:100%;padding:11px 13px;border-radius:10px;border:1px solid #2a2a2a;background:#0a0a0a;color:#fff;font-size:14px;outline:none;font-family:inherit;margin-bottom:10px}
.setup-btn{width:100%;padding:13px;border:none;border-radius:10px;background:linear-gradient(135deg,#FF3B00,#ff6d00);color:#fff;font-size:14px;font-weight:900;cursor:pointer;text-transform:uppercase;letter-spacing:2px;font-family:inherit}
.series-header{background:#0f0f0f;border-radius:11px;border:1px solid #1a1a1a;padding:11px 13px;margin-bottom:8px;cursor:pointer;display:flex;align-items:center;gap:9px}
.series-body{padding:9px 2px 4px;animation:fadeIn .2s ease}
.series-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(74px,1fr));gap:6px;margin-top:6px}
.slot{border-radius:8px;padding:7px 5px;text-align:center;border:1px solid transparent}
.slot-owned{background:#001a09;border-color:rgba(0,230,118,.2)}
.slot-missing{background:#1a0800;border-color:rgba(255,59,0,.12)}
</style>
</head>
<body>
<div id="app"></div>
<script>
const SK='hw-v5',SU='hw-server-url';
let state={
  tab:'add',collection:[],series:{},
  serverUrl:localStorage.getItem(SU)||'',
  setupDone:true,
  addImg:null,addRes:null,addLoading:false,
  editName:'',editSeries:'',editSeriesNum:'',editSeriesTotal:'',editColor:'',
  scanImg:null,scanRes:null,scanLoading:false,
  manualName:'',toast:null,toastTimer:null,newServerUrl:'',openSeries:null
};

function loadData(){try{const r=localStorage.getItem(SK);return r?JSON.parse(r):{collection:[],series:{}}}catch{return{collection:[],series:{}}}}
function saveData(){try{localStorage.setItem(SK,JSON.stringify({collection:state.collection,series:state.series}))}catch{}}
const d=loadData();state.collection=d.collection||[];state.series=d.series||{};

async function callServer(base64,mode){
  const url='/scan';
  const res=await fetch(url,{
    method:'POST',
    headers:{'Content-Type':'application/json'},
    body:JSON.stringify({base64,mode,collection:state.collection})
  });
  const data=await res.json();
  if(data.error)throw new Error(data.error);
  return data;
}

function mergeSeries(car){
  if(!car.seriesName)return;
  const key=car.seriesName,allCars=car.seriesAllCars||[];
  if(!state.series[key]){
    const total=car.seriesTotal||allCars.length||null;
    const slots=allCars.map(c=>({num:c.num,name:c.name,owned:false}));
    if(total&&slots.length===0)for(let i=1;i<=total;i++)slots.push({num:i,name:null,owned:false});
    const ts=slots.find(s=>s.num===car.seriesNum);
    if(ts){ts.owned=true;if(!ts.name)ts.name=car.name;}
    else if(car.seriesNum)slots.push({num:car.seriesNum,name:car.name,owned:true});
    slots.sort((a,b)=>a.num-b.num);
    state.series[key]={total:total||slots.length,cars:slots,newlyAdded:true};
  }else{
    const s=state.series[key];
    for(const ac of allCars){const ex=s.cars.find(c=>c.num===ac.num);if(!ex)s.cars.push({num:ac.num,name:ac.name,owned:false});else if(!ex.name)ex.name=ac.name;}
    const slot=s.cars.find(c=>c.num===car.seriesNum);
    if(slot){slot.owned=true;if(!slot.name)slot.name=car.name;}
    else if(car.seriesNum)s.cars.push({num:car.seriesNum,name:car.name,owned:true});
    s.cars.sort((a,b)=>a.num-b.num);
    if(car.seriesTotal&&car.seriesTotal>s.total)s.total=car.seriesTotal;
    s.newlyAdded=false;
  }
}

function showToast(msg,type='ok'){
  if(state.toastTimer)clearTimeout(state.toastTimer);
  state.toast={msg,type};render();
  state.toastTimer=setTimeout(()=>{state.toast=null;render();},2600);
}
function cdColor(l){return l==='hoch'?'#00e676':l==='mittel'?'#FFD700':'#ff9800'}
function readFile(f){return new Promise((res,rej)=>{const r=new FileReader();r.onload=e=>res(e.target.result);r.onerror=rej;r.readAsDataURL(f);})}
function compress(url,maxW=800){return new Promise(res=>{const i=new Image();i.onload=()=>{const c=document.createElement('canvas');const s=Math.min(1,maxW/i.width);c.width=i.width*s;c.height=i.height*s;c.getContext('2d').drawImage(i,0,0,c.width,c.height);res(c.toDataURL('image/jpeg',.75));};i.src=url;})}

async function handlePhoto(file,mode){
  if(!file)return;
  if(mode==='add'){state.addRes=null;state.addLoading=true;state.addImg=null;}
  else{state.scanRes=null;state.scanLoading=true;state.scanImg=null;}
  render();
  try{
    const raw=await readFile(file);
    const url=await compress(raw);
    if(mode==='add')state.addImg=url;else state.scanImg=url;
    render();
    const r=await callServer(url.split(',')[1],mode);
    if(mode==='add'){state.addRes=r;state.editName=r.name||'';state.editSeries=r.seriesName||'';state.editSeriesNum=r.seriesNum?String(r.seriesNum):'';state.editSeriesTotal=r.seriesTotal?String(r.seriesTotal):'';state.editColor=r.color||'';}
    else state.scanRes=r;
  }catch(e){if(mode==='add')state.addRes={error:true,msg:e.message};else state.scanRes={error:true,msg:e.message};}
  if(mode==='add')state.addLoading=false;else state.scanLoading=false;
  render();
}

function confirmAdd(){
  const name=state.editName.trim();if(!name)return;
  if(state.collection.some(c=>c.name.toLowerCase()===name.toLowerCase())){showToast('Schon in der Sammlung!','warn');return;}
  const car={id:Date.now()+Math.random(),name,seriesName:state.editSeries.trim()||null,seriesNum:parseInt(state.editSeriesNum)||null,seriesTotal:parseInt(state.editSeriesTotal)||null,color:state.editColor.trim()||null,seriesAllCars:state.addRes?.seriesAllCars||[],thumb:state.addImg,addedAt:new Date().toISOString()};
  state.collection=[...state.collection,car];mergeSeries(car);saveData();
  showToast('✓ Zur Sammlung hinzugefügt!');
  state.addImg=null;state.addRes=null;state.editName='';state.editSeries='';state.editSeriesNum='';state.editSeriesTotal='';state.editColor='';
  render();
}

function addManual(){
  const name=state.manualName.trim();if(!name)return;
  if(state.collection.some(c=>c.name.toLowerCase()===name.toLowerCase())){showToast('Schon in der Sammlung!','warn');return;}
  const car={id:Date.now(),name,seriesName:null,seriesNum:null,seriesTotal:null,color:null,seriesAllCars:[],thumb:null,addedAt:new Date().toISOString()};
  state.collection=[...state.collection,car];saveData();state.manualName='';showToast('✓ Hinzugefügt!');render();
}

function removeCar(id){
  const car=state.collection.find(c=>c.id===id);
  state.collection=state.collection.filter(c=>c.id!==id);
  if(car?.seriesName&&state.series[car.seriesName]){const slot=state.series[car.seriesName].cars.find(s=>s.num===car.seriesNum);if(slot)slot.owned=false;}
  saveData();showToast('Entfernt');render();
}

function addScannedCar(){
  const r=state.scanRes;if(!r?.name)return;
  if(state.collection.some(c=>c.name.toLowerCase()===r.name.toLowerCase())){showToast('Schon in der Sammlung!','warn');return;}
  const car={id:Date.now(),name:r.name,seriesName:r.seriesName||null,seriesNum:r.seriesNum||null,seriesTotal:r.seriesTotal||null,color:r.color||null,seriesAllCars:r.seriesAllCars||[],thumb:state.scanImg,addedAt:new Date().toISOString()};
  state.collection=[...state.collection,car];mergeSeries(car);saveData();
  state.scanRes={...state.scanRes,owned:true};showToast('✓ Hinzugefügt!');render();
}

function saveServerUrl(){
  const url=state.newServerUrl.trim();
  if(!url.startsWith('http')){showToast('Ungültige URL','warn');return;}
  state.serverUrl=url;state.setupDone=true;localStorage.setItem(SU,url);
  showToast('✓ Server gespeichert!');render();
}

function exportData(){
  const blob=new Blob([JSON.stringify({collection:state.collection,series:state.series},null,2)],{type:'application/json'});
  const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download='hotwheels.json';a.click();URL.revokeObjectURL(url);showToast('✓ Exportiert!');
}

function importData(file){
  if(!file)return;
  const r=new FileReader();
  r.onload=e=>{try{const d=JSON.parse(e.target.result);if(d.collection)state.collection=d.collection;if(d.series)state.series=d.series;saveData();showToast(\`✓ \${state.collection.length} Autos importiert!\`);render();}catch{showToast('Ungültige Datei','warn');}};
  r.readAsText(file);
}

// DOM helpers
function el(tag,attrs,...kids){
  const e=document.createElement(tag);
  for(const[k,v]of Object.entries(attrs||{})){if(k==='class')e.className=v;else if(k.startsWith('on'))e[k.toLowerCase()]=v;else e.setAttribute(k,v);}
  for(const k of kids){if(k==null)continue;e.appendChild(typeof k==='string'?document.createTextNode(k):k);}
  return e;
}
function mkFI(mode){const i=el('input',{type:'file',accept:'image/*',capture:'environment',style:'display:none'});i.onchange=ev=>handlePhoto(ev.target.files[0],mode);return i;}
function badge(type,text){const c={series:'b-series',num:'b-num',color:'b-color'}[type]||'b-color';return el('span',{class:\`badge \${c}\`},text);}

function render(){
  const app=document.getElementById('app');app.innerHTML='';
  if(!state.setupDone){app.appendChild(renderSetup());return;}
  app.appendChild(renderHeader());app.appendChild(renderTabs());
  const content=el('div',{class:'content'});
  const t=state.tab;
  if(t==='add')content.appendChild(renderAdd());
  else if(t==='scan')content.appendChild(renderScan());
  else if(t==='series')content.appendChild(renderSeries());
  else if(t==='collection')content.appendChild(renderCollection());
  else content.appendChild(renderSettings());
  app.appendChild(content);
  if(state.toast)app.appendChild(el('div',{class:\`toast toast-\${state.toast.type}\`},state.toast.msg));
}

function renderSetup(){
  const w=el('div',{});
  w.appendChild(el('div',{class:'header'},el('div',{class:'hicon'},'🏎️'),el('div',{},el('div',{class:'htitle'},'Hot Wheels'),el('div',{class:'hsub'},'Sammlung Tracker'))));
  const card=el('div',{class:'setup-card'},
    el('div',{class:'setup-title'},'🖥️ Server URL eingeben'),
    el('div',{class:'setup-sub'},'Gib die URL deines Railway-Servers ein. Du findest sie im Railway Dashboard nach dem Deployment.')
  );
  const inp=el('input',{class:'setup-inp',type:'url',placeholder:'https://dein-server.railway.app'});
  inp.oninput=ev=>state.newServerUrl=ev.target.value;
  inp.onkeydown=ev=>{if(ev.key==='Enter')saveServerUrl();};
  card.appendChild(inp);
  const btn=el('button',{class:'setup-btn'},'✓ Speichern & Starten');btn.onclick=saveServerUrl;card.appendChild(btn);
  const hint=el('div',{style:'font-size:12px;color:#444;margin-top:10px;line-height:1.5'},'Noch kein Server? Folge der Anleitung (PDF) um deinen kostenlosen Railway-Server einzurichten.');
  card.appendChild(hint);
  w.appendChild(el('div',{class:'setup-wrap'},card));return w;
}

function renderHeader(){
  return el('div',{class:'header'},
    el('div',{class:'hicon'},'🏎️'),
    el('div',{},el('div',{class:'htitle'},'Hot Wheels'),el('div',{class:'hsub'},'Sammlung Tracker')),
    el('div',{class:'hcount'},\`\${state.collection.length} · \${Object.keys(state.series).length} Serien\`)
  );
}

function renderTabs(){
  return el('div',{class:'tabs'},...[['add','➕ Hinzuf.'],['scan','🔍 Prüfen'],['series','📊 Serien'],['collection','📋 Liste'],['settings','⚙️']].map(([key,label])=>{
    const b=el('button',{class:\`tab\${state.tab===key?' active':''}\`},label);b.onclick=()=>{state.tab=key;render();};return b;
  }));
}

function photoArea(img,loading,loadText,icon,ph,onClick){
  const area=el('div',{class:\`photo-area\${img?' has-img':''}\${loading?' loading':''}\`});
  area.onclick=onClick;
  if(img)area.appendChild(el('img',{src:img}));
  else{area.appendChild(el('div',{class:'pa-icon'},icon));area.appendChild(el('div',{class:'pa-text'},ph));}
  if(loading){const ov=el('div',{class:'photo-ov'});ov.appendChild(el('div',{class:'spinner'}));ov.appendChild(el('div',{class:'photo-ov-text'},loadText));area.appendChild(ov);}
  return area;
}

function confRow(level){
  const row=el('div',{class:'conf-row'});
  row.appendChild(el('span',{class:'cdot',style:\`background:\${cdColor(level)}\`}));
  row.appendChild(el('span',{class:'ctext'},\`Erkennungssicherheit: \${level}\`));
  return row;
}

function renderAdd(){
  const w=el('div',{});
  w.appendChild(el('div',{class:'slabel'},'Foto → KI erkennt Auto & Serie → Sammlung'));
  const fi=mkFI('add');w.appendChild(fi);
  if(!state.addRes){
    w.appendChild(photoArea(state.addImg,state.addLoading,'KI analysiert...','📸','Tippe zum Fotografieren',()=>{fi.value='';fi.click();}));
    const btn=el('button',{class:'big-btn'},'📷 Foto aufnehmen');btn.onclick=()=>{fi.value='';fi.click();};w.appendChild(btn);
  }
  if(state.addRes?.error){
    const c=el('div',{class:'err-card'},el('div',{style:'font-size:22px;margin-bottom:4px'},'⚠️'),el('div',{style:'color:#FF3B00;font-weight:700'},'Erkennung fehlgeschlagen'));
    if(state.addRes.msg)c.appendChild(el('div',{style:'color:#555;font-size:11px;margin-top:4px'},state.addRes.msg));
    const rb=el('button',{class:'retry-btn'},'Nochmal');rb.onclick=()=>{state.addRes=null;state.addImg=null;render();};c.appendChild(rb);w.appendChild(c);
  }
  if(state.addRes&&!state.addRes.error){
    const card=el('div',{class:'card'});
    const top=el('div',{class:'confirm-top'});
    if(state.addImg)top.appendChild(el('img',{src:state.addImg}));
    const info=el('div',{style:'flex:1'});
    if(state.addRes.seriesName){
      const sb=el('div',{style:'margin-bottom:5px'});
      sb.appendChild(badge('series',state.addRes.seriesName));
      if(state.addRes.seriesNum&&state.addRes.seriesTotal)sb.appendChild(badge('num',\`\${state.addRes.seriesNum}/\${state.addRes.seriesTotal}\`));
      info.appendChild(sb);
    }
    info.appendChild(confRow(state.addRes.confidence));
    if(state.addRes.note)info.appendChild(el('div',{style:'font-size:11px;color:#444;font-style:italic'},'💡 '+state.addRes.note));
    top.appendChild(info);card.appendChild(top);
    const body=el('div',{class:'confirm-body'});
    body.appendChild(el('div',{class:'fl'},'Modellname *'));
    const ni=el('input',{class:'fi',placeholder:'z.B. Ford Mustang',value:state.editName});
    ni.oninput=ev=>{state.editName=ev.target.value;const b=document.querySelector('.confirm-btn');if(b){const a=ev.target.value.trim().length>0;b.className=\`confirm-btn \${a?'on':'off'}\`;b.onclick=a?confirmAdd:null;}};
    body.appendChild(ni);
    body.appendChild(el('div',{class:'fl'},'Serie'));
    const si=el('input',{class:'fi',placeholder:'z.B. HW Race Day 2024',value:state.editSeries});si.oninput=ev=>state.editSeries=ev.target.value;body.appendChild(si);
    const nr=el('div',{style:'display:flex;gap:8px'});
    const n1=el('div',{style:'flex:1'});n1.appendChild(el('div',{class:'fl'},'Nummer'));const ni2=el('input',{class:'fi',type:'number',placeholder:'3',value:state.editSeriesNum,style:'margin-bottom:0'});ni2.oninput=ev=>state.editSeriesNum=ev.target.value;n1.appendChild(ni2);
    const n2=el('div',{style:'flex:1'});n2.appendChild(el('div',{class:'fl'},'Von total'));const ni3=el('input',{class:'fi',type:'number',placeholder:'10',value:state.editSeriesTotal,style:'margin-bottom:0'});ni3.oninput=ev=>state.editSeriesTotal=ev.target.value;n2.appendChild(ni3);
    nr.appendChild(n1);nr.appendChild(n2);body.appendChild(nr);
    body.appendChild(el('div',{style:'height:9px'}));
    body.appendChild(el('div',{class:'fl'},'Farbe'));
    const ci=el('input',{class:'fi',placeholder:'z.B. Rot',value:state.editColor,style:'margin-bottom:12px'});ci.oninput=ev=>state.editColor=ev.target.value;body.appendChild(ci);
    const br=el('div',{class:'btn-row'});
    const cb=el('button',{class:'cancel-btn'},'Abbrechen');cb.onclick=()=>{state.addRes=null;state.addImg=null;render();};
    const active=state.editName.trim().length>0;
    const cfb=el('button',{class:\`confirm-btn \${active?'on':'off'}\`},'✓ Hinzufügen');if(active)cfb.onclick=confirmAdd;
    br.appendChild(cb);br.appendChild(cfb);body.appendChild(br);card.appendChild(body);w.appendChild(card);
  }
  w.appendChild(el('div',{class:'divider'},el('div',{class:'dline'}),el('div',{class:'dtext'},'oder manuell'),el('div',{class:'dline'})));
  const mr=el('div',{class:'manual-row'});
  const mi=el('input',{class:'manual-inp',placeholder:'Modellname...',value:state.manualName});mi.oninput=ev=>state.manualName=ev.target.value;mi.onkeydown=ev=>{if(ev.key==='Enter')addManual();};
  const pb=el('button',{class:'plus-btn'},'+');pb.onclick=addManual;mr.appendChild(mi);mr.appendChild(pb);w.appendChild(mr);
  return w;
}

function renderScan(){
  const w=el('div',{});
  w.appendChild(el('div',{class:'slabel'},'Im Laden: Foto → KI prüft ob schon vorhanden'));
  const fi=mkFI('scan');w.appendChild(fi);
  w.appendChild(photoArea(state.scanImg,state.scanLoading,'Prüfe Sammlung...','🔍','Auto im Laden fotografieren',()=>{state.scanRes=null;state.scanImg=null;fi.value='';fi.click();}));
  const btn=el('button',{class:'big-btn'},'📷 Foto aufnehmen');btn.onclick=()=>{state.scanRes=null;state.scanImg=null;fi.value='';fi.click();};w.appendChild(btn);
  const r=state.scanRes;
  if(r&&!r.error){
    const owned=r.owned;
    const card=el('div',{class:\`result-card \${owned?'rc-owned':'rc-new'}\`});
    const head=el('div',{class:\`rh \${owned?'rh-owned':'rh-new'}\`},el('div',{class:'r-emoji'},owned?'✅':'🆕'),el('div',{class:\`r-status \${owned?'r-owned':'r-new'}\`},owned?'Bereits vorhanden!':'Noch nicht dabei!'));
    if(owned&&r.matchedWith)head.appendChild(el('div',{class:'r-match'},'→ '+r.matchedWith));
    card.appendChild(head);
    const body=el('div',{class:'r-body'});
    body.appendChild(el('div',{class:'r-name'},r.name));
    if(r.seriesName){
      const sb=el('div',{style:'display:flex;gap:4px;flex-wrap:wrap;margin-bottom:9px'});
      sb.appendChild(badge('series',r.seriesName));
      if(r.seriesNum&&r.seriesTotal)sb.appendChild(badge('num',\`Nr. \${r.seriesNum}/\${r.seriesTotal}\`));
      body.appendChild(sb);
      const sd=state.series[r.seriesName];
      if(sd){
        const oc=sd.cars.filter(c=>c.owned).length;
        const pct=sd.total?Math.round(oc/sd.total*100):0;
        const pb=el('div',{style:'background:#151515;border-radius:9px;padding:9px 11px;margin-bottom:10px'});
        pb.appendChild(el('div',{style:'font-size:11px;color:#555;margin-bottom:5px'},\`Serien-Fortschritt: \${oc}/\${sd.total}\`));
        const bg=el('div',{style:'height:4px;background:#1e1e1e;border-radius:3px;overflow:hidden'});
        bg.appendChild(el('div',{style:\`height:100%;width:\${pct}%;background:linear-gradient(90deg,#FF3B00,#FFD700);border-radius:3px\`}));
        pb.appendChild(bg);body.appendChild(pb);
      }
    }
    const meta=[r.color,r.year].filter(Boolean).join(' · ');
    if(meta)body.appendChild(el('div',{class:'r-meta'},meta));
    body.appendChild(confRow(r.confidence));
    if(r.note)body.appendChild(el('div',{class:'rnote'},'💡 '+r.note));
    if(!owned){const ab=el('button',{class:'add-btn'},'+ Zur Sammlung hinzufügen');ab.onclick=addScannedCar;body.appendChild(ab);}
    card.appendChild(body);w.appendChild(card);
  }
  if(r?.error){
    const c=el('div',{class:'err-card'},el('div',{style:'font-size:22px;margin-bottom:4px'},'⚠️'),el('div',{style:'color:#FF3B00;font-weight:700'},'Erkennung fehlgeschlagen'));
    if(r.msg)c.appendChild(el('div',{style:'color:#555;font-size:11px;margin-top:4px'},r.msg));
    w.appendChild(c);
  }
  if(state.collection.length===0&&!r)w.appendChild(el('div',{class:'info-box'},el('div',{style:'font-size:28px;margin-bottom:7px'},'💡'),el('div',{style:'color:#444;font-size:13px;line-height:1.6'},'Füge zuerst Autos hinzu.')));
  return w;
}

function renderSeries(){
  const w=el('div',{});
  const keys=Object.keys(state.series);
  if(keys.length===0){
    w.appendChild(el('div',{class:'empty'},el('div',{class:'empty-icon'},'📊'),el('div',{style:'font-size:13px;color:#333'},'Noch keine Serien erkannt.'),el('div',{style:'font-size:12px;color:#252525;margin-top:5px'},'Serien werden automatisch erkannt,\\nsobald du ein Auto per Foto hinzufügst.')));
    return w;
  }
  w.appendChild(el('div',{class:'col-label'},\`\${keys.length} Serien erkannt\`));
  for(const key of keys){
    const s=state.series[key];
    const oc=s.cars.filter(c=>c.owned).length;
    const total=s.total||s.cars.length;
    const pct=total?Math.round(oc/total*100):0;
    const complete=oc===total&&total>0;
    const isOpen=state.openSeries===key;
    const header=el('div',{class:'series-header'});
    const nw=el('div',{style:'flex:1;min-width:0'});
    nw.appendChild(el('div',{style:'font-size:13px;font-weight:800;color:#eee;white-space:nowrap;overflow:hidden;text-overflow:ellipsis'},key));
    if(s.newlyAdded)nw.appendChild(el('span',{style:'font-size:9px;padding:1px 6px;border-radius:20px;background:rgba(255,215,0,.12);border:1px solid rgba(255,215,0,.25);color:#FFD700;font-weight:700'},'Neu'));
    header.appendChild(nw);
    const pw=el('div',{style:'flex-shrink:0;display:flex;flex-direction:column;align-items:flex-end;gap:3px'});
    pw.appendChild(el('div',{style:\`font-size:12px;font-weight:700;color:\${complete?'#00e676':oc>0?'#FFD700':'#444'}\`},\`\${oc}/\${total}\`));
    const bg=el('div',{style:'width:68px;height:4px;background:#1e1e1e;border-radius:3px;overflow:hidden'});
    bg.appendChild(el('div',{style:\`height:100%;width:\${pct}%;background:linear-gradient(90deg,#FF3B00,#FFD700);border-radius:3px\`}));
    pw.appendChild(bg);header.appendChild(pw);
    header.appendChild(el('div',{style:\`color:#444;font-size:13px;margin-left:4px;transition:transform .2s;\${isOpen?'transform:rotate(90deg)':''}\`},'›'));
    header.onclick=()=>{state.openSeries=isOpen?null:key;render();};
    w.appendChild(header);
    if(isOpen){
      const body=el('div',{class:'series-body'});
      if(complete)body.appendChild(el('div',{style:'background:#001a09;border:1px solid rgba(0,230,118,.2);border-radius:9px;padding:9px 11px;margin-bottom:9px;font-size:12px;color:#00e676;font-weight:700;text-align:center'},'🏆 Serie vollständig!'));
      const missing=s.cars.filter(c=>!c.owned);
      if(!complete&&missing.length>0){
        const mb=el('div',{style:'background:#160a00;border:1px solid rgba(255,59,0,.15);border-radius:9px;padding:9px 11px;margin-bottom:9px'});
        mb.appendChild(el('div',{style:'font-size:11px;color:#FF3B00;font-weight:700;margin-bottom:3px'},\`⚠️ \${missing.length} \${missing.length===1?'Auto fehlt':'Autos fehlen'}\`));
        const ml=missing.filter(c=>c.name).map(c=>\`Nr.\${c.num}: \${c.name}\`).join(', ');
        if(ml)mb.appendChild(el('div',{style:'font-size:11px;color:#663300'},ml));
        body.appendChild(mb);
      }
      const grid=el('div',{class:'series-grid'});
      const maxNum=s.total||Math.max(...s.cars.map(c=>c.num).filter(Boolean),0);
      for(let i=1;i<=maxNum;i++){
        const slot=s.cars.find(c=>c.num===i);const owned=slot?.owned;
        const se=el('div',{class:\`slot \${owned?'slot-owned':'slot-missing'}\`});
        se.appendChild(el('div',{style:\`font-size:10px;font-weight:800;color:\${owned?'#00e676':'#444'};margin-bottom:2px\`},\`\${i}/\${maxNum}\`));
        se.appendChild(el('div',{style:'font-size:13px'},owned?'✅':'⬜'));
        if(slot?.name)se.appendChild(el('div',{style:\`font-size:9px;color:\${owned?'rgba(0,230,118,.6)':'#444'};margin-top:2px;line-height:1.3;overflow:hidden;text-overflow:ellipsis;white-space:nowrap\`},slot.name));
        grid.appendChild(se);
      }
      body.appendChild(grid);w.appendChild(body);
    }
  }
  return w;
}

function renderCollection(){
  const w=el('div',{});
  if(state.collection.length===0){w.appendChild(el('div',{class:'empty'},el('div',{class:'empty-icon'},'🏁'),el('div',{style:'font-size:13px;color:#333'},'Noch keine Autos.')));return w;}
  w.appendChild(el('div',{class:'col-label'},\`\${state.collection.length} \${state.collection.length===1?'Auto':'Autos'}\`));
  state.collection.forEach((car,i)=>{
    const row=el('div',{class:'car-row'});
    if(car.thumb)row.appendChild(el('img',{class:'car-thumb',src:car.thumb}));
    else row.appendChild(el('div',{class:'car-num'},String(i+1)));
    const info=el('div',{class:'car-info'});
    info.appendChild(el('div',{class:'car-name'},car.name));
    const bs=el('div',{class:'car-badges'});
    if(car.seriesName)bs.appendChild(badge('series',car.seriesName));
    if(car.seriesNum&&car.seriesTotal)bs.appendChild(badge('num',\`\${car.seriesNum}/\${car.seriesTotal}\`));
    if(car.color)bs.appendChild(badge('color',car.color));
    if(bs.children.length)info.appendChild(bs);
    row.appendChild(info);
    const rb=el('button',{class:'remove-btn'},'✕');rb.onclick=()=>removeCar(car.id);row.appendChild(rb);
    w.appendChild(row);
  });
  return w;
}

function renderSettings(){
  const w=el('div',{});
  const sc=el('div',{class:'set-card'});
  sc.appendChild(el('div',{class:'set-title'},'🖥️ Server URL'));
  if(state.serverUrl){const st=el('div',{class:'key-status'});st.appendChild(el('span',{class:'key-dot'}));st.appendChild(document.createTextNode(state.serverUrl));sc.appendChild(st);}
  const si=el('input',{class:'set-inp',type:'url',placeholder:'https://dein-server.railway.app'});si.oninput=ev=>state.newServerUrl=ev.target.value;sc.appendChild(si);
  const sb=el('button',{class:'set-btn'},'✓ URL speichern');sb.onclick=saveServerUrl;sc.appendChild(sb);
  w.appendChild(sc);
  const ic=el('div',{class:'set-card'});
  ic.appendChild(el('div',{class:'set-title'},'💾 Sammlung sichern'));
  const eb=el('button',{class:'set-btn'},'📤 Exportieren');eb.onclick=exportData;ic.appendChild(eb);
  const ib=el('button',{class:'set-btn sec'},'📥 Importieren');
  const ifi=el('input',{type:'file',accept:'.json',style:'display:none'});ifi.onchange=ev=>importData(ev.target.files[0]);
  ib.onclick=()=>ifi.click();ic.appendChild(ib);ic.appendChild(ifi);
  ic.appendChild(el('div',{class:'set-hint'},'Exportiere die Sammlung inkl. Serien als JSON-Datei zur Sicherung.'));
  w.appendChild(ic);
  const dc=el('div',{class:'set-card'});
  dc.appendChild(el('div',{class:'set-title'},'⚠️ Zurücksetzen'));
  const db=el('button',{class:'set-btn danger'},'🗑 Alles löschen');
  db.onclick=()=>{if(confirm('Wirklich alles löschen?')){state.collection=[];state.series={};saveData();showToast('Gelöscht','warn');render();}};
  dc.appendChild(db);w.appendChild(dc);
  return w;
}

render();
</script>
</body>
</html>`;

app.get('/health', (req, res) => res.json({ status: 'ok' }));

app.get('/', (req, res) => {
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.send(APP_HTML);
});

app.post('/scan', async (req, res) => {
  try {
    const { base64, mode, collection } = req.body;
    if (!base64) return res.status(400).json({ error: 'Kein Bild' });

    const colText = collection?.length > 0
      ? `Aktuelle Sammlung (${collection.length} Autos):\n${collection.map((c,i) =>
          `${i+1}. ${c.name}${c.seriesName?' | '+c.seriesName:''}${c.seriesNum?' Nr.'+c.seriesNum+'/'+c.seriesTotal:''}`
        ).join('\n')}`
      : 'Sammlung ist noch leer.';

    const prompt = `Du bist ein Hot Wheels Experte. Analysiere das Foto.

${colText}

Bekannte Serien: HW Race Day, HW Flames, HW City Works, HW Daredevils, HW Rescue, HW Screen Time, HW Exotics, HW Dream Garage, HW Speed Graphics, HW Nightburnerz, HW Art Cars, Car Culture Boulevard, Car Culture Circuit Legends, Fast & Furious, Marvel, DC, Star Wars, Pop Culture etc.
Mainline-Serien haben typisch 10 Autos, Car Culture 5 Autos.

Aufgabe:
1. Identifiziere das Auto (Modellname, Farbe, Jahr falls erkennbar).
2. Erkenne die offizielle Hot Wheels Serie.
3. Erkenne Seriennummer und Gesamtanzahl falls sichtbar.
4. Liste alle anderen Autos der gleichen Serie auf die du kennst.
5. ${mode === 'scan' ? 'Prüfe ob dieses Auto bereits in der Sammlung ist.' : '"owned" ist immer false.'}

Antworte NUR mit JSON (kein Markdown):
{
  "name": "Modellname",
  "color": "Farbe auf Deutsch",
  "year": "Jahr oder null",
  "owned": ${mode === 'scan' ? 'true oder false' : 'false'},
  "matchedWith": "übereinstimmender Name oder null",
  "seriesName": "Offizieller Serienname oder null",
  "seriesNum": Nummer als Zahl oder null,
  "seriesTotal": Gesamtanzahl als Zahl oder null,
  "seriesAllCars": [{"num": 1, "name": "Modellname"}, ...] oder [],
  "confidence": "hoch oder mittel oder niedrig",
  "note": "Kurze Anmerkung auf Deutsch oder null"
}`;

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 1500,
        messages: [{
          role: 'user',
          content: [
            { type: 'image', source: { type: 'base64', media_type: 'image/jpeg', data: base64 } },
            { type: 'text', text: prompt }
          ]
        }]
      })
    });

    const data = await response.json();
    if (data.error) return res.status(500).json({ error: data.error.message });
    const text = data.content.map(b => b.text || '').join('').replace(/```json|```/g, '').trim();
    res.json(JSON.parse(text));
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server läuft auf Port ${PORT}`));
