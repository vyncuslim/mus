import React from "react";
import { getDatasetCoverageSummary } from "@/data/starter-lexicon";
import {
  getAllIndexedEntries,
  getFeaturedEntries,
} from "@/lib/dictionary-service";
import { HomeClient } from "@/components/HomeClient";

export default async function HomePage() {
  const [featuredEntries, allEntries] = await Promise.all([
    getFeaturedEntries(8),
    getAllIndexedEntries(),
  ]);
  const coverage = getDatasetCoverageSummary(allEntries);

  return (
    <HomeClient featuredEntries={featuredEntries} coverage={coverage} />
  );
}
