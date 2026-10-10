// NORTIVA — edite os dados e textos nesta primeira seção.
const WHATSAPP_NUMBER = '38998337049';
const detailCopy = {
  'Sites institucionais': 'Um site para apresentar sua empresa, seus serviços, sua história e seus diferenciais. Organizamos as informações e os caminhos de contato em uma experiência coerente com sua marca, adaptada para diferentes telas.',
  'Landing pages': 'Uma página focada em uma oferta, campanha ou serviço. Estruturamos o conteúdo para explicar o que você oferece e orientar o visitante a uma ação, como entrar em contato ou solicitar uma proposta.',
  'Automações': 'Entendemos os processos da sua empresa e planejamos automações para reduzir tarefas repetitivas e trabalho manual. A solução e as ferramentas são definidas conforme sua necessidade e o escopo do projeto.'
};

// Modal dos serviços.
const dialog = document.querySelector('#detail');
const title = document.querySelector('#dialog-title');
const description = document.querySelector('#dialog-description');

document.querySelectorAll('[data-detail]').forEach(button => {
  button.addEventListener('click', () => {
    title.textContent = button.dataset.detail;
    description.textContent = detailCopy[button.dataset.detail];
    dialog.showModal();
  });
});

document.querySelector('.dialog-close').addEventListener('click', () => dialog.close());
document.querySelector('.dialog-contact').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', event => {
  if (event.target !== dialog) return;
  const box = dialog.getBoundingClientRect();
  const outside = event.clientX < box.left || event.clientX > box.right ||
    event.clientY < box.top || event.clientY > box.bottom;
  if (outside) dialog.close();
});

// Navegação móvel: sincroniza visual, foco e estado acessível.
const toggle = document.querySelector('.mobile-menu');
const navigation = document.querySelector('.nav nav');
const mobileViewport = window.matchMedia('(max-width: 760px)');

function closeMenu() {
  navigation.classList.remove('open');
  toggle.setAttribute('aria-expanded', 'false');
  toggle.setAttribute('aria-label', 'Abrir navegação');
}

toggle.addEventListener('click', () => {
  const open = toggle.getAttribute('aria-expanded') !== 'true';
  toggle.setAttribute('aria-expanded', String(open));
  toggle.setAttribute('aria-label', open ? 'Fechar navegação' : 'Abrir navegação');
  navigation.classList.toggle('open', open);
});
navigation.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
    closeMenu();
    toggle.focus();
  }
});
document.addEventListener('click', event => {
  if (!event.target.closest('.nav')) closeMenu();
});
mobileViewport.addEventListener('change', closeMenu);

// Formulário: abre uma mensagem pronta; o visitante revisa e envia no WhatsApp.
const contactForm = document.querySelector('#contact-form');

function buildContactMessage(name, project, message) {
  return 'Olá, NORTIVA! Meu nome é ' + name.trim() + '.\n' +
    'Tenho interesse em: ' + project + '.' +
    (message.trim() ? '\n\nSobre o projeto: ' + message.trim() : '');
}

contactForm.addEventListener('submit', event => {
  event.preventDefault();
  const name = contactForm.elements.namedItem('name');
  name.setCustomValidity(name.value.trim() ? '' : 'Informe seu nome.');
  if (!contactForm.reportValidity()) return;

  const project = contactForm.elements.namedItem('project').value;
  const message = contactForm.elements.namedItem('message').value;
  const text = buildContactMessage(name.value, project, message);
  window.open(
    'https://wa.me/' + WHATSAPP_NUMBER + '?text=' + encodeURIComponent(text),
    '_blank',
    'noopener,noreferrer'
  );
});
contactForm.elements.namedItem('name').addEventListener('input', event => {
  event.target.setCustomValidity('');
});
