/**
 * UNIX App — Shadow / Elevation System
 *
 * Minimal shadow usage — the design relies on dark depth
 * rather than heavy drop shadows. Shadows are used only for
 * floating elements and modals.
 */

import { Platform } from 'react-native';

const shadow = (
  offsetY: number,
  blur: number,
  opacity: number,
  spread = 0,
) =>
  Platform.select({
    ios: {
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: offsetY },
      shadowOpacity: opacity,
      shadowRadius: blur / 2,
    },
    android: {
      elevation: Math.round(offsetY + blur / 4),
    },
    default: {},
  });

export const shadows = {
  /** No shadow */
  none: {},
  /** Subtle card lift */
  sm: shadow(2, 8, 0.25),
  /** Standard card */
  md: shadow(4, 16, 0.35),
  /** Modal / sheet */
  lg: shadow(8, 32, 0.45),
  /** Full overlay */
  xl: shadow(16, 64, 0.6),
} as const;
