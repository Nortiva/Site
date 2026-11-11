/* ==========================================================================
   MODO MANUTENÇÃO — Nortiva
   Feito por Matheus - NORTIVA STUDIO

   Para ligar ou desligar, troque o valor abaixo, salve, faça commit e push.
   A Vercel publica em cerca de 20 segundos.

     const MANUTENCAO = true;    // manutenção LIGADA: todos veem a página de manutenção
     const MANUTENCAO = false;   // manutenção DESLIGADA: o site funciona normalmente

   Alternativa sem mexer no código: na Vercel, em Settings > Environment Variables,
   crie MAINTENANCE_MODE com o valor "on" (liga) ou "off" (desliga) e faça um novo deploy.
   Quando a variável existe, ela vale mais do que este arquivo.
   ========================================================================== */

export const MANUTENCAO = false;
