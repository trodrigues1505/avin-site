import { getCollection } from 'astro:content';

export const PAGE_SIZE = 10;

export async function getArticles() {
  // Postagens com data futura ficam fora do site até a data chegar (o build roda de hora em hora).
  const now = Date.now();
  const all = await getCollection('articles', ({ data }) => !data.draft && data.date.valueOf() <= now);
  return all.sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
}

export async function getTools() {
  const all = await getCollection('tools');
  return all.sort((a, b) => a.data.order - b.data.order || a.data.name.localeCompare(b.data.name, 'pt-BR'));
}

export async function getAdventures() {
  const now = Date.now();
  const all = await getCollection('adventures', ({ data }) => data.date.valueOf() <= now);
  return all.sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
}

export async function getLibrary() {
  return getCollection('library');
}
