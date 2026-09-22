import { Pool, QueryResult, QueryResultRow } from 'pg';
import fs from 'fs';
import path from 'path';
import { ENV } from './env';

const connectionString = ENV.DATABASE_URL;

if (!connectionString) {
  console.warn('[Database] Warning: DATABASE_URL is not set yet in environment variables.');
}

// Safe connection string fallback to prevent Invalid URL errors if placeholders are present
const isPlaceholder = !connectionString || connectionString.includes('[YOUR-');
const safeConnectionString = isPlaceholder
  ? 'postgresql://postgres:postgres@localhost:5432/placement_portal'
  : connectionString;

// Determine if SSL is required (explicit DATABASE_SSL flag, remote/Supabase host, or production)
const isSslRequired =
  ENV.DATABASE_SSL ||
  ENV.NODE_ENV === 'production' ||
  (!isPlaceholder && (
    safeConnectionString.includes('supabase.co') ||
    safeConnectionString.includes('pooler.supabase.com') ||
    safeConnectionString.includes('sslmode=require') ||
    (!safeConnectionString.includes('localhost') && !safeConnectionString.includes('127.0.0.1'))
  ));

// Secure PostgreSQL Pool Configuration
export const pool = new Pool({
  connectionString: safeConnectionString,
  ssl: isSslRequired ? { rejectUnauthorized: false } : false,
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
});

// Pool error handling
pool.on('error', (error) => {
  console.error('[Database] Unexpected PostgreSQL pool error:', error);
});

// Diagnostic connection tester
export async function testDatabaseConnection() {
  const client = await pool.connect();

  try {
    const result = await client.query(`
      SELECT
        current_database() AS database_name,
        current_user AS database_user,
        inet_server_addr() AS server_address,
        version() AS postgres_version,
        current_schema() AS current_schema
    `);

    console.log('[Database] PostgreSQL connection successful:', result.rows[0]);
    return result.rows[0];
  } finally {
    client.release();
  }
}

// Reusable query helper
export const query = async <T extends QueryResultRow = any>(
  text: string,
  params?: any[]
): Promise<QueryResult<T>> => {
  return await pool.query<T>(text, params);
};

// Automatic Initialization of PostgreSQL Database and Tables from schema file
export const initDatabase = async (): Promise<void> => {
  try {
    // 1. Verify connection
    const check = await pool.query('SELECT 1 as connected');
    if (!check.rows || check.rows.length === 0) {
      throw new Error('PostgreSQL connection check failed.');
    }

    // 2. Load and execute PostgreSQL schema if needed
    const schemaPath = path.resolve(__dirname, '../../../database/postgresql_schema.sql');
    if (fs.existsSync(schemaPath)) {
      const schemaSql = fs.readFileSync(schemaPath, 'utf8');
      await pool.query(schemaSql);
      console.log('[Database] Successfully verified and initialized all tables from postgresql_schema.sql');
    } else {
      console.warn(`[Database] Schema file not found at ${schemaPath}, skipping schema DDL execution.`);
    }

    // 3. Load and execute GitHub integration migration if needed
    const githubMigrationPath = path.resolve(__dirname, '../../../database/github_integration_migration.sql');
    if (fs.existsSync(githubMigrationPath)) {
      const migrationSql = fs.readFileSync(githubMigrationPath, 'utf8');
      await pool.query(migrationSql);
      console.log('[Database] Successfully verified and initialized GitHub integration tables');
    }

    // 4. Ensure problems catalog is populated (auto-seed if empty or incomplete)
    try {
      const probCountRes = await pool.query('SELECT COUNT(*) as count FROM problems');
      const probCount = parseInt(probCountRes.rows[0]?.count || '0', 10);
      if (probCount < 250) {
        console.log(`[Database] Found ${probCount} problems (expected 259). Auto-seeding catalog...`);
        const { fastBulkSeed } = await import('../scripts/seed-all-problems');
        await fastBulkSeed(false);
        console.log('[Database] Auto-seeding completed successfully.');
      } else {
        console.log(`[Database] Catalog verified: ${probCount} problems present.`);
      }
    } catch (seedErr) {
      console.warn('[Database] Could not verify/auto-seed problems:', (seedErr as any).message);
    }
  } catch (error) {
    console.error('[Database] Failed to initialize PostgreSQL database:', error);
    throw error;
  }
};
