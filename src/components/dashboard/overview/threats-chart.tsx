'use client';

import { Area, AreaChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import type { FC } from 'react';

type ThreatsChartProps = {
  data: { date: string; detected: number; resolved: number }[];
};

const chartConfig = {
  detected: {
    label: 'Detected',
    color: 'hsl(var(--destructive))',
  },
  resolved: {
    label: 'Resolved',
    color: 'hsl(var(--chart-green))',
  },
} satisfies ChartConfig;

export const ThreatsChart: FC<ThreatsChartProps> = ({ data }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">Threats Over Time</CardTitle>
        <CardDescription>Simulated data for last 30 days</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-64 w-full">
          <ResponsiveContainer>
            <AreaChart
              accessibilityLayer
              data={data}
              margin={{
                left: 12,
                right: 12,
              }}
            >
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={(value) => value.slice(0, 3)}
              />
              <YAxis tickLine={false} axisLine={false} tickMargin={8} />
              <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="dot" />} />
              <defs>
                <linearGradient id="fillDetected" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--color-detected)" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="var(--color-detected)" stopOpacity={0.1} />
                </linearGradient>
                <linearGradient id="fillResolved" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--color-resolved)" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="var(--color-resolved)" stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <Area
                dataKey="detected"
                type="natural"
                fill="url(#fillDetected)"
                fillOpacity={0.4}
                stroke="var(--color-detected)"
                stackId="a"
              />
              <Area
                dataKey="resolved"
                type="natural"
                fill="url(#fillResolved)"
                fillOpacity={0.4}
                stroke="var(--color-resolved)"
                stackId="a"
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};
