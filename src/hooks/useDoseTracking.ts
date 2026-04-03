/**
 * useDoseTracking
 *
 * Kun appi avataan tai tulee eturintamaan, käydään läpi kaikki
 * aikataulut ja tallennetaan kaikki annostapahtumia jotka ovat
 * erääntynet mutta joita ei ole vielä tallennettu.
 *
 * Tulos: DoseEvent[] jota käytetään analytiikassa.
 */

import { useState, useEffect, useCallback } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import type { PeptideSchedule, Weekday } from '../types/peptide';
import type { DoseEvent } from '../types/dose';
import { loadDoseEvents, saveDoseEvents } from '../storage/doseStorage';

const WEEKDAY_TO_JS: Record<Weekday, number> = {
  Su: 0, Mo: 1, Tu: 2, We: 3, Th: 4, Fr: 5, Sa: 6,
};

/** Returns "YYYY-MM-DD" for a given Date */
function toDateKey(d: Date): string {
  return d.toISOString().slice(0, 10);
}

/** True if the schedule fired on `date` and time has passed */
function didFire(schedule: PeptideSchedule, date: Date, now: Date): boolean {
  const jsDays = schedule.days.map(d => WEEKDAY_TO_JS[d]);
  if (!jsDays.includes(date.getDay())) return false;

  const datKey = toDateKey(date);
  const nowKey = toDateKey(now);

  if (datKey < nowKey) return true;
  if (datKey === nowKey) {
    return now.getHours() * 60 + now.getMinutes() >= schedule.hour * 60 + schedule.minute;
  }
  return false;
}

async function recordNewEvents(
  schedules: PeptideSchedule[],
  existing: DoseEvent[],
): Promise<DoseEvent[]> {
  const existingSet = new Set(existing.map(e => `${e.scheduleId}:${e.takenAt}`));
  const toAdd: DoseEvent[] = [];
  const now = new Date();

  for (const schedule of schedules) {
    const cursor = new Date(schedule.createdAt);
    cursor.setHours(0, 0, 0, 0);

    while (cursor <= now) {
      if (didFire(schedule, cursor, now)) {
        const key = `${schedule.id}:${toDateKey(cursor)}`;
        if (!existingSet.has(key)) {
          toAdd.push({
            id: `${schedule.id}-${toDateKey(cursor)}`,
            scheduleId: schedule.id,
            takenAt: toDateKey(cursor),
          });
          existingSet.add(key);
        }
      }
      cursor.setDate(cursor.getDate() + 1);
    }
  }

  if (toAdd.length === 0) return existing;

  const next = [...existing, ...toAdd];
  await saveDoseEvents(next);
  return next;
}

export function useDoseTracking(schedules: PeptideSchedule[]) {
  const [events, setEvents] = useState<DoseEvent[]>([]);

  const sync = useCallback(async () => {
    if (schedules.length === 0) return;
    const existing = await loadDoseEvents();
    const updated = await recordNewEvents(schedules, existing);
    setEvents(updated);
  }, [schedules]);

  // Lataa ja synkaa kun schedules latautuu
  useEffect(() => {
    sync();
  }, [sync]);

  // Synkaa kun appi tulee eturintamaan
  useEffect(() => {
    const sub = AppState.addEventListener('change', (state: AppStateStatus) => {
      if (state === 'active') sync();
    });
    return () => sub.remove();
  }, [sync]);

  return events;
}
