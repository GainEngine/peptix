/**
 * Analytics utilities
 *
 * Calculate usage counts, cumulative cost, and graph data points
 * for a given PeptideSchedule.
 */

import type { PeptideSchedule, Weekday } from '../types/peptide';
import { findCatalogItem } from '../data/peptideCatalog';

// Maps Weekday abbreviation → JS Date.getDay() (0=Sun, 1=Mon, ...)
const WEEKDAY_TO_JS_DAY: Record<Weekday, number> = {
  Su: 0,
  Mo: 1,
  Tu: 2,
  We: 3,
  Th: 4,
  Fr: 5,
  Sa: 6,
};

function dosageToMg(dosage: number, unit: string): number {
  if (unit === 'mcg') return dosage / 1000;
  return dosage; // mg and units treated as mg
}

/** Returns true if the schedule fires on this JS Date (time must also have passed) */
function firedOn(schedule: PeptideSchedule, date: Date, now: Date): boolean {
  const dayIndex = date.getDay();
  const scheduledDays = schedule.days.map(d => WEEKDAY_TO_JS_DAY[d]);
  if (!scheduledDays.includes(dayIndex)) return false;

  const today = now.toDateString();
  const thisDay = date.toDateString();

  if (thisDay < today) return true;

  if (thisDay === today) {
    const schedMins = schedule.hour * 60 + schedule.minute;
    const nowMins = now.getHours() * 60 + now.getMinutes();
    return nowMins >= schedMins;
  }

  return false;
}

/** Total number of doses taken since schedule was created */
export function calculateUsageCount(schedule: PeptideSchedule): number {
  const start = new Date(schedule.createdAt);
  const now = new Date();
  let count = 0;

  const cursor = new Date(start);
  cursor.setHours(0, 0, 0, 0);

  while (cursor <= now) {
    if (firedOn(schedule, cursor, now)) count++;
    cursor.setDate(cursor.getDate() + 1);
  }

  return count;
}

/** Total cost in USD based on catalog pricing */
export function calculateTotalCost(
  schedule: PeptideSchedule,
  usageCount: number,
): number {
  const item = findCatalogItem(schedule.name);
  if (!item) return 0;
  const doseMg = dosageToMg(schedule.dosage, schedule.dosageUnit);
  return doseMg * item.pricePerMg * usageCount;
}

export interface CostDataPoint {
  /** Day offset from start (0, 1, 2, …) */
  x: number;
  /** Cumulative cost at this point */
  y: number;
}

/**
 * Build cumulative cost data points for the mini graph.
 * Returns at most MAX_POINTS samples evenly distributed over the schedule lifetime.
 */
export function generateCostHistory(
  schedule: PeptideSchedule,
  maxPoints = 14,
): CostDataPoint[] {
  const item = findCatalogItem(schedule.name);
  const doseMg = item ? dosageToMg(schedule.dosage, schedule.dosageUnit) : 0;
  const pricePerDose = doseMg * (item?.pricePerMg ?? 0);

  const start = new Date(schedule.createdAt);
  const now = new Date();

  const totalDays = Math.max(
    1,
    Math.ceil((now.getTime() - start.getTime()) / 86_400_000),
  );

  const sampleEvery = Math.max(1, Math.floor(totalDays / maxPoints));
  const points: CostDataPoint[] = [];
  let cumCost = 0;

  const cursor = new Date(start);
  cursor.setHours(0, 0, 0, 0);
  let dayOffset = 0;

  while (cursor <= now) {
    if (firedOn(schedule, cursor, now)) {
      cumCost += pricePerDose;
    }

    if (dayOffset % sampleEvery === 0 || cursor.toDateString() === now.toDateString()) {
      points.push({ x: dayOffset, y: parseFloat(cumCost.toFixed(2)) });
    }

    cursor.setDate(cursor.getDate() + 1);
    dayOffset++;
  }

  // Always include day-0 baseline and the current endpoint
  if (points.length === 0) {
    return [{ x: 0, y: 0 }, { x: 1, y: 0 }];
  }
  if (points[0].x !== 0) points.unshift({ x: 0, y: 0 });

  return points;
}

/** Human-readable start date string: "Jan 1, 2025" */
export function formatStartDate(isoString: string): string {
  return new Date(isoString).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

/** Days since schedule was created */
export function daysSinceStart(isoString: string): number {
  const ms = Date.now() - new Date(isoString).getTime();
  return Math.max(0, Math.floor(ms / 86_400_000));
}
