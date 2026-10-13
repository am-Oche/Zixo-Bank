(() => {
const Z = window.ZIXO, $ = s => document.querySelector(s), $$ = s => [...document.querySelectorAll(s)];
const RM = matchMedia('(prefers-reduced-motion: reduce)').matches;
const fmt = (n, d = 2) => n.toLocaleString('en-US', { minimumFractionDigits: d, maximumFractionDigits: d });

/* ---------- nav from config ---------- */
$('#navMain').innerHTML = Z.nav.map(n => `<a href="${n.href}">${n.label}</a>`).join('');
$('#navDrawer').innerHTML = Z.nav.map((n, i) => `<a href="${n.href}" style="transition-delay:${60 + i * 40}ms">${n.label}</a>`).join('');
$('#footCols').innerHTML = Z.footer.map(c => `<div><h5>${c.title}</h5><ul>${c.links.map(l => `<li><a href="#">${l}</a></li>`).join('')}</ul></div>`).join('');
const drawer = $('#drawer');
const setDrawer = o => { drawer.classList.toggle('open', o); drawer.setAttribute('aria-hidden', !o); };
$('#burger').onclick = () => setDrawer(true); $('#drawerX').onclick = () => setDrawer(false);
$$('#navDrawer a').forEach(a => a.onclick = () => setDrawer(false));

/* ---------- smooth scroll ---------- */
let lenis;
if (window.Lenis && !RM) {
  lenis = new Lenis({ duration: 1.1, smoothWheel: true });
  const raf = t => { lenis.raf(t); requestAnimationFrame(raf); }; requestAnimationFrame(raf);
  $$('a[href^="#"]').forEach(a => a.addEventListener('click', e => {
    const id = a.getAttribute('href'); if (id.length < 2) return; const el = $(id); if (!el) return;
    e.preventDefault(); lenis.scrollTo(el, { offset: -80 });
  }));
}

/* ---------- header condense + parallax ---------- */
const hdr = $('#hdr'), pars = $$('[data-par]');
const onScroll = () => {
  const y = scrollY; hdr.classList.toggle('scrolled', y > 24);
  if (!RM && y < 900) pars.forEach(el => {
    const base = el.dataset.base ?? (el.dataset.base = el.style.transform || '');
    el.style.transform = `${base} translateY(${y * el.dataset.par / 100}px)`;
  });
  statementLight();
};
addEventListener('scroll', onScroll, { passive: true });

/* ---------- reveal ---------- */
const io = new IntersectionObserver(es => es.forEach(e => {
  if (!e.isIntersecting) return; e.target.classList.add('in'); io.unobserve(e.target);
  e.target.querySelectorAll?.('[data-w]').forEach(b => b.style.width = b.dataset.w);
  if (e.target.dataset.w) e.target.style.width = e.target.dataset.w;
}), { threshold: .15, rootMargin: '0px 0px -40px 0px' });
$$('.rv').forEach((el, i) => { el.style.transitionDelay = `${(i % 4) * 70}ms`; io.observe(el); });
$$('.budget i').forEach(b => io.observe(b.closest('.rv') || b));

/* ---------- count-up ---------- */
const cio = new IntersectionObserver(es => es.forEach(e => {
  if (!e.isIntersecting) return; cio.unobserve(e.target);
  const el = e.target, to = +el.dataset.count; if (RM) return;
  const t0 = performance.now(), D = 1600;
  const step = t => { const p = Math.min(1, (t - t0) / D), k = 1 - Math.pow(1 - p, 4);
    el.textContent = Math.round(to * k).toLocaleString('en-US'); if (p < 1) requestAnimationFrame(step); };
  requestAnimationFrame(step);
}), { threshold: .5 });
$$('[data-count]').forEach(el => cio.observe(el));

/* ---------- statement word lighting ---------- */
const st = $('#statement');
st.innerHTML = st.textContent.split(' ').map(w => `<span class="w">${w}</span>`).join(' ');
const words = $$('#statement .w');
function statementLight() {
  const r = st.getBoundingClientRect(), vh = innerHeight;
  const p = Math.max(0, Math.min(1, (vh * .85 - r.top) / (r.height + vh * .35)));
  const n = RM ? words.length : Math.round(p * words.length);
  words.forEach((w, i) => w.classList.toggle('lit', i < n));
}

/* ---------- magnetic buttons ---------- */
if (!RM && matchMedia('(hover:hover)').matches) $$('.magnetic').forEach(b => {
  b.addEventListener('pointermove', e => { const r = b.getBoundingClientRect();
    b.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * .18}px,${(e.clientY - r.top - r.height / 2) * .28}px)`; });
  b.addEventListener('pointerleave', () => b.style.transform = '');
});

/* ---------- reusable Segmented tabs ---------- */
const handlers = {};
function Tabs(el) {
  const key = el.dataset.tabs, items = Z.tabs[key], urlKey = el.dataset.url;
  const q = urlKey && new URLSearchParams(location.search).get(urlKey);
  let cur = items.find(i => i.id === q)?.id || items[0].id;
  el.innerHTML = `<span class="pill"></span>` + items.map(i =>
    `<button role="tab" id="t-${key}-${i.id}" data-id="${i.id}">${i.label}</button>`).join('');
  if (el.closest('.dark-sec')) el.classList.add('on-dark');
  const pill = el.querySelector('.pill'), btns = [...el.querySelectorAll('[role=tab]')];
  const set = (id, focus) => {
    cur = id;
    btns.forEach(b => { const on = b.dataset.id === id; b.setAttribute('aria-selected', on); b.tabIndex = on ? 0 : -1; if (on && focus) b.focus();
      if (on) { pill.style.width = b.offsetWidth + 'px'; pill.style.transform = `translateX(${b.offsetLeft}px)`; } });
    if (urlKey) { const u = new URL(location); u.searchParams.set(urlKey, id); history.replaceState(null, '', u); }
    handlers[key]?.(id);
  };
  btns.forEach((b, i) => {
    b.onclick = () => set(b.dataset.id);
    b.onkeydown = e => { const d = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0; if (!d) return;
      e.preventDefault(); set(btns[(i + d + btns.length) % btns.length].dataset.id, true); };
  });
  el._set = set; el._refresh = () => set(cur);
  return () => set(cur);
}

/* ---------- feature tabs ---------- */
const fCopy = $('#ftabCopy'), fStage = $('#ftabStage');
const vis = {
  send: `<div style="width:300px;display:grid;gap:10px">
    <div class="sbox"><div class="top"><span>To</span><span>Saved contact</span></div><div class="mid"><span class="tok"><i style="background:#E7D6C6;color:#414140">TM</i>Tobi Martins</span><span class="amt" style="font-size:30px">₦250k</span></div></div>
    <div class="sbox" style="display:flex;justify-content:space-between;font-size:13px"><span style="color:var(--muted)">Arrives</span><b style="font-weight:500">In seconds · free</b></div>
    <div class="btn btn-dark" style="justify-content:center">Send ₦250,000</div></div>`,
  spend: `<div class="bcard pearl shimmer" style="transform:rotate(-6deg)"><div class="t"><span>Virtual<small>Pearl</small></span><span style="font-family:var(--font-sans);font-size:12px;opacity:.6">Online</span></div><div class="chip"></div><div class="b"><span>•••• 6050</span><span class="brand">VISA</span></div></div>`,
  save: `<div style="width:300px;display:grid;gap:10px">${[['Rent — November', 820, 1200], ['Trip to Accra', 640, 1500], ['Emergency fund', 2100, 3000]].map(([n, a, b]) =>
    `<div class="sbox"><div class="top"><span style="color:var(--ink)">${n}</span><span>$${fmt(a, 0)} / $${fmt(b, 0)}</span></div><div class="budget" style="margin-top:12px"><i style="width:${a / b * 100}%"></i></div></div>`).join('')}</div>`,
  track: `<div style="width:320px" class="sbox"><div class="top"><span style="color:var(--ink)">October by category</span><span>$3,140</span></div>
    ${[['Shopping', 1240, '#414140'], ['Dining', 340, '#F26A35'], ['Transport', 520, '#9A9A96'], ['Bills', 1040, '#C9C9C5']].map(([n, v, c]) =>
    `<div style="display:flex;align-items:center;gap:10px;margin-top:12px;font-size:13px"><span style="width:8px;height:8px;border-radius:50%;background:${c}"></span><span style="flex:1">${n}</span><b style="font-weight:500">$${fmt(v, 0)}</b></div>`).join('')}</div>`
};
fCopy.innerHTML = Object.entries(Z.features).map(([k, f]) => `<div class="fcopy" data-k="${k}" role="tabpanel" aria-labelledby="t-ftab-${k}">
  <h3 style="font-size:30px;font-weight:500;letter-spacing:-.025em;line-height:1.1">${f.title}</h3>
  <p style="color:var(--muted);margin-top:14px;max-width:44ch">${f.body}</p><ul>${f.points.map(p => `<li>${p}</li>`).join('')}</ul></div>`).join('')
  + `<a href="#download" class="btn btn-dark" style="align-self:flex-start;margin-top:32px">Try it free</a>`;
fStage.innerHTML = Object.entries(vis).map(([k, v]) => `<div class="fpane" data-k="${k}">${v}</div>`).join('');
handlers.ftab = id => { $$('.fcopy,.fpane').forEach(e => e.classList.toggle('on', e.dataset.k === id)); };

/* ---------- currencies ---------- */
const rates = Object.fromEntries(Z.currencies.map(c => [c[0], c[3]]));
const chip = c => `<span class="cchip"><span class="sym">${c[2]}</span><b>${c[0]}</b><span class="r">${c[4] === 'crypto' ? fmt(1 / c[3], 2) + ' USD' : c[0] === 'USD' ? '1.00' : fmt(c[3], c[3] > 100 ? 1 : 3)}</span></span>`;
handlers.cgroup = g => {
  const list = Z.currencies.filter(c => g === 'popular' ? c[5] : c[4] === g);
  const half = Math.ceil(list.length / 2), a = list.slice(0, half), b = list.slice(half).length ? list.slice(half) : a;
  const rep = arr => { let r = arr; while (r.length < 12) r = r.concat(arr); return r.concat(r).map(chip).join(''); };
  $('#mq1').innerHTML = rep(a); $('#mq2').innerHTML = rep(b);
};
const fiat = Z.currencies.filter(c => c[4] === 'fiat');
['#cvFrom', '#cvTo'].forEach((s, i) => $(s).innerHTML = fiat.map(c => `<option value="${c[0]}" ${c[0] === (i ? 'NGN' : 'USD') ? 'selected' : ''}>${c[0]}</option>`).join(''));
const jitter = {}; Z.currencies.forEach(c => jitter[c[0]] = 1);
const rate = (a, b) => (rates[b] * jitter[b]) / (rates[a] * jitter[a]);
function convert() {
  const a = $('#cvFrom').value, b = $('#cvTo').value;
  const amt = parseFloat($('#cvAmt').value.replace(/[^0-9.]/g, '')) || 0;
  const r = rate(a, b), fee = a === b ? 0 : amt * 0.008;
  $('#cvOut').value = fmt((amt - fee) * r);
  $('#cvRate').textContent = `1 ${a} = ${fmt(r, r > 100 ? 2 : 4)} ${b}`;
  $('#cvFee').textContent = `${fmt(fee)} ${a} (0.8%)`;
}
$('#cvAmt').addEventListener('input', convert); $('#cvFrom').onchange = convert; $('#cvTo').onchange = convert;
$('#cvAmt').addEventListener('blur', e => { const v = parseFloat(e.target.value.replace(/[^0-9.]/g, '')) || 0; e.target.value = v.toLocaleString('en-US'); });
let cvRot = 0;
$('#cvSwap').onclick = () => { const f = $('#cvFrom'), t = $('#cvTo'), v = f.value; f.value = t.value; t.value = v; cvRot += 180;
  $('#cvSwap').style.transform = `rotate(${cvRot + (innerWidth < 860 ? 90 : 0)}deg)`;
  $$('.conv-f').forEach(el => el.animate([{ opacity: .3, transform: 'translateY(6px)' }, { opacity: 1, transform: 'none' }], { duration: 450, easing: 'cubic-bezier(.22,1,.36,1)' }));
  convert(); };
let sec = 0;
setInterval(() => { Z.currencies.forEach(c => jitter[c[0]] = 1 + (Math.random() - .5) * .002); convert(); sec = 0;
  const tk = $('[data-tick]'); if (tk) tk.textContent = String(Math.floor(10 + Math.random() * 89)); }, 5000);
setInterval(() => { sec++; $('#cvTime').textContent = sec < 2 ? 'just now' : `${sec}s ago`; }, 1000);

/* ---------- swap ---------- */
let pairIdx = 0, flipped = false, sRot = 0;
const P = () => Z.swapPairs[pairIdx];
$('#sPairs').innerHTML = Z.swapPairs.map((p, i) => `<button data-i="${i}" style="font-size:12px;padding:3px 9px;border-radius:99px;box-shadow:0 0 0 1px var(--line-2) inset">${p.a}/${p.b}</button>`).join('');
$$('#sPairs button').forEach(b => b.onclick = () => { pairIdx = +b.dataset.i; renderSwap(); });
let payAmt = { BNB: .05, BTC: .002, ETH: .05, USDC: 30 };
function renderSwap() {
  const p = P(), [A, B, ca, cb, bA, bB] = flipped ? [p.b, p.a, p.cb, p.ca, p.balB, p.balA] : [p.a, p.b, p.ca, p.cb, p.balA, p.balB];
  const r = flipped ? 1 / p.rate : p.rate;
  const amt = flipped ? +(payAmt[p.a] * p.rate).toFixed(2) : payAmt[p.a];
  const out = amt * r - (flipped ? 0 : p.fee * (amt * r) / 100);
  const usdOf = (sym, v) => sym === 'USDT' || sym === 'USD' || sym === 'USDC' ? v : v * p.rate;
  $('#sPayTok').innerHTML = `<i style="background:${ca}">${A[0]}</i>${A} <svg width="10" height="10" style="transform:rotate(90deg);opacity:.5"><use href="#i-chev"/></svg>`;
  $('#sGetTok').innerHTML = `<i style="background:${cb}">${B[0]}</i>${B} <svg width="10" height="10" style="transform:rotate(90deg);opacity:.5"><use href="#i-chev"/></svg>`;
  $('#sPayAmt').textContent = amt < 1 ? amt : fmt(amt);
  $('#sGetAmt').textContent = out < 1 ? out.toFixed(6) : fmt(out);
  $('#sPayBal').textContent = `${bA} ${A}`; $('#sGetBal').textContent = `${bB} ${B}`;
  $('#sPayUsd').textContent = `≈ ${fmt(usdOf(A, amt))} USD`; $('#sGetUsd').textContent = `≈ ${fmt(usdOf(B, out))} USD`;
  $('#sRate').textContent = `1 ${A} = ${r < 1 ? r.toFixed(8) : fmt(r)} ${B}`;
  $('#sFee').textContent = p.fee ? `${p.fee}% · ≈ $${fmt(usdOf(A, amt) * p.fee / 100)}` : 'Free';
  $$('#sPairs button').forEach((b, i) => { b.style.background = i === pairIdx ? 'var(--ink)' : ''; b.style.color = i === pairIdx ? '#fff' : ''; });
}
const doFlip = () => { flipped = !flipped; sRot += 180; $('#sFlip').style.transform = `rotate(${sRot}deg)`;
  [$('#sPay'), $('#sGet')].forEach((el, i) => el.animate([{ transform: `translateY(${i ? -30 : 30}px)`, opacity: .4 }, { transform: 'none', opacity: 1 }], { duration: 500, easing: 'cubic-bezier(.22,1,.36,1)' }));
  renderSwap(); };
$('#sFlip').onclick = () => { doFlip(); $('[data-tabs=swapmode]')._set(flipped ? 'sell' : 'buy'); };
handlers.swapmode = id => { if ((id === 'sell') !== flipped) doFlip(); };
$('#sMax').onclick = () => { const p = P(); payAmt[p.a] = parseFloat(p.balA.replace(/,/g, '')); if (flipped) doFlip(); renderSwap(); };
setInterval(() => { Z.swapPairs.forEach(p => { if (p.b === 'USDT') p.rate *= 1 + (Math.random() - .5) * .003; }); renderSwap(); }, 3000);

// slide to swap
(() => {
  const s = $('#slide'), h = s.querySelector('.h'), fill = s.querySelector('.fill'), lbl = s.querySelector('.lbl');
  let x0 = 0, dx = 0, drag = false; const max = () => s.offsetWidth - h.offsetWidth - 12;
  const setX = x => { dx = Math.max(0, Math.min(max(), x)); h.style.transform = `translateX(${dx}px)`; fill.style.width = `${dx + 54}px`;
    lbl.style.opacity = 1 - dx / max(); h.setAttribute('aria-valuenow', Math.round(dx / max() * 100)); };
  const complete = () => { s.classList.add('done'); h.style.transition = 'transform .3s'; setX(max());
    lbl.textContent = 'Swapped ✓ (demo)'; lbl.style.opacity = 1; navigator.vibrate?.(12);
    setTimeout(() => { s.classList.remove('done'); lbl.textContent = 'Slide to swap  ›››'; setX(0); setTimeout(() => h.style.transition = '', 300); }, 2200); };
  h.addEventListener('pointerdown', e => { drag = true; x0 = e.clientX - dx; h.setPointerCapture(e.pointerId); h.style.transition = ''; fill.style.transition = ''; });
  h.addEventListener('pointermove', e => drag && setX(e.clientX - x0));
  h.addEventListener('pointerup', () => { if (!drag) return; drag = false;
    if (dx > max() * .88) complete(); else { h.style.transition = 'transform .5s cubic-bezier(.34,1.56,.64,1)'; fill.style.transition = 'width .5s cubic-bezier(.34,1.56,.64,1)'; setX(0); } });
  h.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === 'ArrowRight' && dx > max() * .8) complete(); else if (e.key === 'ArrowRight') setX(dx + max() / 5); else if (e.key === 'ArrowLeft') setX(dx - max() / 5); });
})();

/* ---------- cards fan ---------- */
const types = Object.keys(Z.cards), fan = $('#fan');
const finishes = { virtual: ['pearl', 'iris'], physical: ['charcoal', 'pearl'], business: ['coral', 'charcoal'] };
fan.innerHTML = types.map(t => { const c = Z.cards[t]; return `<div class="bcard ${c.cls} ${t === 'virtual' ? 'shimmer' : ''}" data-t="${t}">
  <div class="t"><span>${c.name}<small>${c.sub}</small></span><span style="font-family:var(--font-sans);font-size:12px;font-weight:700">ZIXO</span></div>
  <svg class="mark" viewBox="0 0 80 110" style="fill:currentColor"><use href="#logo-mark"/></svg>
  <div class="chip"></div><div class="b"><span>•••• ${c.last}</span><span class="brand">VISA</span></div></div>`; }).join('');
let cardIdx = 0, frozen = false;
function layoutFan() {
  $$('#fan .bcard').forEach((el, i) => {
    const off = (i - cardIdx + types.length) % types.length, o = off === 2 ? -1 : off;
    const mob = innerWidth < 600;
    el.style.transform = `translateX(${o * (mob ? 40 : 80)}px) translateZ(${-Math.abs(o) * 120}px) rotateY(${o * -18}deg) rotate(${o * 4}deg)`;
    el.style.zIndex = 10 - Math.abs(o); el.style.opacity = Math.abs(o) ? .75 : 1;
    el.style.filter = (o === 0 && frozen) ? 'grayscale(1) brightness(1.05) blur(.5px)' : Math.abs(o) ? 'saturate(.8)' : '';
  });
  const c = Z.cards[types[cardIdx]];
  $('#cardSpec').innerHTML = c.spec.map(([k, v]) => `<li><span>${k}</span>${v}</li>`).join('');
  $('#cardDots').innerHTML = [c.cls].concat(finishes[types[cardIdx]].filter(f => f !== c.cls)).map((f, i) => {
    const bg = { pearl: 'linear-gradient(135deg,#f1ede4,#e6e1f0)', charcoal: '#2a2a29', coral: '#F26A35', iris: 'linear-gradient(135deg,#dfe7f5,#f3e3ec,#e0f0ee)' }[f];
    return `<button aria-label="${f} finish" aria-pressed="${i === 0}" data-f="${f}" style="background:${bg}"></button>`; }).join('');
  $$('#cardDots button').forEach(b => b.onclick = () => { const el = $(`#fan .bcard[data-t=${types[cardIdx]}]`);
    el.classList.remove('pearl', 'charcoal', 'coral', 'iris'); el.classList.add(b.dataset.f);
    if (b.dataset.f === 'iris') el.style.background = 'var(--iris)'; else el.style.background = '';
    el.style.color = b.dataset.f === 'charcoal' || b.dataset.f === 'coral' ? '#fff' : '#222';
    $$('#cardDots button').forEach(x => x.setAttribute('aria-pressed', x === b)); });
}
handlers.ctype = id => { cardIdx = types.indexOf(id); layoutFan(); };
let fx = null;
fan.addEventListener('pointerdown', e => fx = e.clientX);
addEventListener('pointerup', e => { if (fx == null) return; const d = e.clientX - fx; fx = null;
  if (Math.abs(d) > 40) $('[data-tabs=ctype]')._set(types[(cardIdx + (d < 0 ? 1 : -1) + 3) % 3]); });
$('#freezeBtn').onclick = () => { frozen = !frozen; $('#freezeBtn').classList.toggle('on', frozen); $('#freezeBtn').setAttribute('aria-pressed', frozen);
  $('#freezeLbl').textContent = frozen ? 'Unfreeze' : 'Freeze card'; layoutFan(); };

/* ---------- analytics chart ---------- */
const seeded = s => () => (s = (s * 9301 + 49297) % 233280) / 233280;
const ranges = { week: { n: 7, labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] }, month: { n: 31, labels: ['Oct 1', '8', '15', '22', '31'] }, year: { n: 48, labels: ['Jan', 'Mar', 'May', 'Jul', 'Sep', 'Nov'] } };
const totals = { income: { week: 4200, month: 12058, year: 138420 }, expense: { week: 912, month: 3140, year: 41260 } };
let metric = 'income', range = 'month';
function drawChart() {
  const ch = $('#chart'), r = ranges[range], rnd = seeded(metric.length * 7 + r.n);
  const vals = Array.from({ length: r.n }, (_, i) => metric === 'income' ? (i % 7 === 4 || i === Math.floor(r.n * .6) ? .9 + rnd() * .1 : .15 + rnd() * .35) : .2 + rnd() * .6);
  const hi = vals.indexOf(Math.max(...vals));
  ch.classList.remove('in');
  ch.querySelectorAll('.bar').forEach(b => b.remove());
  vals.forEach((v, i) => { const b = document.createElement('i'); b.className = 'bar' + (i === hi ? (metric === 'income' ? ' hi' : ' ex') : '');
    b.style.height = v * 100 + '%'; b.style.transitionDelay = `${i * (400 / r.n)}ms`; ch.appendChild(b); });
  $('#axis').innerHTML = r.labels.map(l => `<span>${l}</span>`).join('');
  const tot = totals[metric][range], peak = Math.round(tot / r.n * 2.6);
  $('#anLbl').textContent = metric === 'income' ? 'My income' : 'My spending';
  const [w, d] = fmt(tot).split('.'); $('#anBig').innerHTML = `$${w}<span class="dec">.${d}</span>`;
  $('#anDelta').innerHTML = metric === 'income' ? `<span class="up">▲ 6.07%</span> <span style="color:var(--muted)">vs last ${range}</span>` : `<span class="dn">▲ 3.70%</span> <span style="color:var(--muted)">vs last ${range}</span>`;
  requestAnimationFrame(() => requestAnimationFrame(() => { ch.classList.add('in');
    const hb = ch.querySelectorAll('.bar')[hi], tip = $('#tip');
    tip.textContent = `$${fmt(peak, 0)}`; tip.style.left = hb.offsetLeft + hb.offsetWidth / 2 + 'px'; tip.style.top = hb.offsetTop + 'px'; }));
}
handlers.metric = id => { metric = id; drawChart(); };
handlers.range = id => { range = id; drawChart(); };
// donut
(() => { const cats = [['Shopping', 1240, '#414140'], ['Bills', 1040, '#C9C9C5'], ['Transport', 520, '#9A9A96'], ['Dining', 340, '#F26A35']];
  const tot = cats.reduce((a, c) => a + c[1], 0); let acc = 0;
  $('#donut').innerHTML = `<circle cx="21" cy="21" r="15.9" fill="none" stroke="rgba(20,20,20,.06)" stroke-width="5"/>` + cats.map(([, v, c]) => {
    const p = v / tot * 100, s = `<circle cx="21" cy="21" r="15.9" fill="none" stroke="${c}" stroke-width="5" stroke-dasharray="${p - 1} ${101 - p}" stroke-dashoffset="${25 - acc}"/>`; acc += p; return s; }).join('');
  $('#donutLegend').innerHTML = cats.map(([n, v, c]) => `<span style="display:flex;gap:8px;align-items:center"><i style="width:8px;height:8px;border-radius:50%;background:${c}"></i>${n} <b style="font-weight:600;margin-left:auto;padding-left:10px">$${fmt(v, 0)}</b></span>`).join('');
})();

/* ---------- security ---------- */
$('#tfa').onclick = e => e.currentTarget.setAttribute('aria-checked', e.currentTarget.getAttribute('aria-checked') !== 'true');
if (!RM) { const rg = $('#rings'); rg.addEventListener('pointermove', e => { const r = rg.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
  rg.querySelectorAll('i').forEach((el, i) => el.style.transform = `translate(calc(-50% + ${x * i * 8}px), calc(-50% + ${y * i * 8}px))`); });
  rg.addEventListener('pointerleave', () => rg.querySelectorAll('i').forEach(el => el.style.transform = '')); }

/* ---------- pricing ---------- */
const plansEl = $('#plans');
plansEl.innerHTML = Z.plans.map(p => `<article class="glass plan ${p.id === 'pro' ? 'pro' : ''} rv">
  ${p.id === 'pro' ? '<div class="head-art"></div>' : ''}
  <div class="ph"><b>${p.name}</b>${p.badge ? `<span class="badge">${p.badge}</span>` : ''}</div>
  <div class="price">$<span class="price-num" data-id="${p.id}">${p.m}</span><small> / <span class="per">month</span></small></div>
  <div class="note" data-note="${p.id}">${p.note}</div>
  <ul>${p.feats.map(f => `<li>${f}</li>`).join('')}</ul>
  <a href="#download" class="btn ${p.id === 'pro' ? 'btn-dark' : 'btn-light'}">${p.cta}</a></article>`).join('');
plansEl.querySelectorAll('.rv').forEach(el => io.observe(el));
handlers.billing = id => { Z.plans.forEach(p => { const el = $(`.price-num[data-id=${p.id}]`); el.classList.add('flip');
  setTimeout(() => { el.textContent = id === 'yearly' ? (p.y ? fmt(p.y) : '0') : (p.m ? fmt(p.m) : '0'); el.classList.remove('flip');
    $(`[data-note=${p.id}]`).textContent = p.m === 0 ? 'Free forever' : id === 'yearly' ? `≈ $${fmt(p.y / 12)} / month, billed yearly` : ''; }, 200); });
  $$('.plan .per').forEach(e => e.textContent = id === 'yearly' ? 'year' : 'month'); };

/* ---------- FAQ ---------- */
handlers.faqcat = id => { $('#faqList').innerHTML = Z.faq[id].map(([q, a], i) => `<details ${i === 0 ? 'open' : ''}><summary>${q}<span class="pm"><svg width="14" height="14"><use href="#i-plus"/></svg></span></summary><div class="ans">${a}</div></details>`).join('');
  $$('#faqList details').forEach(d => d.addEventListener('toggle', () => { if (d.open) { $$('#faqList details').forEach(o => o !== d && (o.open = false));
    d.querySelector('.ans').animate([{ opacity: 0, transform: 'translateY(-6px)' }, { opacity: 1, transform: 'none' }], { duration: 350, easing: 'ease-out' }); } })); };

/* ---------- init ---------- */
const inits = $$('[data-tabs]').map(Tabs);
renderSwap(); convert();
const runAll = () => inits.forEach(f => f());
document.fonts?.ready.then(runAll); runAll();
addEventListener('resize', () => { $$('[data-tabs]').forEach(t => t._refresh()); layoutFan(); });
onScroll();
})();
