import React from "react";
import type { Metadata } from "next";
import { LearnClient } from "@/components/LearnClient";

export const metadata: Metadata = {
  title: "Language Learning Studio — Flashcards, Quizzes & Malay Morphology",
  description:
    "Interactive multilingual flashcards, vocabulary quizzes, and Bahasa Melayu Kata Dasar & Imbuhan collections.",
  alternates: {
    canonical: "/learn",
  },
};

export default function LearnPage() {
  return <LearnClient />;
}
