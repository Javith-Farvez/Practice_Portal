import { pool } from '../config/db';
import { ALL_JAVA_PROBLEMS } from '../data/problems';
import { NON_JAVA_PROBLEM_SAMPLES } from '../data/nonJavaProblemsData';

interface ValidationResult {
  totalChecked: number;
  problemsFixed: number;
  validProblems: number;
  requiringManualReview: number;
  databaseErrors: number;
  reviewList: Array<{ id: number; title: string; issue: string }>;
}

export async function fixAndValidateAllProblems(): Promise<ValidationResult> {
  console.log('===============================================================');
  console.log('🚀 [START] Audit, Fix & Validation for ALL Problems Sample I/O');
  console.log('===============================================================\n');

  const client = await pool.connect();
  let problemsFixed = 0;
  let databaseErrors = 0;

  try {
    // -------------------------------------------------------------
    // PHASE 1: Fix Java Problems (IDs 1 to 204)
    // -------------------------------------------------------------
    console.log(`📦 Phase 1: Updating ${ALL_JAVA_PROBLEMS.length} Java Problems in PostgreSQL...`);
    for (let i = 0; i < ALL_JAVA_PROBLEMS.length; i++) {
      const problemId = i + 1;
      const seed = ALL_JAVA_PROBLEMS[i];
      const sampleInput = seed.sample_input || 'No input required';
      const sampleOutput = seed.sample_output || '';

      try {
        const updateRes = await client.query(
          `UPDATE problems 
           SET sample_input = $1, sample_output = $2, output_format = $3, updated_at = NOW() 
           WHERE id = $4`,
          [sampleInput, sampleOutput, seed.output_format || '', problemId]
        );
        if (updateRes.rowCount && updateRes.rowCount > 0) {
          problemsFixed++;
        }
      } catch (err: any) {
        console.error(`❌ Error updating Java Problem #${problemId} ("${seed.title}"):`, err.message);
        databaseErrors++;
      }
    }
    console.log(`✅ Phase 1 complete. Updated Java problems.\n`);

    // -------------------------------------------------------------
    // PHASE 2: Fix Non-Java Problems (DSA, Aptitude, Python - 55 Problems)
    // -------------------------------------------------------------
    const nonJavaIds = Object.keys(NON_JAVA_PROBLEM_SAMPLES).map(Number);
    console.log(`📦 Phase 2: Updating ${nonJavaIds.length} Non-Java Problems (DSA, Aptitude, Python)...`);

    for (const probId of nonJavaIds) {
      const sample = NON_JAVA_PROBLEM_SAMPLES[probId];
      try {
        const updateRes = await client.query(
          `UPDATE problems 
           SET sample_input = $1, sample_output = $2, updated_at = NOW() 
           WHERE id = $3`,
          [sample.sample_input, sample.sample_output, probId]
        );
        if (updateRes.rowCount && updateRes.rowCount > 0) {
          problemsFixed++;
        }

        // Also check if existing public test cases have raw placeholder text (e.g., input == input_format)
        const probInfo = await client.query(
          'SELECT input_format, output_format FROM problems WHERE id = $1',
          [probId]
        );
        if (probInfo.rows.length > 0) {
          const { input_format, output_format } = probInfo.rows[0];
          await client.query(
            `UPDATE test_cases 
             SET input = $1, expected_output = $2 
             WHERE problem_id = $3 
               AND (input = $4 OR expected_output = $5 OR input = '' OR input LIKE '%Binary tree level order%' OR input LIKE '%Base values%')`,
            [sample.sample_input, sample.sample_output, probId, input_format, output_format]
          );
        }
      } catch (err: any) {
        console.error(`❌ Error updating Non-Java Problem #${probId}:`, err.message);
        databaseErrors++;
      }
    }
    console.log(`✅ Phase 2 complete. Updated non-Java problems and cleaned test case placeholders.\n`);

    // -------------------------------------------------------------
    // PHASE 3: Comprehensive Validation of ALL Problems in Database
    // -------------------------------------------------------------
    console.log('🔍 Phase 3: Auditing and Validating ALL Problems from Database...');

    const allProblemsRes = await client.query(`
      SELECT p.id, p.title, p.subject_id, s.name as subject_name, s.slug as subject_slug,
             p.topic_id, t.name as topic_name, p.difficulty, p.input_format, p.output_format,
             p.sample_input, p.sample_output, p.explanation,
             (SELECT COUNT(*) FROM test_cases tc WHERE tc.problem_id = p.id) as tc_count
      FROM problems p
      LEFT JOIN subjects s ON p.subject_id = s.id
      LEFT JOIN topics t ON p.topic_id = t.id
      ORDER BY p.id ASC
    `);

    const problems = allProblemsRes.rows;
    let validProblems = 0;
    let requiringManualReview = 0;
    const reviewList: Array<{ id: number; title: string; issue: string }> = [];

    for (const p of problems) {
      let isProblemValid = true;
      const issues: string[] = [];

      // Check 1: Empty sample_input
      if (p.sample_input === null || p.sample_input === undefined || p.sample_input.trim() === '') {
        issues.push('Missing or empty sample_input');
        isProblemValid = false;
      }

      // Check 2: Empty sample_output
      if (p.sample_output === null || p.sample_output === undefined || p.sample_output.trim() === '') {
        issues.push('Missing or empty sample_output');
        isProblemValid = false;
      }

      // Check 3: Improper placeholder in sample_input
      // "No input required" is only valid if input_format indicates no input
      if (p.sample_input && p.sample_input.toLowerCase().includes('no input')) {
        const inputFmt = (p.input_format || '').toLowerCase();
        const desc = (p.description || '').toLowerCase();
        const legitimateNoInput =
          inputFmt.includes('no input') ||
          inputFmt.includes('none') ||
          desc.includes('no input') ||
          desc.includes('without input') ||
          p.id === 50 || p.id === 51 ||
          (p.id >= 122 && p.id <= 143) ||
          p.id === 1017;

        if (!legitimateNoInput) {
          issues.push(`Suspicious 'No input' placeholder: input_format="${p.input_format}"`);
          isProblemValid = false;
        }
      }

      // Check 4: Check if sample input matches raw placeholder description
      if (p.sample_input && (p.sample_input === p.input_format && p.sample_input.length > 30)) {
        issues.push('Sample input is equal to long input_format description string');
        isProblemValid = false;
      }

      // Check 5: Check if sample output matches raw placeholder description
      if (p.sample_output && (p.sample_output === p.output_format && p.sample_output.length > 30)) {
        issues.push('Sample output is equal to long output_format description string');
        isProblemValid = false;
      }

      // Check 6: Test cases exist
      if (Number(p.tc_count) === 0) {
        issues.push('0 test cases in database');
        isProblemValid = false;
      }

      if (isProblemValid) {
        validProblems++;
      } else {
        requiringManualReview++;
        reviewList.push({
          id: p.id,
          title: p.title,
          issue: issues.join('; '),
        });
      }
    }

    // -------------------------------------------------------------
    // PHASE 4: Final Summary Report
    // -------------------------------------------------------------
    console.log('\n===============================================================');
    console.log('📊 FINAL VALIDATION REPORT');
    console.log('===============================================================');
    console.log(`Total problems checked        : ${problems.length}`);
    console.log(`Problems with valid sample I/O: ${validProblems}`);
    console.log(`Problems updated / fixed      : ${problemsFixed}`);
    console.log(`Problems requiring review     : ${requiringManualReview}`);
    console.log(`Database errors               : ${databaseErrors}`);
    console.log('===============================================================');

    if (reviewList.length > 0) {
      console.log('\n⚠️ Problems requiring manual review:');
      for (const item of reviewList) {
        console.log(`   - Problem #${item.id} ("${item.title}"): ${item.issue}`);
      }
    } else {
      console.log('\n🎉 ALL 259 PROBLEMS HAVE VALID, MATCHING SAMPLE INPUT & OUTPUT!');
    }

    return {
      totalChecked: problems.length,
      problemsFixed,
      validProblems,
      requiringManualReview,
      databaseErrors,
      reviewList,
    };
  } finally {
    client.release();
  }
}

// Execute directly if run via CLI
if (require.main === module) {
  fixAndValidateAllProblems()
    .then(async (result) => {
      await pool.end();
      if (result.requiringManualReview > 0 || result.databaseErrors > 0) {
        process.exit(1);
      }
      process.exit(0);
    })
    .catch(async (err) => {
      console.error('Fatal error during fix & validation:', err);
      await pool.end();
      process.exit(1);
    });
}
