import { z } from 'zod';

export const productCreateSchema = z.object({
  title: z.string().min(2),
  slug: z.string().min(2),
  description: z.string().optional(),
  price: z.number().int().nonnegative(),
  categoryId: z.number().int().positive(),
  images: z.array(z.object({
    url: z.string().url(),
    alt: z.string().optional()
  })).optional()
});

export const productUpdateSchema = productCreateSchema.partial();
