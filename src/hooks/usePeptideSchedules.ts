import { useState, useEffect, useCallback } from 'react';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';
import type { PeptideSchedule } from '../types/peptide';
import { loadSchedules, saveSchedules } from '../storage/peptideStorage';
import { scheduleForPeptide, cancelForPeptide } from '../notifications/peptideNotifications';

interface NewScheduleInput {
  name: string;
  dosage: number;
  dosageUnit: PeptideSchedule['dosageUnit'];
  days: PeptideSchedule['days'];
  hour: number;
  minute: number;
}

export function usePeptideSchedules() {
  const [schedules, setSchedules] = useState<PeptideSchedule[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSchedules().then(data => {
      setSchedules(data);
      setLoading(false);
    });
  }, []);

  const addSchedule = useCallback(async (input: NewScheduleInput) => {
    const schedule: PeptideSchedule = {
      ...input,
      id: uuidv4(),
      notificationIds: [],
      createdAt: new Date().toISOString(),
    };

    const notificationIds = await scheduleForPeptide(schedule);
    const withIds = { ...schedule, notificationIds };

    setSchedules(prev => {
      const next = [...prev, withIds];
      saveSchedules(next);
      return next;
    });
  }, []);

  const deleteSchedule = useCallback(async (id: string) => {
    setSchedules(prev => {
      const target = prev.find(s => s.id === id);
      if (target) cancelForPeptide(target.notificationIds);
      const next = prev.filter(s => s.id !== id);
      saveSchedules(next);
      return next;
    });
  }, []);

  return { schedules, loading, addSchedule, deleteSchedule };
}
