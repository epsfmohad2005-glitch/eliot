# ADR-002: Rejection of Artificial Gamification Mechanics

* **Status**: Accepted
* **Date**: 2026-08-06
* **Deciders**: Eliot Core Architecture Team & Product Council
* **Technical Area**: UX Mechanics, Motivation Model, Product Identity

---

## Context and Problem Statement
Modern digital learning apps extensively deploy gamification mechanics—such as experience points (XP), daily streak counters, vanity badges, public leaderboards, confetti animations, and artificial urgency timers. 

While these patterns optimize for daily active user (DAU) retention and short-term dopamine spikes, research and practical experience demonstrate that they foster superficial engagement, encourage shortcut behavior, and induce cognitive anxiety when streaks break. Eliot is built for serious individuals seeking professional competence, where intrinsic motivation and tangible evidence must replace artificial rewards.

---

## Decision Drivers
1. **Purity of Intent**: Professional competence cannot be measured in virtual points or badges.
2. **Prevention of Goodhart's Law**: When a measure becomes a target (e.g. maintaining a 30-day streak), it ceases to be a good measure of learning.
3. **Cognitive Calm**: Educational software must feel like a focused workstation, free from distracting popups, celebratory noises, or artificial pressure.
4. **Authentic Evidence**: Satisfaction derives from completing real-world projects and verifying competence, not collecting digital trophies.

---

## Decision Outcome
**Chosen Option**: **Strict Rejection of Artificial Gamification**.

Eliot shall never include:
* Experience points (XP), levels, or virtual currency.
* Daily streak counters or penalty warnings for missed days.
* Public leaderboards or social competition feeds.
* Celebratory visual clutter (confetti bursts, unearned congratulatory popups).
* Vanity badges or unverified completion certificates.

Instead, progress is tracked purely through:
* **Objective Mastery Scores ($M_c$)** grounded in practice metrics.
* **Cognitive Memory Stability ($S$)** and Retention ($R$) decay curves.
* **Immutable Cryptographic Evidence Artifacts** verifying real work.

### Positive Consequences
* **Sustained Intrinsic Motivation**: Users focus on deep skill mastery rather than gaming system mechanics.
* **Calm UX Environment**: Zero visual noise or artificial anxiety during study sessions.
* **Professional Credibility**: Evidence produced within Eliot represents authentic, verifiable work product.

### Negative Consequences
* **Steeper Onboarding Curve**: Users accustomed to casual gamified apps must adjust to a self-directed, rigorous environment.

---

## Compliance & Enforcement
Code reviews and pull requests are gatekept against introducing gamification elements. Any pull request adding points, badges, streaks, or confetti will be rejected immediately under Chapter 12 of the Project Bible.
