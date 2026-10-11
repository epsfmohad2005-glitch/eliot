/**
 * @file src/core/import/pipeline/CryptoUtils.ts
 * @description LocalFirst SHA-256 Cryptographic Fingerprinting for RDI-1 Import Engine.
 * @license Apache-2.0
 */

export class CryptoUtils {
  /**
   * Generates a SHA-256 digest hex string for an ArrayBuffer or Uint8Array.
   */
  public static async calculateBufferHash(buffer: ArrayBuffer | Uint8Array): Promise<string> {
    const input = buffer instanceof Uint8Array ? buffer.buffer : buffer;
    const hashBuffer = await crypto.subtle.digest('SHA-256', input);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
  }

  /**
   * Generates a SHA-256 digest hex string for a browser File object.
   */
  public static async calculateFileHash(file: File): Promise<string> {
    const arrayBuffer = await file.arrayBuffer();
    return this.calculateBufferHash(arrayBuffer);
  }

  /**
   * Generates a SHA-256 digest hex string for a list of File objects.
   */
  public static async calculateFileListHash(files: File[]): Promise<string> {
    const sortedFiles = [...files].sort((a, b) => a.name.localeCompare(b.name));
    const combinedBuffers: Uint8Array[] = [];

    for (const file of sortedFiles) {
      const buf = new Uint8Array(await file.arrayBuffer());
      combinedBuffers.push(buf);
    }

    let totalLength = 0;
    for (const buf of combinedBuffers) {
      totalLength += buf.length;
    }

    const merged = new Uint8Array(totalLength);
    let offset = 0;
    for (const buf of combinedBuffers) {
      merged.set(buf, offset);
      offset += buf.length;
    }

    return this.calculateBufferHash(merged);
  }

  /**
   * Generates a SHA-256 digest hex string for plain text content.
   */
  public static async calculateTextHash(text: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(text);
    return this.calculateBufferHash(data);
  }

  public static async sha256(text: string): Promise<string> {
    return this.calculateTextHash(text);
  }
}
