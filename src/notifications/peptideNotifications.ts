import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import type { PeptideSchedule, Weekday } from '../types/peptide';
import { WEEKDAY_TO_TRIGGER } from '../types/peptide';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export async function requestNotificationPermission(): Promise<boolean> {
  const { status: existing } = await Notifications.getPermissionsAsync();
  if (existing === 'granted') return true;
  const { status } = await Notifications.requestPermissionsAsync();
  return status === 'granted';
}

function formatDose(dosage: number, unit: string): string {
  return `${dosage} ${unit}`;
}

export async function scheduleForPeptide(
  schedule: PeptideSchedule,
): Promise<string[]> {
  const granted = await requestNotificationPermission();
  if (!granted) return [];

  const ids: string[] = [];

  for (const day of schedule.days) {
    const weekday = WEEKDAY_TO_TRIGGER[day];
    const id = await Notifications.scheduleNotificationAsync({
      content: {
        title: schedule.name,
        body: `Time for your ${formatDose(schedule.dosage, schedule.dosageUnit)} dose.`,
        data: { scheduleId: schedule.id },
      },
      trigger: Platform.OS === 'ios'
        ? { type: 'calendar', repeats: true, weekday, hour: schedule.hour, minute: schedule.minute } as unknown as Notifications.NotificationTriggerInput
        : { type: 'weekly', weekday, hour: schedule.hour, minute: schedule.minute } as unknown as Notifications.NotificationTriggerInput,
    });
    ids.push(id);
  }

  return ids;
}

export async function cancelForPeptide(notificationIds: string[]): Promise<void> {
  await Promise.all(notificationIds.map(id => Notifications.cancelScheduledNotificationAsync(id)));
}
