import dotenv from 'dotenv';
import path from 'path';

// Load environment variables strictly from backend/.env
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const getDatabaseUrl = (): string => {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error('DATABASE_URL environment variable is required.');
  }
  return url;
};

export const ENV = {
  PORT: parseInt(process.env.PORT || '5000', 10),
  NODE_ENV: process.env.NODE_ENV || 'development',
  DATABASE_URL: process.env.DATABASE_URL || '',
  DATABASE_SSL: process.env.DATABASE_SSL === 'true',
  SUPABASE: {
    URL: process.env.SUPABASE_URL || '',
    ANON_KEY: process.env.SUPABASE_ANON_KEY || '',
    SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY || '',
  },
  JWT: {
    SECRET: process.env.JWT_SECRET || 'fallback_secret_for_development_mode_only',
    EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
  },
  CLIENT_URL: process.env.CLIENT_URL || 'http://localhost:5173',
};
