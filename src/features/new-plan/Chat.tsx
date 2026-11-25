import { useEffect, useRef, useState } from 'react';
import {
  Platform,
  ScrollView,
  type ScrollViewInstance,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Animated, {
  Easing,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import { INPUT_CARD, KEYBOARD_GAP, PLAN_REST } from '@/components/NavBar';
import {
  LineCover,
  linesFromLayout,
  linesFromTextLayout,
  REVEAL_MS,
  revealSpans,
  type TextLine,
} from '@/components/TextReveal';
import { colors, fonts } from '@/constants/theme';
import { useKeyboardHeight } from '@/hooks/useKeyboardHeight';
import type { ChatMessage } from './NewPlanContext';

// The user's message text wraps at this width (Figma "New Plan - Chatting");
// the assistant's can use the chat's full width.
const USER_TEXT_MAX = 250;
const BUBBLE_PADDING_X = 16;
const BUBBLE_PADDING_Y = 12;
// Where the text sits in the bubble, for the reveal's line covers.
const BUBBLE_PADDING = { x: BUBBLE_PADDING_X, y: BUBBLE_PADDING_Y };
const LINE_HEIGHT = 20;
// Layout rounds text to whole pixels, so the shown text gets this much more
// than it measured (reaching into the bubble's padding) to keep its line breaks.
const TEXT_SLACK = 1;

// Figma "Chat Box Animation": a bubble enters as a 24pt-wide pill and springs
// out to its full width, from its own side, overshooting by about 3% before it
// settles. The width move takes 600ms (75.541% of a 794.27ms timeline that
// then holds).
const GROW_FROM = 24;
const GROW_MS = 600;
// That spring as Figma exports it: CSS linear() stops, evenly spaced in time.
const GROW_EASING = [
  0, 0.0196, 0.0706, 0.1428, 0.228, 0.3195, 0.4123, 0.5026, 0.5877, 0.6657, 0.7357, 0.7971, 0.8499,
  0.8944, 0.9311, 0.9607, 0.984, 1.0017, 1.0147, 1.0238, 1.0296, 1.0327, 1.0338, 1.0334, 1.0318,
  1.0294, 1.0266, 1.0235, 1.0204, 1.0173, 1.0144, 1.0117, 1.0093, 1.0072, 1.0054, 1.0038, 1.0025,
  1.0015, 1.0007, 1, 0.9996, 0.9992, 0.999, 0.9989, 0.9989, 0.9989, 0.9989, 0.999, 0.9991, 0.9992,
  0.9993,
];
const GROW_STOPS = GROW_EASING.map((_, i) => i / (GROW_EASING.length - 1));

// Figma "New Plan - Chatting": the conversation under the New Plan header.
export function Chat({ messages }: { messages: ChatMessage[] }) {
  const scroll = useRef<ScrollViewInstance>(null);
  const keyboardHeight = useKeyboardHeight();

  // Keeps the last message clear of the input card, wherever the keyboard puts it.
  const footerStyle = useAnimatedStyle(() => ({
    height: Math.max(PLAN_REST, keyboardHeight.value + KEYBOARD_GAP) + INPUT_CARD,
  }));

  return (
    <ScrollView
      ref={scroll}
      style={styles.scroll}
      contentContainerStyle={styles.thread}
      onContentSizeChange={() => scroll.current?.scrollToEnd({ animated: true })}>
      {messages.map((message) => (
        <Bubble key={message.id} message={message} />
      ))}
      <Animated.View style={footerStyle} />
    </ScrollView>
  );
}

function Bubble({ message }: { message: ChatMessage }) {
  const fromUser = message.from === 'user';
  const textColor = fromUser ? colors.dark800 : colors.white100;
  const bubbleColor = fromUser ? colors.blue100 : colors.dark800;
  const textStyle = [
    styles.text,
    { color: textColor, maxWidth: fromUser ? USER_TEXT_MAX : undefined },
  ];
  // The bubble's settled width, measured from an invisible copy before it shows.
  const [fullWidth, setFullWidth] = useState<number | null>(null);
  // Where the shown text's lines landed, so the reveal can sweep along them.
  const [lines, setLines] = useState<TextLine[] | null>(null);
  const grow = useSharedValue(0);
  const reveal = useSharedValue(0);

  useEffect(() => {
    if (fullWidth === null) return;
    grow.set(withTiming(1, { duration: GROW_MS, easing: Easing.linear }));
  }, [fullWidth, grow]);

  useEffect(() => {
    if (lines === null) return;
    reveal.set(withTiming(1, { duration: REVEAL_MS, easing: Easing.linear }));
  }, [lines, reveal]);

  const growStyle = useAnimatedStyle(() => {
    const target = fullWidth ?? GROW_FROM;
    const eased = interpolate(grow.value, GROW_STOPS, GROW_EASING);
    return { width: GROW_FROM + (target - GROW_FROM) * eased };
  });

  // Each line's share of the reveal (each bubble's text reveals like TextReveal).
  const spans = lines ? revealSpans(lines) : null;

  return (
    <View style={fromUser ? styles.userRow : styles.assistantRow}>
      {fullWidth === null ? (
        <View
          pointerEvents="none"
          style={[styles.bubble, styles.measure]}
          onLayout={(event) => setFullWidth(event.nativeEvent.layout.width)}>
          <Text style={textStyle}>{message.text}</Text>
        </View>
      ) : (
        // Clips the text while it grows; the text sits at its settled width,
        // pinned to the bubble's anchored side, so it never reflows.
        <Animated.View
          style={[
            styles.bubbleClip,
            { backgroundColor: bubbleColor, alignItems: fromUser ? 'flex-end' : 'flex-start' },
            growStyle,
          ]}>
          <View style={[styles.bubble, { width: fullWidth }]}>
            {/* One plain Text that's never restyled while it reveals, so its
                letter spacing and line breaks stay exactly as measured. */}
            <Text
              style={[
                textStyle,
                {
                  width: fullWidth - BUBBLE_PADDING_X * 2 + TEXT_SLACK,
                  marginRight: -TEXT_SLACK,
                  opacity: lines ? 1 : 0,
                },
              ]}
              onTextLayout={(event) => {
                if (Platform.OS === 'web' || lines) return;
                setLines(linesFromTextLayout(event));
              }}
              onLayout={(event) => {
                // react-native-web has no onTextLayout.
                if (Platform.OS !== 'web' || lines) return;
                setLines(linesFromLayout(event, LINE_HEIGHT));
              }}>
              {message.text}
            </Text>
            {spans?.map(({ line, from, to }, i) => (
              <LineCover
                key={i}
                line={line}
                from={from}
                to={to}
                reveal={reveal}
                color={bubbleColor}
                offset={BUBBLE_PADDING}
              />
            ))}
          </View>
        </Animated.View>
      )}
      {message.time ? <Text style={styles.time}>{message.time}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
  },
  thread: {
    gap: 16,
    padding: 16,
  },
  userRow: {
    alignItems: 'flex-end',
    gap: 4,
  },
  assistantRow: {
    alignItems: 'flex-start',
  },
  bubble: {
    paddingHorizontal: BUBBLE_PADDING_X,
    paddingVertical: BUBBLE_PADDING_Y,
  },
  bubbleClip: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  measure: {
    position: 'absolute',
    opacity: 0,
  },
  text: {
    fontFamily: fonts.regular,
    fontSize: 16,
    lineHeight: LINE_HEIGHT,
    letterSpacing: -0.8,
  },
  time: {
    fontFamily: fonts.regular,
    fontSize: 12,
    lineHeight: 15,
    letterSpacing: -0.6,
    color: colors.gray400,
  },
});
