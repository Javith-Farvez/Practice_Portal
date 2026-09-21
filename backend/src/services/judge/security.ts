import { Language } from './types';

/**
 * Checks source code for disallowed libraries, system execution calls, and unauthorized file access.
 */
export const checkCodeSecurity = (code: string, language: Language): { safe: boolean; reason?: string } => {
  // Check payload size
  if (code.length > 50000) {
    return { safe: false, reason: 'Source code exceeds maximum permitted size of 50KB.' };
  }

  if (language === 'JAVA') {
    // Prohibited patterns in Java submissions
    const prohibitedPatterns = [
      /\bProcessBuilder\b/,
      /\bRuntime\.getRuntime\(\)/,
      /\bSystem\.exit\b/,
      /\bjava\.lang\.reflect\b/,
      /\bjava\.net\b/,
      /\bjava\.nio\.file\b/,
      /\bjava\.io\.File\b/,
      /\bClassLoader\b/,
      /\bSecurityManager\b/,
    ];

    for (const pattern of prohibitedPatterns) {
      if (pattern.test(code)) {
        return {
          safe: false,
          reason: 'Security violation: Disallowed library or reflection call detected in Java code.',
        };
      }
    }
  }

  return { safe: true };
};

/**
 * Sanitizes compiler and runtime error outputs so internal server filesystem paths are never leaked.
 */
export const sanitizeErrorOutput = (errorText: string, tempDirPath: string): string => {
  if (!errorText) return '';

  let sanitized = errorText;

  // Replace absolute temporary directory path with a clean relative reference
  if (tempDirPath) {
    const escaped = tempDirPath.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    sanitized = sanitized.replace(new RegExp(escaped, 'gi'), '');
  }

  // Scrub any remaining windows drive / user paths
  sanitized = sanitized.replace(/[a-zA-Z]:\\[^\s:"]+/g, (match) => {
    const parts = match.split(/[/\\]/);
    return parts[parts.length - 1];
  });

  // Limit error length to prevent UI flooding
  if (sanitized.length > 2000) {
    sanitized = sanitized.substring(0, 2000) + '\n...[Output truncated]';
  }

  return sanitized.trim();
};
