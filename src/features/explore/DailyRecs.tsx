import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import Animated, {
  Extrapolation,
  interpolate,
  interpolateColor,
  type SharedValue,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';

import { SaveButton } from '@/components/SaveButton';
import { SwipeRow } from '@/components/SwipeRow';
import { WhiteButton } from '@/components/WhiteButton';
import { colors, fonts, shadows } from '@/constants/theme';
import type { DailyRec } from './content';
import { useRefreshCountdown } from './useRefreshCountdown';

const SIDE = 16;
const CARD_WIDTH = 300;
const CARD_HEIGHT = 400;
const CARD_GAP = 12;
// Scrolling one card along moves this far, so a card always settles centred.
const CARD_STEP = CARD_WIDTH + CARD_GAP;
// Cards other than the selected one sit at this size (285 × 380 in Figma).
const IDLE_SCALE = 0.95;
// How much narrower an idle card is, so the gaps between idle cards stay CARD_GAP.
const IDLE_SHRINK = CARD_WIDTH * (1 - IDLE_SCALE);
// Room above and below the cards for the selected card's shadow.
const SHADOW_ROOM = 24;
// The card counter's dots, and the selected card's pill.
const DOT = 8;
const DOT_SELECTED_WIDTH = 16;

// Placeholder colours for recs that don't have a photo yet, one per card.
const CARD_COLORS = ['#0069E2', '#00A5E2', '#00E231', '#E2C000', '#E25E00'];

// Figma "Explore/Home - Example Cards": "Our Daily Recs", a row of cards the
// user swipes through. The centred card is selected: full size, with
// a shadow and its details shown; the rest are smaller, flat and bare.
export function DailyRecs({ recs }: { recs: DailyRec[] }) {
  const { width } = useWindowDimensions();
  const countdown = useRefreshCountdown();
  // How far the row is swiped along; the cards and dots follow it.
  const scrollX = useSharedValue(0);

  return (
    <View style={styles.section}>
      <View style={styles.heading}>
        <Text style={styles.title}>Our Daily Recs</Text>
        <Text style={styles.refresh}>Refresh in {countdown}</Text>
      </View>
      <SwipeRow
        step={CARD_STEP}
        offset={scrollX}
        oneAtATime
        contentContainerStyle={[
          styles.cards,
          // Centres the selected card, the first and last included.
          { paddingHorizontal: (width - CARD_WIDTH) / 2 },
        ]}>
        {recs.map((rec, index) => (
          <RecCard
            key={index}
            index={index}
            color={CARD_COLORS[index % CARD_COLORS.length]}
            rec={rec}
            scrollX={scrollX}
          />
        ))}
      </SwipeRow>
      <View style={styles.dots}>
        {recs.map((_, index) => (
          <CardDot key={index} index={index} scrollX={scrollX} />
        ))}
      </View>
    </View>
  );
}

// One dot of the card counter (Figma "Frame 171"): the selected card's dot
// stretches into a navy pill, and the pill passes between dots as you swipe.
function CardDot({ index, scrollX }: { index: number; scrollX: SharedValue<number> }) {
  const dotStyle = useAnimatedStyle(() => {
    const selected = interpolate(
      Math.abs(index - scrollX.value / CARD_STEP),
      [0, 1],
      [1, 0],
      Extrapolation.CLAMP,
    );
    return {
      width: DOT + (DOT_SELECTED_WIDTH - DOT) * selected,
      backgroundColor: interpolateColor(selected, [0, 1], [colors.blue100, colors.blue900]),
    };
  });
  return <Animated.View style={[styles.dot, dotStyle]} />;
}

function RecCard({
  index,
  color,
  rec,
  scrollX,
}: {
  index: number;
  color: string;
  rec: DailyRec;
  scrollX: SharedValue<number>;
}) {
  // How many cards this one is from the selected spot: 0 when selected,
  // fractional mid-swipe, negative once swiped past.
  const cardStyle = useAnimatedStyle(() => {
    const offset = index - scrollX.value / CARD_STEP;
    const distance = Math.abs(offset);
    const scale = interpolate(distance, [0, 1], [1, IDLE_SCALE], Extrapolation.CLAMP);
    // Scaling about the centre leaves a gap on each side; pull the card in
    // toward the selected one, and pull cards further out in by every idle
    // card between, so the visible gaps stay CARD_GAP.
    const pull = (CARD_WIDTH * (1 - scale)) / 2 + IDLE_SHRINK * Math.max(0, distance - 1);
    return { transform: [{ translateX: offset > 0 ? -pull : pull }, { scale }] };
  });

  const shadowStyle = useAnimatedStyle(() => ({
    opacity: interpolate(
      Math.abs(index - scrollX.value / CARD_STEP),
      [0, 1],
      [1, 0],
      Extrapolation.CLAMP,
    ),
  }));

  // The details fade out within half a swipe, and back in as a card arrives.
  const detailsStyle = useAnimatedStyle(() => ({
    opacity: interpolate(
      Math.abs(index - scrollX.value / CARD_STEP),
      [0, 0.5],
      [1, 0],
      Extrapolation.CLAMP,
    ),
  }));

  // A card with a photo has no colour behind it, so none shows round its edges
  // (the shadow layer stays white, the page's colour, to cast its shadow).
  const background = rec.image ? undefined : color;

  return (
    <Animated.View style={[styles.card, cardStyle]}>
      <Animated.View
        style={[styles.cardShadow, { backgroundColor: background ?? colors.white100 }, shadowStyle]}
      />
      {/* A rec with its own page opens it when its card is tapped (Figma
          "Explore/Home - Daily Recs"); its buttons still do their own thing. */}
      <Pressable
        disabled={!rec.page}
        accessibilityLabel={rec.title}
        onPress={() => {
          if (rec.page) router.push({ pathname: '/daily-rec', params: { id: rec.page.id } });
        }}
        style={[styles.cardFace, { backgroundColor: background }]}>
        {rec.image ? (
          // The photo already has Figma's darkening gradient baked in.
          <Image source={rec.image} style={StyleSheet.absoluteFill} contentFit="cover" />
        ) : (
          // Figma's 50% white → 50% dark800 multiply over the card colour.
          <LinearGradient
            colors={['rgba(0, 0, 0, 0)', 'rgba(0, 0, 0, 0.45)']}
            style={StyleSheet.absoluteFill}
          />
        )}
        <Animated.View style={[styles.details, detailsStyle]}>
          {/* The title and description span the card's width. */}
          <View>
            <Text style={styles.place}>{rec.title}</Text>
            <Text style={styles.placeDetail}>{rec.detail}</Text>
          </View>
          <View style={styles.actions}>
            <WhiteButton
              shape="rounded"
              icon={require('@/assets/icons/star-four.svg')}
              label={rec.action}
              style={styles.planButton}
            />
            <SaveButton />
          </View>
        </Animated.View>
      </Pressable>
    </Animated.View>
  );
}

const CARD_RADIUS = 24;

const styles = StyleSheet.create({
  section: {
    paddingTop: 24,
    paddingBottom: 16,
  },
  heading: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SIDE,
  },
  title: {
    fontFamily: fonts.bold,
    fontSize: 20,
    lineHeight: 25,
    letterSpacing: -1,
    color: colors.dark800,
  },
  refresh: {
    fontFamily: fonts.medium,
    fontSize: 12,
    lineHeight: 15,
    letterSpacing: -0.6,
    color: colors.gray200,
  },
  cards: {
    gap: CARD_GAP,
    paddingVertical: SHADOW_ROOM,
  },
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
  details: {
    gap: 10,
  },
  place: {
    fontFamily: fonts.bold,
    fontSize: 32,
    lineHeight: 40,
    letterSpacing: -1.6,
    color: colors.white100,
  },
  placeDetail: {
    fontFamily: fonts.regular,
    fontSize: 16,
    lineHeight: 20,
    letterSpacing: -0.8,
    color: colors.white200,
  },
  actions: {
    flexDirection: 'row',
    gap: 10,
  },
  planButton: {
    flex: 1,
  },
});
