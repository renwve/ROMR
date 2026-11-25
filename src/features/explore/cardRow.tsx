import { StyleSheet, View } from 'react-native';
import Animated, {
  Extrapolation,
  interpolate,
  interpolateColor,
  type SharedValue,
  useAnimatedStyle,
} from 'react-native-reanimated';

import { shadows } from '@/constants/theme';

// The swipeable rows of 300 × 400 cards: "Our Daily Recs" (Figma "Explore/Home
// - Example Cards") and a rec's Highlights (Figma "Explore/Home - Highlights").
// The centred card is selected: full size, with a shadow and its details shown;
// the rest are smaller, flat and bare.

export const CARD_WIDTH = 300;
export const CARD_HEIGHT = 400;
export const CARD_GAP = 12;
export const CARD_RADIUS = 24;
// Scrolling one card along moves this far, so a card always settles centred.
export const CARD_STEP = CARD_WIDTH + CARD_GAP;
// Room above and below the cards for the selected card's shadow.
export const SHADOW_ROOM = 24;
// Cards other than the selected one sit at this size (285 × 380 in Figma).
const IDLE_SCALE = 0.95;
// How much narrower an idle card is, so the gaps between idle cards stay CARD_GAP.
const IDLE_SHRINK = CARD_WIDTH * (1 - IDLE_SCALE);
// The card counter's dots, and the selected card's pill.
const DOT = 8;
const DOT_SELECTED_WIDTH = 16;

// The animated styles for card `index` of a row swiped `scrollX` along.
export function useCardStyles(index: number, scrollX: SharedValue<number>) {
  // How many cards this one is from the selected spot: 0 when selected,
  // fractional mid-swipe, negative once swiped past.
  const card = useAnimatedStyle(() => {
    const offset = index - scrollX.get() / CARD_STEP;
    const distance = Math.abs(offset);
    const scale = interpolate(distance, [0, 1], [1, IDLE_SCALE], Extrapolation.CLAMP);
    // Scaling about the centre leaves a gap on each side; pull the card in
    // toward the selected one, and pull cards further out in by every idle
    // card between, so the visible gaps stay CARD_GAP.
    const pull = (CARD_WIDTH * (1 - scale)) / 2 + IDLE_SHRINK * Math.max(0, distance - 1);
    return { transform: [{ translateX: offset > 0 ? -pull : pull }, { scale }] };
  });

  const shadow = useAnimatedStyle(() => ({
    opacity: interpolate(
      Math.abs(index - scrollX.get() / CARD_STEP),
      [0, 1],
      [1, 0],
      Extrapolation.CLAMP,
    ),
  }));

  // The details fade out within half a swipe, and back in as a card arrives.
  const details = useAnimatedStyle(() => ({
    opacity: interpolate(
      Math.abs(index - scrollX.get() / CARD_STEP),
      [0, 0.5],
      [1, 0],
      Extrapolation.CLAMP,
    ),
  }));

  return { card, shadow, details };
}

// The card counter (Figma "Frame 171"): the selected card's dot stretches into
// a pill, and the pill passes between dots as you swipe.
export function CardDots({
  count,
  scrollX,
  color,
  selectedColor,
}: {
  count: number;
  scrollX: SharedValue<number>;
  color: string;
  selectedColor: string;
}) {
  return (
    <View style={styles.dots}>
      {Array.from({ length: count }, (_, index) => (
        <CardDot
          key={index}
          index={index}
          scrollX={scrollX}
          color={color}
          selectedColor={selectedColor}
        />
      ))}
    </View>
  );
}

function CardDot({
  index,
  scrollX,
  color,
  selectedColor,
}: {
  index: number;
  scrollX: SharedValue<number>;
  color: string;
  selectedColor: string;
}) {
  const dotStyle = useAnimatedStyle(() => {
    const selected = interpolate(
      Math.abs(index - scrollX.get() / CARD_STEP),
      [0, 1],
      [1, 0],
      Extrapolation.CLAMP,
    );
    return {
      width: DOT + (DOT_SELECTED_WIDTH - DOT) * selected,
      backgroundColor: interpolateColor(selected, [0, 1], [color, selectedColor]),
    };
  });
  return <Animated.View style={[styles.dot, dotStyle]} />;
}

export const cardStyles = StyleSheet.create({
  // The row's cards, with room for the selected card's shadow.
  cards: {
    gap: CARD_GAP,
    paddingVertical: SHADOW_ROOM,
  },
  card: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
  },
  cardShadow: {
    position: 'absolute',
    inset: 0,
    borderRadius: CARD_RADIUS,
    boxShadow: shadows.mediumSoft,
  },
  cardFace: {
    flex: 1,
    borderRadius: CARD_RADIUS,
    overflow: 'hidden',
    justifyContent: 'flex-end',
    padding: 12,
  },
});

const styles = StyleSheet.create({
  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 4,
    // 16pt under the cards, inside the room left for their shadow.
    marginTop: 16 - SHADOW_ROOM,
  },
  dot: {
    height: DOT,
    borderRadius: DOT / 2,
  },
});
