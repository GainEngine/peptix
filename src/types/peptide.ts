export type DosageUnit = 'mg' | 'mcg' | 'units';

export type Weekday = 'Mo' | 'Tu' | 'We' | 'Th' | 'Fr' | 'Sa' | 'Su';

// Sunday=1 ... Saturday=7 (expo-notifications WeeklyTrigger)
export const WEEKDAY_TO_TRIGGER: Record<Weekday, number> = {
  Su: 1,
  Mo: 2,
  Tu: 3,
  We: 4,
  Th: 5,
  Fr: 6,
  Sa: 7,
};

export const ALL_WEEKDAYS: Weekday[] = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];

export interface PeptideSchedule {
  id: string;
  name: string;
  dosage: number;
  dosageUnit: DosageUnit;
  days: Weekday[];
  hour: number;
  minute: number;
  notificationIds: string[];
  createdAt: string;
}
