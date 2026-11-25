import { LinearGradient } from 'expo-linear-gradient';
import { type ReactNode, useEffect, useState } from 'react';
import { type StyleProp, StyleSheet, View, type ViewStyle } from 'react-native';
import Animated, {
  Easing,
  type SharedValue,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

import { colors, shadows } from '@/constants/theme';

const RADIUS = 24;
// Figma's "Romie Gradient" (not a colour variable).
const ROMIE_GRADIENT = ['#7D87E9', '#7582ED', '#6ABDC7', '#9B64F8', '#EE88F4'] as const;
const ROMIE_STOPS = [0, 0.2404, 0.4663, 0.7356, 1] as const;
// Figma's 20pt layer blur made 30% softer (26pt), as a CSS blur (Figma's
// radius is twice the CSS one).
const GLOW_BLUR = 13;
// Room round the glow for its blur to spread into, so nothing cuts it off.
const BLUR_ROOM = GLOW_BLUR * 3;

// The glow's entrance: the card opens showing the soft shadow ("Gradient
// dismissed"); 80ms later the glow expands out from behind it as it fades in,
// its gradient turns once (slow at either end, fastest midway), then it fades
// back to the soft shadow.
const GLOW_DELAY = 80;
const EXPAND = { duration: 300, easing: Easing.out(Easing.quad) };
const GLOW_GROWN = 1.04;
const CYCLE = { duration: 3000, easing: Easing.inOut(Easing.cubic) };
const FADE = { duration: 400, easing: Easing.out(Easing.quad) };
// Romie's text reveals over 80% of the glow's whole run, from the card showing
// to the glow fading out (80 + 3000 + 400ms).
export const ROMIE_REVEAL_MS = 0.8 * (GLOW_DELAY + CYCLE.duration + FADE.duration);

export type RomieGlow = {
  // One full turn of the gradient, 0 → 1.
  turn: SharedValue<number>;
  grow: SharedValue<number>;
  // 0 shows the soft shadow, 1 the glow.
  glow: SharedValue<number>;
};

// The glow's animation, played once `play` is set.
export function useRomieGlow(play: boolean): RomieGlow {
  const turn = useSharedValue(0);
  const grow = useSharedValue(1);
  const glow = useSharedValue(0);

  useEffect(() => {
    if (!play) return;
    grow.set(withDelay(GLOW_DELAY, withTiming(GLOW_GROWN, EXPAND)));
    turn.set(withDelay(GLOW_DELAY, withTiming(1, CYCLE)));
    glow.set(
      withDelay(
        GLOW_DELAY,
        withSequence(
          withTiming(1, EXPAND),
          withDelay(CYCLE.duration - EXPAND.duration, withTiming(0, FADE)),
        ),
      ),
    );
  }, [play, turn, grow, glow]);

  return { turn, grow, glow };
}

// Figma component set "Romie overview / Roverview", the card the Roverview and
// the Reviews tab's Review Summary share: a white card that rests on the soft
// shadow ("Gradient dismissed"), with a rainbow glow ("Default") that expands
// out from behind it, cycles once and fades back as `romie` plays.
export function RomieCard({
  romie,
  style,
  children,
}: {
  romie: RomieGlow;
  style?: StyleProp<ViewStyle>;
  children: ReactNode;
}) {
  const { turn, grow, glow } = romie;
  const [size, setSize] = useState<{ width: number; height: number } | null>(null);

  const glowStyle = useAnimatedStyle(() => ({
    opacity: glow.get(),
    transform: [{ scale: grow.get() }],
  }));
  const shadowStyle = useAnimatedStyle(() => ({ opacity: 1 - glow.get() }));
  const turnStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${turn.get() * 360}deg` }],
  }));

  // The gradient runs left to right across the card. It's drawn on a square as
  // wide as the card's diagonal, so the card stays covered as it turns, with
  // the stops squeezed into the card's width so it matches Figma at rest.
  const diagonal = size ? Math.hypot(size.width, size.height) : 0;
  const locations = size
    ? ROMIE_STOPS.map((stop) => ((diagonal - size.width) / 2 + stop * size.width) / diagonal)
    : ROMIE_STOPS;

  return (
    <View
      onLayout={({ nativeEvent: { layout } }) =>
        setSize({ width: layout.width, height: layout.height })
      }>
      <Animated.View style={[styles.shadow, shadowStyle]} />
      {size ? (
        <Animated.View style={[styles.glowRoom, glowStyle]} pointerEvents="none">
          <View style={styles.glowBlur}>
            <View style={styles.glowClip}>
              <Animated.View
                style={[
                  {
                    position: 'absolute',
                    width: diagonal,
                    height: diagonal,
                    left: (size.width - diagonal) / 2,
                    top: (size.height - diagonal) / 2,
                  },
                  turnStyle,
                ]}>
                <LinearGradient
                  colors={ROMIE_GRADIENT}
                  locations={locations as unknown as readonly [number, number, ...number[]]}
                  start={{ x: 0, y: 0.5 }}
                  end={{ x: 1, y: 0.5 }}
                  style={StyleSheet.absoluteFill}
                />
              </Animated.View>
            </View>
          </View>
        </Animated.View>
      ) : null}
      <View style={[styles.card, style]}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  shadow: {
    ...StyleSheet.absoluteFill,
    borderRadius: RADIUS,
    backgroundColor: colors.white100,
    boxShadow: shadows.soft,
  },
  glowRoom: {
    position: 'absolute',
    inset: -BLUR_ROOM,
  },
  glowBlur: {
    flex: 1,
    padding: BLUR_ROOM,
    // As a CSS string: React Native Web ignores the array form.
    filter: `blur(${GLOW_BLUR}px)`,
  },
  glowClip: {
    flex: 1,
    borderRadius: RADIUS,
    overflow: 'hidden',
  },
  card: {
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.white200,
    borderRadius: RADIUS,
    backgroundColor: colors.white100,
  },
});
