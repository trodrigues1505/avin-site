# Migração do Blogger

Origem: https://aventurasinacabadas.blogspot.com/ (auditado em 04/11/2026).

## Escopo decidido

O blog tem **3 postagens**. Por decisão do autor, **a postagem sobre Street Fighter RPG não será migrada**.
Ela continua no Blogger e fora do novo portal (incluindo os dois geradores que ela cita).

| Postagem | Data original | URL original | URL nova | Status |
|---|---|---|---|---|
| Lá e de Volta Outra vez | 22/04/2026 | /2026/04/apresento-me-voces-como-thiago.html | /artigos/la-e-de-volta-outra-vez/ | Migrada, conferir |
| Mercs, Memórias e RPG: Por que esse projeto existe | 29/04/2026 | /2026/04/mercs-memorias-e-rpg-por-que-esse.html | /artigos/mercs-memorias-e-rpg/ | Migrada, conferir |
| Novidades do projeto Street Fighter RPG… | 07/08/2026 | /2026/08/novidades-do-projeto-street-fighter-rpg.html | (não migrar) | Fora do escopo |

## Páginas do Blogger

| Página | Situação no novo site |
|---|---|
| Sobre | Texto original reaproveitado em /sobre/ |
| Apoie | Texto original reaproveitado em /apoie/ (emojis decorativos removidos) |
| Contato (/p/home.html) | **Pendente**: conteúdo não lido |
| Política de Privacidade | **Pendente**: conteúdo não lido; precisa do texto original |

## O que precisa de conferência humana

1. **Quebras de linha**: o texto foi extraído da página, não do XML de exportação. Nas listas sem marcadores
   (ex.: "Aventuras prontas / Fichas utilizáveis…") mantive uma linha por item. Em "Lá e de Volta Outra vez"
   a extração juntou "direto ao ponto:" com o primeiro item; inseri a quebra ali. Compare com o original.
2. **Metadados editoriais**: "Categoria: Projeto" foi atribuída por mim (o Blogger não usa categorias).
   O rótulo original da postagem Mercs era um só, "Mercs; 3D&T"; no novo site virou duas etiquetas (Mercs, 3D&T).
   A postagem "Lá e de Volta" não tinha rótulos e ficou sem etiquetas. Ajuste no cabeçalho de cada .md.
3. **Imagens**: as duas capas vieram de arquivos enviados pelo autor (639–640 px de largura, resolução baixa
   para telas grandes). Se existirem versões maiores, substitua em `src/assets/posts/`.
4. **Textos alternativos** das imagens foram escritos por mim a partir do que se vê nelas.

## SEO e redirecionamento

O Blogger não permite redirecionamento 301 para fora do domínio. Solução recomendada, **somente depois da
conferência aprovada**: editar as duas postagens antigas no Blogger, acrescentando no topo um aviso com link
para a nova URL. Não exclua nem despublique o blog antes disso. O novo site declara o próprio endereço
como canonical.
