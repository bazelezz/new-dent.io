const services = {
  therapy:{title:'Лечение и сохранение зубов',description:'Сохраняем собственные зубы и восстанавливаем их анатомическую форму. План лечения зависит от глубины поражения и состояния тканей.',items:['Лечение поверхностного, среднего и глубокого кариеса','Неинвазивное лечение начального кариеса по технологии ICON — по показаниям','Лечение каналов при пульпите и периодонтите','Повторное эндодонтическое лечение и распломбировка каналов','Художественная реставрация зубов']},
  implant:{title:'Имплантация зубов',description:'Восстановление одного или нескольких утраченных зубов. Начинаем с диагностики, оценки состояния костной ткани и обсуждения будущего протезирования.',items:['Классическая двухэтапная имплантация','Одномоментная имплантация после удаления — по показаниям','Подготовка костной ткани к установке имплантата','Одиночные коронки и протезирование на имплантатах','Обсуждение вариантов полного восстановления зубного ряда']},
  ortho:{title:'Брекеты и элайнеры',description:'Исправление положения зубов и прикуса у взрослых и детей. Метод лечения подбирается с учётом диагностики, возраста и вашей клинической ситуации.',items:['Диагностика прикуса и планирование лечения','Металлические и эстетические брекет-системы','Классические и самолигирующие брекеты','Лечение на прозрачных элайнерах','Детская ортодонтия: пластинки и другие съёмные аппараты']},
  prosthetics:{title:'Протезирование и эстетика',description:'Восстанавливаем форму, функцию и внешний вид зубов. Материал и конструкция подбираются индивидуально.',items:['Металлокерамические коронки и мостовидные протезы','Коронки из диоксида циркония и керамики E.max','Керамические виниры и вкладки Inlay / Onlay','Одиночные коронки и протезы на имплантатах','Частичные и полные съёмные протезы, бюгельные конструкции']},
  surgery:{title:'Хирургическая стоматология',description:'Хирургическая помощь и подготовка к восстановлению зубов. Объём вмешательства определяется после осмотра и изучения снимков.',items:['Простое и сложное удаление зубов','Удаление ретинированных и дистопированных зубов мудрости','Зубосохраняющие операции — по показаниям','Костная пластика и синус-лифтинг','Пластика уздечек и другие вмешательства на мягких тканях']},
  hygiene:{title:'Гигиена и эстетика улыбки',description:'Профессиональный уход помогает удалить налёт и зубные отложения. Состав комплекса и необходимость дополнительных процедур определяет врач.',items:['Удаление зубного камня ультразвуком','Удаление пигментированного налёта Air Flow','Полировка поверхности зубов','Фторирование и уход при чувствительности — по показаниям','Консультация по кабинетному отбеливанию и домашнему уходу']},
  diagnostics:{title:'Цифровая диагностика',description:'Снимки помогают врачу оценить состояние зубов и окружающих тканей и составить план лечения. Вид исследования назначается по показаниям.',items:['Компьютерная томография: трёхмерное исследование','Оценка объёма и состояния костной ткани перед имплантацией','Изучение анатомии корневых каналов','Прицельные цифровые снимки зубов','Контроль отдельных этапов лечения']}
};
const dialog=document.querySelector('#service-dialog');
document.querySelectorAll('[data-service]').forEach(button=>button.addEventListener('click',()=>{
  const service=services[button.dataset.service];
  document.querySelector('#dialog-title').textContent=service.title;
  document.querySelector('#dialog-description').textContent=service.description;
  document.querySelector('#dialog-list').replaceChildren(...service.items.map(text=>{const item=document.createElement('li');item.textContent=text;return item}));
  dialog.showModal();document.body.classList.add('locked');
}));
document.querySelector('.dialog-close').addEventListener('click',()=>dialog.close());
dialog.addEventListener('click',event=>{if(event.target===dialog){const box=dialog.getBoundingClientRect();if(event.clientX<box.left||event.clientX>box.right||event.clientY<box.top||event.clientY>box.bottom)dialog.close()}});
dialog.addEventListener('close',()=>document.body.classList.remove('locked'));
const menuButton=document.querySelector('.menu-toggle'),menu=document.querySelector('#mobile-nav');
menuButton.addEventListener('click',()=>{const open=menuButton.getAttribute('aria-expanded')!=='true';menuButton.setAttribute('aria-expanded',String(open));menuButton.setAttribute('aria-label',open?'Закрыть меню':'Открыть меню');menu.hidden=!open});
function closeMenu(){menu.hidden=true;menuButton.setAttribute('aria-expanded','false');menuButton.setAttribute('aria-label','Открыть меню')}
menu.querySelectorAll('a').forEach(link=>link.addEventListener('click',closeMenu));
document.addEventListener('keydown',event=>{if(event.key==='Escape')closeMenu()});
window.matchMedia('(min-width:951px)').addEventListener('change',event=>{if(event.matches)closeMenu()});
document.querySelector('#year').textContent=new Date().getFullYear();

// Preview only: no network requests, storage, form submission or appointment creation.
const dateOptions=document.querySelector('#date-options');
const moscowDate=new Intl.DateTimeFormat('en-CA',{timeZone:'Europe/Moscow',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date());
const dateBase=new Date(moscowDate+'T12:00:00Z');
const formatDate=(date,options)=>new Intl.DateTimeFormat('ru-RU',{timeZone:'UTC',...options}).format(date);
const bookingDates=Array.from({length:6},(_,index)=>{const date=new Date(dateBase);date.setUTCDate(date.getUTCDate()+index+1);return date});
bookingDates.forEach((date,index)=>{const label=document.createElement('label');const input=document.createElement('input');input.type='radio';input.name='visit-date';input.value=String(index);input.checked=index===0;input.setAttribute('aria-label',formatDate(date,{day:'numeric',month:'long',weekday:'long',year:'numeric'}));const tile=document.createElement('span');const weekday=document.createElement('small');weekday.textContent=formatDate(date,{weekday:'short'});const day=document.createElement('b');day.textContent=formatDate(date,{day:'numeric'});tile.append(weekday,day);label.append(input,tile);dateOptions.append(label)});
const firstMonth=formatDate(bookingDates[0],{month:'long'}),lastMonth=formatDate(bookingDates[5],{month:'long'});
document.querySelector('#booking-month').textContent=firstMonth===lastMonth?firstMonth:firstMonth+' / '+lastMonth;
const bookingSelection=()=>({date:bookingDates[Number(document.querySelector('input[name="visit-date"]:checked').value)],time:document.querySelector('input[name="visit-time"]:checked').value,service:document.querySelector('#booking-service').value});
function updateBooking(){const {date,time,service}=bookingSelection();document.querySelector('#card-day').textContent=formatDate(date,{day:'numeric'});document.querySelector('#card-month').textContent=formatDate(date,{day:'numeric',month:'long'}).replace(/^\d+\s/,'');document.querySelector('#card-weekday').textContent=formatDate(date,{weekday:'long'});document.querySelector('#card-time').textContent=time;document.querySelector('#card-service').textContent=service;document.querySelector('#booking-feedback').hidden=true}
document.querySelector('.booking-panel').addEventListener('change',updateBooking);
document.querySelectorAll('.booking-person input').forEach(input=>input.addEventListener('input',()=>{document.querySelector('#booking-feedback').hidden=true}));
document.querySelector('#booking-preview').addEventListener('click',()=>{const {date,time,service}=bookingSelection();const name=document.querySelector('#booking-name').value.trim();document.querySelector('#booking-summary').textContent=(name?name+', ваш выбор: ':'Ваш выбор: ')+service.toLowerCase()+', '+formatDate(date,{day:'numeric',month:'long'})+' в '+time+'.';const feedback=document.querySelector('#booking-feedback');feedback.hidden=false;feedback.scrollIntoView({behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth',block:'nearest'})});
updateBooking();

// Sectioned price catalogue: native details and keyboard-accessible tabs.
(() => {
  const tabs = [...document.querySelectorAll('[data-price-category]')];
  const tabList = document.querySelector('.price-category-tabs');
  const verticalLayout = window.matchMedia('(min-width:951px)');
  const updateOrientation = () => tabList.setAttribute('aria-orientation', verticalLayout.matches ? 'vertical' : 'horizontal');
  updateOrientation();
  verticalLayout.addEventListener('change', updateOrientation);
  function selectCategory(category, focus = false) {
    const selected = tabs.find(tab => tab.dataset.priceCategory === category);
    if (!selected) return;
    tabs.forEach(tab => {
      const active = tab === selected;
      tab.setAttribute('aria-selected', String(active));
      tab.tabIndex = active ? 0 : -1;
      document.getElementById(tab.getAttribute('aria-controls')).hidden = !active;
    });
    if (focus) selected.focus();
  }
  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => selectCategory(tab.dataset.priceCategory));
    tab.addEventListener('keydown', event => {
      let target;
      if (event.key === 'ArrowRight' || event.key === 'ArrowDown') target = (index + 1) % tabs.length;
      if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') target = (index + tabs.length - 1) % tabs.length;
      if (event.key === 'Home') target = 0;
      if (event.key === 'End') target = tabs.length - 1;
      if (target !== undefined) { event.preventDefault(); selectCategory(tabs[target].dataset.priceCategory, true); }
    });
  });
  const categoryForService = {therapy:'therapy',hygiene:'therapy',diagnostics:'therapy',surgery:'surgery',implant:'surgery',prosthetics:'orthopedics',ortho:'orthodontics'};
  const priceLink = document.querySelector('.dialog-price-link');
  document.querySelectorAll('[data-service]').forEach(button => {
    button.addEventListener('click', () => { priceLink.dataset.category = categoryForService[button.dataset.service]; });
  });
  priceLink.addEventListener('click', () => {
    dialog.close();
    selectCategory(priceLink.dataset.category || 'therapy');
  });
})();


// Manual team carousel: buttons, keyboard and native touch scrolling.
(() => {
  const track = document.querySelector('#staff-track');
  const cards = [...track.querySelectorAll('.staff-card')];
  const previous = document.querySelector('[data-staff-prev]');
  const next = document.querySelector('[data-staff-next]');
  const counter = document.querySelector('.staff-counter');
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const position = card => card.offsetLeft - cards[0].offsetLeft;
  const maximum = () => Math.max(0, track.scrollWidth - track.clientWidth);
  const scrollTo = left => track.scrollTo({left:Math.max(0, Math.min(maximum(), left)), behavior:motion.matches ? 'instant' : 'smooth'});
  function currentIndex() {
    return cards.reduce((best, card, index) => Math.abs(position(card) - track.scrollLeft) < Math.abs(position(cards[best]) - track.scrollLeft) ? index : best, 0);
  }
  function move(direction) { scrollTo(position(cards[Math.max(0, Math.min(cards.length - 1, currentIndex() + direction))])); }
  function update() {
    previous.disabled = track.scrollLeft < 2;
    next.disabled = track.scrollLeft >= maximum() - 2;
    const bounds = track.getBoundingClientRect();
    const visible = cards.map((card, index) => {
      const box = card.getBoundingClientRect();
      return {index, fraction:Math.max(0, Math.min(bounds.right, box.right) - Math.max(bounds.left, box.left)) / box.width};
    }).filter(card => card.fraction > .65).map(card => card.index + 1);
    const first = visible[0] || currentIndex() + 1;
    const last = visible.at(-1) || first;
    const label = `${first}${last === first ? '' : '–' + last} из ${cards.length}`;
    if (counter.textContent !== label) counter.textContent = label;
  }
  previous.addEventListener('click', () => move(-1));
  next.addEventListener('click', () => move(1));
  track.addEventListener('keydown', event => {
    if (event.target !== track) return;
    if (event.key === 'ArrowRight') { event.preventDefault(); move(1); }
    if (event.key === 'ArrowLeft') { event.preventDefault(); move(-1); }
    if (event.key === 'Home') { event.preventDefault(); scrollTo(0); }
    if (event.key === 'End') { event.preventDefault(); scrollTo(maximum()); }
  });
  track.addEventListener('focusin', event => {
    const card = event.target.closest('.staff-card');
    if (!card) return;
    const bounds = track.getBoundingClientRect(), box = card.getBoundingClientRect();
    if (box.left < bounds.left - 1 || box.right > bounds.right + 1) scrollTo(position(card));
  });
  let frame;
  track.addEventListener('scroll', () => { cancelAnimationFrame(frame); frame = requestAnimationFrame(update); }, {passive:true});
  new ResizeObserver(update).observe(track);
  update();
})();

