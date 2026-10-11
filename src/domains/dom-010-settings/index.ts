/**
 * @file src/domains/dom-010-settings/index.ts
 * @description Public Gateway Barrel Exporter for DOM-010: Settings Domain.
 * @license Apache-2.0
 */

export * from './contracts/ServiceInterface';

export const DOM_010_META = {
  id: 'DOM-010' as const,
  name: 'Settings Domain',
  codeName: 'SystemSettings',
  description: 'Manages PLOS single-user instance configuration, preferences, and operational targets.',
  version: '1.0.0',
  status: 'initialized' as const,
};
