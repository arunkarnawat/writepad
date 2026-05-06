export function countWords(text: string): number {
  const t = text.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  return t === '' ? 0 : t.split(' ').length;
}

export function countChars(text: string): number {
  return text.replace(/<[^>]+>/g, '').length;
}
