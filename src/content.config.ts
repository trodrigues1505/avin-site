import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';

const articles = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/articles' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string(),
      date: z.coerce.date(),
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
      date: z.coerce.date(),
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
