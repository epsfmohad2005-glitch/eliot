/**
 * @file src/domains/dom-012-analytics/index.ts
 * @description Public Gateway Barrel Exporter for DOM-012: Analytics Domain.
 * @license Apache-2.0
 */

export * from './contracts/ServiceInterface';
export * from './LocalTelemetryService';

export const DOM_012_META = {
  id: 'DOM-012' as const,
  name: 'Analytics Domain',
  codeName: 'LearningAnalytics',
  description: 'Monitors cognitive velocity metrics, study time, and study friction patterns.',
  version: '1.0.0',
  status: 'initialized' as const,
};
