
const listEl = document.getElementById('list');
const unlockToggle = document.getElementById('unlockToggle');
const refreshBtn = document.getElementById('refresh');
const countrySel = document.getElementById('country');
const categorySel = document.getElementById('category');

async function loadData() {
  const country = countrySel.value;
  const category = categorySel.value;
  const resp = await fetch('data.json?ts=' + Date.now());
  const all = await resp.json();

  const items = (all[country] && all[country][category]) ? all[country][category] : [];
  render(items);
}

function render(items){
  if(!Array.isArray(items) || items.length === 0){
    listEl.innerHTML = '<p style="opacity:.8">데이터가 없습니다. 관리자에서 업로드하세요.</p>';
    return;
  }
  const grid = document.createElement('div');
  grid.className = 'grid';

  // Sort by rank just in case
  items.sort((a,b)=> a.rank - b.rank);

  items.forEach(it => {
    const card = document.createElement('div');
    card.className = 'card';

    const r = document.createElement('div');
    r.className = 'rank';
    r.textContent = `#${it.rank}`;
    card.appendChild(r);

    const title = document.createElement('div');
    title.className = 'title';
    title.textContent = it.name;
    card.appendChild(title);

    const meta = document.createElement('div');
    meta.className = 'meta';
    meta.innerHTML = `<span>${it.category}</span> · <span>${it.why}</span>`;
    card.appendChild(meta);

    const badges = document.createElement('div');
    badges.className = 'badges';
    if (it.margin_note) {
      const b = document.createElement('span');
      b.className = 'badge';
      b.textContent = `마진: ${it.margin_note}`;
      badges.appendChild(b);
    }
    if (it.risk) {
      const b2 = document.createElement('span');
      b2.className = 'badge';
      b2.textContent = `리스크: ${it.risk}`;
      badges.appendChild(b2);
    }
    card.appendChild(badges);

    const pricebox = document.createElement('div');
    pricebox.className = 'pricebox';
    const p1 = document.createElement('div');
    p1.className = 'price';
    p1.innerHTML = `<strong>해외가</strong>${it.overseas_price || '-'}<br><a href="${it.overseas_link||'#'}" target="_blank">참고 링크</a>`;
    const p2 = document.createElement('div');
    p2.className = 'price';
    p2.innerHTML = `<strong>국내 최저가</strong>${it.kr_price || '-'}<br><a href="${it.kr_link||'#'}" target="_blank">구매 링크</a>`;
    pricebox.appendChild(p1);
    pricebox.appendChild(p2);
    card.appendChild(pricebox);

    // Lock top 5 when not unlocked
    if(!unlockToggle.checked && it.rank <= 5){
      const lock = document.createElement('div');
      lock.className = 'lock';
      lock.innerHTML = `<span>유료 구독 시 열람 가능 (#${it.rank})</span>`;
      card.appendChild(lock);
    }

    grid.appendChild(card);
  });

  listEl.innerHTML = '';
  listEl.appendChild(grid);
}

refreshBtn.addEventListener('click', loadData);
unlockToggle.addEventListener('change', loadData);
countrySel.addEventListener('change', loadData);
categorySel.addEventListener('change', loadData);

// initial
loadData();
