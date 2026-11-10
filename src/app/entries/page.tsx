import type { Metadata } from "next";
import { EntryIndexClient } from "@/components/EntryIndexClient";
import { getIndexableEntries } from "@/lib/dictionary-service";
import { BRAND_NAME } from "@/lib/brand";
import { excerpt, socialMetadata } from "@/lib/seo";

// The optional database can change or become unavailable after deployment.
export const dynamic = "force-dynamic";

const title = "词条索引 · Dictionary entries";
const description = "浏览部分马来语、英语、中文及其他语言的词典词条。 Browse a selection of dictionary entries with definitions and source details.";
export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/entries" },
  ...socialMetadata(`${title} | ${BRAND_NAME}`, description, "/entries"),
};

export default async function EntryIndexPage() {
  const { entries } = await getIndexableEntries();
  // Keep the client payload bounded even if an imported definition is long.
  return <EntryIndexClient entries={entries.map((entry) => ({ ...entry, definition: excerpt(entry.definition, 140) }))} />;
}
