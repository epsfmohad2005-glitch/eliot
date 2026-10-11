/**
 * @file src/domains/dom-003-knowledge/index.ts
 * @description Public Gateway Barrel Exporter for DOM-003: Knowledge Domain.
 * @license Apache-2.0
 */

export * from './contracts/ServiceInterface';
export * from './KnowledgeDomainService';

export const DOM_003_META = {
  id: 'DOM-003' as const,
  name: 'Knowledge Domain',
  codeName: 'KnowledgeGraph',
  description: 'Maintains canonical concept DAGs, prerequisite dependencies, and ontology definitions.',
  version: '1.0.0',
  status: 'initialized' as const,
};
