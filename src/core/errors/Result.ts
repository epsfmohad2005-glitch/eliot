/**
 * @file src/core/errors/Result.ts
 * @description Monadic Result<T, E> implementation for zero-exception, deterministic error handling.
 * @license Apache-2.0
 */

export type Result<T, E = Error> =
  | { readonly ok: true; readonly value: T }
  | { readonly ok: false; readonly error: E };

export function isOk<T, E>(result: Result<T, E>): result is { readonly ok: true; readonly value: T } {
  return result.ok === true;
}

export function isFail<T, E>(result: Result<T, E>): result is { readonly ok: false; readonly error: E } {
  return result.ok === false;
}

export const Result = {
  ok<T>(value: T): Result<T, never> {
    return { ok: true, value };
  },

  fail<E>(error: E): Result<never, E> {
    return { ok: false, error };
  },

  map<T, U, E>(result: Result<T, E>, fn: (val: T) => U): Result<U, E> {
    if (isFail(result)) {
      return Result.fail(result.error);
    }
    return Result.ok(fn(result.value));
  },

  flatMap<T, U, E>(result: Result<T, E>, fn: (val: T) => Result<U, E>): Result<U, E> {
    if (isFail(result)) {
      return Result.fail(result.error);
    }
    return fn(result.value);
  },
};
