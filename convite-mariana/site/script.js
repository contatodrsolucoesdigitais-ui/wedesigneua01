// Convite Mariana Borges · 15 anos
// Abertura com selo, telas com transição em círculo, elementos entrando um a um,
// brilho dourado em canvas e contagem regressiva. Sem música.
(function () {
  const pages = [...document.querySelectorAll('.page')];
  const intro = document.getElementById('intro');
  const hint = document.querySelector('.hint');
  const bar = document.querySelector('.progress');
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const DUR = 1250;
  let cur = -1, busy = false, hintTimer;

  /* ---------- texto: separa letras e linhas para animar uma a uma ---------- */
  document.querySelectorAll('.chars').forEach(el => {
    let i = 0;
    [...el.childNodes].forEach(node => {
      if (node.nodeType !== 3) return;
      const frag = document.createDocumentFragment();
      // mantém palavras inteiras na mesma linha
      node.textContent.split(/(\s+)/).forEach(part => {
        if (!part) return;
        if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(' ')); i++; return; }
        const w = document.createElement('span');
        w.style.whiteSpace = 'nowrap';
        [...part].forEach(c => {
          const s = document.createElement('span');
          s.className = 'ch'; s.textContent = c; s.style.setProperty('--i', i++);
          w.appendChild(s);
        });
        frag.appendChild(w);
      });
      node.replaceWith(frag);
    });
    el.setAttribute('aria-label', el.textContent);
  });
  document.querySelectorAll('.lines').forEach(el => {
    const parts = el.innerHTML.split(/<br\s*\/?>/i);
    el.innerHTML = parts.map((p, i) => `<span class="ln" style="--i:${i}">${p}</span>`).join('<br>');
  });

  /* ---------- brilhos pontuais (coordenadas da arte 336 × 763) ---------- */
  document.querySelectorAll('.twinkles').forEach(box => {
    box.dataset.pts.split(' ').forEach((pt, n) => {
      const [x, y] = pt.split(',').map(Number);
      const i = document.createElement('i');
      i.style.cssText = `left:${x / 3.36}%;top:${y / 7.63}%;--t:${2.4 + Math.random() * 2.2}s;--w:${(n * .37) % 2.4}s`;
      const s = .6 + Math.random() * .8;
      i.style.width = i.style.height = `${5 * s}cqw`;
      i.style.margin = `-${2.5 * s}cqw 0 0 -${2.5 * s}cqw`;
      box.appendChild(i);
    });
  });

  /* ---------- navegação entre telas ---------- */
  function go(n, opts = {}) {
    if (busy || n === cur || n < 0 || n >= pages.length) return;
    const prev = pages[cur];
    const next = pages[n];
    const back = n < cur;
    busy = !opts.instant;
    hideHint();

    next.classList.remove('in', 'leaving');
    next.classList.add('active');
    next.classList.toggle('back', back);
    if (prev && !opts.instant && !reduce) {
      prev.classList.remove('active');
      prev.classList.add('leaving');
      next.classList.add('entering');
      const f = document.createElement('div');
      f.className = 'flash';
      f.style.top = back ? '45%' : '55%';
      document.body.appendChild(f);
      setTimeout(() => f.remove(), DUR + 50);
      setTimeout(() => {
        prev.classList.remove('leaving', 'in');
        next.classList.remove('entering');
        busy = false;
      }, DUR);
      // os elementos começam a entrar enquanto o círculo abre
      setTimeout(() => next.classList.add('in'), 380);
    } else {
      if (prev) prev.classList.remove('active', 'in');
      requestAnimationFrame(() => next.classList.add('in'));
      busy = false;
    }
    cur = n;
    document.body.dataset.page = next.id;
    bar.style.setProperty('--p', (n + 1) / pages.length);
    try { history.replaceState(null, '', '#' + next.id); } catch (e) {}
    hintTimer = setTimeout(showHint, 4200);
  }
  const nextPage = () => go(cur === pages.length - 1 ? 0 : cur + 1);
  const prevPage = () => go(cur - 1);

  function showHint() {
    const last = cur === pages.length - 1;
    hint.classList.toggle('up', last);
    hint.querySelector('span').textContent = last ? 'início' : 'deslize';
    hint.setAttribute('aria-label', last ? 'Voltar ao início' : 'Próxima página');
    hint.classList.add('show');
  }
  function hideHint() { clearTimeout(hintTimer); hint.classList.remove('show'); }
  hint.addEventListener('click', nextPage);

  // roda do mouse / trackpad
  let acc = 0, accT;
  addEventListener('wheel', e => {
    if (intro && !intro.classList.contains('gone')) return;
    acc += e.deltaY; clearTimeout(accT); accT = setTimeout(() => acc = 0, 200);
    if (Math.abs(acc) > 60 && !busy) { acc > 0 ? nextPage() : prevPage(); acc = 0; }
  }, { passive: true });

  // toque: deslizar para cima/baixo (ou para os lados)
  let sx = 0, sy = 0, st = 0;
  addEventListener('touchstart', e => { sx = e.touches[0].clientX; sy = e.touches[0].clientY; st = Date.now(); }, { passive: true });
  addEventListener('touchend', e => {
    const dx = e.changedTouches[0].clientX - sx, dy = e.changedTouches[0].clientY - sy;
    if (Date.now() - st > 900) return;
    if (Math.abs(dy) > 45 && Math.abs(dy) > Math.abs(dx)) dy < 0 ? nextPage() : prevPage();
    else if (Math.abs(dx) > 60) dx < 0 ? nextPage() : prevPage();
  }, { passive: true });

  // teclado
  addEventListener('keydown', e => {
    if (intro && !intro.classList.contains('gone')) { if (e.key === 'Enter' || e.key === ' ') openInvite(); return; }
    if (['ArrowDown', 'ArrowRight', 'PageDown', ' '].includes(e.key)) { e.preventDefault(); nextPage(); }
    if (['ArrowUp', 'ArrowLeft', 'PageUp'].includes(e.key)) { e.preventDefault(); prevPage(); }
  });

  // parallax suave do fundo com o mouse
  addEventListener('pointermove', e => {
    if (e.pointerType !== 'mouse' || reduce) return;
    const x = (e.clientX / innerWidth - .5) * -1.6, y = (e.clientY / innerHeight - .5) * -1.6;
    pages.forEach(p => { p.style.setProperty('--px', x + '%'); p.style.setProperty('--py', y + '%'); });
  });

  /* ---------- abertura ---------- */
  const start = Math.max(0, pages.findIndex(p => '#' + p.id === location.hash));
  let opened = false;
  function openInvite() {
    if (opened) return;
    opened = true;
    intro.classList.add('open');
    sparkleBurst(innerWidth / 2, innerHeight / 2, 70);
    setTimeout(() => go(start, { instant: true }), reduce ? 0 : 500);
    setTimeout(() => intro.classList.add('gone'), reduce ? 0 : 1900);
  }
  intro.addEventListener('click', openInvite);

  /* ---------- contagem regressiva (21h de Brasília) ---------- */
  const target = new Date('2026-11-14T21:00:00-03:00').getTime();
  const cells = {};
  document.querySelectorAll('#count b').forEach(b => cells[b.dataset.k] = b);
  function tick() {
    let s = Math.max(0, Math.floor((target - Date.now()) / 1000));
    const v = { d: Math.floor(s / 86400), h: Math.floor(s % 86400 / 3600), m: Math.floor(s % 3600 / 60), s: s % 60 };
    for (const k in v) {
      const t = String(v[k]).padStart(2, '0');
      if (cells[k].textContent !== t) {
        cells[k].textContent = t;
        cells[k].classList.remove('tick'); void cells[k].offsetWidth; cells[k].classList.add('tick');
      }
    }
  }
  tick(); setInterval(tick, 1000);

  /* ---------- poeira e faíscas douradas (canvas) ---------- */
  const cv = document.getElementById('glitter');
  const ctx = cv.getContext('2d');
  let W, H, dpr, motes = [], sparks = [];
  function resize() {
    dpr = Math.min(devicePixelRatio || 1, 2);
    W = cv.width = innerWidth * dpr; H = cv.height = innerHeight * dpr;
  }
  resize(); addEventListener('resize', resize);
  const rnd = (a, b) => a + Math.random() * (b - a);
  function mote(y) {
    return { x: rnd(0, W), y: y ?? rnd(0, H), r: rnd(.5, 1.8) * dpr, vy: rnd(.12, .45) * dpr,
      vx: rnd(-.12, .12) * dpr, a: rnd(.15, .8), ph: rnd(0, 6.28), sp: rnd(.01, .04) };
  }
  for (let i = 0; i < 70; i++) motes.push(mote());
  function sparkleBurst(x, y, n) {
    for (let i = 0; i < n; i++) {
      const ang = rnd(0, 6.28), v = rnd(1.5, 7) * dpr;
      sparks.push({ x: x * dpr, y: y * dpr, vx: Math.cos(ang) * v, vy: Math.sin(ang) * v, life: 1, r: rnd(1, 2.6) * dpr });
    }
  }
  function star(x, y, r, a) {
    ctx.globalAlpha = a;
    ctx.beginPath();
    ctx.moveTo(x, y - r * 3); ctx.lineTo(x + r * .5, y - r * .5); ctx.lineTo(x + r * 3, y);
    ctx.lineTo(x + r * .5, y + r * .5); ctx.lineTo(x, y + r * 3); ctx.lineTo(x - r * .5, y + r * .5);
    ctx.lineTo(x - r * 3, y); ctx.lineTo(x - r * .5, y - r * .5); ctx.closePath(); ctx.fill();
  }
  function frame() {
    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = '#f6dfae';
    ctx.shadowColor = 'rgba(255, 225, 160, .9)'; ctx.shadowBlur = 6 * dpr;
    for (const m of motes) {
      m.y -= m.vy; m.x += m.vx + Math.sin(m.ph) * .15 * dpr; m.ph += m.sp;
      if (m.y < -10) Object.assign(m, mote(H + 10));
      const a = m.a * (.55 + .45 * Math.sin(m.ph * 2));
      if (m.r > 1.5 * dpr && a > .6) star(m.x, m.y, m.r * .7, a);
      else { ctx.globalAlpha = a; ctx.beginPath(); ctx.arc(m.x, m.y, m.r, 0, 6.28); ctx.fill(); }
    }
    for (let i = sparks.length - 1; i >= 0; i--) {
      const s = sparks[i];
      s.x += s.vx; s.y += s.vy; s.vx *= .96; s.vy = s.vy * .96 + .04 * dpr; s.life -= .012;
      if (s.life <= 0) { sparks.splice(i, 1); continue; }
      star(s.x, s.y, s.r, Math.min(1, s.life * 1.4));
    }
    ctx.globalAlpha = 1;
    if (!document.hidden) requestAnimationFrame(frame);
  }
  if (!reduce) {
    requestAnimationFrame(frame);
    document.addEventListener('visibilitychange', () => { if (!document.hidden) requestAnimationFrame(frame); });
    // pequena chuva de faíscas ao chegar na última tela
    let burst = false;
    new MutationObserver(() => {
      const on = pages[pages.length - 1].classList.contains('in');
      if (on && !burst) setTimeout(() => sparkleBurst(innerWidth / 2, innerHeight * .56, 40), 3000);
      burst = on;
    }).observe(pages[pages.length - 1], { attributes: true, attributeFilter: ['class'] });
  }
})();
