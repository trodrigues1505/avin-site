# Endereço personalizado gratuito (Fase 7)

Situação: **não configurado**. Nenhum subdomínio foi reservado nem testado. Enquanto isso, o site usa o endereço
padrão do GitHub Pages (`usuario.github.io/repositorio/`).

## O que foi verificado (documentação oficial do GitHub Pages)

- Para um subdomínio (ex.: `avin.exemplo.org`), o DNS precisa ter um registro **CNAME** apontando para
  `SEU-USUARIO.github.io` (sem o nome do repositório).
- O domínio deve ser cadastrado em Settings > Pages > Custom domain. Com deploy por GitHub Actions
  (o caso deste projeto) o arquivo `CNAME` no repositório é ignorado e desnecessário.
- Registros apontando para o domínio sem cadastrá-lo antes no GitHub expõem a risco de sequestro de subdomínio.
- Registros CAA existentes precisam permitir `letsencrypt.org`, senão o certificado HTTPS não é emitido.
- Domínio na raiz (apex) usa registros A; subdomínio usa CNAME.

## O que NÃO foi confirmado

- **DuckDNS**: a pesquisa não encontrou confirmação oficial de que ele publique registros CNAME para os
  subdomínios `*.duckdns.org`. Pelo que conheço, o serviço é de DNS dinâmico (IP e TXT), mas isso não foi
  verificado aqui. Registro A sozinho não basta: o GitHub documenta CNAME para subdomínios.
- **FreeDNS (afraid.org)**: também não confirmado nesta pesquisa.
- **Disponibilidade** de qualquer nome (`avin`, etc.): não consultada.

## Como decidir sem adivinhar (teste de 10 minutos)

1. No provedor escolhido, crie o nome desejado com um registro **CNAME** para `SEU-USUARIO.github.io`.
   Se o provedor só permitir A/AAAA/TXT, ele não atende.
2. No GitHub: Settings > Pages > Custom domain, informe o nome e salve.
3. Aguarde a verificação de DNS e a emissão do certificado; depois marque **Enforce HTTPS**.
4. Verifique: `dig +short avin.exemplo.org CNAME` e abra `https://avin.exemplo.org/`.
5. Crie as variáveis do repositório `SITE_URL=https://avin.exemplo.org` e `BASE_PATH=/`, e rode o workflow de novo.

Existem serviços comunitários gratuitos de subdomínio com CNAME para GitHub Pages (por exemplo is-pro.dev,
is-an.app, 1bt.uk), mas são mantidos por terceiros; estabilidade e regras de uso não foram avaliadas.
Qualquer endereço gratuito pode ser suspenso. Mantenha o `github.io` como contingência.

Trocar de endereço depois não exige mexer no código: basta alterar `SITE_URL` e `BASE_PATH`.
