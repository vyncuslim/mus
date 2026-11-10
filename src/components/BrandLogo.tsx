import Image from "next/image";
import Link from "next/link";
import { BRAND_ASSETS, BRAND_NAME } from "@/lib/brand";

type Placement = "header" | "footer";

/** One shared mark and wordmark for every page and colour theme. */
export function BrandLogo({ placement = "header" }: { placement?: Placement }) {
  const compact = placement === "footer";
  return (
    <Link
      href="/"
      aria-label={BRAND_NAME}
      data-testid={`${placement}-brand`}
      className={`flex w-fit items-center ${compact ? "gap-2" : "gap-3"} rounded-md focus:outline-none focus:ring-2 focus:ring-lexicon-600`}
    >
      <Image
        src={BRAND_ASSETS.mark}
        width={compact ? 28 : 40}
        height={compact ? 28 : 40}
        alt=""
        aria-hidden="true"
        data-testid={compact ? "footer-brand-logo" : "brand-logo"}
        className={`${compact ? "h-7 w-7" : "h-10 w-10"} shrink-0`}
      />
      <span className="flex flex-col leading-none">
        <span className={`font-serif font-semibold tracking-[-0.035em] text-[#1a302b] dark:text-white ${compact ? "text-[15px]" : "text-[20px]"}`}>Vynalth</span>
        <span className={`font-semibold uppercase tracking-[0.22em] text-[#71827b] dark:text-ink-400 ${compact ? "mt-0.5 text-[7px]" : "mt-1 text-[9px]"}`}>Dictionary</span>
      </span>
    </Link>
  );
}
