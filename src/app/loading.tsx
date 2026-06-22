export default function Loading() {
  return (
    <div className="grid min-h-[55vh] place-items-center bg-background" role="status" aria-live="polite">
      <div className="flex flex-col items-center gap-4">
        <span className="h-8 w-8 animate-spin rounded-full border-2 border-emerald-950/15 border-t-emerald-700" />
        <span className="text-sm font-medium text-slate-600">Memuat halaman...</span>
      </div>
    </div>
  );
}
