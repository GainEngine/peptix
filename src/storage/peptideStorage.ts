import AsyncStorage from '@react-native-async-storage/async-storage';
import type { PeptideSchedule } from '../types/peptide';

const STORAGE_KEY = '@peptix:schedules';

export async function loadSchedules(): Promise<PeptideSchedule[]> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as PeptideSchedule[]) : [];
  } catch {
    return [];
  }
}

export async function saveSchedules(schedules: PeptideSchedule[]): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(schedules));
}
