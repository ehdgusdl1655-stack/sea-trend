
const listEl = document.getElementById('list');
const unlockToggle = document.getElementById('unlockToggle');
const refreshBtn = document.getElementById('refresh');
const countrySel = document.getElementById('country');
const categorySel = document.getElementById('category');

async function loadData() {
  const country = countrySel.value;
  const category = categorySel.value;
  try{
    const resp = await fetch('data.json?ts=' + Date.now());
    const all = await resp.json();
    const items = (all[country] && all[country][category]) ? all[country][category] : [];
    render(items);
  }catch(e){
    listEl.innerHTML = '<div class="card"><div class="body">data.json을 불러오지 못했습니다.</div></div>';
  }
}

function escapeHtml(str){
  return (str||'').replace(/[&<>"]/g, s => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[s]));
}

function render(items){
  if(!Array.isArray(items) || items.length === 0){
    listEl.innerHTML = '<div class="card"><div class="body">데이터가 없습니다. 관리자(admin.html)에서 data.json을 수정해 업로드하세요.</div></div>';
    return;
  }
  items.sort((a,b)=> a.rank - b.rank);
  listEl.innerHTML = '';
  items.forEach(it => {
    const card = document.createElement('article');
    card.className = 'card';

    const img = document.createElement('img');
    img.className = 'thumb';
    img.alt = it.name || '';
    img.src = it.image_url || 'https://via.placeholder.com/640x480?text=Product';
    card.appendChild(img);

    const rank = document.createElement('div');
    rank.className = 'rank';
    rank.textContent = `#${it.rank}`;
    card.appendChild(rank);

    const body = document.createElement('div');
    body.className = 'body';

    const title = document.createElement('div');
    title.className = 'title';
    title.textContent = it.name;
    body.appendChild(title);

    const meta = document.createElement('div');
    meta.className = 'meta';
    meta.textContent = `${it.category} · ${it.why || ''}`;
    body.appendChild(meta);

    const rows = document.createElement('div');
    rows.className = 'rows';
    rows.innerHTML = `
      <div class="row"><strong>해외가</strong><span class="price">${escapeHtml(it.overseas_price||'-')}</span><br><a class="link" href="${it.overseas_link||'#'}" target="_blank">상세보기</a></div>
      <div class="row"><strong>국내 최저가</strong><span class="price">${escapeHtml(it.kr_price||'-')}</span><br><a class="link" href="${it.kr_link||'#'}" target="_blank">구매 링크</a></div>
    `;
    body.appendChild(rows);

    const badges = document.createElement('div');
    badges.className = 'badges';
    if (it.margin_note) badges.innerHTML += `<span class="badge good">마진: ${escapeHtml(it.margin_note)}</span>`;
    if (it.risk) badges.innerHTML += `<span class="badge warn">주의: ${escapeHtml(it.risk)}</span>`;
    body.appendChild(badges);

    card.appendChild(body);

    // Lock top 5
    if(!unlockToggle.checked && it.rank <= 5){
      const lock = document.createElement('div');
      lock.className = 'lock';
      lock.innerHTML = `<div>유료 구독 시 열람 가능 (#${it.rank})</div>`;
      card.appendChild(lock);
    }

    listEl.appendChild(card);
  });
}

refreshBtn.addEventListener('click', loadData);
unlockToggle.addEventListener('change', loadData);
countrySel.addEventListener('change', loadData);
categorySel.addEventListener('change', loadData);

loadData();
