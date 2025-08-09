
const countries = ["TH","PH","MY","ID","VN","SG","TW"];
const countrySel = document.getElementById('country');
const refreshBtn = document.getElementById('refresh');
const asOf = document.getElementById('asOf');
const topEl = document.getElementById('top');
const risingEl = document.getElementById('rising');
const ninjaEl = document.getElementById('ninja');
countries.forEach(c=>{const o=document.createElement('option');o.value=c;o.textContent=c;countrySel.appendChild(o);});
countrySel.value="TH";

function copyText(txt){
  navigator.clipboard.writeText(txt).then(()=>{
    alert('복사 완료!');
  }).catch(()=>alert('복사 실패'));
}

function esc(s){return (s||'').replace(/[&<>"]/g, m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[m]));}

function cardHTML(it){
  const textForCopy = `상품명: ${it.name}
카테고리: ${it.category}
해외가: ${it.overseas_price} (${it.overseas_link||''})
국내가: ${it.kr_price} (${it.kr_link||''})
마진: ${it.margin_note||''}
비고: ${it.risk||''}`;
  return `
  <article class="card">
    <img class="thumb" src="${esc(it.image_url) || 'https://via.placeholder.com/640x480?text=Product'}" alt="">
    <div class="rank">#${it.rank}</div>
    <button class="btn copy" onclick='copyText(${JSON.stringify(textForCopy)})'>복사</button>
    <div class="body">
      <div class="title">${esc(it.name)}</div>
      <div class="meta">${esc(it.category)} · ${esc(it.why||'')}</div>
      <div class="rows">
        <div class="row"><strong>해외가</strong><div class="price">${esc(it.overseas_price||'-')}</div><a class="link" href="${esc(it.overseas_link||'#')}" target="_blank">상세보기</a></div>
        <div class="row"><strong>국내 최저가</strong><div class="price">${esc(it.kr_price||'-')}</div><a class="link" href="${esc(it.kr_link||'#')}" target="_blank">구매 링크</a></div>
      </div>
      <div class="badges">
        ${it.group ? `<span class="badge tag">${esc(it.group)}</span>` : ''}
        ${it.margin_note ? `<span class="badge">마진 ${esc(it.margin_note)}</span>` : ''}
        ${it.risk ? `<span class="badge">주의 ${esc(it.risk)}</span>` : ''}
      </div>
    </div>
  </article>`;
}

async function load(){
  const c = countrySel.value;
  try{
    const j = await fetch(`data/${c}.json?ts=`+Date.now()).then(r=>r.json());
    asOf.textContent = j.updated_at || '-';
    const top = (j.top10||[]).sort((a,b)=>a.rank-b.rank);
    const rising = (j.rising5||[]).sort((a,b)=>a.rank-b.rank);
    const ninja = (j.ninja5||[]).sort((a,b)=>a.rank-b.rank);
    topEl.innerHTML = top.map(cardHTML).join('');
    risingEl.innerHTML = rising.map(cardHTML).join('');
    ninjaEl.innerHTML = ninja.map(cardHTML).join('');
  }catch(e){
    topEl.innerHTML = '<div class="card"><div class="body">데이터 없음</div></div>';
    risingEl.innerHTML = '';
    ninjaEl.innerHTML = '';
  }
}
refreshBtn.addEventListener('click', load);
countrySel.addEventListener('change', load);
load();
