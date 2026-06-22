"use client";

const steps = [
  {
    number: "01",
    title: "Eksplorasi & strategi",
    description: "Menyamakan tujuan bisnis dan kebutuhan pengguna.",
    icon: (
      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
    ),
  },
  {
    number: "02",
    title: "Desain pengalaman",
    description: "Menguji alur sebelum development dimulai.",
    icon: (
      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
      </svg>
    ),
  },
  {
    number: "03",
    title: "Build & validasi",
    description: "Mengirim progres dalam sprint yang transparan.",
    icon: (
      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
      </svg>
    ),
  },
  {
    number: "04",
    title: "Peluncuran & dukungan",
    description: "Memantau hasil dan menyiapkan iterasi.",
    icon: (
      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
  },
];

export function ProcessSteps() {
  return (
    <ol className="mt-2 flex-1 divide-y divide-white/12">
      {steps.map((step, index) => (
        <li
          key={step.title}
          className="grid grid-cols-[2.5rem_1fr] gap-4 py-5 animate-fade-in"
          style={{ animationDelay: `${index * 150}ms` }}
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-400/20 text-emerald-300">
            {step.icon}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-emerald-400">{step.number}</span>
              <h4 className="font-semibold">{step.title}</h4>
            </div>
            <p className="mt-1 text-sm leading-6 text-emerald-100/70">{step.description}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}
