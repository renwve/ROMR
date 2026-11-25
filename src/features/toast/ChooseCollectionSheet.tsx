import { useEffect } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  cancelAnimation,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { scheduleOnRN } from 'react-native-worklets';

import { ScalePressable } from '@/components/ScalePressable';
import { rubberBand, SETTLE, SLIDE } from '@/constants/motion';
import { colors, fonts, shadows } from '@/constants/theme';
import { useCollections } from '@/features/saved/CollectionsContext';
import { useSaves } from '@/features/saved/SavesContext';

// Figma "Choose Collection": the sheet floats this far above the bottom of the
// screen (or of the system's own bar, if that's taller).
const BOTTOM = 24;
// Its shadow reaches about this far past its edges, so hiding it slides it this
// much further than its own height.
const SHADOW_REACH = 30;
// Dragged down this far, or flicked down this fast, it's dismissed.
const DISMISS_DISTANCE = 80;
const DISMISS_SPEED = 500;
// With many collections the list scrolls rather than the sheet growing past
// this share of the screen.
const MAX_LIST_SHARE = 0.5;

// Figma "Choose Collection": the Plan Saved toast's "Edit". A sheet that slides
// up over everything (the nav bar included) listing The Everything Collection
// and the user's own collections, each saying whether the rec is in it ("Saved",
// blue900) or not ("Add", gray400); tapping a row puts the rec in or takes it
// out. (Taking it out of The Everything Collection un-hearts it.) Tapping
// outside the sheet, or swiping it down, closes it.
export function ChooseCollectionSheet({
  saveId,
  open,
  onClose,
  onClosed,
}: {
  saveId: string;
  open: boolean;
  onClose: () => void;
  // Called once it has slid away after closing.
  onClosed: () => void;
}) {
  const insets = useSafeAreaInsets();
  const { height: screenHeight } = useWindowDimensions();
  const { isSaved, toggleSave } = useSaves();
  const { collections, toggleInCollection } = useCollections();
  const bottom = Math.max(BOTTOM, insets.bottom);
  // How far below its resting spot it is; starts off the bottom of the screen.
  const hidden = useSharedValue(screenHeight);
  const drop = useSharedValue(screenHeight);

  useEffect(() => {
    if (open) {
      drop.set(withTiming(0, SLIDE));
    } else {
      drop.set(
        withTiming(hidden.get(), SLIDE, (finished) => {
          if (finished) scheduleOnRN(onClosed);
        }),
      );
    }
  }, [open, drop, hidden, onClosed]);

  const swipe = Gesture.Pan()
    .activeOffsetY(8)
    .onStart(() => {
      cancelAnimation(drop);
    })
    .onUpdate((event) => {
      // Follows the finger down; resists being pulled up.
      const dy = event.translationY;
      drop.set(dy >= 0 ? dy : -rubberBand(-dy, hidden.get()));
    })
    .onEnd((event) => {
      if (event.translationY > DISMISS_DISTANCE || event.velocityY > DISMISS_SPEED) {
        scheduleOnRN(onClose);
      } else {
        drop.set(withSpring(0, SETTLE));
      }
    });

  const sheetStyle = useAnimatedStyle(() => ({ transform: [{ translateY: drop.get() }] }));

  const rows = [
    {
      key: 'everything',
      name: 'The Everything Collection',
      saved: isSaved(saveId),
      toggle: () => toggleSave(saveId),
    },
    ...collections.map((collection) => ({
      key: collection.id,
      name: collection.name,
      saved: collection.saveIds.includes(saveId),
      toggle: () => toggleInCollection(collection.id, saveId),
    })),
  ];

  return (
    <View style={[StyleSheet.absoluteFill, { pointerEvents: open ? 'auto' : 'none' }]}>
      {/* Not dimmed (Figma shows the page as it is); a tap on it closes the sheet. */}
      <Pressable style={StyleSheet.absoluteFill} accessibilityLabel="Close" onPress={onClose} />
      <GestureDetector gesture={swipe}>
        <Animated.View
          style={[styles.sheet, { bottom }, sheetStyle]}
          onLayout={(event) => hidden.set(event.nativeEvent.layout.height + bottom + SHADOW_REACH)}>
          <View style={styles.heading}>
            <View style={styles.handle} />
            <Text style={styles.title}>Save to a Collection</Text>
          </View>
          <ScrollView
            style={{ maxHeight: screenHeight * MAX_LIST_SHARE }}
            contentContainerStyle={styles.list}
            showsVerticalScrollIndicator={false}>
            {rows.map((row) => (
              <ScalePressable
                key={row.key}
                accessibilityRole="button"
                accessibilityState={{ selected: row.saved }}
                accessibilityLabel={row.name}
                onPress={row.toggle}
                contentStyle={styles.row}>
                <Text style={styles.name} numberOfLines={1}>
                  {row.name}
                </Text>
                <Text style={[styles.status, row.saved && styles.statusSaved]}>
                  {row.saved ? 'Saved' : 'Add'}
                </Text>
              </ScalePressable>
            ))}
          </ScrollView>
        </Animated.View>
      </GestureDetector>
    </View>
  );
}

const styles = StyleSheet.create({
  sheet: {
    position: 'absolute',
    left: 16,
    right: 16,
    gap: 36,
    paddingTop: 16,
    paddingHorizontal: 16,
    // Figma pads 50pt but clips the sheet at 231pt tall, which leaves 28.
    paddingBottom: 28,
    borderWidth: 1,
    borderColor: colors.white200,
    borderRadius: 24,
    backgroundColor: colors.white100,
    boxShadow: shadows.mediumSoft,
  },
  heading: {
    alignItems: 'center',
    gap: 12,
  },
  handle: {
    width: 50,
    height: 3,
    borderRadius: 100,
    backgroundColor: colors.blue900,
  },
  title: {
    fontFamily: fonts.semiBold,
    fontSize: 16,
    lineHeight: 20,
    letterSpacing: -0.8,
    color: colors.blue900,
  },
  list: {
    gap: 4,
  },
  // Figma component "Destination card": 56pt tall, 4pt inside a gray200 outline
  // and 12pt more around the text.
  row: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: colors.gray200,
    borderRadius: 12,
    backgroundColor: colors.white100,
  },
  name: {
    flexShrink: 1,
    fontFamily: fonts.regular,
    fontSize: 16,
    lineHeight: 20,
    letterSpacing: -0.8,
    color: colors.blue900,
  },
  status: {
    fontFamily: fonts.medium,
    fontSize: 14,
    lineHeight: 18,
    letterSpacing: -0.7,
    color: colors.gray400,
  },
  statusSaved: {
    color: colors.blue900,
  },
});
