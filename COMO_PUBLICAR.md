# Como publicar e manter o portal

Instruções simples. Você só precisa editar arquivos de texto; o site se atualiza sozinho.

## 1. Criar um artigo

Crie um arquivo em `src/content/articles/`, com o nome que será a URL (sem acentos, com hífens),
por exemplo `minha-aventura.md`:

```markdown
---
title: "Título do artigo"
description: "Resumo de uma ou duas frases (aparece no Google e nas listas)."
date: 2026-11-10
category: "Aventuras"
tags: ["3D&T", "Mercs"]
cover: "../../assets/posts/minha-aventura.png"
coverAlt: "Descrição da imagem para quem não pode vê-la."
---

Texto do artigo em Markdown.

## Subtítulo

Mais texto, **negrito**, *itálico*, [link](https://exemplo.com).
```

`cover` e `coverAlt` são opcionais. Para guardar um rascunho sem publicar, adicione `draft: true`.

## 2. Editar um artigo antigo

Abra o arquivo `.md` correspondente, altere e salve. Se quiser registrar a revisão, adicione `updated: 2026-12-01`.

## 3. Inserir imagens

- Capa: coloque o arquivo em `src/assets/posts/` e aponte em `cover`. O site gera versões leves sozinho.
- Imagem no meio do texto: `![descrição da imagem](../../assets/posts/arquivo.png)`.
- Sempre escreva a descrição (texto alternativo).

## 4. Categorias e etiquetas

São apenas texto no cabeçalho (`category` e `tags`). A página de cada etiqueta é criada automaticamente.

## 5. Adicionar uma ferramenta (app HTML)

1. Crie a pasta `public/apps/nome-do-app/` com `index.html`, e os arquivos do app (`style.css`, `script.js`, imagens).
2. Dentro do app use **caminhos relativos** (`style.css`, não `/style.css`).
3. Crie `src/content/tools/nome-do-app.json`:

```json
{
  "name": "Nome do app",
  "description": "O que ele faz, em uma frase.",
  "category": "Gerador",
  "icon": "dice",
  "folder": "nome-do-app",
  "featured": true,
  "order": 10
}
```

`icon` aceita: dice, scroll, map, book, sword. Use `"needsBackend": true` se o app depender de servidor externo.
Para um app que já está publicado em outro endereço, use `"externalUrl": "https://..."` no lugar de `folder`.
O app aparece sozinho na página Ferramentas e na home (se `featured`). Remova o app de demonstração
(`rolador-de-dados`) quando quiser: apague a pasta `public/apps/rolador-de-dados/` e o `.json` dele.

## 6. Aventuras e biblioteca

- Aventura: um `.md` em `src/content/adventures/` com `title`, `description`, `date` (e opcionalmente `system`).
- Biblioteca: coloque o PDF em `public/biblioteca/` e crie um `.json` em `src/content/library/`:
  `{ "title": "...", "description": "...", "kind": "PDF", "file": "arquivo.pdf" }`.

## 7. Publicar

Salve as alterações e envie para a branch `main` do GitHub (pelo site do GitHub: abrir o arquivo, lápis de edição,
"Commit changes"). Em 1 a 3 minutos o workflow publica. Acompanhe na aba **Actions**.
Se o build falhar, a versão publicada anterior continua no ar.

## 8. Desfazer uma alteração

No GitHub, abra o arquivo, clique em **History**, escolha a versão anterior e restaure (ou use **Revert** no commit).
O novo deploy acontece sozinho.

## 9. Trocar a capa

A capa da home é `src/assets/capa.png` (troque o arquivo mantendo o nome). A imagem de compartilhamento `public/og-default.png` é gerada dela com `node scripts/make-og.mjs`. O emblema do cabeçalho é `src/assets/emblema.png`, o logo do rodapé é `src/assets/logo-completo.png` e o ícone da aba é `public/favicon.png`.

## CMS visual?

Não vale a pena agora: com poucos artigos, editar Markdown é mais simples e não adiciona serviço nem login.
Reavalie se o volume de publicações crescer.
