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
  CLIENT_URL:
    process.env.FRONTEND_URL ||
    process.env.CLIENT_URL ||
    (process.env.NODE_ENV === 'production'
      ? 'https://practice-portal-mu.vercel.app'
      : 'http://localhost:5173'),
  GITHUB: {
    APP_ID: process.env.GITHUB_APP_ID || '',
    CLIENT_ID: process.env.GITHUB_CLIENT_ID || '',
    CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET || '',
    PRIVATE_KEY: process.env.GITHUB_PRIVATE_KEY || '',
    APP_NAME: process.env.GITHUB_APP_NAME || '',
    CALLBACK_URL:
      process.env.GITHUB_CALLBACK_URL ||
      (process.env.NODE_ENV === 'production'
        ? 'https://practice-portal-kmri.onrender.com/api/github/callback'
        : 'http://localhost:5001/api/github/callback'),
    SCOPES: process.env.GITHUB_OAUTH_SCOPES || 'read:user,repo',
    ENCRYPTION_KEY: process.env.GITHUB_ENCRYPTION_KEY || '',
    WEBHOOK_SECRET: process.env.GITHUB_WEBHOOK_SECRET || '',
  },
};

