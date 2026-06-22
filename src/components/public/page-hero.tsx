interface PageHeroProps {
  eyebrow: string;
  title: string;
  description: string;
}

export function PageHero({ eyebrow, title, description }: PageHeroProps) {
  return (
    <section className="relative overflow-hidden bg-emerald-950 pb-20 pt-36 text-white sm:pb-24 sm:pt-44">
      <div className="cta-grid absolute inset-0 opacity-15" aria-hidden="true" />
      <div className="absolute -right-32 top-16 h-80 w-80 rounded-full bg-emerald-400/20 blur-3xl" aria-hidden="true" />
      <div className="container-wide relative">
        <p className="text-sm font-semibold text-emerald-300">{eyebrow}</p>
        <div className="mt-8 grid gap-8 lg:grid-cols-[1.35fr_0.65fr] lg:items-end lg:gap-16">
          <h1 className="max-w-5xl text-balance text-5xl font-semibold leading-[1.02] tracking-[-0.04em] sm:text-6xl lg:text-7xl">{title}</h1>
          <p className="max-w-xl text-pretty text-base leading-7 text-emerald-100/75 sm:text-lg sm:leading-8 lg:justify-self-end">{description}</p>
        </div>
      </div>
    </section>
  );
}
