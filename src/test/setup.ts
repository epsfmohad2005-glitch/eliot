import '@testing-library/jest-dom';
import { vi, beforeEach } from 'vitest';

// Mock localStorage if missing
const localStorageMock = (function () {
  let store: Record<string, string> = {};
  return {
    getItem: vi.fn((key: string) => store[key] || null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value.toString();
    }),
    removeItem: vi.fn((key: string) => {
      delete store[key];
    }),
    clear: vi.fn(() => {
      store = {};
    }),
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
  writable: true,
});

// Mock subtle crypto digest if missing in test environment
if (!globalThis.crypto) {
  // @ts-expect-error mock crypto for node/jsdom
  globalThis.crypto = {};
}

if (!globalThis.crypto.subtle) {
  // @ts-expect-error mock subtle crypto
  globalThis.crypto.subtle = {
    digest: vi.fn(async (algorithm: string, data: BufferSource) => {
      const buffer = new Uint8Array(data as ArrayBuffer);
      let hash = 0;
      for (let i = 0; i < buffer.length; i++) {
        hash = (hash << 5) - hash + buffer[i];
        hash |= 0;
      }
      const hex = Math.abs(hash).toString(16).padStart(64, '0');
      const hexArr = new Uint8Array(32);
      for (let i = 0; i < 32; i++) {
        hexArr[i] = parseInt(hex.substring(i * 2, i * 2 + 2) || '0', 16);
      }
      return hexArr.buffer;
    }),
  };
}

beforeEach(() => {
  window.localStorage.clear();
  vi.clearAllMocks();
});
