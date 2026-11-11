/* Feito por Matheus - NORTIVA STUDIO */

const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

/* Cabeçalho: linha de apoio ao rolar e menu no mobile */
(() => {
  const header = document.querySelector('[data-header]');
  const toggle = document.querySelector('.menu-toggle');
  const nav = document.getElementById('menu');
  if (!header || !toggle || !nav) return;

  const onScroll = () => header.classList.toggle('is-stuck', scrollY > 8);
  onScroll();
  addEventListener('scroll', onScroll, { passive: true });

  const close = () => {
    nav.classList.remove('is-open');
    toggle.setAttribute('aria-expanded', 'false');
  };

  toggle.addEventListener('click', () => {
    const open = nav.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', String(open));
  });

  nav.querySelectorAll('a').forEach(a => a.addEventListener('click', close));
  document.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
  matchMedia('(min-width: 901px)').addEventListener('change', close);

  /* Seção atual no menu */
  if (!('IntersectionObserver' in window)) return;
  const links = new Map();
  nav.querySelectorAll('a[href^="#"]').forEach(a => links.set(a.getAttribute('href').slice(1), a));
  const spy = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      const link = links.get(entry.target.id);
      if (link) {
        if (entry.isIntersecting) {
          links.forEach(l => l.removeAttribute('aria-current'));
          link.setAttribute('aria-current', 'true');
        } else {
          link.removeAttribute('aria-current');
        }
      }
    });
  }, { rootMargin: '-40% 0px -55% 0px' });
  links.forEach((_, id) => { const s = document.getElementById(id); if (s) spy.observe(s); });
})();


/* Faixa: o mesmo processo, de dois jeitos */
(() => {
  const flow = document.getElementById('fluxo');
  if (!flow) return;

  const buttons = flow.querySelectorAll('[data-set]');
  const items = [...flow.querySelectorAll('.step')].map(step => ({
    text: step.querySelector('.step-text'),
    tag: step.querySelector('.step-tag')
  }));
  let touched = false;

  function paint(state, animate) {
    flow.dataset.state = state;
    buttons.forEach(b => b.setAttribute('aria-pressed', String(b.dataset.set === state)));

    items.forEach(({ text, tag }, i) => {
      const apply = () => {
        text.textContent = text.dataset[state];
        tag.textContent = tag.dataset[state];
        text.classList.remove('is-out');
        tag.classList.remove('is-out');
      };
      if (!animate) return apply();
      text.classList.add('is-out');
      tag.classList.add('is-out');
      setTimeout(apply, 140 + i * 90);
    });
  }

  buttons.forEach(b => b.addEventListener('click', () => {
    touched = true;
    if (flow.dataset.state !== b.dataset.set) paint(b.dataset.set, !reduceMotion);
  }));

  /* Entrada: começa no manual e, quando a faixa aparece, muda uma vez para a versão Nortiva */
  if (reduceMotion || !('IntersectionObserver' in window)) {
    paint('nortiva', false);
    return;
  }

  paint('manual', false);
  const watch = new IntersectionObserver(entries => {
    if (!entries[0].isIntersecting) return;
    watch.disconnect();
    setTimeout(() => { if (!touched) paint('nortiva', true); }, 900);
  }, { threshold: 0.3 });
  watch.observe(flow);
})();


/* Soluções: abas no desktop; no celular, quatro linhas que abrem ao tocar */
(() => {
  const tabs = [...document.querySelectorAll('.tab')];
  const panels = tabs.map(t => document.getElementById(t.getAttribute('aria-controls')));
  if (!tabs.length) return;

  const heads = panels.map(p => p.querySelector('h3'));
  const mobile = matchMedia('(max-width: 900px)');
  let current = 0;

  /* desktop: uma aba por vez */
  function select(index, focus) {
    current = index;
    tabs.forEach((tab, i) => {
      const on = i === index;
      tab.setAttribute('aria-selected', String(on));
      tab.tabIndex = on ? 0 : -1;
      panels[i].hidden = !on;
    });
    if (focus) tabs[index].focus();
  }

  tabs.forEach((tab, i) => {
    tab.addEventListener('click', () => select(i));
    tab.addEventListener('keydown', e => {
      const last = tabs.length - 1;
      const keys = {
        ArrowDown: i === last ? 0 : i + 1,
        ArrowRight: i === last ? 0 : i + 1,
        ArrowUp: i === 0 ? last : i - 1,
        ArrowLeft: i === 0 ? last : i - 1,
        Home: 0,
        End: last
      };
      if (e.key in keys) { e.preventDefault(); select(keys[e.key], true); }
    });
  });

  /* celular: abre uma linha e fecha as outras */
  function toggle(i) {
    const open = !panels[i].classList.contains('is-open');
    panels.forEach((p, k) => {
      const on = k === i && open;
      p.classList.toggle('is-open', on);
      heads[k].setAttribute('aria-expanded', String(on));
    });
    if (open) {
      requestAnimationFrame(() => {
        const top = heads[i].getBoundingClientRect().top;
        if (top < 80 || top > innerHeight * 0.6) heads[i].scrollIntoView({ block: 'start', behavior: 'smooth' });
      });
    }
  }

  heads.forEach((h, i) => {
    h.addEventListener('click', () => { if (mobile.matches) toggle(i); });
    h.addEventListener('keydown', e => {
      if (mobile.matches && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); toggle(i); }
    });
  });

  function layout() {
    if (mobile.matches) {
      panels.forEach((p, k) => {
        p.hidden = false;
        p.classList.remove('is-open');
        heads[k].setAttribute('role', 'button');
        heads[k].tabIndex = 0;
        heads[k].setAttribute('aria-expanded', 'false');
      });
    } else {
      heads.forEach(h => { h.removeAttribute('role'); h.removeAttribute('tabindex'); h.removeAttribute('aria-expanded'); });
      panels.forEach(p => p.classList.remove('is-open'));
      select(current);
    }
  }

  mobile.addEventListener('change', layout);
  layout();
})();


/* Entrada suave ao rolar */
(() => {
  const items = document.querySelectorAll('.reveal');
  if (!items.length) return;
  if (reduceMotion || !('IntersectionObserver' in window)) {
    items.forEach(el => el.classList.add('is-in'));
    return;
  }
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); }
    });
  }, { rootMargin: '0px 0px -8% 0px' });
  items.forEach(el => io.observe(el));
})();
