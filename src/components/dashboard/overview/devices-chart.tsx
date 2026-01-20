'use client';

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import type { FC } from 'react';

type DevicesChartProps = {
  data: { policy: string; total: number }[];
};

const chartConfig = {
  total: {
    label: 'Devices',
    color: 'hsl(var(--chart-1))',
  },
} satisfies ChartConfig;

export const DevicesChart: FC<DevicesChartProps> = ({ data }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">Devices by Policy</CardTitle>
        <CardDescription>Distribution of devices across security policies</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-64 w-full">
          <ResponsiveContainer>
            <BarChart accessibilityLayer data={data} margin={{ top: 20 }}>
              <XAxis dataKey="policy" tickLine={false} axisLine={false} tickMargin={8} />
              <YAxis tickLine={false} axisLine={false} tickMargin={8} />
              <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="dot" />} />
              <Bar dataKey="total" fill="var(--color-total)" radius={4} />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};
