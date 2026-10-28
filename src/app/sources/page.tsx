import type { Metadata } from "next";
import { SourcesClient } from "@/components/SourcesClient";
export const metadata: Metadata = { title: "Sources & Licence", description: "Dictionary coverage, Wiktionary attribution, licensing, and privacy.", alternates: { canonical: "/sources" } };
export default function SourcesPage() { return <SourcesClient />; }
