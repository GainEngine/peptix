/**
 * Demo data — ladataan screenshotteja varten.
 * Poista kaikki data sen jälkeen profiilisivulta.
 */

import type { PeptideSchedule } from '../types/peptide';

function daysAgo(n: number): string {
  return new Date(Date.now() - n * 24 * 60 * 60 * 1000).toISOString();
}

export const MOCK_SCHEDULES: PeptideSchedule[] = [
  {
    id: 'demo-1',
    name: 'BPC-157',
    dosage: 500,
    dosageUnit: 'mcg',
    days: ['Mo', 'We', 'Fr'],   // TÄNÄÄN (Fr)
    hour: 8,
    minute: 0,
    notificationIds: [],
    createdAt: daysAgo(91),
  },
  {
    id: 'demo-2',
    name: 'Retatrutide',
    dosage: 2,
    dosageUnit: 'mg',
    days: ['Tu', 'Fr'],          // TÄNÄÄN (Fr)
    hour: 9,
    minute: 0,
    notificationIds: [],
    createdAt: daysAgo(42),
  },
  {
    id: 'demo-3',
    name: 'TB-500',
    dosage: 2000,
    dosageUnit: 'mcg',
    days: ['Mo', 'Th'],
    hour: 8,
    minute: 30,
    notificationIds: [],
    createdAt: daysAgo(77),
  },
  {
    id: 'demo-4',
    name: 'Ipamorelin',
    dosage: 200,
    dosageUnit: 'mcg',
    days: ['Mo', 'Tu', 'Th', 'Sa'],
    hour: 22,
    minute: 0,
    notificationIds: [],
    createdAt: daysAgo(63),
  },
  {
    id: 'demo-5',
    name: 'Semaglutide',
    dosage: 0.5,
    dosageUnit: 'mg',
    days: ['Mo'],
    hour: 10,
    minute: 0,
    notificationIds: [],
    createdAt: daysAgo(49),
  },
];
