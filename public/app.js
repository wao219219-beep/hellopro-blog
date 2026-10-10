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
.card.fav{outline:2px solid var(--fav-outline,var(--member,#f3bd24))!important;outline-offset:-2px;box-shadow:0 8px 22px rgba(0,0,0,.10)!important}
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
/* v0.8.2 X-like pull-to-refresh */
.ptr{position:fixed;left:50%;top:126px;z-index:20;width:28px;height:28px;margin-left:-14px;border-radius:50%;display:flex;align-items:center;justify-content:center;background:var(--card,#fff);box-shadow:0 2px 10px rgba(0,0,0,.10);opacity:0;transform:translateY(-18px) scale(.78);pointer-events:none;transition:opacity .12s ease,transform .12s ease}
.ptr.show{opacity:1}.ptr.refreshing{opacity:1;transform:translateY(0) scale(1)}
.ptr-spinner{width:14px;height:14px;border:2px solid rgba(120,120,128,.24);border-top-color:#777;border-radius:50%;box-sizing:border-box}
.ptr.refreshing .ptr-spinner{animation:ptrSpin .7s linear infinite}
@keyframes ptrSpin{to{transform:rotate(360deg)}}
/* v0.8.3 group badge + member-color favorite outline */
.group-badge{display:inline-flex;align-items:center;padding:2px 7px;border-radius:999px;background:var(--group-bg);border:1px solid color-mix(in srgb,var(--group-color) 26%,transparent);font-weight:650;color:var(--text,#222);line-height:1.35}
.meta-time{white-space:nowrap}
.card.fav{outline-color:var(--fav-outline,var(--member,#f3bd24))!important}
/* v0.8.5: group tiles use the same centralized group color master as article badges. */
.tile{border-top-color:var(--group)!important}

/* v0.8.6 grouped favorite settings */
.fav-groups{display:flex;flex-direction:column;gap:12px;margin-top:10px}
.fav-group{border:1px solid rgba(120,120,128,.13);border-left:4px solid var(--group-color);border-radius:16px;padding:12px;background:var(--group-bg)}
.fav-group-title{display:flex;align-items:center;gap:8px;font-weight:800;font-size:15px;margin:0 0 10px}
.fav-group-title .group-mini-dot{width:9px;height:9px;border-radius:50%;background:var(--group-color);flex:none}
.fav-member-list{display:flex;flex-wrap:wrap;gap:8px}
.fav-member-chip{appearance:none;border:1px solid rgba(120,120,128,.22);background:var(--card,#fff);color:var(--text,#222);border-radius:999px;padding:8px 11px;display:inline-flex;align-items:center;gap:7px;font:inherit;font-size:14px;line-height:1;box-shadow:none}
.fav-member-chip.on{border-color:var(--member-color);background:var(--member-bg);font-weight:750;box-shadow:inset 0 0 0 1px var(--member-color)}
.fav-member-chip .member-dot{width:9px;height:9px;border-radius:50%;background:var(--member-color);flex:none;box-sizing:border-box}
.fav-member-chip .member-dot.white{border:1px solid #aaa}
.fav-member-chip .fav-mark{font-size:12px}


/* v0.9.5 version label */
.app-version{margin:18px 0 4px;text-align:center;font-size:11px;color:var(--sub,#999);opacity:.8}

/* v0.9.3 推しエフェクト
   - カード形状は固定
   - 初回だけカード内部でホログラム反射
   - 上部固定中はメンバーカラーの♡/✦を常時表示 */
.card.fav{position:relative;overflow:visible;isolation:isolate}
.card.fav .card-main,.card.fav .thumb{position:relative;z-index:3}

/* 初回の反射光はカード矩形の中だけ。外へ伸びる斜め帯は廃止 */
.oshi-surface{position:absolute;z-index:6;inset:0;border-radius:22px;overflow:hidden;pointer-events:none}
.oshi-surface::before{
 content:"";position:absolute;inset:-30%;
 opacity:0;transform:translateX(-72%);
 background:
   linear-gradient(112deg,
    transparent 26%,
    rgba(104,220,255,.10) 34%,
    rgba(255,255,255,.92) 43%,
    rgba(255,213,248,.72) 49%,
    rgba(255,242,142,.36) 55%,
    rgba(124,226,255,.16) 61%,
    transparent 70%);
 mix-blend-mode:screen
}
.card.fav.oshi-rare .oshi-surface::before{animation:oshiInnerSweep 1.05s cubic-bezier(.18,.72,.2,1) 1}
.oshi-surface::after{
 content:"";position:absolute;inset:0;border-radius:inherit;opacity:0;
 background:radial-gradient(circle at 48% 52%,rgba(255,255,255,.92),rgba(255,255,255,.24) 34%,transparent 70%)
}
.card.fav.oshi-rare .oshi-surface::after{animation:oshiFlash 1.25s ease-out 1}

/* 外周発光はカード形状を保ったぼかしだけ */
.card.fav.oshi-rare{animation:oshiCardGlow 1.65s ease-out 1}
@keyframes oshiInnerSweep{
 0%{opacity:0;transform:translateX(-72%)}
 12%{opacity:.65}
 46%{opacity:1}
 100%{opacity:0;transform:translateX(72%)}
}
@keyframes oshiFlash{
 0%,18%{opacity:0}
 40%{opacity:.68}
 58%{opacity:.22}
 100%{opacity:0}
}
@keyframes oshiCardGlow{
 0%{box-shadow:0 0 0 0 transparent}
 30%{box-shadow:0 0 12px 3px var(--fav-outline),0 0 30px 7px color-mix(in srgb,var(--fav-outline) 45%,transparent)}
 58%{box-shadow:0 0 18px 4px var(--fav-outline),0 0 38px 9px rgba(255,255,255,.30)}
 100%{box-shadow:0 0 0 0 transparent}
}

/* 粒子 */
.oshi-particles{position:absolute;z-index:9;inset:-16px;overflow:visible;pointer-events:none}
.oshi-particle{
 position:absolute;left:var(--x);top:var(--y);color:var(--fav-outline);opacity:0;
 font-size:var(--s);line-height:1;
 text-shadow:0 0 5px #fff,0 0 10px currentColor,0 0 17px currentColor;
 transform:translateY(5px) scale(.72) rotate(var(--r))
}
.oshi-particle.spark{color:#fff}

/* 初回は少し大きく舞う */
.oshi-rare .oshi-particle{animation:oshiBurst 1.45s cubic-bezier(.18,.7,.25,1) var(--d) 1}
@keyframes oshiBurst{
 0%{opacity:0;transform:translateY(8px) scale(.35) rotate(var(--r))}
 20%{opacity:1}
 60%{opacity:1;transform:translate(var(--dx),var(--dy)) scale(1.16) rotate(calc(var(--r) + 10deg))}
 100%{opacity:0;transform:translate(calc(var(--dx)*1.2),calc(var(--dy)*1.2)) scale(.72) rotate(calc(var(--r) + 18deg))}
}

/* 最新記事の先頭固定中だけ、♡と少量の星を常時ふわふわ表示 */
.card.oshi-pinned{
 box-shadow:0 0 9px color-mix(in srgb,var(--fav-outline) 35%,transparent),
            0 0 22px color-mix(in srgb,var(--fav-outline) 18%,transparent)
}
.card.oshi-pinned .oshi-particle{
 opacity:.78;
 animation:oshiFloat var(--float,2.7s) ease-in-out var(--fd,0s) infinite alternate
}
.card.oshi-pinned .oshi-particle.spark{opacity:.55}
.card.oshi-pinned.oshi-rare .oshi-particle{animation:oshiBurst 1.45s cubic-bezier(.18,.7,.25,1) var(--d) 1}
@keyframes oshiFloat{
 0%{transform:translate(0,3px) scale(.82) rotate(var(--r));filter:brightness(.92)}
 50%{opacity:1;filter:brightness(1.35)}
 100%{transform:translate(var(--fx,4px),var(--fy,-8px)) scale(1.08) rotate(calc(var(--r) + 7deg));filter:brightness(1.12)}
}
@media (prefers-reduced-motion:reduce){
 .card.fav.oshi-rare,.card.fav.oshi-rare .oshi-surface::before,.card.fav.oshi-rare .oshi-surface::after,
 .oshi-rare .oshi-particle,.card.oshi-pinned .oshi-particle{animation:none!important}
 .card.oshi-pinned .oshi-particle{opacity:.65}
}`;document.head.appendChild(mobileFix);
const APP_VERSION='0.9.7';
const API = localStorage.getItem('hp_api') || '/api/posts';
// Group colors sampled from the user-provided Hello! Project ARTIST reference image (v0.8.4).
const groups=[
 {id:'morningmusume',name:"モーニング娘。'26",color:'#D92C1B'}, {id:'angerme',name:'アンジュルム',color:'#1D91CD'},
 {id:'juicejuice',name:'Juice=Juice',color:'#7263AA'}, {id:'tsubaki',name:'つばきファクトリー',color:'#EF93BB'},
 {id:'beyooooonds',name:'BEYOOOOONDS',color:'#20A239'}, {id:'ocha',name:'OCHA NORMA',color:'#F1881A'},
 {id:'rosy',name:'ロージークロニクル',color:'#F5D11F'}, {id:'kenshusei',name:'ハロプロ研修生',color:'#92C75B'}];
const groupByName=name=>groups.find(g=>g.name===name);
function hexToRgba(hex,a=.13){const h=String(hex||'').replace('#','');if(!/^[0-9a-f]{6}$/i.test(h))return `rgba(128,128,128,${a})`;const n=parseInt(h,16);return `rgba(${(n>>16)&255},${(n>>8)&255},${n&255},${a})`}
function groupBadge(name){const g=groupByName(name);const c=g?.color||'#7d7d86';return `<span class="group-badge" style="--group-color:${c};--group-bg:${hexToRgba(c,.14)}">${esc(name)}</span>`}
const savedNav=(()=>{try{return JSON.parse(sessionStorage.getItem('hp_nav')||'{}')}catch{return {}}})();
let pull={startY:0,distance:0,tracking:false,refreshing:false};
let state={tab:savedNav.tab||'latest',group:savedNav.group||null,member:savedNav.member||'all',posts:[],nextOffset:0,loading:false,loadingMore:false,hasMore:false,total:0,banner:'',settings:false,groupCounts:{},memberMaster:{updated:'',groups:[]}};
function saveNav(){sessionStorage.setItem('hp_nav',JSON.stringify({tab:state.tab,group:state.group,member:state.member}))}
// v0.9.7: 推し/既読 are read from storage once per render instead of hundreds of
// times (every card, NEW check and sort comparison used to re-parse them).
// Storage keys and format are unchanged (hp_favs / hp_reads).
let favsCache=null,readsCache=null;
const favs=()=>favsCache||(favsCache=new Set(JSON.parse(localStorage.getItem('hp_favs')||'[]'))); const reads=()=>readsCache||(readsCache=new Set(JSON.parse(localStorage.getItem('hp_reads')||'[]')));
const saveSet=(k,s)=>{localStorage.setItem(k,JSON.stringify([...s]));if(k==='hp_favs')favsCache=null;if(k==='hp_reads')readsCache=null};
// Keep only the 2000 most recently read ids (only ~30 days of posts can be shown).
try{const r=JSON.parse(localStorage.getItem('hp_reads')||'[]');if(Array.isArray(r)&&r.length>2000)localStorage.setItem('hp_reads',JSON.stringify(r.slice(-2000)))}catch(_){}
// v0.9.7: Ameba thumbnails are requested at 480px wide (about 1/4 of the data);
// if a resized image fails, that card falls back to the original image.
const failedThumbs=new Set();
function thumbUrl(u=''){
 if(!/^https:\/\/stat\.ameba\.jp\/user_images\//i.test(u)||failedThumbs.has(u))return u;
 return u.split('?')[0]+'?caw=480';
}
window.thumbFallback=img=>{const full=img.dataset.full;if(full&&img.getAttribute('src')!==full){failedThumbs.add(full);img.src=full}};
function isNew(p){return !reads().has(p.id) && Date.now()-new Date(p.publishedAt).getTime()<48*3600e3}
function isPinnedFavorite(p){return state.tab==='latest'&&!!p.author&&favs().has(p.author)&&isNew(p)}
function latestOrderedPosts(){
 const copy=[...state.posts];
 return copy.sort((a,b)=>{
   const ap=isPinnedFavorite(a)?1:0,bp=isPinnedFavorite(b)?1:0;
   if(ap!==bp)return bp-ap;
   return new Date(b.publishedAt)-new Date(a.publishedAt);
 });
}
const shownOshiEffects=new Set();
function bindFavoriteEffects(){
 requestAnimationFrame(()=>{
  const nodes=[...document.querySelectorAll('.card.oshi-pinned[data-post-id]')];
  if(!nodes.length)return;
  const play=el=>{
   const id=el.dataset.postId;
   if(!id||shownOshiEffects.has(id))return;
   shownOshiEffects.add(id);
   el.classList.add('oshi-rare');
   setTimeout(()=>el.classList.remove('oshi-rare'),1850);
  };
  if(!('IntersectionObserver'in window)){nodes.forEach(play);return}
  const io=new IntersectionObserver(entries=>{
   for(const e of entries)if(e.isIntersecting){play(e.target);io.unobserve(e.target)}
  },{threshold:.28});
  nodes.forEach(el=>{if(!shownOshiEffects.has(el.dataset.postId))io.observe(el)});
 });
}
function rel(d){let x=Date.now()-new Date(d),m=Math.floor(x/60000),h=Math.floor(x/3600000);if(m<60)return `${Math.max(1,m)}分前`;if(h<24)return `${h}時間前`;if(h<48)return `昨日 ${new Date(d).toLocaleTimeString('ja-JP',{hour:'2-digit',minute:'2-digit'})}`;return new Date(d).toLocaleString('ja-JP',{month:'numeric',day:'numeric',hour:'2-digit',minute:'2-digit'})}

const pageCacheKey=()=>`hp_page_v091:${state.tab}:${state.group||''}:${state.member||'all'}`;
function savePageCache(){try{localStorage.setItem(pageCacheKey(),JSON.stringify({t:Date.now(),posts:state.posts,nextOffset:state.nextOffset,hasMore:state.hasMore,total:state.total,groupCounts:state.groupCounts,memberMaster:state.memberMaster}))}catch(_){}}
function restorePageCache(){try{const v=JSON.parse(localStorage.getItem(pageCacheKey())||'null');if(!v||!Array.isArray(v.posts)||Date.now()-v.t>6*3600e3)return false;state.posts=v.posts;state.nextOffset=Number.isFinite(v.nextOffset)?v.nextOffset:v.posts.length;state.hasMore=!!v.hasMore;state.total=v.total||v.posts.length;state.groupCounts=v.groupCounts||state.groupCounts;state.memberMaster=v.memberMaster||state.memberMaster;return true}catch(_){return false}}
let prefetched=null;
async function prefetchNext(){
 if(!state.hasMore||state.loading||state.loadingMore)return;
 const offset=nextCursor(),key=queryFor(offset,false);
 if(prefetched&&prefetched.key===key)return;
 try{const r=await fetch(key,{cache:'default'});if(r.ok)prefetched={key,data:await r.json()}}catch(_){}
}

// v0.9.4: the API returns nextOffset (a cursor). In the member view it is not the
// number of posts shown, so always page with it; fall back for older responses.
function nextCursor(){return Number.isFinite(state.nextOffset)&&state.nextOffset>0?state.nextOffset:state.posts.length}
// Keep the card the user is looking at in place when cards are inserted above it
// (e.g. an oshi post found in a later page moving to the top).
function viewAnchor(){
 if(scrollY<=0)return null;
 for(const el of document.querySelectorAll('.card[data-post-id]')){const r=el.getBoundingClientRect();if(r.bottom>0)return {id:el.dataset.postId,top:r.top}}
 return null;
}
function restoreAnchor(a){
 if(!a)return;
 const el=[...document.querySelectorAll('.card[data-post-id]')].find(x=>x.dataset.postId===a.id);
 if(el){const d=el.getBoundingClientRect().top-a.top;if(Math.abs(d)>1)scrollBy(0,d)}
}
// v0.9.4: on 最新記事, keep loading pages in the background until 48 hours are covered,
// so every unread oshi post that is still NEW can be pinned to the top.
const AUTO_FILL_MAX_PAGES=8;
let autoFillPages=0;
// Bumped on every view change; a load that finishes for an older view is dropped
// so background page loads never leak into the newly opened screen.
let viewGen=0;
function needs48hFill(){
 if(state.tab!=='latest'||!state.hasMore||state.loading||state.loadingMore||!state.posts.length)return false;
 const oldest=Math.min(...state.posts.map(p=>new Date(p.publishedAt).getTime()).filter(Number.isFinite));
 return Number.isFinite(oldest)&&Date.now()-oldest<48*3600e3;
}
function queryFor(offset=0,bust=true){
 const q=new URLSearchParams({offset:String(offset),limit:'20'});
 if(state.tab==='groups'&&state.group) q.set('group',state.group);
 if(state.tab==='groups'&&state.group&&state.member!=='all') q.set('member',state.member);
 if(bust) q.set('_',String(Date.now()));
 return `${API}?${q}`;
}
async function load(show=true,append=false,manual=false,auto=false){
 const refreshStarted=Date.now();
 if(manual) pull.refreshing=true;
 let ok=false;const gen=viewGen;
 const keep={tab:state.tab,group:state.group,member:state.member,y:scrollY};
 // Instant paint from the previous successful page while fresh data loads behind it.
 if(!append&&!state.posts.length) restorePageCache();
 if(append) state.loadingMore=true; else state.loading=show&&!state.posts.length;
 // v0.9.5: background page loads draw only once, when their page has arrived.
 if(!auto) render();
 try{
  const oldIds=new Set(state.posts.map(x=>x.id));
  const offset=append?nextCursor():0;
  const stableKey=queryFor(offset,false);
  let j;
  if(append&&prefetched&&prefetched.key===stableKey){j=prefetched.data;prefetched=null}
  else{
   const r=await fetch(queryFor(offset,manual),{cache:'default'});
   if(!r.ok) throw new Error(`HTTP ${r.status}`);
   j=await r.json();
  }
  if(gen!==viewGen){if(manual){pull.refreshing=false;pull.distance=0;render()}return}
  const incoming=(j.posts||[]).filter(p=>Date.now()-new Date(p.publishedAt)<30*864e5);
  if(append){const have=new Set(state.posts.map(x=>x.id));state.posts=[...state.posts,...incoming.filter(p=>!have.has(p.id))]}else state.posts=incoming;
  state.nextOffset=Number.isFinite(j.nextOffset)?j.nextOffset:state.posts.length;
  state.hasMore=!!j.hasMore; state.total=j.total||state.posts.length; state.groupCounts=j.groupCounts||state.groupCounts; state.memberMaster=j.memberMaster||state.memberMaster;
  state.tab=keep.tab;state.group=keep.group;state.member=keep.member;
  savePageCache();ok=true;
  const fresh=incoming.filter(p=>!oldIds.has(p.id)).length;
  if(oldIds.size&&!append&&fresh){state.banner=`✨ 新しい記事が${fresh}件あります`;setTimeout(()=>{state.banner='';render()},3500)}
  else if(manual&&!append){const wait=Math.max(0,450-(Date.now()-refreshStarted));await new Promise(r=>setTimeout(r,wait));state.banner='✓ 新着ブログはありませんでした。';setTimeout(()=>{state.banner='';render()},2800)}
 }catch(e){
  if(gen!==viewGen){if(manual){pull.refreshing=false;pull.distance=0;render()}return}
  console.error('Blog API error',e);
  if(!state.posts.length) state.banner='ブログ取得に失敗しました。しばらくしてから再読み込みしてください。';
 }
 if(manual){const wait=Math.max(0,650-(Date.now()-refreshStarted));if(wait)await new Promise(r=>setTimeout(r,wait));pull.refreshing=false;pull.distance=0;}
 const anchor=append&&!restoreTarget?viewAnchor():null;
 state.loading=false;state.loadingMore=false;render();
 if(append) restoreAnchor(anchor);
 // A pending return-from-article position wins over the pre-load position.
 let restorePending=false;
 if(restoreTarget&&state.posts.length){if(applyRestore())finishRestore();else restorePending=true}
 else if(!append) requestAnimationFrame(()=>scrollTo(0,keep.y));
 if(!append) autoFillPages=0;
 const sameView=state.tab===keep.tab&&state.group===keep.group&&state.member===keep.member;
 // Keep loading pages automatically when: 最新記事 has not covered 48h yet, the
 // return position lies beyond the loaded pages, or a member-view scan window
 // returned no confirmed posts.
 const memberEmpty=state.tab==='groups'&&state.member!=='all'&&!state.posts.length;
 if(ok&&sameView&&state.hasMore&&autoFillPages<AUTO_FILL_MAX_PAGES&&(needs48hFill()||restorePending||memberEmpty)){
  autoFillPages++;setTimeout(()=>{if(state.hasMore&&!state.loading&&!state.loadingMore)load(false,true,false,true)},150);
 }else{
  if(restoreTarget)finishRestore();
  setTimeout(prefetchNext,500);
 }
}
window.loadMore=()=>{if(!state.loadingMore&&state.hasMore)load(false,true)};
window.openGroup=id=>{state.tab='groups';state.group=id;state.member='all';state.posts=[];state.nextOffset=0;state.loadingMore=false;viewGen++;saveNav();load(true,false)};
window.selectMember=m=>{state.member=m;state.posts=[];state.nextOffset=0;state.loadingMore=false;viewGen++;saveNav();load(true,false)};
window.backGroups=()=>{state.group=null;state.member='all';state.posts=[];state.nextOffset=0;state.loadingMore=false;viewGen++;saveNav();render()};
// v0.9.4: return-from-article scroll restore. Saved at tap time; restored after
// bfcache return (pageshow persisted) or a full reload of the same view.
const navKey=()=>`${state.tab}:${state.group||''}:${state.member||'all'}`;
function rememberScroll(id,wasPinned){
 try{
  const el=[...document.querySelectorAll('.card[data-post-id]')].find(x=>x.dataset.postId===id);
  sessionStorage.setItem('hp_scroll',JSON.stringify({nav:navKey(),id,pinned:!!wasPinned,y:scrollY,top:el?el.getBoundingClientRect().top:null,t:Date.now()}));
 }catch(_){}
}
function readRestore(){
 try{
  const v=JSON.parse(sessionStorage.getItem('hp_scroll')||'null');
  if(!v||typeof v!=='object'||v.nav!==navKey()||Date.now()-v.t>30*60e3)return null;
  return v;
 }catch(_){return null}
}
let restoreTarget=readRestore();
// The app restores the return position itself; stop the browser from also
// jumping to an old position after content loads in.
try{if('scrollRestoration'in history)history.scrollRestoration='manual'}catch(_){}
function applyRestore(){
 const v=restoreTarget;if(!v||!state.posts.length)return false;
 // A pinned oshi post becomes read on tap and leaves the top, so use the pixel
 // position for it; otherwise keep the tapped card where it was on screen.
 // Returns true once the position is fully reached (card loaded / page tall enough).
 const byCard=!v.pinned&&v.top!=null;
 const el=byCard?[...document.querySelectorAll('.card[data-post-id]')].find(x=>x.dataset.postId===v.id):null;
 const want=el?scrollY+el.getBoundingClientRect().top-v.top:v.y;
 scrollTo(0,want);
 return (!byCard||!!el)&&Math.abs(scrollY-want)<3;
}
function finishRestore(){restoreTarget=null;try{sessionStorage.removeItem('hp_scroll')}catch(_){}}
function openPost(id){
  const p=state.posts.find(x=>x.id===id);
  if(!p||!p.url)return;
  rememberScroll(id,isPinnedFavorite(p));
  const readSet=reads();
  readSet.add(id);
  saveSet('hp_reads',readSet);
  render();
  // Resolve at tap time from the latest API-backed state, not a URL embedded in stale markup.
  location.href=p.url;
}
function colorDot(hex){const h=hex||'#A0A0A8';const white=/^#(?:fff|ffffff)$/i.test(h);return `<span class="author-dot${white?' white':''}" style="background:${h}"></span>`}
function card(p){let f=!!p.author&&favs().has(p.author),r=reads().has(p.id),pinned=isPinnedFavorite(p),color=p.memberColorHex||'#A0A0A8';const white=/^#(?:fff|ffffff)$/i.test(color);const favOutline=white?'#B8BCC4':color;const particles=f?`<span class="oshi-particles" aria-hidden="true">
<span class="oshi-particle heart" style="--x:4%;--y:78%;--s:20px;--r:-14deg;--d:.12s;--dx:-8px;--dy:-38px;--fx:-3px;--fy:-10px;--float:2.4s;--fd:-.6s">♥</span>
<span class="oshi-particle spark" style="--x:12%;--y:14%;--s:15px;--r:8deg;--d:.24s;--dx:-4px;--dy:-28px;--fx:3px;--fy:-6px;--float:2.1s;--fd:-1.1s">✦</span>
<span class="oshi-particle heart" style="--x:28%;--y:92%;--s:15px;--r:12deg;--d:.31s;--dx:8px;--dy:-34px;--fx:4px;--fy:-9px;--float:2.9s;--fd:-.2s">♥</span>
<span class="oshi-particle spark" style="--x:43%;--y:4%;--s:18px;--r:-5deg;--d:.42s;--dx:3px;--dy:-25px;--fx:-2px;--fy:-7px;--float:2.3s;--fd:-.9s">✧</span>
<span class="oshi-particle heart" style="--x:62%;--y:94%;--s:18px;--r:-9deg;--d:.48s;--dx:7px;--dy:-42px;--fx:3px;--fy:-11px;--float:3.1s;--fd:-1.4s">♥</span>
<span class="oshi-particle spark" style="--x:75%;--y:8%;--s:15px;--r:9deg;--d:.55s;--dx:6px;--dy:-31px;--fx:-3px;--fy:-6px;--float:2.5s;--fd:-.4s">✦</span>
<span class="oshi-particle heart" style="--x:91%;--y:73%;--s:22px;--r:13deg;--d:.61s;--dx:11px;--dy:-39px;--fx:5px;--fy:-10px;--float:2.7s;--fd:-1.2s">♥</span>
<span class="oshi-particle spark" style="--x:96%;--y:24%;--s:14px;--r:-8deg;--d:.69s;--dx:10px;--dy:-24px;--fx:-2px;--fy:-7px;--float:2.2s;--fd:-.5s">✧</span>
<span class="oshi-particle heart" style="--x:50%;--y:86%;--s:13px;--r:6deg;--d:.72s;--dx:-2px;--dy:-30px;--fx:-4px;--fy:-8px;--float:3s;--fd:-.8s">♥</span>
<span class="oshi-particle spark" style="--x:21%;--y:48%;--s:12px;--r:0deg;--d:.76s;--dx:-8px;--dy:-25px;--fx:3px;--fy:-6px;--float:2.6s;--fd:-1.5s">✦</span>
</span>`:'';
return `<article data-post-id="${esc(p.id)}" class="card ${r?'read':''} ${f?'fav':''} ${pinned?'oshi-pinned':''}" style="--member:${color};--fav-outline:${favOutline}" onclick="openPost('${esc(p.id)}')">${f?'<span class="oshi-surface" aria-hidden="true"></span>':''}${particles}<button class="star" onclick="event.stopPropagation();${p.author?`toggleFav('${esc(p.author)}')`:''}">${f?'★':'☆'}</button>${p.image?`<img class="thumb" src="${esc(thumbUrl(p.image))}" data-full="${esc(p.image)}" onerror="thumbFallback(this)" alt="" loading="lazy" decoding="async">`:`<div class="thumb noimg">NO IMAGE</div>`}<div class="ct"><div class="meta">${groupBadge(p.group)}<span class="meta-time">・ ${rel(p.publishedAt)}</span> ${isNew(p)?'<span class="new">NEW</span>':''}</div><div class="member">${colorDot(p.memberColorHex)}${p.author?esc(p.author):'<span class="unknown-author">投稿者未判定</span>'} ${f?'✨':''}</div><div class="title">${esc(p.title)}</div></div></article>`}
function esc(s=''){return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
window.openPost=openPost;window.toggleFav=m=>{let s=favs();s.has(m)?s.delete(m):s.add(m);saveSet('hp_favs',s);render()};
function topBar(){return `<header class="top"><img class="hp-idols left desktop" src="./assets/idols-left.png" alt=""><img class="hp-idols left mobile" src="./assets/idols-left-mobile.png" alt=""><div class="brand"><span>ハロプロブログ</span><span class="dots"><i style="background:#ff5f7e"></i><i style="background:#ffbd3d"></i><i style="background:#56c98c"></i><i style="background:#55a7f5"></i><i style="background:#9c6ade"></i></span></div><img class="hp-idols right desktop" src="./assets/idols-right.png" alt=""><img class="hp-idols right mobile" src="./assets/idols-right-mobile.png" alt=""><button class="iconbtn" onclick="state.settings=true;render()">⚙︎</button></header>${state.loading?`<div class="status"><span class="loaderdots"><i style="background:#ff5f7e"></i><i style="background:#56c98c"></i><i style="background:#55a7f5"></i></span> 新しいブログをチェック中… ✨</div>`:''}${state.banner?`<div class="status">${state.banner}</div>`:''}`}
function loadingMain(){return `<div class="mainloading"><span class="loaderdots"><i style="background:#ff5f7e"></i><i style="background:#56c98c"></i><i style="background:#55a7f5"></i></span><div>記事を取得しています…</div></div>`}
function moreButton(){return state.hasMore?`<button class="more" onclick="loadMore()" ${state.loadingMore?'disabled':''}>${state.loadingMore?'記事を取得しています…':'さらに読み込む'}</button>`:''}
function latest(){
 if(state.loading&&!state.posts.length)return `<main class="section">${loadingMain()}</main>`;
 return `<main class="section">${latestOrderedPosts().map(card).join('')}${moreButton()}${!state.posts.length&&!state.loading?'<div class="empty">記事がありません</div>':''}</main>`;
}
function groupView(){
 if(!state.group){
  return `<div class="tiles">${groups.map(g=>{let n=state.groupCounts[g.id]||0;return `<button class="tile" style="--group:${g.color}" onclick="openGroup('${g.id}')"><b>${g.name}</b><div class="count">30日以内 ${n}件</div></button>`}).join('')}</div>`;
 }
 const g=groups.find(x=>x.id===state.group);
 const gm=(state.memberMaster.groups||[]).find(x=>x.id===g.id);
 const members=gm?[...gm.members].sort((a,b)=>(a.order??999)-(b.order??999)).map(m=>({member:m.name,memberColorHex:m.hex,memberColor:m.color})):[];
 const body=state.loading&&!state.posts.length?loadingMain():(state.posts.map(card).join('')+moreButton()||'<div class="empty">記事がありません</div>');
 return `<div class="section"><button class="chip" onclick="backGroups()">‹ グループ一覧</button><h2>${g.name}</h2></div>
 <div class="chips member-chips"><button class="chip ${state.member==='all'?'on':''}" onclick="selectMember('all')">すべて</button>${members.map(m=>`<button class="chip ${state.member===m.member?'on':''}" onclick="selectMember('${esc(m.member)}')"><span class="dot" style="background:${m.memberColorHex||'#aaa'}"></span>${esc(m.member)}${favs().has(m.member)?' ✨':''}</button>`).join('')}</div>
 <main class="section">${body}</main>`;
}
function settings(){
 if(!state.settings)return '';
 const masterGroups=(state.memberMaster.groups||[]);
 const sections=groups.map(g=>{
   const gm=masterGroups.find(x=>x.id===g.id);
   if(!gm||!gm.members?.length)return '';
   const members=[...gm.members].sort((a,b)=>(a.order??999)-(b.order??999));
   return `<section class="fav-group" style="--group-color:${g.color};--group-bg:${hexToRgba(g.color,.075)}">
     <div class="fav-group-title"><span class="group-mini-dot"></span>${esc(g.name)}</div>
     <div class="fav-member-list">${members.map(m=>{
       const on=favs().has(m.name), c=m.hex||'#aaa', white=String(c).toUpperCase()==='#FFFFFF';
       return `<button class="fav-member-chip ${on?'on':''}" style="--member-color:${white?'#B8B8BE':c};--member-bg:${hexToRgba(white?'#B8B8BE':c,.10)}" onclick="toggleFav('${esc(m.name)}')"><span class="member-dot ${white?'white':''}" style="--member-color:${c}"></span><span>${esc(m.name)}</span>${on?'<span class="fav-mark">★</span>':''}</button>`;
     }).join('')}</div>
   </section>`;
 }).join('');
 return `<div class="modal" onclick="if(event.target===this){state.settings=false;render()}"><div class="sheet"><div class="row"><b>設定</b><button class="iconbtn" onclick="state.settings=false;render()">×</button></div><div class="row"><span>表示テーマ</span><div class="theme"><button onclick="setTheme('light')">☀️ ライト</button><button onclick="setTheme('dark')">🌙 ダーク</button></div></div><h3>☆ 推しメンバー</h3><div class="fav-groups">${sections}</div><div class="app-version">ハロプロブログ v${APP_VERSION}</div></div></div>`;
}
window.setTheme=t=>{localStorage.setItem('hp_theme',t);document.documentElement.dataset.theme=t;render()};document.documentElement.dataset.theme=localStorage.getItem('hp_theme')||'light';
window.goLatest=()=>{state.tab='latest';state.group=null;state.member='all';state.posts=[];state.nextOffset=0;state.loadingMore=false;viewGen++;saveNav();load(true,false)};
window.goGroups=()=>{state.tab='groups';state.group=null;state.member='all';state.posts=[];state.nextOffset=0;state.loadingMore=false;viewGen++;saveNav();load(true,false)};
function bottom(){return `<nav class="bottom"><button class="tab ${state.tab==='latest'?'on':''}" onclick="goLatest()"><span>◷</span>最新記事</button><button class="tab ${state.tab==='groups'?'on':''}" onclick="goGroups()"><span>▦</span>グループ別</button></nav>`}
// v0.9.5: every render rebuilds the list with innerHTML, which recreated every
// card and thumbnail. iPhone Safari then blanked and re-showed the images
// (flicker) and a running 推しエフェクト was cut off. After rebuilding, put back
// the previous node for every card whose markup did not change, and the
// previous <img> for changed cards that still show the same thumbnail.
function cardSig(el){
 const raw=el.getAttribute('class')||'',norm=[...el.classList].filter(x=>x!=='oshi-rare').sort().join(' ');
 return el.outerHTML.replace(`class="${raw}"`,`class="${norm}"`);
}
function keepNodes(root,render){
 const oldCards=new Map(),oldImgs=new Map();
 for(const el of root.querySelectorAll('.card[data-post-id]'))if(!oldCards.has(el.dataset.postId))oldCards.set(el.dataset.postId,{el,sig:cardSig(el)});
 for(const img of root.querySelectorAll('img.thumb')){const k=img.getAttribute('src');if(k&&!oldImgs.has(k))oldImgs.set(k,img)}
 // v0.9.6: the header pixel-art idols were recreated on every render too (flicker).
 const oldIdols=new Map();
 for(const img of root.querySelectorAll('img.hp-idols'))oldIdols.set(img.className+'|'+img.getAttribute('src'),img);
 render();
 for(const img of root.querySelectorAll('img.hp-idols')){const prev=oldIdols.get(img.className+'|'+img.getAttribute('src'));if(prev&&prev!==img)img.replaceWith(prev)}
 if(!oldCards.size)return;
 for(const el of root.querySelectorAll('.card[data-post-id]')){
  const prev=oldCards.get(el.dataset.postId);
  if(prev&&prev.sig===cardSig(el)){el.replaceWith(prev.el);oldCards.delete(el.dataset.postId);continue}
  const img=el.querySelector('img.thumb'),k=img&&img.getAttribute('src'),pi=k&&oldImgs.get(k);
  if(pi&&!pi.isConnected&&pi!==img){img.replaceWith(pi);oldImgs.delete(k)}
 }
}
function render(){favsCache=readsCache=null;saveNav();const app=document.getElementById('app');keepNodes(app,()=>{app.innerHTML=`<div class="shell"><div id="ptr" class="ptr ${pull.refreshing?'show refreshing':''}"><span class="ptr-spinner"></span></div>${topBar()}${state.tab==='latest'?latest():groupView()}${bottom()}${settings()}</div>`});bindFavoriteEffects();if(restoreTarget&&state.posts.length)requestAnimationFrame(applyRestore)}
function updatePtr(){const el=document.getElementById('ptr');if(!el)return;if(pull.refreshing){el.className='ptr show refreshing';el.style.transform='translateY(0) scale(1)';return}const d=Math.min(110,pull.distance);const progress=Math.min(1,d/78);el.className='ptr'+(d>4?' show':'');el.style.opacity=String(progress);el.style.transform=`translateY(${Math.max(-18,-18+d*.42)}px) scale(${.78+.22*progress})`;const sp=el.querySelector('.ptr-spinner');if(sp)sp.style.transform=`rotate(${progress*250}deg)`}
// v0.9.7: once the user scrolls by hand, stop any pending return-position restore.
addEventListener('wheel',()=>{if(restoreTarget)finishRestore()},{passive:true});
addEventListener('touchstart',e=>{if(restoreTarget)finishRestore();if(scrollY<=0&&!pull.refreshing){pull.startY=e.touches[0].clientY;pull.distance=0;pull.tracking=true}},{passive:true});
addEventListener('touchmove',e=>{if(!pull.tracking||pull.refreshing)return;const dy=e.touches[0].clientY-pull.startY;if(dy<=0){pull.distance=0;updatePtr();return}pull.distance=Math.min(110,dy*.62);updatePtr();if(pull.distance>8)e.preventDefault()},{passive:false});
addEventListener('touchend',()=>{if(!pull.tracking)return;const trigger=pull.distance>=72;pull.tracking=false;if(trigger){pull.refreshing=true;updatePtr();load(false,false,true)}else{pull.distance=0;updatePtr()}},{passive:true});
addEventListener('touchcancel',()=>{pull.tracking=false;pull.distance=0;updatePtr()},{passive:true});
render();load(true);if('serviceWorker'in navigator)navigator.serviceWorker.register('./sw.js');

addEventListener('pageshow',e=>{
 // Fresh page loads are restored by load(); this handles the bfcache return.
 if(!e.persisted){render();return}
 restoreTarget=readRestore();render();
 if(restoreTarget)setTimeout(()=>{applyRestore();finishRestore()},60);
});
