import Link from "next/link";
import { ArrowLeft } from "@phosphor-icons/react/dist/ssr";
import { Button } from "@/components/ui/button";

interface PageHeaderProps {
  title: string;
  description: string;
  backHref: string;
  backLabel?: string;
}

export function PageHeader({
  title,
  description,
  backHref,
  backLabel = "Kembali",
}: PageHeaderProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="min-w-0">
        <h1>{title}</h1>
        <p className="mt-2 max-w-2xl text-muted-foreground">{description}</p>
      </div>
      <Link href={backHref} className="self-end sm:shrink-0">
        <Button variant="ghost" className="min-h-11">
          <ArrowLeft className="mr-2 h-4 w-4" />
          {backLabel}
        </Button>
      </Link>
    </div>
  );
}
