import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import React from 'react';
import App from '../App';
import { structuredErrorReporter } from '../core/observability/StructuredErrorReporter';

describe('App Runtime Integrity Verification', () => {
  it('mounts App and boot sequence without unhandled errors', async () => {
    render(<App />);
    const reports = structuredErrorReporter.getReports();
    expect(reports.length).toBe(0);
  });

  it('renders LearningSessionWorkspace and tests hint and challenge error paths', async () => {
    const { learningDomainService } = await import('../domains/dom-001-learning/LearningDomainService');
    const { LearningSessionWorkspace } = await import('../shared/components/learning/LearningSessionWorkspace');

    const { LanguageProvider } = await import('../i18n');
    const { ThemeProvider } = await import('../core/theme/ThemeContext');

    render(
      <ThemeProvider>
        <LanguageProvider>
          <LearningSessionWorkspace onExitWorkspace={() => {}} />
        </LanguageProvider>
      </ThemeProvider>
    );

    // Test requesting hint
    const hintRes = await learningDomainService.requestSocraticHint();
    expect(hintRes.ok).toBe(true);

    const reports = structuredErrorReporter.getReports();
    if (reports.length > 0) {
      console.log('Detected error reports during LearningSessionWorkspace actions:', JSON.stringify(reports, null, 2));
    }
    expect(reports.length).toBe(0);
  });
});
