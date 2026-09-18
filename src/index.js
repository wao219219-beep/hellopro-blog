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
const COLORS={
 '小田さくら':'#B56AA0','野中美希':'#9B59B6','岡村ほまれ':'#F2C94C','山﨑愛生':'#2E8B57','櫻井梨央':'#D9C7A5','井上春華':'#8CC8E8','弓桁朱琴':'#E53935','杉原明紗':'#8ED8E8','安田美結':'#43A047','鈴木もあ':'#F48FB1','石川華望':'#7E57C2',
 '伊勢鈴蘭':'#FF9800','為永幸音':'#FF69B4','橋迫鈴':'#E53935','川名凜':'#2E7D32','松本わかな':'#FFFFFF','平山遊季':'#A5D6A7','下井谷幸穂':'#FF69B4','後藤花':'#00A6D6','長野桃羽':'#F4A6C1',
 '段原瑠々':'#FF9800','井上玲音':'#FFFFFF','工藤由愛':'#FF69B4','松永里愛':'#1565C0','有澤一華':'#81D4FA','入江里咲':'#CE93D8','江端妃咲':'#FFF176','石山咲良':'#7E57C2','遠藤彩加里':'#F48FB1','川嶋美楓':'#E53935','林仁愛':'#43A047',
 '谷本安美':'#CE93D8','小野瑞歩':'#2E8B57','小野田紗栞':'#F48FB1','秋山眞緒':'#EF5350','河西結心':'#7E57C2','福田真琳':'#1565C0','豫風瑠乃':'#F2C94C','石井泉羽':'#FFFFFF','村田結生':'#F48FB1','土居楓奏':'#A5D6A7','西村乙輝':'#1565C0',
 '西田汐里':'#F48FB1','江口紗耶':'#F2C94C','前田こころ':'#81D4FA','岡村美波':'#F48FB1','清野桃々姫':'#FF9800','平井美葉':'#7E57C2','小林萌花':'#2E8B57','里吉うたの':'#1565C0','小島はな':'#FFFFFF','大坪茉乃':'#EF5350','杉山結菜':'#81D4FA',
 '斉藤円香':'#81D4FA','広本瑠璃':'#F2C94C','米村姫良々':'#E53935','窪田七海':'#F48FB1','中山夏月姫':'#FFFFFF','西﨑美空':'#7E57C2','北原もも':'#A4C639','筒井澪心':'#1565C0',
 '橋田歩果':'#FFFFFF','吉田姫杷':'#E53935','小野田華凜':'#F48FB1','村越彩菜':'#7E57C2','植村葉純':'#FF9800','松原ユリヤ':'#81D4FA','島川波菜':'#1565C0','上村麗菜':'#F48FB1','相馬優芽':'#A5D6A7'
};
const KNOWN=Object.keys(COLORS).sort((a,b)=>b.length-a.length);
function decode(s=''){return s.replace(/<!\[CDATA\[|\]\]>/g,'').replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&quot;/g,'"').replace(/&#39;|&#039;/g,"'").replace(/&amp;/g,'&').trim()}
function text(s=''){return decode(s).replace(/<[^>]*>/g,' ').replace(/\s+/g,' ').trim()}
function tag(block,name){let m=block.match(new RegExp(`<${name}[^>]*>([\\s\\S]*?)<\\/${name}>`,'i'));return m?decode(m[1]):''}
function memberFrom(title,desc=''){let hay=text(title+' '+desc);return KNOWN.find(n=>hay.includes(n))||''}
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
async function enrichMissingImages(posts){
  const targets = posts.filter(p => !p.image && (/^https:\/\/ameblo\.jp\//i.test(p.url) || /^https:\/\/www\.upfc\.jp\/helloproject\/artist\/trcontents_detail\.php/i.test(p.url)));
  const concurrency = 6;
  let cursor = 0;
  async function worker(){
    while (cursor < targets.length) {
      const p = targets[cursor++];
      try {
        const r = await fetch(p.url, {
          headers: {
            'User-Agent':'Mozilla/5.0 (compatible; HelloProBlog/0.7.1)',
            'Accept':'text/html,application/xhtml+xml'
          },
          // Article pages rarely change after publication. Reuse Cloudflare's
          // cached HTML so repeat app opens do not wait on the origin site.
          cf:{cacheEverything:true,cacheTtl:604800}
        });
        if (!r.ok) continue;
        const html=await r.text();
        let img='';
        if(p.groupId==='kenshusei'){
          const km=html.match(/<img[^>]+(?:src|data-src)=["']([^"']*\/helloproject\/images\/upload\/images\/[^"']+)["']/i);
          if(km&&km[1]) img=normalizeImage(new URL(km[1],p.url).href);
        }
        if(!img) img=articleImageFromHTML(html);
        if (img) p.image = img;
      } catch (_) {}
    }
  }
  await Promise.all(Array.from({length: Math.min(concurrency, targets.length)}, worker));
  return posts;
}

function parseRSS(xml,groupId,group){let items=xml.match(/<item\b[\s\S]*?<\/item>/gi)||[];return items.map(b=>{let title=text(tag(b,'title')),url=text(tag(b,'link')),desc=tag(b,'description')||tag(b,'content:encoded'),member=memberFrom(title,desc)||group;let d=tag(b,'pubDate');return {id:url||tag(b,'guid'),groupId,group,member,memberColor:COLORS[member]||'#A0A0A8',title:title.replace(new RegExp(`\\s*[｜|]?\\s*${member}\\s*$`),'').trim()||title,date:safeISO(d),url,image:rssImage(b,desc)}}).filter(x=>x.url&&x.date)}
async function fetchBlog(src){let [groupId,group,ameba]=src;let url=`https://rssblog.ameba.jp/${ameba}/rss20.xml`;let r=await fetch(url,{headers:{'User-Agent':'Mozilla/5.0 (compatible; HelloProBlog/0.7.1)','Accept':'application/rss+xml, application/xml, text/xml;q=0.9, */*;q=0.8'},cf:{cacheEverything:true,cacheTtl:90}});if(!r.ok)throw new Error(`${ameba}: ${r.status}`);let posts=parseRSS(await r.text(),groupId,group);if(!posts.length)throw new Error(`${ameba}: empty feed`);return {ameba,posts}}
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
      member,memberColor:'#A0A0A8',title:'Hello! Project 研修生リハーサル日記',
      date:`${dm[1]}-${dm[2]}-${dm[3]}T12:00:00+09:00`,url,image:''
    });
  }
  return out;
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
  if(member) filtered=filtered.filter(p=>p.member===member);

  const total=filtered.length;
  const page=filtered.slice(offset,offset+limit);

  // Critical structural change: only articles returned on THIS page are enriched.
  // RSS/Kenshusei index requests (~15) + at most 20 article requests stay below
  // the Workers Free external-subrequest ceiling.
  await enrichMissingImages(page);

  return new Response(JSON.stringify({
    posts:page,total,offset,limit,hasMore:offset+page.length<total,
    groupCounts,sources,updatedAt:new Date().toISOString(),
    source:'official-ameba-rss-and-kenshusei',elapsedMs:Date.now()-started
  }),{headers:{...cors(),'content-type':'application/json;charset=utf-8','cache-control':'no-store'}});
}
function cors(){return {'access-control-allow-origin':'*','access-control-allow-methods':'GET,OPTIONS'}}
export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname === '/api/posts') {
      try { return await handler(request); }
      catch (error) {
        return new Response(JSON.stringify({ posts: [], error: 'feed_fetch_failed' }), {
          status: 502,
          headers: { ...cors(), 'content-type': 'application/json;charset=utf-8', 'cache-control': 'no-store' }
        });
      }
    }
    return env.ASSETS.fetch(request);
  }
};
