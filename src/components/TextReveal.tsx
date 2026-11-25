import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useState } from 'react';
import {
  type LayoutChangeEvent,
  Platform,
  type StyleProp,
  StyleSheet,
  Text,
  type TextLayoutEvent,
  type TextStyle,
  View,
} from 'react-native';
import Animated, {
  Easing,
  Extrapolation,
  interpolate,
  type SharedValue,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

// The chat's text reveal (Figma "New Plan - Chatting"): text appears one
// character at a time, left to right, each character fading in.

// How long a whole block of text takes to reveal, however long it is.
export const REVEAL_MS = 1000;
// The reveal's soft edge: each character fades in across about four characters' width.
const FADE_WIDTH = 32;

export type TextLine = { x: number; y: number; width: number; height: number; chars: number };

// Where a Text's lines landed (native), from its onTextLayout.
export function linesFromTextLayout(event: TextLayoutEvent): TextLine[] {
  return event.nativeEvent.lines.map((line) => ({
    x: line.x,
    y: line.y,
    width: line.width,
    height: line.height,
    chars: [...line.text].length,
  }));
}

// react-native-web has no onTextLayout: assume full-width rows of `lineHeight`.
export function linesFromLayout(event: LayoutChangeEvent, lineHeight: number): TextLine[] {
  const { width, height } = event.nativeEvent.layout;
  const rows = Math.max(1, Math.round(height / lineHeight));
  return Array.from({ length: rows }, (_, i) => ({
    x: 0,
    y: i * lineHeight,
    width,
    height: lineHeight,
    chars: 1,
  }));
}

// Each line's share of the reveal, in reading order, by character count.
export function revealSpans(lines: TextLine[]) {
  const total = lines.reduce((sum, line) => sum + line.chars, 0);
  let before = 0;
  return lines.map((line) => {
    const span = { line, from: before / total, to: (before + line.chars) / total };
    before += line.chars;
    return span;
  });
}

// `color` (#RRGGBB) at the given opacity.
function withAlpha(color: string, alpha: number) {
  const value = parseInt(color.slice(1), 16);
  return `rgba(${(value >> 16) & 255}, ${(value >> 8) & 255}, ${value & 255}, ${alpha})`;
}

// Hides one line of text under the background colour, then slides off to the
// right behind a soft edge, so the characters appear left to right, each fading
// in. It plays between `from` and `to` of the reveal. `offset` is where the
// text sits in the cover's parent.
export function LineCover({
  line,
  from,
  to,
  reveal,
  color,
  offset = { x: 0, y: 0 },
}: {
  line: TextLine;
  from: number;
  to: number;
  reveal: SharedValue<number>;
  color: string;
  offset?: { x: number; y: number };
}) {
  const slideStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateX: interpolate(
          reveal.get(),
          [from, to],
          [0, line.width + FADE_WIDTH],
          Extrapolation.CLAMP,
        ),
      },
    ],
  }));

  return (
    <View
      pointerEvents="none"
      style={[
        styles.cover,
        {
          left: offset.x + line.x - FADE_WIDTH,
          top: offset.y + line.y,
          width: line.width + FADE_WIDTH * 2,
          height: line.height,
        },
      ]}>
      <Animated.View style={[styles.coverSlide, slideStyle]}>
        <LinearGradient
          colors={[withAlpha(color, 0), color]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={{ width: FADE_WIDTH }}
        />
        <View style={{ width: line.width + FADE_WIDTH, backgroundColor: color }} />
      </Animated.View>
    </View>
  );
}

// A block of text that stays hidden on `background` (#RRGGBB) until `play`,
// then reveals like the chat's messages.
export function TextReveal({
  text,
  style,
  lineHeight,
  background,
  play,
  delay = 0,
  duration = REVEAL_MS,
}: {
  text: string;
  style: StyleProp<TextStyle>;
  lineHeight: number;
  background: string;
  play: boolean;
  delay?: number;
  // How long the reveal takes (the chat's 1s by default).
  duration?: number;
}) {
  const [lines, setLines] = useState<TextLine[] | null>(null);
  const reveal = useSharedValue(0);

  useEffect(() => {
    if (!play || lines === null) return;
    const timer = setTimeout(
      () => reveal.set(withTiming(1, { duration, easing: Easing.linear })),
      delay,
    );
    return () => clearTimeout(timer);
  }, [play, lines, delay, duration, reveal]);

  return (
    <View>
      {/* One plain Text that's never restyled while it reveals, so its line
          breaks stay exactly as measured. */}
      <Text
        style={[style, { opacity: lines ? 1 : 0 }]}
        onTextLayout={(event) => {
          if (Platform.OS !== 'web' && !lines) setLines(linesFromTextLayout(event));
        }}
        onLayout={(event) => {
          if (Platform.OS === 'web' && !lines) setLines(linesFromLayout(event, lineHeight));
        }}>
        {text}
      </Text>
      {lines
        ? revealSpans(lines).map(({ line, from, to }, i) => (
            <LineCover key={i} line={line} from={from} to={to} reveal={reveal} color={background} />
          ))
        : null}
    </View>
  );
}

const styles = StyleSheet.create({
  cover: {
    position: 'absolute',
    overflow: 'hidden',
  },
  coverSlide: {
    flexDirection: 'row',
    height: '100%',
  },
});
