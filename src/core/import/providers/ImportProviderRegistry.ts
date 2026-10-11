/**
 * @file src/core/import/providers/ImportProviderRegistry.ts
 * @description Master Provider Registry for RDI-1 Import Providers.
 * @license Apache-2.0
 */

import { ImportProvider, ImportProviderId, ImportInputSource } from '../types';

export class ImportProviderRegistry {
  private static providers = new Map<ImportProviderId, ImportProvider>();

  public static registerProvider(provider: ImportProvider): void {
    this.providers.set(provider.id, provider);
  }

  public static getProvider(id: ImportProviderId): ImportProvider | undefined {
    return this.providers.get(id);
  }

  public static getAllProviders(): ImportProvider[] {
    return Array.from(this.providers.values());
  }

  public static resolveProviderForInput(input: ImportInputSource): ImportProvider {
    const provider = this.providers.get(input.providerId);
    if (!provider) {
      throw new Error(`No provider registered for provider ID: ${input.providerId}`);
    }
    return provider;
  }
}
