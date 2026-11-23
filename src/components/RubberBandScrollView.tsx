import type { ReactNode } from 'react';
import { Platform, type ScrollViewProps } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  Easing,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

import { rubberBand, SETTLE } from '@/constants/motion';
import { useDirectionLock } from '@/hooks/useDirectionLock';

// Fling bounce: a scroll that coasts into an end slower than this (points per
// second) just stops there; faster ones bounce, as if moving at most
// BOUNCE_MAX_SPEED. EDGE is how close to the end counts as hitting it.
const BOUNCE_MIN_SPEED = 100;
const BOUNCE_MAX_SPEED = 4000;
const EDGE = 2;
// How far past the end a bounce carries, per point per second of speed: about
// 65pt for a quick 2500pt/s fling, 100pt at BOUNCE_MAX_SPEED.
const BOUNCE_DISTANCE = 0.025;

// The time a scroll event arrives, in milliseconds (read on the UI thread).
function timeNow() {
  'worklet';
  return Date.now();
}

// A vertical ScrollView that rubber-bands at its ends, the way iOS's do:
//   - dragged past the bottom, it gives with growing resistance and springs
//     back when let go;
//   - flung fast into the top or bottom, it carries on a little past the end
//     and springs back.
// iOS scroll views already do both; on Android they're added here, in place of
// Android's own stretch effect. The drag only takes up-and-down drags (see
// useDirectionLock), so it never competes with a sideways SwipeRow.
export function RubberBandScrollView({
  children,
  ...props
}: Omit<ScrollViewProps, 'horizontal' | 'onScroll' | 'onLayout' | 'onContentSizeChange'> & {
  children: ReactNode;
}) {
  const custom = Platform.OS === 'android';
  const scrollY = useSharedValue(0);
  const viewHeight = useSharedValue(0);
  const contentHeight = useSharedValue(0);
  const startScroll = useSharedValue(0);
  const overscroll = useSharedValue(0);

  // For the fling bounce: how fast the page was last moving, whether a finger is
  // on it, and whether it has already bounced at the end it's at.
  const lastTime = useSharedValue(0);
  const speed = useSharedValue(0);
  const dragging = useSharedValue(false);
  const bounced = useSharedValue(false);

  const onScroll = useAnimatedScrollHandler({
    onScroll: (event) => {
      const y = event.contentOffset.y;
      const now = timeNow();
      const elapsed = now - lastTime.get();
      const moved = y - scrollY.get();
      // The frame that hits an end is cut short, so keep the faster of this
      // frame's speed and the last one's.
      const frameSpeed = elapsed > 0 && elapsed < 100 ? (moved / elapsed) * 1000 : 0;
      const flingSpeed =
        Math.sign(frameSpeed) === Math.sign(speed.get()) && Math.abs(speed.get()) > Math.abs(frameSpeed)
          ? speed.get()
          : frameSpeed;
      scrollY.set(y);
      lastTime.set(now);
      speed.set(frameSpeed);

      if (!custom) return;
      const maxScroll = Math.max(0, contentHeight.get() - viewHeight.get());
      const atTop = y <= EDGE;
      const atBottom = y >= maxScroll - EDGE;
      // Away from both ends again: ready to bounce next time.
      if (!atTop && !atBottom) bounced.set(false);
      // Only a scroll coasting on its own bounces; a finger holding it doesn't.
      if (dragging.get() || bounced.get()) return;
      const hitTop = atTop && flingSpeed < 0;
      const hitBottom = atBottom && flingSpeed > 0;
      if ((hitTop || hitBottom) && Math.abs(flingSpeed) >= BOUNCE_MIN_SPEED) {
        bounced.set(true);
        // Carry on past the end, slowing from the scroll's own speed to a stop,
        // then spring back.
        const bounceSpeed = Math.min(Math.abs(flingSpeed), BOUNCE_MAX_SPEED);
        const distance = bounceSpeed * BOUNCE_DISTANCE;
        overscroll.set(
          withSequence(
            withTiming(Math.sign(flingSpeed) * distance, {
              duration: ((2 * distance) / bounceSpeed) * 1000,
              easing: Easing.out(Easing.quad),
            }),
            withSpring(0, SETTLE),
          ),
        );
      }
    },
    onBeginDrag: () => {
      dragging.set(true);
    },
    onEndDrag: () => {
      dragging.set(false);
    },
  });

  // The ScrollView's own scrolling, which the pull below runs alongside.
  const native = Gesture.Native();
  const pull = useDirectionLock('vertical')
    .enabled(custom)
    .simultaneousWithExternalGesture(native)
    .onStart(() => {
      'worklet';
      startScroll.set(scrollY.get());
    })
    .onUpdate((event) => {
      'worklet';
      const maxScroll = Math.max(0, contentHeight.get() - viewHeight.get());
      // How far the finger has gone up past where the content runs out.
      const beyond = -event.translationY - (maxScroll - startScroll.get());
      overscroll.set(beyond > 0 ? rubberBand(beyond, viewHeight.get()) : 0);
    })
    .onFinalize(() => {
      'worklet';
      overscroll.set(withSpring(0, SETTLE));
    });

  const contentStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: -overscroll.get() }],
  }));

  return (
    <GestureDetector gesture={pull}>
      <GestureDetector gesture={native}>
        <Animated.ScrollView
          {...props}
          overScrollMode={custom ? 'never' : props.overScrollMode}
          onScroll={onScroll}
          scrollEventThrottle={16}
          onLayout={(event) => viewHeight.set(event.nativeEvent.layout.height)}
          onContentSizeChange={(_, height) => contentHeight.set(height)}>
          <Animated.View style={contentStyle}>{children}</Animated.View>
        </Animated.ScrollView>
      </GestureDetector>
    </GestureDetector>
  );
}
