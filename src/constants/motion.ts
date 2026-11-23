import { Easing } from 'react-native-reanimated';

// How small a button's contents get while it's held down.
export const PRESS_SCALE = 0.95;

// Shrinking on touch is quick; coming back on release is a touch slower.
export const PRESS_IN = { duration: 100, easing: Easing.out(Easing.quad) };
export const PRESS_OUT = { duration: 150, easing: Easing.out(Easing.quad) };

// Selectors and sections that slide or grow between states (the nav bar's
// selector and input, Explore's category underline).
export const SLIDE = { duration: 300, easing: Easing.out(Easing.cubic) };

// How content settles back after being dragged or flicked: no bounce.
export const SETTLE = { dampingRatio: 1, duration: 450 };

// How stiff dragging past the end of a scrollable feels (iOS's own constant).
const RUBBER_BAND_RESISTANCE = 0.55;

// iOS rubber-band curve: the further past the end, the harder it pulls back,
// never quite reaching `size`.
export function rubberBand(distance: number, size: number) {
  'worklet';
  return (1 - 1 / ((distance * RUBBER_BAND_RESISTANCE) / size + 1)) * size;
}
