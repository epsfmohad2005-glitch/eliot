# EAR-1 — Integration Architecture & Connector Framework

## External Integration Ecosystem

Eliot connects seamlessly to the user's existing developer, workplace, messaging, and storage ecosystem while maintaining strict security and payload normalization.

---

## Integration Categories & Protocol Matrix

| Target System | Connection Protocol | Primary Workflow Capability | Authentication Standard |
| :--- | :--- | :--- | :--- |
| **GitHub** | REST API v3 / GraphQL v4 / Webhooks | Issue tracking, PR reviews, code commit syncing, repo ingestion | OAuth 2.0 / App Installation Token |
| **Google Drive** | Drive REST API v3 | Document ingestion into CKM, automatic PDF/Notes sync | OAuth 2.0 (Scopes: `drive.readonly`) |
| **Gmail** | Gmail REST API v1 | Inbound newsletter summaries, email notification triggers | OAuth 2.0 (Scopes: `gmail.readonly`, `gmail.send`) |
| **Google Calendar** | Calendar REST API v3 | Focus session blocking, scheduled learning reminders | OAuth 2.0 (Scopes: `calendar.events`) |
| **Telegram** | Telegram Bot API / Webhooks | Quick mobile note capture, instant alert dispatch | Bot Token |
| **Discord** | Discord Webhooks / Gateway WebSocket | Community knowledge sharing, interactive bot commands | Bot Token / Webhook URL |
| **Slack** | Slack Web API / Bolt Framework | Team workspace digests, action item dispatch | OAuth 2.0 Bot/User Token |
| **VS Code / Cursor** | Language Server Protocol (LSP) / WebSocket | Real-time code context extraction, inline practice drill sync | Local RPC / Security Key |
| **AI Providers** | HTTPS REST / SSE / WebSockets | Direct inference and tool invocation | API Key / Service Account |

---

## Integration Architecture & Data Flow

```
+-----------------------------------------------------------------------+
|                        External Ecosystem                             |
|  GitHub  |  Google Workspace  |  Slack/Telegram  |  VS Code/Cursor    |
+-----------------------------------------------------------------------+
                                  |
               Webhooks / REST API / Gateway WebSockets
                                  |
                                  v
+-----------------------------------------------------------------------+
|                    Eliot Integration Gateway                          |
|  - Rate Limiter & Throttler                                          |
|  - Payload Normalizer & Schema Validator                              |
|  - Signature & HMAC Verifier                                          |
+-----------------------------------------------------------------------+
                                  |
                                  v
+-----------------------------------------------------------------------+
|                       Eliot Event Bus (Core)                          |
|  Emits normalized events: `EXTERNAL_DOC_UPDATED`, `ISSUE_CREATED`     |
+-----------------------------------------------------------------------+
                                  |
                                  v
+-----------------------------------------------------------------------+
|                   Eliot CKM & Memory Engine Ingest                    |
+-----------------------------------------------------------------------+
```

---

## Connector Framework Specifications (`@eliot/connectors`)

1. **Normalized Event Contract**:
   All external triggers are converted into standardized Eliot Events before hitting the internal Event Bus:
   ```typescript
   interface NormalizedExternalEvent<T = Record<string, unknown>> {
     id: string;
     provider: 'github' | 'google_drive' | 'gmail' | 'slack' | 'telegram' | 'vscode';
     eventType: string;
     timestamp: number;
     payload: T;
     rawRef?: string;
     authContextId: string;
   }
   ```

2. **Fault Isolation & Circuit Breakers**:
   - Each connector runs inside an isolated error boundary.
   - If an external provider returns repeated 5xx errors or drops connection, the connector enters a `DEGRADED` state without crashing the main Eliot application runtime.
   - Automatic retry loops poll with exponential backoff.

3. **LocalFirst Polling Fallback**:
   - For desktop/browser deployments without public incoming webhook endpoints, connectors automatically switch to efficient conditional polling (using HTTP `ETag` and `If-Modified-Since` headers) to minimize bandwidth and API quotas.
