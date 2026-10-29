// Stable hash shard for an already-normalized key.
export function definitionShard(key: string): string {
  let hash = 0x811c9dc5;
  for (let i = 0; i < key.length; i++) { hash ^= key.charCodeAt(i); hash = Math.imul(hash, 0x01000193); }
  return ((hash >>> 0) & 0xff).toString(16).padStart(2, "0");
}
