"use client";

import { useSiteContentContext } from "@/components/providers/site-content-provider";

export function useSiteContent() {
  return useSiteContentContext();
}
