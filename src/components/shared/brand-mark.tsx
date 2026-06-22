"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { useSiteContent } from "@/hooks/use-site-content";

interface BrandMarkProps {
  href?: string;
  size?: "sm" | "md" | "lg";
  subtitle?: string;
  showTagline?: boolean;
  className?: string;
  textClassName?: string;
}

const sizeClasses = {
  sm: { mark: "h-9 w-9 rounded-lg", initial: "text-sm", name: "text-sm", subtitle: "text-[10px]" },
  md: { mark: "h-11 w-11 rounded-xl", initial: "text-base", name: "text-sm", subtitle: "text-[10px]" },
  lg: { mark: "h-14 w-14 rounded-xl", initial: "text-xl", name: "text-lg", subtitle: "text-xs" },
};

export function BrandMark({
  href = "/",
  size = "md",
  subtitle,
  showTagline = false,
  className,
  textClassName,
}: BrandMarkProps) {
  const { branding } = useSiteContent();
  const brandName = branding.name || "Jhiro Digital Lab";
  const supportingText = subtitle || (showTagline ? branding.tagline || "Digital product studio" : "");
  const styles = sizeClasses[size];

  return (
    <Link href={href} className={cn("group flex min-w-0 items-center gap-3", className)} aria-label={brandName}>
      {branding.logoUrl ? (
        <span className={cn("flex shrink-0 items-center justify-center overflow-hidden bg-white", styles.mark)}>
          {/* CMS assets may use arbitrary production hosts, so a native image keeps branding portable. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={branding.logoUrl} alt="" className="h-full w-full scale-125 object-contain object-center" />
        </span>
      ) : (
        <span className={cn("grid shrink-0 place-items-center bg-emerald-950 font-semibold text-white", styles.mark, styles.initial)}>
          {brandName.charAt(0)}
        </span>
      )}
      <span className={cn("min-w-0 leading-none", textClassName)}>
        <span className={cn("block truncate font-semibold tracking-[-0.025em] text-emerald-950", styles.name)}>{brandName}</span>
        {supportingText && (
          <span className={cn("mt-1.5 block truncate font-medium tracking-[0.04em] text-muted-foreground", styles.subtitle)}>{supportingText}</span>
        )}
      </span>
    </Link>
  );
}
