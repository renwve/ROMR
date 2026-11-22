import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { StyleSheet, useWindowDimensions } from 'react-native';
import Animated, {
  Easing,
  Extrapolation,
  interpolate,
  useAnimatedProps,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import Svg, { Path } from 'react-native-svg';
import { scheduleOnRN } from 'react-native-worklets';

import { colors, fonts } from '@/constants/theme';

const AnimatedPath = Animated.createAnimatedComponent(Path);

// The R mark from Figma ("Frame 91", 176×176, 24pt navy stroke), drawn as a vector
// so it stays sharp at any zoom.
const LOGO_SIZE = 176;
const LOGO_STROKE = 24;
const LOGO_PATH =
  'M36 140.553L60.7996 48H104C110.4 48 123.2 51.84 123.2 67.2C123.2 82.56 110.4 86.4 104 86.4H94.3996M94.3996 86.4H51.1996M94.3996 86.4C92.7996 100.8 113.28 140 144 140';

// The path split into commands, so each frame can redraw it at the current zoom.
// It only uses absolute M/L/C (x,y pairs) and H (x only).
const LOGO_SEGMENTS = (LOGO_PATH.match(/[A-Za-z][^A-Za-z]*/g) ?? []).map((segment) => ({
  command: segment[0],
  values: segment.slice(1).trim().split(/[\s,]+/).filter(Boolean).map(Number),
}));
// The logo's centre sits inside the R's 24pt crossbar, whose nearest edge is 10.4pt away.
// Zooming about the centre until that edge passes the screen's edge fills it with navy.
const CROSSBAR_CLEARANCE = 10.4;

const HOLD_MS = 1400;
const ZOOM_MS = 1050;
const WORDMARK_FADE_MS = 140;
const FADE_MS = 210;
const TOTAL_MS = HOLD_MS + ZOOM_MS + FADE_MS;
// Ease in, no ease out: starts slow and is still accelerating when it covers the screen.
// Applied to the zoom's exponent (see logoProps), so the speed the eye sees ramps up too.
// Trying a steeper ending: power 5. The previous version was Easing.in(Easing.cubic).
const ZOOM_EASING = Easing.in(Easing.poly(5));

// Figma "Splash Page" (Redesign): the R mark centred, the wordmark 80pt off the bottom.
// After a moment the R zooms until it covers the screen, then the page fades to reveal the app.
export function SplashPage({ onFinish }: { onFinish: () => void }) {
  const { width, height } = useWindowDimensions();
  const coverScale = (Math.max(width, height) / 2 / CROSSBAR_CLEARANCE) * 1.2;

  // One clock in milliseconds drives every stage, so they can't drift apart:
  // hold, then the zoom (wordmark fading as it starts), then the fade to the app.
  const clock = useSharedValue(0);
  const [zooming, setZooming] = useState(false);

  useEffect(() => {
    clock.set(
      withTiming(TOTAL_MS, { duration: TOTAL_MS, easing: Easing.linear }, (finished) => {
        if (finished) scheduleOnRN(onFinish);
      }),
    );
    // Light status bar icons once the navy starts to take over.
    const timer = setTimeout(() => setZooming(true), HOLD_MS);
    return () => clearTimeout(timer);
  }, [clock, onFinish]);

  // The SVG spans the screen. Each frame the path is redrawn scaled about the
  // logo's centre, which sits at the screen's centre, so the vector is rendered
  // at full resolution instead of a bitmap being scaled up.
  const logoProps = useAnimatedProps(() => {
    const zoomProgress = ZOOM_EASING(
      interpolate(clock.value, [HOLD_MS, HOLD_MS + ZOOM_MS], [0, 1], Extrapolation.CLAMP),
    );
    // Zoom is seen in ratios (1× → 2× looks like 20× → 40×), so ease the exponent,
    // not the scale; easing the scale itself would look fast early and slow late.
    const scale = Math.pow(coverScale, zoomProgress);
    const centre = LOGO_SIZE / 2;
    const x = (value: number) => width / 2 + (value - centre) * scale;
    const y = (value: number) => height / 2 + (value - centre) * scale;
    let d = '';
    for (const { command, values } of LOGO_SEGMENTS) {
      d += command;
      if (command === 'H') {
        d += x(values[0]);
      } else {
        for (let i = 0; i < values.length; i += 2) {
          d += `${i ? ' ' : ''}${x(values[i])} ${y(values[i + 1])}`;
        }
      }
    }
    return { d, strokeWidth: LOGO_STROKE * scale };
  });

  const pageStyle = useAnimatedStyle(() => ({
    opacity: interpolate(
      clock.value,
      [HOLD_MS + ZOOM_MS, TOTAL_MS],
      [1, 0],
      Extrapolation.CLAMP,
    ),
  }));
  const wordmarkStyle = useAnimatedStyle(() => ({
    opacity: interpolate(
      clock.value,
      [HOLD_MS, HOLD_MS + WORDMARK_FADE_MS],
      [1, 0],
      Extrapolation.CLAMP,
    ),
  }));

  return (
    <Animated.View style={[styles.page, pageStyle]}>
      <StatusBar style={zooming ? 'light' : 'dark'} />
      <Svg width={width} height={height} style={StyleSheet.absoluteFill}>
        <AnimatedPath animatedProps={logoProps} stroke={colors.blue900} fill="none" />
      </Svg>
      <Animated.Text style={[styles.wordmark, wordmarkStyle]}>ROMR</Animated.Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  page: {
    ...StyleSheet.absoluteFill,
    alignItems: 'center',
    backgroundColor: colors.white100,
  },
  wordmark: {
    position: 'absolute',
    bottom: 50,
    fontFamily: fonts.black,
    fontSize: 24,
    lineHeight: 30,
    letterSpacing: -1.2,
    color: colors.blue900,
  },
});
