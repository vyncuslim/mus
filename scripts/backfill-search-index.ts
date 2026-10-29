import { asc, gt, inArray } from "drizzle-orm";
import { getDb, closeDatabase } from "../src/db";
import { lexiconEntriesTable, lexiconSearchKeysTable } from "../src/db/schema";
import { entrySearchKeys, readingKeys } from "../src/lib/entry-search-keys";

/** Run once after db:push on existing data. Keyset pagination avoids a giant preload. */
async function main() {
  const db = getDb();
  if (!db) throw new Error("Configure DATABASE_URL and apply the schema before backfilling.");
  let cursor = "", total = 0;
  while (true) {
    const rows = await db.select({ id: lexiconEntriesTable.id, romanization: lexiconEntriesTable.romanization, wordForms: lexiconEntriesTable.wordForms, senses: lexiconEntriesTable.senses }).from(lexiconEntriesTable).where(gt(lexiconEntriesTable.id, cursor)).orderBy(asc(lexiconEntriesTable.id)).limit(250);
    if (!rows.length) break;
    await db.transaction(async (tx) => {
      for (const row of rows) await tx.update(lexiconEntriesTable).set(readingKeys(row.romanization)).where(inArray(lexiconEntriesTable.id, [row.id]));
      await tx.delete(lexiconSearchKeysTable).where(inArray(lexiconSearchKeysTable.entryId, rows.map((row) => row.id)));
      const keys = rows.flatMap((row) => entrySearchKeys({ id: row.id, wordForms: row.wordForms ?? undefined, senses: row.senses }));
      for (let i = 0; i < keys.length; i += 1000) await tx.insert(lexiconSearchKeysTable).values(keys.slice(i, i + 1000)).onConflictDoNothing();
    });
    total += rows.length; cursor = rows[rows.length - 1].id;
    console.log(`Indexed ${total} entries (last id: ${cursor})`);
  }
  console.log(`Backfill complete: ${total} entries.`);
}
main().catch((error) => { console.error(error); process.exitCode = 1; }).finally(() => closeDatabase());
