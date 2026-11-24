import { Image, type ImageSource } from 'expo-image';
import type { Tabs } from 'expo-router';
import { useEffect, useState, type ComponentProps } from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';
import Animated, {
  Extrapolation,
  interpolate,
  interpolateColor,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withTiming,
  type SharedValue,
} from 'react-native-reanimated';

import { ScalePressable } from '@/components/ScalePressable';
import { SLIDE } from '@/constants/motion';
import { colors, fonts, shadows } from '@/constants/theme';
import { useNewPlan } from '@/features/new-plan/NewPlanContext';
import { PlanSavedToast } from '@/features/toast/PlanSavedToast';
import { useKeyboardHeight } from '@/hooks/useKeyboardHeight';

type TabBarProps = Parameters<NonNullable<ComponentProps<typeof Tabs>['tabBar']>>[0];

const TABS: Record<string, { label: string; icon: ImageSource; activeIcon: ImageSource }> = {
  index: {
    label: 'Explore',
    icon: require('@/assets/icons/magnifying-glass.svg'),
    activeIcon: require('@/assets/icons/magnifying-glass-active.svg'),
  },
  planner: {
    label: 'Planner',
    icon: require('@/assets/icons/globe-hemisphere-west.svg'),
    activeIcon: require('@/assets/icons/globe-hemisphere-west-active.svg'),
  },
  saved: {
    label: 'Saved',
    icon: require('@/assets/icons/heart.svg'),
    activeIcon: require('@/assets/icons/heart-active.svg'),
  },
  account: {
    label: 'Account',
    icon: require('@/assets/icons/user-circle.svg'),
    activeIcon: require('@/assets/icons/user-circle-active.svg'),
  },
};

const SEND_ICON = require('@/assets/icons/paper-plane-tilt.svg');
const SEND_ICON_EMPTY = require('@/assets/icons/paper-plane-tilt-empty.svg');

// Pages whose nav bar carries the "Start your trip here" input.
const PAGES_WITH_INPUT = ['index', 'planner'];

// Figma "Nav bar": 24pt off the bottom, 11pt from each side, a 4pt inner inset.
const BOTTOM = 24;
const INSET = 4;
const INPUT_ROW = 48;
const ROW_GAP = 20;
const TABS_ROW = 53;
const NAV_TABS_ONLY = INSET + TABS_ROW + INSET;
const NAV_WITH_INPUT = INSET + INPUT_ROW + ROW_GAP + TABS_ROW + INSET;
const INPUT_SECTION = NAV_WITH_INPUT - NAV_TABS_ONLY;
// The input as a card of its own ("New Plan"): the 48pt row in a 4pt inset.
export const INPUT_CARD = INSET + INPUT_ROW + INSET;
// Where the input card's bottom edge rests, level with the nav bar's top row.
const INPUT_REST = BOTTOM + NAV_WITH_INPUT - INPUT_CARD;
// In New Plan with the keyboard down ("New Plan - Keyboard Hidden") it takes
// the nav bar's place instead, BOTTOM off the screen's bottom edge.
export const PLAN_REST = BOTTOM;
// How much of the page's bottom the nav bar covers on Explore and Planner.
export const NAV_CLEARANCE = BOTTOM + NAV_WITH_INPUT;
// The same for pages without the trip input (Saved, Account).
export const NAV_TABS_CLEARANCE = BOTTOM + NAV_TABS_ONLY;
// In New Plan with the keyboard up, it floats this far above the keyboard.
export const KEYBOARD_GAP = 12;

export function NavBar({ state, navigation }: TabBarProps) {
  const current = state.routes[state.index].name;
  const hasInput = PAGES_WITH_INPUT.includes(current);
  const { active, close } = useNewPlan();

  // The selector's position in tab widths (0 = first tab); how far the input
  // section has risen out of the bar (0 = tabs only, 1 = full); and how far
  // into New Plan mode the bar is (1 = tabs put away, input on its own).
  const selector = useSharedValue(state.index);
  const inputShown = useSharedValue(hasInput ? 1 : 0);
  const planMode = useSharedValue(active ? 1 : 0);
  const [tabWidth, setTabWidth] = useState(0);

  useEffect(() => {
    selector.set(withTiming(state.index, SLIDE));
  }, [state.index, selector]);

  useEffect(() => {
    inputShown.set(withTiming(hasInput ? 1 : 0, SLIDE));
    if (!hasInput && active) close();
  }, [hasInput, active, close, inputShown]);

  useEffect(() => {
    planMode.set(withTiming(active ? 1 : 0, SLIDE));
  }, [active, planMode]);

  // The bar's height as its input section grows in and out (the toast above
  // it follows this).
  const barHeight = useDerivedValue(() => NAV_TABS_ONLY + INPUT_SECTION * inputShown.value);

  // Grows upward from the tabs, its top corners tightening from 28 to 12.
  // In New Plan it fades away, leaving the input on its own.
  const cardStyle = useAnimatedStyle(() => {
    const topRadius = interpolate(inputShown.value, [0, 1], [28, 12]);
    return {
      height: barHeight.value,
      borderTopLeftRadius: topRadius,
      borderTopRightRadius: topRadius,
      opacity: 1 - planMode.value,
    };
  });

  const selectorStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: selector.value * tabWidth }],
  }));

  return (
    <View pointerEvents="box-none" style={styles.wrap}>
      {/* First, so it's drawn behind the bar and comes out from under it. */}
      <PlanSavedToast navHeight={barHeight} />
      <Animated.View pointerEvents={active ? 'none' : 'auto'} style={[styles.card, cardStyle]}>
        <View
          style={styles.tabs}
          onLayout={(event) => setTabWidth(event.nativeEvent.layout.width / state.routes.length)}>
          {tabWidth ? (
            <Animated.View style={[styles.selector, { width: tabWidth }, selectorStyle]} />
          ) : null}
          {state.routes.map((route, index) => {
            const tab = TABS[route.name];
            if (!tab) return null;
            const focused = state.index === index;
            const onPress = () => {
              const event = navigation.emit({
                type: 'tabPress',
                target: route.key,
                canPreventDefault: true,
              });
              if (!focused && !event.defaultPrevented)
                navigation.navigate(route.name, route.params);
            };
            return (
              <TabButton
                key={route.key}
                tab={tab}
                index={index}
                focused={focused}
                selector={selector}
                onPress={onPress}
              />
            );
          })}
        </View>
      </Animated.View>
      <TripInput shown={inputShown} planMode={planMode} enabled={hasInput} />
    </View>
  );
}

// A nav button. As the selector slides over it, its icon and label fade from
// navy to white (and back as it leaves), so nothing snaps.
function TabButton({
  tab,
  index,
  focused,
  selector,
  onPress,
}: {
  tab: (typeof TABS)[string];
  index: number;
  focused: boolean;
  selector: SharedValue<number>;
  onPress: () => void;
}) {
  // How much of this button the selector covers (1 = centred on it). Takes the
  // position as an argument: a style only re-runs for shared values it reads itself.
  const coverage = (position: number) => {
    'worklet';
    return interpolate(Math.abs(position - index), [0, 1], [1, 0], Extrapolation.CLAMP);
  };
  const activeIconStyle = useAnimatedStyle(() => ({ opacity: coverage(selector.value) }));
  const iconStyle = useAnimatedStyle(() => ({ opacity: 1 - coverage(selector.value) }));
  const labelStyle = useAnimatedStyle(() => ({
    color: interpolateColor(coverage(selector.value), [0, 1], [colors.blue900, colors.white100]),
  }));

  return (
    <ScalePressable
      accessibilityRole="tab"
      accessibilityState={{ selected: focused }}
      accessibilityLabel={tab.label}
      onPress={onPress}
      style={styles.tab}
      contentStyle={styles.tabContent}>
      <View style={styles.tabIcon}>
        <Animated.View style={[StyleSheet.absoluteFill, iconStyle]}>
          <Image source={tab.icon} style={styles.tabIcon} />
        </Animated.View>
        <Animated.View style={[StyleSheet.absoluteFill, activeIconStyle]}>
          <Image source={tab.activeIcon} style={styles.tabIcon} />
        </Animated.View>
      </View>
      <Animated.Text style={[styles.tabLabel, labelStyle]}>{tab.label}</Animated.Text>
    </ScalePressable>
  );
}

// "Start your trip here". It rises out of the nav bar with the bar's top edge
// when its page opens. Focusing it starts a New Plan: it becomes a card of its
// own, rides up on the keyboard while the tab buttons are put away, and takes
// the nav bar's place when the keyboard goes down.
function TripInput({
  shown,
  planMode,
  enabled,
}: {
  shown: SharedValue<number>;
  planMode: SharedValue<number>;
  enabled: boolean;
}) {
  const { start, send, draft, setDraft, messages, inputRef } = useNewPlan();
  const keyboardHeight = useKeyboardHeight();

  const canSend = draft.trim().length > 0;
  const submit = () => {
    if (!canSend) return;
    send(draft);
    setDraft('');
  };

  const cardStyle = useAnimatedStyle(() => {
    // Resting spot: level with the nav bar's top row, or in New Plan the nav
    // bar's place. The keyboard lifts it to KEYBOARD_GAP above itself.
    const rest = interpolate(planMode.value, [0, 1], [INPUT_REST, PLAN_REST]);
    const bottom = Math.max(rest, keyboardHeight.value + KEYBOARD_GAP);
    return {
      // Rides the nav bar's growing top edge, fading in over the second half
      // so it never shows over the tabs.
      opacity: interpolate(shown.value, [0.5, 1], [0, 1], Extrapolation.CLAMP),
      transform: [{ translateY: INPUT_SECTION * (1 - shown.value) - (bottom - INPUT_REST) }],
    };
  });

  // Inside the nav bar the input borrows the bar's card; on its own it wears one.
  const outlineStyle = useAnimatedStyle(() => ({ opacity: planMode.value }));

  return (
    <Animated.View pointerEvents={enabled ? 'auto' : 'none'} style={[styles.inputCard, cardStyle]}>
      <Animated.View pointerEvents="none" style={[styles.inputOutline, outlineStyle]} />
      <View style={styles.inputRow}>
        <TextInput
          ref={inputRef}
          value={draft}
          onChangeText={setDraft}
          onFocus={start}
          onSubmitEditing={submit}
          // Sending keeps the keyboard up for the next message.
          submitBehavior="submit"
          editable={enabled}
          placeholder={messages.length ? 'Continue the plan' : 'Start your trip here'}
          placeholderTextColor={colors.gray400}
          returnKeyType="send"
          style={styles.input}
        />
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Send"
          accessibilityState={{ disabled: !canSend }}
          disabled={!canSend}
          hitSlop={12}
          onPress={submit}>
          {/* Gray while there's nothing to send (Figma "New Plan - Keyboard Up"). */}
          <Image source={canSend ? SEND_ICON : SEND_ICON_EMPTY} style={styles.icon24} />
        </Pressable>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: 'absolute',
    left: 11,
    right: 11,
    bottom: BOTTOM,
  },
  card: {
    justifyContent: 'flex-end',
    backgroundColor: colors.white100,
    borderWidth: 1,
    borderColor: colors.white200,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    // Figma's stroke sits inside the frame, so the 4pt inset includes it.
    padding: INSET - 1,
    boxShadow: shadows.soft,
  },
  tabs: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  selector: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    borderRadius: 24,
    backgroundColor: colors.blue900,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
  },
  tabContent: {
    alignItems: 'center',
    gap: 4,
  },
  tabIcon: {
    width: 20,
    height: 20,
  },
  tabLabel: {
    fontFamily: fonts.regular,
    fontSize: 10,
    lineHeight: 13,
    letterSpacing: -0.4,
  },
  inputCard: {
    position: 'absolute',
    left: 0,
    right: 0,
    // Level with the full nav bar's top edge (the bar is NAV_WITH_INPUT tall).
    bottom: NAV_WITH_INPUT - INPUT_CARD,
    padding: INSET,
  },
  inputOutline: {
    ...StyleSheet.absoluteFill,
    backgroundColor: colors.white100,
    borderWidth: 1,
    borderColor: colors.white200,
    borderRadius: 12,
    boxShadow: shadows.soft,
  },
  inputRow: {
    height: INPUT_ROW,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 12,
    borderRadius: 8,
  },
  input: {
    flex: 1,
    padding: 0,
    fontFamily: fonts.regular,
    fontSize: 16,
    lineHeight: 20,
    letterSpacing: -0.8,
    color: colors.dark800,
    // No focus ring on web; the card's outline shows focus instead.
    outlineWidth: 0,
  },
  icon24: {
    width: 24,
    height: 24,
  },
});
