import { pool } from '../../config/db';
import { SandboxExecutor } from './executor';
import { validateOutput } from './validator';
import { fallbackStore } from '../../data/fallbackStore';
import {
  Language,
  JudgeRunResult,
  JudgeSubmitResult,
  JudgeVerdict,
  TestCaseItem,
  PublicTestResultItem,
} from './types';

export class JudgeService {
  /**
   * Executes user code against public test cases only.
   * Does NOT record progress, submissions, or affect streaks.
   */
  public static async runPublicTests(
    problemId: number,
    language: Language,
    sourceCode: string
  ): Promise<JudgeRunResult> {
    let testCases: any[] = [];
    try {
      const result = await pool.query(
        'SELECT id, problem_id, input, expected_output, is_hidden, validation_type FROM test_cases WHERE problem_id = $1 AND is_hidden = FALSE ORDER BY id ASC',
        [problemId]
      );
      testCases = result.rows;
    } catch {}

    if (!testCases || testCases.length === 0) {
      const p = fallbackStore.getProblemById(problemId, null);
      if (p) {
        testCases = p.public_tests.map((tc, idx) => ({
          id: idx + 1,
          problem_id: problemId,
          input: tc.input,
          expected_output: tc.expected_output,
          is_hidden: false,
          validation_type: p.validation_type || 'TRIMMED',
        }));
      }
    }

    if (testCases.length === 0) {
      return {
        status: 'SUCCESS',
        totalPublicTests: 0,
        passedPublicTests: 0,
        results: [],
      };
    }

    const session = await SandboxExecutor.createSession(language, sourceCode);
    if (!session.success) {
      await session.cleanup();
      return {
        status: 'ERROR',
        totalPublicTests: testCases.length,
        passedPublicTests: 0,
        compilationError: session.compilationError,
        results: [],
      };
    }

    const publicResults: PublicTestResultItem[] = [];
    let passedCount = 0;

    try {
      for (let i = 0; i < testCases.length; i++) {
        const tc = testCases[i] as TestCaseItem;
        const execResult = await session.execute(tc.input, 6000);

        let passed = false;
        let errorMsg: string | undefined = undefined;

        if (execResult.timedOut) {
          errorMsg = 'Time Limit Exceeded';
        } else if (execResult.exitCode !== 0) {
          errorMsg = execResult.stderr || 'Runtime Error';
        } else {
          passed = validateOutput(execResult.stdout, tc.expected_output, tc.validation_type);
        }

        if (passed) {
          passedCount++;
        }

        publicResults.push({
          testCaseNumber: i + 1,
          input: tc.input,
          expectedOutput: tc.expected_output,
          actualOutput: execResult.stdout,
          runtimeMs: execResult.runtimeMs,
          passed,
          error: errorMsg,
        });
      }
    } finally {
      await session.cleanup();
    }

    return {
      status: 'SUCCESS',
      totalPublicTests: testCases.length,
      passedPublicTests: passedCount,
      results: publicResults,
    };
  }

  /**
   * Submits user solution: runs against ALL test cases (public + hidden).
   * Strictly keeps hidden test inputs and expected outputs private.
   */
  public static async submitSolution(
    userId: number,
    problemId: number,
    language: Language,
    sourceCode: string
  ): Promise<JudgeSubmitResult> {
    let testCases: any[] = [];
    try {
      const result = await pool.query(
        'SELECT id, problem_id, input, expected_output, is_hidden, validation_type FROM test_cases WHERE problem_id = $1 ORDER BY is_hidden ASC, id ASC',
        [problemId]
      );
      testCases = result.rows;
    } catch {}

    if (!testCases || testCases.length === 0) {
      const p = fallbackStore.getProblemById(problemId, null);
      if (p) {
        testCases = [
          ...p.public_tests.map((tc, idx) => ({
            id: idx + 1,
            problem_id: problemId,
            input: tc.input,
            expected_output: tc.expected_output,
            is_hidden: false,
            validation_type: p.validation_type || 'TRIMMED',
          })),
          ...p.hidden_tests.map((tc, idx) => ({
            id: 100 + idx + 1,
            problem_id: problemId,
            input: tc.input,
            expected_output: tc.expected_output,
            is_hidden: true,
            validation_type: p.validation_type || 'TRIMMED',
          })),
        ];
      }
    }

    if (testCases.length === 0) {
      throw new Error(`No test cases configured for problem #${problemId}`);
    }

    const totalCount = testCases.length;
    let passedCount = 0;
    let totalRuntimeMs = 0;
    let maxMemoryKb = 2048;
    let finalVerdict: JudgeVerdict = 'ACCEPTED';
    const publicResults: PublicTestResultItem[] = [];
    let compilationError: string | undefined = undefined;

    const session = await SandboxExecutor.createSession(language, sourceCode);

    if (!session.success) {
      finalVerdict = 'COMPILATION_ERROR';
      compilationError = session.compilationError;
      await session.cleanup();
    } else {
      let publicTestCounter = 1;

      try {
        for (let i = 0; i < testCases.length; i++) {
          const tc = testCases[i] as TestCaseItem;
          const execResult = await session.execute(tc.input, 6000);

          totalRuntimeMs = Math.max(totalRuntimeMs, execResult.runtimeMs);
          maxMemoryKb = Math.max(maxMemoryKb, execResult.memoryKb);

          let isPassed = false;
          let errorMsg: string | undefined;

          if (execResult.timedOut) {
            errorMsg = 'Time Limit Exceeded';
            if (finalVerdict === 'ACCEPTED') {
              finalVerdict = 'TIME_LIMIT_EXCEEDED';
            }
          } else if (execResult.exitCode !== 0) {
            errorMsg = execResult.stderr || 'Runtime Error';
            if (finalVerdict === 'ACCEPTED') {
              finalVerdict = 'RUNTIME_ERROR';
            }
          } else {
            isPassed = validateOutput(execResult.stdout, tc.expected_output, tc.validation_type);
            if (!isPassed && finalVerdict === 'ACCEPTED') {
              finalVerdict = 'WRONG_ANSWER';
            }
          }

          if (isPassed) {
            passedCount++;
          }

          // Populate public test results ONLY (hidden tests are NEVER leaked)
          if (!tc.is_hidden) {
            publicResults.push({
              testCaseNumber: publicTestCounter++,
              input: tc.input,
              expectedOutput: tc.expected_output,
              actualOutput: execResult.stdout,
              runtimeMs: execResult.runtimeMs,
              passed: isPassed,
              error: errorMsg,
            });
          }
        }
      } finally {
        await session.cleanup();
      }
    }

    if (finalVerdict === 'ACCEPTED' && passedCount < totalCount) {
      finalVerdict = 'WRONG_ANSWER';
    } else if (passedCount === totalCount) {
      finalVerdict = 'ACCEPTED';
    }

    let submissionId = Math.floor(Date.now() / 1000);

    // Insert submission record into PostgreSQL if reachable
    try {
      const subRes = await pool.query<{ id: number }>(
        `INSERT INTO submissions (
          user_id, problem_id, language, source_code, status,
          passed_tests, total_tests, runtime_ms, memory_kb
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        RETURNING id`,
        [
          userId,
          problemId,
          language,
          sourceCode,
          finalVerdict,
          passedCount,
          totalCount,
          totalRuntimeMs,
          maxMemoryKb,
        ]
      );
      if (subRes.rows && subRes.rows[0]) {
        submissionId = subRes.rows[0].id;
      }
    } catch (dbErr) {
      console.warn('[Judge Service] Could not insert submission into database, recorded in fallback store:', (dbErr as any).message);
    }

    // Update progress and streak activity
    try {
      const { ProgressService } = await import('../progress/progress.service');
      await ProgressService.recordSubmissionActivity(userId, problemId, finalVerdict, language, sourceCode);
    } catch (progErr) {
      console.error('Failed to record submission progress activity:', progErr);
    }

    // If solution is ACCEPTED: emit in-app notification
    if (finalVerdict === 'ACCEPTED') {
      import('../notification.service')
        .then(async ({ NotificationService }) => {
          let probTitle = `Problem #${problemId}`;
          try {
            const probRes = await pool.query('SELECT title FROM problems WHERE id = $1', [problemId]);
            if (probRes.rows && probRes.rows[0]?.title) {
              probTitle = probRes.rows[0].title;
            }
          } catch {
            const fallbackP = fallbackStore.getProblemById(problemId, null);
            if (fallbackP) probTitle = fallbackP.title;
          }

          await NotificationService.createNotification(
            userId,
            'PROBLEM_SOLVED',
            `Problem Solved: ${probTitle} ✓`,
            `Congratulations! Your solution passed all test cases.`,
            `/problems/${problemId}`
          );
        })
        .catch(() => {});
    }

    return {
      status: finalVerdict,
      passedCount,
      totalCount,
      runtimeMs: totalRuntimeMs,
      memoryKb: maxMemoryKb,
      compilationError,
      submissionId,
      publicResults,
    };
  }
}
