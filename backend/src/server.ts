import { createApp } from './app';
import { ENV } from './config/env';
import { initDatabase, pool } from './config/db';

const startServer = async () => {
  try {
    // Attempt database initialization
    try {
      await initDatabase();
    } catch (dbErr: any) {
      console.warn('⚠️ [Database] Connection warning on startup:', dbErr.message || dbErr);
      console.warn('ℹ️ [Database] Server is running in resilient mode.');
    }

    const app = createApp();

    const server = app.listen(ENV.PORT, () => {
      console.log(`🚀 [Server] Placement Portal API running on http://localhost:${ENV.PORT}`);
      console.log(`📡 [Server] Client URL permitted: ${ENV.CLIENT_URL}`);
      console.log(`🛡️  [Server] Security headers (Helmet) & CORS enabled`);
    });

    // Graceful Shutdown
    const shutdown = async (signal: string) => {
      console.log(`\n🛑 [Server] Received ${signal}. Shutting down gracefully...`);
      server.close(async () => {
        try {
          await pool.end();
          console.log('✅ [Database] Connection pool closed.');
          process.exit(0);
        } catch (err) {
          console.error('❌ [Database] Error closing pool:', err);
          process.exit(1);
        }
      });
    };

    process.on('SIGINT', () => shutdown('SIGINT'));
    process.on('SIGTERM', () => shutdown('SIGTERM'));
  } catch (error) {
    console.error('❌ [Server] Fatal error during startup:', error);
    process.exit(1);
  }
};

startServer();
