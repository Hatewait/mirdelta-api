import type { Request, Response, NextFunction } from 'express';
import { prisma } from '../lib/prisma';

export const getCategories = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const categories = await prisma.category.findMany({ orderBy: { title: 'asc' } });
    res.json(categories);
  } catch (err) {
    next(err);
  }
};
