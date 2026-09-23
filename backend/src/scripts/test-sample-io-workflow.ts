import http from 'http';
import { createApp } from '../app';
import { pool } from '../config/db';
import { AdminProblemService } from '../services/admin/admin-problem.service';

async function testWorkflow() {
  console.log('🧪 Starting Sample I/O End-to-End Workflow Verification...');

  const app = createApp();
  const server = http.createServer(app);
  await new Promise<void>((resolve) => server.listen(0, '127.0.0.1', () => resolve()));
  const port = (server.address() as any).port;
  const baseUrl = `http://127.0.0.1:${port}/api`;

  try {
    // 1. Test sample problems via API
    const testIds = [1, 50, 100, 122, 1001, 1018, 2001, 2004, 3001];

    for (const id of testIds) {
      const res = await fetch(`${baseUrl}/problems/${id}`);
      const json = await res.json() as any;

      if (!json.success || !json.data?.problem) {
        throw new Error(`Failed to fetch problem #${id}: ${JSON.stringify(json)}`);
      }

      const p = json.data.problem;
      console.log(`\n✅ Problem #${p.id} (${p.subject_name || p.subject_slug} - ${p.title}):`);
      console.log(`   Sample Input : ${JSON.stringify(p.sample_input)}`);
      console.log(`   Sample Output: ${JSON.stringify(p.sample_output)}`);

      // Assertions
      if (!p.sample_output || p.sample_output.trim() === '') {
        throw new Error(`Assertion failed: Problem #${id} has empty sample_output!`);
      }

      if (id !== 50 && id !== 122) {
        if (p.sample_input.toLowerCase().includes('no input')) {
          throw new Error(`Assertion failed: Problem #${id} incorrectly has 'no input' sample_input!`);
        }
      } else {
        if (!p.sample_input.toLowerCase().includes('no input')) {
          throw new Error(`Assertion failed: Problem #${id} (no input required) should indicate no input required!`);
        }
      }
    }

    // 2. Test Admin Validation on Problem Publishing
    console.log('\n🛡️ Testing Admin Creation/Publishing Validation...');
    let threwForMissingOutput = false;
    try {
      await AdminProblemService.createProblem(
        {
          title: 'Test Incomplete Problem',
          description: 'A problem without sample output',
          subject_id: 1,
          topic_id: 1,
          difficulty: 'EASY',
          status: 'PUBLISHED',
          sample_input: '10 20',
          sample_output: '', // Empty sample output
        },
        1
      );
    } catch (err: any) {
      threwForMissingOutput = true;
      console.log(`   Expected validation caught: "${err.message}"`);
    }

    if (!threwForMissingOutput) {
      throw new Error('AdminProblemService failed to reject publishing problem with missing sample output!');
    }

    let threwForMissingInput = false;
    try {
      await AdminProblemService.createProblem(
        {
          title: 'Test Incomplete Problem 2',
          description: 'A problem without sample input',
          subject_id: 1,
          topic_id: 1,
          difficulty: 'EASY',
          status: 'PUBLISHED',
          sample_input: '', // Empty sample input
          sample_output: '42',
        },
        1
      );
    } catch (err: any) {
      threwForMissingInput = true;
      console.log(`   Expected validation caught: "${err.message}"`);
    }

    if (!threwForMissingInput) {
      throw new Error('AdminProblemService failed to reject publishing problem with missing sample input!');
    }

    console.log('\n🎉 ALL WORKFLOW & VERIFICATION TESTS PASSED SUCCESSFULLY!');
  } finally {
    server.close();
    await pool.end();
  }
}

testWorkflow().catch((err) => {
  console.error('❌ Workflow test failed:', err);
  process.exit(1);
});
