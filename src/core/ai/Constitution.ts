/**
 * @file src/core/ai/Constitution.ts
 * @description Outbound AI Response Guardrail Pipeline enforcing Socratic Guidance and Refusal Laws.
 * @license Apache-2.0
 */

import { ConstitutionViolationError } from '../errors/DomainErrors';
import { Result } from '../errors/Result';

export class AIConstitution {
  private static readonly FORBIDDEN_PATTERNS = [
    /here is the complete solution/i,
    /here is the code for your assignment/i,
    /i have written the project for you/i,
    /copy and paste this code/i,
  ];

  public static validateResponse(responseText: string): Result<boolean, ConstitutionViolationError> {
    for (const pattern of AIConstitution.FORBIDDEN_PATTERNS) {
      if (pattern.test(responseText)) {
        return Result.fail(
          new ConstitutionViolationError('AI generated complete solution, violating Socratic refusal rules.')
        );
      }
    }
    return Result.ok(true);
  }

  public static wrapSocraticPrompt(userQuery: string, memoryContext: string = ''): string {
    return [
      'SYSTEM INSTRUCTION (IMMUTABLE CONSTITUTION):',
      'You are the Eliot Socratic Tutor. You are STRICTLY FORBIDDEN from generating complete project code or direct answers for the user.',
      'Your absolute duty is to ask diagnostic Socratic questions that guide the user to discover solutions independently.',
      'If memory context is provided, align your question with past mistake patterns.',
      '----------------------------------------',
      `Memory Context: ${memoryContext}`,
      `User Query: ${userQuery}`,
    ].join('\n');
  }
}
