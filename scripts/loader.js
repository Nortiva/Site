/* Tela de carregamento da Nortiva (1,5 s).
   PARA REMOVER: apague este arquivo e a linha <script src="loader.js"></script> do index.html. */
(() => {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const TEMPO = 1500; /* duração total em ms */

  const css = document.createElement('style');
  css.textContent = `
    html.is-loading { overflow: hidden; }
    #loader { position: fixed; inset: 0; z-index: 9999; display: grid; place-items: center; background: #F4F6FA; transition: opacity .35s ease, visibility .35s; }
    #loader.is-done { opacity: 0; visibility: hidden; }
    #loader .l-box { display: grid; justify-items: center; gap: 22px; }
    #loader img { width: 150px; height: auto; opacity: 0; transform: translateY(8px); animation: l-in .6s cubic-bezier(.2,.7,.2,1) .1s forwards; }
    #loader .l-bar { width: 150px; height: 2px; background: #dde1ea; overflow: hidden; }
    #loader .l-bar i { display: block; height: 100%; background: #244BFF; transform: scaleX(0); transform-origin: left; animation: l-bar ${TEMPO - 350}ms cubic-bezier(.4,0,.2,1) forwards; }
    @keyframes l-in { to { opacity: 1; transform: none; } }
    @keyframes l-bar { to { transform: scaleX(1); } }
  `;
  document.head.appendChild(css);

  const el = document.createElement('div');
  el.id = 'loader';
  el.setAttribute('aria-hidden', 'true');
  el.innerHTML = '<div class="l-box"><img src="/assets/img/logo-grafite-recortada.png" alt=""><div class="l-bar"><i></i></div></div>';
  document.documentElement.appendChild(el);
  document.documentElement.classList.add('is-loading');

  setTimeout(() => {
    el.classList.add('is-done');
    document.documentElement.classList.remove('is-loading');
    setTimeout(() => el.remove(), 400);
  }, TEMPO);
})();
