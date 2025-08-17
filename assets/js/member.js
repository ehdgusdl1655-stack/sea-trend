const KEY='seatrend_products_v2'; const KCONS='seatrend_consult_url';
function fmt(n){ if(n===undefined||n===null||n==='') return '-'; return Number(n).toLocaleString(); }
function mkBadge(label, price, url){
  const a = document.createElement(url?'a':'span');
  a.className = 'badge' + (url?' link':'');
  if(url){ a.href=url; a.target='_blank'; }
  a.textContent = `${label}: ${price? fmt(price)+'원' : (url?'바로가기':'—')}`;
  return a;
}
function render(){
  const list = JSON.parse(localStorage.getItem(KEY) || '[]').sort((a,b)=> (a.rank||999)-(b.rank||999));
  const grid = document.getElementById('productGrid');
  grid.innerHTML='';
  list.forEach(p=>{
    const blind = (p.hot||p.steady) || p.visibility==='subscriber';
    const card = document.createElement('article');
    card.className = 'card product' + (blind?' blind':'');

    const status = document.createElement('div'); status.className='status';
    if(p.hot){ const s=document.createElement('span'); s.className='pill hot'; s.textContent='인기 급상승'; status.appendChild(s); }
    if(p.steady){ const s=document.createElement('span'); s.className='pill steady'; s.textContent='효자 상품'; status.appendChild(s); }
    card.appendChild(status);

    const imgWrap = document.createElement('div'); imgWrap.className='imgwrap';
    const img = new Image(); img.src=p.image_url; img.alt=p.name; imgWrap.appendChild(img); card.appendChild(imgWrap);

    const h3 = document.createElement('h3'); h3.textContent = `${p.rank?('#'+p.rank+' '):''}${p.name}`; card.appendChild(h3);

    const labels = document.createElement('div'); labels.className='labels';
    if(p.country){ const t=document.createElement('span'); t.className='tag'; t.textContent=p.country; labels.appendChild(t); }
    if(p.category){ const t=document.createElement('span'); t.className='tag'; t.textContent=p.category; labels.appendChild(t); }
    if(p.tags){ p.tags.split(',').forEach(x=>{ if(x.trim()){ const t=document.createElement('span'); t.className='tag'; t.textContent=x.trim(); labels.appendChild(t); } }); }
    card.appendChild(labels);

    const prices = document.createElement('div'); prices.className='prices';
    const row = document.createElement('div'); row.className='price-row';
    const sea = document.createElement('span'); sea.className='badge'; sea.textContent=`현지가: ${fmt(p.local_price)} ${p.currency||''}`; row.appendChild(sea);
    row.appendChild(mkBadge('쿠팡', p.coupang_price, p.coupang_url));
    row.appendChild(mkBadge('네이버', p.naver_price, p.naver_url));
    row.appendChild(mkBadge(p.other_label||'타사', p.other_price, p.other_url));
    prices.appendChild(row); card.appendChild(prices);

    const desc = document.createElement('div'); desc.className='desc muted'; desc.textContent=p.desc||''; card.appendChild(desc);

    grid.appendChild(card);
  });
}
function hookConsult(){
  const url = localStorage.getItem(KCONS);
  const btn = document.getElementById('consultBtn');
  if(url){ btn.onclick = ()=> window.open(url,'_blank'); } else { btn.disabled=true; btn.title='관리자에서 문의 URL을 설정하세요'; }
}
window.addEventListener('storage', (e)=>{ if(e.key===KEY||e.key===KCONS){ render(); hookConsult(); } });
window.addEventListener('DOMContentLoaded', ()=>{ render(); hookConsult(); });
