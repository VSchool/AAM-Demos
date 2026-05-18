import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';

const events = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/events' }),
  schema: z.object({
    title: z.string(),
    date: z.string(),         // ISO date 'YYYY-MM-DD'
    doors: z.string(),        // 'Fri 8 PM'
    venue: z.string(),
    venueCapacity: z.number().optional(),
    genre: z.string(),
    price: z.string(),
    priceAtDoor: z.string().optional(),
    image: z.string().url(),
    excerpt: z.string(),
    openers: z.array(z.string()).optional(),
    ageRestriction: z.string().optional(),
  }),
});

export const collections = { events };
