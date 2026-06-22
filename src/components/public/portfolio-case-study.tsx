'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, ArrowRight, ArrowUpRight, Expand, X } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface PortfolioCaseStudyProps {
  name: string
  description: string
  technologies: string[]
  screenshots: string[]
  projectUrl: string | null
}

export function PortfolioCaseStudy({
  name,
  description,
  technologies,
  screenshots,
  projectUrl,
}: PortfolioCaseStudyProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null)
  useEffect(() => {
    if (activeIndex === null) return
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    function onKey(event: KeyboardEvent) {
      if (event.key === 'Escape') setActiveIndex(null)
      if (event.key === 'ArrowRight')
        setActiveIndex((index) => (index === null ? null : (index + 1) % screenshots.length))
      if (event.key === 'ArrowLeft')
        setActiveIndex((index) =>
          index === null ? null : (index - 1 + screenshots.length) % screenshots.length
        )
    }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = previous
      window.removeEventListener('keydown', onKey)
    }
  }, [activeIndex, screenshots.length])
  const cover = screenshots[0]
  return (
    <>
      <section className="bg-white pb-12 pt-32 sm:pb-16 sm:pt-36">
        <div className="container-wide">
          <div className="flex justify-end">
            <Link
              href="/portfolio"
              className="inline-flex min-h-11 w-fit items-center gap-2 rounded-lg px-3 text-sm font-semibold text-emerald-800 transition-colors hover:bg-emerald-50 hover:text-emerald-950"
            >
              <ArrowLeft className="h-4 w-4" />
              Kembali ke karya
            </Link>
          </div>

          <div className="mt-8 max-w-5xl sm:mt-10">
            <h1 className="text-balance break-words text-5xl font-semibold leading-[1.02] tracking-[-0.04em] text-slate-950 sm:text-6xl lg:text-7xl">
              {name}
            </h1>
          </div>

        </div>
      </section>

      <section className="bg-white pb-0">
        <div className="container-wide">
          <div className="border border-emerald-950/10 bg-emerald-50/30 p-3 sm:p-6 lg:p-8">
            <div className="relative aspect-[16/10] overflow-hidden bg-white">
              {cover ? (
                <button
                  type="button"
                  className="group absolute inset-0 cursor-zoom-in"
                  onClick={() => setActiveIndex(0)}
                  aria-label="Perbesar gambar utama"
                >
                  <Image
                    src={cover}
                    alt={`Tampilan utama ${name}`}
                    fill
                    priority
                    sizes="(max-width: 1280px) 100vw, 1280px"
                    className="object-contain transition-transform duration-700 ease-out group-hover:scale-[1.01]"
                  />
                  <span className="absolute right-4 top-4 grid h-11 w-11 place-items-center rounded-lg bg-slate-950/80 text-white transition-colors group-hover:bg-slate-950">
                    <Expand className="h-4 w-4" />
                  </span>
                </button>
              ) : (
                <div className="grid h-full place-items-center text-sm text-slate-600">
                  Belum ada visual project.
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-emerald-950/10 bg-emerald-50/30 py-16 sm:py-20">
        <div className="container-wide grid gap-12 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-start lg:gap-16 xl:gap-20">
          <div className="min-w-0">
            <h2 className="text-2xl font-semibold tracking-[-0.03em] text-emerald-950 sm:text-3xl">
              Tentang project
            </h2>
            <div className="mt-8 max-w-[72ch] text-pretty text-base leading-8 text-slate-700 sm:text-lg">
              <DescriptionContent description={description} />
            </div>
          </div>

          <aside className="h-fit rounded-xl bg-emerald-950 p-6 text-white lg:sticky lg:top-28 sm:p-7" aria-label="Ringkasan project">
            <h2 className="text-xl font-semibold tracking-[-0.02em]">Ringkasan project</h2>

            {technologies.length > 0 && (
              <div className="mt-6 border-t border-white/15 pt-5">
                <p className="text-sm font-medium text-emerald-200">Teknologi</p>
                <ul className="mt-3 flex flex-wrap gap-2">
                  {technologies.map((item) => (
                    <li key={item} className="rounded-full bg-white/10 px-3 py-1.5 text-xs font-medium text-emerald-50">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="mt-7 space-y-3 border-t border-white/15 pt-6">
              {projectUrl && (
                <a
                  href={projectUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex min-h-11 w-full items-center justify-between rounded-lg bg-emerald-300 px-4 py-3 text-sm font-semibold text-emerald-950 transition-colors hover:bg-emerald-200"
                >
                  Kunjungi project
                  <ArrowUpRight className="h-4 w-4" />
                </a>
              )}
              <Link
                href="/contact"
                className="inline-flex min-h-11 w-full items-center justify-between rounded-lg border border-white/20 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/10"
              >
                Diskusikan project serupa
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>
          </aside>
        </div>
      </section>
      {screenshots.length > 1 && (
        <section className="bg-white py-20 sm:py-28">
          <div className="container-wide">
            <div className="flex flex-col gap-4 border-b border-emerald-950/10 pb-8 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-sm font-semibold text-emerald-700">Galeri</p>
                <h2 className="mt-2 text-3xl font-semibold tracking-[-0.035em] text-slate-950 sm:text-4xl">
                  Tampilan lengkap project.
                </h2>
              </div>
              <p className="max-w-md text-sm leading-6 text-slate-600">
                Pilih gambar untuk melihat detail dalam ukuran penuh. Gunakan tombol panah untuk
                berpindah.
              </p>
            </div>
            <div className="mt-10 grid gap-4 md:grid-cols-12">
              {screenshots.slice(1).map((image, index) => {
                const originalIndex = index + 1
                const layout = getLayout(index)
                return (
                  <button
                    type="button"
                    key={`${image}-${originalIndex}`}
                    onClick={() => setActiveIndex(originalIndex)}
                    className={`${layout} group relative aspect-[16/10] cursor-zoom-in overflow-hidden border border-emerald-950/10 bg-emerald-50/30 text-left`}
                    aria-label={`Perbesar gambar ${originalIndex + 1} dari ${screenshots.length}`}
                  >
                    <Image
                      src={image}
                      alt={`${name}, tampilan ${originalIndex + 1}`}
                      fill
                      sizes="(max-width: 768px) 100vw, 70vw"
                      className="object-contain p-3 transition-transform duration-700 ease-out group-hover:scale-[1.01]"
                    />
                    <span className="absolute left-4 top-4 rounded-full bg-white/90 px-2.5 py-1 text-xs font-semibold tabular-nums text-emerald-950">
                      {String(originalIndex + 1).padStart(2, '0')}
                    </span>
                    <span className="absolute bottom-4 right-4 grid h-11 w-11 place-items-center rounded-full bg-slate-950/75 text-white opacity-100 transition-opacity md:opacity-0 md:group-hover:opacity-100">
                      <Expand className="h-4 w-4" />
                    </span>
                  </button>
                )
              })}
            </div>
          </div>
        </section>
      )}
      <section className="bg-white px-4 pb-20 sm:px-6 sm:pb-28">
        <div className="container-wide flex flex-col gap-7 border-t border-emerald-950/10 pt-10 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-slate-600">Punya tantangan digital yang serupa?</p>
            <h2 className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-emerald-950">
              Mari membangun versi yang tepat untuk bisnis Anda.
            </h2>
          </div>
          <Link href="/contact">
            <Button size="lg" className="bg-emerald-700 shadow-none hover:bg-emerald-800">
              Diskusikan project
              <ArrowUpRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>
      {activeIndex !== null && screenshots[activeIndex] && (
        <div
          className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-950/95 p-3 sm:p-8"
          role="dialog"
          aria-modal="true"
          aria-label={`Galeri ${name}`}
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setActiveIndex(null)
          }}
        >
          <button
            type="button"
            onClick={() => setActiveIndex(null)}
            className="absolute right-4 top-4 z-10 grid h-11 w-11 place-items-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
            aria-label="Tutup galeri"
          >
            <X className="h-5 w-5" />
          </button>
          <div className="relative h-[82vh] w-full max-w-7xl">
            <Image
              src={screenshots[activeIndex]}
              alt={`${name}, gambar ${activeIndex + 1}`}
              fill
              priority
              sizes="100vw"
              className="object-contain"
            />
          </div>
          {screenshots.length > 1 && (
            <>
              <button
                type="button"
                onClick={() =>
                  setActiveIndex((activeIndex - 1 + screenshots.length) % screenshots.length)
                }
                className="absolute left-3 top-1/2 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 sm:left-6"
                aria-label="Gambar sebelumnya"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              <button
                type="button"
                onClick={() => setActiveIndex((activeIndex + 1) % screenshots.length)}
                className="absolute right-3 top-1/2 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 sm:right-6"
                aria-label="Gambar berikutnya"
              >
                <ArrowRight className="h-5 w-5" />
              </button>
              <span className="absolute bottom-5 left-1/2 -translate-x-1/2 rounded-full bg-white/10 px-3 py-1.5 text-xs font-semibold tabular-nums text-white">
                {activeIndex + 1} / {screenshots.length}
              </span>
            </>
          )}
        </div>
      )}
    </>
  )
}
function getLayout(index: number) {
  const pattern = ['md:col-span-8', 'md:col-span-4', 'md:col-span-5', 'md:col-span-7']
  return pattern[index % pattern.length]
}

function DescriptionContent({ description }: { description: string }) {
  const blocks = description
    .trim()
    .split(/\n\s*\n/)
    .map((block) => block.trim())
    .filter(Boolean)

  return (
    <div className="space-y-6">
      {blocks.map((block, index) => {
        const lines = block
          .split('\n')
          .map((line) => line.trim())
          .filter(Boolean)
        const hasList = lines.length > 2 && !/[.!?]$/.test(lines[0] ?? '')

        if (hasList) {
          return (
            <div key={`${lines[0]}-${index}`}>
              <h2 className="text-lg font-semibold text-emerald-950">{lines[0]}</h2>
              <ul className="mt-4 grid gap-x-8 gap-y-3 text-sm leading-6 sm:grid-cols-2">
                {lines.slice(1).map((line) => (
                  <li key={line} className="flex gap-3">
                    <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" aria-hidden="true" />
                    <span>{line.replace(/^[-•]\s*/, '')}</span>
                  </li>
                ))}
              </ul>
            </div>
          )
        }

        return <p key={`${block.slice(0, 32)}-${index}`}>{block}</p>
      })}
    </div>
  )
}



