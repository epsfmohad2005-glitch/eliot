# Focus Environment Specification — AE-1 Cognitive Lock

## Philosophy & Cognitive Ergonomics

The Focus Environment is an intentional, distraction-free sanctuary triggered when a user enters an active Learning Session, Practice Drill, or Deep Reflection session.

In standard interfaces, continuous telemetry, notification badges, sidebar navigation, and status tickers compete for visual attention. In AE-1, entering Focus Mode collapses extraneous UI elements to direct 100% of visual bandwidth toward the learning material.

---

## 1. Focus Lock Activation Protocol

When a learning session is initiated:
1. **Header & Navigation Collapse**: The top System Status Bar, main Header Bar, and bottom Navigation Frame smoothly collapse out of view (`opacity: 0`, `pointer-events: none`).
2. **Minimal Focus Bar Ingress**: A minimalist, non-distracting 32px Focus Bar appears at the top of the viewport, containing only:
   - Session Timer (`14:52`)
   - Concept Title
   - Mastery Progress Indicator
   - Minimal "Exit Focus Lock (`Esc`)" Button
3. **Workspace Center Alignment**: Main content width contracts to optimal reading width ($65-75\text{ch}$ for prose, $80\text{ch}$ for code).
4. **Notification Suppression**: Non-critical system alerts, error logs, and ambient toasts are queued silently until session exit.

---

## 2. Visual Noise Filter Matrix

| UI Component | Standard Mode State | Focus Lock State | Rationale |
| :--- | :--- | :--- | :--- |
| **System Status Bar** | Visible | **Hidden** | Eliminates live ticker movement from field of view. |
| **Header Bar** | Visible | **Hidden** | Removes navigation links and secondary actions. |
| **Bottom Navigation Frame** | Visible | **Hidden** | Prevents accidental tab switching mid-session. |
| **Sidebar / Drawer** | Expanded / Collapsible | **Force Collapsed** | Maximizes horizontal workspace for reading. |
| **Telemetry Badges** | Animated | **Static / Hidden** | Stops subtle peripheral motion that triggers distraction. |
| **Focus Bar** | Hidden | **Minimal Top Pin** | Provides essential time and escape controls. |

---

## 3. Keyboard Interactions & Safety Escape

- **Exit Focus Lock**: Pressing `Esc` or clicking the "Exit Focus Lock" control smoothly expands the full AppShell (`200ms` snappy transition).
- **Toggle Minimal Timer**: Pressing `⌘T` toggles the minimal session timer on/off for users who experience timer anxiety.
- **Toggle Cognitive Silence**: Pressing `⌘S` hides all remaining indicators, leaving pure learning content on screen.
