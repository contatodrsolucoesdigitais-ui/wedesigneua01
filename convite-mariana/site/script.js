// Convite Mariana Borges · 15 anos — animação por página, elemento a elemento
(function () {
  const pages = [...document.querySelectorAll('.page')];
  const nav = document.querySelector('.dots');
  const scroller = document.getElementById('convite');

  // bolinhas de navegação
  const dots = pages.map(p => {
    const a = document.createElement('a');
    a.href = '#' + p.id;
    a.setAttribute('aria-label', p.id);
    a.addEventListener('click', e => { e.preventDefault(); p.scrollIntoView({ behavior: 'smooth' }); });
    nav.appendChild(a);
    return a;
  });

  // poeira dourada subindo em cada página
  pages.forEach(p => {
    const dust = document.createElement('div');
    dust.className = 'dust';
    for (let i = 0; i < 16; i++) {
      const b = document.createElement('b');
      const s = 0.6 + Math.random() * 1.6;
      b.style.cssText =
        `left:${Math.random() * 100}%;width:${s}cqw;height:${s}cqw;` +
        `--t:${7 + Math.random() * 8}s;--w:${Math.random() * 6}s;` +
        `--x:${(Math.random() - .5) * 30}cqw;--o:${.35 + Math.random() * .5}`;
      dust.appendChild(b);
    }
    p.querySelector('.stage').appendChild(dust);
  });

  // ao entrar numa página, os elementos aparecem um a um; ao sair, reinicia
  const io = new IntersectionObserver(entries => {
    entries.forEach(en => {
      const i = pages.indexOf(en.target);
      if (en.isIntersecting) {
        en.target.classList.add('in');
        dots.forEach((d, j) => d.classList.toggle('on', j === i));
        history.replaceState(null, '', '#' + en.target.id);
      } else {
        en.target.classList.remove('in');
      }
    });
  }, { root: scroller, threshold: 0.6 });
  pages.forEach(p => io.observe(p));

  // abre direto na página do link (#local, #confirmacao...)
  if (location.hash) {
    const t = document.querySelector(location.hash);
    if (t) t.scrollIntoView();
  }

  // dica "role" leva para a próxima página
  document.querySelectorAll('.hint').forEach(h => h.addEventListener('click', e => {
    e.preventDefault();
    document.querySelector(h.getAttribute('href')).scrollIntoView({ behavior: 'smooth' });
  }));

  // teclado: setas / PageUp / PageDown
  addEventListener('keydown', e => {
    const cur = pages.findIndex(p => p.classList.contains('in'));
    let n = null;
    if (['ArrowDown', 'PageDown', ' '].includes(e.key)) n = cur + 1;
    if (['ArrowUp', 'PageUp'].includes(e.key)) n = cur - 1;
    if (n !== null && pages[n]) { e.preventDefault(); pages[n].scrollIntoView({ behavior: 'smooth' }); }
  });
})();
