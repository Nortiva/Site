/* Feito por Matheus - NORTIVA STUDIO
   Modo manutenção (Vercel Routing Middleware). Configuração em maintenance.config.js */
import { MANUTENCAO } from './maintenance.config.js';

const LIGADO = ['on', 'true', '1', 'sim'];
const DESLIGADO = ['off', 'false', '0', 'nao', 'não'];

function manutencaoAtiva() {
  const env = (globalThis.process && process.env && process.env.MAINTENANCE_MODE || '').trim().toLowerCase();
  if (LIGADO.includes(env)) return true;
  if (DESLIGADO.includes(env)) return false;
  return MANUTENCAO === true;
}

export default async function middleware(request) {
  /* Chamada interna feita por este próprio middleware: deixa passar (evita loop) */
  if (request.headers.get('x-manutencao-interno')) return;

  const url = new URL(request.url);
  const ativa = manutencaoAtiva();

  /* Desligada: segue normalmente para o site */
  if (!ativa) return;

  /* Ligada: o que a própria página de manutenção usa continua liberado */
  if (/^\/(assets\/|styles\/manutencao\.css$|manutencao(\.html)?$|favicon|robots\.txt$|site\.webmanifest$)/.test(url.pathname)) return;

  const pagina = await fetch(new URL('/manutencao', request.url), {
    headers: { 'x-manutencao-interno': '1' },
    redirect: 'follow'
  });
  return new Response(pagina.body, {
    status: 503, /* avisa aos buscadores que é temporário */
    headers: {
      'content-type': 'text/html; charset=utf-8',
      'retry-after': '3600',
      'cache-control': 'no-store, max-age=0',
      'x-robots-tag': 'noindex, nofollow'
    }
  });
}

export const config = {
  matcher: '/((?!assets/|styles/manutencao\\.css$|manutencao(?:\\.html)?$|favicon|robots\\.txt$|site\\.webmanifest$).*)'
};
