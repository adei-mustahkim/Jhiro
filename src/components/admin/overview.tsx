"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface OverviewDataItem {
  name: string;
  value: number;
  fill?: string;
}

const STATUS_COLORS: Record<string, string> = {
  NEW: "#059669",
  REQUIREMENT_GATHERING: "#10b981",
  DESIGN: "#34d399",
  DEVELOPMENT: "#047857",
  TESTING: "#065f46",
  REVIEW: "#064e3b",
  REVISION: "#0d9488",
  COMPLETED: "#059669",
  ARCHIVED: "#6ee7b7",
};

const STATUS_LABELS: Record<string, string> = {
  NEW: "New",
  REQUIREMENT_GATHERING: "Req Gathering",
  DESIGN: "Design",
  DEVELOPMENT: "Development",
  TESTING: "Testing",
  REVIEW: "Review",
  REVISION: "Revision",
  COMPLETED: "Completed",
  ARCHIVED: "Archived",
};

export function Overview({ data }: { data?: OverviewDataItem[] }) {
  const chartData = data ?? Object.entries(STATUS_COLORS).map(([status]) => ({
    name: STATUS_LABELS[status] ?? status,
    value: 0,
    fill: STATUS_COLORS[status],
  }));

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
          <XAxis
            dataKey="name"
            tick={{ fontSize: 12 }}
            tickLine={false}
            axisLine={false}
            className="fill-muted-foreground"
          />
          <YAxis
            tick={{ fontSize: 12 }}
            tickLine={false}
            axisLine={false}
            className="fill-muted-foreground"
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "hsl(var(--background))",
              border: "1px solid hsl(var(--border))",
              borderRadius: "8px",
            }}
          />
          <Bar dataKey="value" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
