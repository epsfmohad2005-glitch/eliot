/**
 * @file src/domains/dom-009-review/index.ts
 * @description Public Gateway Barrel Exporter for DOM-009: Review Domain.
 * @license Apache-2.0
 */

export * from './contracts/ServiceInterface';
export * from './ReviewDomainService';

export const DOM_009_META = {
  id: 'DOM-009' as const,
  name: 'Review Domain',
  codeName: 'ReviewPipeline',
  description: 'Manages submission queues, objective rubric evaluations, and uncompromising diagnostic verdicts.',
  version: '1.0.0',
  status: 'initialized' as const,
};
