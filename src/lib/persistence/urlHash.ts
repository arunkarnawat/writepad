import { serialize, hydrate } from '../schema/migrations';
import { streamThrough, base64UrlEncode, base64UrlDecode } from './compression';
import type { AppState } from '../schema/types';

export async function encode(state: AppState): Promise<string> {
  const wire = serialize(state);
  const json = JSON.stringify(wire);
  const bytes = new TextEncoder().encode(json);

  try {
    const compressed = await streamThrough(bytes, new CompressionStream('deflate-raw'));
    return base64UrlEncode(compressed);
  } catch (e) {
    console.error('Compression failed', e);
    return '';
  }
}

export async function decode(hash: string): Promise<AppState | null> {
  if (!hash || hash === '#') return null;

  const cleanHash = hash.startsWith('#') ? hash.slice(1) : hash;

  try {
    const compressed = base64UrlDecode(cleanHash);
    const bytes = await streamThrough(compressed, new DecompressionStream('deflate-raw'));
    const json = new TextDecoder().decode(bytes);
    return hydrate(JSON.parse(json));
  } catch (e) {
    console.error('Decompression failed', e);
    return null;
  }
}
