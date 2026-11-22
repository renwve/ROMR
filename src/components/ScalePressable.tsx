import type { ReactNode } from 'react';
import { Pressable, type PressableProps, type StyleProp, type ViewStyle } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

import { PRESS_IN, PRESS_OUT, PRESS_SCALE } from '@/constants/motion';

type ScalePressableProps = Omit<PressableProps, 'style' | 'children'> & {
  // Layout of the touch target; it doesn't scale, so neighbours never shift.
  style?: StyleProp<ViewStyle>;
  // Layout of the contents, which shrink to PRESS_SCALE while held.
  contentStyle?: StyleProp<ViewStyle>;
  children: ReactNode;
};

// A Pressable whose contents shrink slightly while it's held down.
export function ScalePressable({
  style,
  contentStyle,
  children,
  onPressIn,
  onPressOut,
  ...props
}: ScalePressableProps) {
  const scale = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  return (
    <Pressable
      {...props}
      style={style}
      onPressIn={(event) => {
        scale.set(withTiming(PRESS_SCALE, PRESS_IN));
        onPressIn?.(event);
      }}
      onPressOut={(event) => {
        scale.set(withTiming(1, PRESS_OUT));
        onPressOut?.(event);
      }}>
      <Animated.View style={[contentStyle, animatedStyle]}>{children}</Animated.View>
    </Pressable>
  );
}
