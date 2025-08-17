import type { Request, Response, NextFunction } from 'express';

export const errorMiddleware = (err: any, _req: Request, res: Response, _next: NextFunction) => {
  const status = Number(err?.status || 500);
  const message = String(err?.message || 'Internal Server Error');
  if (status >= 500) console.error(err);
  res.status(status).json({ error: message });
};
