/**
 * @file src/shared/components/session/DomainArchitectureBanner.test.tsx
 * @description Unit tests for DomainArchitectureBanner component.
 * @license Apache-2.0
 */

import { describe, it, expect, vi } from 'vitest';
import { screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { renderWithProviders } from '../../../test/utils';
import { DomainArchitectureBanner } from './DomainArchitectureBanner';

describe('DomainArchitectureBanner', () => {
  it('renders the architecture title and bounded contexts', () => {
    renderWithProviders(<DomainArchitectureBanner />);

    expect(screen.getByText(/PLOS Kernel Architecture/i)).toBeInTheDocument();
    expect(screen.getByText(/12 Bounded Contexts registered/i)).toBeInTheDocument();
  });

  it('renders custom activeDomainCount prop when supplied', () => {
    renderWithProviders(<DomainArchitectureBanner activeDomainCount={10} />);

    expect(screen.getByText(/10 Bounded Contexts registered/i)).toBeInTheDocument();
  });

  it('calls onInspect when the inspect button is clicked', () => {
    const handleInspect = vi.fn();
    renderWithProviders(<DomainArchitectureBanner onInspect={handleInspect} />);

    const inspectBtn = screen.getByRole('button', { name: /Inspect Architecture/i });
    expect(inspectBtn).toBeInTheDocument();

    fireEvent.click(inspectBtn);
    expect(handleInspect).toHaveBeenCalledTimes(1);
  });

  it('calls onOpenEventStream when the event stream button is clicked', () => {
    const handleEventStream = vi.fn();
    renderWithProviders(<DomainArchitectureBanner onOpenEventStream={handleEventStream} />);

    const eventStreamBtn = screen.getByRole('button', { name: /Event Stream/i });
    expect(eventStreamBtn).toBeInTheDocument();

    fireEvent.click(eventStreamBtn);
    expect(handleEventStream).toHaveBeenCalledTimes(1);
  });
});
