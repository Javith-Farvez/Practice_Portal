import { testDatabaseConnection, pool } from '../config/db';
import { ENV } from '../config/env';

export const runDatabaseTest = async (): Promise<void> => {
  console.log('🔍 [Database Test] Testing PostgreSQL Connection with DATABASE_URL...');

  const dbUrl = ENV.DATABASE_URL;
  if (!dbUrl) {
    console.error('❌ DATABASE_URL is missing in environment variables.');
    process.exit(1);
  }

  // Mask credentials for display
  try {
    const parsed = new URL(dbUrl);
    const maskedUrl = `${parsed.protocol}//${parsed.username}:*****@${parsed.host}${parsed.pathname}`;
    console.log(`📌 Target Host: ${parsed.host} (${maskedUrl})`);
    
    if (parsed.host.includes('supabase.co') || parsed.host.includes('pooler.supabase.com')) {
      console.log('⚡ Provider: Supabase PostgreSQL');
    }
  } catch {
    console.log('📌 Target URL configured.');
  }

  try {
    const info = await testDatabaseConnection();
    console.log('\n📊 Diagnostic Details:');
    console.log(`   - Database Name : ${info.database_name}`);
    console.log(`   - User          : ${info.database_user}`);
    console.log(`   - Server IP     : ${info.server_address || 'Cloud endpoint'}`);
    console.log(`   - Version       : ${info.postgres_version?.split(',')[0]}`);

    // Additional query check
    const schemaCheck = await pool.query('SELECT current_schema();');
    console.log(`   - Current Schema: ${schemaCheck.rows[0]?.current_schema}`);

    console.log('\n🎉 [Database Test] Connection successfully established and verified!');
  } catch (err: any) {
    console.error('\n❌ [Database Test] Connection failed:', err.message);
    if (err.code === 'ECONNREFUSED') {
      console.error('   Hint: Verify that the database server is running and accessible.');
    } else if (err.code === '28P01') {
      console.error('   Hint: Password authentication failed. Check your password in DATABASE_URL.');
    } else if (err.message.includes('self-signed certificate')) {
      console.error('   Hint: Enable DATABASE_SSL=true for SSL connections.');
    }
    throw err;
  }
};

if (require.main === module) {
  runDatabaseTest()
    .then(async () => {
      await pool.end();
      process.exit(0);
    })
    .catch(async () => {
      await pool.end();
      process.exit(1);
    });
}
