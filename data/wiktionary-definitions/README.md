# Bundled Wiktionary definition snapshot

This sharded index is derived from the public [Vuizur/Wiktionary-Dictionaries](https://github.com/Vuizur/Wiktionary-Dictionaries/tree/be0cfb8d614470bc8b9d9006ddff8b921cd5c2e3) snapshot at commit `be0cfb8d614470bc8b9d9006ddff8b921cd5c2e3` (2023-05-19). That project extracted English Wiktionary data using Kaikki.org/Wiktextract and states that its dictionaries are dual-licensed under **CC BY-SA 3.0 and the GFDL**. Credit: **Wiktionary contributors, via Vuizur/Wiktionary-Dictionaries and Kaikki.org/Wiktextract**. Result links lead to source Wiktionary entries and their page histories for contributor attribution.

The generated manifest reports **2,533,552 nonempty source entries** across **342 source language categories** (including historical, constructed, and translingual categories), with **2,895,450 lookup keys**. Counts are not a claim of unique words or full worldwide coverage. The snapshot is old, may contain extraction errors and can differ from current Wiktionary. Empty/unparseable records were discarded. To limit bundle size, the index retains at most two additional source-listed forms for dictionaries of at most 1 MB and for Indonesian; other dictionaries index headwords only. **31,429,682** additional source forms were omitted. A match to a listed form is explicitly labeled as a form of the source headword, not a separate definition.

The original HTML is converted to inert plain text, split into parts of speech and senses, and sharded by normalized key. Every result links to the headword on Wiktionary; the data is not AI-generated.

## Rebuild

Requires `gh`, Python 3, Node, and the bundled translation-index file for language names. Source files (about 730 MB) are written under the ignored `data/dumps/` directory by default.

```sh
python3 scripts/download-definition-snapshot.py
NODE_OPTIONS=--max-old-space-size=2600 npx tsx scripts/build-definition-index.ts
```

The generated `manifest.json` records actual counts, revision and alias policy. Retain attribution, licence notices and applicable share-alike terms when reusing this derived data.

- [Source project and licence notice](https://github.com/Vuizur/Wiktionary-Dictionaries/tree/be0cfb8d614470bc8b9d9006ddff8b921cd5c2e3)
- [CC BY-SA 3.0](https://creativecommons.org/licenses/by-sa/3.0/) · [GNU Free Documentation License](https://www.gnu.org/licenses/fdl-1.3.html)
