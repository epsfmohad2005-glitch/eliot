# IMPORT PROVIDER INTERFACE SPECIFICATION (RDI-1)
## Pluggable Provider System & TypeScript Interface Contracts

**System Version:** 1.0.0-RDI  
**Author:** Lead Cognitive Systems Architect  
**Status:** Architecture Proposal — Awaiting Approval  

---

## 1. Provider Core Interface (`ImportProvider`)

Every import source provider MUST implement the `ImportProvider` contract. Providers operate as pure extraction engines and are strictly forbidden from directly calling CKM or CDE write methods.

```typescript
export interface ImportProvider {
  /** Unique provider identifier (e.g., 'youtube-playlist', 'pdf-document') */
  readonly id: string;

  /** Human-readable display label and icon key */
  readonly name: string;

  /** Capability matrix declaration */
  readonly capabilities: ProviderCapabilities;

  /** Stage 1: Validate input source format and reachability */
  validateSource(input: ImportInputSource): Promise<ValidationResult>;

  /** Stage 1: Extract top-level metadata without full content download */
  extractMetadata(input: ImportInputSource): Promise<SourceMetadata>;

  /** Stage 2: Enumerate all readable items (episodes, files, pages, sections) */
  enumerateContent(input: ImportInputSource): Promise<ContentItem[]>;

  /** Stage 2: Fetch and parse raw asset contents for a given item */
  extractAsset(item: ContentItem, progressCb: ProgressCallback): Promise<ExtractedAsset>;
}

export interface ProviderCapabilities {
  supportsBatchImport: boolean;
  supportsCodeExtraction: boolean;
  supportsVideoCaptions: boolean;
  supportsHierarchicalStructure: boolean;
  requiresAuthentication: boolean;
  offlineCapable: boolean;
}

export interface ImportInputSource {
  type: string;
  url?: string;
  fileBlob?: Blob;
  folderHandle?: FileSystemDirectoryHandle;
  customPayload?: Record<string, unknown>;
}

export interface ValidationResult {
  isValid: boolean;
  errorCode?: string;
  errorMessage?: string;
  suggestedFix?: string;
}

export interface SourceMetadata {
  title: string;
  description: string;
  authorOrChannel?: string;
  sourceUrl?: string;
  estimatedContentLengthMinutes?: number;
  totalItemsCount: number;
  sha256Fingerprint: string;
  customProperties?: Record<string, unknown>;
}

export interface ContentItem {
  itemId: string;
  parentItemId?: string;
  title: string;
  ordinalPosition: number;
  contentType: 'text' | 'code' | 'video' | 'audio' | 'pdf_page' | 'markdown' | 'notebook';
  sourceUri: string;
  estimatedReadingMinutes?: number;
}

export interface ExtractedAsset {
  itemId: string;
  mimeType: string;
  rawText?: string;
  codeSnippet?: {
    language: string;
    content: string;
    filePath?: string;
  };
  mediaCaptions?: Array<{
    startSeconds: number;
    endSeconds: number;
    text: string;
  }>;
  attachments?: Array<{
    fileName: string;
    mimeType: string;
    data: Uint8Array;
  }>;
}

export interface ProgressReport {
  stage: string;
  completedUnits: number;
  totalUnits: number;
  currentOperationLabel: string;
}

export type ProgressCallback = (progress: ProgressReport) => void;
```

---

## 2. Supported v1 Import Providers

### 1. `YouTubePlaylistProvider` & `YouTubeVideoProvider`
* **Input**: Playlist URL or Video URL (`youtube.com/watch?v=...`, `youtube.com/playlist?list=...`).
* **Extraction**: Captions/transcripts via innerTube or OAuth API, video titles, timestamps, descriptions, and chapters.

### 2. `PdfDocumentProvider` & `EpubBookProvider`
* **Input**: File Upload Blob (`.pdf`, `.epub`).
* **Extraction**: Text layers, table of contents, heading structures, code block blocks via local WebAssembly PDF parsing engine.

### 3. `MarkdownFolderProvider` & `LocalFolderProvider`
* **Input**: Native File System Access API (`FileSystemDirectoryHandle`).
* **Extraction**: Markdown files, relative image references, YAML frontmatter tags, folder taxonomy hierarchy.

### 4. `ZipProjectProvider` & `GitHubRepositoryProvider`
* **Input**: `.zip` file or Git clone URL (`github.com/owner/repo`).
* **Extraction**: AST code parsing (TypeScript, Python, Rust, Go), README markdown files, package configs (`package.json`, `Cargo.toml`), repository directory structure.

### 5. `OfficialDocumentationCrawlerProvider`
* **Input**: Root Documentation URL (e.g., `react.dev`, `docs.python.org`).
* **Extraction**: DOM article parsing, code sample blocks, sidebar navigation trees, API references.

### 6. `NotebookLMExportProvider` & `GeminiGemExportProvider`
* **Input**: Export JSON or Markdown files from Google NotebookLM / Gemini Gems.
* **Extraction**: Curated briefing docs, audio overview transcripts, key takeaway bullet lists, study guide Q&A pairs.

### 7. `GenericUrlProvider`
* **Input**: Any standard HTTPS URL.
* **Extraction**: Readability text extraction, main article parsing, metadata open-graph tags.

---

## 3. Pluggable Provider Registry (`ImportProviderRegistry`)

```typescript
export class ImportProviderRegistry {
  private static providers = new Map<string, ImportProvider>();

  public static registerProvider(provider: ImportProvider): void {
    this.providers.set(provider.id, provider);
  }

  public static resolveProvider(input: ImportInputSource): ImportProvider {
    for (const provider of this.providers.values()) {
      if (/* provider matches input pattern */ true) {
        return provider;
      }
    }
    throw new Error(`No matching import provider found for source type: ${input.type}`);
  }
}
```
