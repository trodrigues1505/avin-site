import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';

// Datas: "2026-11-10" vale como 00:00 de Brasília; "2026-11-10T09:00:00-03:00" (entre aspas) vale como escrito.
// O YAML converte datas sem aspas para meia-noite UTC, por isso somamos 3 h nesse caso.
const dateField = z.preprocess((v) => {
  if (v instanceof Date) {
    const midnightUTC = v.getUTCHours() + v.getUTCMinutes() + v.getUTCSeconds() + v.getUTCMilliseconds() === 0;
    return midnightUTC ? new Date(v.getTime() + 3 * 3600 * 1000) : v;
  }
  if (typeof v === 'string') return /^\d{4}-\d{2}-\d{2}$/.test(v.trim()) ? new Date(v.trim() + 'T00:00:00-03:00') : new Date(v);
  return v;
}, z.date());

const articles = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/articles' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string(),
      date: dateField,
      updated: z.coerce.date().optional(),
      author: z.string().default('Thiago Rodrigues'),
      category: z.string(),
      tags: z.array(z.string()).default([]),
      cover: image().optional(),
      coverAlt: z.string().optional(),
      draft: z.boolean().default(false),
      // Rastreio da migração a partir do Blogger
      originalUrl: z.string().url().optional(),
    }),
});

const tools = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/tools' }),
  schema: z.object({
    name: z.string(),
    description: z.string(),
    category: z.string(),
    icon: z.enum(['dice', 'scroll', 'map', 'book', 'sword']).default('dice'),
    // Pasta dentro de public/apps/ ... ou URL externa
    folder: z.string().optional(),
    externalUrl: z.string().url().optional(),
    featured: z.boolean().default(false),
    demo: z.boolean().default(false),
    needsBackend: z.boolean().default(false),
    order: z.number().default(100),
  }),
});

const adventures = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/adventures' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string(),
      system: z.string().optional(),
      date: dateField,
      cover: image().optional(),
      coverAlt: z.string().optional(),
    }),
});

const library = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/library' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    kind: z.string(), // PDF, ficha, recurso...
    // Arquivo dentro de public/biblioteca/
    file: z.string(),
    date: z.coerce.date().optional(),
  }),
});

export const collections = { articles, tools, adventures, library };
