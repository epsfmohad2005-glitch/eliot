/**
 * @file src/domains/dom-011-evidence/index.ts
 * @description Public Gateway Barrel Exporter for DOM-011: Evidence Domain.
 * @license Apache-2.0
 */

export * from './contracts/ServiceInterface';
export * from './EvidenceDomainService';

export const DOM_011_META = {
  id: 'DOM-011' as const,
  name: 'Evidence Domain',
  codeName: 'EvidenceRegistry',
  description: 'Registers immutable evidence artifacts and generates SHA-256 cryptographic hashes for proof of work.',
  version: '1.0.0',
  status: 'initialized' as const,
};
