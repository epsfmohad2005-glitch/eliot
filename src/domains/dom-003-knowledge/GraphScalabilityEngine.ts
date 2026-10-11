/**
 * @file src/domains/dom-003-knowledge/GraphScalabilityEngine.ts
 * @description Virtualized, Viewport-Bounded CKM Graph Engine supporting 10,000+ Concept Nodes without main thread lock (Sprint PF-4).
 * @license Apache-2.0
 */

import { ConceptNode } from './contracts/ServiceInterface';

export interface ViewportBounds {
  xMin: number;
  xMax: number;
  yMin: number;
  yMax: number;
  zoomLevel: number;
}

export interface CachedNodePosition {
  x: number;
  y: number;
  lodLevel: 'high' | 'medium' | 'low';
}

export class GraphScalabilityEngine {
  private layoutCache: Map<string, CachedNodePosition> = new Map();

  /**
   * Virtualizes node dataset based on active viewport bounding box & level of detail (LOD)
   */
  public getVisibleNodes(
    allNodes: readonly ConceptNode[],
    viewport: ViewportBounds,
    limit = 200
  ): { visibleNodes: ConceptNode[]; totalNodes: number; lod: 'high' | 'medium' | 'low' } {
    const totalNodes = allNodes.length;

    // Determine Level of Detail based on zoom
    const lod: 'high' | 'medium' | 'low' =
      viewport.zoomLevel > 1.2 ? 'high' : viewport.zoomLevel > 0.6 ? 'medium' : 'low';

    // Fast-path for small datasets
    if (totalNodes <= limit) {
      return { visibleNodes: [...allNodes], totalNodes, lod };
    }

    // Viewport frustum culling
    const visibleNodes: ConceptNode[] = [];
    for (let i = 0; i < totalNodes; i++) {
      const node = allNodes[i];
      let pos = this.layoutCache.get(node.id);

      if (!pos) {
        // Deterministic grid layout coordinate mapping
        const col = i % 100;
        const row = Math.floor(i / 100);
        pos = {
          x: col * 120,
          y: row * 100,
          lodLevel: lod,
        };
        this.layoutCache.set(node.id, pos);
      }

      if (
        pos.x >= viewport.xMin &&
        pos.x <= viewport.xMax &&
        pos.y >= viewport.yMin &&
        pos.y <= viewport.yMax
      ) {
        visibleNodes.push(node);
        if (visibleNodes.length >= limit) break;
      }
    }

    // Fallback if viewport missed
    if (visibleNodes.length === 0) {
      return { visibleNodes: allNodes.slice(0, limit), totalNodes, lod };
    }

    return { visibleNodes, totalNodes, lod };
  }

  public clearCache(): void {
    this.layoutCache.clear();
  }
}

export const graphScalabilityEngine = new GraphScalabilityEngine();
