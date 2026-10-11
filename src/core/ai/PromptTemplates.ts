/**
 * @file src/core/ai/PromptTemplates.ts
 * @description Bounded Prompt Context Formatters for Socratic Guidance & Rubric Evaluations.
 * @license Apache-2.0
 */

export const PromptTemplates = {
  socraticGuidance(unitTitle: string, userReflection: string): string {
    return `Learning Unit: "${unitTitle}"\nUser Reflection: "${userReflection}"\nIdentify the core mental model gap and ask one precise Socratic diagnostic question.`;
  },

  rubricEvaluation(rubricDescription: string, artifactContent: string): string {
    return `Rubric Criteria:\n${rubricDescription}\n\nSubmitted Evidence Artifact:\n${artifactContent}\n\nEvaluate objectively against rubric criteria. Return structured verdict: Approved or RevisionRequired with specific critique points.`;
  },
};
