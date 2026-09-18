const mobileFix=document.createElement('style');mobileFix.textContent=`
.member-chips{display:flex!important;flex-wrap:wrap!important;overflow:visible!important;white-space:normal!important;gap:8px!important;padding-bottom:8px}
.member-chips .chip{flex:0 0 auto;margin:0!important}
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
let state={tab:'latest',group:null,member:'all',posts:[],visible:20,loading:false,banner:'',settings:false};
const favs=()=>new Set(JSON.parse(localStorage.getItem('hp_favs')||'[]')); const reads=()=>new Set(JSON.parse(localStorage.getItem('hp_reads')||'[]'));
const saveSet=(k,s)=>localStorage.setItem(k,JSON.stringify([...s]));
function isNew(p){return !reads().has(p.id) && Date.now()-new Date(p.date).getTime()<48*3600e3}
function rel(d){let x=Date.now()-new Date(d),m=Math.floor(x/60000),h=Math.floor(x/3600000);if(m<60)return `${Math.max(1,m)}分前`;if(h<24)return `${h}時間前`;if(h<48)return `昨日 ${new Date(d).toLocaleTimeString('ja-JP',{hour:'2-digit',minute:'2-digit'})}`;return new Date(d).toLocaleString('ja-JP',{month:'numeric',day:'numeric',hour:'2-digit',minute:'2-digit'})}
async function load(show=true){
 const keep={tab:state.tab,group:state.group,member:state.member,y:scrollY};
 state.loading=show;render();
 try{
  let r=await fetch(API+'?ts='+Date.now(),{cache:'no-store'}),j=await r.json();
  let old=new Set(state.posts.map(x=>x.id));
  state.posts=(j.posts||[]).filter(p=>Date.now()-new Date(p.date)<30*864e5).sort((a,b)=>new Date(b.date)-new Date(a.date));
  state.tab=keep.tab;state.group=keep.group;state.member=keep.member;
  let fresh=state.posts.filter(p=>!old.has(p.id)&&(keep.tab!=='groups'||!keep.group||p.groupId===keep.group)).length;
  if(old.size&&fresh){state.banner=`✨ 新しい記事が${fresh}件あります`;setTimeout(()=>{state.banner='';render()},3500)}
 }catch(e){console.error('Blog API error',e);state.banner='ブログ取得に失敗しました。しばらくしてから再読み込みしてください。'}
 state.loading=false;render();requestAnimationFrame(()=>scrollTo(0,keep.y));
}
function card(p){let f=favs().has(p.member),r=reads().has(p.id);return `<article class="card ${r?'read':''} ${f?'fav':''}" style="--member:${p.memberColor||'#aaa'}" onclick="openPost('${esc(p.id)}','${esc(p.url)}')"><button class="star" onclick="event.stopPropagation();toggleFav('${esc(p.member)}')">${f?'★':'☆'}</button>${p.image?`<img class="thumb" src="${esc(p.image)}" alt="" loading="lazy">`:`<div class="thumb noimg">NO IMAGE</div>`}<div class="ct"><div class="meta">${esc(p.group)} · ${rel(p.date)} ${isNew(p)?'<span class="new">NEW</span>':''}</div><div class="member">${esc(p.member)} ${f?'✨':''}</div><div class="title">${esc(p.title)}</div></div></article>`}
function esc(s=''){return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
window.openPost=(id,url)=>{let s=reads();s.add(id);saveSet('hp_reads',s);sessionStorage.setItem('hp_scroll',String(scrollY));render();location.href=url};window.toggleFav=m=>{let s=favs();s.has(m)?s.delete(m):s.add(m);saveSet('hp_favs',s);render()};
function topBar(){return `<header class="top"><div class="brand"><span class="dots"><i style="background:#ff5f7e"></i><i style="background:#ffbd3d"></i><i style="background:#56c98c"></i><i style="background:#55a7f5"></i><i style="background:#9c6ade"></i></span>ハロプロブログ</div><button class="iconbtn" onclick="state.settings=true;render()">⚙︎</button></header>${state.loading?`<div class="status"><span class="loaderdots"><i style="background:#ff5f7e"></i><i style="background:#56c98c"></i><i style="background:#55a7f5"></i></span> 新しいブログをチェック中… ✨</div>`:''}${state.banner?`<div class="status">${state.banner}</div>`:''}`}
function latest(){let a=state.posts.slice(0,state.visible);return `<main class="section">${a.map(card).join('')}${state.visible<state.posts.length?`<button class="more" onclick="state.visible+=20;render()">さらに読み込む</button>`:''}${!a.length&&!state.loading?'<div class="empty">記事がありません</div>':''}</main>`}
function groupView(){if(!state.group){return `<div class="tiles">${groups.map(g=>{let n=state.posts.filter(p=>p.groupId===g.id&&isNew(p)).length;return `<button class="tile" style="--group:${g.color}" onclick="state.group='${g.id}';state.member='all';render()"><b>${g.name}</b><div class="count">${n?`🔴 未読 ${n}`:'未読 0'}</div></button>`}).join('')}</div>`}let g=groups.find(x=>x.id===state.group);
let postMembers=[...new Map(state.posts.filter(p=>p.groupId===g.id).map(p=>[p.member,p])).values()];
let colorByMember=new Map(postMembers.map(p=>[p.member,p.memberColor||'#aaa']));
let roster=officialMembers[g.id]||postMembers.map(p=>p.member);
let members=roster.map(name=>({member:name,memberColor:colorByMember.get(name)||'#aaa'}));
let posts=state.posts.filter(p=>p.groupId===g.id&&(state.member==='all'||p.member===state.member));return `<div class="section"><button class="chip" onclick="state.group=null;render()">‹ グループ一覧</button><h2>${g.name}</h2></div><div class="chips member-chips"><button class="chip ${state.member==='all'?'on':''}" onclick="state.member='all';render()">すべて</button>${members.map(m=>`<button class="chip ${state.member===m.member?'on':''}" onclick="state.member='${esc(m.member)}';render()"><span class="dot" style="background:${m.memberColor||'#aaa'}"></span>${esc(m.member)}${favs().has(m.member)?' ✨':''}</button>`).join('')}</div><main class="section">${posts.map(card).join('')||'<div class="empty">記事がありません</div>'}</main>`}
function settings(){if(!state.settings)return '';let members=[...new Set([...Object.values(officialMembers).flat(),...state.posts.map(p=>p.member)])].sort((a,b)=>a.localeCompare(b,'ja'));return `<div class="modal" onclick="if(event.target===this){state.settings=false;render()}"><div class="sheet"><div class="row"><b>設定</b><button class="iconbtn" onclick="state.settings=false;render()">×</button></div><div class="row"><span>表示テーマ</span><div class="theme"><button onclick="setTheme('light')">☀️ ライト</button><button onclick="setTheme('dark')">🌙 ダーク</button></div></div><h3>☆ お気に入りメンバー</h3>${members.map(m=>`<div class="row favrow"><span>${esc(m)}</span><button onclick="toggleFav('${esc(m)}')">${favs().has(m)?'★':'☆'}</button></div>`).join('')}</div></div>`}
window.setTheme=t=>{localStorage.setItem('hp_theme',t);document.documentElement.dataset.theme=t;render()};document.documentElement.dataset.theme=localStorage.getItem('hp_theme')||'light';
function bottom(){return `<nav class="bottom"><button class="tab ${state.tab==='latest'?'on':''}" onclick="state.tab='latest';state.group=null;render()"><span>◷</span>最新記事</button><button class="tab ${state.tab==='groups'?'on':''}" onclick="state.tab='groups';render()"><span>▦</span>グループ別</button></nav>`}
function render(){document.getElementById('app').innerHTML=`<div class="shell">${topBar()}${state.tab==='latest'?latest():groupView()}${bottom()}${settings()}</div>`}
let sy=0;addEventListener('touchstart',e=>{if(scrollY===0)sy=e.touches[0].clientY},{passive:true});addEventListener('touchend',e=>{if(sy&&e.changedTouches[0].clientY-sy>90)load(true);sy=0},{passive:true});
render();load(true);if('serviceWorker'in navigator)navigator.serviceWorker.register('./sw.js');

addEventListener('pageshow',()=>{let y=Number(sessionStorage.getItem('hp_scroll')||0);if(y)setTimeout(()=>scrollTo(0,y),60)});
