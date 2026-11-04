import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// Endereço e caminho base vêm de variáveis de ambiente, para trocar de endereço
// (github.io -> domínio próprio) sem editar o código. Ver README.md.
//   SITE_URL  ex.: https://seu-usuario.github.io   ou   https://avin.exemplo.org
//   BASE_PATH ex.: /nome-do-repositorio            ou   /   (domínio próprio na raiz)
const site = process.env.SITE_URL || 'http://localhost:4321';
const base = process.env.BASE_PATH || '/';

export default defineConfig({
  site,
  base,
  trailingSlash: 'always',
  build: { format: 'directory' },
  integrations: [sitemap()],
});
