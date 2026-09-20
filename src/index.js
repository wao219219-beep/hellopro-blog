// Cloudflare Worker / Pages Function compatible data adapter for ハロプロブログ v0.2
// Fetches official Hello! Project member blogs from Ameba RSS and Kenshusei from UP-FRONT.
const BLOGS = [
  ['morningmusume',"モーニング娘。'26",'morningmusume-10ki'],
  ['morningmusume',"モーニング娘。'26",'mm-12ki'],
  ['morningmusume',"モーニング娘。'26",'morningmusume15ki'],
  ['morningmusume',"モーニング娘。'26",'morningmusume16ki'],
  ['angerme','アンジュルム','angerme-new'],
  ['juicejuice','Juice=Juice','juicejuice-official'],
  ['tsubaki','つばきファクトリー','tsubaki-factory'],
  ['tsubaki','つばきファクトリー','tsubaki-factory-new'],
  ['beyooooonds','BEYOOOOONDS','beyooooonds-chicatetsu'],
  ['beyooooonds','BEYOOOOONDS','beyooooonds-rfro'],
  ['beyooooonds','BEYOOOOONDS','beyooooonds'],
  ['beyooooonds','BEYOOOOONDS','beyooooonds-blog'],
  ['ocha','OCHA NORMA','ocha-norma'],
  ['rosy','ロージークロニクル','rosychronicle'],
];
const MEMBER_MASTER={"updated":"2026-09-19","groups":[{"id":"morningmusume","group":"モーニング娘。'26","members":[{"name":"小田さくら","color":"ラベンダー","hex":"#B39DDB"},{"name":"野中美希","color":"パープル","hex":"#8E44AD"},{"name":"岡村ほまれ","color":"デイジー","hex":"#FFD700"},{"name":"山﨑愛生","color":"ブルー","hex":"#2980B9"},{"name":"櫻井梨央","color":"ミルクティー","hex":"#C9B18C"},{"name":"井上春華","color":"ミントグリーン","hex":"#98FF98"},{"name":"弓桁朱琴","color":"ピュアレッド","hex":"#E60012"},{"name":"杉原明紗","color":"ライトブルー","hex":"#87CEEB"},{"name":"安田美結","color":"グリーン","hex":"#2E8B57"},{"name":"鈴木もあ","color":"ホットピンク","hex":"#FF69B4"},{"name":"石川華望","color":"オレンジ","hex":"#F39C12"}]},{"id":"angerme","group":"アンジュルム","members":[{"name":"伊勢鈴蘭","color":"オレンジ","hex":"#F39C12"},{"name":"為永幸音","color":"ピンク","hex":"#FF8FB1"},{"name":"橋迫鈴","color":"ピュアレッド","hex":"#E60012"},{"name":"川名凜","color":"グリーン","hex":"#2E8B57"},{"name":"松本わかな","color":"ホワイト","hex":"#FFFFFF"},{"name":"平山遊季","color":"ライトグリーン","hex":"#90EE90"},{"name":"下井谷幸穂","color":"ホットピンク","hex":"#FF69B4"},{"name":"後藤花","color":"シーブルー","hex":"#00A6D6"},{"name":"長野桃羽","color":"イエロー","hex":"#FFD700"}]},{"id":"juicejuice","group":"Juice=Juice","members":[{"name":"段原瑠々","color":"オレンジ","hex":"#F39C12"},{"name":"井上玲音","color":"ホワイト","hex":"#FFFFFF"},{"name":"工藤由愛","color":"ピンク","hex":"#FF8FB1"},{"name":"松永里愛","color":"ロイヤルブルー","hex":"#4169E1"},{"name":"有澤一華","color":"ライトブルー","hex":"#87CEEB"},{"name":"入江里咲","color":"ライトパープル","hex":"#B19CD9"},{"name":"江端妃咲","color":"デイジー","hex":"#FFD700"},{"name":"石山咲良","color":"パープル","hex":"#8E44AD"},{"name":"遠藤彩加里","color":"ミントグリーン","hex":"#98FF98"},{"name":"川嶋美楓","color":"ピュアレッド","hex":"#E60012"},{"name":"林仁愛","color":"ブライトグリーン","hex":"#32CD32"}]},{"id":"tsubaki","group":"つばきファクトリー","members":[{"name":"谷本安美","color":"ライトパープル","hex":"#B19CD9"},{"name":"小野瑞歩","color":"エメラルドグリーン","hex":"#00A86B"},{"name":"小野田紗栞","color":"ピーチ","hex":"#FFB07C"},{"name":"秋山眞緒","color":"ライトレッド","hex":"#FF6666"},{"name":"河西結心","color":"パープル","hex":"#8E44AD"},{"name":"福田真琳","color":"ロイヤルブルー","hex":"#4169E1"},{"name":"豫風瑠乃","color":"マスタード","hex":"#D4A017"},{"name":"石井泉羽","color":"ホワイト","hex":"#FFFFFF"},{"name":"村田結生","color":"ライトピンク","hex":"#FFB6C1"},{"name":"土居楓奏","color":"ブライトグリーン","hex":"#32CD32"},{"name":"西村乙輝","color":"イエロー","hex":"#FFD700"}]},{"id":"beyooooonds","group":"BEYOOOOONDS","members":[{"name":"西田汐里","color":"ホットピンク","hex":"#FF69B4"},{"name":"江口紗耶","color":"デイジー","hex":"#FFD700"},{"name":"前田こころ","color":"シーブルー","hex":"#00A6D6"},{"name":"岡村美波","color":"ピンク","hex":"#FF8FB1"},{"name":"清野桃々姫","color":"オレンジ","hex":"#F39C12"},{"name":"平井美葉","color":"パープル","hex":"#8E44AD"},{"name":"小林萌花","color":"グリーン","hex":"#2E8B57"},{"name":"里吉うたの","color":"ミディアムブルー","hex":"#3F7FC4"},{"name":"大坪茉乃","color":"ライトグリーン","hex":"#90EE90"},{"name":"杉山結菜","color":"レッド","hex":"#E53935"},{"name":"小島はな","color":"ホワイト","hex":"#FFFFFF"}]},{"id":"ocha","group":"OCHA NORMA","members":[{"name":"斉藤円香","color":"シーブルー","hex":"#00A6D6"},{"name":"広本瑠璃","color":"イエロー","hex":"#FFD700"},{"name":"米村姫良々","color":"イタリアンレッド","hex":"#D52B1E"},{"name":"窪田七海","color":"ピンク","hex":"#FF8FB1"},{"name":"中山夏月姫","color":"ホワイト","hex":"#FFFFFF"},{"name":"西﨑美空","color":"パープル","hex":"#8E44AD"},{"name":"北原もも","color":"ライトグリーン","hex":"#90EE90"},{"name":"筒井澪心","color":"ロイヤルブルー","hex":"#4169E1"}]},{"id":"rosy","group":"ロージークロニクル","members":[{"name":"橋田歩果","color":"ホワイト","hex":"#FFFFFF"},{"name":"吉田姫杷","color":"ピュアレッド","hex":"#E60012"},{"name":"小野田華凜","color":"ピンク","hex":"#FF8FB1"},{"name":"村越彩菜","color":"ライトパープル","hex":"#B19CD9"},{"name":"植村葉純","color":"オレンジ","hex":"#F39C12"},{"name":"松原ユリヤ","color":"ライトブルー","hex":"#87CEEB"},{"name":"島川波菜","color":"ブライトグリーン","hex":"#32CD32"},{"name":"上村麗菜","color":"イエロー","hex":"#FFD700"},{"name":"相馬優芽","color":"ブルー","hex":"#2980B9"}]}]};
const GROUP_MEMBERS=new Map(MEMBER_MASTER.groups.map(g=>[g.id,g.members]));
function membersForGroup(groupId){return GROUP_MEMBERS.get(groupId)||[]}
function normalizeName(v=''){return text(v).replace(/[\s　]+/g,'').replace(/[・･]/g,'').trim()}
function memberRecord(groupId,raw=''){
  const n=normalizeName(raw); if(!n)return null;
  return membersForGroup(groupId).find(m=>normalizeName(m.name)===n)||null;
}
function candidatesInText(groupId,...parts){
  const hay=normalizeName(parts.join(' '));
  return membersForGroup(groupId).filter(m=>hay.includes(normalizeName(m.name)));
}
function rssAuthorCandidate(groupId,title,desc=''){
  const titleText=text(title), all=candidatesInText(groupId,titleText,desc);
  const suffix=membersForGroup(groupId).filter(m=>normalizeName(titleText).endsWith(normalizeName(m.name)));
  if(suffix.length===1)return suffix[0];
  return all.length===1?all[0]:null;
}
function decode(s=''){return s.replace(/<!\[CDATA\[|\]\]>/g,'').replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&quot;/g,'"').replace(/&#39;|&#039;/g,"'").replace(/&amp;/g,'&').trim()}
function text(s=''){return decode(s).replace(/<[^>]*>/g,' ').replace(/\s+/g,' ').trim()}
function tag(block,name){let m=block.match(new RegExp(`<${name}[^>]*>([\\s\\S]*?)<\/${name}>`,'i'));return m?decode(m[1]):''}
function imageFrom(html=''){let m=decode(html).match(/<img[^>]+(?:data-src|data-original|data-lazy-src|data-image|src)=["']([^"']+)["']/i);return m?m[1].replace(/^http:/,'https:'):''}
function rssImage(block,desc=''){let m=block.match(/<(?:media:thumbnail|media:content|enclosure)[^>]+url=["']([^"']+)["']/i);return (m?decode(m[1]):imageFrom(desc)).replace(/^http:/,'https:')}
function safeISO(v=''){let d=new Date(v);return Number.isFinite(d.getTime())?d.toISOString():''}
function normalizeImage(url=''){
  return decode(url)
    .replace(/&amp;/g,'&')
    .replace(/^http:/i,'https:')
    .trim();
}
function isUsefulArticleImage(u=''){
  if(!/^https?:\/\//i.test(u)) return false;
  return !/(profile|avatar|logo|emoji|stamp|skin|common|favicon|blank|spacer|pixel|banner)/i.test(u);
}
function articleImageFromHTML(html=''){
  const unescaped=html.replace(/\\u002F/gi,'/').replace(/\\\//g,'/').replace(/&quot;/g,'"');
  const candidates = [
    /<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i,
    /<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/i,
    /<meta[^>]+name=["']twitter:image(?::src)?["'][^>]+content=["']([^"']+)["']/i,
    /<meta[^>]+content=["']([^"']+)["'][^>]+name=["']twitter:image(?::src)?["']/i,
    /(?:articleText|entry-text|article__text|js-entry-text)[\s\S]{0,12000}?<(?:img|amp-img)[^>]+(?:data-src|data-original|data-lazy-src|data-image|src)=["']([^"']+)["']/i,
    /"(?:imageUrl|image_url|imageSrc|image_src)"\s*:\s*"(https?:[^"]+)"/i,
    /<(?:img|amp-img)[^>]+(?:data-src|data-original|data-lazy-src|data-image|src)=["']([^"']+)["']/i
  ];
  for(const rx of candidates){
    const m=unescaped.match(rx);
    if(m&&m[1]){
      const u=normalizeImage(m[1]);
      if(isUsefulArticleImage(u)) return u;
    }
  }
  return '';
}
function articleAuthorFromHTML(html='',groupId=''){
  const unescaped=html.replace(/\\u002F/gi,'/').replace(/\\\//g,'/').replace(/&quot;/g,'"');
  const fields=[];
  const patterns=[
    /"author"\s*:\s*\{[\s\S]{0,1000}?"name"\s*:\s*"([^"]+)"/ig,
    /"authorName"\s*:\s*"([^"]+)"/ig,
    /"nickname"\s*:\s*"([^"]+)"/ig,
    /<meta[^>]+(?:name|property)=["'](?:author|article:author)["'][^>]+content=["']([^"']+)["']/ig,
    /<meta[^>]+content=["']([^"']+)["'][^>]+(?:name|property)=["'](?:author|article:author)["']/ig
  ];
  for(const rx of patterns){let m;while((m=rx.exec(unescaped)))fields.push(m[1])}
  for(const raw of fields){const exact=memberRecord(groupId,raw);if(exact)return exact}
  // Some Ameba pages decorate the author field. Accept only when exactly one
  // member of this group occurs in author-specific metadata, never article body.
  const hits=[];
  for(const raw of fields)for(const m of candidatesInText(groupId,raw))if(!hits.some(x=>x.name===m.name))hits.push(m);
  return hits.length===1?hits[0]:null;
}
function applyMember(post,member){
  if(!member){post.author=null;post.memberColor=null;post.memberColorHex=null;return}
  post.author=member.name;post.memberColor=member.color;post.memberColorHex=member.hex;
}

async function enrichPageDetails(posts){
  const targets = posts.filter(p => /^https:\/\/ameblo\.jp\//i.test(p.url) || (!p.image && /^https:\/\/www\.upfc\.jp\/helloproject\/artist\/trcontents_detail\.php/i.test(p.url)));
  const concurrency = 6;
  let cursor = 0;
  async function worker(){
    while (cursor < targets.length) {
      const p = targets[cursor++];
      try {
        const r = await fetch(p.url, {
          headers: {
            'User-Agent':'Mozilla/5.0 (compatible; HelloProBlog/0.8.2)',
            'Accept':'text/html,application/xhtml+xml'
          },
          // Article pages rarely change after publication. Reuse Cloudflare's
          // cached HTML so repeat app opens do not wait on the origin site.
          cf:{cacheEverything:true,cacheTtl:604800}
        });
        if (!r.ok) continue;
        const html=await r.text();
        if(/^https:\/\/ameblo\.jp\//i.test(p.url)){
          const pageAuthor=articleAuthorFromHTML(html,p.groupId);
          if(pageAuthor) applyMember(p,pageAuthor);
        }
        let img='';
        if(!p.image && p.groupId==='kenshusei'){
          const km=html.match(/<img[^>]+(?:src|data-src)=["']([^"']*\/helloproject\/images\/upload\/images\/[^"']+)["']/i);
          if(km&&km[1]) img=normalizeImage(new URL(km[1],p.url).href);
        }
        if(!p.image&&!img) img=articleImageFromHTML(html);
        if (img) p.image = img;
      } catch (_) {}
    }
  }
  await Promise.all(Array.from({length: Math.min(concurrency, targets.length)}, worker));
  return posts;
}

function parseRSS(xml,groupId,group){
  const items=xml.match(/<item\b[\s\S]*?<\/item>/gi)||[];
  return items.map(b=>{
    const rawTitle=text(tag(b,'title')),url=text(tag(b,'link')),desc=tag(b,'description')||tag(b,'content:encoded');
    const candidate=rssAuthorCandidate(groupId,rawTitle,desc);
    const d=tag(b,'pubDate');
    const post={id:url||tag(b,'guid'),groupId,group,author:null,memberColor:null,memberColorHex:null,title:rawTitle,publishedAt:safeISO(d),url,image:rssImage(b,desc)};
    applyMember(post,candidate);
    if(candidate){post.title=rawTitle.replace(new RegExp(`\\s*[｜|]?\\s*${candidate.name}\\s*$`),'').trim()||rawTitle}
    return post;
  }).filter(x=>x.url&&x.publishedAt)
}
async function fetchBlog(src){let [groupId,group,ameba]=src;let url=`https://rssblog.ameba.jp/${ameba}/rss20.xml`;let r=await fetch(url,{headers:{'User-Agent':'Mozilla/5.0 (compatible; HelloProBlog/0.8.2)','Accept':'application/rss+xml, application/xml, text/xml;q=0.9, */*;q=0.8'},cf:{cacheEverything:true,cacheTtl:90}});if(!r.ok)throw new Error(`${ameba}: ${r.status}`);let posts=parseRSS(await r.text(),groupId,group);if(!posts.length)throw new Error(`${ameba}: empty feed`);return {ameba,posts}}
function canonicalKenshuDetail(raw=''){
  try{
    const u=new URL(decode(raw),'https://www.upfc.jp');
    if(u.hostname!=='www.upfc.jp' || !u.pathname.endsWith('/helloproject/artist/trcontents_detail.php')) return '';
    // Every real diary entry has its own @uid. Reject TOP/list/navigation links.
    const uid=u.searchParams.get('@uid');
    if(!uid) return '';
    const clean=new URL('https://www.upfc.jp/helloproject/artist/trcontents_detail.php');
    clean.searchParams.set('@rst','all');
    clean.searchParams.set('@uid',uid);
    // Preserve these when UP-FC supplies them, but they are not required.
    for(const k of ['ccid','gid']) if(u.searchParams.get(k)) clean.searchParams.set(k,u.searchParams.get(k));
    return clean.href;
  }catch(_){return ''}
}
function parseKenshu(html){
  const out=[],seen=new Set();
  const re=/<a\b([^>]*)>([\s\S]*?)<\/a>/gi;
  let m;
  while((m=re.exec(html))){
    const href=(m[1].match(/\bhref\s*=\s*["']([^"']+)["']/i)||[])[1]||'';
    const url=canonicalKenshuDetail(href);
    if(!url) continue;
    const t=text(m[2]);
    if(!/研修生リハーサル日記/.test(t)) continue;
    const dm=t.match(/(20\d{2})[.\/-](\d{2})[.\/-](\d{2})\s+(.+)$/);
    if(!dm) continue;
    const member=dm[4].trim();
    const uid=new URL(url).searchParams.get('@uid');
    if(!uid||seen.has(uid)) continue;
    seen.add(uid);
    out.push({
      id:`kenshusei:${uid}`,groupId:'kenshusei',group:'ハロプロ研修生',
      author:member,memberColor:null,memberColorHex:null,title:'Hello! Project 研修生リハーサル日記',
      publishedAt:`${dm[1]}-${dm[2]}-${dm[3]}T12:00:00+09:00`,url,image:''
    });
  }
  return out;
}

async function getPostIndex(){
  const settled=await Promise.allSettled(BLOGS.map(fetchBlog));
  let posts=settled.flatMap(x=>x.status==='fulfilled'?x.value.posts:[]);
  const sources=settled.map((x,i)=>({
    source:BLOGS[i][2],
    ok:x.status==='fulfilled',
    count:x.status==='fulfilled'?x.value.posts.length:0,
    error:x.status==='rejected'?String(x.reason?.message||x.reason):''
  }));

  try{
    const listUrl='https://www.upfc.jp/helloproject/artist/trcontents_list.php?%40rst=all&%40uid=KENSYUSEI';
    const r=await fetch(listUrl,{
      headers:{
        'User-Agent':'Mozilla/5.0 (compatible; HelloProBlog/0.8.2)',
        'Accept':'text/html,application/xhtml+xml'
      },
      cf:{cacheEverything:true,cacheTtl:90}
    });
    if(r.ok){
      const kposts=parseKenshu(await r.text());
      posts.push(...kposts);
      sources.push({source:'KENSYUSEI',ok:true,count:kposts.length,error:''});
    }else{
      sources.push({source:'KENSYUSEI',ok:false,count:0,error:`HTTP ${r.status}`});
    }
  }catch(e){
    sources.push({source:'KENSYUSEI',ok:false,count:0,error:String(e?.message||e)});
  }

  const cutoff=Date.now()-30*864e5,seen=new Set();
  posts=posts
    .filter(p=>p.publishedAt && new Date(p.publishedAt).getTime()>=cutoff)
    .sort((a,b)=>new Date(b.publishedAt)-new Date(a.publishedAt))
    .filter(p=>p.id && !seen.has(p.id) && seen.add(p.id));

  return {posts,sources};
}

async function handler(req){
  const started=Date.now();
  if(req.method==='OPTIONS') return new Response(null,{headers:cors()});
  const u=new URL(req.url);
  const offset=Math.max(0,Number.parseInt(u.searchParams.get('offset')||'0',10)||0);
  const limit=Math.min(20,Math.max(1,Number.parseInt(u.searchParams.get('limit')||'20',10)||20));
  const group=u.searchParams.get('group')||'';
  const member=u.searchParams.get('member')||'';

  const {posts:allPosts,sources}=await getPostIndex();

  // Counts are computed from the complete 30-day metadata index, not just this page.
  const groupCounts={};
  for(const p of allPosts) groupCounts[p.groupId]=(groupCounts[p.groupId]||0)+1;

  let filtered=allPosts;
  if(group) filtered=filtered.filter(p=>p.groupId===group);
  if(member) filtered=filtered.filter(p=>p.author===member);

  const total=filtered.length;
  const page=filtered.slice(offset,offset+limit);

  // Critical structural change: only articles returned on THIS page are enriched.
  // RSS/Kenshusei index requests (~15) + at most 20 article requests stay below
  // the Workers Free external-subrequest ceiling.
  await enrichPageDetails(page);

  return new Response(JSON.stringify({
    posts:page,total,offset,limit,hasMore:offset+page.length<total,
    groupCounts,memberMaster:MEMBER_MASTER,sources,updatedAt:new Date().toISOString(),
    source:'official-ameba-rss-and-kenshusei',elapsedMs:Date.now()-started
  }),{headers:{...cors(),'content-type':'application/json;charset=utf-8','cache-control':'no-store'}});
}
function cors(){return {'access-control-allow-origin':'*','access-control-allow-methods':'GET,OPTIONS'}}

// v0.8.2: API-level cache + stale fallback. This prevents repeated iPhone reloads
// from fanning out into many RSS/article requests at once.
const API_INFLIGHT = new Map();
function apiCacheRequest(request, tier='fresh'){
  const u=new URL(request.url);u.searchParams.delete('_');u.searchParams.set('__hp_cache',tier);
  return new Request(u.toString(),{method:'GET'});
}
async function cachedApi(request){
  const cache=caches.default;
  const freshKey=apiCacheRequest(request,'fresh');
  const staleKey=apiCacheRequest(request,'stale');
  const fresh=await cache.match(freshKey);
  if(fresh)return fresh;

  const stable=new URL(request.url);stable.searchParams.delete('_');
  const lockKey=stable.toString();
  if(API_INFLIGHT.has(lockKey)) return (await API_INFLIGHT.get(lockKey)).clone();

  const job=(async()=>{
    try{
      const response=await handler(request);
      if(!response.ok)throw new Error(`HTTP ${response.status}`);
      const freshCopy=new Response(response.clone().body,{status:response.status,headers:response.headers});
      freshCopy.headers.set('cache-control','public, max-age=30');
      const staleCopy=new Response(response.clone().body,{status:response.status,headers:response.headers});
      staleCopy.headers.set('cache-control','public, max-age=21600');
      await Promise.all([cache.put(freshKey,freshCopy),cache.put(staleKey,staleCopy)]);
      return response;
    }catch(error){
      const stale=await cache.match(staleKey);
      if(stale){
        const h=new Headers(stale.headers);h.set('x-hp-stale','1');
        return new Response(stale.body,{status:200,headers:h});
      }
      throw error;
    }
  })();
  API_INFLIGHT.set(lockKey,job);
  try{return (await job).clone()}finally{API_INFLIGHT.delete(lockKey)}
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname === '/api/posts') {
      try { return await cachedApi(request); }
      catch (error) {
        return new Response(JSON.stringify({ posts: [], error: 'feed_fetch_failed', detail: String(error?.message || error) }), {
          status: 502,
          headers: { ...cors(), 'content-type': 'application/json;charset=utf-8', 'cache-control': 'no-store' }
        });
      }
    }
    return env.ASSETS.fetch(request);
  }
};
