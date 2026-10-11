# Eliot Scalability Guide (Sprint PF-4)

## Scalability Thresholds & Standards

| Component / Subsystem | Standard Scale Target | Stress Test Target | Scalability Mechanism |
| :--- | :--- | :--- | :--- |
| **Concept Graph Nodes** | 1,000 Nodes | **10,000+ Nodes** | Viewport Frustum Culling & Dynamic LOD (`GraphScalabilityEngine`) |
| **Knowledge Relations** | 10,000 Edges | **100,000+ Edges** | Indexed spatial lookup & virtualized graph rendering |
| **PDF Documents** | 10 PDFs | **100 PDFs** | Offloaded Web Worker text extraction & async SHA-256 hashing |
| **Markdown Source Files** | 100 Files | **1,000 Files** | Batched IndexedDB writes & non-blocking semantic chunking |
| **Storage Querying** | 500 Records | **100,000+ Records** | Cursor-based IndexedDB pagination & L1 LRU memory cache |

---

## Best Practices for Scaling

### 1. Database Operations
* **Always use paged queries** (`IndexedDBAdapter.queryPaged()`) when displaying lists or tables containing more than 100 items.
* **Batch bulk updates** (`IndexedDBAdapter.setMany()`) rather than executing sequential single writes inside loops.

### 2. Heavy Computations
* Use `importWorkerPool` for SHA-256 hash generation, semantic chunking, or deduplication checks.
* In loops processing more than 500 items, insert `await backgroundScheduler.yieldToMain()` every 100-500 iterations to yield UI control back to browser frame rendering.

### 3. Component Memoization
* Wrap list item components and SVG graph nodes with `React.memo()`.
* Memoize expensive computed filters and sorted collections using `useMemo()`.
