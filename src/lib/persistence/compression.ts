// lib/persistence/compression.ts

export async function streamThrough(data: Uint8Array, transformer: TransformStream): Promise<Uint8Array> {
  const response = new Response(data);
  const stream = response.body?.pipeThrough(transformer);
  const result = await new Response(stream).arrayBuffer();
  return new Uint8Array(result);
}

export function base64UrlEncode(bytes: Uint8Array): string {
  const binString = Array.from(bytes, (byte) => String.fromCharCode(byte)).join('');
  return btoa(binString)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

export function base64UrlDecode(base64url: string): Uint8Array {
  const base64 = base64url.replace(/-/g, '+').replace(/_/g, '/');
  const binString = atob(base64);
  return Uint8Array.from(binString, (m) => m.charCodeAt(0));
}
