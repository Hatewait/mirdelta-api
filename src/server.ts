import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { errorMiddleware } from './middleware/error';
import { productsRouter } from './routes/products';
import { categoriesRouter } from './routes/categories';

const app = express();

const PORT = Number(process.env.PORT || 4000);
const CORS_ORIGIN = process.env.CORS_ORIGIN || '*';

app.use(cors({ origin: CORS_ORIGIN }));
app.use(express.json());

app.get('/api/health', (_req, res) => res.json({ ok: true }));

app.use('/api/categories', categoriesRouter);
app.use('/api/products', productsRouter);

// должен быть последним
app.use(errorMiddleware);

app.listen(PORT, () => {
  console.log(`API listening on http://localhost:${PORT}`);
});
