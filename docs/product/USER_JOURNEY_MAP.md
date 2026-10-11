# ELIOT USER JOURNEY MAP

**Version:** 1.0.0  
**Scope:** Complete 8-Stage End-to-End User Journey  
**Philosophy:** Private Cognitive Operating System  

---

## 1. Complete Journey Lifecycle

| Stage | Screen / Context | User Goal / Action | System Response | Primary Interface Element |
| :--- | :--- | :--- | :--- | :--- |
| **1. System Boot** | `BootSequenceView` | Launch applet or initiate session. | Runs 6-step zero-exception kernel verification. | `ProgressBar` & Diagnostic Steps |
| **2. Command Center** | `MissionControlView` | Identify today's cognitive priority. | Answers: *"What is the single most valuable action right now?"* | Layer 1 Today's Mission & Primary CTA |
| **3. Mission Start** | Transition Handoff | Click *"Resume Mission"* / *"Start Mission"*. | Loads active session context and restores draft if interrupted. | Primary CTA (`Button variant="primary"`) |
| **4. Deep Learning** | Learning Session | Absorb core concepts, examine evidence. | Renders structured content with zero distraction. | Focus Workspace & Knowledge Nodes |
| **5. Practice Space** | Practice Workspace | Engage in retrieval practice and synthesis. | Evaluates responses with Ebbinghaus memory scoring. | Retrieval Cards & Input Fields |
| **6. Reflection** | Session Reflection | Consolidate learning and evaluate confidence. | Prompts metacognitive reflection questions. | Reflection Input & Confidence Selector |
| **7. Evidence Base** | Evidence Submission | Attach supporting notes or citations. | Index evidence into local CKM knowledge graph. | Evidence Badge & Source Attachments |
| **8. Session Return** | Mission Control | Conclude session and review updated mastery. | Recalculates retention scores and sets next review. | Layer 5 Metadata & Stage Progress |

---

## 2. Stage-by-Stage Handoff Details

### Stage 1 → Stage 2 (Boot to Mission Control)
* **Mental Handoff**: User transitions from system readiness verification to active decision-making.
* **Key Touchpoint**: Auto-completion of 100% progress bar smoothly unveils Mission Control surface.
* **Continuity Note**: Theme, font pairing, and background surface remain completely identical.

### Stage 2 → Stage 3 (Mission Control to Mission Start)
* **Mental Handoff**: User moves from orientation to active commitment.
* **Key Touchpoint**: Exactly one primary CTA button (*"Resume Mission"* or *"Start Mission"*).
* **Friction Check**: Zero secondary choices or competing buttons; decision velocity is instant.

### Stage 3 → Stage 4 (Mission Start to Deep Learning)
* **Mental Handoff**: User enters deep focus mode.
* **Key Touchpoint**: Transition to Learning Session workspace with quiet typography and minimal chrome.

### Stage 4 → Stage 5 (Deep Learning to Practice Space)
* **Mental Handoff**: User shifts from passive absorption to active retrieval.
* **Key Touchpoint**: Seamless inline workspace shift into interactive challenge cards.

### Stage 5 → Stage 6 → Stage 7 (Practice to Reflection to Evidence)
* **Mental Handoff**: User synthesizes new knowledge and grounds it with citations.
* **Key Touchpoint**: Structured reflection inputs and evidence confidence badge tagging.

### Stage 7 → Stage 8 (Evidence to Mission Control Return)
* **Mental Handoff**: User returns to command center with updated cognitive mastery state.
* **Key Touchpoint**: Recalculated retention index displayed in Layer 5 quiet information.
