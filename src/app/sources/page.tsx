import type { Metadata } from "next";
import { SourcesClient } from "@/components/SourcesClient";
import { BRAND_NAME } from "@/lib/brand";
import { socialMetadata } from "@/lib/seo";

const title = "数据来源与许可 · Sources & Licence";
const description = "了解词典的维基词典数据来源、收录范围、许可和隐私。 Read about coverage, attribution, licensing and privacy.";
export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/sources" },
  ...socialMetadata(`${title} | ${BRAND_NAME}`, description, "/sources"),
};
export default function SourcesPage() { return <SourcesClient />; }
