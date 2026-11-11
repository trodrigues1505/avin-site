# Contador de visitas e comentários

Os dois recursos já estão no código. Cada um liga quando você coloca o código da conta em `src/config/site.ts`. Enquanto estiverem vazios, o site não carrega nada de terceiros.

## 1. Contador de visitas (GoatCounter)

Sem cookies e sem dados pessoais. Gratuito para uso não comercial (confira o plano atual no site deles).

1. Crie a conta em https://www.goatcounter.com. Escolha um **código** (ex.: `aventuras`). O painel fica em
   `https://CODIGO.goatcounter.com`.
2. No painel: **Settings → Site → "Allow adding visitor counts on your website"** → marque e salve.
   Sem isso o número não aparece nas páginas (a contagem funciona, mas fica privada).
3. Em `src/config/site.ts`, escreva o código: `const GOATCOUNTER_CODE = 'aventuras';`
4. Faça o commit. Depois do deploy, o número aparece em cada artigo ("N visualizações") e no rodapé (total).

Suas visitas: o editor (`/editor/`) marca o seu navegador para o GoatCounter ignorá-lo. Para ignorar
outros aparelhos, abra o `/editor/` neles uma vez.

## 2. Comentários (você escolhe o serviço)

Em `src/config/site.ts`, `COMMENTS_PROVIDER` define qual serviço é usado: `'disqus'`, `'commentbox'` ou `'cusdis'`.
Em qualquer um, o leitor **não precisa de conta no GitHub**. A caixa só carrega quando o leitor chega ao fim
da postagem e, se o serviço estiver fora do ar, aparece um aviso com o seu e-mail.

### Opção A: Disqus (configuração atual)

1. Crie a conta em https://disqus.com e escolha **"I want to install Disqus on my site"**. Dê um nome ao site.
   O **shortname** que o Disqus mostra (ex.: `aventurasinacabadas`) é o que vai no código.
2. Escolha o plano **Basic** (gratuito). Nele o Disqus exibe **anúncios** na área de comentários e você não
   consegue desligá-los; o plano sem anúncios é pago (a partir de cerca de US$ 12 por mês, segundo comparativos
   de terceiros; confira o preço atual no site deles).
3. Nas configurações do Disqus, confira em **Community** se o comentário de **visitante** (sem conta) está
   habilitado; sem isso o leitor precisa criar ou usar uma conta Disqus. Confira também se o domínio
   `trodrigues1505.github.io` está na lista de **Trusted Domains**; se aparecer erro de domínio, é aí.
4. Em `src/config/site.ts`, cole o shortname em `DISQUS_SHORTNAME` e faça o commit.

Sobre privacidade: o Disqus pode definir cookies, coletar dados de navegação e exibir anúncios. Para reduzir o
impacto, a caixa só carrega quando o leitor chega ao fim da postagem; quem não rola até lá não aciona o Disqus.
A Política de Privacidade muda sozinha para descrever isso. O identificador de cada conversa é o endereço curto
da postagem, então trocar o domínio do site não perde os comentários.

### Opção B: CommentBox.io

1. Crie a conta em https://dashboard.commentbox.io e crie um **projeto** para o seu site.
2. Nas configurações do projeto, ative a opção de **comentário anônimo**, se quiser que o leitor comente
   sem entrar com e-mail ou rede social, e ajuste as regras de moderação.
3. Copie o **Project ID** para `COMMENTBOX_PROJECT_ID` em `site.ts` e faça o commit.

Plano gratuito (visto no site deles em novembro de 2026): 100 comentários por mês e visitas ilimitadas.
O site lista também "$15 if over comment limit": leia as regras de cobrança antes de passar do limite e
**não cadastre cartão** se não quiser a possibilidade de cobrança. Cuidado: o pacote npm do plugin não é
atualizado desde abril de 2022 e o site deles ainda mostra "© 2021". O serviço respondia quando conferi, mas a
manutenção é incerta. Se parar de funcionar, troque para outra opção (abaixo) sem perder o site.
O script do plugin (Apache-2.0) fica em `public/vendor/`, então o site não depende de CDN de terceiros;
só as chamadas de comentários vão ao serviço.

### Opção C: Cusdis

1. Crie a conta em https://cusdis.com, adicione o site `trodrigues1505.github.io` e copie o `data-app-id`.
2. `COMMENTS_PROVIDER = 'cusdis'` e cole o valor em `CUSDIS_APP_ID`.

Plano gratuito: 1 site e 100 comentários aprovados por mês. Os comentários passam pela sua aprovação.
O servidor do Cusdis ficou fora do ar (erro 521) no dia em que testamos; se isso se repetir, use a opção A.

### Outras opções (não implementadas)

Hyvor Talk (pago, a partir de cerca de €5 por mês, sem anúncios), Disqus (grátis, mas com anúncios e rastreamento)
e sistemas que você hospeda (Remark42, Isso: exigem servidor). Se quiser, é possível acrescentar um deles.

## Política de Privacidade

A página `/politica-de-privacidade/` muda sozinha: quando os códigos são preenchidos, ela passa a descrever
o GoatCounter e o Cusdis e deixa de dizer que o site não tem comentários nem estatísticas.

## Desligar

Apague o código em `site.ts` (volte para `''`) e faça o commit.
