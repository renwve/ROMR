import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

import { TextReveal } from '@/components/TextReveal';
import { colors, fonts, shadows } from '@/constants/theme';
import type { DailyRecPage } from './content';
import { RomieHeading } from './RomieHeading';

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
const WHY_LINE_HEIGHT = 18;
const EXPAND = { duration: 300, easing: Easing.out(Easing.quad) };
const GLOW_GROWN = 1.04;
const CYCLE = { duration: 3000, easing: Easing.inOut(Easing.cubic) };
const FADE = { duration: 400, easing: Easing.out(Easing.quad) };
// The "Why this is for you" text reveals over 80% of the glow's whole run,
// from the page showing to the glow fading out (80 + 3000 + 400ms).
const WHY_REVEAL_MS = 0.8 * (GLOW_DELAY + CYCLE.duration + FADE.duration);

// Figma component set "Romie overview / Roverview": why Romie picked this rec,
// and its best time to visit, flight time and typical stay. Once `play` is set
// (the page has finished opening), a rainbow glow ("Default") expands out from
// behind it, cycles once and fades back to the soft shadow ("Gradient dismissed").
export function Roverview({ page, play }: { page: DailyRecPage; play: boolean }) {
  const [size, setSize] = useState<{ width: number; height: number } | null>(null);
  const turn = useSharedValue(0);
  const grow = useSharedValue(1);
  // 0 shows the soft shadow, 1 the glow.
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
      <View style={styles.card}>
        <View style={styles.why}>
          <RomieHeading turn={turn} glow={glow} />
          {/* Romie's reason reveals like a chat message as soon as the page
              shows, while it's still sliding in. */}
          <TextReveal
            text={page.why}
            style={styles.whyText}
            lineHeight={WHY_LINE_HEIGHT}
            background={colors.white100}
            play
            duration={WHY_REVEAL_MS}
          />
        </View>
        <View style={styles.divider} />
        <View style={styles.facts}>
          <Fact
            icon={
              <Image source={require('@/assets/icons/calendar-dots.svg')} style={styles.icon} />
            }
            value={page.bestTime}
            label="Best time to visit"
          />
          <Fact
            icon={
              <Image
                source={require('@/assets/icons/airplane-in-flight-24.svg')}
                style={[styles.icon, styles.plane]}
              />
            }
            value={page.flightTime}
            label={page.travelLabel ?? 'Est. Flight time'}
          />
          <Fact
            icon={<Image source={require('@/assets/icons/bed.svg')} style={styles.icon} />}
            value={page.stay}
            label="Typical Stay"
          />
        </View>
      </View>
    </View>
  );
}

function Fact({ icon, value, label }: { icon: React.ReactNode; value: string; label: string }) {
  return (
    <View style={styles.fact}>
      <View style={styles.factIcon}>{icon}</View>
      <View style={styles.factText}>
        <Text style={styles.factValue}>{value}</Text>
        <Text style={styles.factLabel} numberOfLines={1}>
          {label}
        </Text>
      </View>
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
    alignItems: 'center',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.white200,
    borderRadius: RADIUS,
    backgroundColor: colors.white100,
  },
  why: {
    alignSelf: 'stretch',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  whyText: {
    fontFamily: fonts.regular,
    fontSize: 14,
    lineHeight: WHY_LINE_HEIGHT,
    letterSpacing: -0.7,
    color: colors.gray500,
  },
  divider: {
    alignSelf: 'stretch',
    height: 1,
    marginHorizontal: 16,
    backgroundColor: colors.white200,
  },
  facts: {
    flexDirection: 'row',
    alignSelf: 'stretch',
    height: 110,
  },
  fact: {
    flex: 1,
    alignItems: 'center',
    gap: 12,
    padding: 12,
  },
  factIcon: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    width: 24,
    height: 24,
  },
  // Figma tilts the plane 20° up.
  plane: {
    transform: [{ rotate: '-20deg' }],
  },
  // The value and label may use the column's padding, so "Est. Flight time"
  // stays on one line on phones narrower than Figma's 402pt (the S23 is 360).
  factText: {
    alignItems: 'center',
    gap: 8,
    marginHorizontal: -12,
  },
  factValue: {
    fontFamily: fonts.semiBold,
    fontSize: 14,
    lineHeight: 18,
    letterSpacing: -0.7,
    color: colors.blue900,
  },
  factLabel: {
    fontFamily: fonts.medium,
    fontSize: 12,
    lineHeight: 15,
    letterSpacing: -0.6,
    color: colors.gray500,
  },
});
