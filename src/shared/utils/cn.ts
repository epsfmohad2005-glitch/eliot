/**
 * @file src/shared/utils/cn.ts
 * @description Utility for class names joining.
 * @license Apache-2.0
 */

export function cn(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ');
}
