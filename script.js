
const MENU = window.MENU_DATA || {};
const phone = '258864992397';
const money = value => `${value.toLocaleString('pt-MZ')} Mts`;
const tabs = document.querySelector('.menu-tabs');
const menuItems = document.querySelector('#menuItems');
const orderList = document.querySelector('#orderList');
const orderTotal = document.querySelector('#orderTotal');
const pedidoField = document.querySelector('#pedidoField');
let activeCategory = Object.keys(MENU)[0];
let order = [];

function renderTabs(){
  tabs.innerHTML = Object.keys(MENU).map(cat => `<button class="tab-btn ${cat===activeCategory?'active':''}" data-cat="${cat}">${cat}</button>`).join('');
}
function renderMenu(){
  const items = MENU[activeCategory] || [];
  menuItems.innerHTML = items.map((item, idx) => {
    const [name, desc, price] = item;
    return `<article class="menu-card">
      <h3>${name}</h3>
      <p>${desc}</p>
      <footer><span class="price">${money(price)}</span><button class="add-btn" data-cat="${activeCategory}" data-idx="${idx}">Adicionar</button></footer>
    </article>`;
  }).join('');
}
function renderOrder(){
  if(!order.length){
    orderList.innerHTML = '<li class="empty">Nenhum item selecionado.</li>';
    orderTotal.textContent = '0 Mts';
    return;
  }
  orderList.innerHTML = order.map((item, idx)=>`<li><span>${item.name}</span><strong>${money(item.price)}</strong><button class="remove" data-remove="${idx}" aria-label="Remover ${item.name}">×</button></li>`).join('');
  orderTotal.textContent = money(order.reduce((sum,item)=>sum+item.price,0));
}
function orderText(){
  if(!order.length) return '';
  const lines = order.map((item, i)=>`${i+1}. ${item.name} — ${money(item.price)}`);
  const total = order.reduce((sum,item)=>sum+item.price,0);
  return `${lines.join('\n')}\nTotal estimado: ${money(total)}`;
}

tabs?.addEventListener('click', e=>{
  const btn = e.target.closest('.tab-btn');
  if(!btn) return;
  activeCategory = btn.dataset.cat;
  renderTabs();
  renderMenu();
});
menuItems?.addEventListener('click', e=>{
  const btn = e.target.closest('.add-btn');
  if(!btn) return;
  const item = MENU[btn.dataset.cat][Number(btn.dataset.idx)];
  order.push({name:item[0], price:item[2]});
  renderOrder();
});
orderList?.addEventListener('click', e=>{
  const btn = e.target.closest('[data-remove]');
  if(!btn) return;
  order.splice(Number(btn.dataset.remove),1);
  renderOrder();
});
document.querySelector('#copyOrder')?.addEventListener('click', ()=>{
  const text = orderText();
  if(text) pedidoField.value = text;
});

document.querySelector('#reservationForm')?.addEventListener('submit', e=>{
  e.preventDefault();
  const data = new FormData(e.currentTarget);
  const msg = `Olá, Fora da Moda. Gostaria de fazer uma reserva.\n\nNome: ${data.get('nome') || ''}\nContacto: ${data.get('contacto') || ''}\nNúmero de pessoas: ${data.get('pessoas') || ''}\nHorário de chegada: ${data.get('horario') || ''}\nTipo de reserva: ${data.get('tipo') || ''}\n\nPedido:\n${data.get('pedido') || 'Ainda não escolhi.'}\n\nObservações:\n${data.get('observacoes') || 'Estou em viagem e gostaria que a comida estivesse pronta quando eu chegar.'}\n\nLocalização do restaurante: https://www.google.com/maps?q=-15.0990278,39.4270278`;
  window.open(`https://wa.me/${phone}?text=${encodeURIComponent(msg)}`, '_blank');
});

const navToggle = document.querySelector('.nav-toggle');
const nav = document.querySelector('.nav');
navToggle?.addEventListener('click',()=>{
  const open = nav.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
});
nav?.addEventListener('click', e=>{
  if(e.target.tagName === 'A') nav.classList.remove('open');
});

const io = new IntersectionObserver(entries=>{
  entries.forEach(entry=>{
    if(entry.isIntersecting){entry.target.classList.add('visible');io.unobserve(entry.target);}
  });
},{threshold:.15});
document.querySelectorAll('.reveal').forEach(el=>io.observe(el));
document.querySelector('#year').textContent = new Date().getFullYear();
renderTabs(); renderMenu(); renderOrder();
