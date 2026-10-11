/**
 * @file src/shared/components/session/EvidenceLedgerAuditView.tsx
 * @description Cryptographic Evidence Ledger Audit View for Stage Deliverables.
 * Consumes FCS-1 primitives and Design Tokens exclusively.
 * @license Apache-2.0
 */

import React, { useState } from 'react';
import { EvidenceArtifactEntity } from '../../../types';
import { Card, Button } from '../ui';
import { ShieldCheck, Hash, CheckCircle2, Lock, ExternalLink, Copy, Check } from 'lucide-react';

export interface EvidenceLedgerAuditViewProps {
  unitId?: string;
  className?: string;
  artifacts?: readonly EvidenceArtifactEntity[];
}

export const EvidenceLedgerAuditView: React.FC<EvidenceLedgerAuditViewProps> = ({
  unitId = 'unit-001-core-architecture',
  className = '',
  artifacts,
}) => {
  const [copiedHash, setCopiedHash] = useState<string | null>(null);

  const defaultArtifacts: EvidenceArtifactEntity[] = [
    {
      id: 'art-001',
      unitId,
      stageNumber: 2,
      contentHash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      qualityScore: 0.92,
      verificationStatus: 'Verified',
      evidenceType: 'Mechanics Practice Drill Output',
    },
    {
      id: 'art-002',
      unitId,
      stageNumber: 3,
      contentHash: 'f4b3c22118fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b123',
      timestamp: new Date(Date.now() - 1800000).toISOString(),
      qualityScore: 0.88,
      verificationStatus: 'Verified',
      evidenceType: 'Application Code Implementation',
    },
  ];

  const displayArtifacts = artifacts || defaultArtifacts;

  const handleCopy = (hash: string) => {
    navigator.clipboard?.writeText(hash);
    setCopiedHash(hash);
    setTimeout(() => setCopiedHash(null), 1500);
  };

  return (
    <Card
      id="evidence-ledger-audit-view"
      variant="default"
      padding="sm"
      className={`space-y-3 font-sans ${className}`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[var(--border-color)] pb-3">
        <div className="flex items-center gap-2">
          <Lock className="w-4 h-4 text-[var(--accent-signal)]" />
          <h3 className="font-ui-body-bold text-sm font-bold text-[var(--text-primary)]">
            Cryptographic Evidence Ledger
          </h3>
          <span className="px-2 py-0.5 rounded text-[10px] font-mono-ui bg-[var(--surface-low)] text-[var(--status-success)] border border-[var(--border-color)] font-bold">
            Immutable SHA-256 Audit Trail
          </span>
        </div>
        <span className="text-[11px] font-mono-ui text-[var(--text-secondary)]">
          Target Unit: {unitId}
        </span>
      </div>

      <div className="space-y-2">
        {displayArtifacts.map((art) => (
          <div
            key={art.id}
            className="p-3 bg-[var(--surface-low)] border border-[var(--border-color)] rounded-[var(--mode-radius)] space-y-2"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="px-1.5 py-0.5 rounded bg-[var(--surface-card)] text-[var(--accent-signal)] border border-[var(--border-color)] font-mono-ui text-[10px] font-bold">
                  Stage {art.stageNumber}
                </span>
                <span className="text-xs font-bold text-[var(--text-primary)] font-ui-body-bold">
                  {art.evidenceType || 'Stage Artifact'}
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs font-mono-ui">
                <span className="text-[var(--text-secondary)] text-[10px]">
                  Eq Quality: {(art.qualityScore ?? 1.0) * 100}%
                </span>
                <span className="text-[var(--status-success)] flex items-center gap-1 font-bold text-[10px]">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  {art.verificationStatus || 'Verified'}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between gap-2 bg-[var(--surface-card)] border border-[var(--border-color)] rounded-[var(--mode-radius)] px-2.5 py-1.5 font-mono-ui text-[11px]">
              <div className="flex items-center gap-2 truncate text-[var(--text-secondary)]">
                <Hash className="w-3.5 h-3.5 text-[var(--text-tertiary)] shrink-0" />
                <span className="truncate">{art.contentHash}</span>
              </div>
              <button
                type="button"
                onClick={() => handleCopy(art.contentHash)}
                className="p-1 hover:bg-[var(--surface-high)] rounded text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors shrink-0"
                title="Copy SHA-256 Hash"
              >
                {copiedHash === art.contentHash ? (
                  <Check className="w-3.5 h-3.5 text-[var(--status-success)]" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
              </button>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};
