/**
 * SpendingChart
 *
 * Dotted smooth-curve line chart matching the reference image:
 *   • White dotted bezier line
 *   • White filled circle at the peak data point
 *   • Dark pill showing the peak amount (e.g. "$10,525")
 *   • No axes, no grid lines — just the line floating on dark bg
 */

import React from 'react';
import { View } from 'react-native';
import Svg, { Path, Circle, Rect, Text as SvgText, G } from 'react-native-svg';

interface SpendingChartProps {
  width: number;
  height?: number;
  /** Normalised data points 0–1 (0 = bottom, 1 = top) */
  data?: number[];
  /** Index of the highlighted peak */
  peakIndex?: number;
  /** Amount shown in the peak bubble */
  peakLabel?: string;
}

// Default data matches the visual shape in the reference:
// rises gradually, peaks at index 7, comes back slightly
const DEFAULT_DATA = [0.12, 0.28, 0.18, 0.40, 0.32, 0.56, 0.72, 0.94, 0.82, 0.66];
const DEFAULT_PEAK = 7;

export function SpendingChart({
  width,
  height = 180,
  data = DEFAULT_DATA,
  peakIndex = DEFAULT_PEAK,
  peakLabel = '$10,525',
}: SpendingChartProps) {
  const PAD = { top: 36, right: 16, bottom: 16, left: 4 };
  const chartW = width - PAD.left - PAD.right;
  const chartH = height - PAD.top - PAD.bottom;

  // Map normalised value → SVG y (inverted: 0=bottom → high y)
  const xAt = (i: number) => PAD.left + (i / (data.length - 1)) * chartW;
  const yAt = (v: number) => PAD.top + (1 - v) * chartH;

  // Build smooth cubic-bezier path through points
  const pts = data.map((v, i) => ({ x: xAt(i), y: yAt(v) }));

  let d = `M ${pts[0].x.toFixed(1)} ${pts[0].y.toFixed(1)}`;
  for (let i = 1; i < pts.length; i++) {
    const tension = 0.38;
    const cp1x = pts[i - 1].x + (pts[i].x - pts[i - 1].x) * tension;
    const cp1y = pts[i - 1].y;
    const cp2x = pts[i].x - (pts[i].x - pts[i - 1].x) * tension;
    const cp2y = pts[i].y;
    d += ` C ${cp1x.toFixed(1)},${cp1y.toFixed(1)} ${cp2x.toFixed(1)},${cp2y.toFixed(1)} ${pts[i].x.toFixed(1)},${pts[i].y.toFixed(1)}`;
  }

  const peak = pts[peakIndex];

  // Bubble dimensions
  const BUBBLE_W = 68;
  const BUBBLE_H = 22;
  const BUBBLE_X = Math.min(Math.max(peak.x - BUBBLE_W / 2, 0), width - BUBBLE_W);
  const BUBBLE_Y = peak.y - BUBBLE_H - 10;

  return (
    <View>
      <Svg width={width} height={height}>
        {/* ── Dotted line ─────────────────────────────────────── */}
        <Path
          d={d}
          stroke="rgba(255,255,255,0.85)"
          strokeWidth={1.5}
          strokeDasharray="3 7"
          strokeLinecap="round"
          fill="none"
        />

        {/* ── Peak circle ─────────────────────────────────────── */}
        <Circle
          cx={peak.x}
          cy={peak.y}
          r={5}
          fill="#FFFFFF"
        />

        {/* ── Amount bubble ────────────────────────────────────── */}
        <G>
          <Rect
            x={BUBBLE_X}
            y={BUBBLE_Y}
            width={BUBBLE_W}
            height={BUBBLE_H}
            rx={5}
            ry={5}
            fill="#2A2B2F"
          />
          <SvgText
            x={BUBBLE_X + BUBBLE_W / 2}
            y={BUBBLE_Y + BUBBLE_H / 2 + 4.5}
            fontSize={11}
            fontWeight="400"
            fill="#FFFFFF"
            textAnchor="middle"
          >
            {peakLabel}
          </SvgText>
        </G>
      </Svg>
    </View>
  );
}
