/**
 * @file src/domains/dom-010-settings/contracts/ServiceInterface.ts
 * @description Inbound/Outbound Service Interface for DOM-010: Settings Domain.
 * @license Apache-2.0
 */

import { Result } from '../../../core/errors/Result';

export interface UserSettingsProfile {
  readonly instanceId: string;
  readonly userName: string;
  readonly dailyCommitmentMinutes: number;
  readonly offlineSyncEnabled: boolean;
  readonly socraticInterventionSensitivity: 'low' | 'medium' | 'high';
}

export interface ISettingsDomainService {
  getSettings(): Promise<Result<UserSettingsProfile, Error>>;
  updateSettings(settings: Partial<UserSettingsProfile>): Promise<Result<UserSettingsProfile, Error>>;
}
