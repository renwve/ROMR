import { Image, type ImageSource } from 'expo-image';
import { useEffect, useRef } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  type SharedValue,
} from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';

import { PRESS_IN, PRESS_OUT, PRESS_SCALE } from '@/constants/motion';
import { colors, fonts, shadows } from '@/constants/theme';

// Figma "Saved Collections Menu": "Starting Point" is an empty 80 × 42 box that
// grows into "Default", 160 × 136.
const START = { width: 80, height: 42 };
const FULL = { width: 160, height: 136 };
// Grows open with a touch of give; shrinks away quicker.
const GROW = { dampingRatio: 0.8, duration: 200 };
const SHRINK = { duration: 180 };
// No option pressed.
const NONE = -1;
// The options' layout: 20pt between them and above and below the first and
// last, 16pt (with the 1pt border) in from the sides.
const OPTION_GAP = 20;
const SIDE_PADDING = 15;
const OPTION_HIT_SLOP = {
  top: OPTION_GAP / 2,
  bottom: OPTION_GAP / 2,
  left: SIDE_PADDING,
  right: SIDE_PADDING,
};

const OPTIONS: {
  label: string;
  icon: ImageSource;
  pressedIcon: ImageSource;
}[] = [
  {
    label: 'Edit Collection',
    icon: require('@/assets/icons/pencil-simple.svg'),
    pressedIcon: require('@/assets/icons/pencil-simple-blue.svg'),
  },
  {
    label: 'Share',
    icon: require('@/assets/icons/export.svg'),
    pressedIcon: require('@/assets/icons/export-blue.svg'),
  },
  {
    label: 'Invite',
    icon: require('@/assets/icons/users.svg'),
    pressedIcon: require('@/assets/icons/users-blue.svg'),
  },
];

// A collection's menu, summoned by holding its card. It grows open from its
// top-left corner at `anchor` (a point on the screen) and covers the page with
// an invisible layer: tapping anywhere outside it closes it (`open` goes false),
// and it shrinks away before calling `onClosed`. Pressing an option
// ("Option Selected") turns it blue300, softens the menu's shadow and shrinks
// the menu to PRESS_SCALE around the finger; letting go chooses it (`onSelect`).
//
// Pressing is driven by shared values only, never React state: re-rendering
// the menu while it's open resets its animated size and opacity on Android, so
// it vanished until the press ended.
export function CollectionMenu({
  anchor,
  open,
  onClose,
  onClosed,
  onSelect,
}: {
  anchor: { x: number; y: number };
  open: boolean;
  onClose: () => void;
  onClosed: () => void;
  // An option was chosen (its label); the page closes the menu and acts on it.
  onSelect: (label: string) => void;
}) {
  // 0 = "Starting Point", 1 = "Default".
  const grow = useSharedValue(0);
  const scale = useSharedValue(1);
  // Which option is held down, if any.
  const pressed = useSharedValue(NONE);
  // Where the finger is on the menu, which the press shrinks towards.
  const originX = useSharedValue(FULL.width / 2);
  const originY = useSharedValue(FULL.height / 2);
  const tappedOutside = useRef(false);

  useEffect(() => {
    if (open) {
      grow.set(withSpring(1, GROW));
    } else {
      grow.set(
        withTiming(0, SHRINK, (finished) => {
          if (finished) scheduleOnRN(onClosed);
        }),
      );
    }
  }, [open, grow, onClosed]);

  const menuStyle = useAnimatedStyle(() => {
    // Scaling around the finger: move that point to the centre, scale, and
    // move it back.
    const dx = originX.get() - FULL.width / 2;
    const dy = originY.get() - FULL.height / 2;
    return {
      width: interpolate(grow.get(), [0, 1], [START.width, FULL.width]),
      height: interpolate(grow.get(), [0, 1], [START.height, FULL.height]),
      // Fades in as it starts to grow and out as it finishes shrinking away.
      opacity: interpolate(grow.get(), [0, 0.15], [0, 1], Extrapolation.CLAMP),
      transform: [
        { translateX: dx },
        { translateY: dy },
        { scale: scale.get() },
        { translateX: -dx },
        { translateY: -dy },
      ],
    };
  });
  // "Default"'s medium-soft shadow gives way to "Option Selected"'s soft one.
  const defaultShadowStyle = useAnimatedStyle(() => ({
    opacity: pressed.get() === NONE ? 1 : 0,
  }));
  const pressedShadowStyle = useAnimatedStyle(() => ({
    opacity: pressed.get() === NONE ? 0 : 1,
  }));
  // The options show once there's room for them.
  const contentStyle = useAnimatedStyle(() => ({
    opacity: interpolate(grow.get(), [0.6, 1], [0, 1], Extrapolation.CLAMP),
  }));

  return (
    <View style={StyleSheet.absoluteFill}>
      <Pressable
        style={StyleSheet.absoluteFill}
        accessibilityRole="button"
        accessibilityLabel="Close menu"
        // Only a tap that starts here closes it: lifting the finger that held
        // the card (which this layer appears under) mustn't.
        onPressIn={() => {
          tappedOutside.current = true;
        }}
        onPress={() => {
          if (tappedOutside.current) onClose();
        }}
      />
      <Animated.View
        style={[styles.menu, { left: anchor.x, top: anchor.y }, menuStyle]}
        onTouchStart={(event) => {
          originX.set(event.nativeEvent.pageX - anchor.x);
          originY.set(event.nativeEvent.pageY - anchor.y);
        }}>
        <Animated.View
          style={[styles.face, styles.defaultShadow, defaultShadowStyle]}
          collapsable={false}
        />
        <Animated.View
          style={[styles.face, styles.pressedShadow, pressedShadowStyle]}
          collapsable={false}
        />
        <View style={styles.clip}>
          <Animated.View style={[styles.options, contentStyle]}>
            {OPTIONS.map((option, index) => (
              <Option
                key={option.label}
                option={option}
                index={index}
                pressed={pressed}
                onPressIn={() => {
                  pressed.set(index);
                  scale.set(withTiming(PRESS_SCALE, PRESS_IN));
                }}
                onPressOut={() => {
                  pressed.set(NONE);
                  scale.set(withTiming(1, PRESS_OUT));
                }}
                onPress={() => onSelect(option.label)}
              />
            ))}
          </Animated.View>
        </View>
      </Animated.View>
    </View>
  );
}

// One option: navy, or blue300 while it's the one held down.
function Option({
  option,
  index,
  pressed,
  onPressIn,
  onPressOut,
  onPress,
}: {
  option: (typeof OPTIONS)[number];
  index: number;
  pressed: SharedValue<number>;
  onPressIn: () => void;
  onPressOut: () => void;
  onPress: () => void;
}) {
  const iconStyle = useAnimatedStyle(() => ({ opacity: pressed.get() === index ? 0 : 1 }));
  const pressedIconStyle = useAnimatedStyle(() => ({ opacity: pressed.get() === index ? 1 : 0 }));
  const labelStyle = useAnimatedStyle(() => ({
    color: pressed.get() === index ? colors.blue300 : colors.blue900,
  }));

  return (
    <Pressable
      accessibilityRole="menuitem"
      // Each option takes the menu's full width and half the gap above and
      // below it, so the whole menu is tappable with no dead space between.
      hitSlop={OPTION_HIT_SLOP}
      style={styles.option}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      onPress={onPress}>
      <View style={styles.icon}>
        <Animated.View style={[StyleSheet.absoluteFill, iconStyle]} collapsable={false}>
          <Image source={option.icon} style={styles.icon} />
        </Animated.View>
        <Animated.View style={[StyleSheet.absoluteFill, pressedIconStyle]} collapsable={false}>
          <Image source={option.pressedIcon} style={styles.icon} />
        </Animated.View>
      </View>
      <Animated.Text style={[styles.label, labelStyle]}>{option.label}</Animated.Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  menu: {
    position: 'absolute',
  },
  // The menu's white card, drawn twice, once with each shadow, so pressing can
  // swap shadows without re-rendering.
  face: {
    ...StyleSheet.absoluteFill,
    borderRadius: 12,
    backgroundColor: colors.white100,
  },
  defaultShadow: {
    boxShadow: shadows.mediumSoft,
  },
  pressedShadow: {
    boxShadow: shadows.soft,
  },
  // The border, and the edge the options are cut off at while it grows.
  clip: {
    ...StyleSheet.absoluteFill,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.white200,
    borderRadius: 12,
  },
  // Laid out at the full size from the start, so nothing reflows as it grows.
  options: {
    width: FULL.width - 2,
    height: FULL.height - 2,
    justifyContent: 'center',
    gap: OPTION_GAP,
    paddingHorizontal: SIDE_PADDING,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  icon: {
    width: 16,
    height: 16,
  },
  label: {
    fontFamily: fonts.medium,
    fontSize: 14,
    lineHeight: 18,
    includeFontPadding: false,
    letterSpacing: -0.7,
    color: colors.blue900,
  },
});
