import { render, RenderOptions } from '@testing-library/react';
import React, { ReactElement } from 'react';
import { expect } from 'vitest';
import { LanguageProvider } from '../i18n';
import { Result } from '../core/errors/Result';

interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  language?: 'en' | 'ar';
}

export function renderWithProviders(
  ui: ReactElement,
  { language = 'en', ...renderOptions }: CustomRenderOptions = {}
) {
  function Wrapper({ children }: { children: React.ReactNode }) {
    return <LanguageProvider>{children}</LanguageProvider>;
  }

  return render(ui, { wrapper: Wrapper, ...renderOptions });
}

export function assertOk<T, E>(result: Result<T, E>): asserts result is { ok: true; value: T } {
  expect(result.ok).toBe(true);
  if (!result.ok) {
    throw new Error(`Expected Result to be ok, but got error: ${'error' in result ? result.error : 'unknown'}`);
  }
}

export * from '@testing-library/react';
export { default as userEvent } from '@testing-library/user-event';
