/**
 * @file src/domains/dom-004-ai-core/index.ts
 * @description Public Gateway Barrel Exporter for DOM-004: AI Core Domain.
 * @license Apache-2.0
 */

export * from './contracts/ServiceInterface';
export * from './AICoreDomainService';

export const DOM_004_META = {
  id: 'DOM-004' as const,
  name: 'AI Core Domain',
  codeName: 'SocraticAICore',
  description: 'Executes constitutional Socratic guidance and objective rubric evaluations.',
  version: '1.0.0',
  status: 'initialized' as const,
};
