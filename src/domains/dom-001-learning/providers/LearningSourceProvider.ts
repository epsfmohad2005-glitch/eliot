/**
 * @file src/domains/dom-001-learning/providers/LearningSourceProvider.ts
 * @description Abstract Learning Source Provider architecture enforcing uniform content provider interface.
 * @license Apache-2.0
 */

import { Result } from '../../../core/errors/Result';
import { LearningSourceType } from '../contracts/ServiceInterface';

export interface LearningSourcePayload {
  readonly title: string;
  readonly description: string;
  readonly mediaUrl?: string;
  readonly bodyMarkdown?: string;
  readonly metadata?: Record<string, unknown>;
}

export interface ILearningSourceProvider {
  readonly providerType: LearningSourceType;
  readonly providerName: string;
  loadSourceContent(unitId: string): Promise<Result<LearningSourcePayload, Error>>;
}

export class DocumentationSourceProvider implements ILearningSourceProvider {
  public readonly providerType: LearningSourceType = 'Documentation';
  public readonly providerName: string = 'PLOS Canonical System Documentation Provider';

  public async loadSourceContent(unitId: string): Promise<Result<LearningSourcePayload, Error>> {
    return Result.ok({
      title: 'Monadic Error Handling & Zero-Exception Architecture in TypeScript',
      description: 'Official PLOS Architectural Spec — DOM-001 / Core Errors Module.',
      bodyMarkdown: `### 1. The Principle of Explicit Failure
Traditional exception throwing introduces invisible control flow jumps across call stacks. In reactive distributed systems, thrown exceptions bypass TypeScript's type system and create uncaught runtime crashes.

### 2. Monadic Container Result<T, E>
By wrapping return values in a discriminated union container \`Result<T, E>\`, functions explicitly declare both their success type \`T\` and error type \`E\`.

\`\`\`typescript
type Result<T, E> = 
  | { readonly ok: true; readonly value: T }
  | { readonly ok: false; readonly error: E };
\`\`\`

### 3. Subscription Routing Rules
When dispatching events through \`InMemoryEventBus\`, handlers MUST return \`Result<void, Error>\`. Any internal failure MUST be trapped and wrapped into a \`Result.fail(err)\` rather than thrown.`,
      metadata: { format: 'markdown', specVersion: '1.0' },
    });
  }
}

export class VideoSourceProvider implements ILearningSourceProvider {
  public readonly providerType: LearningSourceType = 'Video';
  public readonly providerName: string = 'Technical Video Stream Provider';

  public async loadSourceContent(unitId: string): Promise<Result<LearningSourcePayload, Error>> {
    return Result.ok({
      title: 'Video Guide: Building Safe Event Dispatchers in TypeScript',
      description: '12-minute technical walkthrough on event bus subscriptions, unsubscribing, and memory leak prevention.',
      mediaUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80',
      bodyMarkdown: `### Video Key Timestamps
- **00:00 - 02:30:** The Problem with Global Window Event Listeners
- **02:31 - 06:15:** Constructing Monadic Event Handlers
- **06:16 - 09:45:** Identity Equality in Listener Sets & Unsubscribing
- **09:46 - 12:00:** Benchmarking Memory Leaks under 100k Dispatches`,
      metadata: { durationSeconds: 720, resolution: '1080p' },
    });
  }
}

export class PDFSourceProvider implements ILearningSourceProvider {
  public readonly providerType: LearningSourceType = 'PDF';
  public readonly providerName: string = 'PDF Document Engine Provider';

  public async loadSourceContent(unitId: string): Promise<Result<LearningSourcePayload, Error>> {
    return Result.ok({
      title: 'PDF Spec: Eliot PLOS Kernel & Clean Architecture v1.0',
      description: 'Downloaded Specification Document (Pages 1-14).',
      bodyMarkdown: `**Page 4 — Bounded Context Isolation Rules:**
"No domain context shall directly modify or mutate state inside another domain context. Communication across domain boundaries MUST occur strictly via Domain Services or Canonical Event Bus publications."

**Page 8 — Evidence Hash Invariance:**
"All learning evidence artifacts MUST produce a verifiable SHA-256 digest upon submission to guarantee proof of execution prior to CKM memory updating."`,
      metadata: { pageCount: 14, isSearchable: true },
    });
  }
}

export class NotebookLMSourceProvider implements ILearningSourceProvider {
  public readonly providerType: LearningSourceType = 'NotebookLM';
  public readonly providerName: string = 'NotebookLM AI Synthesis Engine';

  public async loadSourceContent(unitId: string): Promise<Result<LearningSourcePayload, Error>> {
    return Result.ok({
      title: 'NotebookLM AI Synthesis: Monads vs Standard Try-Catch',
      description: 'Automated AI audio transcript & topic summary generated from system architecture notes.',
      bodyMarkdown: `**Key Insights from NotebookLM:**
- **Zero Runtime Panics:** Monadic result handling eliminates try-catch boilerplate in 94% of async domain methods.
- **Type Safety at Boundaries:** Callers are forced to check \`result.ok\` before accessing \`result.value\`.
- **Memory Footprint:** Wrapping values in frozen result objects adds <0.002ms overhead per dispatch.`,
      metadata: { sourceCount: 5, modelVersion: 'Gemini-NotebookLM-v2' },
    });
  }
}

export class GeminiGemSourceProvider implements ILearningSourceProvider {
  public readonly providerType: LearningSourceType = 'Gemini Gem';
  public readonly providerName: string = 'Gemini Socratic Architecture Gem';

  public async loadSourceContent(unitId: string): Promise<Result<LearningSourcePayload, Error>> {
    return Result.ok({
      title: 'Gemini Socratic Gem — Interactive Architecture Mentor',
      description: 'Custom AI Assistant trained on PLOS Architecture Guidelines.',
      bodyMarkdown: `**Socratic Prompt Question:**
"When designing an in-memory event bus, why is returning an explicit \`Unsubscribable\` object safer than exposing a \`removeListener(event, fn)\` method?"

*Hint: Consider arrow function identity equality and anonymous closure references in JavaScript runtimes.*`,
      metadata: { mode: 'Socratic', model: 'gemini-3.6-flash' },
    });
  }
}

export class ArticleSourceProvider implements ILearningSourceProvider {
  public readonly providerType: LearningSourceType = 'Article';
  public readonly providerName: string = 'Peer-Reviewed Technical Article Provider';

  public async loadSourceContent(unitId: string): Promise<Result<LearningSourcePayload, Error>> {
    return Result.ok({
      title: 'Article: Modern TypeScript Design Patterns for Systems Engineering',
      description: 'Published in Software Architecture Digest 2026.',
      bodyMarkdown: `In high-reliability web operating systems, the separation of core engines from presentation frames ensures that UI re-renders never interrupt background kernel calculations or state machines.`,
      metadata: { publisher: 'Software Architecture Digest', year: 2026 },
    });
  }
}

export class FutureSourceProvider implements ILearningSourceProvider {
  public readonly providerType: LearningSourceType = 'FutureSource';
  public readonly providerName: string = 'Extensible Dynamic Plugin Provider';

  public async loadSourceContent(unitId: string): Promise<Result<LearningSourcePayload, Error>> {
    return Result.ok({
      title: 'Extensible Future Source Provider Slot',
      description: 'Custom external API integration or interactive sandbox plugin slot.',
      bodyMarkdown: `Future source plugin interface ready to accept dynamic third-party WebSockets, interactive IDE frames, or peer review streams seamlessly.`,
      metadata: { pluginId: 'ext_future_v1' },
    });
  }
}

export class LearningSourceProviderRegistry {
  private providers: Map<LearningSourceType, ILearningSourceProvider> = new Map();

  constructor() {
    this.registerProvider(new DocumentationSourceProvider());
    this.registerProvider(new VideoSourceProvider());
    this.registerProvider(new PDFSourceProvider());
    this.registerProvider(new NotebookLMSourceProvider());
    this.registerProvider(new GeminiGemSourceProvider());
    this.registerProvider(new ArticleSourceProvider());
    this.registerProvider(new FutureSourceProvider());
  }

  public registerProvider(provider: ILearningSourceProvider): void {
    this.providers.set(provider.providerType, provider);
  }

  public getProvider(type: LearningSourceType): ILearningSourceProvider {
    return this.providers.get(type) || this.providers.get('Documentation')!;
  }
}

export const sourceProviderRegistry = new LearningSourceProviderRegistry();
