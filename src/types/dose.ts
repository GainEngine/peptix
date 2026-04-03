/**
 * DoseEvent — tallennettu tieto siitä että käyttäjä on ottanut annoksen.
 * Tallennetaan automaattisesti kun aikataulutettu aika koittaa.
 */
export interface DoseEvent {
  id: string;
  scheduleId: string;
  /** ISO date-only string: "2026-01-15" */
  takenAt: string;
}
