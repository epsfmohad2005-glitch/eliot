/**
 * @file src/core/events/EventRegistry.ts
 * @description Master Registry of Canonical Events for Eliot PLOS.
 * @license Apache-2.0
 */

import { CanonicalEventType, DomainId } from '../../types';

export interface EventRegistryEntry {
  readonly type: CanonicalEventType;
  readonly publisherDomain: DomainId;
  readonly description: string;
}

export const CANONICAL_EVENT_REGISTRY: readonly EventRegistryEntry[] = [
  { type: 'LearningUnitStarted', publisherDomain: 'DOM-001', description: 'Emitted when a user initiates a LearningUnit' },
  { type: 'StageGateRequested', publisherDomain: 'DOM-001', description: 'Emitted when advancing to a new learning stage' },
  { type: 'StageGatePassed', publisherDomain: 'DOM-001', description: 'Emitted when a learning stage gate is passed' },
  { type: 'PracticeCompleted', publisherDomain: 'DOM-001', description: 'Emitted when mechanics practice drill is completed' },
  { type: 'ProjectDeliverableSubmitted', publisherDomain: 'DOM-005', description: 'Emitted when a project deliverable is submitted' },
  { type: 'EvidenceArtifactRegistered', publisherDomain: 'DOM-011', description: 'Emitted when evidence artifact hash is registered' },
  { type: 'ReviewEnqueued', publisherDomain: 'DOM-009', description: 'Emitted when a review is queued for AI evaluation' },
  { type: 'VerdictRendered', publisherDomain: 'DOM-009', description: 'Emitted when AI review evaluation renders a verdict' },
  { type: 'MemoryDecayCalculated', publisherDomain: 'DOM-002', description: 'Emitted when temporal memory decay is recalculated' },
  { type: 'SkillMastered', publisherDomain: 'DOM-002', description: 'Emitted when a skill node achieves verified mastery' },
  { type: 'CareerReadinessUpdated', publisherDomain: 'DOM-006', description: 'Emitted when career readiness score changes' },
  { type: 'FrictionPatternDetected', publisherDomain: 'DOM-012', description: 'Emitted when repeated study friction occurs' },
  { type: 'SocraticInterventionTriggered', publisherDomain: 'DOM-004', description: 'Emitted when Socratic AI intervention is triggered' },
  { type: 'DashboardRefreshed', publisherDomain: 'DOM-007', description: 'Emitted when workspace view priorities refresh' },
  { type: 'ImportStarted', publisherDomain: 'DOM-003', description: 'Emitted when RDI-1 import pipeline begins ingesting a source' },
  { type: 'ImportProgressUpdated', publisherDomain: 'DOM-003', description: 'Emitted when RDI-1 import pipeline advances a processing stage' },
  { type: 'ImportCompleted', publisherDomain: 'DOM-003', description: 'Emitted when RDI-1 import pipeline completes knowledge extraction' },
  { type: 'ImportCheckpointSaved', publisherDomain: 'DOM-003', description: 'Emitted when RDI-1 import pipeline saves IndexedDB recovery checkpoint' },
];
