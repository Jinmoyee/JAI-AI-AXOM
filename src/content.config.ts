import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const programs = defineCollection({
  // Use the glob loader to find markdown files in the src/content/programs/ directory
  loader: glob({ pattern: '**/[^_]*.{md,mdx}', base: "./src/content/programs" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    duration: z.string(),
    mode: z.string(),
    eligibility: z.string(),
    badge: z.string().optional(),
    tools: z.array(z.string()),
    targetAudience: z.string(),
    careerOpportunities: z.array(z.string()),
    featured: z.boolean().default(false),
  }),
});

export const collections = { programs };
