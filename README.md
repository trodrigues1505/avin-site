# Aventuras Inacabadas

Portal estático de RPG de mesa feito com [Astro](https://astro.build), publicado no GitHub Pages.

## Requisitos

Node.js 22 (ver `.nvmrc`) e npm.

## Desenvolvimento

```bash
npm install
npm run dev        # http://localhost:4321
npm run build      # gera dist/
npm run preview    # serve dist/
npm run check:links
```

## Endereço do site (`SITE_URL` e `BASE_PATH`)

O endereço não está escrito no código. Ele vem de duas variáveis de ambiente:

| Situação | SITE_URL | BASE_PATH |
|---|---|---|
| Endereço padrão do GitHub Pages | `https://usuario.github.io` | `/nome-do-repositorio` |
| Domínio ou subdomínio próprio | `https://avin.exemplo.org` | `/` |
| Desenvolvimento local | (vazio) | (vazio) |

Teste local com o caminho do GitHub Pages:

```bash
SITE_URL=https://usuario.github.io BASE_PATH=/repositorio npm run build && BASE_PATH=/repositorio npm run check:links
```

No GitHub, defina essas variáveis em Settings > Secrets and variables > Actions > Variables.
Se não existirem, o workflow usa o endereço padrão do GitHub Pages automaticamente.

## Publicação

1. Crie um repositório (confirme que é o repositório correto) e envie este código para a branch `main`.
2. Em Settings > Pages, escolha **Source: GitHub Actions**.
3. O workflow `.github/workflows/deploy.yml` faz build, confere os links e publica a cada push.

## Estrutura

```
src/content/articles/   artigos em Markdown
src/content/tools/      catálogo de ferramentas (um .json por app)
src/content/adventures/ aventuras em Markdown
src/content/library/    itens da biblioteca (.json), arquivos em public/biblioteca/
src/assets/posts/       imagens dos artigos (otimizadas no build)
src/config/site.ts      nome, descrição, link do Apoia-se, menu
public/apps/            aplicativos HTML independentes (um por pasta)
docs/                   migração do Blogger e endereço personalizado
```

## Aplicativos HTML

Cada app vive em `public/apps/<nome>/` e é copiado sem alteração. Veja `COMO_PUBLICAR.md`.

## Privacidade

Sem analytics nem rastreadores. As fontes são servidas pelo próprio site (pacotes @fontsource).
