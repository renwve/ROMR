import { Image } from 'expo-image';
import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  cancelAnimation,
  Extrapolation,
  interpolate,
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';

import { ScalePressable } from '@/components/ScalePressable';
import { AnimatedSquircle } from '@/components/Squircle';
import { PRESS_IN, SETTLE } from '@/constants/motion';
import { colors } from '@/constants/theme';
import { useDirectionLock } from '@/hooks/useDirectionLock';
import { CollectionCard } from './CollectionCard';

// The button at rest ("Default"): as tall as the card, 80pt wide.
const BUTTON_WIDTH = 80;
const BUTTON_HEIGHT = 100;
const GAP = 2;
// How much the card narrows to show the whole delete button.
const OPEN = BUTTON_WIDTH + GAP;
// Stretched 40pt wider than at rest, the button turns red
// ("Confirmed/Pressed") and letting go deletes the collection.
const CONFIRM = OPEN + 40;
// The button moves this fraction of the finger's distance, so it takes a
// deliberate drag (about 140pt) to pull it all the way out.
const DRAG_RESISTANCE = 0.6;
// A flick faster than this (points per second) opens or closes it outright.
const FLICK_SPEED = 500;

// Figma "Saved Card" / "Delete Collection" with the "Delete Button - Collection
// Card" component set. Swiping a collection left narrows it and grows the
// button beside it, pinned to the screen's right edge, from a sliver ("Drag
// Start") into its rest size ("Default"). Tapping the button, or stretching it 40pt
// wider than that, turns it red ("Confirmed/Pressed") and deletes the collection;
// past its rest size the button stretches wider with the drag. Swiping right (or
// tapping the card) puts it away again. Only one is open at a time: `open`
// comes from the page.
export function DeletableCollection({
  name,
  count,
  open,
  onOpenChange,
  onDelete,
}: {
  name: string;
  count: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDelete: () => void;
}) {
  const reveal = useSharedValue(0);
  const start = useSharedValue(0);
  // 0 = pink, 1 = red ("Confirmed/Pressed").
  const confirmed = useSharedValue(0);

  // Follows the page closing this one (because another opened).
  useEffect(() => {
    reveal.set(withSpring(open ? OPEN : 0, SETTLE));
  }, [open, reveal]);

  // A tap turns it red first, then deletes, so the red is seen as it fades out.
  const confirm = () => {
    confirmed.set(withTiming(1, PRESS_IN));
    setTimeout(onDelete, PRESS_IN.duration);
  };

  const swipe = useDirectionLock('horizontal')
    .onStart(() => {
      'worklet';
      cancelAnimation(reveal);
      start.set(reveal.get());
    })
    .onUpdate((event) => {
      'worklet';
      // The button lags the finger the whole way; it can't go right of closed.
      const next = Math.max(0, start.get() - event.translationX * DRAG_RESISTANCE);
      reveal.set(next);
      const past = next >= CONFIRM ? 1 : 0;
      if (past !== confirmed.get()) confirmed.set(withTiming(past, PRESS_IN));
    })
    .onEnd((event) => {
      'worklet';
      if (reveal.get() >= CONFIRM) {
        scheduleOnRN(onDelete);
        return;
      }
      const flick = Math.abs(event.velocityX) > FLICK_SPEED;
      const opening = flick ? event.velocityX < 0 : reveal.get() > OPEN / 2;
      reveal.set(withSpring(opening ? OPEN : 0, SETTLE));
      scheduleOnRN(onOpenChange, opening);
    });

  // The card narrows from the right to make room for the button.
  const cardStyle = useAnimatedStyle(() => ({ marginRight: reveal.get() }));
  // The button fills the room the card gives up, less the gap: a 1pt sliver as
  // it starts, 80pt once open, wider still when dragged past that.
  const buttonStyle = useAnimatedStyle(() => ({
    width: Math.max(0, reveal.get() - GAP),
    backgroundColor: interpolateColor(confirmed.get(), [0, 1], [colors.pink200, colors.deleteRed]),
  }));
  // "Drag Start" has no icon; it's there by the time the button is fully out.
  const trashStyle = useAnimatedStyle(() => ({
    opacity: interpolate(reveal.get(), [OPEN / 2, OPEN], [0, 1], Extrapolation.CLAMP),
  }));

  return (
    <GestureDetector gesture={swipe}>
      <View style={styles.row}>
        <Animated.View style={cardStyle}>
          <CollectionCard
            name={name}
            count={count}
            onPress={open ? () => onOpenChange(false) : undefined}
          />
        </Animated.View>
        <View style={styles.buttonSlot}>
          <ScalePressable
            accessibilityRole="button"
            accessibilityLabel={`Delete ${name}`}
            onPress={confirm}>
            <AnimatedSquircle style={[styles.button, buttonStyle]}>
              <Animated.View style={trashStyle}>
                <Image source={require('@/assets/icons/trash.svg')} style={styles.trash} />
              </Animated.View>
            </AnimatedSquircle>
          </ScalePressable>
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
  trash: {
    width: 32,
    height: 32,
  },
});
