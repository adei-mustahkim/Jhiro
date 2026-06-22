import Image from 'next/image'
import Link from 'next/link'
import { ArrowUpRight } from '@phosphor-icons/react/dist/ssr'
import { cn } from '@/lib/utils'

interface PortfolioCardProps {
  project: {
    id: string
    slug: string
    name: string
    description: string
    technologies: string[]
    screenshots: string[]
  }
  href: string
  featured?: boolean
  className?: string
}

export function PortfolioCard({ project, href, featured = false, className }: PortfolioCardProps) {
  const screenshot = project.screenshots?.[0]
  return (
    <Link
      href={href}
      className={cn(
        'group flex min-w-0 flex-col overflow-hidden rounded-2xl border border-emerald-950/10 bg-white transition-colors hover:border-emerald-700/30',
        className
      )}
    >
      <div
        className={cn(
          'relative overflow-hidden bg-emerald-50/30',
          featured ? 'aspect-[16/8]' : 'aspect-[16/10]'
        )}
      >
        {screenshot ? (
          <Image
            src={screenshot}
            alt={`Tampilan project ${project.name}`}
            fill
            sizes={featured ? '(max-width: 1024px) 100vw, 86vw' : '(max-width: 768px) 100vw, 50vw'}
            className="object-contain p-3 transition-transform duration-500 ease-out group-hover:scale-[1.01]"
          />
        ) : (
          <div className="grid h-full place-items-center bg-emerald-950 text-sm font-medium text-emerald-100">
            Visual project belum tersedia
          </div>
        )}
        <span className="absolute right-4 top-4 grid h-10 w-10 place-items-center rounded-full bg-emerald-950 text-white transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5">
          <ArrowUpRight className="h-4 w-4" weight="bold" />
        </span>
      </div>
      <div className="flex flex-1 flex-col p-6 sm:p-7">
        <p className="text-sm font-semibold text-emerald-700">Case study</p>
        <h2
          className={cn(
            'mt-3 text-balance font-semibold leading-tight tracking-[-0.035em] text-slate-950',
            featured ? 'text-3xl sm:text-4xl' : 'text-2xl sm:text-3xl'
          )}
        >
          {project.name}
        </h2>
        <p className="mt-3 line-clamp-3 max-w-2xl text-sm leading-6 text-slate-600">
          {project.description}
        </p>
        {project.technologies?.length > 0 && (
          <div className="mt-5 flex flex-wrap gap-x-4 gap-y-2 border-t border-emerald-950/10 pt-4">
            {project.technologies.slice(0, 4).map((tech) => (
              <span key={tech} className="text-xs font-medium text-slate-500">
                {tech}
              </span>
            ))}
          </div>
        )}
      </div>
    </Link>
  )
}
