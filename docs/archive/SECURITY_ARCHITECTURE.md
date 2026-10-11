# EAR-1 — Security, Credential & Access Control Architecture

## Security Principles

Eliot's security model follows a strict **Zero-Trust, Privacy-First, Least-Privilege** framework designed to safeguard user secrets, OAuth credentials, and personal cognitive data across both single-user LocalFirst environments and distributed multi-tenant cloud runtimes.

---

## Technical Security Specifications

### 1. Secret & Key Management

```
+------------------------------------------------------------------------+
|                      Eliot Secret Manager                              |
+------------------------------------------------------------------------+
              |                                        |
              v                                        v
   [LocalFirst Browser/Desktop]                   [Cloud Enterprise]
   - Web Crypto API (AES-256-GCM)                 - Cloud KMS / HashiCorp Vault
   - Encrypted IndexedDB / OS Keychain           - Envelope Encryption
   - Salt derived via PBKDF2                     - Automated Secret Rotation
```

- **LocalFirst Secret Vault**:
  - API keys and OAuth refresh tokens are encrypted at rest using **AES-256-GCM** via the standard Web Crypto API.
  - Master key is derived using **PBKDF2** (100,000+ iterations) from a user master passphrase or OS Keychain (macOS Keychain, Windows Credential Manager, Linux Secret Service).
  - Secrets are decrypted strictly in memory only during active API call invocation and zeroed out immediately after.

- **Cloud KMS Envelope Encryption**:
  - In cloud deployments, secrets are protected via envelope encryption using GCP KMS or AWS KMS.
  - Plaintext secrets are never logged or stored in plain database fields.

---

## 2. OAuth 2.0 PKCE & Least Privilege Scopes

- All OAuth flows enforce **Proof Key for Code Exchange (PKCE)** to protect against authorization code injection attacks.
- Scope requests are granular and strictly additive:
  - Google Drive: `https://www.googleapis.com/auth/drive.readonly` (Read-only access to selected folders).
  - Gmail: `https://www.googleapis.com/auth/gmail.readonly` (Read-only access to learning threads).
  - GitHub: Granular GitHub App permissions restricted to specified repositories.

---

## 3. Sandboxed Code Execution

When AI agents or automated workflows execute code snippets (Python, TypeScript, Shell):

- **Local Desktop**: Code is executed inside an isolated Web Worker or sandboxed Docker / WebAssembly (WASM) container with zero network access unless explicitly granted.
- **Cloud Runtime**: Code runs in isolated gVisor / Firecracker microVM containers with CPU/memory limits and strict timeout caps (default: 30 seconds).

---

## 4. Audit Logging & Compliance

- Every secret access, credential modification, and external API invocation generates an immutable audit record:
  ```typescript
  interface SecurityAuditEvent {
    auditId: string;
    action: 'SECRET_DECRYPTED' | 'OAUTH_TOKEN_REFRESHED' | 'CODE_EXECUTED' | 'PERMISSION_GRANTED';
    resourceId: string;
    actorId: string;
    ipAddress?: string;
    timestamp: number;
    success: boolean;
  }
  ```
- Audit records are stored in tamper-evident append-only logs.
