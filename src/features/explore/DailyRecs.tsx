import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import Animated, { type SharedValue, useSharedValue } from 'react-native-reanimated';

import { SaveButton } from '@/components/SaveButton';
import { SwipeRow } from '@/components/SwipeRow';
import { WhiteButton } from '@/components/WhiteButton';
import { colors, fonts } from '@/constants/theme';
import { CARD_STEP, CARD_WIDTH, CardDots, cardStyles, useCardStyles } from './cardRow';
import type { DailyRec } from './content';
import { useRefreshCountdown } from './useRefreshCountdown';

const SIDE = 16;

// Placeholder colours for recs that don't have a photo yet, one per card.
const CARD_COLORS = ['#0069E2', '#00A5E2', '#00E231', '#E2C000', '#E25E00'];

// Figma "Explore/Home - Example Cards": "Our Daily Recs", a row of cards the
// user swipes through (see cardRow.tsx).
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
          cardStyles.cards,
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
      <CardDots
        count={recs.length}
        scrollX={scrollX}
        color={colors.blue100}
        selectedColor={colors.blue900}
      />
    </View>
  );
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
  const animated = useCardStyles(index, scrollX);

  // A card with a photo has no colour behind it, so none shows round its edges
  // (the shadow layer stays white, the page's colour, to cast its shadow).
  const background = rec.image ? undefined : color;

  return (
    <Animated.View style={[cardStyles.card, animated.card]}>
      <Animated.View
        style={[
          cardStyles.cardShadow,
          { backgroundColor: background ?? colors.white100 },
          animated.shadow,
        ]}
      />
      {/* A rec with its own page opens it when its card is tapped (Figma
          "Explore/Home - Daily Recs"); its buttons still do their own thing. */}
      <Pressable
        disabled={!rec.page}
        accessibilityLabel={rec.title}
        onPress={() => {
          if (rec.page) router.push({ pathname: '/daily-rec', params: { id: rec.page.id } });
        }}
        style={[cardStyles.cardFace, { backgroundColor: background }]}>
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
        <Animated.View style={[styles.details, animated.details]}>
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
            <SaveButton saveId={rec.page?.id} />
          </View>
        </Animated.View>
      </Pressable>
    </Animated.View>
  );
}

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
