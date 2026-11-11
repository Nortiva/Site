# Nortiva — publicação e modo manutenção

## Ligar ou desligar a manutenção
Abra `maintenance.config.js` e troque o valor:

    export const MANUTENCAO = true;    // manutenção LIGADA
    export const MANUTENCAO = false;   // manutenção DESLIGADA

Faça commit e push. A Vercel publica em cerca de 20 segundos.

Alternativa sem mexer no código: na Vercel, Settings > Environment Variables,
crie `MAINTENANCE_MODE` com `on` ou `off` e faça um novo deploy (Redeploy).
Se a variável existir, ela vale mais do que o arquivo.

Com a manutenção ligada, todas as páginas mostram a página de manutenção com status 503
(avisa o Google que é temporário, sem prejudicar o ranking). A página `/manutencao` tem
noindex e está bloqueada no robots.txt, então não aparece no Google mesmo com a manutenção desligada.

## Quando tiver domínio próprio
Troque `https://nortiva.vercel.app` pelo novo endereço (Ctrl+F em todo o projeto) em:
`index.html` (canonical, og:url, og:image, twitter:image, JSON-LD), `robots.txt` e `sitemap.xml`.

## Arquivos de publicação
- `vercel.json`: cabeçalhos de segurança e cache
- `middleware.js` + `maintenance.config.js` (precisam ficar na raiz): modo manutenção
- `robots.txt`, `sitemap.xml`, `site.webmanifest`: SEO e instalação
- `404.html`: página de erro
- `assets/img/`: logos, `og-image.png` (1200x630), `apple-touch-icon.png`, `icon-192/512.png`; `assets/fonts/`: fontes
- `favicon.ico` fica na raiz (navegadores e buscadores pedem nesse endereço)
- `styles/`: `styles.css` (site) e `manutencao.css` (manutenção e 404)
- `scripts/`: `script.js` (site) e `loader.js` (tela de carregamento, usada no site e na manutenção)
- Tela de carregamento: para remover, apague `scripts/loader.js` e a linha do `<script>` dela no `index.html` e no `manutencao.html`
