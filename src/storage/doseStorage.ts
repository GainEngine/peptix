import AsyncStorage from '@react-native-async-storage/async-storage';
import type { DoseEvent } from '../types/dose';

const DOSE_EVENTS_KEY = '@peptix:doseEvents';

export async function loadDoseEvents(): Promise<DoseEvent[]> {
  try {
    const raw = await AsyncStorage.getItem(DOSE_EVENTS_KEY);
    return raw ? (JSON.parse(raw) as DoseEvent[]) : [];
  } catch {
    return [];
  }
}

export async function saveDoseEvents(events: DoseEvent[]): Promise<void> {
  await AsyncStorage.setItem(DOSE_EVENTS_KEY, JSON.stringify(events));
}
