import { Image } from 'expo-image';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Squircle } from '@/components/Squircle';
import { colors, fonts } from '@/constants/theme';

// A collection's preview: four white tiles in a 2 × 2 grid, their inner
// corners a little rounder than their outer ones.
const TILE_CORNERS = [
  { borderBottomRightRadius: 12 },
  { borderBottomLeftRadius: 12 },
  { borderTopRightRadius: 12 },
  { borderTopLeftRadius: 12 },
];

// Figma component set "Saved Card": one collection on the Saved page.
// "Everything Collection" (every save; white text on a colour glow) or
// "Custom Collection" (one the user made; navy text on blue100).
export function CollectionCard({
  name,
  count,
  everything = false,
  onPress,
}: {
  name: string;
  count: string;
  everything?: boolean;
  onPress?: () => void;
}) {
  return (
    // Unlike the page's buttons, it doesn't shrink when pressed.
    <Pressable accessibilityRole="button" onPress={onPress}>
      <Squircle style={styles.card}>
        {everything ? (
          // Figma's five blurred colour blobs, pre-rendered (at 3x) so the card
          // looks the same everywhere and doesn't redraw a blur while scrolling.
          <Image
            source={require('@/assets/images/everything-collection.png')}
            style={StyleSheet.absoluteFill}
            contentFit="cover"
          />
        ) : null}
        <View style={styles.text}>
          <Text style={[styles.name, everything && styles.onGlow]}>{name}</Text>
          <Text style={[styles.count, everything && styles.onGlow]}>{count}</Text>
        </View>
        <View style={styles.grid}>
          {[0, 1].map((row) => (
            <View key={row} style={styles.gridRow}>
              {[0, 1].map((column) => (
                <View key={column} style={[styles.tile, TILE_CORNERS[row * 2 + column]]} />
              ))}
            </View>
          ))}
        </View>
      </Squircle>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    height: 100,
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 24,
    borderRadius: 32,
    overflow: 'hidden',
    backgroundColor: colors.blue100,
  },
  text: {
    justifyContent: 'space-between',
  },
  name: {
    fontFamily: fonts.semiBold,
    fontSize: 20,
    lineHeight: 25,
    letterSpacing: -1,
    color: colors.blue900,
  },
  count: {
    fontFamily: fonts.medium,
    fontSize: 16,
    lineHeight: 20,
    letterSpacing: -0.8,
    color: colors.gray700,
  },
  onGlow: {
    color: colors.white100,
  },
  grid: {
    width: 52,
    gap: 4,
  },
  gridRow: {
    flex: 1,
    flexDirection: 'row',
    gap: 4,
  },
  tile: {
    flex: 1,
    borderRadius: 8,
    backgroundColor: colors.white100,
  },
});
