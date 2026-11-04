import { getCollection } from 'astro:content';

export const PAGE_SIZE = 10;

export async function getArticles() {
  const all = await getCollection('articles', ({ data }) => !data.draft);
  return all.sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
}

export async function getTools() {
  const all = await getCollection('tools');
  return all.sort((a, b) => a.data.order - b.data.order || a.data.name.localeCompare(b.data.name, 'pt-BR'));
}

export async function getAdventures() {
  const all = await getCollection('adventures');
  return all.sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
}

export async function getLibrary() {
  return getCollection('library');
}
