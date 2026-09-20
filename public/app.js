try{localStorage.removeItem('hp_posts_cache');localStorage.removeItem('hp_posts_cache_v07');}catch(_){}
const mobileFix=document.createElement('style');mobileFix.textContent=`
.member-chips{display:flex!important;flex-wrap:wrap!important;overflow:visible!important;white-space:normal!important;gap:8px!important;padding-bottom:8px}
.member-chips .chip{flex:0 0 auto;margin:0!important}
.mainloading{min-height:180px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:14px;color:#777;font-size:16px}
.mainloading .loaderdots{display:flex;gap:7px}
.mainloading .loaderdots i{width:9px;height:9px;border-radius:50%;display:block;animation:hpPulse 1s infinite alternate}
.mainloading .loaderdots i:nth-child(2){animation-delay:.15s}.mainloading .loaderdots i:nth-child(3){animation-delay:.3s}
@keyframes hpPulse{from{opacity:.35;transform:translateY(0)}to{opacity:1;transform:translateY(-4px)}}

/* v0.7.1 UI */
.top{height:118px!important;min-height:118px!important;position:relative!important;display:flex!important;align-items:center!important;justify-content:center!important;padding:12px 68px 8px!important;overflow:hidden}
.hp-idols{position:absolute;bottom:8px;width:118px;height:auto;object-fit:contain;image-rendering:pixelated;pointer-events:none;z-index:1}
.hp-idols.left{left:8px}.hp-idols.right{right:8px}
.hp-idols.mobile{display:none}
.brand{position:relative;z-index:2;text-align:center!important;display:flex!important;flex-direction:column!important;gap:7px!important;align-items:center!important;font-size:25px!important;line-height:1.05;white-space:nowrap}
.brand .dots{order:2}.brand .dots i{width:8px!important;height:8px!important}
.top .iconbtn{position:absolute!important;right:10px!important;top:10px!important;z-index:4}
.card.fav{outline:2px solid #f3bd24!important;outline-offset:-2px;box-shadow:0 8px 22px rgba(229,171,0,.16)!important}
.card.fav .star{color:#e9ad00!important}
@media(max-width:430px){
 .top{height:112px!important;min-height:112px!important;padding:10px 70px 6px!important}
 .hp-idols.desktop{display:none!important}.hp-idols.mobile{display:block!important;width:70px!important;height:auto!important;bottom:7px!important}
 .hp-idols.left{left:8px!important}.hp-idols.right{right:8px!important}
 .brand{font-size:22px!important;gap:6px!important;transform:translateY(-7px)}
 .top .iconbtn{right:8px!important;top:8px!important;width:48px!important;height:48px!important}
}


.author-dot{display:inline-block;width:9px;height:9px;border-radius:50%;margin-right:6px;vertical-align:1px;box-shadow:0 0 0 1px rgba(0,0,0,.06)}
.author-dot.white{border:1px solid #aaa;box-sizing:border-box}
.unknown-author{color:#999;font-weight:600}
`;document.head.appendChild(mobileFix);
const API = localStorage.getItem('hp_api') || '/api/posts';
const groups=[
 {id:'morningmusume',name:"モーニング娘。'26",color:'#e84d8a'}, {id:'angerme',name:'アンジュルム',color:'#f05a66'},
 {id:'juicejuice',name:'Juice=Juice',color:'#8b5fbf'}, {id:'tsubaki',name:'つばきファクトリー',color:'#75b7df'},
 {id:'beyooooonds',name:'BEYOOOOONDS',color:'#f3b33d'}, {id:'ocha',name:'OCHA NORMA',color:'#65b86e'},
 {id:'rosy',name:'ロージークロニクル',color:'#e85b8c'}, {id:'kenshusei',name:'ハロプロ研修生',color:'#7d7d86'}];
const savedNav=(()=>{try{return JSON.parse(sessionStorage.getItem('hp_nav')||'{}')}catch{return {}}})();
let state={tab:savedNav.tab||'latest',group:savedNav.group||null,member:savedNav.member||'all',posts:[],loading:false,loadingMore:false,hasMore:false,total:0,banner:'',settings:false,groupCounts:{},memberMaster:{updated:'',groups:[]}};
function saveNav(){sessionStorage.setItem('hp_nav',JSON.stringify({tab:state.tab,group:state.group,member:state.member}))}
const favs=()=>new Set(JSON.parse(localStorage.getItem('hp_favs')||'[]')); const reads=()=>new Set(JSON.parse(localStorage.getItem('hp_reads')||'[]'));
const saveSet=(k,s)=>localStorage.setItem(k,JSON.stringify([...s]));
function isNew(p){return !reads().has(p.id) && Date.now()-new Date(p.publishedAt).getTime()<48*3600e3}
function rel(d){let x=Date.now()-new Date(d),m=Math.floor(x/60000),h=Math.floor(x/3600000);if(m<60)return `${Math.max(1,m)}分前`;if(h<24)return `${h}時間前`;if(h<48)return `昨日 ${new Date(d).toLocaleTimeString('ja-JP',{hour:'2-digit',minute:'2-digit'})}`;return new Date(d).toLocaleString('ja-JP',{month:'numeric',day:'numeric',hour:'2-digit',minute:'2-digit'})}

const pageCacheKey=()=>`hp_page_v08:${state.tab}:${state.group||''}:${state.member||'all'}`;
function savePageCache(){try{localStorage.setItem(pageCacheKey(),JSON.stringify({t:Date.now(),posts:state.posts,hasMore:state.hasMore,total:state.total,groupCounts:state.groupCounts,memberMaster:state.memberMaster}))}catch(_){}}
function restorePageCache(){try{const v=JSON.parse(localStorage.getItem(pageCacheKey())||'null');if(!v||!Array.isArray(v.posts)||Date.now()-v.t>6*3600e3)return false;state.posts=v.posts;state.hasMore=!!v.hasMore;state.total=v.total||v.posts.length;state.groupCounts=v.groupCounts||state.groupCounts;state.memberMaster=v.memberMaster||state.memberMaster;return true}catch(_){return false}}
let prefetched=null;
async function prefetchNext(){
 if(!state.hasMore||state.loading||state.loadingMore)return;
 const offset=state.posts.length,key=queryFor(offset,false);
 if(prefetched&&prefetched.key===key)return;
 try{const r=await fetch(key,{cache:'no-store'});if(r.ok)prefetched={key,data:await r.json()}}catch(_){}
}

function queryFor(offset=0,bust=true){
 const q=new URLSearchParams({offset:String(offset),limit:'20'});
 if(state.tab==='groups'&&state.group) q.set('group',state.group);
 if(state.tab==='groups'&&state.group&&state.member!=='all') q.set('member',state.member);
 if(bust) q.set('_',String(Date.now()));
 return `${API}?${q}`;
}
async function load(show=true,append=false,manual=false){
 const refreshStarted=Date.now();
 const keep={tab:state.tab,group:state.group,member:state.member,y:scrollY};
 // Instant paint from the previous successful page while fresh data loads behind it.
 if(!append&&!state.posts.length) restorePageCache();
 if(append) state.loadingMore=true; else state.loading=show&&!state.posts.length;
 render();
 try{
  const oldIds=new Set(state.posts.map(x=>x.id));
  const offset=append?state.posts.length:0;
  const stableKey=queryFor(offset,false);
  let j;
  if(append&&prefetched&&prefetched.key===stableKey){j=prefetched.data;prefetched=null}
  else{
   const r=await fetch(queryFor(offset,true),{cache:'no-store'});
   if(!r.ok) throw new Error(`HTTP ${r.status}`);
   j=await r.json();
  }
  const incoming=(j.posts||[]).filter(p=>Date.now()-new Date(p.publishedAt)<30*864e5);
  state.posts=append?[...state.posts,...incoming]:incoming;
  state.hasMore=!!j.hasMore; state.total=j.total||state.posts.length; state.groupCounts=j.groupCounts||state.groupCounts; state.memberMaster=j.memberMaster||state.memberMaster;
  state.tab=keep.tab;state.group=keep.group;state.member=keep.member;
  savePageCache();
  const fresh=incoming.filter(p=>!oldIds.has(p.id)).length;
  if(oldIds.size&&!append&&fresh){state.banner=`✨ 新しい記事が${fresh}件あります`;setTimeout(()=>{state.banner='';render()},3500)}
  else if(manual&&!append){const wait=Math.max(0,450-(Date.now()-refreshStarted));await new Promise(r=>setTimeout(r,wait));state.banner='✓ 新着ブログはありませんでした。';setTimeout(()=>{state.banner='';render()},2800)}
 }catch(e){
  console.error('Blog API error',e);
  if(!state.posts.length) state.banner='ブログ取得に失敗しました。しばらくしてから再読み込みしてください。';
 }
 state.loading=false;state.loadingMore=false;render();
 if(!append) requestAnimationFrame(()=>scrollTo(0,keep.y));
 setTimeout(prefetchNext,500);
}
window.loadMore=()=>{if(!state.loadingMore&&state.hasMore)load(false,true)};
window.openGroup=id=>{state.tab='groups';state.group=id;state.member='all';state.posts=[];saveNav();load(true,false)};
window.selectMember=m=>{state.member=m;state.posts=[];saveNav();load(true,false)};
window.backGroups=()=>{state.group=null;state.member='all';state.posts=[];saveNav();render()};
function openPost(id){
  const p=state.posts.find(x=>x.id===id);
  if(!p||!p.url)return;
  const readSet=reads();
  readSet.add(id);
  saveSet('hp_reads',readSet);
  // Resolve at tap time from the latest API-backed state, not a URL embedded in stale markup.
  location.href=p.url;
}
function colorDot(hex){const h=hex||'#A0A0A8';const white=/^#(?:fff|ffffff)$/i.test(h);return `<span class="author-dot${white?' white':''}" style="background:${h}"></span>`}
function card(p){let f=!!p.author&&favs().has(p.author),r=reads().has(p.id),color=p.memberColorHex||'#A0A0A8';return `<article class="card ${r?'read':''} ${f?'fav':''}" style="--member:${color}" onclick="openPost('${esc(p.id)}')"><button class="star" onclick="event.stopPropagation();${p.author?`toggleFav('${esc(p.author)}')`:''}">${f?'★':'☆'}</button>${p.image?`<img class="thumb" src="${esc(p.image)}" alt="" loading="lazy">`:`<div class="thumb noimg">NO IMAGE</div>`}<div class="ct"><div class="meta">${esc(p.group)} · ${rel(p.publishedAt)} ${isNew(p)?'<span class="new">NEW</span>':''}</div><div class="member">${colorDot(p.memberColorHex)}${p.author?esc(p.author):'<span class="unknown-author">投稿者未判定</span>'} ${f?'✨':''}</div><div class="title">${esc(p.title)}</div></div></article>`}
function esc(s=''){return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
window.openPost=openPost;window.toggleFav=m=>{let s=favs();s.has(m)?s.delete(m):s.add(m);saveSet('hp_favs',s);render()};
function topBar(){return `<header class="top"><img class="hp-idols left desktop" src="./assets/idols-left.png" alt=""><img class="hp-idols left mobile" src="./assets/idols-left-mobile.png" alt=""><div class="brand"><span>ハロプロブログ</span><span class="dots"><i style="background:#ff5f7e"></i><i style="background:#ffbd3d"></i><i style="background:#56c98c"></i><i style="background:#55a7f5"></i><i style="background:#9c6ade"></i></span></div><img class="hp-idols right desktop" src="./assets/idols-right.png" alt=""><img class="hp-idols right mobile" src="./assets/idols-right-mobile.png" alt=""><button class="iconbtn" onclick="state.settings=true;render()">⚙︎</button></header>${state.loading?`<div class="status"><span class="loaderdots"><i style="background:#ff5f7e"></i><i style="background:#56c98c"></i><i style="background:#55a7f5"></i></span> 新しいブログをチェック中… ✨</div>`:''}${state.banner?`<div class="status">${state.banner}</div>`:''}`}
function loadingMain(){return `<div class="mainloading"><span class="loaderdots"><i style="background:#ff5f7e"></i><i style="background:#56c98c"></i><i style="background:#55a7f5"></i></span><div>記事を取得しています…</div></div>`}
function moreButton(){return state.hasMore?`<button class="more" onclick="loadMore()" ${state.loadingMore?'disabled':''}>${state.loadingMore?'記事を取得しています…':'さらに読み込む'}</button>`:''}
function latest(){
 if(state.loading&&!state.posts.length)return `<main class="section">${loadingMain()}</main>`;
 return `<main class="section">${state.posts.map(card).join('')}${moreButton()}${!state.posts.length&&!state.loading?'<div class="empty">記事がありません</div>':''}</main>`;
}
function groupView(){
 if(!state.group){
  return `<div class="tiles">${groups.map(g=>{let n=state.groupCounts[g.id]||0;return `<button class="tile" style="--group:${g.color}" onclick="openGroup('${g.id}')"><b>${g.name}</b><div class="count">30日以内 ${n}件</div></button>`}).join('')}</div>`;
 }
 const g=groups.find(x=>x.id===state.group);
 const gm=(state.memberMaster.groups||[]).find(x=>x.id===g.id);
 const members=gm?gm.members.map(m=>({member:m.name,memberColorHex:m.hex,memberColor:m.color})):[];
 const body=state.loading&&!state.posts.length?loadingMain():(state.posts.map(card).join('')+moreButton()||'<div class="empty">記事がありません</div>');
 return `<div class="section"><button class="chip" onclick="backGroups()">‹ グループ一覧</button><h2>${g.name}</h2></div>
 <div class="chips member-chips"><button class="chip ${state.member==='all'?'on':''}" onclick="selectMember('all')">すべて</button>${members.map(m=>`<button class="chip ${state.member===m.member?'on':''}" onclick="selectMember('${esc(m.member)}')"><span class="dot" style="background:${m.memberColorHex||'#aaa'}"></span>${esc(m.member)}${favs().has(m.member)?' ✨':''}</button>`).join('')}</div>
 <main class="section">${body}</main>`;
}
function settings(){if(!state.settings)return '';let members=[...new Set([...(state.memberMaster.groups||[]).flatMap(g=>g.members.map(m=>m.name)),...state.posts.map(p=>p.author).filter(Boolean)])].sort((a,b)=>a.localeCompare(b,'ja'));return `<div class="modal" onclick="if(event.target===this){state.settings=false;render()}"><div class="sheet"><div class="row"><b>設定</b><button class="iconbtn" onclick="state.settings=false;render()">×</button></div><div class="row"><span>表示テーマ</span><div class="theme"><button onclick="setTheme('light')">☀️ ライト</button><button onclick="setTheme('dark')">🌙 ダーク</button></div></div><h3>☆ お気に入りメンバー</h3>${members.map(m=>`<div class="row favrow"><span>${esc(m)}</span><button onclick="toggleFav('${esc(m)}')">${favs().has(m)?'★':'☆'}</button></div>`).join('')}</div></div>`}
window.setTheme=t=>{localStorage.setItem('hp_theme',t);document.documentElement.dataset.theme=t;render()};document.documentElement.dataset.theme=localStorage.getItem('hp_theme')||'light';
window.goLatest=()=>{state.tab='latest';state.group=null;state.member='all';state.posts=[];saveNav();load(true,false)};
window.goGroups=()=>{state.tab='groups';state.group=null;state.member='all';state.posts=[];saveNav();load(true,false)};
function bottom(){return `<nav class="bottom"><button class="tab ${state.tab==='latest'?'on':''}" onclick="goLatest()"><span>◷</span>最新記事</button><button class="tab ${state.tab==='groups'?'on':''}" onclick="goGroups()"><span>▦</span>グループ別</button></nav>`}
function render(){saveNav();document.getElementById('app').innerHTML=`<div class="shell">${topBar()}${state.tab==='latest'?latest():groupView()}${bottom()}${settings()}</div>`}
let sy=0;addEventListener('touchstart',e=>{if(scrollY===0)sy=e.touches[0].clientY},{passive:true});addEventListener('touchend',e=>{if(sy&&e.changedTouches[0].clientY-sy>90)load(true,false,true);sy=0},{passive:true});
render();load(true);if('serviceWorker'in navigator)navigator.serviceWorker.register('./sw.js');

addEventListener('pageshow',()=>{let y=Number(sessionStorage.getItem('hp_scroll')||0);if(y)setTimeout(()=>scrollTo(0,y),60)});
