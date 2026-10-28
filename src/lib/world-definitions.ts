export interface DictionarySense { definition: string; examples: string[] }
export interface DictionaryDefinitionGroup {
  languageCode: string;
  languageName: string;
  partOfSpeech: string;
  headword?: string;
  matchedForm?: string;
  senses: DictionarySense[];
}
const ENTITIES: Record<string, string> = { amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: " ", ndash: "–", mdash: "—", lsquo: "‘", rsquo: "’", ldquo: "“", rdquo: "”" };
/** Convert source markup into inert text. React renders the result as text. */
export function cleanDictionaryText(value: string, snapshotSpacing = false): string {
  const withoutScripts = value.replace(/<(style|script)\b[^>]*>[\s\S]*?<\/\1\s*>/gi, " ");
  // Keep the snapshot builder byte-for-byte reproducible; live inline markup
  // can be removed without inserting awkward spaces before punctuation.
  const withoutTags = snapshotSpacing ? withoutScripts.replace(/<[^>]*>/g, " ") : withoutScripts.replace(/<\/?(?:br|p|div|li|ul|ol)\b[^>]*>/gi, " ").replace(/<[^>]*>/g, "");
  return withoutTags
    .replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (entity, name: string) => {
      if (name[0] === "#") {
        const n = name[1].toLowerCase() === "x" ? Number.parseInt(name.slice(2), 16) : Number.parseInt(name.slice(1), 10);
        return Number.isFinite(n) && n >= 0 && n <= 0x10ffff && !(n >= 0xd800 && n <= 0xdfff) ? String.fromCodePoint(n) : "";
      }
      return ENTITIES[name.toLowerCase()] ?? entity;
    }).replace(/\s+/g, " ").trim();
}
function text(value: unknown): string { return typeof value === "string" ? cleanDictionaryText(value) : ""; }
export function parseWiktionaryDefinitions(payload: unknown): DictionaryDefinitionGroup[] {
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) return [];
  const groups: DictionaryDefinitionGroup[] = [];
  for (const [code, blocks] of Object.entries(payload)) {
    if (!Array.isArray(blocks)) continue;
    for (const item of blocks) {
      if (!item || typeof item !== "object" || !Array.isArray(item.definitions)) continue;
      const senses: DictionarySense[] = [];
      for (const raw of item.definitions.slice(0, 100)) {
        if (!raw || typeof raw !== "object") continue;
        const definition = text(raw.definition);
        if (!definition) continue;
        const examples: string[] = [];
        if (Array.isArray(raw.parsedExamples)) {
          for (const example of raw.parsedExamples) {
            if (!example || typeof example !== "object") continue;
            const original = text(example.example), translation = text(example.translation);
            if (original) examples.push(translation ? `${original} — ${translation}` : original);
            if (examples.length >= 3) break;
          }
        } else if (Array.isArray(raw.examples)) {
          for (const example of raw.examples) { const value = text(example); if (value) examples.push(value); if (examples.length >= 3) break; }
        }
        senses.push({ definition, examples });
      }
      if (senses.length) groups.push({ languageCode: code, languageName: text(item.language) || code, partOfSpeech: text(item.partOfSpeech), senses });
    }
  }
  return groups;
}
export function parseEnglishMirrorRecord(payload: unknown): DictionaryDefinitionGroup[] {
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) return [];
  const record = payload as { etymologies?: unknown };
  if (!Array.isArray(record.etymologies)) return [];
  const groups: DictionaryDefinitionGroup[] = [];
  for (const etymology of record.etymologies) {
    if (!etymology || typeof etymology !== "object" || !Array.isArray(etymology.partsOfSpeech)) continue;
    for (const part of etymology.partsOfSpeech) {
      if (!part || typeof part !== "object" || !Array.isArray(part.senses)) continue;
      const senses: DictionarySense[] = [];
      for (const raw of part.senses.slice(0, 100)) {
        if (!raw || typeof raw !== "object") continue;
        const definition = text(raw.sense); if (!definition) continue;
        const examples = Array.isArray(raw.examples) ? raw.examples.map(text).filter(Boolean).slice(0, 3) : [];
        senses.push({ definition, examples });
      }
      if (senses.length) groups.push({ languageCode: "en", languageName: "English", partOfSpeech: text(part.partOfSpeech), senses });
    }
  }
  return groups;
}
