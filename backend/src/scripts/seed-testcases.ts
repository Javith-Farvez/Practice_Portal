import { initDatabase, pool } from '../config/db';
import { SEED_TEST_CASES } from '../data/testCaseData';

export const seedTestCases = async (): Promise<void> => {
  console.log('🧪 [Seed Test Cases] Initializing database & test_cases table...');
  await initDatabase();

  // 1. Fetch all problems
  const probRes = await pool.query<any>('SELECT id, title FROM problems');
  const problems = probRes.rows;
  const problemMap = new Map<string, number>();
  problems.forEach((p: any) => problemMap.set(p.title, p.id));

  console.log(`Found ${problems.length} problems in database.`);

  let insertedCount = 0;

  // 2. Insert defined test cases
  for (const tc of SEED_TEST_CASES) {
    const problemId = problemMap.get(tc.problemTitle);
    if (!problemId) {
      continue;
    }

    // Check if duplicate exists
    const tcCheckRes = await pool.query<any>(
      'SELECT id FROM test_cases WHERE problem_id = $1 AND input = $2 LIMIT 1',
      [problemId, tc.input]
    );

    if (tcCheckRes.rows.length === 0) {
      await pool.query(
        `INSERT INTO test_cases (problem_id, input, expected_output, is_hidden, validation_type)
         VALUES ($1, $2, $3, $4, $5)`,
        [problemId, tc.input, tc.expected_output, tc.is_hidden, tc.validation_type || 'TRIMMED']
      );
      insertedCount++;
    }
  }

  // 3. For any problems without test cases, generate baseline public & hidden test cases
  for (const p of problems) {
    const countRes = await pool.query<any>(
      'SELECT COUNT(*) as count FROM test_cases WHERE problem_id = $1',
      [p.id]
    );

    if (Number(countRes.rows[0]?.count) === 0) {
      // Create 2 public test cases
      await pool.query(
        `INSERT INTO test_cases (problem_id, input, expected_output, is_hidden, validation_type)
         VALUES 
         ($1, '1\n10', '10', FALSE, 'TRIMMED'),
         ($2, '2\n20 30', '50', FALSE, 'TRIMMED')`,
        [p.id, p.id]
      );

      // Create 5 hidden test cases
      await pool.query(
        `INSERT INTO test_cases (problem_id, input, expected_output, is_hidden, validation_type)
         VALUES 
         ($1, '1\n0', '0', TRUE, 'TRIMMED'),
         ($2, '3\n-5 0 5', '0', TRUE, 'TRIMMED'),
         ($3, '4\n1 2 3 4', '10', TRUE, 'TRIMMED'),
         ($4, '2\n-10 -20', '-30', TRUE, 'TRIMMED'),
         ($5, '5\n100 200 300 400 500', '1500', TRUE, 'TRIMMED')`,
        [p.id, p.id, p.id, p.id, p.id]
      );
      insertedCount += 7;
    }
  }

  console.log(`✅ [Seed Test Cases] Successfully seeded ${insertedCount} test cases across problems!`);
};

if (require.main === module) {
  seedTestCases()
    .then(async () => {
      await pool.end();
      process.exit(0);
    })
    .catch(async (err) => {
      console.error('❌ Error during test case seeding:', err);
      await pool.end();
      process.exit(1);
    });
}
