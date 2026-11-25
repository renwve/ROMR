import { Image } from 'expo-image';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { ScalePressable } from '@/components/ScalePressable';
import { TextReveal } from '@/components/TextReveal';
import { colors, fonts } from '@/constants/theme';
import type { RecReviews, Review } from './content';
import { RomieCard, ROMIE_REVEAL_MS, useRomieGlow } from './RomieCard';
import { RomieHeading } from './RomieHeading';
import { REVIEW_SUMMARY } from './romieHeadings';

const SUMMARY_LINE_HEIGHT = 18;

// The word under the score (Figma shows "Excellent" for 4.9).
function ratingWord(rating: number) {
  if (rating >= 4.5) return 'Excellent';
  if (rating >= 4) return 'Very good';
  if (rating >= 3) return 'Good';
  return 'Mixed';
}

// Figma "Explore/Home - Reviews": the Reviews tab of a Daily Rec page. The
// overall rating, then Romie's summary of the reviews. The summary card works
// like the Roverview: it's mounted when the tab is opened, so its glow plays and
// its text reveals each time the user switches to Reviews.
export function Reviews({ reviews }: { reviews: RecReviews }) {
  const romie = useRomieGlow(true);

  return (
    <View style={styles.content}>
      <View style={styles.rating}>
        {/* The row fills the card: the score keeps its full width on one line
            (Android measured "4.8/5" short and wrapped it after the slash), and
            the word and count take the rest. */}
        <View style={styles.score}>
          <Image source={require('@/assets/icons/star-rating-40.svg')} style={styles.star} />
          <Text style={styles.scoreText} numberOfLines={1}>
            {reviews.rating}/5
          </Text>
        </View>
        <View style={styles.ratingText}>
          <Text style={styles.ratingWord}>{ratingWord(Number(reviews.rating))}</Text>
          <Text style={styles.count}>{reviews.count} Reviews</Text>
        </View>
      </View>
      <RomieCard romie={romie}>
        <View style={styles.summary}>
          <View style={styles.summaryHeading}>
            <RomieHeading heading={REVIEW_SUMMARY} turn={romie.turn} glow={romie.glow} />
            <Text style={styles.source}>From real reviews, powered by Romie</Text>
          </View>
          <TextReveal
            text={reviews.summary}
            style={styles.summaryText}
            lineHeight={SUMMARY_LINE_HEIGHT}
            background={colors.white100}
            play
            duration={ROMIE_REVEAL_MS}
          />
        </View>
      </RomieCard>
      <View style={styles.reviews}>
        {reviews.items.map((review) => (
          <ReviewPane key={review.username} review={review} />
        ))}
      </View>
    </View>
  );
}

const STARS = [1, 2, 3, 4, 5];

// Figma component set "Review pane": the reviewer (a placeholder avatar, their
// name and how many reviews they've written), a "more" button that doesn't do
// anything yet, five stars and when it was written, up to 6 lines of text, and
// "This was helpful". Tapping its icon or text toggles between "Default" (gray
// outline) and "Liked review" (filled navy), shrinking while held like the
// app's other buttons.
function ReviewPane({ review }: { review: Review }) {
  const [liked, setLiked] = useState(false);

  return (
    <View style={styles.pane}>
      <View style={styles.reviewer}>
        <View style={styles.reviewerInfo}>
          <View style={styles.avatar} />
          <View style={styles.reviewerText}>
            <Text style={styles.username} numberOfLines={1}>
              {review.username}
            </Text>
            <Text style={styles.reviewerCount}>{review.reviewerCount} reviews</Text>
          </View>
        </View>
        <Pressable accessibilityRole="button" accessibilityLabel="More" hitSlop={10}>
          <Image source={require('@/assets/icons/dots-three.svg')} style={styles.more} />
        </Pressable>
      </View>
      <View style={styles.stars} accessible accessibilityLabel={`5 stars, ${review.when}`}>
        <View style={styles.starRow}>
          {STARS.map((star) => (
            <Image
              key={star}
              source={require('@/assets/icons/star-rating.svg')}
              style={styles.smallStar}
            />
          ))}
        </View>
        <Text style={styles.when}>{review.when}</Text>
      </View>
      <Text style={styles.reviewText} numberOfLines={6}>
        {review.text}
      </Text>
      <ScalePressable
        accessibilityRole="button"
        accessibilityState={{ selected: liked }}
        hitSlop={8}
        onPress={() => setLiked(!liked)}
        style={styles.helpfulTarget}
        contentStyle={styles.helpful}>
        <Image
          source={
            liked
              ? require('@/assets/icons/thumbs-up-liked.svg')
              : require('@/assets/icons/thumbs-up.svg')
          }
          style={styles.thumb}
        />
        <Text style={[styles.helpfulText, liked && styles.helpfulTextLiked]}>This was helpful</Text>
      </ScalePressable>
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: 16,
    padding: 16,
  },
  rating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 24,
    borderWidth: 1,
    borderColor: colors.white200,
    borderRadius: 24,
    backgroundColor: colors.white100,
  },
  score: {
    flexDirection: 'row',
    alignItems: 'center',
    flexShrink: 0,
    gap: 4,
  },
  ratingText: {
    flex: 1,
  },
  star: {
    width: 40,
    height: 40,
  },
  scoreText: {
    flexShrink: 0,
    // Android measures some scores (4.8/5) a few points short of what it draws
    // at this letter spacing; the spare room keeps them from being cut off.
    paddingRight: 4,
    fontFamily: fonts.semiBold,
    fontSize: 32,
    lineHeight: 40,
    letterSpacing: -1.6,
    color: colors.blue900,
  },
  ratingWord: {
    fontFamily: fonts.bold,
    fontSize: 14,
    lineHeight: 18,
    letterSpacing: -0.7,
    color: colors.blue300,
  },
  count: {
    fontFamily: fonts.regular,
    fontSize: 14,
    lineHeight: 18,
    letterSpacing: -0.7,
    color: colors.gray700,
  },
  summary: {
    gap: 20,
    padding: 16,
  },
  summaryHeading: {
    gap: 4,
  },
  source: {
    fontFamily: fonts.regular,
    fontSize: 14,
    lineHeight: 18,
    letterSpacing: -0.7,
    color: colors.gray500,
  },
  summaryText: {
    fontFamily: fonts.medium,
    fontSize: 14,
    lineHeight: SUMMARY_LINE_HEIGHT,
    letterSpacing: -0.7,
    color: colors.gray500,
  },
  reviews: {
    gap: 10,
  },
  pane: {
    gap: 24,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.white200,
    borderRadius: 24,
    backgroundColor: colors.white100,
  },
  reviewer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    paddingRight: 12,
  },
  reviewerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flexShrink: 1,
    gap: 12,
  },
  // Figma's placeholder for the reviewer's photo.
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.echoGreen,
  },
  reviewerText: {
    flexShrink: 1,
    gap: 4,
  },
  username: {
    fontFamily: fonts.medium,
    fontSize: 16,
    lineHeight: 20,
    letterSpacing: -0.8,
    color: colors.blue900,
  },
  reviewerCount: {
    fontFamily: fonts.regular,
    fontSize: 14,
    lineHeight: 18,
    letterSpacing: -0.7,
    color: colors.gray500,
  },
  more: {
    width: 24,
    height: 24,
  },
  stars: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  starRow: {
    flexDirection: 'row',
    gap: 4,
  },
  smallStar: {
    width: 16,
    height: 16,
  },
  when: {
    fontFamily: fonts.regular,
    fontSize: 14,
    lineHeight: 18,
    letterSpacing: -0.7,
    color: colors.gray500,
  },
  reviewText: {
    fontFamily: fonts.regular,
    fontSize: 16,
    lineHeight: 20,
    letterSpacing: -0.8,
    color: colors.gray700,
  },
  // Only as wide as the icon and text, so the rest of the row isn't a target.
  helpfulTarget: {
    alignSelf: 'flex-start',
  },
  helpful: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  thumb: {
    width: 20,
    height: 20,
  },
  helpfulText: {
    fontFamily: fonts.medium,
    fontSize: 14,
    lineHeight: 18,
    letterSpacing: -0.7,
    color: colors.gray500,
  },
  helpfulTextLiked: {
    color: colors.blue900,
  },
});
