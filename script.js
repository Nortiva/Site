/* Feito por Matheus - NORTIVA STUDIO */

/* ============================================================
   CONFIGURAÇÃO — altere os contatos SOMENTE aqui.
   WHATSAPP_NUMBER: código do país + DDD + número, só dígitos.
   INSTAGRAM_USER: usuário do Instagram, sem @.
   PORTAL_URL: endereço do painel (página portal.html). Se ficar
   vazio, o botão "Acessar painel" fica oculto.
   ============================================================ */
const WHATSAPP_NUMBER = "5538998337049";
const INSTAGRAM_USER = "thenortiva";
const PORTAL_URL = "";

(function () {
  "use strict";
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const waLink = (text) => `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;

  // WhatsApp: qualquer elemento com data-wa abre a conversa com a mensagem indicada
  $$("[data-wa]").forEach((el) => {
    el.href = waLink(el.dataset.wa);
    el.target = "_blank";
    el.rel = "noopener noreferrer";
  });

  // Telefone (texto formatado + link) e Instagram
  const d = WHATSAPP_NUMBER.replace(/\D/g, "");
  const rest = d.slice(4);
  const fmt = `(${d.slice(2, 4)}) ${rest.length === 9 ? rest.slice(0, 5) + "-" + rest.slice(5) : rest.slice(0, 4) + "-" + rest.slice(4)}`;
  $$("[data-phone]").forEach((el) => { el.textContent = fmt; el.href = "tel:+" + d; });
  $$("[data-ig]").forEach((el) => {
    el.href = `https://instagram.com/${INSTAGRAM_USER}`;
    el.target = "_blank";
    el.rel = "noopener noreferrer";
    const t = el.hasAttribute("data-ig-text") ? el : $("[data-ig-text]", el);
    if (t) t.textContent = "@" + INSTAGRAM_USER;
  });

  // Botão do painel (portal.html)
  $$("[data-portal]").forEach((el) => { PORTAL_URL ? (el.href = PORTAL_URL) : (el.hidden = true); });

  // Menu mobile (só existe na página principal)
  const burger = $("#burger"), menu = $("#menu");
  const setMenu = (open) => {
    if (!menu || !burger) return;
    menu.classList.toggle("open", open);
    burger.setAttribute("aria-expanded", open);
    burger.setAttribute("aria-label", open ? "Fechar menu" : "Abrir menu");
    document.body.style.overflow = open ? "hidden" : "";
  };
  if (burger && menu) {
    burger.addEventListener("click", () => setMenu(!menu.classList.contains("open")));
    $$("a", menu).forEach((a) => a.addEventListener("click", () => setMenu(false)));
    document.addEventListener("keydown", (e) => e.key === "Escape" && setMenu(false));
  }

  // Nav com fundo ao rolar + botão flutuante depois do hero
  const nav = $("#nav"), fab = $(".fab"), hero = $(".hero"), cta = $("#orcamento");
  const onScroll = () => {
    const y = window.scrollY;
    if (nav) nav.classList.toggle("on", y > 20);
    if (fab && hero) {
      const pastHero = y > hero.offsetHeight * 0.6;
      const inCta = cta ? cta.getBoundingClientRect().top < window.innerHeight * 0.7 : false;
      fab.classList.toggle("show", pastHero && !inCta);
    }
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  // Animações de entrada
  const items = $$(".rv");
  items.forEach((el, i) => { el.style.setProperty("--d", (i % 3) * 0.09 + "s"); });
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    items.forEach((el) => io.observe(el));
  } else items.forEach((el) => el.classList.add("in"));

  // FAQ: abre um por vez
  const faq = $$(".faq details");
  faq.forEach((x) => x.addEventListener("toggle", () => {
    if (x.open) faq.forEach((o) => o !== x && (o.open = false));
  }));

  // Formulário -> monta a mensagem e abre o WhatsApp
  const form = $("#form"), err = $("#err");
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const f = new FormData(form);
      const nome = (f.get("nome") || "").trim();
      if (!nome) { err.hidden = false; form.nome.focus(); return; }
      err.hidden = true;
      const negocio = (f.get("negocio") || "").trim();
      const msg = (f.get("msg") || "").trim();
      let t = `Olá! Me chamo ${nome}`;
      if (negocio) t += ` e tenho o negócio: ${negocio}`;
      t += `.\nGostaria de um orçamento para: ${f.get("tipo")}.`;
      if (msg) t += `\n${msg}`;
      t += "\n(Enviado pelo site da Nortiva Studio)";
      window.open(waLink(t), "_blank", "noopener");
    });
    form.nome.addEventListener("input", () => (err.hidden = true));
  }

  // Portal: se uma imagem do jornal não existir, esconde o quadro dela
  $$(".entry-image img").forEach((img) => {
    const hide = () => { img.parentElement.hidden = true; };
    img.addEventListener("error", hide);
    if (img.complete && img.naturalWidth === 0 && img.getAttribute("loading") !== "lazy") hide();
  });

  const ano = $("#ano");
  if (ano) ano.textContent = new Date().getFullYear();
})();
