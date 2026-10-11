/**
 * @file src/domains/index.ts
 * @description Master Gateway Barrel Exporter for All 12 Canonical Domains.
 * @license Apache-2.0
 */

import { DOM_001_META } from './dom-001-learning';
import { DOM_002_META } from './dom-002-memory';
import { DOM_003_META } from './dom-003-knowledge';
import { DOM_004_META } from './dom-004-ai-core';
import { DOM_005_META } from './dom-005-project';
import { DOM_006_META } from './dom-006-career';
import { DOM_007_META } from './dom-007-dashboard';
import { DOM_008_META } from './dom-008-navigation';
import { DOM_009_META } from './dom-009-review';
import { DOM_010_META } from './dom-010-settings';
import { DOM_011_META } from './dom-011-evidence';
import { DOM_012_META } from './dom-012-analytics';

export * from './dom-001-learning';
export * from './dom-002-memory';
export * from './dom-003-knowledge';
export * from './dom-004-ai-core';
export * from './dom-005-project';
export * from './dom-006-career';
export * from './dom-007-dashboard';
export * from './dom-008-navigation';
export * from './dom-009-review';
export * from './dom-010-settings';
export * from './dom-011-evidence';
export * from './dom-012-analytics';

export const MASTER_DOMAIN_REGISTRY = [
  DOM_001_META,
  DOM_002_META,
  DOM_003_META,
  DOM_004_META,
  DOM_005_META,
  DOM_006_META,
  DOM_007_META,
  DOM_008_META,
  DOM_009_META,
  DOM_010_META,
  DOM_011_META,
  DOM_012_META,
] as const;
