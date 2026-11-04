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

- **Nova postagem**: preencha título, resumo, categoria e etiquetas; escreva o texto; **Publicar**.
  O endereço (URL) é gerado do título e pode ser editado antes do primeiro envio. Depois fica fixo.
- **Editar**: escolha na lista, altere e publique de novo. A data de revisão (`updated`) é registrada.
- **Salvar rascunho**: grava no GitHub com `draft: true`; não aparece no site.
- **Imagens**: capa e imagens no texto são reduzidas a no máximo 1600 px e enviadas para `src/assets/posts/`.
  Sempre preencha a descrição da imagem.
- **Excluir**: pede um segundo clique. O arquivo continua no histórico do GitHub, onde pode ser restaurado.
- **Prévia**: aproximada. A aparência final é a do site depois do deploy.

## Texto

Escreva em Markdown. Parágrafo novo: linha em branco. Quebra de linha dentro do parágrafo: termine a linha com
dois espaços. Os botões da barra inserem título, subtítulo, negrito, itálico, link, lista, citação e imagem.

## Limites conhecidos

- Edita apenas artigos (`src/content/articles/*.md`). Aventuras, ferramentas e biblioteca seguem o `COMO_PUBLICAR.md`.
- Não trata conflito de edição simultânea: se o arquivo mudar no GitHub enquanto você edita, o envio falha e
  você reabre a postagem.
- O texto não fica salvo em nuvem enquanto você escreve; há um rascunho local automático neste navegador.
