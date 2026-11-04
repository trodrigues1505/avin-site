# Editor de postagens

Endereço: `https://trodrigues1505.github.io/avin-site/editor/` (não aparece no menu nem no Google).

## Como funciona

É uma página do próprio site que grava os arquivos direto no repositório do GitHub (pela API oficial).
Cada "Publicar" vira um commit; o workflow do GitHub Actions publica o site em 1 a 3 minutos.
Não há servidor, serviço pago nem terceiros: o token vai só do seu navegador para o GitHub.

## Primeiro acesso (uma vez por aparelho)

1. Gere um token no GitHub: foto do perfil → Settings → Developer settings → Personal access tokens →
   **Fine-grained tokens** → Generate new token.
2. Repository access: **Only select repositories** → `avin-site`.
3. Repository permissions → **Contents: Read and write** (nenhuma outra).
4. Copie o token, abra `/editor/`, confira usuário/repositório/branch e cole o token em **Conectar**.

O token fica guardado só neste navegador. Em **Conexão → Sair e apagar token** ele é removido.
Use apenas em aparelhos seus. Se perder o aparelho, revogue o token no GitHub (mesma tela onde foi criado).

## Uso

- **Nova postagem**: preencha título, resumo, categoria e etiquetas, escreva o texto e clique em **Publicar**.
  O endereço (URL) é gerado do título e pode ser editado antes do primeiro envio. Depois fica fixo.
- **Visual e HTML (como no Blogger)**: o texto de postagens novas tem duas abas.
  **Visual** edita como num processador de texto (títulos, negrito, itálico, links, listas, citação, imagem).
  **HTML** mostra e deixa editar o código. Alterne entre as duas quando quiser.
- **Segurança do HTML**: ao salvar, `<script>`, `<style>`, formulários e atributos `on…=` (como `onclick`) são
  removidos. Links `javascript:` também. Tags como `<iframe>` (vídeos) são mantidas.
- **Editar**: escolha na lista, altere e publique de novo. A data de revisão (`updated`) é registrada.
- **Postagens antigas** (as duas migradas do Blogger) estão em Markdown e abrem no editor de Markdown.
  O botão **Converter para editor Visual/HTML** as transforma em HTML. Confira o texto antes de publicar;
  depois de publicada em HTML, a postagem não volta para Markdown.
- **Salvar rascunho**: grava no GitHub com `draft: true`; não aparece no site.
- **Imagens**: capa e imagens no texto são reduzidas a no máximo 1600 px e enviadas ao repositório
  (`src/assets/posts/` para a capa; `public/posts-img/` para imagens dentro de textos em HTML).
  Sempre preencha a descrição da imagem.
- **Excluir**: pede um segundo clique. O arquivo continua no histórico do GitHub, onde pode ser restaurado.

## Sobre o "login com e-mail"

O Blogger tem um servidor próprio que guarda a sua conta. Este site é estático (sem servidor), então não existe
conta de e-mail e senha. No lugar, o acesso é pelo token do GitHub, que equivale a ser o administrador:
você o cola uma vez em cada aparelho e depois só abre `/editor/`. Quem não tem o token não consegue publicar,
mesmo conhecendo o endereço.

## Limites conhecidos

- Edita apenas artigos (`src/content/articles/*.md`). O HTML é guardado dentro do arquivo `.md` do artigo. Aventuras, ferramentas e biblioteca seguem o `COMO_PUBLICAR.md`.
- Não trata conflito de edição simultânea: se o arquivo mudar no GitHub enquanto você edita, o envio falha e
  você reabre a postagem.
- O texto não fica salvo em nuvem enquanto você escreve; há um rascunho local automático neste navegador.
