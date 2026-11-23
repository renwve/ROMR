import type { ReactNode } from 'react';
import { type StyleProp, StyleSheet, View, type ViewStyle } from 'react-native';
import { GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  cancelAnimation,
  type SharedValue,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

import { rubberBand, SETTLE } from '@/constants/motion';
import { useDirectionLock } from '@/hooks/useDirectionLock';

// How far ahead a flick carries before it picks a card to settle on (seconds
// of its release speed; about what a native "fast" scroll travels).
const FLICK_PROJECTION = 0.1;
// The fastest a one-card-at-a-time row starts settling (points per second).
const SNAP_MAX_SPEED = 1500;

// A row of cards the user swipes sideways, settling on a card each time. It
// uses a direction-locked swipe (see useDirectionLock) instead of a native
// horizontal scroll view, so a slightly slanted swipe isn't taken by the page's
// up-and-down scroll.
export function SwipeRow({
  step,
  offset,
  oneAtATime = false,
  contentContainerStyle,
  children,
}: {
  // The distance from one card to the next.
  step: number;
  // How far the row is swiped along, for anything that follows it.
  offset?: SharedValue<number>;
  // Every swipe moves exactly one card along, however fast it's flicked.
  oneAtATime?: boolean;
  contentContainerStyle?: StyleProp<ViewStyle>;
  children: ReactNode;
}) {
  const ownOffset = useSharedValue(0);
  const x = offset ?? ownOffset;
  const viewWidth = useSharedValue(0);
  const contentWidth = useSharedValue(0);
  const startX = useSharedValue(0);

  const swipe = useDirectionLock('horizontal')
    .onStart(() => {
      'worklet';
      cancelAnimation(x);
      startX.set(x.get());
    })
    .onUpdate((event) => {
      'worklet';
      const max = Math.max(0, contentWidth.get() - viewWidth.get());
      const raw = startX.get() - event.translationX;
      // Past either end, the row gives with growing resistance.
      if (raw < 0) x.set(-rubberBand(-raw, viewWidth.get()));
      else if (raw > max) x.set(max + rubberBand(raw - max, viewWidth.get()));
      else x.set(raw);
    })
    .onEnd((event) => {
      'worklet';
      const max = Math.max(0, contentWidth.get() - viewWidth.get());
      const projected = x.get() - event.velocityX * FLICK_PROJECTION;
      // Settle on the nearest card to where the flick would carry, or the end.
      let target = projected >= max - step / 2 ? max : Math.round(projected / step) * step;
      if (oneAtATime) {
        // No further than the card either side of the one the swipe began on.
        const from = Math.round(startX.get() / step) * step;
        target = Math.min(Math.max(target, from - step), from + step);
      }
      // A one-at-a-time row eases in at a capped speed so a hard flick can't
      // carry it past the next card before it settles.
      const velocity = oneAtATime
        ? Math.min(Math.max(-event.velocityX, -SNAP_MAX_SPEED), SNAP_MAX_SPEED)
        : -event.velocityX;
      x.set(withSpring(Math.min(Math.max(target, 0), max), { ...SETTLE, velocity }));
    });

  const rowStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: -x.get() }],
  }));

  return (
    <GestureDetector gesture={swipe}>
      <View style={styles.frame} onLayout={(event) => viewWidth.set(event.nativeEvent.layout.width)}>
        <Animated.View
          style={[styles.row, contentContainerStyle, rowStyle]}
          onLayout={(event) => contentWidth.set(event.nativeEvent.layout.width)}>
          {children}
        </Animated.View>
      </View>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  // A row parent lets the content take its full width instead of the screen's.
  frame: {
    flexDirection: 'row',
  },
  row: {
    flexDirection: 'row',
  },
});
