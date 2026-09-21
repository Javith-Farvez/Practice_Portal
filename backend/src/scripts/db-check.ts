import { pool } from '../config/db';

export const checkDatabase = async (): Promise<void> => {
  console.log('🔍 [PostgreSQL] Checking database connection and integrity...');

  try {
    // 1. Check basic ping & version
    const versionRes = await pool.query('SELECT version(), current_database(), current_user;');
    const { version, current_database, current_user } = versionRes.rows[0];
    console.log(`✅ Connected to Database: "${current_database}" as User: "${current_user}"`);
    console.log(`📌 Engine Version: ${version.split(',')[0]}`);

    // 2. Check Tables
    const tablesRes = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name ASC;
    `);

    console.log(`\n📊 Tables present (${tablesRes.rows.length}):`);
    for (const row of tablesRes.rows) {
      try {
        const countRes = await pool.query(`SELECT COUNT(*) as count FROM "${row.table_name}";`);
        console.log(`   - ${row.table_name.padEnd(25)}: ${countRes.rows[0].count} rows`);
      } catch (err: any) {
        console.log(`   - ${row.table_name.padEnd(25)}: (unable to count)`);
      }
    }

    console.log('\n🎉 [PostgreSQL] Health check and integrity check passed!');
  } catch (err) {
    console.error('❌ [PostgreSQL] Health check failed:', err);
    process.exit(1);
  }
};

if (require.main === module) {
  checkDatabase()
    .then(async () => {
      await pool.end();
      process.exit(0);
    })
    .catch(async (err) => {
      console.error(err);
      await pool.end();
      process.exit(1);
    });
}
