// Configuração central do portal. Troque aqui, não nas páginas.

// Contador de visitas (GoatCounter): o "código" é o começo do endereço do painel.
// Ex.: se o painel é https://avin.goatcounter.com, o código é 'avin'. Vazio = desligado.
const GOATCOUNTER_CODE = 'aventurasinacabadas';
// Comentários: escolha UM serviço em COMMENTS_PROVIDER ('commentbox' ou 'cusdis') e preencha o código dele.
// Vazio = comentários desligados. Veja docs/VISITAS_E_COMENTARIOS.md.
const COMMENTS_PROVIDER: 'commentbox' | 'cusdis' = 'commentbox';
const COMMENTBOX_PROJECT_ID = ''; // "Project ID" do painel do CommentBox.io
const CUSDIS_APP_ID = ''; // "App ID" do painel do Cusdis (Embed Code)
export const SITE = {
  name: 'Aventuras Inacabadas',
  shortName: 'AVIN',
  description:
    'Dicas de RPG de mesa, criação de personagens, campanhas e guias para iniciantes.',
  author: 'Thiago Rodrigues',
  lang: 'pt-BR',
  locale: 'pt_BR',
  // Link real, confirmado no blog atual (menu, rodapé e postagens).
  contactEmail: 'aventurasinacabadas@gmail.com',
  supportUrl: 'https://apoia.se/avin',
  oldBlogUrl: 'https://aventurasinacabadas.blogspot.com/',
  goatcounter: GOATCOUNTER_CODE || import.meta.env.PUBLIC_GOATCOUNTER || '',
  commentsProvider: COMMENTS_PROVIDER,
  commentboxId: COMMENTBOX_PROJECT_ID || import.meta.env.PUBLIC_COMMENTBOX_ID || '',
  cusdisAppId: CUSDIS_APP_ID || import.meta.env.PUBLIC_CUSDIS_APP_ID || '',
};
export const COMMENTS_ON = COMMENTS_PROVIDER === 'cusdis' ? !!SITE.cusdisAppId : !!SITE.commentboxId;

export const NAV = [
  { label: 'Início', href: '' },
  { label: 'Artigos', href: 'artigos/' },
  { label: 'Ferramentas', href: 'ferramentas/' },
  { label: 'Aventuras', href: 'aventuras/' },
  { label: 'Biblioteca', href: 'biblioteca/' },
  { label: 'Sobre', href: 'sobre/' },
];
