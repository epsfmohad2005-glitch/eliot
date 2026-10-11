/**
 * @file src/core/memory/DecayEngine.ts
 * @description Mathematical Temporal Memory Decay Engine with Hard Floor Cap (35%).
 * @license Apache-2.0
 */

export class DecayEngine {
  private static readonly DECAY_CONSTANT_LAMBDA = 0.05; // Decay rate per day
  private static readonly HARD_DECAY_FLOOR = 0.35; // 35% Hard decay floor

  public static calculateDecayedScore(peakScore: number, daysElapsed: number): number {
    if (daysElapsed <= 0) return peakScore;

    // Exponential decay formula: C(t) = C0 * e^(-lambda * t)
    const decayed = peakScore * Math.exp(-DecayEngine.DECAY_CONSTANT_LAMBDA * daysElapsed);

    // Enforce 35% Hard Decay Floor
    const floor = peakScore * DecayEngine.HARD_DECAY_FLOOR;
    return Math.max(decayed, floor);
  }
}
