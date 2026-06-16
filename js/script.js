
/* ============================================================
   CATÁLOGO
   ============================================================ */
const catalog = {
  tops: [
    { id:'t1', name:'Polo Negro Básico',  price:'S/ 49',  color:'#2a2a2a', accent:'#555',    type:'tee',    category:'tops' },
    { id:'t2', name:'Polo Blanco Clean',  price:'S/ 49',  color:'#e8e8e8', accent:'#bbb',    type:'tee',    category:'tops' },
    { id:'t3', name:'Polo Esmeralda',     price:'S/ 59',  color:'#00C896', accent:'#009E76', type:'tee',    category:'tops' },
    { id:'t4', name:'Hoodie Grafito',     price:'S/ 129', color:'#2d2d2d', accent:'#555',    type:'hoodie', category:'tops' },
    { id:'t5', name:'Casaca Urban Blue',  price:'S/ 189', color:'#1E6EFF', accent:'#0050D0', type:'jacket', category:'tops' },
    { id:'t6', name:'Polo Rojo Street',   price:'S/ 55',  color:'#dc2626', accent:'#b91c1c', type:'tee',    category:'tops' },
    { id:'t7', name:'Hoodie Dorado',      price:'S/ 139', color:'#F5A623', accent:'#D48B10', type:'hoodie', category:'tops' },
    { id:'t8', name:'Casaca Negra Pro',   price:'S/ 199', color:'#111',    accent:'#333',    type:'jacket', category:'tops' },
  ],
  pants: [
    { id:'p1', name:'Jean Negro Slim',      price:'S/ 89', color:'#1a1a1a', accent:'#444',    type:'slim',   category:'pants' },
    { id:'p2', name:'Jean Azul Classic',    price:'S/ 85', color:'#1e3a5f', accent:'#2a5080', type:'slim',   category:'pants' },
    { id:'p3', name:'Jogger Gris Sport',    price:'S/ 79', color:'#666',    accent:'#999',    type:'jogger', category:'pants' },
    { id:'p4', name:'Cargo Verde Militar',  price:'S/ 99', color:'#3d5a3a', accent:'#5a7a57', type:'cargo',  category:'pants' },
    { id:'p5', name:'Short Negro Training', price:'S/ 59', color:'#222',    accent:'#444',    type:'short',  category:'pants' },
    { id:'p6', name:'Jogger Negro Premium', price:'S/ 89', color:'#111',    accent:'#333',    type:'jogger', category:'pants' },
  ],
  shoes: [
    { id:'s1', name:'Sneaker Blanco Air', price:'S/ 249', color:'#f0f0f0', accent:'#bbb',    sole:'#ddd',    category:'shoes' },
    { id:'s2', name:'Runner Esmeralda',   price:'S/ 299', color:'#111',    accent:'#00C896', sole:'#00C896', category:'shoes' },
    { id:'s3', name:'Urban Black Pro',    price:'S/ 269', color:'#1a1a1a', accent:'#444',    sole:'#222',    category:'shoes' },
    { id:'s4', name:'Wave Blue',          price:'S/ 279', color:'#1E6EFF', accent:'#fff',    sole:'#0050D0', category:'shoes' },
    { id:'s5', name:'High Top Street',    price:'S/ 319', color:'#dc2626', accent:'#fff',    sozle:'#b91c1c', category:'shoes' },
    { id:'s6', name:'Minimal Grey',       price:'S/ 229', color:'#888',    accent:'#bbb',    sole:'#666',    category:'shoes' },
  ]
};

const outfitPresets = [
  { name:'Street Casual',  icon:'zap',     top:'t1', pants:'p1', shoes:'s1', desc:'Look urbano clásico y versátil' },
  { name:'Fresh Runner',   icon:'flame',   top:'t3', pants:'p3', shoes:'s2', desc:'Deportivo con estilo moderno' },
  { name:'Urban Explorer', icon:'compass', top:'t5', pants:'p4', shoes:'s3', desc:'Aventura con actitud' },
];

let currentGender   = 'male';
let currentCategory = 'tops';
let selected = { top: null, pants: null, shoes: null };
let cartData = [];
let charts = {};
let panelOpen = false;
let fontSizeCycle = 0;

/* ── TEMA ── */
function toggleTheme() {
  const html = document.documentElement;
  const isDark = html.getAttribute('data-theme') === 'dark';
  const next = isDark ? 'light' : 'dark';
  html.setAttribute('data-theme', next);
  document.body.setAttribute('data-theme', next);
  const btn = document.getElementById('theme-toggle-btn');
  if (btn) btn.setAttribute('aria-checked', String(!isDark));
  showToast(isDark ? '☀️ Modo día activado' : '🌙 Modo noche activado');
}

/* ── A11Y PANEL ── */
function toggleA11yPanel() {
  panelOpen = !panelOpen;
  const panel = document.getElementById('a11y-panel');
  const fab   = document.getElementById('a11y-fab');
  panel.classList.toggle('open', panelOpen);
  fab.setAttribute('aria-expanded', String(panelOpen));
  if (panelOpen) setTimeout(() => panel.querySelector('.a11y-close-btn')?.focus(), 50);
  else fab.focus();
}

function showToast(msg, dur = 2400) {
  const t = document.getElementById('a11y-toast');
  if (!t) return;
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(t._t);
  t._t = setTimeout(() => t.classList.remove('show'), dur);
}

function toggleXLWidget(btn) {
  const isOn = !btn.classList.contains('off');
  btn.classList.toggle('off', isOn);
  btn.setAttribute('aria-checked', String(!isOn));
  showToast(isOn ? 'Widget tamaño normal' : '📐 Widget grande activado');
}

function a11yAction(action, tile) {
  const isActive = tile.classList.toggle('active');
  tile.setAttribute('aria-pressed', String(isActive));
  const body = document.body;
  const actions = {
    contrast:   ['high-contrast', isActive ? '✓ Alto contraste' : 'Contraste normal'],
    links:      ['highlight-links', isActive ? '✓ Enlaces resaltados' : 'Resaltado off'],
    animations: ['stop-animations', isActive ? '✓ Animaciones detenidas' : 'Animaciones reanudadas'],
    dyslexia:   ['dyslexia-font', isActive ? '✓ Fuente dislexia' : 'Fuente normal'],
    cursor:     ['big-cursor', isActive ? '✓ Cursor grande' : 'Cursor normal'],
    lineheight: ['line-height-xl', isActive ? '✓ Mayor altura de línea' : 'Altura normal'],
    textalign:  ['text-align-left', isActive ? '✓ Texto a la izquierda' : 'Alineación normal'],
    saturation: ['saturate-low', isActive ? '✓ Saturación reducida' : 'Saturación normal'],
    spacing:    ['text-spacing-xl', isActive ? '✓ Mayor espaciado' : 'Espaciado normal'],
  };
  if (actions[action]) {
    body.classList.toggle(actions[action][0], isActive);
    showToast(actions[action][1]);
    return;
  }
  if (action === 'fontsize') {
    fontSizeCycle = (fontSizeCycle + 1) % 4;
    body.classList.remove('text-lg-a11y','text-xl-a11y','text-xxl-a11y');
    const labels = ['Texto normal','✓ Texto grande (A+)','✓ Texto muy grande (A++)','✓ Texto máximo (A+++)'];
    if (fontSizeCycle===1) body.classList.add('text-lg-a11y');
    if (fontSizeCycle===2) body.classList.add('text-xl-a11y');
    if (fontSizeCycle===3) body.classList.add('text-xxl-a11y');
    if (fontSizeCycle===0) { tile.classList.remove('active'); tile.setAttribute('aria-pressed','false'); }
    showToast(labels[fontSizeCycle]);
  }
  if (action === 'read') {
    if (isActive && 'speechSynthesis' in window) {
      const text = document.getElementById('main-content')?.innerText?.slice(0,600) || 'KicksOnFire, probador virtual.';
      const utt = new SpeechSynthesisUtterance(text);
      utt.lang='es-ES'; utt.rate=.88; utt.pitch=1;
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(utt);
      utt.onend=()=>{ tile.classList.remove('active'); tile.setAttribute('aria-pressed','false'); };
      showToast('🔊 Leyendo página...');
    } else { if (window.speechSynthesis) window.speechSynthesis.cancel(); showToast('Lectura detenida'); }
  }
}

function resetAllA11y() {
  ['high-contrast','highlight-links','stop-animations','dyslexia-font','big-cursor',
   'line-height-xl','text-align-left','saturate-low','text-spacing-xl',
   'text-lg-a11y','text-xl-a11y','text-xxl-a11y'].forEach(c=>document.body.classList.remove(c));
  fontSizeCycle = 0;
  document.querySelectorAll('.a11y-tile').forEach(t=>{ t.classList.remove('active'); t.setAttribute('aria-pressed','false'); });
  if (window.speechSynthesis) window.speechSynthesis.cancel();
  showToast('✓ Configuración restaurada');
}

function showA11yProfiles() {
  showToast('📋 Perfiles: Motor · Visual · Cognitivo · Auditivo');
}

document.addEventListener('keydown', e => {
  if (e.ctrlKey && e.key==='u') { e.preventDefault(); toggleA11yPanel(); }
  if (e.key==='Escape' && panelOpen) toggleA11yPanel();
});

/* ── GÉNERO ── */
function setGender(g) {
  currentGender = g;
  ['male','female'].forEach(x => {
    const btn = document.getElementById('btn-'+x);
    if (!btn) return;
    btn.className = 'px-5 py-2 rounded-full text-sm font-semibold transition flex items-center gap-2 ' + (g===x?'tab-active':'tab-inactive');
    btn.setAttribute('aria-pressed', String(g===x));
  });
  const hm = document.getElementById('hair-male');
  const hf = document.getElementById('hair-female');
  if (hm) hm.style.display = g==='male'   ? 'block' : 'none';
  if (hf) hf.style.display = g==='female' ? 'block' : 'none';
  if (typeof lucide!=='undefined') lucide.createIcons();
}

/* ── CATEGORÍA ── */
function setCategory(cat) {
  currentCategory = cat;
  document.querySelectorAll('.cat-tab').forEach(b => {
    const isSel = b.dataset.cat===cat;
    b.className = 'cat-tab px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition flex items-center gap-1.5 ' + (isSel?'tab-active':'tab-inactive');
    b.setAttribute('aria-selected', String(isSel));
  });
  renderCatalog();
}

/* ── CATÁLOGO ── */
function renderCatalog() {
  const grid = document.getElementById('catalog-grid');
  if (!grid) return;
  const items = catalog[currentCategory];
  grid.innerHTML = items.map(item => {
    const selKey = currentCategory==='tops'?'top':currentCategory==='pants'?'pants':'shoes';
    const isSel  = selected[selKey]?.id===item.id;
    const priceNum = parseInt(item.price.replace(/\D/g,''));
    return `
      <article class="item-card${isSel?' selected-card':''}"
        onclick="selectItem('${currentCategory}','${item.id}')"
        role="button" tabindex="0"
        aria-pressed="${isSel}"
        aria-label="${item.name}, ${item.price}${isSel?', seleccionado':''}"
        onkeydown="if(event.key==='Enter'||event.key===' ')selectItem('${currentCategory}','${item.id}')">
        ${priceNum>250?'<div class="badge-premium">PREMIUM</div>':''}
        <div style="aspect-ratio:1;display:flex;align-items:center;justify-content:center;padding:12px;background:linear-gradient(135deg,${item.color}22,${item.color}44);" aria-hidden="true">
          ${renderItemPreview(currentCategory,item)}
        </div>
        <div style="padding:12px;background:var(--surface2);">
          <div class="item-name" style="white-space:nowrap;overflow:hidden;text-overflow:ellipsis;margin-bottom:6px;">${item.name}</div>
          <div style="display:flex;align-items:center;justify-content:space-between;">
            <span class="item-price">${item.price}</span>
            ${isSel?'<span style="font-size:9px;background:var(--brand);color:var(--brand-text);padding:2px 6px;border-radius:4px;font-weight:800;font-family:Space Mono,monospace;">✓ ON</span>':''}
          </div>
          <div style="display:flex;gap:6px;margin-top:8px;">
            <button onclick="event.stopPropagation();selectItem('${currentCategory}','${item.id}')"
              class="btn-ghost flex-1 py-1.5" style="font-size:11px;justify-content:center;border-radius:7px;"
              aria-label="Probar ${item.name}">
              <i data-lucide="eye" style="width:11px;height:11px;" aria-hidden="true"></i> Probar
            </button>
            <button onclick="event.stopPropagation();addToCart('${currentCategory}','${item.id}')"
              class="add-btn flex-1 py-1.5"
              aria-label="Agregar ${item.name} al carrito">
              <i data-lucide="plus" style="width:11px;height:11px;" aria-hidden="true"></i> Agregar
            </button>
          </div>
        </div>
      </article>`;
  }).join('');
  if (typeof lucide!=='undefined') lucide.createIcons();
}

function renderItemPreview(cat, item) {
  if (cat==='tops') return `<svg viewBox="0 0 80 80" width="68" height="68"><path d="M25 20 Q20 22 15 30 L20 33 L28 27 L28 65 H52 L52 27 L60 33 L65 30 Q60 22 55 20 Q48 15 40 15 Q32 15 25 20Z" fill="${item.color}" stroke="${item.accent}" stroke-width=".8"/>${item.type==='hoodie'?`<path d="M33 15 Q37 22 40 25 Q43 22 47 15" stroke="${item.accent}" stroke-width="1.5" fill="none"/>`:''}${item.type==='jacket'?`<line x1="40" y1="20" x2="40" y2="65" stroke="${item.accent}" stroke-width="1" stroke-dasharray="2"/>`:''}`;
  if (cat==='pants') return `<svg viewBox="0 0 80 80" width="68" height="68"><path d="M25 10 L22 70 H38 L40 10 Z" fill="${item.color}" stroke="${item.accent}" stroke-width=".5"/><path d="M55 10 L58 70 H42 L40 10 Z" fill="${item.color}" stroke="${item.accent}" stroke-width=".5"/>${item.type==='cargo'?`<rect x="24" y="35" width="10" height="8" rx="1" fill="${item.accent}" opacity=".5"/><rect x="46" y="35" width="10" height="8" rx="1" fill="${item.accent}" opacity=".5"/>`:''}`;
  if (cat==='shoes') return `<svg viewBox="0 0 80 60" width="72" height="52"><path d="M10 35 Q10 25 20 22 L55 22 Q70 22 72 32 L72 38 Q72 45 60 45 L10 45 Q8 45 8 40 Z" fill="${item.color}" stroke="${item.accent}" stroke-width=".8"/><path d="M8 40 L72 40 Q72 48 60 48 L10 48 Q8 48 8 44 Z" fill="${item.sole}"/><circle cx="35" cy="32" r="2" fill="${item.accent}" opacity=".5"/><circle cx="45" cy="32" r="2" fill="${item.accent}" opacity=".5"/>`;
  return '';
}

/* ── AVATAR ── */
function updateAvatar() {
  const topLayer = document.getElementById('layer-top');
  if (topLayer) {
    const t = selected.top;
    if (t) {
      let svg='';
      if (t.type==='tee') svg=`<path d="M78 105 Q72 108 62 120 L68 125 L82 115 L82 225 H158 L158 115 L172 125 L178 120 Q168 108 162 105 Q148 95 120 95 Q92 95 78 105Z" fill="${t.color}" stroke="${t.accent}" stroke-width=".5"/>`;
      else if (t.type==='hoodie') svg=`<path d="M78 105 Q72 108 58 125 L62 240 L82 240 L82 225 H158 L158 240 L178 240 L182 125 Q168 108 162 105 Q148 95 120 95 Q92 95 78 105Z" fill="${t.color}" stroke="${t.accent}" stroke-width=".5"/><path d="M100 95 Q110 110 120 115 Q130 110 140 95" stroke="${t.accent}" stroke-width="2" fill="none"/><ellipse cx="120" cy="96" rx="18" ry="6" fill="${t.accent}" opacity=".3"/>`;
      else if (t.type==='jacket') svg=`<path d="M78 105 Q72 108 55 125 L58 245 L82 245 L82 225 H158 L158 245 L182 245 L185 125 Q168 108 162 105 Q148 95 120 95 Q92 95 78 105Z" fill="${t.color}" stroke="${t.accent}" stroke-width=".5"/><line x1="120" y1="105" x2="120" y2="240" stroke="${t.accent}" stroke-width="1.5"/>`;
      topLayer.innerHTML=svg;
    } else {
      topLayer.innerHTML=`<path d="M78 105 Q72 108 62 120 L68 125 L82 115 L82 225 H158 L158 115 L172 125 L178 120 Q168 108 162 105 Q148 95 120 95 Q92 95 78 105Z" fill="var(--surface3)" stroke="var(--border)" stroke-width=".5"/>`;
    }
  }
  const pantsLayer = document.getElementById('layer-pants');
  if (pantsLayer) {
    const p = selected.pants;
    if (p) {
      const extra = p.type==='cargo'?`<rect x="83" y="280" width="14" height="12" rx="2" fill="${p.accent}" opacity=".3"/><rect x="143" y="280" width="14" height="12" rx="2" fill="${p.accent}" opacity=".3"/>`:'';
      pantsLayer.innerHTML = p.type==='short'
        ?`<path d="M88 230 L85 300 H118 L120 230 Z" fill="${p.color}" stroke="${p.accent}" stroke-width=".5"/><path d="M152 230 L155 300 H122 L120 230 Z" fill="${p.color}" stroke="${p.accent}" stroke-width=".5"/>`
        :`<path d="M88 230 L82 350 H118 L120 230 Z" fill="${p.color}" stroke="${p.accent}" stroke-width=".5"/><path d="M152 230 L158 350 H122 L120 230 Z" fill="${p.color}" stroke="${p.accent}" stroke-width=".5"/>${extra}`;
    } else {
      pantsLayer.innerHTML=`<path d="M88 230 L82 350 H118 L120 230 Z" fill="var(--surface3)" stroke="var(--border)" stroke-width=".5"/><path d="M152 230 L158 350 H122 L120 230 Z" fill="var(--surface3)" stroke="var(--border)" stroke-width=".5"/>`;
    }
  }
  const shoesLayer = document.getElementById('layer-shoes');
  if (shoesLayer) {
    const s = selected.shoes;
    if (s) {
      shoesLayer.innerHTML=`
        <path d="M78 358 Q78 350 88 348 L108 348 Q115 348 115 355 L115 362 Q115 370 105 370 L78 370 Q76 370 76 366 Z" fill="${s.color}" stroke="${s.accent}" stroke-width=".5"/>
        <path d="M76 365 L115 365 Q115 372 105 372 L78 372 Q76 372 76 368 Z" fill="${s.sole}"/>
        <path d="M127 358 Q127 350 137 348 L157 348 Q164 348 164 355 L164 362 Q164 370 154 370 L127 370 Q125 370 125 366 Z" fill="${s.color}" stroke="${s.accent}" stroke-width=".5"/>
        <path d="M125 365 L164 365 Q164 372 154 372 L127 372 Q125 372 125 368 Z" fill="${s.sole}"/>`;
    } else {
      shoesLayer.innerHTML=`<rect x="78" y="355" width="35" height="18" rx="9" fill="var(--surface3)"/><rect x="127" y="355" width="35" height="18" rx="9" fill="var(--surface3)"/>`;
    }
  }
  renderOutfitSummary();
}

/* ── OUTFIT SUMMARY ── */
function renderOutfitSummary() {
  const el = document.getElementById('outfit-summary');
  if (!el) return;
  const parts=[{label:'Top',item:selected.top},{label:'Pantalón',item:selected.pants},{label:'Zapatillas',item:selected.shoes}];
  let total=0;
  parts.forEach(p=>{ if(p.item) total+=parseInt(p.item.price.replace(/\D/g,'')); });
  const hasAny=parts.some(p=>p.item);
  el.innerHTML=parts.map(p=>`
    <div style="display:flex;align-items:center;justify-content:space-between;padding:8px 10px;border-radius:9px;${p.item?'background:var(--brand-subtle);border:1px solid var(--brand-border);':'background:var(--surface2);border:1px solid transparent;'}">
      <span style="font-size:11px;font-weight:700;color:${p.item?'var(--brand)':'var(--text-low)'};font-family:Space Mono,monospace;">${p.label}</span>
      <div style="display:flex;align-items:center;gap:8px;min-width:0;margin-left:8px;">
        <span style="font-size:11px;color:${p.item?'var(--text-mid)':'var(--text-low)'};white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:100px;">${p.item?p.item.name:'—'}</span>
        ${p.item?`<span style="font-size:12px;color:var(--brand);font-weight:800;flex-shrink:0;font-family:Bebas Neue,sans-serif;">${p.item.price}</span>`:''}
      </div>
    </div>`).join('')+
    (hasAny?`<div id="outfit-total-panel"><span style="font-size:11px;color:var(--text-low);font-family:Space Mono,monospace;">💰 Total outfit</span><span style="font-family:Bebas Neue,sans-serif;font-size:22px;color:var(--brand);">S/ ${total}</span></div>`:'');
}

function resetOutfit() {
  selected={top:null,pants:null,shoes:null};
  updateAvatar(); renderCatalog(); showToast('Outfit reiniciado');
}

/* ── PRESETS ── */
function renderPresets() {
  const el = document.getElementById('outfit-presets');
  if (!el) return;
  el.innerHTML=outfitPresets.map((o,i)=>`
    <div class="preset-card" role="listitem" onclick="applyPreset(${i})" tabindex="0"
      onkeydown="if(event.key==='Enter')applyPreset(${i})"
      aria-label="Outfit ${o.name}: ${o.desc}">
      <div style="display:flex;align-items:center;gap:12px;margin-bottom:14px;">
        <div class="outfit-badge" style="width:40px;height:40px;display:flex;align-items:center;justify-content:center;flex-shrink:0;">
          <i data-lucide="${o.icon}" style="width:20px;height:20px;"></i>
        </div>
        <div>
          <div style="font-family:'Bebas Neue',sans-serif;font-size:20px;color:var(--text-hi);letter-spacing:.04em;">${o.name}</div>
          <div style="font-size:12px;color:var(--text-low);">${o.desc}</div>
        </div>
      </div>
      <div style="display:flex;gap:8px;margin-bottom:14px;">
        ${[['top',o.top,'tops'],['pants',o.pants,'pants'],['shoes',o.shoes,'shoes']].map(([k,id,cat])=>{
          const item=catalog[cat].find(x=>x.id===id);
          return `<div style="flex:1;border-radius:9px;padding:8px;text-align:center;background:${item.color}18;border:0.5px solid ${item.color}30;">
            <div style="font-size:10px;color:var(--text-low);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;font-weight:600;">${item.name}</div>
          </div>`;
        }).join('')}
      </div>
      <button class="btn-secondary w-full py-2" style="font-size:13px;justify-content:center;border-radius:9px;">
        <i data-lucide="sparkles" style="width:13px;height:13px;" aria-hidden="true"></i> Aplicar Outfit
      </button>
    </div>`).join('');
  if (typeof lucide!=='undefined') lucide.createIcons();
}

function applyPreset(i) {
  const p=outfitPresets[i];
  selected.top   =catalog.tops.find(x=>x.id===p.top);
  selected.pants =catalog.pants.find(x=>x.id===p.pants);
  selected.shoes =catalog.shoes.find(x=>x.id===p.shoes);
  updateAvatar(); renderCatalog();
  document.getElementById('tryOn').scrollIntoView({behavior:'smooth'});
  showToast('✓ Outfit '+p.name+' aplicado');
}

function selectItem(cat,id) {
  const key=cat==='tops'?'top':cat==='pants'?'pants':'shoes';
  selected[key]=catalog[cat].find(x=>x.id===id);
  updateAvatar(); renderCatalog();
}

/* ── CARRITO ── */
function addToCart(cat,id) {
  const item=catalog[cat].find(x=>x.id===id);
  if (!item) return;
  cartData.push({...item,__bid:'local_'+Date.now()+'_'+Math.random().toString(36).slice(2),price:parseInt(item.price.replace(/\D/g,'')),timestamp:new Date().toISOString()});
  renderCart(); showToast('✓ '+item.name+' agregado');
}

function removeFromCart(bid) {
  const item=cartData.find(x=>x.__bid===bid);
  cartData=cartData.filter(x=>x.__bid!==bid);
  renderCart(); if(item) showToast(item.name+' eliminado');
}

function renderCart() {
  const container=document.getElementById('cart-items');
  const count    =document.getElementById('cart-count');
  const navCount =document.getElementById('nav-cart-count');
  if(count)    count.textContent=cartData.length;
  if(navCount) navCount.textContent=cartData.length;
  const total=cartData.reduce((s,x)=>s+x.price,0);
  const totalEl=document.getElementById('cart-total');
  if(totalEl){ totalEl.classList.add('total-update'); setTimeout(()=>totalEl.classList.remove('total-update'),500); totalEl.textContent='S/ '+total; }
  if(!container) return;
  if(!cartData.length) {
    container.innerHTML=`<div style="color:var(--text-low);font-size:13px;text-align:center;padding:20px 0;display:flex;flex-direction:column;align-items:center;gap:6px;"><i data-lucide="shopping-bag" style="width:22px;height:22px;opacity:.3;"></i><span>Tu carrito está vacío</span></div>`;
    if(typeof lucide!=='undefined') lucide.createIcons();
    return;
  }
  container.innerHTML=cartData.map(item=>`
    <div class="cart-item-enter" style="display:flex;align-items:center;justify-content:space-between;border-radius:10px;padding:10px 12px;background:var(--surface2);border:1px solid var(--border);" role="listitem">
      <div style="min-width:0;flex:1;">
        <div style="font-size:12px;font-weight:700;color:var(--text-mid);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${item.name}</div>
        <div style="color:var(--brand);font-weight:800;font-size:15px;margin-top:2px;font-family:'Bebas Neue',sans-serif;">S/ ${item.price}</div>
      </div>
      <button onclick="removeFromCart('${item.__bid}')" class="btn-ghost" style="padding:6px;border-radius:7px;margin-left:8px;flex-shrink:0;" aria-label="Eliminar ${item.name}">
        <i data-lucide="trash-2" style="width:13px;height:13px;"></i>
      </button>
    </div>`).join('');
  updateAnalytics();
  if(typeof lucide!=='undefined') lucide.createIcons();
}

/* ── CHECKOUT ── */
function checkout() {
  if(!cartData.length){ showToast('Tu carrito está vacío'); return; }
  const total=cartData.reduce((s,x)=>s+x.price,0);
  const count=cartData.length;
  const overlay=document.createElement('div');
  overlay.className='checkout-overlay';
  overlay.setAttribute('role','dialog');
  overlay.setAttribute('aria-modal','true');
  overlay.innerHTML=`
    <div class="checkout-modal">
      <span class="checkout-confetti">🎉</span>
      <h2 class="checkout-title">¡Compra Exitosa!</h2>
      <p class="checkout-sub">${count} prenda${count>1?'s':''} · <span class="checkout-price">S/ ${total}</span></p>
      <div class="checkout-info-card">
        <div class="checkout-info-row">
          <div class="checkout-info-icon"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="rgba(238,240,255,.65)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="1" y="3" width="15" height="13" rx="2"/><path d="M16 8h5l3 5v4h-8V8z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg></div>
          <span>Entrega en 3-5 días hábiles</span>
        </div>
        <div class="checkout-info-row">
          <div class="checkout-info-icon"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="rgba(238,240,255,.65)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><polyline points="9 12 11 14 15 10"/></svg></div>
          <span>Compra 100% segura</span>
        </div>
      </div>
      <button class="checkout-cta" id="checkout-cta-btn">✓ Continuar Comprando</button>
    </div>`;
  document.body.appendChild(overlay);
  setTimeout(()=>document.getElementById('checkout-cta-btn')?.focus(),60);
  overlay.addEventListener('click',e=>{ if(e.target===overlay) closeCheckout(overlay); });
  const esc=e=>{ if(e.key==='Escape'){ closeCheckout(overlay); document.removeEventListener('keydown',esc); } };
  document.addEventListener('keydown',esc);
  document.getElementById('checkout-cta-btn').addEventListener('click',()=>closeCheckout(overlay));
}

function closeCheckout(overlay) {
  cartData=[]; renderCart();
  overlay.style.opacity='0'; overlay.style.transition='opacity .2s';
  setTimeout(()=>overlay.remove(),220);
  showToast('✓ ¡Gracias por tu compra! 🛍️');
}

/* ── ANALYTICS ── */
function updateAnalytics() {
  if(!cartData.length) return;
  const total=cartData.reduce((s,x)=>s+x.price,0);
  const catCount={}, prodCount={};
  cartData.forEach(x=>{ catCount[x.category]=(catCount[x.category]||0)+1; prodCount[x.name]=(prodCount[x.name]||0)+1; });
  const topCat=Object.keys(catCount).reduce((a,b)=>catCount[a]>catCount[b]?a:b,Object.keys(catCount)[0]||'N/A');
  const avg=Math.round(total/Math.ceil(cartData.length/3));
  const g=id=>document.getElementById(id);
  if(g('total-sales'))  g('total-sales').textContent =total;
  if(g('total-items'))  g('total-items').textContent =cartData.length;
  if(g('top-category')) g('top-category').textContent=topCat==='tops'?'Tops':topCat==='pants'?'Pantalones':'Zapatillas';
  if(g('avg-ticket'))   g('avg-ticket').textContent  =avg;
  renderCharts(catCount,prodCount);
  renderAnalyticsTable();
}

function renderCharts(catCount,prodCount) {
  if(typeof Chart==='undefined') return;
  const brand = getComputedStyle(document.documentElement).getPropertyValue('--brand').trim();
  const accent = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim();
  const accentBlue = getComputedStyle(document.documentElement).getPropertyValue('--accent-blue').trim();
  const C=[brand, accent, accentBlue, brand+'88', accent+'88'];
  const textColor=getComputedStyle(document.body).getPropertyValue('--text-mid').trim()||'#666';
  const gridColor=getComputedStyle(document.body).getPropertyValue('--border').trim()||'rgba(0,0,0,.09)';
  const opts={responsive:true,maintainAspectRatio:false,plugins:{legend:{display:false},tooltip:{backgroundColor:'var(--surface)',titleColor:'var(--text-hi)',bodyColor:'var(--text-mid)',borderColor:'var(--border)',borderWidth:1,padding:12}}};

  const top=document.getElementById('topProductsChart')?.getContext('2d');
  if(top){ if(charts.top) charts.top.destroy(); charts.top=new Chart(top,{type:'bar',data:{labels:Object.keys(prodCount).slice(0,5),datasets:[{data:Object.values(prodCount).slice(0,5),backgroundColor:C,borderRadius:8,borderSkipped:false}]},options:{...opts,indexAxis:'y',scales:{x:{beginAtZero:true,ticks:{color:textColor,font:{size:11}},grid:{color:gridColor}},y:{ticks:{color:textColor,font:{size:11}},grid:{display:false}}}}}); }

  const cat=document.getElementById('categoryChart')?.getContext('2d');
  if(cat){ if(charts.cat) charts.cat.destroy(); charts.cat=new Chart(cat,{type:'doughnut',data:{labels:Object.keys(catCount).map(k=>k==='tops'?'Tops':k==='pants'?'Pantalones':'Zapatillas'),datasets:[{data:Object.values(catCount),backgroundColor:C,borderColor:'var(--surface)',borderWidth:3}]},options:{...opts,plugins:{legend:{display:true,position:'bottom',labels:{color:textColor,padding:14,font:{size:12}}},tooltip:opts.plugins.tooltip}}}); }

  const trend=document.getElementById('trendChart')?.getContext('2d');
  if(trend){ if(charts.trend) charts.trend.destroy(); const tot=cartData.reduce((s,x)=>s+x.price,0); charts.trend=new Chart(trend,{type:'line',data:{labels:['Lun','Mar','Mié','Jue','Vie','Sáb','Dom'],datasets:[{label:'Ventas',data:[0,50,120,200,350,420,tot],borderColor:brand,backgroundColor:brand+'14',borderWidth:2,fill:true,tension:.45,pointRadius:5,pointBackgroundColor:brand,pointBorderColor:'var(--surface)',pointBorderWidth:2}]},options:{...opts,plugins:{legend:{display:false},tooltip:opts.plugins.tooltip},scales:{y:{ticks:{color:textColor},grid:{color:gridColor}},x:{ticks:{color:textColor},grid:{color:gridColor}}}}}); }

  const out=document.getElementById('outfitsChart')?.getContext('2d');
  if(out){ if(charts.out) charts.out.destroy(); charts.out=new Chart(out,{type:'bar',data:{labels:outfitPresets.map(o=>o.name),datasets:[{data:[Math.floor(cartData.length*.3),Math.floor(cartData.length*.5),Math.floor(cartData.length*.2)],backgroundColor:C,borderRadius:8,borderSkipped:false}]},options:{...opts,scales:{y:{beginAtZero:true,ticks:{color:textColor},grid:{color:gridColor}},x:{ticks:{color:textColor},grid:{display:false}}}}}); }
}

function renderAnalyticsTable() {
  const tbody=document.getElementById('table-body');
  if(!tbody) return;
  if(!cartData.length){ tbody.innerHTML=`<tr><td colspan="4" style="padding:32px;text-align:center;color:var(--text-low);">Sin datos aún. ¡Realiza tu primera compra!</td></tr>`; return; }
  tbody.innerHTML=cartData.slice(-5).reverse().map(item=>{
    const time=new Date(item.timestamp).toLocaleTimeString('es-PE',{hour:'2-digit',minute:'2-digit'});
    const cat=item.category==='tops'?'👕 Tops':item.category==='pants'?'👖 Pantalones':'👟 Zapatillas';
    return `<tr style="border-bottom:1px solid var(--border);">
      <td style="padding:12px 16px;font-size:13px;color:var(--text-mid);">${item.name}</td>
      <td style="padding:12px 16px;font-size:13px;color:var(--text-mid);">${cat}</td>
      <td style="padding:12px 16px;font-size:13px;text-align:right;font-weight:800;color:var(--brand);font-family:'Bebas Neue',sans-serif;">S/ ${item.price}</td>
      <td style="padding:12px 16px;font-size:13px;text-align:center;color:var(--text-low);font-family:'Space Mono',monospace;">${time}</td>
    </tr>`;
  }).join('');
}

/* ── INIT ── */
document.addEventListener('DOMContentLoaded', () => {
  renderCatalog();
  renderPresets();
  updateAvatar();
  renderCart();
  if (typeof lucide!=='undefined') lucide.createIcons();
});
