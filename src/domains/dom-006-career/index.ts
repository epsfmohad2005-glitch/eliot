/**
 * @file src/domains/dom-006-career/index.ts
 * @description Public Gateway Barrel Exporter for DOM-006: Career Domain.
 * @license Apache-2.0
 */

export * from './contracts/ServiceInterface';

export const DOM_006_META = {
  id: 'DOM-006' as const,
  name: 'Career Domain',
  codeName: 'CareerMatrix',
  description: 'Calculates verified career readiness scores and maps competency matrix gaps.',
  version: '1.0.0',
  status: 'initialized' as const,
};
