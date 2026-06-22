"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function ProjectsError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-[400px] flex-col items-center justify-center gap-4 text-center">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold">Gagal memuat project</h2>
        <p className="text-muted-foreground">
          {error.message || "Terjadi kesalahan saat memuat data project."}
        </p>
      </div>
      <Button onClick={reset} variant="outline">
        Coba lagi
      </Button>
    </div>
  );
}
