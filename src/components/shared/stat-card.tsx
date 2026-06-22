import { Card, CardContent } from "@/components/ui/card";
import type { ElementType } from "react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: ElementType;
  trend?: {
    value: number;
    label?: string;
  };
}

export function StatCard({ title, value, subtitle, icon: Icon, trend }: StatCardProps) {
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-5 sm:p-6">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-3xl font-semibold tabular-nums tracking-[-0.035em] text-emerald-950">
              {value}
            </p>
            {subtitle && (
              <p className="text-xs text-muted-foreground">{subtitle}</p>
            )}
          </div>
          {Icon && (
            <div className="grid h-10 w-10 place-items-center rounded-lg bg-emerald-100">
              <Icon className="h-5 w-5 text-emerald-700" />
            </div>
          )}
        </div>
        {trend && (
          <div className="mt-3 flex items-center gap-1.5">
            <span
              className={cn(
                "text-xs font-semibold tabular-nums",
                trend.value > 0 ? "text-emerald-600" : trend.value < 0 ? "text-red-500" : "text-slate-400"
              )}
            >
              {trend.value > 0 ? "+" : ""}{trend.value}%
            </span>
            {trend.label && (
              <span className="text-xs text-muted-foreground">{trend.label}</span>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

