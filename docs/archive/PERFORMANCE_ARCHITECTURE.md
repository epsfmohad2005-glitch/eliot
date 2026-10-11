# Eliot Performance & Scalability Architecture (Sprint PF-4)

## Architecture Overview
Sprint PF-4 establishes a resilient, high-throughput, non-blocking performance foundation for Eliot Personal Knowledge Operating System (PLOS) capable of handling **10,000+ Concept Nodes**, **100,000+ Knowledge Relations**, **100 PDFs**, and **1,000 Markdown documents** without main thread lag or frame drops.

---

## Key Performance Subsystems

### 1. Bundle Splitting & Lazy Route Loading
* **Dynamic Chunking**: Workspace components (Boot, Mission Control, Learning Session, Practice, Reflection, Evidence, Import, Inspection, Knowledge Review, Commit Preview, Diagnostics, Knowledge Map, Memory Timeline) are isolated into individual code chunks.
* **Preloading Engine**: Next likely workspace chunks are asynchronously warmed using background preloading primitives without blocking current UI frames.

### 2. Import Pipeline & Web Worker Offloading (`ImportWorkerPool`)
* **Asynchronous Hashing**: Offloads CPU-intensive SHA-256 computation to Web Crypto / non-blocking sliced loops.
* **Semantic Chunking & Normalization**: Moves document parsing, chunking, and deduplication logic off the main thread.
* **Frame Yielding**: Utilizes `BackgroundScheduler.yieldToMain()` during bulk entity iteration to guarantee 60 FPS UI responsiveness.

### 3. High-Scale IndexedDB Repository Engine (`IndexedDBAdapter`)
* **L1 LRU Cache Integration**: In-memory LRU/LFU cache layer reduces IndexedDB I/O overhead for hot entities.
* **Batched Transaction Writes**: Groups bulk entity commits into optimized batch operations.
* **Cursor-based Pagination**: Prevents loading full multi-thousand entity collections into JavaScript heap memory at once.

### 4. CKM Graph Scalability & Viewport Virtualization (`GraphScalabilityEngine`)
* **Viewport Frustum Culling**: Renders only concept nodes situated within the active canvas bounding box ($X_{min}, X_{max}, Y_{min}, Y_{max}$).
* **Dynamic Level-of-Detail (LOD)**: Adjusts node rendering complexity dynamically based on zoom ratio ($>1.2x$, $0.6x - 1.2x$, $<0.6x$).
* **Deterministic Layout Caching**: Caches spatial coordinates to eliminate repetitive recalculations.

### 5. Memory Management & Automatic Cache Eviction (`CacheEvictionManager`)
* **LRU / LFU Eviction Policy**: Automatically purges stale items when cache limits (item count or total byte size) are reached.
* **Heap Memory Protection**: Maintains JavaScript heap consumption well below 70 MB under maximum load.

---

## Performance Telemetry Dashboard
* Integrated into `DiagnosticsWorkspaceView` under the **Performance & Scalability Telemetry** tab.
* Real-time metrics tracking: Startup duration, import throughput, graph render FPS, heap usage, IndexedDB statistics, and worker pool utilization.
