# ELIOT COGNITIVE FRICTION REPORT

**Version:** 1.0.0  
**Scope:** Analysis of Potential Cognitive Costs, Overload Risks, and Mitigations  

---

## 1. Cognitive Friction Analysis Matrix

| Friction Category | Potential Risk / Trigger | Problem Description | Root Cause | Impact | Mitigation Strategy |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Decision Overload** | Multiple competing primary buttons. | User hesitates on which action to take first. | Unfocused dashboard layouts. | High (Decision paralysis). | **Single-Question Law**: Exactly one primary CTA on Mission Control. |
| **Context Switching** | Abrupt mode or color changes between views. | Visual fatigue and disorientation. | Inconsistent component styling. | Medium (Mental distraction). | **Design Tokens (DM-1)**: Uniform `--surface-*` and `--text-*` variables across all screens. |
| **Visual Interruption** | Unsolicited popups, banners, or streaks. | Loss of deep focus during learning sessions. | Standard SaaS gamification tropes. | High (Focus broken). | **Cognitive Silence**: Zero streak popups, zero marketing toast alerts, zero celebratory confetti. |
| **State Ambiguity** | Unclear save status or lost drafts. | User worry about losing study notes after refresh. | Poor persistence status indicators. | Critical (Trust erosion). | **Layer 4 Interrupted Draft Banner**: Automatic LocalFirst draft restoration on launch. |
| **Unclear Terminology**| Generic jargon ("Decks", "XP", "Dashboard"). | Misalignment with cognitive learning goals. | Lazy product copywriting. | Medium (Lack of gravity). | **Brand Language Guide**: Strict cognitive terminology (`Mission Control`, `Ebbinghaus Retention Engine`). |

---

## 2. Friction Point Deep Dives & Resolved States

### 1. Interrupted Session Recovery
* **Problem**: Closing the browser during a learning session could cause fear of lost work.
* **Resolved State**: Mission Control automatically detects interrupted session drafts via Layer 4 Attention cards and presents an instant *"Resume Session"* button with zero data loss.

### 2. Information Hierarchy Separation
* **Problem**: Mixing system stats with mission objectives causes visual clutter.
* **Resolved State**: Strict 5-layer hierarchy isolates mission objective in Layer 1, rationale in Layer 2, intention in Layer 3, alerts in Layer 4, and system stats in Layer 5 at the very bottom.
