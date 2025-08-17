import type { Request, Response, NextFunction } from 'express';
import { prisma } from '../lib/prisma';
import { productCreateSchema, productUpdateSchema } from '../validation/product';

export const listProducts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { q, categorySlug, limit = '50', offset = '0' } = req.query as Record<string, string>;
    const where: any = {};
    if (q) where.title = { contains: q, mode: 'insensitive' };
    if (categorySlug) where.category = { slug: categorySlug };

    const products = await prisma.product.findMany({
      where,
      include: { images: true, category: true },
      orderBy: { createdAt: 'desc' },
      take: Number(limit),
      skip: Number(offset)
    });

    res.json(products);
  } catch (err) {
    next(err);
  }
};

export const getProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id)) return res.status(400).json({ error: 'Invalid id' });

    const product = await prisma.product.findUnique({
      where: { id },
      include: { images: true, category: true }
    });

    if (!product) return res.status(404).json({ error: 'Not found' });
    res.json(product);
  } catch (err) {
    next(err);
  }
};

export const createProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const parsed = productCreateSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });

    const { images = [], ...data } = parsed.data;

    const created = await prisma.product.create({
      data: {
        ...data,
        images: images.length ? { createMany: { data: images } } : undefined
      },
      include: { images: true, category: true }
    });

    res.status(201).json(created);
  } catch (err) {
    next(err);
  }
};

export const updateProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id)) return res.status(400).json({ error: 'Invalid id' });

    const parsed = productUpdateSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });

    const { images, ...data } = parsed.data;

    const updated = await prisma.product.update({
      where: { id },
      data,
      include: { images: true, category: true }
    });

    if (images) {
      await prisma.productImage.deleteMany({ where: { productId: id } });
      if (images.length) {
        await prisma.productImage.createMany({ data: images.map(i => ({ ...i, productId: id })) });
      }
    }

    res.json(updated);
  } catch (err) {
    next(err);
  }
};

export const deleteProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id)) return res.status(400).json({ error: 'Invalid id' });

    await prisma.product.delete({ where: { id } });
    res.status(204).end();
  } catch (err) {
    next(err);
  }
};
