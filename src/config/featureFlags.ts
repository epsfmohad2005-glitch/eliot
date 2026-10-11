/**
 * @file src/config/featureFlags.ts
 * @description System Feature Flags controlling Sprint feature rollout.
 * @license Apache-2.0
 */

export interface SystemFeatureFlags {
  readonly enableSocraticAICore: boolean;
  readonly enable8StageLifecycle: boolean;
  readonly enableMemoryDecayEngine: boolean;
  readonly enableCryptographicEvidence: boolean;
  readonly enableCareerMatrixMapping: boolean;
  readonly enableOfflineIndexedDB: boolean;
}

export const FEATURE_FLAGS: SystemFeatureFlags = {
  enableSocraticAICore: false, // Sprint 0.2
  enable8StageLifecycle: false, // Sprint 0.3
  enableMemoryDecayEngine: false, // Sprint 0.4
  enableCryptographicEvidence: false, // Sprint 0.5
  enableCareerMatrixMapping: false, // Sprint 0.6
  enableOfflineIndexedDB: true, // Active baseline
};
