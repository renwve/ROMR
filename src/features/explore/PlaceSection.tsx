import type { ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { SwipeRow } from '@/components/SwipeRow';
import { colors, fonts } from '@/constants/theme';
import { CATEGORY_CARD_WIDTH, CategoryCard } from './CategoryCard';

const SIDE = 16;
const CARD_GAP = 12;
// Placeholder places until there's real content: five per category.
const PLACES = [1, 2, 3, 4, 5];

// Figma "Explore/Home - Example Cards": a category (Newly Discovered, Near
// You, …) with a row of place cards the user scrolls sideways.
export function PlaceSection({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle: string;
  // Shown at the heading's right, like Newly Discovered's Refine button.
  action?: ReactNode;
}) {
  return (
    <View style={styles.section}>
      <View style={styles.heading}>
        <View style={styles.headingText}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.subtitle}>{subtitle}</Text>
        </View>
        {action}
      </View>
      <SwipeRow step={CATEGORY_CARD_WIDTH + CARD_GAP} contentContainerStyle={styles.cards}>
        {PLACES.map((place) => (
          <CategoryCard key={place} title="Title" detail="Brief Description" />
        ))}
      </SwipeRow>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    gap: 24,
    paddingTop: 24,
    paddingBottom: 16,
  },
  heading: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 24,
    paddingHorizontal: SIDE,
  },
  headingText: {
    flex: 1,
    gap: 4,
  },
  title: {
    fontFamily: fonts.bold,
    fontSize: 20,
    lineHeight: 25,
    letterSpacing: -1,
    color: colors.dark800,
  },
  subtitle: {
    fontFamily: fonts.medium,
    fontSize: 14,
    lineHeight: 18,
    letterSpacing: -0.7,
    color: colors.gray400,
  },
  cards: {
    gap: CARD_GAP,
    paddingHorizontal: SIDE,
  },
});
