const mobileFix=document.createElement('style');mobileFix.textContent=`
.member-chips{display:flex!important;flex-wrap:wrap!important;overflow:visible!important;white-space:normal!important;gap:8px!important;padding-bottom:8px}
.member-chips .chip{flex:0 0 auto;margin:0!important}
.mainloading{min-height:180px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:14px;color:#777;font-size:16px}
.mainloading .loaderdots{display:flex;gap:7px}
.mainloading .loaderdots i{width:9px;height:9px;border-radius:50%;display:block;animation:hpPulse 1s infinite alternate}
.mainloading .loaderdots i:nth-child(2){animation-delay:.15s}.mainloading .loaderdots i:nth-child(3){animation-delay:.3s}
@keyframes hpPulse{from{opacity:.35;transform:translateY(0)}to{opacity:1;transform:translateY(-4px)}}

/* v0.7 UI */
.top{min-height:116px!important;position:relative!important;display:flex!important;align-items:center!important;justify-content:center!important;padding:14px 58px 10px!important;overflow:hidden}
.hp-idols{position:absolute;bottom:7px;width:108px;height:46px;object-fit:cover;object-position:center;image-rendering:pixelated;pointer-events:none}
.hp-idols.left{left:6px}.hp-idols.right{right:6px}
.brand{position:relative;z-index:2;text-align:center!important;display:flex!important;flex-direction:column!important;gap:5px!important;align-items:center!important;font-size:25px!important;line-height:1.05}
.brand .dots{order:2}.brand .dots i{width:8px!important;height:8px!important}
.top .iconbtn{position:absolute!important;right:10px!important;top:10px!important;z-index:4}
.card.fav{outline:2px solid #f3bd24!important;outline-offset:-2px;box-shadow:0 8px 22px rgba(229,171,0,.16)!important}
.card.fav .star{color:#e9ad00!important}
@media(max-width:430px){.hp-idols{width:92px;height:42px}.top{padding-left:72px!important;padding-right:72px!important}.brand{font-size:23px!important}}

`;document.head.appendChild(mobileFix);
const API = localStorage.getItem('hp_api') || '/api/posts';
const groups=[
 {id:'morningmusume',name:"モーニング娘。'26",color:'#e84d8a'}, {id:'angerme',name:'アンジュルム',color:'#f05a66'},
 {id:'juicejuice',name:'Juice=Juice',color:'#8b5fbf'}, {id:'tsubaki',name:'つばきファクトリー',color:'#75b7df'},
 {id:'beyooooonds',name:'BEYOOOOONDS',color:'#f3b33d'}, {id:'ocha',name:'OCHA NORMA',color:'#65b86e'},
 {id:'rosy',name:'ロージークロニクル',color:'#e85b8c'}, {id:'kenshusei',name:'ハロプロ研修生',color:'#7d7d86'}];
const officialMembers={
 morningmusume:['野中美希','小田さくら','岡村ほまれ','山﨑愛生','櫻井梨央','井上春華','弓桁朱琴','杉原明紗','安田美結','鈴木もあ','石川華望'],
 angerme:['伊勢鈴蘭','為永幸音','橋迫鈴','川名凜','松本わかな','平山遊季','下井谷幸穂','後藤花','長野桃羽'],
 juicejuice:['段原瑠々','井上玲音','工藤由愛','松永里愛','有澤一華','入江里咲','江端妃咲','石山咲良','遠藤彩加里','川嶋美楓','林仁愛'],
 tsubaki:['谷本安美','小野瑞歩','小野田紗栞','秋山眞緒','河西結心','福田真琳','豫風瑠乃','石井泉羽','村田結生','土居楓奏','西村乙輝'],
 beyooooonds:['西田汐里','江口紗耶','大坪茉乃','杉山結菜','前田こころ','岡村美波','清野桃々姫','小島はな','平井美葉','小林萌花','里吉うたの'],
 ocha:['斉藤円香','広本瑠璃','米村姫良々','窪田七海','中山夏月姫','西﨑美空','北原もも','筒井澪心'],
 rosy:['橋田歩果','吉田姫杷','小野田華凜','村越彩菜','植村葉純','松原ユリヤ','島川波菜','上村麗菜','相馬優芽']
};
const savedNav=(()=>{try{return JSON.parse(sessionStorage.getItem('hp_nav')||'{}')}catch{return {}}})();
let state={tab:savedNav.tab||'latest',group:savedNav.group||null,member:savedNav.member||'all',posts:[],loading:false,loadingMore:false,hasMore:false,total:0,banner:'',settings:false,groupCounts:{}};
function saveNav(){sessionStorage.setItem('hp_nav',JSON.stringify({tab:state.tab,group:state.group,member:state.member}))}
const favs=()=>new Set(JSON.parse(localStorage.getItem('hp_favs')||'[]')); const reads=()=>new Set(JSON.parse(localStorage.getItem('hp_reads')||'[]'));
const saveSet=(k,s)=>localStorage.setItem(k,JSON.stringify([...s]));
function isNew(p){return !reads().has(p.id) && Date.now()-new Date(p.date).getTime()<48*3600e3}
function rel(d){let x=Date.now()-new Date(d),m=Math.floor(x/60000),h=Math.floor(x/3600000);if(m<60)return `${Math.max(1,m)}分前`;if(h<24)return `${h}時間前`;if(h<48)return `昨日 ${new Date(d).toLocaleTimeString('ja-JP',{hour:'2-digit',minute:'2-digit'})}`;return new Date(d).toLocaleString('ja-JP',{month:'numeric',day:'numeric',hour:'2-digit',minute:'2-digit'})}

const pageCacheKey=()=>`hp_page_v07:${state.tab}:${state.group||''}:${state.member||'all'}`;
function savePageCache(){try{localStorage.setItem(pageCacheKey(),JSON.stringify({t:Date.now(),posts:state.posts,hasMore:state.hasMore,total:state.total,groupCounts:state.groupCounts}))}catch(_){}}
function restorePageCache(){try{const v=JSON.parse(localStorage.getItem(pageCacheKey())||'null');if(!v||!Array.isArray(v.posts)||Date.now()-v.t>6*3600e3)return false;state.posts=v.posts;state.hasMore=!!v.hasMore;state.total=v.total||v.posts.length;state.groupCounts=v.groupCounts||state.groupCounts;return true}catch(_){return false}}
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
async function load(show=true,append=false){
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
  const incoming=(j.posts||[]).filter(p=>Date.now()-new Date(p.date)<30*864e5);
  state.posts=append?[...state.posts,...incoming]:incoming;
  state.hasMore=!!j.hasMore; state.total=j.total||state.posts.length; state.groupCounts=j.groupCounts||state.groupCounts;
  state.tab=keep.tab;state.group=keep.group;state.member=keep.member;
  savePageCache();
  const fresh=incoming.filter(p=>!oldIds.has(p.id)).length;
  if(oldIds.size&&!append&&fresh){state.banner=`✨ 新しい記事が${fresh}件あります`;setTimeout(()=>{state.banner='';render()},3500)}
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
function card(p){let f=favs().has(p.member),r=reads().has(p.id);return `<article class="card ${r?'read':''} ${f?'fav':''}" style="--member:${p.memberColor||'#aaa'}" onclick="openPost('${esc(p.id)}','${esc(p.url)}')"><button class="star" onclick="event.stopPropagation();toggleFav('${esc(p.member)}')">${f?'★':'☆'}</button>${p.image?`<img class="thumb" src="${esc(p.image)}" alt="" loading="lazy">`:`<div class="thumb noimg">NO IMAGE</div>`}<div class="ct"><div class="meta">${esc(p.group)} · ${rel(p.date)} ${isNew(p)?'<span class="new">NEW</span>':''}</div><div class="member">${esc(p.member)} ${f?'✨':''}</div><div class="title">${esc(p.title)}</div></div></article>`}
function esc(s=''){return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
window.openPost=(id,url)=>{let s=reads();s.add(id);saveSet('hp_reads',s);sessionStorage.setItem('hp_scroll',String(scrollY));render();location.href=url};window.toggleFav=m=>{let s=favs();s.has(m)?s.delete(m):s.add(m);saveSet('hp_favs',s);render()};
function topBar(){return `<header class="top"><img class="hp-idols left" src="./assets/idols-left.png" alt=""><div class="brand"><span>ハロプロブログ</span><span class="dots"><i style="background:#ff5f7e"></i><i style="background:#ffbd3d"></i><i style="background:#56c98c"></i><i style="background:#55a7f5"></i><i style="background:#9c6ade"></i></span></div><img class="hp-idols right" src="./assets/idols-right.png" alt=""><button class="iconbtn" onclick="state.settings=true;render()">⚙︎</button></header>${state.loading?`<div class="status"><span class="loaderdots"><i style="background:#ff5f7e"></i><i style="background:#56c98c"></i><i style="background:#55a7f5"></i></span> 新しいブログをチェック中… ✨</div>`:''}${state.banner?`<div class="status">${state.banner}</div>`:''}`}
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
 const roster=officialMembers[g.id]||[...new Set(state.posts.map(p=>p.member))];
 const colorByMember=new Map(state.posts.map(p=>[p.member,p.memberColor||'#aaa']));
 const members=roster.map(name=>({member:name,memberColor:colorByMember.get(name)||'#aaa'}));
 const body=state.loading&&!state.posts.length?loadingMain():(state.posts.map(card).join('')+moreButton()||'<div class="empty">記事がありません</div>');
 return `<div class="section"><button class="chip" onclick="backGroups()">‹ グループ一覧</button><h2>${g.name}</h2></div>
 <div class="chips member-chips"><button class="chip ${state.member==='all'?'on':''}" onclick="selectMember('all')">すべて</button>${members.map(m=>`<button class="chip ${state.member===m.member?'on':''}" onclick="selectMember('${esc(m.member)}')"><span class="dot" style="background:${m.memberColor||'#aaa'}"></span>${esc(m.member)}${favs().has(m.member)?' ✨':''}</button>`).join('')}</div>
 <main class="section">${body}</main>`;
}
function settings(){if(!state.settings)return '';let members=[...new Set([...Object.values(officialMembers).flat(),...state.posts.map(p=>p.member)])].sort((a,b)=>a.localeCompare(b,'ja'));return `<div class="modal" onclick="if(event.target===this){state.settings=false;render()}"><div class="sheet"><div class="row"><b>設定</b><button class="iconbtn" onclick="state.settings=false;render()">×</button></div><div class="row"><span>表示テーマ</span><div class="theme"><button onclick="setTheme('light')">☀️ ライト</button><button onclick="setTheme('dark')">🌙 ダーク</button></div></div><h3>☆ お気に入りメンバー</h3>${members.map(m=>`<div class="row favrow"><span>${esc(m)}</span><button onclick="toggleFav('${esc(m)}')">${favs().has(m)?'★':'☆'}</button></div>`).join('')}</div></div>`}
window.setTheme=t=>{localStorage.setItem('hp_theme',t);document.documentElement.dataset.theme=t;render()};document.documentElement.dataset.theme=localStorage.getItem('hp_theme')||'light';
window.goLatest=()=>{state.tab='latest';state.group=null;state.member='all';state.posts=[];saveNav();load(true,false)};
window.goGroups=()=>{state.tab='groups';state.group=null;state.member='all';state.posts=[];saveNav();load(true,false)};
function bottom(){return `<nav class="bottom"><button class="tab ${state.tab==='latest'?'on':''}" onclick="goLatest()"><span>◷</span>最新記事</button><button class="tab ${state.tab==='groups'?'on':''}" onclick="goGroups()"><span>▦</span>グループ別</button></nav>`}
function render(){saveNav();document.getElementById('app').innerHTML=`<div class="shell">${topBar()}${state.tab==='latest'?latest():groupView()}${bottom()}${settings()}</div>`}
let sy=0;addEventListener('touchstart',e=>{if(scrollY===0)sy=e.touches[0].clientY},{passive:true});addEventListener('touchend',e=>{if(sy&&e.changedTouches[0].clientY-sy>90)load(true);sy=0},{passive:true});
render();load(true);if('serviceWorker'in navigator)navigator.serviceWorker.register('./sw.js');

addEventListener('pageshow',()=>{let y=Number(sessionStorage.getItem('hp_scroll')||0);if(y)setTimeout(()=>scrollTo(0,y),60)});
