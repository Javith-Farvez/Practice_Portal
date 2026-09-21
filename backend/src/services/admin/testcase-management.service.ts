import { pool } from '../../config/db';
import { AuditService } from './audit.service';

export interface TestCasePayload {
  input: string;
  expected_output: string;
  is_hidden?: boolean;
  validation_type?: 'EXACT' | 'TRIMMED' | 'NUMERIC';
}

export class TestCaseManagementService {
  /**
   * Retrieve all test cases for a problem (public and hidden)
   */
  public static async getProblemTestCases(problemId: number) {
    const result = await pool.query(
      `SELECT id, problem_id, input, expected_output, is_hidden, validation_type, created_at
       FROM test_cases
       WHERE problem_id = $1
       ORDER BY is_hidden ASC, id ASC`,
      [problemId]
    );

    return result.rows.map((r: any) => ({
      ...r,
      is_hidden: Boolean(r.is_hidden),
    }));
  }

  /**
   * Add a new test case to a problem
   */
  public static async addTestCase(
    problemId: number,
    data: TestCasePayload,
    adminId: number
  ) {
    if (data.input === undefined || data.expected_output === undefined) {
      throw new Error('Both input and expected_output are required.');
    }

    const validationType = ['EXACT', 'TRIMMED', 'NUMERIC'].includes(data.validation_type || '')
      ? data.validation_type
      : 'TRIMMED';

    const isHidden = Boolean(data.is_hidden);

    const result = await pool.query<{ id: number }>(
      `INSERT INTO test_cases (problem_id, input, expected_output, is_hidden, validation_type)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id`,
      [problemId, data.input, data.expected_output, isHidden, validationType]
    );

    const testId = result.rows[0].id;

    await AuditService.recordAction(adminId, 'TEST_CASE_ADDED', 'test_case', testId, {
      problem_id: problemId,
      is_hidden: isHidden,
      validation_type: validationType,
    });

    return {
      id: testId,
      problem_id: problemId,
      input: data.input,
      expected_output: data.expected_output,
      is_hidden: isHidden,
      validation_type: validationType,
    };
  }

  /**
   * Update an existing test case
   */
  public static async updateTestCase(
    testId: number,
    data: Partial<TestCasePayload>,
    adminId: number
  ) {
    const checkRes = await pool.query(
      'SELECT * FROM test_cases WHERE id = $1 LIMIT 1',
      [testId]
    );

    if (checkRes.rows.length === 0) {
      throw new Error('Test case not found.');
    }

    const existing = checkRes.rows[0];
    const input = data.input !== undefined ? data.input : existing.input;
    const expectedOutput = data.expected_output !== undefined ? data.expected_output : existing.expected_output;
    const isHidden = data.is_hidden !== undefined ? Boolean(data.is_hidden) : Boolean(existing.is_hidden);
    const validationType = data.validation_type !== undefined ? data.validation_type : existing.validation_type;

    await pool.query(
      `UPDATE test_cases 
       SET input = $1, expected_output = $2, is_hidden = $3, validation_type = $4
       WHERE id = $5`,
      [input, expectedOutput, isHidden, validationType, testId]
    );

    await AuditService.recordAction(adminId, 'TEST_CASE_UPDATED', 'test_case', testId, {
      problem_id: existing.problem_id,
      is_hidden: isHidden,
      validation_type: validationType,
    });

    return {
      id: testId,
      problem_id: existing.problem_id,
      input,
      expected_output: expectedOutput,
      is_hidden: isHidden,
      validation_type: validationType,
    };
  }

  /**
   * Delete a test case
   */
  public static async deleteTestCase(testId: number, adminId: number) {
    const checkRes = await pool.query(
      'SELECT problem_id, is_hidden FROM test_cases WHERE id = $1 LIMIT 1',
      [testId]
    );

    if (checkRes.rows.length === 0) {
      throw new Error('Test case not found.');
    }

    const problemId = checkRes.rows[0].problem_id;
    await pool.query('DELETE FROM test_cases WHERE id = $1', [testId]);

    await AuditService.recordAction(adminId, 'TEST_CASE_DELETED', 'test_case', testId, {
      problem_id: problemId,
    });

    return true;
  }
}
