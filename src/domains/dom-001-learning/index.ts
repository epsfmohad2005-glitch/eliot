/**
 * @file src/domains/dom-001-learning/index.ts
 * @description Public Gateway Barrel Exporter for DOM-001: Learning Domain.
 * @license Apache-2.0
 */

export * from './contracts/ServiceInterface';
export * from './LearningDomainService';

export const DOM_001_META = {
  id: 'DOM-001' as const,
  name: 'Learning Domain',
  codeName: 'LearningEngine',
  description: 'Governs curriculum structure, learning paths, and the 8-Stage Learning Lifecycle.',
  version: '1.0.0',
  status: 'initialized' as const,
};

