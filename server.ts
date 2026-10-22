import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { billsRouter } from './server/routes/bills';
import { incidentsRouter } from './server/routes/incidents';
import { broadcastRouter } from './server/routes/broadcast';
import { paymentsRouter } from './server/routes/payments';
import { registrationRouter } from './server/routes/registration';

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 3000;
const isProduction = process.env.NODE_ENV === 'production';

// Body parsers with large limit for CSV bulk upload and base64/payloads
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Static media uploads folder
app.use('/uploads', express.static(path.resolve('public/uploads')));

// Mount API routes
app.use('/api/bills', billsRouter);
app.use('/api/incidents', incidentsRouter);
app.use('/api/broadcast', broadcastRouter);
app.use('/api/payments', paymentsRouter);
app.use('/api/register', registrationRouter);

// System health endpoint
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    system: 'AquaFlow National Water Utility Management System',
    timestamp: new Date().toISOString()
  });
});

async function startServer() {
  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve('dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve('dist/index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on port ${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
