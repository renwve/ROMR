import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';
import { StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import Animated, {
  type SharedValue,
  useAnimatedReaction,
  useSharedValue,
} from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';

import { SwipeRow } from '@/components/SwipeRow';
import { colors, fonts } from '@/constants/theme';
import { CARD_STEP, CARD_WIDTH, CardDots, cardStyles, SHADOW_ROOM, useCardStyles } from './cardRow';
import type { Highlight } from './content';

// Figma's "Image Card w/Gradient" placeholder colour, for highlights that don't
// have a photo yet (not a Figma variable).
const PLACEHOLDER_COLOR = '#0069E2';
// From the bottom of Plan Nav to the top of the cards (Figma shows 24; 40 asked
// for in review).
const CARDS_TOP = 40;

// Figma "Explore/Home - Highlights": the Highlights tab of a Daily Rec page. A
// row of cards to swipe through (see cardRow.tsx), each showing its rating,
// and under the row the selected highlight's name and description.
export function Highlights({ highlights }: { highlights: Highlight[] }) {
  const { width } = useWindowDimensions();
  // How far the row is swiped along; the cards and dots follow it.
  const scrollX = useSharedValue(0);
  const [selected, setSelected] = useState(0);

  // The name and description switch to a card once it's the nearest to centre.
  useAnimatedReaction(
    () => Math.min(highlights.length - 1, Math.max(0, Math.round(scrollX.get() / CARD_STEP))),
    (index, before) => {
      if (index !== before) scheduleOnRN(setSelected, index);
    },
  );

  const highlight = highlights[selected];

  return (
    <View>
      <View style={styles.row}>
        <SwipeRow
          step={CARD_STEP}
          offset={scrollX}
          oneAtATime
          contentContainerStyle={[
            cardStyles.cards,
            // Centres the selected card, the first and last included.
            { paddingHorizontal: (width - CARD_WIDTH) / 2 },
          ]}>
          {highlights.map((item, index) => (
            <HighlightCard key={item.name} index={index} highlight={item} scrollX={scrollX} />
          ))}
        </SwipeRow>
        <CardDots
          count={highlights.length}
          scrollX={scrollX}
          color={colors.blue100}
          selectedColor={colors.blue900}
        />
      </View>
      <View style={styles.about}>
        <Text style={styles.name}>{highlight.name}</Text>
        <Text style={styles.description}>{highlight.description}</Text>
      </View>
    </View>
  );
}

function HighlightCard({
  index,
  highlight,
  scrollX,
}: {
  index: number;
  highlight: Highlight;
  scrollX: SharedValue<number>;
}) {
  const animated = useCardStyles(index, scrollX);
  // A card with a photo has no colour behind it, so none shows round its edges
  // (the shadow layer stays white, the page's colour, to cast its shadow).
  const background = highlight.image ? undefined : PLACEHOLDER_COLOR;

  return (
    <Animated.View style={[cardStyles.card, animated.card]}>
      <Animated.View
        style={[
          cardStyles.cardShadow,
          { backgroundColor: background ?? colors.white100 },
          animated.shadow,
        ]}
      />
      <View
        accessible
        accessibilityLabel={`${highlight.name}, rated ${highlight.rating} from ${highlight.reviews} reviews`}
        style={[cardStyles.cardFace, { backgroundColor: background }]}>
        {highlight.image ? (
          // The photo already has Figma's darkening gradient baked in.
          <Image source={highlight.image} style={StyleSheet.absoluteFill} contentFit="cover" />
        ) : (
          // Figma's 50% white → 50% dark800 multiply over the card colour.
          <LinearGradient
            colors={['rgba(0, 0, 0, 0)', 'rgba(0, 0, 0, 0.45)']}
            style={StyleSheet.absoluteFill}
          />
        )}
        <Animated.View style={[styles.rating, animated.details]}>
          <Image source={require('@/assets/icons/star-rating.svg')} style={styles.star} />
          <Text style={styles.ratingText}>
            {highlight.rating} ({highlight.reviews})
          </Text>
        </Animated.View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  // The cards sit CARDS_TOP under Plan Nav: the shadow room the row already
  // leaves, plus the rest.
  row: {
    paddingTop: CARDS_TOP - SHADOW_ROOM,
    paddingBottom: 16,
  },
  rating: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 4,
  },
  star: {
    width: 16,
    height: 16,
  },
  ratingText: {
    fontFamily: fonts.medium,
    fontSize: 14,
    lineHeight: 18,
    letterSpacing: -0.7,
    color: colors.white100,
  },
  about: {
    gap: 16,
    padding: 16,
  },
  name: {
    fontFamily: fonts.semiBold,
    fontSize: 20,
    lineHeight: 25,
    letterSpacing: -1,
    color: colors.dark800,
  },
  description: {
    fontFamily: fonts.regular,
    fontSize: 16,
    lineHeight: 20,
    letterSpacing: -0.8,
    color: colors.gray700,
  },
});
