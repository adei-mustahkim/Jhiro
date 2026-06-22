import { SiteFooter } from "@/components/public/site-footer";
import { SiteHeader } from "@/components/public/site-header";

interface LegalSection {
  title: string;
  body: string;
}

interface LegalPageProps {
  title: string;
  intro: string;
  sections: LegalSection[];
}

export function LegalPage({ title, intro, sections }: LegalPageProps) {
  return (
    <div className="min-h-screen bg-[#fbfdfc]">
      <SiteHeader />
      <main id="main-content">
        <section className="bg-emerald-950 pb-16 pt-36 text-white sm:pb-20 sm:pt-44">
          <div className="container-wide grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
            <div>
              <p className="text-sm font-semibold text-emerald-300">Informasi legal</p>
              <h1 className="mt-5 text-balance text-5xl font-semibold tracking-[-0.04em] sm:text-6xl">{title}</h1>
            </div>
            <p className="text-sm text-emerald-100/70">Terakhir diperbarui 19 Juni 2026</p>
          </div>
        </section>
        <section className="py-16 sm:py-24">
          <div className="container-wide grid gap-10 lg:grid-cols-[0.55fr_1.45fr] lg:gap-20">
            <p className="max-w-md text-pretty text-xl font-medium leading-8 text-emerald-950">{intro}</p>
            <div className="divide-y divide-emerald-950/10 border-t border-emerald-950/10">
              {sections.map((section) => (
                <section key={section.title} className="grid gap-4 py-8 sm:grid-cols-[0.5fr_1.5fr] sm:gap-10">
                  <h2 className="text-lg font-semibold text-slate-950">{section.title}</h2>
                  <p className="max-w-[65ch] text-base leading-7 text-slate-600">{section.body}</p>
                </section>
              ))}
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
