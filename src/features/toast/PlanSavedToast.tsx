import { Image } from 'expo-image';
import { router } from 'expo-router';
import { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  cancelAnimation,
  Extrapolation,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSequence,
  withSpring,
  withTiming,
  type SharedValue,
} from 'react-native-reanimated';

import { rubberBand, SLIDE } from '@/constants/motion';
import { colors, fonts, shadows } from '@/constants/theme';
import { useToast } from './ToastContext';

const WIDTH = 300;
const HEIGHT = 52;
// Figma "Screen w/ Toast": it sits this far above the nav bar.
const ABOVE_NAV = 12;
// Hidden, it's tucked behind the nav bar, its top edge level with the bar's.
// (The bar is always taller than the toast, so none of it shows below.)
const HIDDEN = ABOVE_NAV + HEIGHT;
// The last stretch into hiding it fades out, so its shadow doesn't peek over
// the bar's top edge.
const FADE = 12;
// How long it stays up once it has popped in.
const HOLD_MS = 2000;
// Pops up from behind the nav bar with a small bounce.
const POP = { dampingRatio: 0.6, duration: 550 };
// Saving again while it's up, it ducks back behind the bar this fast first.
const DUCK = { duration: 150 };
// Dragged down this far, or flicked down this fast, it's dismissed.
const DISMISS_DISTANCE = HEIGHT / 2;
const DISMISS_SPEED = 500;

// Pop up, hold for HOLD_MS, then tuck away behind the bar.
function popUpAndHold() {
  'worklet';
  return withSequence(withSpring(0, POP), withDelay(HOLD_MS, withTiming(HIDDEN, SLIDE)));
}

// Figma "Plan Saved Toast": shown whenever a heart saves a plan. It pops up
// from behind the nav bar to sit ABOVE_NAV above it, wherever the bar's top is
// (its height changes with the page; `navHeight` follows it), stays up for
// HOLD_MS and then tucks away again. Saving another plan while it's up pops it
// afresh. It can be swiped down to dismiss it sooner. Tapping it opens Saved;
// tapping "Edit" opens Figma "Choose Collection" for the plan just saved.
// Either way it tucks away.
// The nav bar draws it behind itself.
export function PlanSavedToast({ navHeight }: { navHeight: SharedValue<number> }) {
  const { planSavedKey, openChooseCollection } = useToast();
  // How far below its resting spot it is: 0 = up, HIDDEN = tucked away.
  const drop = useSharedValue(HIDDEN);
  // Where "Edit" starts across the toast; taps from there on are its own.
  const editLeft = useSharedValue(WIDTH);

  useEffect(() => {
    if (planSavedKey === 0) return;
    // Already (partly) up: duck back behind the bar, then pop up again, so
    // the new save shows as a new toast.
    drop.set(
      drop.get() < HIDDEN ? withSequence(withTiming(HIDDEN, DUCK), popUpAndHold()) : popUpAndHold(),
    );
  }, [planSavedKey, drop]);

  const swipe = Gesture.Pan()
    .activeOffsetY(8)
    .onStart(() => {
      cancelAnimation(drop);
    })
    .onUpdate((event) => {
      // Follows the finger down; resists being pulled up.
      const dy = event.translationY;
      drop.set(dy >= 0 ? Math.min(dy, HIDDEN) : -rubberBand(-dy, HEIGHT));
    })
    .onEnd((event) => {
      const dismiss = event.translationY > DISMISS_DISTANCE || event.velocityY > DISMISS_SPEED;
      drop.set(dismiss ? withTiming(HIDDEN, SLIDE) : popUpAndHold());
    });

  const tap = Gesture.Tap()
    .runOnJS(true)
    .onEnd((event, success) => {
      if (!success) return;
      drop.set(withTiming(HIDDEN, SLIDE));
      if (event.x >= editLeft.get()) openChooseCollection();
      else router.navigate('/saved');
    });

  const style = useAnimatedStyle(() => ({
    bottom: navHeight.get() + ABOVE_NAV,
    opacity: interpolate(drop.get(), [HIDDEN - FADE, HIDDEN], [1, 0], Extrapolation.CLAMP),
    transform: [{ translateY: drop.get() }],
  }));

  return (
    <GestureDetector gesture={Gesture.Race(swipe, tap)}>
      <Animated.View style={[styles.toast, style]}>
        <View style={styles.message}>
          <Image source={require('@/assets/icons/heart-saved.svg')} style={styles.heart} />
          <Text style={styles.text}>Plan Saved to Collection</Text>
        </View>
        <Text style={styles.text} onLayout={(event) => editLeft.set(event.nativeEvent.layout.x)}>
          Edit
        </Text>
      </Animated.View>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  toast: {
    position: 'absolute',
    alignSelf: 'center',
    width: WIDTH,
    height: HEIGHT,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    // Figma's stroke sits inside the frame, so the 16pt padding includes it.
    padding: 15,
    borderWidth: 1,
    borderColor: colors.white200,
    borderRadius: 100,
    backgroundColor: colors.white100,
    boxShadow: shadows.soft,
  },
  message: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  heart: {
    width: 20,
    height: 20,
  },
  text: {
    fontFamily: fonts.medium,
    fontSize: 14,
    // A line as tall as the heart, with Android's extra font padding off, so
    // the text centres level with the icon.
    lineHeight: 20,
    includeFontPadding: false,
    textAlignVertical: 'center',
    letterSpacing: -0.7,
    color: colors.blue900,
  },
});
