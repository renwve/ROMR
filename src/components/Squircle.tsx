import FastSquircleView, { type FastSquircleViewProps } from 'react-native-fast-squircle';
import Animated from 'react-native-reanimated';

// Figma's corner smoothing, as a fraction (60% in the designs).
export const CORNER_SMOOTHING = 0.6;

// A View whose rounded corners are smoothed like Figma's (a squircle), drawn
// natively. Takes `borderRadius` like any View. (Native code: needs the dev
// build, not Expo Go.)
export function Squircle(props: FastSquircleViewProps) {
  return <FastSquircleView cornerSmoothing={CORNER_SMOOTHING} {...props} />;
}

// For styles driven by Reanimated.
export const AnimatedSquircle = Animated.createAnimatedComponent(Squircle);
