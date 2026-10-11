/**
 * @file src/domains/dom-008-navigation/index.ts
 * @description Public Gateway Barrel Exporter for DOM-008: Navigation Domain.
 * @license Apache-2.0
 */

export * from './contracts/ServiceInterface';

export const DOM_008_META = {
  id: 'DOM-008' as const,
  name: 'Navigation Domain',
  codeName: 'RouterNavigation',
  description: 'Manages ambient view transitions and system navigation routing without UI sidebar clutter.',
  version: '1.0.0',
  status: 'initialized' as const,
};
