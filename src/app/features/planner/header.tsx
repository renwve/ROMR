import { createContext, useContext, type ReactNode } from 'react';
import { Easing, useSharedValue, type SharedValue } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// The trip header is a 300pt photo card inset 8pt on every side.
export const TRIP_HEIGHT = 300;
export const HEADER_INSET = 8;

export const HEADER_RESIZE = { duration: 500, easing: Easing.inOut(Easing.cubic) };

// Card heights for each screen. Everything below the status bar is fixed
// in Figma; the status bar's height comes from the device.
export function useHeaderHeights() {
  const { top } = useSafeAreaInsets();
  // The trip card's buttons sit 16pt in from its top edge, like its sides,
  // but never under the status bar (which overlaps the card's top by `top - inset`).
  const tripPaddingTop = Math.max(16, top - HEADER_INSET);
  return {
    tripPaddingTop,
    list: top + 8 + 15 + 24,
    trip: TRIP_HEIGHT,
    // "Trip Open - Collapsed": back row, 16pt gap, 20pt title (25pt line), 24pt bottom padding.
    tripCollapsed: tripPaddingTop + 44 + 16 + 25 + 24,
    continue: top + 8 + 15 + 32 + 44 + 16,
  };
}

// 0 = trip header fully open, 1 = collapsed. Written by the trip screen's scroll.
const CollapseContext = createContext<SharedValue<number> | null>(null);

export function HeaderCollapseProvider({ children }: { children: ReactNode }) {
  const collapse = useSharedValue(0);
  return <CollapseContext.Provider value={collapse}>{children}</CollapseContext.Provider>;
}

export function useHeaderCollapse() {
  const collapse = useContext(CollapseContext);
  if (!collapse) throw new Error('useHeaderCollapse must be used inside HeaderCollapseProvider');
  return collapse;
}
