import { Image } from 'expo-image';
import { router } from 'expo-router';
import { useEffect, useRef } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors, fonts } from '@/constants/theme';
import { useNewPlan } from '@/features/new-plan/NewPlanContext';

// Figma "Frame 152": a 24pt icon each side of a centred title, 16pt padding,
// directly under the status bar.
function HeaderRow({
  left,
  title,
  right,
  strongTitle = false,
}: {
  left: React.ReactNode;
  // A string, or a title of the page's own (Daily Rec's crossfading one).
  title: React.ReactNode;
  right: React.ReactNode;
  // A bold navy title (Saved) instead of the semibold gray one (Explore).
  strongTitle?: boolean;
}) {
  return (
    <View style={styles.row}>
      {left}
      {typeof title === 'string' ? (
        <Text style={[styles.title, strongTitle && styles.titleStrong]}>{title}</Text>
      ) : (
        title
      )}
      {right}
    </View>
  );
}

// Explore's header: the R mark, "Hi, Roamer" and notifications.
export function HomeHeader() {
  return (
    <HeaderRow
      left={<Image source={require('@/assets/icons/romr-r.svg')} style={styles.icon} />}
      title="Hi, Roamer"
      right={
        <Pressable accessibilityRole="button" accessibilityLabel="Notifications" hitSlop={10}>
          <Image source={require('@/assets/icons/bell.svg')} style={styles.icon} />
        </Pressable>
      }
    />
  );
}

// Figma "New Plan": shown while the trip input is focused. X leaves New Plan.
export function NewPlanHeader() {
  const { close } = useNewPlan();
  return (
    <HeaderRow
      left={
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Close"
          hitSlop={10}
          onPress={close}>
          <Image source={require('@/assets/icons/x.svg')} style={styles.icon} />
        </Pressable>
      }
      title="New Plan"
      right={
        <Pressable accessibilityRole="button" accessibilityLabel="More options" hitSlop={10}>
          <Image source={require('@/assets/icons/dots-three.svg')} style={styles.icon} />
        </Pressable>
      }
    />
  );
}

// Figma "Planner": the R mark, "Plan your trips" and a plus that starts a New
// Plan: the chat opens with the keyboard up, as if the nav bar's trip input had
// been tapped.
export function PlannerHeader() {
  const { inputRef } = useNewPlan();
  return (
    <HeaderRow
      left={<Image source={require('@/assets/icons/romr-r.svg')} style={styles.icon} />}
      title="Plan your trips"
      strongTitle
      right={
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="New plan"
          hitSlop={10}
          onPress={() => inputRef.current?.focus()}>
          <Image source={require('@/assets/icons/plus-24.svg')} style={styles.icon} />
        </Pressable>
      }
    />
  );
}

// Figma "Saved": the R mark, "Saved Plans" and a plus that opens New Collection.
export function SavedHeader() {
  return (
    <HeaderRow
      left={<Image source={require('@/assets/icons/romr-r.svg')} style={styles.icon} />}
      title="Saved Plans"
      strongTitle
      right={
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="New collection"
          hitSlop={10}
          onPress={() => router.push('/new-collection')}>
          <Image source={require('@/assets/icons/plus-24.svg')} style={styles.icon} />
        </Pressable>
      }
    />
  );
}

// Figma "Saved - Open Collection": back and the collection's name, with nothing
// on the right (an empty space keeps the name centred).
export function CollectionHeader({ title }: { title: string }) {
  return (
    <HeaderRow
      left={
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Back"
          hitSlop={10}
          onPress={() => router.back()}>
          <Image source={require('@/assets/icons/caret-left.svg')} style={styles.icon} />
        </Pressable>
      }
      title={title}
      strongTitle
      right={<View style={styles.icon} />}
    />
  );
}

// How the Daily Rec header's title crossfades (not specified in Figma).
const TITLE_FADE = { duration: 200, easing: Easing.out(Easing.quad) };

// Figma "Explore/Home - Daily Recs": back, "Daily Rec" and share (which doesn't
// do anything yet). Once the page's tabs have pinned under it (`showPlace`), the
// title crossfades to the place's name ("Oia, Greece", as in Figma "Explore/Home
// - Highlights"), and back to "Daily Rec" when the page is scrolled back up.
export function DailyRecHeader({ place, showPlace }: { place: string; showPlace: boolean }) {
  const shown = useSharedValue(showPlace ? 1 : 0);

  useEffect(() => {
    shown.set(withTiming(showPlace ? 1 : 0, TITLE_FADE));
  }, [shown, showPlace]);

  const placeStyle = useAnimatedStyle(() => ({ opacity: shown.get() }));
  const dailyRecStyle = useAnimatedStyle(() => ({ opacity: 1 - shown.get() }));

  return (
    <HeaderRow
      left={
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Back"
          hitSlop={10}
          onPress={() => router.back()}>
          <Image source={require('@/assets/icons/caret-left.svg')} style={styles.icon} />
        </Pressable>
      }
      title={
        <View style={styles.crossfade} accessible accessibilityRole="header">
          <Animated.Text
            style={[styles.title, styles.titleStrong, dailyRecStyle]}
            accessibilityElementsHidden={showPlace}>
            Daily Rec
          </Animated.Text>
          <Animated.Text
            style={[styles.title, styles.titleStrong, styles.crossfadeTop, placeStyle]}
            numberOfLines={1}
            accessibilityElementsHidden={!showPlace}>
            {place}
          </Animated.Text>
        </View>
      }
      right={
        <Pressable accessibilityRole="button" accessibilityLabel="Share" hitSlop={10}>
          <Image source={require('@/assets/icons/upload-simple.svg')} style={styles.icon} />
        </Pressable>
      }
    />
  );
}

// The check turning on: a dip to 0.9 in anticipation, a pop to 1.2, then a
// bouncy settle back to its size.
const CHECK_DIP = { duration: 90, easing: Easing.out(Easing.quad) };
const CHECK_POP = { duration: 140, easing: Easing.out(Easing.quad) };
const CHECK_SETTLE = { dampingRatio: 0.45, duration: 450 };

// Figma "Saved - New Collection" / "Edit Collection": X closes, the check saves.
// The check is disabled, in gray300, until `canSave`; when it turns on (the
// user has started a name, or changed the old one) it pops.
export function NewCollectionHeader({
  title = 'New Collection',
  onClose,
  onSave,
  canSave,
}: {
  title?: string;
  onClose: () => void;
  onSave: () => void;
  canSave: boolean;
}) {
  const checkScale = useSharedValue(1);
  const wasSavable = useRef(canSave);

  useEffect(() => {
    if (canSave && !wasSavable.current) {
      checkScale.set(
        withSequence(
          withTiming(0.9, CHECK_DIP),
          withTiming(1.2, CHECK_POP),
          withSpring(1, CHECK_SETTLE),
        ),
      );
    }
    wasSavable.current = canSave;
  }, [canSave, checkScale]);

  const checkStyle = useAnimatedStyle(() => ({ transform: [{ scale: checkScale.get() }] }));

  return (
    <HeaderRow
      left={
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Close"
          hitSlop={10}
          onPress={onClose}>
          <Image source={require('@/assets/icons/x-navy.svg')} style={styles.icon} />
        </Pressable>
      }
      title={title}
      strongTitle
      right={
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Create collection"
          accessibilityState={{ disabled: !canSave }}
          disabled={!canSave}
          hitSlop={10}
          onPress={onSave}>
          <Animated.View style={checkStyle}>
            <Image
              source={
                canSave
                  ? require('@/assets/icons/check.svg')
                  : require('@/assets/icons/check-gray.svg')
              }
              style={styles.icon}
            />
          </Animated.View>
        </Pressable>
      }
    />
  );
}

// Clears the status bar, which every page draws under.
export function StatusBarSpace() {
  return <View style={{ height: useSafeAreaInsets().top }} />;
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  title: {
    fontFamily: fonts.semiBold,
    fontSize: 16,
    lineHeight: 20,
    letterSpacing: -0.8,
    color: colors.gray400,
  },
  titleStrong: {
    fontFamily: fonts.bold,
    color: colors.blue900,
  },
  // Daily Rec's two titles, one over the other, centred between the icons.
  // Long place names are cut off with an ellipsis rather than pushing them.
  crossfade: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 16,
  },
  crossfadeTop: {
    position: 'absolute',
    left: 0,
    right: 0,
    textAlign: 'center',
  },
  icon: {
    width: 24,
    height: 24,
  },
});
