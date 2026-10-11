/**
 * @file src/config/environment.ts
 * @description Master Environment & System Constants Configuration.
 * @license Apache-2.0
 */

export interface SystemEnvironmentConfig {
  readonly appName: string;
  readonly appVersion: string;
  readonly sprintStage: string;
  readonly defaultLocale: string;
  readonly isProduction: boolean;
  readonly apiBaseUrl: string;
}

export const ENVIRONMENT_CONFIG: SystemEnvironmentConfig = {
  appName: 'Eliot - Personal Learning OS',
  appVersion: '0.1.0',
  sprintStage: 'Sprint 0.1 — Project Skeleton',
  defaultLocale: 'en-US',
  isProduction: false,
  apiBaseUrl: '/api',
};
