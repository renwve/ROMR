import { createContext, useContext, useEffect, type ReactNode } from 'react';
import { StyleSheet, type LayoutChangeEvent, type StyleProp, type ViewStyle } from 'react-native';
import Animated, {
  Easing,
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSequence,
  withSpring,
  withTiming,
  type SharedValue,
} from 'react-native-reanimated';

// A short menu that pops out of the button that opened it.
//
// The box is never animated by height (a layout pass per frame, which Android
// coalesces into jumps). It is drawn in three pieces sized only by transforms:
// a fixed near cap, a 400pt middle scaled vertically, and a far cap translated
// away from the button. All three share one fill so they read as one box.

const COLLAPSED_HEIGHT = 42;
const MIDDLE_HEIGHT = 400;

const LitContext = createContext<SharedValue<number> | null>(null);

type PopMenuProps = {
  open: boolean;
  direction?: 'down' | 'up';
  width: number;
  // The button's centre, measured from the menu's left edge.
  originX: number;
  // Estimated full height until the contents have laid out.
  designHeight: number;
  color?: string;
  flash?: string;
  radius?: number;
  shadow?: string;
  style?: StyleProp<ViewStyle>;
  children: ReactNode;
};

export function PopMenu({
  open,
  direction = 'down',
  width,
  originX,
  designHeight,
  color = '#343645',
  flash,
  radius = 12,
  shadow,
  style,
  children,
}: PopMenuProps) {
  const pop = useSharedValue(0);
  const grow = useSharedValue(0);
  const contents = useSharedValue(0);
  const lit = useSharedValue(0);
  const fullHeight = useSharedValue(designHeight);

  useEffect(() => {
    if (open) {
      pop.set(
        withSequence(
          withTiming(1.2, { duration: 181, easing: Easing.inOut(Easing.sin) }),
          withSpring(1, { damping: 32, stiffness: 340, mass: 0.9 }),
        ),
      );
      grow.set(withDelay(50, withSpring(1, { damping: 26, stiffness: 300 })));
      contents.set(withDelay(220, withTiming(1, { duration: 150 })));
      if (flash) {
        // Lit from the very first frame, held, then faded to the resting colours.
        lit.set(
          withSequence(
            withTiming(1, { duration: 0 }),
            withDelay(200, withTiming(0, { duration: 200, easing: Easing.out(Easing.quad) })),
          ),
        );
      }
    } else {
      contents.set(withTiming(0, { duration: 80 }));
      grow.set(
        withDelay(50, withSpring(0, { damping: 22, stiffness: 300, overshootClamping: true })),
      );
      pop.set(withDelay(130, withTiming(0, { duration: 140, easing: Easing.inOut(Easing.sin) })));
    }
  }, [open, flash, pop, grow, contents, lit]);

  const down = direction === 'down';
  const anchor = down ? { top: 0 } : { bottom: 0 };

  const popStyle = useAnimatedStyle(() => ({
    opacity: pop.value < 0.15 ? pop.value / 0.15 : 1,
    transform: [{ scale: pop.value }],
  }));

  const fillStyle = useAnimatedStyle(() => ({
    backgroundColor: flash ? interpolateColor(lit.value, [0, 1], [color, flash]) : color,
  }));

  // Takes the values as arguments: a style only re-runs for shared values it reads itself.
  const boxHeight = (full: number, progress: number) => {
    'worklet';
    return COLLAPSED_HEIGHT + (full - COLLAPSED_HEIGHT) * progress;
  };

  const middleStyle = useAnimatedStyle(() => {
    const height = boxHeight(fullHeight.value, grow.value);
    // +1 overlaps half a point into each cap so no seam shows.
    return { transform: [{ scaleY: Math.max(height - radius * 2 + 1, 0) / MIDDLE_HEIGHT }] };
  });

  const farCapStyle = useAnimatedStyle(() => {
    const height = boxHeight(fullHeight.value, grow.value);
    return { transform: [{ translateY: (down ? 1 : -1) * (height - radius) }] };
  });

  const contentsStyle = useAnimatedStyle(() => ({ opacity: contents.value }));

  const onContentsLayout = (event: LayoutChangeEvent) => {
    fullHeight.set(event.nativeEvent.layout.height);
  };

  const nearCorners = down
    ? { borderTopLeftRadius: radius, borderTopRightRadius: radius }
    : { borderBottomLeftRadius: radius, borderBottomRightRadius: radius };
  const farCorners = down
    ? { borderBottomLeftRadius: radius, borderBottomRightRadius: radius }
    : { borderTopLeftRadius: radius, borderTopRightRadius: radius };

  return (
    <Animated.View
      pointerEvents={open ? 'auto' : 'none'}
      accessibilityElementsHidden={!open}
      importantForAccessibility={open ? 'auto' : 'no-hide-descendants'}
      style={[
        { width, transformOrigin: [originX, down ? 0 : '100%', 0] },
        style,
        popStyle,
      ]}>
      {/* The finished menu, with its shadow, fades in behind the pieces once grown. */}
      <Animated.View
        style={[
          StyleSheet.absoluteFill,
          { borderRadius: radius, boxShadow: shadow },
          fillStyle,
          contentsStyle,
        ]}
      />
      <Animated.View style={[styles.piece, anchor, { height: radius }, nearCorners, fillStyle]} />
      <Animated.View
        style={[
          styles.piece,
          down ? { top: radius - 0.5 } : { bottom: radius - 0.5 },
          { height: MIDDLE_HEIGHT, transformOrigin: down ? 'top' : 'bottom' },
          fillStyle,
          middleStyle,
        ]}
      />
      <Animated.View
        style={[styles.piece, anchor, { height: radius }, farCorners, fillStyle, farCapStyle]}
      />
      <LitContext.Provider value={lit}>
        <Animated.View onLayout={onContentsLayout} style={contentsStyle}>
          {children}
        </Animated.View>
      </LitContext.Provider>
    </Animated.View>
  );
}

// An option's label colour: `flash` while the menu is lit, fading to `base` with the box.
export function usePopMenuFlashColor(base: string, flash?: string) {
  const lit = useContext(LitContext);
  return useAnimatedStyle(() => ({
    color: flash && lit ? interpolateColor(lit.value, [0, 1], [base, flash]) : base,
  }));
}

const styles = StyleSheet.create({
  piece: {
    position: 'absolute',
    left: 0,
    right: 0,
  },
});
