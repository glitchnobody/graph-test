'use client';

import type { MouseEvent as ReactMouseEvent, ReactNode } from 'react';
import { useEffect, useRef, useState } from 'react';

type RangeKey = 'daily' | 'weekly';
type ThemeMode = 'dark' | 'light';
type ModelKey = 'gemini' | 'chatgpt' | 'perplexity' | 'copilot' | 'grok';
type VariantKey =
  | 'type-1'
  | 'type-2'
  | 'type-3'
  | 'type-4'
  | 'type-5'
  | 'type-6'
  | 'type-7'
  | 'type-8'
  | 'type-9'
  | 'type-10';

type SeriesPoint = {
  label: string;
  gemini: number;
  chatgpt: number;
  perplexity: number;
  copilot: number;
  grok: number;
};

type AnimatedPoint = SeriesPoint & {
  x: number;
};

type MonthSeries = {
  key: string;
  label: string;
  daily: SeriesPoint[];
  weekly: SeriesPoint[];
};

type ModelRow = {
  name: string;
  shareLabel: string;
  shareValue: number;
  changeLabel: string;
  trend: 'up' | 'down' | 'flat';
  color: string;
  icon: 'chatgpt' | 'gemini' | 'copilot' | 'perplexity' | 'grok';
};

type MetricRow = {
  name: string;
  color: string;
  icon?: 'chatgpt' | 'gemini' | 'copilot' | 'perplexity' | 'grok';
  metric: string;
  sparkline: number[];
  trend: 'up' | 'down' | 'flat';
};

type VariantConfig = {
  key: VariantKey;
  label: string;
  modifiers: Record<ModelKey, { offset: number; wave: number; phase: number }>;
};

const modelKeys: ModelKey[] = [
  'gemini',
  'chatgpt',
  'perplexity',
  'copilot',
  'grok',
];

const months: MonthSeries[] = [
  {
    key: 'feb',
    label: 'February 2026',
    daily: [
      {
        label: '2 Feb',
        gemini: 1,
        chatgpt: 2,
        perplexity: 1,
        copilot: 1,
        grok: 0,
      },
      {
        label: '6 Feb',
        gemini: 2,
        chatgpt: 3,
        perplexity: 1,
        copilot: 1,
        grok: 0,
      },
      {
        label: '10 Feb',
        gemini: 2,
        chatgpt: 2,
        perplexity: 1,
        copilot: 1,
        grok: 0,
      },
      {
        label: '14 Feb',
        gemini: 3,
        chatgpt: 4,
        perplexity: 2,
        copilot: 1,
        grok: 1,
      },
      {
        label: '18 Feb',
        gemini: 2,
        chatgpt: 3,
        perplexity: 2,
        copilot: 1,
        grok: 1,
      },
      {
        label: '22 Feb',
        gemini: 4,
        chatgpt: 4,
        perplexity: 2,
        copilot: 2,
        grok: 1,
      },
      {
        label: '26 Feb',
        gemini: 3,
        chatgpt: 5,
        perplexity: 2,
        copilot: 2,
        grok: 1,
      },
      {
        label: '28 Feb',
        gemini: 4,
        chatgpt: 5,
        perplexity: 3,
        copilot: 2,
        grok: 1,
      },
    ],
    weekly: [
      {
        label: 'Week 1',
        gemini: 2,
        chatgpt: 3,
        perplexity: 1,
        copilot: 1,
        grok: 0,
      },
      {
        label: 'Week 2',
        gemini: 3,
        chatgpt: 4,
        perplexity: 2,
        copilot: 1,
        grok: 1,
      },
      {
        label: 'Week 3',
        gemini: 2,
        chatgpt: 4,
        perplexity: 2,
        copilot: 2,
        grok: 1,
      },
      {
        label: 'Week 4',
        gemini: 4,
        chatgpt: 5,
        perplexity: 3,
        copilot: 2,
        grok: 1,
      },
    ],
  },
  {
    key: 'mar',
    label: 'March 2026',
    daily: [
      {
        label: '3 Mar',
        gemini: 1,
        chatgpt: 2,
        perplexity: 1,
        copilot: 1,
        grok: 0,
      },
      {
        label: '7 Mar',
        gemini: 2,
        chatgpt: 2,
        perplexity: 1,
        copilot: 1,
        grok: 0,
      },
      {
        label: '11 Mar',
        gemini: 3,
        chatgpt: 3,
        perplexity: 1,
        copilot: 1,
        grok: 1,
      },
      {
        label: '15 Mar',
        gemini: 2,
        chatgpt: 4,
        perplexity: 2,
        copilot: 1,
        grok: 1,
      },
      {
        label: '19 Mar',
        gemini: 4,
        chatgpt: 3,
        perplexity: 2,
        copilot: 2,
        grok: 1,
      },
      {
        label: '23 Mar',
        gemini: 3,
        chatgpt: 5,
        perplexity: 2,
        copilot: 2,
        grok: 1,
      },
      {
        label: '27 Mar',
        gemini: 4,
        chatgpt: 4,
        perplexity: 3,
        copilot: 2,
        grok: 1,
      },
      {
        label: '31 Mar',
        gemini: 5,
        chatgpt: 5,
        perplexity: 3,
        copilot: 2,
        grok: 2,
      },
    ],
    weekly: [
      {
        label: 'Week 1',
        gemini: 2,
        chatgpt: 2,
        perplexity: 1,
        copilot: 1,
        grok: 0,
      },
      {
        label: 'Week 2',
        gemini: 3,
        chatgpt: 4,
        perplexity: 2,
        copilot: 1,
        grok: 1,
      },
      {
        label: 'Week 3',
        gemini: 4,
        chatgpt: 3,
        perplexity: 2,
        copilot: 2,
        grok: 1,
      },
      {
        label: 'Week 4',
        gemini: 5,
        chatgpt: 5,
        perplexity: 3,
        copilot: 2,
        grok: 2,
      },
    ],
  },
  {
    key: 'apr',
    label: 'April 2026',
    daily: [
      {
        label: '23 Apr',
        gemini: 0,
        chatgpt: 2,
        perplexity: 1,
        copilot: 1,
        grok: 0,
      },
      {
        label: '24 Apr',
        gemini: 1,
        chatgpt: 3,
        perplexity: 1,
        copilot: 1,
        grok: 0,
      },
      {
        label: '25 Apr',
        gemini: 2,
        chatgpt: 2,
        perplexity: 1,
        copilot: 1,
        grok: 0,
      },
      {
        label: '26 Apr',
        gemini: 1,
        chatgpt: 3,
        perplexity: 2,
        copilot: 1,
        grok: 1,
      },
      {
        label: '27 Apr',
        gemini: 2,
        chatgpt: 3,
        perplexity: 2,
        copilot: 2,
        grok: 1,
      },
      {
        label: '28 Apr',
        gemini: 3,
        chatgpt: 2,
        perplexity: 2,
        copilot: 2,
        grok: 1,
      },
      {
        label: '29 Apr',
        gemini: 1,
        chatgpt: 3,
        perplexity: 3,
        copilot: 2,
        grok: 1,
      },
      {
        label: '30 Apr',
        gemini: 3,
        chatgpt: 3,
        perplexity: 3,
        copilot: 2,
        grok: 1,
      },
      {
        label: '1 May',
        gemini: 3,
        chatgpt: 5,
        perplexity: 3,
        copilot: 2,
        grok: 2,
      },
    ],
    weekly: [
      {
        label: 'Week 1',
        gemini: 1,
        chatgpt: 3,
        perplexity: 1,
        copilot: 1,
        grok: 0,
      },
      {
        label: 'Week 2',
        gemini: 2,
        chatgpt: 3,
        perplexity: 2,
        copilot: 1,
        grok: 1,
      },
      {
        label: 'Week 3',
        gemini: 3,
        chatgpt: 2,
        perplexity: 2,
        copilot: 2,
        grok: 1,
      },
      {
        label: 'Week 4',
        gemini: 3,
        chatgpt: 5,
        perplexity: 3,
        copilot: 2,
        grok: 2,
      },
    ],
  },
  {
    key: 'may',
    label: 'May 2026',
    daily: [
      {
        label: '4 May',
        gemini: 2,
        chatgpt: 3,
        perplexity: 1,
        copilot: 1,
        grok: 1,
      },
      {
        label: '8 May',
        gemini: 3,
        chatgpt: 2,
        perplexity: 1,
        copilot: 1,
        grok: 1,
      },
      {
        label: '12 May',
        gemini: 4,
        chatgpt: 4,
        perplexity: 2,
        copilot: 1,
        grok: 1,
      },
      {
        label: '16 May',
        gemini: 3,
        chatgpt: 4,
        perplexity: 2,
        copilot: 2,
        grok: 1,
      },
      {
        label: '20 May',
        gemini: 5,
        chatgpt: 3,
        perplexity: 2,
        copilot: 2,
        grok: 2,
      },
      {
        label: '24 May',
        gemini: 4,
        chatgpt: 5,
        perplexity: 3,
        copilot: 2,
        grok: 2,
      },
      {
        label: '28 May',
        gemini: 5,
        chatgpt: 4,
        perplexity: 3,
        copilot: 3,
        grok: 2,
      },
      {
        label: '31 May',
        gemini: 6,
        chatgpt: 5,
        perplexity: 3,
        copilot: 3,
        grok: 2,
      },
    ],
    weekly: [
      {
        label: 'Week 1',
        gemini: 3,
        chatgpt: 3,
        perplexity: 1,
        copilot: 1,
        grok: 1,
      },
      {
        label: 'Week 2',
        gemini: 4,
        chatgpt: 4,
        perplexity: 2,
        copilot: 2,
        grok: 1,
      },
      {
        label: 'Week 3',
        gemini: 5,
        chatgpt: 4,
        perplexity: 3,
        copilot: 2,
        grok: 2,
      },
      {
        label: 'Week 4',
        gemini: 6,
        chatgpt: 5,
        perplexity: 3,
        copilot: 3,
        grok: 2,
      },
    ],
  },
];

const modelRows: ModelRow[] = [
  {
    name: 'ChatGPT',
    shareLabel: '64%',
    shareValue: 64,
    changeLabel: '4%',
    trend: 'up',
    color: 'var(--accent-blue)',
    icon: 'chatgpt',
  },
  {
    name: 'Gemini',
    shareLabel: '45.5%',
    shareValue: 45.5,
    changeLabel: '4%',
    trend: 'up',
    color: '#2073ff',
    icon: 'gemini',
  },
  {
    name: 'Copilot',
    shareLabel: '15%',
    shareValue: 15,
    changeLabel: '2%',
    trend: 'down',
    color: '#f2bf4b',
    icon: 'copilot',
  },
  {
    name: 'Perplexity',
    shareLabel: '5%',
    shareValue: 5,
    changeLabel: '0%',
    trend: 'flat',
    color: '#f15a4b',
    icon: 'perplexity',
  },
  {
    name: 'Grok',
    shareLabel: 'Fetching ...',
    shareValue: 0,
    changeLabel: 'Pending',
    trend: 'flat',
    color: 'rgba(255,255,255,0.14)',
    icon: 'grok',
  },
];

const chartSeries: Array<{
  key: ModelKey;
  label: string;
  color: string;
  icon: ModelRow['icon'];
}> = [
  {
    key: 'gemini',
    label: 'Gemini',
    color: 'var(--accent-blue)',
    icon: 'gemini',
  },
  {
    key: 'chatgpt',
    label: 'Chat GPT',
    color: 'var(--accent-orange)',
    icon: 'chatgpt',
  },
  {
    key: 'perplexity',
    label: 'perplexity',
    color: 'var(--status-success)',
    icon: 'perplexity',
  },
  {
    key: 'copilot',
    label: 'Copilot',
    color: 'var(--accent-pink)',
    icon: 'copilot',
  },
  { key: 'grok', label: 'Grok', color: 'var(--accent-violet)', icon: 'grok' },
];

const chartVariants: VariantConfig[] = [
  {
    key: 'type-1',
    label: 'Type 1',
    modifiers: {
      gemini: { offset: 0, wave: 0, phase: 0 },
      chatgpt: { offset: 0, wave: 0, phase: 0 },
      perplexity: { offset: 0, wave: 0, phase: 0 },
      copilot: { offset: 0, wave: 0, phase: 0 },
      grok: { offset: 0, wave: 0, phase: 0 },
    },
  },
  {
    key: 'type-2',
    label: 'Type 2',
    modifiers: {
      gemini: { offset: 0.45, wave: 0.35, phase: 0.2 },
      chatgpt: { offset: -0.15, wave: 0.45, phase: 1.1 },
      perplexity: { offset: 0.35, wave: 0.2, phase: 1.8 },
      copilot: { offset: 0.15, wave: 0.25, phase: 0.5 },
      grok: { offset: 0.1, wave: 0.18, phase: 2.2 },
    },
  },
  {
    key: 'type-3',
    label: 'Type 3',
    modifiers: {
      gemini: { offset: -0.2, wave: 0.5, phase: 0.9 },
      chatgpt: { offset: 0.35, wave: 0.28, phase: 0.1 },
      perplexity: { offset: 0.55, wave: 0.26, phase: 1.4 },
      copilot: { offset: 0.3, wave: 0.22, phase: 1.9 },
      grok: { offset: 0.2, wave: 0.2, phase: 2.8 },
    },
  },
  {
    key: 'type-4',
    label: 'Type 4',
    modifiers: {
      gemini: { offset: 0.25, wave: 0.22, phase: 2.1 },
      chatgpt: { offset: 0.1, wave: 0.22, phase: 0.8 },
      perplexity: { offset: 0.8, wave: 0.3, phase: 0.4 },
      copilot: { offset: 0.45, wave: 0.28, phase: 1.7 },
      grok: { offset: 0.3, wave: 0.24, phase: 2.4 },
    },
  },
  {
    key: 'type-5',
    label: 'Type 5',
    modifiers: {
      gemini: { offset: 0.55, wave: 0.42, phase: 1.4 },
      chatgpt: { offset: 0.5, wave: 0.3, phase: 2.3 },
      perplexity: { offset: 0.25, wave: 0.2, phase: 0.6 },
      copilot: { offset: 0.65, wave: 0.34, phase: 1.1 },
      grok: { offset: 0.55, wave: 0.26, phase: 2.9 },
    },
  },
  {
    key: 'type-6',
    label: 'Type 6',
    modifiers: {
      gemini: { offset: 0.55, wave: 0.42, phase: 1.4 },
      chatgpt: { offset: 0.5, wave: 0.3, phase: 2.3 },
      perplexity: { offset: 0.25, wave: 0.2, phase: 0.6 },
      copilot: { offset: 0.65, wave: 0.34, phase: 1.1 },
      grok: { offset: 0.55, wave: 0.26, phase: 2.9 },
    },
  },
  {
    key: 'type-7',
    label: 'Type 7',
    modifiers: {
      gemini: { offset: 0, wave: 0, phase: 0 },
      chatgpt: { offset: 0, wave: 0, phase: 0 },
      perplexity: { offset: 0, wave: 0, phase: 0 },
      copilot: { offset: 0, wave: 0, phase: 0 },
      grok: { offset: 0, wave: 0, phase: 0 },
    },
  },
  {
    key: 'type-8',
    label: 'Type 8',
    modifiers: {
      gemini: { offset: 0, wave: 0, phase: 0 },
      chatgpt: { offset: 0, wave: 0, phase: 0 },
      perplexity: { offset: 0, wave: 0, phase: 0 },
      copilot: { offset: 0, wave: 0, phase: 0 },
      grok: { offset: 0, wave: 0, phase: 0 },
    },
  },
  {
    key: 'type-9',
    label: 'Type 9',
    modifiers: {
      gemini: { offset: 0, wave: 0, phase: 0 },
      chatgpt: { offset: 0, wave: 0, phase: 0 },
      perplexity: { offset: 0, wave: 0, phase: 0 },
      copilot: { offset: 0, wave: 0, phase: 0 },
      grok: { offset: 0, wave: 0, phase: 0 },
    },
  },
  {
    key: 'type-10',
    label: 'Type 10',
    modifiers: {
      gemini: { offset: 0, wave: 0, phase: 0 },
      chatgpt: { offset: 0, wave: 0, phase: 0 },
      perplexity: { offset: 0, wave: 0, phase: 0 },
      copilot: { offset: 0, wave: 0, phase: 0 },
      grok: { offset: 0, wave: 0, phase: 0 },
    },
  },
];

const chartHeight = 242;
const chartWidth = 930;
const chartPadding = { top: 10, right: 18, bottom: 30, left: 24 };
const chartMaxValue = 6;

function getChartX(index: number, total: number) {
  const innerWidth = chartWidth - chartPadding.left - chartPadding.right;
  return chartPadding.left + (index * innerWidth) / Math.max(total - 1, 1);
}

function getChartXWithPadding(
  index: number,
  total: number,
  leftPadding: number,
) {
  const innerWidth = chartWidth - leftPadding - chartPadding.right;
  return leftPadding + (index * innerWidth) / Math.max(total - 1, 1);
}

function getChartY(value: number) {
  const innerHeight = chartHeight - chartPadding.top - chartPadding.bottom;
  return (
    chartPadding.top +
    ((chartMaxValue - value) * innerHeight) / Math.max(chartMaxValue, 1)
  );
}

function buildLinePath(points: Array<{ x: number; y: number }>) {
  return points
    .map((point, index) => {
      return `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`;
    })
    .join(' ');
}

function buildSmoothLinePath(points: Array<{ x: number; y: number }>) {
  if (points.length === 0) {
    return '';
  }

  if (points.length === 1) {
    return `M ${points[0].x} ${points[0].y}`;
  }

  const [first, ...rest] = points;
  let path = `M ${first.x} ${first.y}`;

  for (let index = 0; index < rest.length; index += 1) {
    const current = points[index];
    const next = points[index + 1];
    const midX = (current.x + next.x) / 2;

    path += ` C ${midX} ${current.y}, ${midX} ${next.y}, ${next.x} ${next.y}`;
  }

  return path;
}

function buildAreaPath(points: Array<{ x: number; y: number }>) {
  if (points.length === 0) {
    return '';
  }

  const baseline = getChartY(0);
  const first = points[0];
  const last = points[points.length - 1];

  return [
    `M ${first.x} ${baseline}`,
    `L ${first.x} ${first.y}`,
    ...points.slice(1).map((point) => `L ${point.x} ${point.y}`),
    `L ${last.x} ${baseline}`,
    'Z',
  ].join(' ');
}

function buildSmoothAreaPath(points: Array<{ x: number; y: number }>) {
  if (points.length === 0) {
    return '';
  }

  const baseline = getChartY(0);
  const first = points[0];
  const last = points[points.length - 1];
  let path = `M ${first.x} ${baseline} L ${first.x} ${first.y}`;

  for (let index = 0; index < points.length - 1; index += 1) {
    const current = points[index];
    const next = points[index + 1];
    const midX = (current.x + next.x) / 2;

    path += ` C ${midX} ${current.y}, ${midX} ${next.y}, ${next.x} ${next.y}`;
  }

  path += ` L ${last.x} ${baseline} Z`;
  return path;
}

function samplePoint(
  points: SeriesPoint[],
  index: number,
  targetLength: number,
) {
  if (points.length === 0) {
    return { gemini: 0, chatgpt: 0, perplexity: 0, copilot: 0, grok: 0 };
  }

  const ratio = targetLength <= 1 ? 0 : index / (targetLength - 1);
  const sourceIndex = Math.round(ratio * Math.max(points.length - 1, 0));
  const sourcePoint = points[sourceIndex];

  return {
    gemini: sourcePoint.gemini,
    chatgpt: sourcePoint.chatgpt,
    perplexity: sourcePoint.perplexity,
    copilot: sourcePoint.copilot,
    grok: sourcePoint.grok,
  };
}

function sampleX(
  points: Array<{ x: number }>,
  index: number,
  targetLength: number,
) {
  if (points.length === 0) {
    return getChartX(index, targetLength);
  }

  const ratio = targetLength <= 1 ? 0 : index / (targetLength - 1);
  const sourceIndex = Math.round(ratio * Math.max(points.length - 1, 0));
  return points[sourceIndex].x;
}

function findClosestPointIndex(targetX: number, points: AnimatedPoint[]) {
  return points.reduce((closestIndex, point, index, source) => {
    const currentDistance = Math.abs(point.x - targetX);
    const closestDistance = Math.abs(source[closestIndex].x - targetX);
    return currentDistance < closestDistance ? index : closestIndex;
  }, 0);
}

function clampChartValue(value: number) {
  return Math.min(chartMaxValue, Math.max(0, Number(value.toFixed(2))));
}

function applyVariant(points: SeriesPoint[], variant: VariantConfig) {
  if (variant.key === 'type-1') {
    return points;
  }

  const lastIndex = Math.max(points.length - 1, 1);

  return points.map((point, index) => {
    const progress = index / lastIndex;
    const nextPoint = { label: point.label } as SeriesPoint;

    modelKeys.forEach((key) => {
      const modifier = variant.modifiers[key];
      const wave =
        Math.sin(progress * Math.PI * 2 + modifier.phase) * modifier.wave;
      nextPoint[key] = clampChartValue(point[key] + modifier.offset + wave);
    });

    return nextPoint;
  });
}

function TinySelect({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange?: (value: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <label className='relative inline-flex items-center'>
      <span className='pointer-events-none absolute left-2 top-1/2 -translate-y-1/2 text-[var(--foreground-primary)]'>
        <CalendarIcon />
      </span>
      <select
        aria-label='Select range'
        value={value}
        onChange={(event) => onChange?.(event.target.value)}
        className='h-7 appearance-none rounded-lg border border-[var(--separator-button)] bg-[var(--surface-muted)] pl-8 pr-8 text-[12px] text-[var(--foreground-primary)] outline-none transition-colors hover:border-[var(--separator-prominent)]'
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <span className='pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-[var(--foreground-secondary)]'>
        <ChevronDownIcon />
      </span>
    </label>
  );
}

function AxisToggle({
  checked,
  onToggle,
}: {
  checked: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type='button'
      aria-pressed={checked}
      aria-label={checked ? 'Hide Y axis' : 'Show Y axis'}
      onClick={onToggle}
      className='inline-flex h-7 items-center gap-2 rounded-lg border border-[var(--separator-button)] bg-[var(--surface-muted)] px-2 text-[12px] text-[var(--foreground-primary)] transition-colors hover:border-[var(--separator-prominent)]'
    >
      <span className='text-[var(--foreground-secondary)]'>
        <AxisIcon />
      </span>
      <span>Y Axis</span>
      <span
        className={`relative h-3.5 w-6 rounded-full transition-colors ${
          checked
            ? 'bg-[var(--accent-blue)]'
            : 'bg-[var(--separator-prominent)]'
        }`}
      >
        <span
          className={`absolute top-0.5 h-2.5 w-2.5 rounded-full bg-white transition-transform ${
            checked ? 'translate-x-[11px]' : 'translate-x-0.5'
          }`}
        />
      </span>
    </button>
  );
}

function HeaderTypeSelect({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange?: (value: string) => void;
  options: { value: string; label: string }[];
}) {
  const current =
    options.find((option) => option.value === value) ?? options[0];

  return (
    <label className='relative inline-flex cursor-pointer items-center gap-3'>
      <div className='flex flex-col gap-[2px]'>
        <span className='text-[16px] font-medium text-[var(--foreground-primary)]'>
          {current.label}
        </span>
        <span className='text-[12px] text-[var(--foreground-secondary)]'>
          Select Line Graph type
        </span>
      </div>
      <span className='pointer-events-none text-[var(--foreground-secondary)]'>
        <ChevronDownIcon />
      </span>
      <select
        aria-label='Select chart type'
        value={value}
        onChange={(event) => onChange?.(event.target.value)}
        className='absolute inset-0 cursor-pointer appearance-none opacity-0'
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}

function MetricButton() {
  return (
    <button
      type='button'
      className='relative inline-flex h-[21px] items-center gap-1 overflow-hidden rounded-lg border border-[var(--accent-blue)] px-2 text-[10px] text-[var(--accent-blue)]'
    >
      <span className='absolute inset-0 bg-[var(--accent-blue)] opacity-10' />
      <span className='relative text-[11px]'>＋</span>
      <span className='relative'>Add More</span>
    </button>
  );
}

function SummaryCard({
  title,
  value,
  meta,
  children,
}: {
  title: string;
  value: string;
  meta: ReactNode;
  children?: ReactNode;
}) {
  return (
    <article className='rounded-xl border border-[var(--separator-light)] bg-[var(--background-card)]'>
      <div className='flex items-center justify-between px-6 pb-2 pt-6'>
        <h2 className='text-[16px] font-medium text-[var(--foreground-primary)]'>
          {title}
        </h2>
        <ExternalArrowIcon />
      </div>
      <div className='px-6 pb-6'>
        <p className='text-[24px] font-medium tracking-[-0.03em]'>{value}</p>
        <div className='mt-1 flex items-center justify-between gap-3'>
          <div className='text-[14px] text-[var(--foreground-secondary)]'>
            {meta}
          </div>
          {children}
        </div>
      </div>
    </article>
  );
}

function CompetitorStack() {
  const badges = [
    { kind: 'chatgpt' as const, color: '#4d18c7' },
    { kind: 'gemini' as const, color: '#6bd18b' },
    { kind: 'copilot' as const, color: '#2f2467' },
    { kind: 'grok' as const, color: '#3867be' },
  ];

  return (
    <div className='flex items-center'>
      {badges.map((badge, index) => (
        <div
          key={badge.kind}
          className={`flex h-8 w-[31px] items-center justify-center overflow-hidden rounded-full border border-[var(--separator-prominent)] ${
            index === 0 ? '' : '-ml-1'
          }`}
          style={{ background: badge.color }}
        >
          <ModelIcon kind={badge.kind} size='sm' inverted />
        </div>
      ))}
    </div>
  );
}

function ModelIcon({
  kind,
  size = 'md',
  inverted = false,
}: {
  kind: 'chatgpt' | 'gemini' | 'copilot' | 'perplexity' | 'grok';
  size?: 'sm' | 'md';
  inverted?: boolean;
}) {
  const iconSize = size === 'sm' ? 12 : 14;
  const stroke = inverted ? '#ffffff' : 'currentColor';
  const fill = inverted ? '#ffffff' : 'currentColor';
  if (kind === 'chatgpt') {
    return (
      <svg
        width={iconSize}
        height={iconSize}
        viewBox='0 0 16 16'
        fill='none'
        aria-hidden='true'
      >
        <path
          d='M8 1.5L10.3 2.8L12.9 2.8L14.2 5.1L13.2 7.5L14.2 9.9L12.9 12.2L10.3 12.2L8 14.5L5.7 12.2L3.1 12.2L1.8 9.9L2.8 7.5L1.8 5.1L3.1 2.8L5.7 2.8L8 1.5Z'
          stroke={stroke}
          strokeWidth='1.1'
          strokeLinejoin='round'
        />
      </svg>
    );
  }

  if (kind === 'gemini') {
    return (
      <svg
        width={iconSize}
        height={iconSize}
        viewBox='0 0 16 16'
        fill='none'
        aria-hidden='true'
      >
        <path
          d='M8 1.5C8.6 4.6 11 7 14.1 7.6C11 8.2 8.6 10.6 8 13.7C7.4 10.6 5 8.2 1.9 7.6C5 7 7.4 4.6 8 1.5Z'
          fill={fill}
        />
      </svg>
    );
  }

  if (kind === 'copilot') {
    return (
      <svg
        width={iconSize}
        height={iconSize}
        viewBox='0 0 16 16'
        fill='none'
        aria-hidden='true'
      >
        <path
          d='M4.3 4.8C4.3 3.5 5.3 2.5 6.6 2.5H9.4C10.7 2.5 11.7 3.5 11.7 4.8V11.2C11.7 12.5 10.7 13.5 9.4 13.5H6.6C5.3 13.5 4.3 12.5 4.3 11.2V4.8Z'
          stroke={stroke}
          strokeWidth='1.2'
        />
        <path
          d='M6.3 8H9.7'
          stroke={stroke}
          strokeWidth='1.2'
          strokeLinecap='round'
        />
      </svg>
    );
  }

  if (kind === 'perplexity') {
    return (
      <svg
        width={iconSize}
        height={iconSize}
        viewBox='0 0 16 16'
        fill='none'
        aria-hidden='true'
      >
        <path
          d='M8 2V14M3 4.2L13 11.8M13 4.2L3 11.8'
          stroke={stroke}
          strokeWidth='1.2'
          strokeLinecap='round'
        />
      </svg>
    );
  }

  return (
    <svg
      width={iconSize}
      height={iconSize}
      viewBox='0 0 16 16'
      fill='none'
      aria-hidden='true'
    >
      <circle cx='8' cy='8' r='5.2' stroke={stroke} strokeWidth='1.2' />
      <path
        d='M4.2 11.8L11.8 4.2'
        stroke={stroke}
        strokeWidth='1.2'
        strokeLinecap='round'
      />
    </svg>
  );
}

function Gauge({ value }: { value: number }) {
  const arcPath = 'M 52 150 A 90 90 0 0 1 232 150';

  return (
    <div className='relative h-[208px] w-full'>
      <svg
        viewBox='0 0 284 208'
        className='absolute left-1/2 top-0 h-[208px] w-[284px] -translate-x-1/2'
      >
        <path
          d={arcPath}
          fill='none'
          stroke='var(--separator-light)'
          strokeWidth='20'
          strokeLinecap='round'
          pathLength={100}
        />
        <path
          d={arcPath}
          fill='none'
          stroke='var(--accent-blue)'
          strokeWidth='20'
          strokeLinecap='round'
          className='gauge-progress'
          pathLength={100}
          strokeDasharray={`${value} 100`}
        />
      </svg>

      <div className='absolute inset-x-0 top-[92px] flex flex-col items-center'>
        <span className='text-[28px] font-bold tracking-[-0.04em] text-[var(--foreground-primary)]'>
          {value.toFixed(1)}%
        </span>
        <span className='mt-1 inline-flex items-center gap-1 rounded-full border border-[var(--separator-button)] bg-[var(--surface-muted)] px-[7px] py-[2px] text-[14px] text-[var(--status-success)]'>
          <span className='text-[9px]'>▲</span>4%
        </span>
      </div>
    </div>
  );
}

function SegmentedBar({ value, color }: { value: number; color: string }) {
  const segments = 40;
  const active = Math.round((value / 100) * segments);

  return (
    <div className='flex items-center gap-[3px]'>
      {Array.from({ length: segments }).map((_, index) => (
        <span
          key={index}
          className='h-6 w-[3px] rounded-full'
          style={{
            background: index < active ? color : 'var(--bar-empty)',
          }}
        />
      ))}
    </div>
  );
}

function Sparkline({ points, color }: { points: number[]; color: string }) {
  const width = 31;
  const height = 14;
  const max = Math.max(...points, 1);
  const min = Math.min(...points, 0);
  const range = Math.max(max - min, 1);
  const path = points
    .map((point, index) => {
      const x = (index * width) / Math.max(points.length - 1, 1);
      const y = height - ((point - min) * height) / range;
      return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
    })
    .join(' ');

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className='h-[14px] w-[31px]'
      aria-hidden='true'
    >
      <path
        d={path}
        fill='none'
        stroke={color}
        strokeWidth='1.5'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg
      width='12'
      height='12'
      viewBox='0 0 16 16'
      fill='none'
      aria-hidden='true'
    >
      <rect
        x='2'
        y='3'
        width='12'
        height='11'
        rx='2'
        stroke='currentColor'
        strokeWidth='1.2'
      />
      <path
        d='M5 1.8V4.2M11 1.8V4.2M2 6.2H14'
        stroke='currentColor'
        strokeWidth='1.2'
        strokeLinecap='round'
      />
    </svg>
  );
}

function AxisIcon() {
  return (
    <svg
      width='12'
      height='12'
      viewBox='0 0 16 16'
      fill='none'
      aria-hidden='true'
    >
      <path
        d='M2.5 2.5V13.5H13.5M5 10L7 8L9 9L12 5'
        stroke='currentColor'
        strokeWidth='1.2'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
    </svg>
  );
}

function ChevronDownIcon() {
  return (
    <svg
      width='12'
      height='12'
      viewBox='0 0 16 16'
      fill='none'
      aria-hidden='true'
    >
      <path
        d='M4 6L8 10L12 6'
        stroke='currentColor'
        strokeWidth='1.5'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
    </svg>
  );
}

function ArrowIcon({ direction }: { direction: 'left' | 'right' }) {
  return (
    <svg
      width='12'
      height='12'
      viewBox='0 0 16 16'
      fill='none'
      aria-hidden='true'
    >
      <path
        d={
          direction === 'left'
            ? 'M9.5 3.5L5 8L9.5 12.5'
            : 'M6.5 3.5L11 8L6.5 12.5'
        }
        stroke='currentColor'
        strokeWidth='1.5'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
    </svg>
  );
}

function ExternalArrowIcon() {
  return (
    <svg
      width='16'
      height='16'
      viewBox='0 0 16 16'
      fill='none'
      aria-hidden='true'
    >
      <path
        d='M4.5 11.5L11.5 4.5M6 4.5H11.5V10'
        stroke='currentColor'
        strokeWidth='1.2'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
    </svg>
  );
}

function ThemeIcon({ mode }: { mode: ThemeMode }) {
  if (mode === 'dark') {
    return (
      <svg
        width='16'
        height='16'
        viewBox='0 0 16 16'
        fill='none'
        aria-hidden='true'
      >
        <path
          d='M8 3V2M8 14V13M13 8H14M2 8H3M11.5 4.5L12.2 3.8M3.8 12.2L4.5 11.5M11.5 11.5L12.2 12.2M3.8 3.8L4.5 4.5'
          stroke='currentColor'
          strokeWidth='1.2'
          strokeLinecap='round'
        />
        <circle cx='8' cy='8' r='3' stroke='currentColor' strokeWidth='1.2' />
      </svg>
    );
  }

  return (
    <svg
      width='16'
      height='16'
      viewBox='0 0 16 16'
      fill='none'
      aria-hidden='true'
    >
      <path
        d='M10.9 1.9C9.9 2 8.9 2.5 8.2 3.2C6.1 5.3 6.1 8.7 8.2 10.8C8.9 11.5 9.9 12 10.9 12.1C10.2 12.7 9.2 13 8.1 13C5.3 13 3 10.7 3 7.9C3 5.1 5.3 2.8 8.1 2.8C9.2 2.8 10.2 3.2 10.9 3.8V1.9Z'
        stroke='currentColor'
        strokeWidth='1.2'
        strokeLinejoin='round'
      />
    </svg>
  );
}

export default function Home() {
  const [themeMode, setThemeMode] = useState<ThemeMode>('dark');
  const [selectedVariant, setSelectedVariant] = useState<VariantKey>('type-1');
  const [selectedRange, setSelectedRange] = useState<RangeKey>('daily');
  const [monthIndex, setMonthIndex] = useState(2);
  const [showYAxis, setShowYAxis] = useState(true);
  const [hoveredSeries, setHoveredSeries] = useState<ModelKey | null>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const activeMonth = months[monthIndex];
  const activeVariant =
    chartVariants.find((variant) => variant.key === selectedVariant) ??
    chartVariants[0];
  const points = applyVariant(activeMonth[selectedRange], activeVariant);
  const axisVisible = showYAxis;
  const currentLeftPadding = axisVisible ? chartPadding.left : 8;
  const [displayPoints, setDisplayPoints] = useState<AnimatedPoint[]>(() =>
    points.map((point, index) => ({
      ...point,
      x: getChartXWithPadding(index, points.length, currentLeftPadding),
    })),
  );
  const currentPointsRef = useRef<AnimatedPoint[]>(displayPoints);

  useEffect(() => {
    document.documentElement.dataset.theme = themeMode;
  }, [themeMode]);

  useEffect(() => {
    const startPoints = currentPointsRef.current;
    const targetPoints: AnimatedPoint[] = points.map((point, index) => ({
      ...point,
      x: getChartXWithPadding(index, points.length, currentLeftPadding),
    }));
    let frameId = 0;
    const startedAt = performance.now();
    const duration = 360;

    const animate = (now: number) => {
      const progress = Math.min((now - startedAt) / duration, 1);
      const eased = 1 - (1 - progress) * (1 - progress);
      const nextPoints = targetPoints.map((targetPoint, index) => {
        const sourcePoint = samplePoint(
          startPoints,
          index,
          targetPoints.length,
        );
        const sourceX = sampleX(startPoints, index, targetPoints.length);

        return {
          label: targetPoint.label,
          x: sourceX + (targetPoint.x - sourceX) * eased,
          gemini:
            sourcePoint.gemini +
            (targetPoint.gemini - sourcePoint.gemini) * eased,
          chatgpt:
            sourcePoint.chatgpt +
            (targetPoint.chatgpt - sourcePoint.chatgpt) * eased,
          perplexity:
            sourcePoint.perplexity +
            (targetPoint.perplexity - sourcePoint.perplexity) * eased,
          copilot:
            sourcePoint.copilot +
            (targetPoint.copilot - sourcePoint.copilot) * eased,
          grok:
            sourcePoint.grok + (targetPoint.grok - sourcePoint.grok) * eased,
        };
      });

      currentPointsRef.current = nextPoints;
      setDisplayPoints(nextPoints);

      if (progress < 1) {
        frameId = requestAnimationFrame(animate);
      } else {
        currentPointsRef.current = targetPoints;
        setDisplayPoints(targetPoints);
      }
    };

    frameId = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(frameId);
  }, [points, currentLeftPadding]);

  const seriesPaths = chartSeries.map((series) => ({
    ...series,
    points: displayPoints.map((point) => ({
      x: point.x,
      y: getChartY(point[series.key]),
    })),
  }));
  const innerHeight = chartHeight - chartPadding.top - chartPadding.bottom;
  const metricRows: MetricRow[] = chartSeries.map((series) => {
    const sparkline = displayPoints.map((point) =>
      Number(point[series.key].toFixed(2)),
    );
    const last = sparkline[sparkline.length - 1] ?? 0;
    const previous = sparkline[sparkline.length - 2] ?? last;
    const trend = last > previous ? 'up' : last < previous ? 'down' : 'flat';

    return {
      name: series.label,
      color: series.color,
      icon: series.icon,
      metric: String(Math.round(last)),
      sparkline,
      trend,
    };
  });
  const hoveredPoint = hoveredIndex === null ? null : points[hoveredIndex];
  const hoveredX =
    hoveredIndex === null
      ? null
      : (displayPoints[hoveredIndex]?.x ??
        getChartXWithPadding(hoveredIndex, points.length, currentLeftPadding));
  const hoveredValues =
    hoveredPoint === null
      ? []
      : chartSeries.map((series) => ({
          ...series,
          value: hoveredPoint[series.key],
        }));
  const tooltipSide =
    hoveredX === null || hoveredX < chartWidth * 0.58 ? 'right' : 'left';
  const tooltipY =
    hoveredPoint === null
      ? null
      : Math.max(
          16,
          Math.min(
            76,
            Math.min(...hoveredValues.map((entry) => getChartY(entry.value))) -
              44,
          ),
        );

  const formatMetricValue = (value: number) =>
    Number.isInteger(value) ? String(value) : value.toFixed(1);
  const dotsAlwaysVisible =
    selectedVariant === 'type-2' ||
    selectedVariant === 'type-5' ||
    selectedVariant === 'type-6' ||
    selectedVariant === 'type-9';
  const useCurvedLines =
    selectedVariant === 'type-4' ||
    selectedVariant === 'type-5' ||
    selectedVariant === 'type-6' ||
    selectedVariant === 'type-9';
  const useGlowingLines = selectedVariant === 'type-5';
  const useThickerTypeSixLines = selectedVariant === 'type-6';
  const useTypeSevenSkin =
    selectedVariant === 'type-7' ||
    selectedVariant === 'type-8' ||
    selectedVariant === 'type-9';
  const useHoverOnlyTypeEightArea =
    selectedVariant === 'type-8' || selectedVariant === 'type-9';
  const usedotsSkin = selectedVariant === 'type-10';
  const updateHoveredIndexFromSvg = (event: ReactMouseEvent<SVGSVGElement>) => {
    if (hoveredSeries === null) {
      return;
    }

    const rect = event.currentTarget.getBoundingClientRect();
    const svgX = ((event.clientX - rect.left) / rect.width) * chartWidth;
    setHoveredIndex(findClosestPointIndex(svgX, displayPoints));
  };
  const updateHoveredSeries =
    (seriesKey: ModelKey) => (event: ReactMouseEvent<SVGPathElement>) => {
      const svg = event.currentTarget.ownerSVGElement;
      if (!svg) {
        return;
      }

      const rect = svg.getBoundingClientRect();
      const svgX = ((event.clientX - rect.left) / rect.width) * chartWidth;
      setHoveredSeries(seriesKey);
      setHoveredIndex(findClosestPointIndex(svgX, displayPoints));
    };

  return (
    <main className='min-h-screen bg-[var(--background-primary)] text-[var(--foreground-primary)]'>
      <section className='border-b border-[var(--separator-light)]'>
        <div className='mx-auto flex w-full max-w-[1512px] items-center justify-between px-6 py-[10px]'>
          <div className='flex items-center gap-3'>
            <HeaderTypeSelect
              value={selectedVariant}
              onChange={(value) => {
                const nextVariant = value as VariantKey;
                setSelectedVariant(nextVariant);
                setShowYAxis(nextVariant !== 'type-3');
              }}
              options={chartVariants.map((variant) => ({
                value: variant.key,
                label: variant.label,
              }))}
            />
            <AxisToggle
              checked={showYAxis}
              onToggle={() => setShowYAxis((current) => !current)}
            />
          </div>
          <button
            type='button'
            aria-label='Toggle theme'
            onClick={() =>
              setThemeMode((mode) => (mode === 'dark' ? 'light' : 'dark'))
            }
            className='flex h-7 w-7 items-center justify-center rounded-lg border border-[var(--separator-light)] bg-[var(--surface-muted)] text-[var(--foreground-primary)]'
          >
            <ThemeIcon mode={themeMode} />
          </button>
        </div>
      </section>

      <div className='mx-auto flex w-full max-w-[1512px] flex-col gap-6 px-6 py-6'>
        <section className='grid gap-[18px] lg:grid-cols-3'>
          <SummaryCard
            title='Queries Tracked'
            value='24 total'
            meta={
              <div className='flex items-center gap-3'>
                <span>45 Cites</span>
                <span>33 Mentions</span>
              </div>
            }
          >
            <MetricButton />
          </SummaryCard>

          <article className='rounded-xl border border-[var(--separator-light)] bg-[var(--background-card)]'>
            <div className='flex items-center justify-between px-6 pb-2 pt-6'>
              <h2 className='text-[16px] font-medium text-[var(--foreground-primary)]'>
                Competitors
              </h2>
              <ExternalArrowIcon />
            </div>
            <div className='px-6 pb-6'>
              <CompetitorStack />
              <div className='mt-[10px] flex items-center justify-between gap-3'>
                <p className='text-[14px] text-[var(--foreground-secondary)]'>
                  4 Tracked
                </p>
                <MetricButton />
              </div>
            </div>
          </article>

          <SummaryCard
            title='Live Campaign'
            value='200 Submissions'
            meta={
              <span className='text-[12px] text-[var(--status-success)]'>
                +20.1% from last week
              </span>
            }
          />
        </section>

        <section className='grid gap-6 xl:grid-cols-[340px_minmax(0,1fr)]'>
          <aside className='rounded-lg border border-[var(--separator-light)] bg-[var(--background-card)] p-[18px]'>
            <div className='flex items-center justify-between'>
              <h2 className='text-[16px] font-medium'>Total Visibility</h2>
              <TinySelect
                value='today'
                options={[{ value: 'today', label: 'Today' }]}
              />
            </div>

            <div className='mt-[18px]'>
              <Gauge value={32.4} />
            </div>

            <div className='mx-auto mt-2 h-px w-32 bg-[var(--gauge-divider)]' />

            <div className='mt-4'>
              <h3 className='text-[14px] font-medium text-[var(--foreground-secondary)]'>
                Visibility Per Model
              </h3>
              <div className='mt-6 space-y-4'>
                {modelRows.map((model) => (
                  <div
                    key={model.name}
                    className='grid grid-cols-[28px_minmax(0,1fr)] gap-3'
                  >
                    <div className='flex h-7 w-7 items-center justify-center rounded-full bg-[var(--icon-chip)]'>
                      <ModelIcon kind={model.icon} />
                    </div>
                    <div>
                      <div className='flex items-start justify-between gap-3'>
                        <div className='min-w-0'>
                          <div className='text-[12px] text-[var(--foreground-secondary)]'>
                            {model.shareLabel}
                          </div>
                          <div className='mt-[2px] text-[14px] text-[var(--foreground-secondary)]'>
                            {model.name}
                          </div>
                        </div>
                        <div className='flex items-center gap-1 text-[10px]'>
                          <span
                            className={
                              model.trend === 'up'
                                ? 'text-[var(--status-success)]'
                                : model.trend === 'down'
                                  ? 'text-[var(--status-error)]'
                                  : 'text-[var(--foreground-secondary)]'
                            }
                          >
                            {model.trend === 'up'
                              ? '▲'
                              : model.trend === 'down'
                                ? '▼'
                                : ''}
                            {model.changeLabel}
                          </span>
                          <span className='text-[var(--foreground-secondary)]'>
                            →
                          </span>
                        </div>
                      </div>
                      <div className='mt-[6px]'>
                        <SegmentedBar
                          value={model.shareValue}
                          color={model.color}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </aside>

          <section className='rounded-lg border border-[var(--separator-light)] bg-[var(--background-card)] p-[18px]'>
            <div className='flex flex-wrap items-center justify-between gap-3'>
              <h2 className='text-[16px] font-medium'>Visibility Timeline</h2>
              <div className='flex items-center gap-1'>
                <TinySelect
                  value={selectedRange}
                  onChange={(value) => setSelectedRange(value as RangeKey)}
                  options={[
                    { value: 'daily', label: 'Daily' },
                    { value: 'weekly', label: 'Weekly' },
                  ]}
                />
                <button
                  type='button'
                  aria-label='Previous month'
                  onClick={() =>
                    setMonthIndex(
                      (index) => (index - 1 + months.length) % months.length,
                    )
                  }
                  className='flex h-7 w-7 items-center justify-center rounded-lg bg-[var(--background-prominent)] text-[var(--foreground-tertiary)]'
                >
                  <ArrowIcon direction='left' />
                </button>
                <button
                  type='button'
                  aria-label='Next month'
                  onClick={() =>
                    setMonthIndex((index) => (index + 1) % months.length)
                  }
                  className='flex h-7 w-7 items-center justify-center rounded-lg bg-[var(--background-prominent)] text-[var(--foreground-tertiary)]'
                >
                  <ArrowIcon direction='right' />
                </button>
              </div>
            </div>

            <div className='relative mt-[19px] overflow-x-auto'>
              {hoveredPoint !== null &&
              hoveredX !== null &&
              tooltipY !== null ? (
                <div
                  className='pointer-events-none absolute z-10 w-[164px] rounded-lg border border-[var(--separator-light)] bg-[var(--surface-raised)] px-3 py-2 shadow-[0_10px_30px_rgba(0,0,0,0.35)]'
                  style={{
                    left:
                      tooltipSide === 'right'
                        ? `clamp(12px, calc(${(hoveredX / chartWidth) * 100}% + 18px), calc(100% - 176px))`
                        : `clamp(12px, calc(${(hoveredX / chartWidth) * 100}% - 182px), calc(100% - 176px))`,
                    top: `${tooltipY}px`,
                  }}
                >
                  <div className='mb-2 text-[12px] font-medium text-[var(--foreground-primary)]'>
                    {hoveredPoint.label}
                  </div>
                  <div className='space-y-1.5'>
                    {hoveredValues.map((entry) => (
                      <div
                        key={entry.key}
                        className='flex items-center justify-between gap-3 rounded-md px-2 py-1 text-[11px]'
                        style={{
                          background:
                            hoveredSeries === entry.key
                              ? 'rgba(0, 0, 0, 0.24)'
                              : 'transparent',
                          opacity:
                            hoveredSeries === null ||
                            hoveredSeries === entry.key
                              ? 1
                              : 0.7,
                        }}
                      >
                        <div className='flex items-center gap-2 text-[var(--foreground-secondary)]'>
                          <span
                            className='h-2.5 w-2.5 rounded-full'
                            style={{ background: entry.color }}
                          />
                          <span>{entry.label}</span>
                        </div>
                        <span className='text-[var(--foreground-primary)]'>
                          {formatMetricValue(entry.value)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}
              <svg
                viewBox={`0 0 ${chartWidth} ${chartHeight}`}
                className='block min-w-[720px] w-full h-auto'
                role='img'
                aria-label={`Visibility line chart for ${activeMonth.label}`}
                onMouseMove={updateHoveredIndexFromSvg}
                onMouseLeave={() => {
                  setHoveredSeries(null);
                  setHoveredIndex(null);
                }}
              >
                <defs>
                  {chartSeries.map((series) => (
                    <linearGradient
                      key={series.key}
                      id={`area-${series.key}`}
                      x1='0'
                      y1='0'
                      x2='0'
                      y2='1'
                    >
                      <stop
                        offset='0%'
                        stopColor={series.color}
                        stopOpacity={useTypeSevenSkin ? '0.32' : '0.22'}
                      />
                      <stop
                        offset='100%'
                        stopColor={series.color}
                        stopOpacity='0'
                      />
                    </linearGradient>
                  ))}
                  {usedotsSkin ? (
                    <pattern
                      id='dots-dot-grid'
                      width='14'
                      height='14'
                      patternUnits='userSpaceOnUse'
                    >
                      <circle
                        cx='1.8'
                        cy='1.8'
                        r='1.15'
                        fill='var(--separator-light)'
                        opacity='0.8'
                      />
                    </pattern>
                  ) : null}
                </defs>
                {useTypeSevenSkin ? (
                  <rect
                    x={currentLeftPadding}
                    y={chartPadding.top}
                    width={chartWidth - currentLeftPadding - chartPadding.right}
                    height={chartHeight - chartPadding.top - 28}
                    fill='var(--background-card)'
                  />
                ) : null}
                {usedotsSkin ? (
                  <>
                    <rect
                      x={currentLeftPadding}
                      y={chartPadding.top}
                      width={
                        chartWidth - currentLeftPadding - chartPadding.right
                      }
                      height={chartHeight - chartPadding.top - 28}
                      fill='var(--background-card)'
                    />
                    <rect
                      x={currentLeftPadding}
                      y={chartPadding.top}
                      width={
                        chartWidth - currentLeftPadding - chartPadding.right
                      }
                      height={chartHeight - chartPadding.top - 28}
                      fill='url(#dots-dot-grid)'
                      opacity='0.8'
                    />
                  </>
                ) : null}
                {Array.from({ length: chartMaxValue + 1 }).map((_, index) => {
                  const value = chartMaxValue - index;
                  const y =
                    chartPadding.top + (index * innerHeight) / chartMaxValue;

                  return (
                    <g key={value}>
                      <line
                        x1={currentLeftPadding}
                        y1={y}
                        x2={chartWidth - chartPadding.right}
                        y2={y}
                        stroke={
                          usedotsSkin
                            ? 'var(--separator-light)'
                            : useTypeSevenSkin
                              ? 'var(--separator-prominent)'
                              : 'var(--chart-grid)'
                        }
                        strokeDasharray={
                          useTypeSevenSkin
                            ? '3 8'
                            : usedotsSkin
                              ? '2 10'
                              : undefined
                        }
                        opacity={usedotsSkin ? 0.55 : 1}
                      />
                      {axisVisible ? (
                        <text
                          x='0'
                          y={y + 4}
                          fill='var(--foreground-secondary)'
                          fontSize='12'
                          fontFamily={
                            usedotsSkin ? 'var(--font-geist-mono)' : undefined
                          }
                          letterSpacing={usedotsSkin ? '0.08em' : undefined}
                          opacity='0.7'
                        >
                          {value}
                        </text>
                      ) : null}
                    </g>
                  );
                })}

                {useTypeSevenSkin
                  ? displayPoints.map((point) => (
                      <line
                        key={`vertical-grid-${point.label}`}
                        x1={point.x}
                        y1={chartPadding.top}
                        x2={point.x}
                        y2={chartHeight - 28}
                        stroke='var(--separator-prominent)'
                        strokeDasharray='3 8'
                      />
                    ))
                  : null}
                {usedotsSkin
                  ? displayPoints.map((point) => (
                      <line
                        key={`dots-vertical-grid-${point.label}`}
                        x1={point.x}
                        y1={chartPadding.top}
                        x2={point.x}
                        y2={chartHeight - 28}
                        stroke='var(--separator-light)'
                        strokeDasharray='2 10'
                        opacity='0.55'
                      />
                    ))
                  : null}

                {useTypeSevenSkin && !useHoverOnlyTypeEightArea
                  ? seriesPaths.map((series) => (
                      <path
                        key={`${series.key}-base-area`}
                        d={buildAreaPath(series.points)}
                        fill={`url(#area-${series.key})`}
                        opacity={
                          hoveredSeries === null
                            ? 0.75
                            : hoveredSeries === series.key
                              ? 0.92
                              : 0.28
                        }
                      />
                    ))
                  : null}

                {hoveredSeries !== null &&
                (!useTypeSevenSkin || useHoverOnlyTypeEightArea)
                  ? seriesPaths
                      .filter((series) => series.key === hoveredSeries)
                      .map((series) => (
                        <path
                          key={`${series.key}-area`}
                          d={
                            useCurvedLines
                              ? buildSmoothAreaPath(series.points)
                              : buildAreaPath(series.points)
                          }
                          fill={`url(#area-${series.key})`}
                          opacity='1'
                        />
                      ))
                  : null}

                {seriesPaths.map((series) => (
                  <path
                    key={series.key}
                    d={
                      useCurvedLines
                        ? buildSmoothLinePath(series.points)
                        : buildLinePath(series.points)
                    }
                    fill='none'
                    stroke={series.color}
                    strokeWidth={
                      useTypeSevenSkin
                        ? series.key === 'gemini' || series.key === 'chatgpt'
                          ? '2.2'
                          : '1.7'
                        : usedotsSkin
                          ? series.key === 'gemini' || series.key === 'chatgpt'
                            ? '2.15'
                            : '1.65'
                          : useThickerTypeSixLines
                            ? series.key === 'gemini' ||
                              series.key === 'chatgpt'
                              ? '2.2'
                              : '1.7'
                            : series.key === 'gemini' ||
                                series.key === 'chatgpt'
                              ? '1.9'
                              : '1.35'
                    }
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    className='chart-line'
                    opacity={
                      hoveredSeries === null
                        ? useTypeSevenSkin || usedotsSkin
                          ? 0.98
                          : series.key === 'gemini' || series.key === 'chatgpt'
                            ? 1
                            : 0.9
                        : hoveredSeries === series.key
                          ? 1
                          : 0.4
                    }
                    style={
                      useGlowingLines
                        ? {
                            filter: `drop-shadow(0 0 2px ${series.color})`,
                          }
                        : undefined
                    }
                  />
                ))}

                {seriesPaths.map((series) => (
                  <path
                    key={`${series.key}-hit`}
                    d={
                      useCurvedLines
                        ? buildSmoothLinePath(series.points)
                        : buildLinePath(series.points)
                    }
                    fill='none'
                    stroke='transparent'
                    strokeWidth='16'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    onMouseEnter={updateHoveredSeries(series.key)}
                    onMouseMove={updateHoveredSeries(series.key)}
                  />
                ))}

                {dotsAlwaysVisible
                  ? chartSeries.flatMap((series) =>
                      displayPoints.map((point, index) => (
                        <circle
                          key={`${series.key}-dot-${index}`}
                          cx={point.x}
                          cy={getChartY(point[series.key])}
                          r={
                            hoveredSeries === series.key &&
                            hoveredIndex === index
                              ? '3.8'
                              : '2.6'
                          }
                          fill={series.color}
                          stroke='var(--background-card)'
                          strokeWidth='1.2'
                          opacity={
                            hoveredSeries === null
                              ? 1
                              : hoveredSeries === series.key
                                ? 1
                                : 0.4
                          }
                        />
                      )),
                    )
                  : null}

                {hoveredIndex !== null && hoveredSeries !== null
                  ? chartSeries
                      .filter((series) => series.key === hoveredSeries)
                      .map((series) => {
                        const point = displayPoints[hoveredIndex];
                        if (!point) {
                          return null;
                        }

                        return (
                          <circle
                            key={series.key}
                            cx={point.x}
                            cy={getChartY(point[series.key])}
                            r={dotsAlwaysVisible ? '4.2' : '3.6'}
                            fill={series.color}
                            stroke='var(--background-card)'
                            strokeWidth='1.5'
                          />
                        );
                      })
                  : null}

                {displayPoints.map((point) => {
                  const x = point.x;

                  return (
                    <g key={point.label}>
                      <text
                        x={x}
                        y={chartHeight - 4}
                        textAnchor='middle'
                        fill='var(--foreground-secondary)'
                        fontSize={point.label === '1 May' ? 10 : 12}
                        fontFamily={
                          usedotsSkin ? 'var(--font-geist-mono)' : undefined
                        }
                        letterSpacing={usedotsSkin ? '0.06em' : undefined}
                        opacity='0.7'
                      >
                        {point.label}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>

            <div className='mx-auto mt-2 h-px w-32 bg-[var(--gauge-divider)]' />

            <div className='mt-3'>
              <div className='mb-3 grid grid-cols-[minmax(0,1fr)_175px] items-center gap-[18px] text-[14px] font-medium text-[var(--foreground-secondary)]'>
                <span>Model</span>
                <span className='text-right'>All Time Visibility Metric</span>
              </div>
              <div className='space-y-0'>
                {metricRows.map((row, index) => (
                  <div
                    key={row.name}
                    className='grid grid-cols-[minmax(0,1fr)_175px] items-center gap-[18px] rounded px-2 py-[6px]'
                    style={{
                      background:
                        index % 2 === 0
                          ? 'var(--background-primary)'
                          : 'transparent',
                    }}
                  >
                    <div className='flex items-center gap-2'>
                      <span
                        className='h-[14px] w-[14px] rounded-full'
                        style={{ background: row.color }}
                      />
                      {row.icon ? (
                        <ModelIcon kind={row.icon} size='sm' />
                      ) : null}
                      <span className='text-[14px] text-[var(--foreground-primary)]'>
                        {row.name}
                      </span>
                    </div>
                    <div className='flex items-center justify-end gap-[10px] rounded border border-[var(--separator-button)] bg-[var(--background-secondary)] px-3 py-[3px]'>
                      <span className='text-[14px] text-[var(--foreground-secondary)]'>
                        {row.metric}
                      </span>
                      <Sparkline
                        points={row.sparkline}
                        color={
                          row.trend === 'up'
                            ? 'var(--status-success)'
                            : row.trend === 'down'
                              ? 'var(--status-error)'
                              : 'var(--foreground-secondary)'
                        }
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </section>
      </div>
    </main>
  );
}
