/**
 * MiniCostChart
 *
 * Compact version of SpendingChart for per-peptide analytics cards.
 * Same dashed bezier line, dots at data points, small total-cost bubble at the end.
 * No axes, no grid lines — floating on dark background.
 *
 * When there is no meaningful data yet (all zero / only 1 point),
 * a muted placeholder line is shown with a centered "Not enough data" label.
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Path, Circle, Rect, Text as SvgText } from 'react-native-svg';
import { CostDataPoint } from '../../utils/analytics';
import { theme } from '../../theme';

interface MiniCostChartProps {
  width: number;
  height?: number;
  data: CostDataPoint[];
  /** Formatted label for end bubble, e.g. "$14.40" — empty string hides bubble */
  totalLabel: string;
}

const MIN_MEANINGFUL_POINTS = 2;

export function MiniCostChart({
  width,
  height = 80,
  data,
  totalLabel,
}: MiniCostChartProps) {
  const PAD = { top: 20, right: 44, bottom: 8, left: 4 };
  const chartW = width - PAD.left - PAD.right;
  const chartH = height - PAD.top - PAD.bottom;

  const allZero = data.every(p => p.y === 0);
  const notEnoughData = data.length < MIN_MEANINGFUL_POINTS || allZero;

  // ── Demo chart when no real data yet ──────────────────────────────────────
  if (notEnoughData) {
    // Gentle rising curve — same shape as SpendingChart reference
    const demoNorm = [0.08, 0.22, 0.15, 0.35, 0.28, 0.50, 0.65, 0.88, 0.78, 0.60];
    const demoMaxX = demoNorm.length - 1;

    const xD = (i: number) => PAD.left + (i / demoMaxX) * chartW;
    const yD = (v: number) => PAD.top + (1 - v) * chartH;
    const demoPts = demoNorm.map((v, i) => ({ x: xD(i), y: yD(v) }));

    let dD = `M ${demoPts[0].x.toFixed(1)} ${demoPts[0].y.toFixed(1)}`;
    for (let i = 1; i < demoPts.length; i++) {
      const t = 0.36;
      const cp1x = demoPts[i - 1].x + (demoPts[i].x - demoPts[i - 1].x) * t;
      const cp2x = demoPts[i].x - (demoPts[i].x - demoPts[i - 1].x) * t;
      dD += ` C ${cp1x.toFixed(1)},${demoPts[i - 1].y.toFixed(1)} ${cp2x.toFixed(1)},${demoPts[i].y.toFixed(1)} ${demoPts[i].x.toFixed(1)},${demoPts[i].y.toFixed(1)}`;
    }

    const midX = PAD.left + chartW / 2;
    const midY = PAD.top + chartH / 2;

    return (
      <View style={[styles.wrapper, { width, height }]}>
        <Svg width={width} height={height}>
          {/* Muted demo curve */}
          <Path
            d={dD}
            stroke="rgba(255,255,255,0.13)"
            strokeWidth={1.2}
            strokeDasharray="3 7"
            fill="none"
            strokeLinecap="round"
          />
          {demoPts.map((pt, i) => (
            <Circle key={i} cx={pt.x} cy={pt.y} r={1.6} fill="rgba(255,255,255,0.12)" />
          ))}
          {/* Label background pill */}
          <Rect
            x={midX - 64}
            y={midY - 10}
            width={128}
            height={20}
            rx={10}
            fill="rgba(28,29,32,0.7)"
          />
          <SvgText
            x={midX}
            y={midY + 4.5}
            fontSize={9}
            fontWeight="300"
            fill="rgba(255,255,255,0.30)"
            textAnchor="middle"
            letterSpacing={1.5}
          >
            NOT ENOUGH DATA YET
          </SvgText>
        </Svg>
      </View>
    );
  }

  // ── Real chart ─────────────────────────────────────────────────────────────
  const maxY = Math.max(...data.map(p => p.y), 0.001);
  const maxX = Math.max(...data.map(p => p.x), 1);

  const xAt = (x: number) => PAD.left + (x / maxX) * chartW;
  const yAt = (y: number) => PAD.top + (1 - y / maxY) * chartH;

  const pts = data.map(p => ({ x: xAt(p.x), y: yAt(p.y) }));

  let d = `M ${pts[0].x.toFixed(1)} ${pts[0].y.toFixed(1)}`;
  for (let i = 1; i < pts.length; i++) {
    const tension = 0.36;
    const cp1x = pts[i - 1].x + (pts[i].x - pts[i - 1].x) * tension;
    const cp1y = pts[i - 1].y;
    const cp2x = pts[i].x - (pts[i].x - pts[i - 1].x) * tension;
    const cp2y = pts[i].y;
    d += ` C ${cp1x.toFixed(1)},${cp1y.toFixed(1)} ${cp2x.toFixed(1)},${cp2y.toFixed(1)} ${pts[i].x.toFixed(1)},${pts[i].y.toFixed(1)}`;
  }

  const end = pts[pts.length - 1];
  const bubbleW = Math.max((totalLabel.length) * 6.8 + 14, 44);
  const bubbleH = 18;
  const bubbleX = end.x + 6;
  const bubbleY = end.y - bubbleH / 2;
  const showBubble = totalLabel.length > 0 && totalLabel !== '$0.00';

  return (
    <Svg width={width} height={height}>
      <Path
        d={d}
        stroke="rgba(255,255,255,0.32)"
        strokeWidth={1.2}
        strokeDasharray="3 7"
        fill="none"
        strokeLinecap="round"
      />

      {pts.map((pt, i) => (
        <Circle key={i} cx={pt.x} cy={pt.y} r={1.8} fill="rgba(255,255,255,0.38)" />
      ))}

      <Circle cx={end.x} cy={end.y} r={3.5} fill="#FFFFFF" opacity={0.9} />

      {showBubble && (
        <>
          <Rect
            x={bubbleX}
            y={bubbleY}
            width={bubbleW}
            height={bubbleH}
            rx={bubbleH / 2}
            fill="#FFFFFF"
          />
          <SvgText
            x={bubbleX + bubbleW / 2}
            y={bubbleY + bubbleH / 2 + 4.5}
            fontSize={9}
            fontWeight="300"
            fill="#1A1B1E"
            textAnchor="middle"
          >
            {totalLabel}
          </SvgText>
        </>
      )}
    </Svg>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'relative',
  },
  noDataLabel: {
    position: 'absolute',
    top: 0,
    left: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
