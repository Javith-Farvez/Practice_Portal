import fs from 'fs';
import path from 'path';
import { pool } from '../config/db';

export const applySchema = async (): Promise<void> => {
  console.log('🚀 [PostgreSQL] Applying schema from postgresql_schema.sql...');
  
  const schemaPath = path.resolve(__dirname, '../../../database/postgresql_schema.sql');
  if (!fs.existsSync(schemaPath)) {
    throw new Error(`Schema file not found at: ${schemaPath}`);
  }

  const sql = fs.readFileSync(schemaPath, 'utf8');
  await pool.query(sql);
  console.log('✅ [PostgreSQL] Schema executed successfully!');

  // Verify created tables
  const res = await pool.query(`
    SELECT table_name 
    FROM information_schema.tables 
    WHERE table_schema = 'public' 
    ORDER BY table_name ASC;
  `);

  console.log(`📊 Found ${res.rows.length} tables in PostgreSQL database:`);
  res.rows.forEach((r: any) => console.log(`   - ${r.table_name}`));
};

if (require.main === module) {
  applySchema()
    .then(async () => {
      await pool.end();
      process.exit(0);
    })
    .catch(async (err) => {
      console.error('❌ Error applying PostgreSQL schema:', err);
      await pool.end();
      process.exit(1);
    });
}
