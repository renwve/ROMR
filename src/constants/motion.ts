import { Easing } from 'react-native-reanimated';

// How small a button's contents get while it's held down.
export const PRESS_SCALE = 0.95;

// Shrinking on touch is quick; coming back on release is a touch slower.
export const PRESS_IN = { duration: 100, easing: Easing.out(Easing.quad) };
export const PRESS_OUT = { duration: 150, easing: Easing.out(Easing.quad) };

// Selectors and sections that slide or grow between states (the nav bar's
// selector and input, Explore's category underline).
export const SLIDE = { duration: 300, easing: Easing.out(Easing.cubic) };
