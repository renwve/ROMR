import { useEffect } from 'react';
import { StyleSheet, View, type ViewStyle } from 'react-native';
import Animated, {
  Easing,
  interpolateColor,
  type SharedValue,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

import { colors } from '@/constants/theme';

// Each block pulses from white200 to gray100 and back, this long each way,
// until the page it stands in for is ready.
const PULSE_MS = 500;

const SIDE = 16;
const REC_WIDTH = 300;
const REC_HEIGHT = 400;
const REC_GAP = 12;
const IDLE_SCALE = 0.95;

// Figma "Explore/Home - Loading Skeleton": the outline of an Explore page,
// shown while a category's page is still being built.
export function ExploreSkeleton() {
  const pulse = useSharedValue(0);

  useEffect(() => {
    pulse.set(
      withRepeat(withTiming(1, { duration: PULSE_MS, easing: Easing.inOut(Easing.quad) }), -1, true),
    );
  }, [pulse]);

  return (
    <View style={styles.page} accessibilityLabel="Loading" accessible>
      {/* Our Daily Recs */}
      <View style={styles.recs}>
        <Block pulse={pulse} style={styles.recsTitle} />
        <View style={styles.recsCards}>
          <View style={styles.recRow}>
            <Block pulse={pulse} style={styles.recCard} />
            <Block pulse={pulse} style={styles.recCardNext} />
          </View>
          <View style={styles.dots}>
            <Block pulse={pulse} style={styles.dotSelected} />
            {[1, 2, 3, 4].map((dot) => (
              <Block key={dot} pulse={pulse} style={styles.dot} />
            ))}
          </View>
        </View>
      </View>
      {/* A category row */}
      <View style={styles.category}>
        <View style={styles.categoryHeading}>
          <Block pulse={pulse} style={styles.categoryTitle} />
          <Block pulse={pulse} style={styles.refine} />
        </View>
        <View style={styles.categoryCards}>
          <Block pulse={pulse} style={styles.categoryCard} />
          <Block pulse={pulse} style={styles.categoryCard} />
        </View>
      </View>
    </View>
  );
}

function Block({ pulse, style }: { pulse: SharedValue<number>; style: ViewStyle }) {
  const pulseStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(pulse.get(), [0, 1], [colors.white200, colors.gray100]),
  }));
  return <Animated.View style={[style, pulseStyle]} />;
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    paddingBottom: 24,
  },
  recs: {
    gap: 24,
    paddingTop: 24,
    paddingBottom: 16,
    paddingHorizontal: SIDE,
  },
  recsTitle: {
    width: 200,
    height: 25,
    borderRadius: 100,
  },
  recsCards: {
    alignItems: 'center',
    gap: 16,
  },
  recRow: {
    width: REC_WIDTH,
    height: REC_HEIGHT,
  },
  recCard: {
    width: REC_WIDTH,
    height: REC_HEIGHT,
    borderRadius: 24,
  },
  // The next card peeking in at the right, at its idle size.
  recCardNext: {
    position: 'absolute',
    left: REC_WIDTH + REC_GAP,
    top: (REC_HEIGHT * (1 - IDLE_SCALE)) / 2,
    width: REC_WIDTH * IDLE_SCALE,
    height: REC_HEIGHT * IDLE_SCALE,
    borderRadius: 24 * IDLE_SCALE,
  },
  dots: {
    flexDirection: 'row',
    gap: 4,
  },
  dotSelected: {
    width: 16,
    height: 8,
    borderRadius: 4,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  category: {
    gap: 24,
    paddingTop: 24,
    paddingBottom: 16,
    paddingHorizontal: SIDE,
  },
  categoryHeading: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 24,
  },
  categoryTitle: {
    flex: 1,
    height: 42,
    borderRadius: 100,
  },
  refine: {
    width: 73,
    height: 42,
    borderRadius: 100,
  },
  categoryCards: {
    flexDirection: 'row',
    gap: 12,
  },
  categoryCard: {
    width: 240,
    height: 140,
    borderRadius: 16,
  },
});
