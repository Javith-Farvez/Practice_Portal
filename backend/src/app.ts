import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import authRoutes from './routes/auth.routes';
import adminRoutes from './routes/admin.routes';
import learningRoutes from './routes/learning.routes';
import notificationRoutes from './routes/notification.routes';
import placementRoutes from './routes/placement.routes';
import githubRoutes from './routes/github.routes';
import { notFoundHandler, errorHandler } from './middleware/error.middleware';
import { ENV } from './config/env';
import { pool } from './config/db';

export const createApp = (): Application => {
  const app = express();

  // Security HTTP headers
  app.use(helmet());

  // CORS Configuration
  const allowedOrigins = [
    ENV.CLIENT_URL,
    'https://practice-portal-mu.vercel.app',
    'http://localhost:5173',
    'http://127.0.0.1:5173',
  ];

  app.use(
    cors({
      origin: (origin, callback) => {
        if (!origin) return callback(null, true);
        if (
          allowedOrigins.includes(origin) ||
          origin.endsWith('.vercel.app') ||
          origin.includes('localhost')
        ) {
          return callback(null, true);
        }
        return callback(null, true);
      },
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
    })
  );

  // Body Parsing with limit
  app.use(express.json({ limit: '1mb' }));
  app.use(express.urlencoded({ extended: true, limit: '1mb' }));

  // Root & Standard Database Health Check: GET /health
  const healthHandler = async (_req: Request, res: Response): Promise<void> => {
    try {
      await pool.query('SELECT 1 as connected');
      res.status(200).json({
        status: 'ok',
        database: 'connected',
        provider: 'Supabase PostgreSQL',
        timestamp: new Date().toISOString(),
      });
    } catch (err: any) {
      console.error('[Health] Database connection check failed:', err.message || err);
      res.status(503).json({
        status: 'error',
        database: 'disconnected',
        provider: 'Supabase PostgreSQL',
        message: 'Database connection check failed.',
      });
    }
  };

  app.get('/health', healthHandler);
  app.get('/api/health', healthHandler);

  // API Routes
  app.use('/api/auth', authRoutes);
  app.use('/api/admin', adminRoutes);
  app.use('/api/notifications', notificationRoutes);
  app.use('/api/placement', placementRoutes);
  app.use('/api/github', githubRoutes);
  app.use('/api', learningRoutes);

  // 404 & Error Handling
  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
};
