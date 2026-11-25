import { Image } from 'expo-image';
import { type ComponentProps, useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

import { ScalePressable } from '@/components/ScalePressable';
import { SLIDE } from '@/constants/motion';
import { colors, fonts } from '@/constants/theme';

const GAP = 8;
const UNDERLINE = 2;
const ICON = 20;
// The icon and the gap before the label: the room the label makes for it.
const ICON_SLOT = ICON + 8;
// Far enough down that the icon is fully hidden behind the tab's bottom edge.
const ICON_HIDDEN_Y = 28;

// Showing: the icon rises out from the underline and overshoots a little.
const ICON_RISE = { dampingRatio: 0.55, duration: 550 };
const ICON_RISE_DELAY = 60;
// Hiding: it lifts first (anticipation), then drops out of sight.
const ICON_LIFT = -4;
const ICON_LIFT_MS = 110;
const ICON_DROP_MS = 180;

type IconSource = ComponentProps<typeof Image>['source'];

// Figma "Explore Top Nav" (Explore's Travel / Food / Hang Out) and "Plan Nav" (a daily
// rec's Highlights / Reviews / Guide): a row of tabs. One
// underline slides between the options; the selected one shows its icon.
export function CategoryTabs<T extends string>({
  options,
  value,
  onChange,
  icons,
}: {
  options: readonly T[];
  value: T;
  onChange: (option: T) => void;
  icons?: Record<T, IconSource>;
}) {
  const selected = Math.max(0, options.indexOf(value));
  const position = useSharedValue(selected);
  const [tabWidth, setTabWidth] = useState(0);

  useEffect(() => {
    position.set(withTiming(selected, SLIDE));
  }, [selected, position]);

  const underlineStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: position.value * (tabWidth + GAP) }],
  }));

  return (
    <View
      style={styles.row}
      onLayout={(event) => {
        const width = event.nativeEvent.layout.width;
        setTabWidth((width - GAP * (options.length - 1)) / options.length);
      }}>
      {options.map((option, index) => {
        const isSelected = index === selected;
        return (
          <ScalePressable
            key={option}
            accessibilityRole="tab"
            accessibilityState={{ selected: isSelected }}
            onPress={() => onChange(option)}
            style={styles.tab}
            contentStyle={styles.tabContent}>
            {icons ? <TabIcon source={icons[option]} selected={isSelected} /> : null}
            <Text style={[styles.label, isSelected ? styles.labelSelected : styles.labelIdle]}>
              {option}
            </Text>
          </ScalePressable>
        );
      })}
      {tabWidth ? (
        <Animated.View style={[styles.underline, { width: tabWidth }, underlineStyle]} />
      ) : null}
    </View>
  );
}

// The selected tab's icon. The label slides over to make room as it rises out
// from behind the underline; when another tab is picked it lifts, then drops
// back down out of sight and the label closes the gap.
function TabIcon({ source, selected }: { source: IconSource; selected: boolean }) {
  // Starts settled, so the first screen doesn't animate.
  const slot = useSharedValue(selected ? ICON_SLOT : 0);
  const rise = useSharedValue(selected ? 0 : ICON_HIDDEN_Y);
  // Only a change of selection animates.
  const wasSelected = useRef(selected);

  useEffect(() => {
    if (wasSelected.current === selected) return;
    wasSelected.current = selected;
    if (selected) {
      slot.set(withTiming(ICON_SLOT, SLIDE));
      rise.set(withDelay(ICON_RISE_DELAY, withSpring(0, ICON_RISE)));
    } else {
      slot.set(withDelay(ICON_LIFT_MS, withTiming(0, SLIDE)));
      rise.set(
        withSequence(
          withTiming(ICON_LIFT, { duration: ICON_LIFT_MS, easing: Easing.out(Easing.quad) }),
          withTiming(ICON_HIDDEN_Y, { duration: ICON_DROP_MS, easing: Easing.in(Easing.quad) }),
        ),
      );
    }
  }, [selected, slot, rise]);

  const slotStyle = useAnimatedStyle(() => ({ width: slot.get() }));
  const iconStyle = useAnimatedStyle(() => ({ transform: [{ translateY: rise.get() }] }));

  return (
    <Animated.View style={[styles.iconSlot, slotStyle]}>
      <Animated.View style={iconStyle}>
        <Image source={source} style={styles.icon} />
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: GAP,
    // Room for the underline under the 36pt tabs (the row is 38pt in Figma).
    paddingBottom: UNDERLINE,
  },
  tab: {
    flex: 1,
    borderRadius: 8,
    // The icons rise from, and hide behind, the tab's bottom edge.
    overflow: 'hidden',
  },
  tabContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
  },
  // The icon hangs off the slot's right edge, so it always sits just left of
  // the label, however wide the slot is mid-animation.
  iconSlot: {
    height: ICON,
    alignItems: 'flex-end',
  },
  icon: {
    width: ICON,
    height: ICON,
    marginRight: ICON_SLOT - ICON,
  },
  underline: {
    position: 'absolute',
    left: 0,
    bottom: 0,
    height: UNDERLINE,
    backgroundColor: colors.blue300,
  },
  label: {
    fontSize: 16,
    lineHeight: 20,
    letterSpacing: -0.8,
  },
  labelSelected: {
    fontFamily: fonts.semiBold,
    color: colors.blue900,
  },
  labelIdle: {
    fontFamily: fonts.medium,
    color: colors.gray700,
  },
});
