/**
 * Analytics utilities
 *
 * Calculate usage counts, cumulative cost, and graph data points
 * for a given PeptideSchedule.
 */

import type { PeptideSchedule, Weekday } from '../types/peptide';
import type { DoseEvent } from '../types/dose';
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

/** Total number of recorded doses for a schedule */
export function calculateUsageCount(
  schedule: PeptideSchedule,
  events: DoseEvent[],
): number {
  return events.filter(e => e.scheduleId === schedule.id).length;
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
 * Build cumulative cost data points from recorded DoseEvents.
 * One data point per actual recorded dose — shows real staircase of usage.
 */
export function generateCostHistory(
  schedule: PeptideSchedule,
  events: DoseEvent[],
  maxPoints = 60,
): CostDataPoint[] {
  const item = findCatalogItem(schedule.name);
  const doseMg = item ? dosageToMg(schedule.dosage, schedule.dosageUnit) : 0;
  const pricePerDose = doseMg * (item?.pricePerMg ?? 0);

  const scheduleEvents = events
    .filter(e => e.scheduleId === schedule.id)
    .sort((a, b) => a.takenAt.localeCompare(b.takenAt));

  if (scheduleEvents.length === 0) {
    return [{ x: 0, y: 0 }, { x: 1, y: 0 }];
  }

  const startMs = new Date(schedule.createdAt).getTime();
  const all: CostDataPoint[] = [{ x: 0, y: 0 }];
  let cumCost = 0;

  for (const event of scheduleEvents) {
    cumCost += pricePerDose;
    const dayOffset = Math.round(
      (new Date(event.takenAt).getTime() - startMs) / 86_400_000,
    );
    all.push({ x: Math.max(dayOffset, 1), y: parseFloat(cumCost.toFixed(2)) });
  }

  if (all.length <= maxPoints) return all;

  // Downsample — keep first + last always
  const result: CostDataPoint[] = [all[0]];
  const step = (all.length - 2) / (maxPoints - 2);
  for (let i = 1; i < maxPoints - 1; i++) {
    result.push(all[Math.round(i * step)]);
  }
  result.push(all[all.length - 1]);
  return result;
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
