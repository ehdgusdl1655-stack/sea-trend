(function(){
  const KEY='seatrend_products_v2';
  if(!localStorage.getItem(KEY)){
    const sample=[
      { id: crypto.randomUUID(), rank:1, name:'TIRTIR Mask Fit Red Cushion',
        image_url:'https://img.oliveyoung.co.kr/uploads/images/goods/550/10/0000/0015/A00000015931506ko.jpg',
        country:'TH,PH', category:'Beauty', local_price:1200, currency:'THB',
        coupang_price:'', coupang_url:'', naver_price:'', naver_url:'',
        other_label:'올리브영', other_price:'', other_url:'',
        tags:'주문량 많음, 재고 확보 필요', desc:'커버력/지속력으로 유명한 쿠션',
        visibility:'public', hot:true, steady:false },
      { id: crypto.randomUUID(), rank:2, name:'COSRX Snail 96 Mucin Essence',
        image_url:'https://img.oliveyoung.co.kr/uploads/images/goods/550/10/0000/0015/A00000015930404ko.jpg',
        country:'TH,MY,PH', category:'Beauty', local_price:820, currency:'THB',
        coupang_price:'', coupang_url:'', naver_price:'', naver_url:'',
        other_label:'올리브영', other_price:'', other_url:'',
        tags:'가성비', desc:'점액 성분 에센스, 동남아에서 스테디셀러',
        visibility:'public', hot:false, steady:true },
      { id: crypto.randomUUID(), rank:3, name:'Beauty of Joseon Relief Sun',
        image_url:'https://img.oliveyoung.co.kr/uploads/images/goods/550/10/0000/0015/A00000015931814ko.jpg',
        country:'TH,MY,SG', category:'Beauty', local_price:900, currency:'THB',
        coupang_price:'', coupang_url:'', naver_price:'', naver_url:'',
        other_label:'올리브영', other_price:'', other_url:'',
        tags:'급상승', desc:'가볍고 백탁 적어 SNS 바이럴 지속',
        visibility:'public', hot:true, steady:false }
    ];
    localStorage.setItem(KEY, JSON.stringify(sample));
  }
})();