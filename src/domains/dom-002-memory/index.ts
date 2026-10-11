/**
 * @file src/domains/dom-002-memory/index.ts
 * @description Public Gateway Barrel Exporter for DOM-002: Memory Domain.
 * @license Apache-2.0
 */

export * from './contracts/ServiceInterface';
export * from './MemoryDomainService';

export const DOM_002_META = {
  id: 'DOM-002' as const,
  name: 'Memory Domain',
  codeName: 'CognitiveMemory',
  description: 'Manages cognitive skill profiles, mistake patterns, and temporal memory decay.',
  version: '1.0.0',
  status: 'initialized' as const,
};
