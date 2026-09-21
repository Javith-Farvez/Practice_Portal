import fs from 'fs';
import path from 'path';
import { pool } from '../config/db';
import { seedPhase2Data } from './seed-phase2';
import { seedTestCases } from './seed-testcases';

export const runFullSeed = async (): Promise<void> => {
  console.log('🌱 [PostgreSQL] Starting comprehensive database seeding...');

  // 1. Apply postgresql_seed.sql
  const seedSqlPath = path.resolve(__dirname, '../../../database/postgresql_seed.sql');
  if (fs.existsSync(seedSqlPath)) {
    console.log('📄 Executing database/postgresql_seed.sql...');
    const sql = fs.readFileSync(seedSqlPath, 'utf8');
    await pool.query(sql);
    console.log('✅ Base seed executed successfully!');
  }

  // 2. Apply postgresql_seed_roadmap.sql
  const roadmapSqlPath = path.resolve(__dirname, '../../../database/postgresql_seed_roadmap.sql');
  if (fs.existsSync(roadmapSqlPath)) {
    console.log('📄 Executing database/postgresql_seed_roadmap.sql...');
    const roadmapSql = fs.readFileSync(roadmapSqlPath, 'utf8');
    await pool.query(roadmapSql);
    console.log('✅ Roadmap seed executed successfully!');
  }

  // 3. Seed Phase 2 curriculum and starter problems
  console.log('📚 Seeding topics, subtopics, and problems...');
  await seedPhase2Data();

  // 3. Seed test cases
  console.log('🧪 Seeding test cases for judge execution...');
  await seedTestCases();

  console.log('🎉 [PostgreSQL] All seed operations completed successfully!');
};

if (require.main === module) {
  runFullSeed()
    .then(async () => {
      await pool.end();
      process.exit(0);
    })
    .catch(async (err) => {
      console.error('❌ Error during PostgreSQL seeding:', err);
      await pool.end();
      process.exit(1);
    });
}
