(() => {
  const track = document.querySelector('.service-track');
  const controls = document.querySelector('.slider-controls');
  const previous = controls.querySelector('[data-direction="-1"]');
  const next = controls.querySelector('[data-direction="1"]');
  document.documentElement.classList.add('js-ready');
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  function update() {
    const max = track.scrollWidth - track.clientWidth;
    controls.hidden = max < 2;
    previous.setAttribute('aria-disabled', String(track.scrollLeft < 2));
    next.setAttribute('aria-disabled', String(track.scrollLeft >= max - 2));
  }
  controls.querySelectorAll('button').forEach(button => button.addEventListener('click', () => {
    if (button.getAttribute('aria-disabled') === 'true') return;
    const step = track.querySelector('.service-card').getBoundingClientRect().width + parseFloat(getComputedStyle(track).gap);
    track.scrollBy({left: step * Number(button.dataset.direction), behavior: motion.matches ? 'instant' : 'smooth'});
  }));
  track.addEventListener('scroll', update, {passive:true});
  window.addEventListener('resize', update);
  update();
  if (motion.matches || !('IntersectionObserver' in window)) return;
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => { if(entry.isIntersecting){entry.target.classList.add('reveal');observer.unobserve(entry.target);} });
  }, {threshold:.1});
  document.querySelectorAll('.about, .care-heading, .process-intro').forEach(el=>observer.observe(el));
  motion.addEventListener('change', event=>{if(event.matches) observer.disconnect();});
})();


/* Ajusta o mockup do hero ao espaço disponível em qualquer resolução */
(() => {
  const box = document.querySelector('.hero-space');
  const mock = box && box.querySelector('.mockup');
  if (!mock) return;
  const W = 560, H = 400;
  function fit() {
    const w = box.clientWidth, h = box.clientHeight;
    if (!w || !h) return;
    const s = Math.min(w * .96 / W, h * .96 / H, 1);
    mock.style.transform = 'scale(' + s.toFixed(3) + ')';
  }
  fit();
  if ('ResizeObserver' in window) new ResizeObserver(fit).observe(box);
  addEventListener('resize', fit);
})();
