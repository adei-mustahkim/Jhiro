"use client";

export function HeroIllustration() {
  return (
    <div className="relative w-full aspect-[4/3]">
      {/* Background glow */}
      <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-emerald-500/20 via-emerald-400/10 to-transparent blur-3xl animate-pulse-glow" />

      {/* Main dashboard frame */}
      <div className="relative rounded-2xl bg-emerald-950 p-3 shadow-[0_28px_60px_-30px_rgba(2,44,34,0.55)] sm:p-4 animate-fade-in">
        <div className="overflow-hidden rounded-[1.35rem] bg-emerald-50/60">
          {/* Browser chrome */}
          <div className="flex h-12 items-center justify-between border-b border-emerald-950/10 px-4">
            <div className="flex items-center gap-1.5" aria-hidden="true">
              <span className="h-2.5 w-2.5 rounded-full bg-red-400/70" />
              <span className="h-2.5 w-2.5 rounded-full bg-amber-400/70" />
              <span className="h-2.5 w-2.5 rounded-full bg-green-400/70" />
            </div>
            <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-emerald-950/40">
              Project cockpit
            </span>
          </div>

          {/* Dashboard content */}
          <div className="grid min-h-[420px] grid-cols-[4rem_1fr] sm:grid-cols-[5rem_1fr]">
            {/* Sidebar */}
            <div className="border-r border-emerald-950/10 p-3">
              <div className="grid h-9 w-9 place-items-center rounded-xl bg-emerald-950 text-xs font-semibold text-white">
                J
              </div>
              <div className="mt-8 space-y-3">
                {[true, false, false, false].map((active, index) => (
                  <div
                    key={index}
                    className={`h-9 rounded-xl transition-all duration-500 ${
                      active ? "bg-emerald-100" : "bg-emerald-950/[0.035]"
                    }`}
                    style={{ animationDelay: `${index * 150}ms` }}
                  />
                ))}
              </div>
            </div>

            {/* Main content */}
            <div className="p-4 sm:p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs text-slate-500">Selamat datang</p>
                  <p className="mt-1 text-lg font-semibold tracking-tight text-slate-900">
                    Ikhtisar proyek
                  </p>
                </div>
                <div className="grid h-9 w-9 place-items-center rounded-xl bg-white shadow-sm">
                  <svg className="h-4 w-4 text-emerald-800" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M0 2a2 2 0 012-2h4a2 2 0 012 2v2a2 2 0 01-2 2H2a2 2 0 01-2-2V2zm6 0a2 2 0 012-2h6a2 2 0 012 2v2a2 2 0 01-2 2H8a2 2 0 01-2-2V2zM0 10a2 2 0 012-2h4a2 2 0 012 2v2a2 2 0 01-2 2H2a2 2 0 01-2-2v-2zm6 0a2 2 0 012-2h6a2 2 0 012 2v2a2 2 0 01-2 2H8a2 2 0 01-2-2v-2z" />
                  </svg>
                </div>
              </div>

              {/* Stats cards */}
              <div className="mt-6 grid grid-cols-2 gap-3">
                <div className="rounded-2xl bg-white p-4 shadow-[0_12px_30px_-24px_rgba(6,78,59,0.45)] animate-fade-in">
                  <p className="text-[10px] uppercase tracking-[0.14em] text-slate-400">Progress</p>
                  <p className="mt-3 text-3xl font-semibold tabular-nums tracking-[-0.04em] text-slate-900">76%</p>
                  <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-emerald-100">
                    <div className="h-full w-3/4 rounded-full bg-emerald-500 animate-[slide-in_1s_ease-out_0.5s_both]" />
                  </div>
                </div>
                <div className="rounded-2xl bg-emerald-500 p-4 text-emerald-950 shadow-[0_14px_30px_-20px_rgba(16,185,129,0.8)] animate-fade-in" style={{ animationDelay: "200ms" }}>
                  <p className="text-[10px] uppercase tracking-[0.14em] opacity-65">Sprint</p>
                  <p className="mt-3 text-3xl font-semibold tabular-nums tracking-[-0.04em]">04</p>
                  <p className="mt-4 text-xs font-medium">Tersisa 8 hari</p>
                </div>
              </div>

              {/* Chart */}
              <div className="mt-3 rounded-2xl bg-white p-4 shadow-[0_12px_30px_-24px_rgba(6,78,59,0.45)] sm:p-5">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-slate-900">Aktivitas project</p>
                  <span className="text-[10px] font-medium text-emerald-700">7 hari</span>
                </div>
                <div className="mt-5 flex h-28 items-end gap-2">
                  {[35, 52, 42, 76, 58, 88, 68, 94, 78, 100].map((height, index) => (
                    <div
                      key={index}
                      className="flex-1 rounded-t-md bg-emerald-100 overflow-hidden"
                      style={{ height: `${height}%` }}
                    >
                      <div
                        className="h-full w-full origin-bottom rounded-t-md bg-emerald-500/80"
                        style={{
                          transform: `scaleY(${0.45 + index * 0.05})`,
                          animation: `slide-up 0.6s ease-out ${0.8 + index * 0.05}s both`,
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating badge */}
      <div className="absolute -bottom-7 -left-5 w-48 rounded-2xl border border-white bg-white/90 p-4 shadow-[0_18px_45px_-18px_rgba(6,78,59,0.35)] backdrop-blur sm:block animate-float">
        <div className="flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-emerald-100">
            <svg className="h-5 w-5 text-emerald-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
            </svg>
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-900">Build shipped</p>
            <p className="mt-0.5 text-[10px] text-slate-400">Production ready</p>
          </div>
        </div>
      </div>
    </div>
  );
}
