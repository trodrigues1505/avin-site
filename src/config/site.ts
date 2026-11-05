// Configuração central do portal. Troque aqui, não nas páginas.

// Contador de visitas (GoatCounter): o "código" é o começo do endereço do painel.
// Ex.: se o painel é https://avin.goatcounter.com, o código é 'avin'. Vazio = desligado.
const GOATCOUNTER_CODE = 'aventurasinacabadas';
// Comentários (Cusdis): o "App ID" aparece no painel do Cusdis, em Embed Code. Vazio = desligado.
const CUSDIS_APP_ID = '';
export const SITE = {
  name: 'Aventuras Inacabadas',
  shortName: 'AVIN',
  description:
    'Dicas de RPG de mesa, criação de personagens, campanhas e guias para iniciantes.',
  author: 'Thiago Rodrigues',
  lang: 'pt-BR',
  locale: 'pt_BR',
  // Link real, confirmado no blog atual (menu, rodapé e postagens).
  supportUrl: 'https://apoia.se/avin',
  oldBlogUrl: 'https://aventurasinacabadas.blogspot.com/',
  goatcounter: GOATCOUNTER_CODE || import.meta.env.PUBLIC_GOATCOUNTER || '',
  cusdisAppId: CUSDIS_APP_ID || import.meta.env.PUBLIC_CUSDIS_APP_ID || '',
};

export const NAV = [
  { label: 'Início', href: '' },
  { label: 'Artigos', href: 'artigos/' },
  { label: 'Ferramentas', href: 'ferramentas/' },
  { label: 'Aventuras', href: 'aventuras/' },
  { label: 'Biblioteca', href: 'biblioteca/' },
  { label: 'Sobre', href: 'sobre/' },
];
