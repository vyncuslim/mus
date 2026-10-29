// @vitest-environment jsdom
import React from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";

vi.mock("@/lib/reviewed-definitions", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/lib/reviewed-definitions")>();
  return { ...actual, findReviewedTranslation: vi.fn() };
});
import { findReviewedTranslation, validateReviewCatalog } from "@/lib/reviewed-definitions";
import { TranslatedDefinition, type DefinitionTranslationController } from "@/components/DefinitionTranslation";

const fixture = {
  subject: { origin: "wiktionary-snapshot", sourceUrl: "https://example.org/source", sourceVersion: "test", headword: "cat", language: "en", partOfSpeech: "noun", definition: "A small feline.", senseId: "" },
  target: "zh-CN", translation: "测试译文",
  source: { name: "Test source", url: "https://example.org/translation", license: "Test licence", licenseUrl: "https://example.org/license", attribution: "Test attribution" },
  review: { reviewer: "Test reviewer", reviewedAt: "2026-10-01", evidenceUrl: "https://example.org/review" },
};
const reviewed = validateReviewCatalog([fixture], "2026-10-28").records[0];
const base = { target: "zh-CN", mode: "reviewed", get: () => ({ status: "ready", text: "UNREVIEWED" }) } as unknown as DefinitionTranslationController;
afterEach(() => { cleanup(); vi.resetAllMocks(); });

describe("review provenance in definition results", () => {
  it("renders a synthetic review with source, licence, reviewer and evidence", () => {
    vi.mocked(findReviewedTranslation).mockReturnValue(reviewed);
    render(React.createElement(TranslatedDefinition, { controller: base, locale: "zh-Hans", subject: reviewed.subject }));
    expect(screen.getByTestId("reviewed-definition").textContent).toContain("Test reviewer");
    expect(screen.getByTestId("reviewed-definition").textContent).toContain("测试译文");
    expect(screen.getByRole("link", { name: "审核记录" }).getAttribute("href")).toBe("https://example.org/review");
    expect(screen.getByRole("link", { name: /译文来源/ }).getAttribute("href")).toBe("https://example.org/translation");
    expect(screen.getByRole("link", { name: /许可与署名/ }).getAttribute("href")).toBe("https://example.org/license");
    expect(screen.queryByText("UNREVIEWED")).toBeNull();
  });
  it("never displays cached automatic output in reviewed mode", () => {
    vi.mocked(findReviewedTranslation).mockReturnValue(undefined);
    const view = render(React.createElement(TranslatedDefinition, { controller: base, locale: "zh-Hans", subject: reviewed.subject }));
    expect(screen.queryByText("UNREVIEWED")).toBeNull();
    view.rerender(React.createElement(TranslatedDefinition, { controller: { ...base, mode: "automatic" }, locale: "zh-Hans", subject: reviewed.subject }));
    expect(screen.getByTestId("translated-definition").textContent).toContain("未经核对");
    expect(screen.getByText("UNREVIEWED")).toBeTruthy();
  });
});
