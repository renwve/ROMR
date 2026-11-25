import * as Haptics from 'expo-haptics';
import { Image } from 'expo-image';
import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

import { Squircle } from '@/components/Squircle';
import { SETTLE } from '@/constants/motion';
import { colors, fonts } from '@/constants/theme';

// Figma "Saved - Edit Collection": holding a card this long opens its menu.
const HOLD_MS = 400;
// The held card shrinks to this, around its centre.
const HELD_SCALE = 0.95;
// The menu opens this far below the shrunk card.
const MENU_GAP = 8;

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
  onHold,
  held = false,
  locked = false,
}: {
  name: string;
  count: string;
  everything?: boolean;
  onPress?: () => void;
  // Holding the card for HOLD_MS calls this with where its menu should open
  // (a point on the screen: 8pt below the shrunk card's bottom-left corner).
  onHold?: (anchor: { x: number; y: number }) => void;
  // While its menu is open, the card is shrunk to HELD_SCALE.
  held?: boolean;
  // While a collection menu is open, it can't be held.
  locked?: boolean;
}) {
  // The card's unscaled size, for placing its menu.
  const [size, setSize] = useState({ width: 0, height: 0 });
  const scale = useSharedValue(1);

  useEffect(() => {
    scale.set(withSpring(held ? HELD_SCALE : 1, SETTLE));
  }, [held, scale]);

  // The phone vibrates just before the card starts to shrink.
  const hold = Gesture.LongPress()
    .minDuration(HOLD_MS)
    .enabled(!!onHold && !locked)
    .runOnJS(true)
    .onStart((event) => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
      // The card's top-left corner on the screen: where the finger is on the
      // screen, less where it is on the card.
      const left = event.absoluteX - event.x;
      const top = event.absoluteY - event.y;
      // It shrinks to its centre, so its edges come in by this much.
      const inset = (1 - HELD_SCALE) / 2;
      onHold?.({
        x: left + size.width * inset,
        y: top + size.height * (1 - inset) + MENU_GAP,
      });
    });

  const scaleStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.get() }] }));

  return (
    <GestureDetector gesture={hold}>
      {/* Scaled, so it keeps its place in the list and the gaps around it widen. */}
      <Animated.View
        style={scaleStyle}
        onLayout={(event) =>
          setSize({
            width: event.nativeEvent.layout.width,
            height: event.nativeEvent.layout.height,
          })
        }>
        {/* Unlike the page's buttons, it doesn't shrink when pressed. */}
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
      </Animated.View>
    </GestureDetector>
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
