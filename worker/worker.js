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
  ['beyooooonds','BEYOOOOONDS','beyooooonds-seasoning'],
  ['beyooooonds','BEYOOOOONDS','beyooooonds'],
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
function imageFrom(html=''){let m=decode(html).match(/<img[^>]+(?:data-src|src)=["']([^"']+)["']/i);return m?m[1].replace(/^http:/,'https:'):''}
function parseRSS(xml,groupId,group){let items=xml.match(/<item\b[\s\S]*?<\/item>/gi)||[];return items.map(b=>{let title=text(tag(b,'title')),url=text(tag(b,'link')),desc=tag(b,'description')||tag(b,'content:encoded'),member=memberFrom(title,desc)||group;let d=tag(b,'pubDate');return {id:url||tag(b,'guid'),groupId,group,member,memberColor:COLORS[member]||'#A0A0A8',title:title.replace(new RegExp(`\\s*[｜|]?\\s*${member}\\s*$`),'').trim()||title,date:new Date(d).toISOString(),url,image:imageFrom(desc)}}).filter(x=>x.url&&x.date)}
async function fetchBlog(src){let [groupId,group,ameba]=src;let url=`https://rssblog.ameba.jp/${ameba}/rss20.xml`;let r=await fetch(url,{headers:{'User-Agent':'Mozilla/5.0 (compatible; HelloProBlog/0.2)'}});if(!r.ok)throw new Error(`${ameba}: ${r.status}`);return parseRSS(await r.text(),groupId,group)}
function parseKenshu(html){let out=[],re=/<a[^>]+href=["']([^"']+)["'][^>]*>([\s\S]*?研修生リハーサル日記[\s\S]*?)<\/a>/gi,m;while((m=re.exec(html))){let t=text(m[2]),dm=t.match(/(20\d{2})[.\/-](\d{2})[.\/-](\d{2})\s+(.+)$/);if(!dm)continue;let url=new URL(m[1],'https://www.upfc.jp').href,member=dm[4].trim();out.push({id:url,groupId:'kenshusei',group:'ハロプロ研修生',member,memberColor:'#A0A0A8',title:'Hello! Project 研修生リハーサル日記',date:`${dm[1]}-${dm[2]}-${dm[3]}T12:00:00+09:00`,url,image:''})}return out}
async function getPosts(){let settled=await Promise.allSettled(BLOGS.map(fetchBlog));let posts=settled.flatMap(x=>x.status==='fulfilled'?x.value:[]);try{let r=await fetch('https://www.upfc.jp/helloproject/artist/trcontents_list.php?%40rst=all&%40uid=KENSYUSEI',{headers:{'User-Agent':'Mozilla/5.0'}});if(r.ok)posts.push(...parseKenshu(await r.text()))}catch(e){}
 let cutoff=Date.now()-30*864e5,seen=new Set();return posts.filter(p=>new Date(p.date).getTime()>=cutoff).sort((a,b)=>new Date(b.date)-new Date(a.date)).filter(p=>!seen.has(p.id)&&seen.add(p.id));}
async function handler(req){if(req.method==='OPTIONS')return new Response(null,{headers:cors()});let posts=await getPosts();return new Response(JSON.stringify({posts,updatedAt:new Date().toISOString(),source:'official-blog-feeds'}),{headers:{...cors(),'content-type':'application/json;charset=utf-8','cache-control':'public,max-age=300'}})}
function cors(){return {'access-control-allow-origin':'*','access-control-allow-methods':'GET,OPTIONS'}}
export default {fetch:handler};
