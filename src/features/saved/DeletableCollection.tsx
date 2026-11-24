import * as Haptics from 'expo-haptics';
import { StyleSheet, View } from 'react-native';
import { GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  cancelAnimation,
  Extrapolation,
  interpolate,
  interpolateColor,
  useAnimatedProps,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import Svg, { Path } from 'react-native-svg';
import { scheduleOnRN } from 'react-native-worklets';

import { AnimatedSquircle } from '@/components/Squircle';
import { colors } from '@/constants/theme';
import { useDirectionLock } from '@/hooks/useDirectionLock';
import { CollectionCard } from './CollectionCard';

// The button at its resting width ("Default"): as tall as the card, 80pt wide.
const BUTTON_WIDTH = 80;
const BUTTON_HEIGHT = 100;
const GAP = 2;
// How much the card narrows to show the button at its resting width.
const FULL = BUTTON_WIDTH + GAP;
// Stretched 40pt wider than that, the button is fully "Confirmed/Pressed"
// (pink with a red icon) and letting go deletes the collection.
const CONFIRM = FULL + 40;
// The button moves this fraction of the finger's distance, so it takes a
// deliberate drag to pull it out.
const DRAG_RESISTANCE = 0.6;
// Let go short of deleting, the card springs back to full width with a bounce.
const BOUNCE_BACK = { dampingRatio: 0.5, duration: 550 };

// Figma's Trash icon (assets/icons/trash.svg), drawn here so its colour can
// animate.
const TRASH_PATH =
  'M27 6H22V5C22 4.20435 21.6839 3.44129 21.1213 2.87868C20.5587 2.31607 19.7956 2 19 2H13C12.2044 2 11.4413 2.31607 10.8787 2.87868C10.3161 3.44129 10 4.20435 10 5V6H5C4.73478 6 4.48043 6.10536 4.29289 6.29289C4.10536 6.48043 4 6.73478 4 7C4 7.26522 4.10536 7.51957 4.29289 7.70711C4.48043 7.89464 4.73478 8 5 8H6V26C6 26.5304 6.21071 27.0391 6.58579 27.4142C6.96086 27.7893 7.46957 28 8 28H24C24.5304 28 25.0391 27.7893 25.4142 27.4142C25.7893 27.0391 26 26.5304 26 26V8H27C27.2652 8 27.5196 7.89464 27.7071 7.70711C27.8946 7.51957 28 7.26522 28 7C28 6.73478 27.8946 6.48043 27.7071 6.29289C27.5196 6.10536 27.2652 6 27 6ZM14 21C14 21.2652 13.8946 21.5196 13.7071 21.7071C13.5196 21.8946 13.2652 22 13 22C12.7348 22 12.4804 21.8946 12.2929 21.7071C12.1054 21.5196 12 21.2652 12 21V13C12 12.7348 12.1054 12.4804 12.2929 12.2929C12.4804 12.1054 12.7348 12 13 12C13.2652 12 13.5196 12.1054 13.7071 12.2929C13.8946 12.4804 14 12.7348 14 13V21ZM20 21C20 21.2652 19.8946 21.5196 19.7071 21.7071C19.5196 21.8946 19.2652 22 19 22C18.7348 22 18.4804 21.8946 18.2929 21.7071C18.1054 21.5196 18 21.2652 18 21V13C18 12.7348 18.1054 12.4804 18.2929 12.2929C18.4804 12.1054 18.7348 12 19 12C19.2652 12 19.5196 12.1054 19.7071 12.2929C19.8946 12.4804 20 12.7348 20 13V21ZM20 6H12V5C12 4.73478 12.1054 4.48043 12.2929 4.29289C12.4804 4.10536 12.7348 4 13 4H19C19.2652 4 19.5196 4.10536 19.7071 4.29289C19.8946 4.48043 20 4.73478 20 5V6Z';
const AnimatedPath = Animated.createAnimatedComponent(Path);
// The icon's colours in "Default" and "Confirmed/Pressed".
const TRASH_NAVY = colors.blue900;
const TRASH_RED = '#E92E31';

// A light tap of vibration.
function buzz() {
  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
}

// Figma "Saved Card" / "Delete Collection" with the "Delete Button - Collection
// Card" component set. While a collection is dragged left, it narrows and the
// button grows beside it, pinned to the screen's right edge, from a sliver
// ("Drag Start") to 80pt ("Default", blue with a navy icon). Dragged further,
// the button stretches wider, the phone gives a tap of vibration, and its
// colours blend into "Confirmed/Pressed" (pink with a red icon), complete 40pt
// later. Letting go there deletes the collection; letting go anywhere short of
// it hides the button again and the card bounces back to full width.
export function DeletableCollection({
  name,
  count,
  onDelete,
}: {
  name: string;
  count: string;
  onDelete: () => void;
}) {
  const reveal = useSharedValue(0);
  const start = useSharedValue(0);
  // Whether the button is wider than at rest (so it vibrates once per stretch).
  const stretched = useSharedValue(false);

  const swipe = useDirectionLock('horizontal')
    .onStart(() => {
      'worklet';
      cancelAnimation(reveal);
      start.set(Math.max(0, reveal.get()));
      stretched.set(reveal.get() > FULL);
    })
    .onUpdate((event) => {
      'worklet';
      // The button lags the finger the whole way; it can't go right of closed.
      const next = Math.max(0, start.get() - event.translationX * DRAG_RESISTANCE);
      reveal.set(next);
      const isStretched = next > FULL;
      if (isStretched !== stretched.get()) {
        stretched.set(isStretched);
        if (isStretched) scheduleOnRN(buzz);
      }
    })
    .onEnd((event) => {
      'worklet';
      if (reveal.get() >= CONFIRM) {
        scheduleOnRN(onDelete);
        return;
      }
      // Carry the finger's speed into the spring so a fast release bounces more.
      reveal.set(withSpring(0, { ...BOUNCE_BACK, velocity: -event.velocityX * DRAG_RESISTANCE }));
    });

  // The card narrows from the right to make room for the button. (On the
  // bounce it briefly overshoots past full width, off the screen's edge.)
  const cardStyle = useAnimatedStyle(() => ({ marginRight: reveal.get() }));
  // 0 = "Default" colours, 1 = "Confirmed/Pressed": blends over the 40pt stretch.
  // (A shared value, read directly below, so the styles update as it changes.)
  const confirmProgress = useDerivedValue(() =>
    interpolate(reveal.get(), [FULL, CONFIRM], [0, 1], Extrapolation.CLAMP),
  );
  // The button fills the room the card gives up, less the gap.
  const buttonStyle = useAnimatedStyle(() => ({
    width: Math.max(0, reveal.get() - GAP),
    backgroundColor: interpolateColor(
      confirmProgress.get(),
      [0, 1],
      [colors.blue100, colors.pink200],
    ),
  }));
  // The icon's colour blends from navy to red with the background.
  const trashProps = useAnimatedProps(() => ({
    fill: interpolateColor(confirmProgress.get(), [0, 1], [TRASH_NAVY, TRASH_RED]),
  }));
  // "Drag Start" has no icon; it's there by the time the button reaches 80pt.
  const trashStyle = useAnimatedStyle(() => ({
    opacity: interpolate(reveal.get(), [FULL / 2, FULL], [0, 1], Extrapolation.CLAMP),
  }));

  return (
    <GestureDetector gesture={swipe}>
      <View
        style={styles.row}
        // Screen readers can't drag, so they get deleting as an action.
        accessibilityActions={[{ name: 'delete', label: `Delete ${name}` }]}
        onAccessibilityAction={(event) => {
          if (event.nativeEvent.actionName === 'delete') onDelete();
        }}>
        <Animated.View style={cardStyle}>
          <CollectionCard name={name} count={count} />
        </Animated.View>
        <View style={styles.buttonSlot} pointerEvents="none">
          <AnimatedSquircle style={[styles.button, buttonStyle]}>
            <Animated.View style={trashStyle}>
              <Svg width={32} height={32} viewBox="0 0 32 32">
                <AnimatedPath d={TRASH_PATH} animatedProps={trashProps} />
              </Svg>
            </Animated.View>
          </AnimatedSquircle>
        </View>
      </View>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  row: {
    overflow: 'hidden',
  },
  buttonSlot: {
    position: 'absolute',
    top: 0,
    right: 0,
  },
  button: {
    height: BUTTON_HEIGHT,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    borderRadius: 32,
  },
});
