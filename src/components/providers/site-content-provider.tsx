"use client";

import { createContext, useContext } from "react";
import type { SiteContent } from "@/types/site-content";

const fallback: SiteContent = { branding: {}, contact: {}, footer: {} };
const SiteContentContext = createContext<SiteContent>(fallback);

export function SiteContentProvider({ children, initialContent }: { children: React.ReactNode; initialContent: SiteContent }) {
  return <SiteContentContext.Provider value={initialContent}>{children}</SiteContentContext.Provider>;
}

export function useSiteContentContext() {
  return useContext(SiteContentContext);
}
