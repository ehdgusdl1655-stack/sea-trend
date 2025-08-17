const KEY='seatrend_products_v2'; const KCONS='seatrend_consult_url';
let editingId=null;
function $(id){return document.getElementById(id)}; function load(){return JSON.parse(localStorage.getItem(KEY)||'[]')}; function save(a){localStorage.setItem(KEY,JSON.stringify(a))};
function fmt(n){ if(n===undefined||n===null||n==='') return ''; return Number(n).toLocaleString(); }
function refreshTable(){
  const tbody=document.querySelector('#productTable tbody'); const arr=load().sort((a,b)=>(a.rank||999)-(b.rank||999));
  tbody.innerHTML='';
  arr.forEach(p=>{
    const tr=document.createElement('tr');
    tr.innerHTML=`<td>${p.rank||''}</td>
      <td><img src="${p.image_url||''}" alt=""></td>
      <td>${p.name||''}</td>
      <td>${p.country||''}</td>
      <td>${p.category||''}</td>
      <td>${fmt(p.local_price)} ${p.currency||''}</td>
      <td>${(p.hot||p.steady)?'블라인드':'공개'}</td>
      <td>${p.tags||''}</td>
      <td>${p.hot?'HOT ':''}${p.steady?'STEADY':''}</td>
      <td><button class="btn btn-outline" data-act="edit" data-id="${p.id}">수정</button>
          <button class="btn btn-danger" data-act="del" data-id="${p.id}">삭제</button></td>`;
    tbody.appendChild(tr);
  });
}
function toForm(p){
  $('rank').value=p.rank||''; $('name').value=p.name||''; $('image_url').value=p.image_url||''; $('country').value=p.country||'';
  $('category').value=p.category||'Beauty'; $('local_price').value=p.local_price||''; $('currency').value=p.currency||'THB';
  $('coupang_price').value=p.coupang_price||''; $('coupang_url').value=p.coupang_url||''; $('naver_price').value=p.naver_price||''; $('naver_url').value=p.naver_url||'';
  $('other_label').value=p.other_label||'올리브영'; $('other_price').value=p.other_price||''; $('other_url').value=p.other_url||'';
  $('visibility').value=p.visibility||'public'; $('tags').value=p.tags||''; $('desc').value=p.desc||''; $('hot').checked=!!p.hot; $('steady').checked=!!p.steady;
  previewImage();
}
function fromForm(){
  const rank=parseInt($('rank').value||''); let visibility=$('visibility').value; const hot=$('hot').checked; const steady=$('steady').checked;
  if(hot||steady){ visibility='subscriber'; }
  return { id: editingId||crypto.randomUUID(), rank:isNaN(rank)?null:rank, name:$('name').value.trim(), image_url:$('image_url').value.trim(),
    country:$('country').value.trim(), category:$('category').value, local_price:Number($('local_price').value||0), currency:$('currency').value,
    coupang_price:$('coupang_price').value?Number($('coupang_price').value):'', coupang_url:$('coupang_url').value.trim(),
    naver_price:$('naver_price').value?Number($('naver_price').value):'', naver_url:$('naver_url').value.trim(),
    other_label:$('other_label').value.trim()||'타사', other_price:$('other_price').value?Number($('other_price').value):'', other_url:$('other_url').value.trim(),
    visibility, tags:$('tags').value.trim(), desc:$('desc').value.trim(), hot, steady };
}
function resetForm(){ editingId=null; $('productForm').reset(); $('category').value='Beauty'; $('currency').value='THB'; $('other_label').value='올리브영'; $('imgPreview').src=''; $('imgStatus').textContent=''; }
function previewImage(){ const url=$('image_url').value.trim(); const img=$('imgPreview'); const st=$('imgStatus'); if(!url){img.src='';st.textContent='';return}
  img.onload=()=>{st.textContent='이미지 로드 성공'; st.style.color='#16a34a'}; img.onerror=()=>{st.textContent='이미지 로드 실패 (URL 확인)'; st.style.color='#ef4444'}; img.src=url; }
function handleSubmit(e){ e.preventDefault(); const p=fromForm(); if(p.rank && p.rank<=13 && !(p.hot||p.steady)){ p.visibility='public'; }
  const arr=load(); const idx=arr.findIndex(x=>x.id===p.id); if(idx>=0){arr[idx]=p}else{arr.push(p)}; save(arr); resetForm(); refreshTable(); alert('저장 완료! 회원 페이지에 즉시 반영됩니다.'); }
function handleTableClick(e){ const act=e.target.getAttribute('data-act'); const id=e.target.getAttribute('data-id'); if(!act||!id)return; const arr=load(); const idx=arr.findIndex(x=>x.id===id); if(idx<0)return;
  if(act==='edit'){ editingId=id; toForm(arr[idx]); window.scrollTo({top:0,behavior:'smooth'}); } else if(act==='del'){ if(confirm('삭제하시겠어요?')){ arr.splice(idx,1); save(arr); refreshTable(); } } }
function importCsv(){ const file=$('csvFile').files[0]; if(!file){alert('CSV 파일을 선택하세요'); return;} const reader=new FileReader();
  reader.onload=()=>{ const text=reader.result.trim(); const rows=text.split(/\r?\n/).filter(Boolean); const header=rows.shift().split(',').map(h=>h.trim()); const map={}; header.forEach((h,i)=> map[h]=i);
    const arr=load(); rows.forEach(line=>{ const c=line.split(',').map(x=>x.trim()); const o={ id:crypto.randomUUID(),
      rank:c[map.rank]?Number(c[map.rank]):null, name:c[map.name]||'', image_url:c[map.image_url]||'', country:c[map.country]||'',
      category:c[map.category]||'Beauty', local_price: c[map.local_price]?Number(c[map.local_price]):0, currency:c[map.currency]||'THB',
      coupang_price:c[map.coupang_price]?Number(c[map.coupang_price]):'', coupang_url:c[map.coupang_url]||'',
      naver_price:c[map.naver_price]?Number(c[map.naver_price]):'', naver_url:c[map.naver_url]||'',
      other_label:c[map.other_label]||'타사', other_price:c[map.other_price]?Number(c[map.other_price]):'', other_url:c[map.other_url]||'',
      visibility:(c[map.visibility]||'public'), hot:(c[map.hot]||'').toLowerCase()==='true', steady:(c[map.steady]||'').toLowerCase()==='true',
      desc:c[map.desc]||'', tags:c[map.tags]||'' };
      if(o.hot||o.steady) o.visibility='subscriber'; if(o.rank && o.rank<=13 && !(o.hot||o.steady)) o.visibility='public'; arr.push(o); });
    save(arr); refreshTable(); alert('CSV 업로드 완료!'); }; reader.readAsText(file,'utf-8'); }
function saveConsult(){ const u=$('consultUrl').value.trim(); localStorage.setItem(KCONS,u); alert('문의 URL 저장'); }
window.addEventListener('DOMContentLoaded',()=>{ $('productForm').addEventListener('submit',handleSubmit); $('resetForm').addEventListener('click',resetForm);
  $('image_url').addEventListener('input',previewImage); document.getElementById('productTable').addEventListener('click',handleTableClick);
  document.getElementById('importCsv').addEventListener('click',importCsv); document.getElementById('saveConsult').addEventListener('click',saveConsult); refreshTable(); });
