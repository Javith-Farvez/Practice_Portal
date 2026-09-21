import { ValidationType } from './types';

/**
 * Validates actual output against expected output according to the problem's validation type.
 */
export const validateOutput = (
  actual: string,
  expected: string,
  type: ValidationType = 'TRIMMED',
  numericTolerance = 1e-5
): boolean => {
  if (type === 'EXACT') {
    return actual === expected;
  }

  if (type === 'NUMERIC') {
    const actualTokens = actual.trim().split(/\s+/).filter(Boolean);
    const expectedTokens = expected.trim().split(/\s+/).filter(Boolean);

    if (actualTokens.length !== expectedTokens.length) {
      return false;
    }

    for (let i = 0; i < actualTokens.length; i++) {
      const aNum = Number(actualTokens[i]);
      const eNum = Number(expectedTokens[i]);

      if (!isNaN(aNum) && !isNaN(eNum)) {
        if (Math.abs(aNum - eNum) > numericTolerance) {
          return false;
        }
      } else {
        if (actualTokens[i] !== expectedTokens[i]) {
          return false;
        }
      }
    }
    return true;
  }

  // Default: TRIMMED
  // Normalize Windows/Unix line endings (\r\n -> \n)
  const normActual = actual
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n')
    .split('\n')
    .map((line) => line.trimEnd())
    .join('\n')
    .trim();

  const normExpected = expected
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n')
    .split('\n')
    .map((line) => line.trimEnd())
    .join('\n')
    .trim();

  return normActual === normExpected;
};
