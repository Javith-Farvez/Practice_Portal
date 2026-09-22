import { pool } from '../config/db';

async function audit() {
  console.log('--- TABLES & COLUMNS ---');
  const tables = ['users', 'problems', 'submissions', 'user_problem_progress', 'user_progress', 'daily_activity'];
  for (const table of tables) {
    const cols = await pool.query(
      `SELECT column_name, data_type, is_nullable, column_default 
       FROM information_schema.columns 
       WHERE table_name = $1 ORDER BY ordinal_position`,
      [table]
    );
    console.log(`\nTable: ${table} (${cols.rows.length} columns)`);
    cols.rows.forEach((c: any) => {
      console.log(`  - ${c.column_name}: ${c.data_type} (nullable: ${c.is_nullable}, default: ${c.column_default})`);
    });
  }

  console.log('\n--- PROBLEMS COUNT IN DB ---');
  const probCount = await pool.query('SELECT COUNT(*) FROM problems');
  console.log('Problems in DB:', probCount.rows[0].count);

  console.log('\n--- SAMPLE PROBLEMS ---');
  const sampleProbs = await pool.query('SELECT id, title, topic_id, subject_id FROM problems LIMIT 5');
  console.log('Sample problems:', sampleProbs.rows);

  console.log('\n--- USERS IN DB ---');
  const users = await pool.query('SELECT id, name, email FROM users');
  console.log('Users in DB:', users.rows);

  await pool.end();
}

audit().catch(console.error);
