# Contador de visitas e comentários

Os dois recursos já estão no código, mas ficam **desligados** até você colocar os códigos das contas
em `src/config/site.ts`. Enquanto estiverem vazios, o site não carrega nada de terceiros.

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

## 2. Comentários (Cusdis)

O leitor **não precisa de conta**. Os comentários passam pela sua aprovação antes de aparecer.

1. Crie a conta em https://cusdis.com, clique em **Add website** e informe o domínio do site
   (`trodrigues1505.github.io`; se mudar para um domínio próprio, atualize aqui).
2. Em **Embed Code**, copie o `data-app-id`.
3. Em `src/config/site.ts`: `const CUSDIS_APP_ID = 'cole-o-id-aqui';`
4. Commit. A caixa de comentários aparece no fim de cada artigo.

Limites do plano gratuito (conferidos em novembro de 2026; podem mudar): 1 site e 100 comentários aprovados
por mês. Para passar disso há um plano pago. Notificações por e-mail e a aprovação são feitas no painel do Cusdis.

Cusdis não tem filtro de spam próprio: a aprovação manual é a proteção.

## Política de Privacidade

A página `/politica-de-privacidade/` muda sozinha: quando os códigos são preenchidos, ela passa a descrever
o GoatCounter e o Cusdis e deixa de dizer que o site não tem comentários nem estatísticas.

## Desligar

Apague o código em `site.ts` (volte para `''`) e faça o commit.
