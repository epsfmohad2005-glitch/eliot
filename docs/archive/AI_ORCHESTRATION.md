# EAR-1 — AI Orchestration & Multi-Model Architecture

## Multi-Model Support Matrix

Eliot's AI Orchestration layer provides a unified abstraction across all major commercial and open-source models:

| Provider / Model | Primary Use Case in Eliot | Context Window Strategy | Streaming Support | Function Calling / Tools |
| :--- | :--- | :--- | :--- | :--- |
| **Google Gemini (Flash 2.5 / Pro 1.5)** | Fast reasoning, multimodal analysis, long-context retrieval | Up to 2M tokens (Full CKM Context) | Server-Sent Events (SSE) / Live API WebSocket | Native Structured JSON Schema |
| **Anthropic Claude (3.5 Sonnet / Haiku)** | Complex code generation, subtle synthesis, cognitive reflection | 200k sliding window with prompt caching | SSE / Text Streaming | Native Tool Use API |
| **OpenAI (GPT-4o / o3-mini)** | General knowledge reasoning, structured output generation | 128k context with function calls | SSE / Text Streaming | Strict Schema JSON Mode |
| **NotebookLM / Google AI Studio** | Grounded source synthesis, audio overview generation | Source document grounding index | Audio / Text Stream | Custom API Bridge |
| **GitHub Copilot / Cursor Agents** | Inline code generation & IDE workspace context | File slice / diff injection | SSE / IDE RPC | Agentic File Edits |
| **Local Models (Ollama / vLLM)** | Privacy-first offline execution, local embedding generation | 8k–32k token window | Local SSE Stream | Function Calling (Qwen/Llama) |

---

## Architecture of the Eliot AI Router (`@eliot/ai-router`)

```
                        +----------------------------+
                        |  Eliot Agent Request Bus   |
                        +----------------------------+
                                      |
                                      v
                        +----------------------------+
                        |   Context & CKM Assembler  |
                        +----------------------------+
                                      |
                                      v
                        +----------------------------+
                        |   Dynamic Model Router     |
                        +----------------------------+
                           /          |          \
                          /           |           \
                         v            v            v
                +----------------+ +------------+ +-----------------+
                | Gemini Gateway | | Claude Engine| | Local Ollama    |
                +----------------+ +------------+ +-----------------+
```

### Key Functional Responsibilities

1. **Adaptive Token Window Management**:
   - Automatically calculates token budget using provider-specific tokenizers.
   - Slices and summarizes CKM graph nodes when approaching context thresholds.
   - Uses Anthropic/OpenAI prompt caching headers to minimize latency and token cost by up to 80%.

2. **Resilient Provider Fallback & Rate Limit Circuit Breakers**:
   - Tracks rate limits (RPM/TPM) and HTTP 429 backoff timers across API keys.
   - Automatically routes traffic to a fallback provider (e.g., Gemini Pro -> Claude 3.5 Sonnet -> Local Ollama) if primary provider experiences downtime or throttling.

3. **Multi-Agent State Graph (LangGraph Integration)**:
   - Coordinates specialized agents:
     - **Researcher Agent**: Ingests sources into CKM.
     - **Synthesizer Agent**: Generates structured summaries & cognitive maps.
     - **Coder Agent**: Executes code modifications & runs tests.
     - **Critic Agent**: Reviews code and content for safety and correctness.
   - Provides explicit Human-in-the-Loop (HITL) approval nodes before executing destructive operations (file writes, API posts).

4. **Integration with Frozen Eliot Systems**:
   - **CKM (Cognitive Knowledge Model)**: Agent outputs are serialized directly into CKM concept graphs.
   - **Memory Engine**: Vector embeddings and conversation history are indexed in working memory.
   - **Focus Environment**: Active agent thinking streams and tool execution logs are displayed cleanly inside the Focus Bar and Workspace Surface without screen flickering.
