'use client';

import React from 'react';
import { Badge } from '@/components/ui/badge-2';
import { ChartConfig, ChartContainer, ChartTooltip } from '@/components/ui/line-charts-1';
import { Button } from '@/components/ui/button-1';
import { Card, CardContent, CardHeader, CardTitle, CardToolbar } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ArrowDown, ArrowUp, Calendar, Download, Filter, MoreHorizontal, RefreshCw, Share2, ShieldCheck, Activity } from 'lucide-react';
import { Area, CartesianGrid, ComposedChart, Line, ReferenceLine, XAxis, YAxis } from 'recharts';

// Real QureML Multi-Threshold Operating Points on WDBC Cohort (114 Test Patients)
const triageData = [
  { threshold: 'τ=0.05', sensitivity: 100.0, specificity: 86.4, falseNegatives: 0, sensitivityArea: 100.0 },
  { threshold: 'τ=0.10', sensitivity: 100.0, specificity: 93.8, falseNegatives: 0, sensitivityArea: 100.0 },
  { threshold: 'τ=0.20', sensitivity: 100.0, specificity: 94.4, falseNegatives: 0, sensitivityArea: 100.0 },
  { threshold: 'τ=0.38', sensitivity: 97.6, specificity: 95.8, falseNegatives: 1, sensitivityArea: 97.6 },
  { threshold: 'τ=0.50', sensitivity: 95.2, specificity: 97.2, falseNegatives: 2, sensitivityArea: 95.2 },
  { threshold: 'τ=0.70', sensitivity: 90.5, specificity: 98.6, falseNegatives: 4, sensitivityArea: 90.5 },
  { threshold: 'τ=0.85', sensitivity: 81.0, specificity: 100.0, falseNegatives: 8, sensitivityArea: 81.0 },
];

const chartConfig = {
  specificity: {
    label: 'Specificity (%)',
    color: 'var(--color-pink-500, #ec4899)',
  },
  sensitivity: {
    label: 'Sensitivity (%)',
    color: 'var(--color-teal-500, #06b6d4)',
  },
} satisfies ChartConfig;

interface TooltipProps {
  active?: boolean;
  payload?: Array<{
    dataKey: string;
    value: number;
    color: string;
    payload: {
      threshold: string;
      sensitivity: number;
      specificity: number;
      falseNegatives: number;
    };
  }>;
  label?: string;
}

const ChartLabel = ({ label, color = chartConfig.sensitivity.color }: { label: string; color: string }) => {
  return (
    <div className="flex items-center gap-1.5">
      <div className="size-3.5 border-4 rounded-full bg-background" style={{ borderColor: color }}></div>
      <span className="text-muted-foreground text-xs font-medium">{label}</span>
    </div>
  );
};

const CustomTooltip = ({ active, payload, label }: TooltipProps) => {
  if (active && payload && payload.length) {
    const filteredPayload = payload.filter((entry) => entry.dataKey !== 'sensitivityArea');
    const ptData = payload[0]?.payload;

    return (
      <div className="rounded-lg border bg-popover p-3 shadow-md shadow-black/10 min-w-[210px] text-xs">
        <div className="font-semibold text-popover-foreground tracking-wide mb-2 flex items-center justify-between">
          <span>{label} Cutoff</span>
          {ptData?.falseNegatives === 0 ? (
            <Badge variant="success" appearance="light" className="text-[10px] py-0 px-1.5 flex items-center gap-1">
              <ShieldCheck className="size-3" /> ZERO MISS
            </Badge>
          ) : (
            <Badge variant="warning" appearance="light" className="text-[10px] py-0 px-1.5">
              {ptData?.falseNegatives} Missed
            </Badge>
          )}
        </div>
        <div className="space-y-1.5">
          {filteredPayload.map((entry, index) => {
            const config = chartConfig[entry.dataKey as keyof typeof chartConfig];
            const isSensitivity = entry.dataKey === 'sensitivity';
            return (
              <div key={index} className="flex items-center justify-between gap-2">
                <ChartLabel label={config?.label || entry.dataKey} color={entry.color} />
                <div className="flex items-center gap-1.5">
                  <span className="font-semibold text-popover-foreground font-mono">{entry.value.toFixed(1)}%</span>
                  {isSensitivity && (
                    <Badge
                      variant={entry.value >= 99 ? 'success' : entry.value >= 95 ? 'primary' : 'warning'}
                      appearance="light"
                      className="text-[10px] px-1 py-0 flex items-center gap-0.5"
                    >
                      {entry.value >= 99 ? <ArrowUp className="size-2.5" /> : <ArrowDown className="size-2.5" />}
                      {entry.value >= 99 ? '100% FN=0' : `${(100 - entry.value).toFixed(0)}% err`}
                    </Badge>
                  )}
                </div>
              </div>
            );
          })}
        </div>
        <div className="mt-2.5 pt-2 border-t border-border/50 text-[11px] text-muted-foreground flex items-center gap-1.5">
          <Activity className="size-3 text-primary" />
          <span>{ptData?.falseNegatives === 0 ? 'Urgent biopsy priority protocol' : 'Standard clinical threshold'}</span>
        </div>
      </div>
    );
  }
  return null;
};

export default function QureMLTriageLineChart() {
  return (
    <div className="w-full max-w-5xl flex items-center justify-center p-2">
      <Card className="w-full">
        <CardHeader className="border-0 min-h-auto pt-5 pb-4">
          <div>
            <CardTitle className="text-base font-semibold">QureML Multi-Threshold Triage Optimization</CardTitle>
            <p className="text-xs text-muted-foreground mt-1">Sensitivity vs Specificity trade-off across operating thresholds τ ∈ [0.05, 0.85] on WDBC cohort.</p>
          </div>
          <CardToolbar>
            <div className="flex items-center gap-4 text-sm">
              <ChartLabel label="Sensitivity (Quantum VQC)" color={chartConfig.sensitivity.color} />
              <ChartLabel label="Specificity (Rule-Out)" color={chartConfig.specificity.color} />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="dim" size="sm" mode="icon" className="-me-1.5">
                  <MoreHorizontal className="size-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" side="bottom">
                <DropdownMenuItem>
                  <Download className="size-4" />
                  Export Triage Data (CSV)
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Calendar className="size-4" />
                  Change Cohort Split
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Filter className="size-4" />
                  Filter Operating Regimes
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <RefreshCw className="size-4" />
                  Recalibrate Cutoffs
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Share2 className="size-4" />
                  Share Clinical Summary
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </CardToolbar>
        </CardHeader>

        <CardContent className="px-2.5 pb-4 flex flex-col items-end">
          <ChartContainer
            config={chartConfig}
            className="h-[340px] w-full [&_.recharts-curve.recharts-tooltip-cursor]:stroke-initial"
          >
            <ComposedChart
              data={triageData}
              margin={{
                top: 10,
                right: 20,
                left: 0,
                bottom: 10,
              }}
            >
              <defs>
                <linearGradient id="quremlSensitivityGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={chartConfig.sensitivity.color} stopOpacity={0.35} />
                  <stop offset="100%" stopColor={chartConfig.sensitivity.color} stopOpacity={0.03} />
                </linearGradient>
              </defs>

              <CartesianGrid
                strokeDasharray="4 4"
                stroke="var(--input, #cbd5e1)"
                strokeOpacity={0.4}
                horizontal={true}
                vertical={false}
              />

              <XAxis
                dataKey="threshold"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 11, className: 'text-muted-foreground' }}
                dy={6}
                tickMargin={10}
              />

              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 11, className: 'text-muted-foreground' }}
                tickFormatter={(value) => `${value}%`}
                domain={[75, 102]}
                tickMargin={10}
              />

              {/* Zero-Miss Recommended Operating Cutoff Reference Line */}
              <ReferenceLine
                x="τ=0.10"
                stroke={chartConfig.sensitivity.color}
                strokeWidth={1.5}
                strokeDasharray="3 3"
                label={{ value: 'Zero-Miss (τ=0.10)', fill: chartConfig.sensitivity.color, fontSize: 11, position: 'top' }}
              />

              {/* Balanced Youden J Reference Line */}
              <ReferenceLine
                x="τ=0.38"
                stroke="var(--text-dim, #94a3b8)"
                strokeWidth={1}
                strokeDasharray="2 2"
                label={{ value: 'Balanced (τ=0.38)', fill: '#94a3b8', fontSize: 11, position: 'top' }}
              />

              {/* Tooltip */}
              <ChartTooltip
                content={<CustomTooltip />}
                cursor={{
                  stroke: 'var(--input, #94a3b8)',
                  strokeWidth: 1,
                  strokeDasharray: 'none',
                }}
              />

              {/* Sensitivity area with gradient background */}
              <Area
                type="monotone"
                dataKey="sensitivityArea"
                stroke="transparent"
                fill="url(#quremlSensitivityGradient)"
                strokeWidth={0}
                dot={false}
              />

              {/* Quantum Sensitivity curve with dots */}
              <Line
                type="monotone"
                dataKey="sensitivity"
                stroke={chartConfig.sensitivity.color}
                strokeWidth={2.5}
                dot={{
                  fill: 'var(--background, #0f172a)',
                  strokeWidth: 2,
                  r: 5,
                  stroke: chartConfig.sensitivity.color,
                }}
              />

              {/* Specificity line (dashed) */}
              <Line
                type="monotone"
                dataKey="specificity"
                stroke={chartConfig.specificity.color}
                strokeWidth={2}
                strokeDasharray="4 4"
                dot={{
                  fill: 'var(--background, #0f172a)',
                  strokeWidth: 2,
                  r: 5,
                  stroke: chartConfig.specificity.color,
                  strokeDasharray: '0',
                }}
              />
            </ComposedChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
}

export { QureMLTriageLineChart };
