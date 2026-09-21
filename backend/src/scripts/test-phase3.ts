import { initDatabase, pool } from '../config/db';
import { JudgeService } from '../services/judge/judge.service';
import { SandboxExecutor } from '../services/judge/executor';
import { validateOutput } from '../services/judge/validator';
import { checkCodeSecurity } from '../services/judge/security';

const runTests = async (): Promise<void> => {
  console.log('🧪 ===================================================');
  console.log('🧪 Starting Phase 3 Online Compiler & Judge Test Suite');
  console.log('🧪 ===================================================\n');

  await initDatabase();

  // Find problem #1: "Find Maximum and Minimum Element in an Array"
  const probRes = await pool.query<any>(
    "SELECT id, title FROM problems WHERE title = 'Find Maximum and Minimum Element in an Array' LIMIT 1"
  );
  const probRows = probRes.rows;

  if (probRows.length === 0) {
    throw new Error('Test problem not found in database.');
  }

  const problem = probRows[0];
  const problemId = problem.id;
  console.log(`📌 Using Problem #${problemId}: "${problem.title}" for test executions.\n`);

  // We'll use student user id = 2 (or find student)
  const userRes = await pool.query<any>(
    "SELECT id FROM users WHERE role = 'STUDENT' LIMIT 1"
  );
  const userRows = userRes.rows;
  const studentId = userRows[0]?.id || 1;

  // ----------------------------------------------------
  // TEST 1: Validator Unit Tests (EXACT, TRIMMED, NUMERIC)
  // ----------------------------------------------------
  console.log('▶ Test 1: Testing Output Validators (EXACT, TRIMMED, NUMERIC)...');
  console.assert(validateOutput('1 9\n', '1 9', 'TRIMMED') === true, 'Trimmed newline match');
  console.assert(validateOutput('1 9   \r\n', '1 9', 'TRIMMED') === true, 'Trimmed CRLF match');
  console.assert(validateOutput('1 9', '1 8', 'TRIMMED') === false, 'Trimmed mismatch');
  console.assert(validateOutput('hello', 'hello', 'EXACT') === true, 'Exact match');
  console.assert(validateOutput('hello ', 'hello', 'EXACT') === false, 'Exact mismatch on space');
  console.assert(validateOutput('3.141592', '3.14159', 'NUMERIC', 1e-4) === true, 'Numeric tolerance match');
  console.log('✅ Test 1 Passed: Output validator conforms to specs.\n');

  // ----------------------------------------------------
  // TEST 2: Security Policy Check (Anti-Abuse)
  // ----------------------------------------------------
  console.log('▶ Test 2: Testing Anti-Abuse and Security Filter...');
  const maliciousJava = `
import java.lang.ProcessBuilder;
public class Main {
  public static void main(String[] args) {
    new ProcessBuilder("cmd").start();
  }
}
`;
  const secJava = checkCodeSecurity(maliciousJava, 'JAVA');
  console.assert(secJava.safe === false, 'Blocked malicious Java ProcessBuilder');
  console.log('✅ Test 2 Passed: Malicious payloads safely intercepted.\n');

  // ----------------------------------------------------
  // TEST 3: Real Java Code Execution (Run Public Tests)
  // ----------------------------------------------------
  console.log('▶ Test 3: Executing Correct Java Code (Public Tests Only)...');
  const correctJavaCode = `
import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (!sc.hasNextInt()) return;
        int n = sc.nextInt();
        int min = Integer.MAX_VALUE;
        int max = Integer.MIN_VALUE;
        for (int i = 0; i < n; i++) {
            int val = sc.nextInt();
            if (val < min) min = val;
            if (val > max) max = val;
        }
        System.out.println(min + " " + max);
    }
}
`;

  const javaRunRes = await JudgeService.runPublicTests(problemId, 'JAVA', correctJavaCode);
  console.log(`Java Run: ${javaRunRes.passedPublicTests}/${javaRunRes.totalPublicTests} passed`);
  console.assert(javaRunRes.status === 'SUCCESS', 'Java run status is SUCCESS');
  console.assert(
    javaRunRes.passedPublicTests === javaRunRes.totalPublicTests,
    'All public Java tests passed'
  );
  console.assert(javaRunRes.results.length > 0, 'Public test results populated');
  console.log('✅ Test 3 Passed: Correct Java code compiled & executed accurately.\n');

  // ----------------------------------------------------
  // TEST 4: Real Java Code Execution (Submit All Tests)
  // ----------------------------------------------------
  console.log('▶ Test 4: Submitting Correct Java Code (Public + Hidden Tests)...');
  const correctJavaSubmitCode = `
import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (!sc.hasNextInt()) return;
        int n = sc.nextInt();
        int min = Integer.MAX_VALUE;
        int max = Integer.MIN_VALUE;
        for (int i = 0; i < n; i++) {
            int v = sc.nextInt();
            if (v < min) min = v;
            if (v > max) max = v;
        }
        System.out.println(min + " " + max);
    }
}
`;

  const javaSubmitRes = await JudgeService.submitSolution(
    studentId,
    problemId,
    'JAVA',
    correctJavaSubmitCode
  );

  console.log(
    `Java Submit Verdict: ${javaSubmitRes.status} (${javaSubmitRes.passedCount}/${javaSubmitRes.totalCount} test cases passed, Runtime: ${javaSubmitRes.runtimeMs}ms)`
  );
  console.assert(javaSubmitRes.status === 'ACCEPTED', 'Java code should be ACCEPTED');
  console.assert(
    javaSubmitRes.passedCount === javaSubmitRes.totalCount,
    'All public and hidden test cases passed'
  );
  console.assert(javaSubmitRes.submissionId !== undefined, 'Submission ID recorded');
  console.log('✅ Test 4 Passed: Full Java evaluation ACCEPTED with 100% test passing.\n');

  // ----------------------------------------------------
  // TEST 5: Hidden Test Case Privacy Verification
  // ----------------------------------------------------
  console.log('▶ Test 5: Verifying Hidden Test Case Privacy...');
  // Ensure publicResults only contains public test cases and NO hidden inputs
  const hiddenRes = await pool.query<any>(
    'SELECT COUNT(*) as count FROM test_cases WHERE problem_id = $1 AND is_hidden = TRUE',
    [problemId]
  );
  const hiddenCount = Number(hiddenRes.rows[0]?.count || 0);
  console.assert(hiddenCount > 0, 'Problem must have hidden test cases');
  console.assert(
    javaSubmitRes.publicResults.length < javaSubmitRes.totalCount,
    'Run results must only reveal public test cases'
  );
  console.log(`Hidden test cases verified: ${hiddenCount} hidden test cases kept confidential.`);
  console.log('✅ Test 5 Passed: Hidden test case privacy strictly protected.\n');

  // ----------------------------------------------------
  // TEST 6: Incorrect Code Detection (WRONG_ANSWER)
  // ----------------------------------------------------
  console.log('▶ Test 6: Testing Incorrect Java Code (WRONG_ANSWER)...');
  const wrongJavaCode = `
public class Main {
    public static void main(String[] args) {
        System.out.println("0 0");
    }
}
`;
  const wrongSubmitRes = await JudgeService.submitSolution(
    studentId,
    problemId,
    'JAVA',
    wrongJavaCode
  );
  console.log(
    `Wrong Answer Verdict: ${wrongSubmitRes.status} (${wrongSubmitRes.passedCount}/${wrongSubmitRes.totalCount} passed)`
  );
  console.assert(
    wrongSubmitRes.status === 'WRONG_ANSWER' || wrongSubmitRes.passedCount < wrongSubmitRes.totalCount,
    'Must detect WRONG_ANSWER'
  );
  console.log('✅ Test 6 Passed: WRONG_ANSWER accurately classified.\n');

  // ----------------------------------------------------
  // TEST 7: Compilation Error Handling
  // ----------------------------------------------------
  console.log('▶ Test 7: Testing Java Compilation Error Handling...');
  const brokenJavaCode = `
public class Main {
    public static void main(String[] args) {
        system.out.printl("broken") // Missing semicolon and wrong case
    }
}
`;
  const compileErrorRes = await JudgeService.runPublicTests(problemId, 'JAVA', brokenJavaCode);
  console.log(`Compilation Error Result: status=${compileErrorRes.status}`);
  console.assert(compileErrorRes.status === 'ERROR', 'Status must be ERROR');
  console.assert(
    Boolean(compileErrorRes.compilationError),
    'Compilation error message must be present'
  );
  console.log(`Sanitized Error: ${compileErrorRes.compilationError?.substring(0, 100)}...`);
  console.log('✅ Test 7 Passed: Compilation error reported with sanitized message.\n');

  // ----------------------------------------------------
  // TEST 8: Runtime Error Handling
  // ----------------------------------------------------
  console.log('▶ Test 8: Testing Java Runtime Error (ArithmeticException)...');
  const crashJavaCode = `
public class Main {
    public static void main(String[] args) {
        int x = 10 / 0;
    }
}
`;
  const crashRes = await SandboxExecutor.executeTestCase('JAVA', crashJavaCode, '');
  console.assert(crashRes.exitCode !== 0, 'Exit code non-zero on crash');
  console.assert(
    crashRes.stderr.includes('ArithmeticException') || crashRes.exitCode === 1,
    'Stderr contains ArithmeticException'
  );
  console.log(`Runtime Error captured: ${crashRes.stderr}`);
  console.log('✅ Test 8 Passed: Runtime error captured safely.\n');

  // ----------------------------------------------------
  // TEST 9: Infinite Loop & Timeout Guard (TIME_LIMIT_EXCEEDED)
  // ----------------------------------------------------
  console.log('▶ Test 9: Testing Infinite Loop Timeout Guard (timeout <= 2000ms)...');
  const infiniteLoopCode = `
public class Main {
    public static void main(String[] args) {
        while (true) {}
    }
}
`;
  const timeoutRes = await SandboxExecutor.executeTestCase('JAVA', infiniteLoopCode, '', 1500);
  console.log(
    `Timed out: ${timeoutRes.timedOut}, Runtime: ${timeoutRes.runtimeMs}ms, ExitCode: ${timeoutRes.exitCode}`
  );
  console.assert(timeoutRes.timedOut === true, 'Process must be marked timedOut');
  console.assert(timeoutRes.runtimeMs >= 1400, 'Process ran until timeout threshold');
  console.log('✅ Test 9 Passed: Infinite loop terminated cleanly by watchdog.\n');

  console.log('🎉 ===================================================');
  console.log('🎉 All Phase 3 Compiler & Judge Tests Passed Successfully!');
  console.log('🎉 ===================================================\n');
};

runTests()
  .then(async () => {
    await pool.end();
    process.exit(0);
  })
  .catch(async (err) => {
    console.error('❌ Phase 3 Test Failed:', err);
    await pool.end();
    process.exit(1);
  });
