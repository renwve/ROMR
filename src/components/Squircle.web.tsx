import { View, type ViewProps } from 'react-native';
import Animated from 'react-native-reanimated';

export const CORNER_SMOOTHING = 0.6;

// The web has no native squircle, so it falls back to plain rounded corners.
export function Squircle({
  cornerSmoothing: _cornerSmoothing,
  ...props
}: ViewProps & { cornerSmoothing?: number }) {
  return <View {...props} />;
}

export const AnimatedSquircle = Animated.createAnimatedComponent(Squircle);
