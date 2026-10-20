import React from "react";
import type { Metadata } from "next";
import { FavoritesClient } from "@/components/FavoritesClient";

export const metadata: Metadata = {
  title: "Saved Favorites — Personal Vocabulary List",
  description:
    "Manage your saved vocabulary words, personal study notes, and offline-ready lexical bookmarks.",
  alternates: {
    canonical: "/favorites",
  },
};

export default function FavoritesPage() {
  return <FavoritesClient />;
}
