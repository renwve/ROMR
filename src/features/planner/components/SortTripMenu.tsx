import { Image } from 'expo-image';
import { useEffect, useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

import { PopMenu } from '@/components/PopMenu';
import { colors, fonts } from '@/constants/theme';
import { icons } from '../assets';
import { useSetPlannerOverlay } from '../PlannerOverlay';
import { TRIP_STATUSES, type TripStatus } from '../trips';

export type TripFilter = 'All' | TripStatus;

const OPTIONS: TripFilter[] = ['All', ...TRIP_STATUSES];
const MENU_WIDTH = 200;

export function filterLabel(filter: TripFilter) {
  return filter === 'All' ? 'All Trips' : filter;
}

type MenuState = { open: boolean; x: number; y: number; originX: number };

// "All Trips ⌄" and the "Sort Trip Dropdown" it pops open.
export function SortTripMenu({
  value,
  onChange,
}: {
  value: TripFilter;
  onChange: (filter: TripFilter) => void;
}) {
  const trigger = useRef<View>(null);
  const [menu, setMenu] = useState<MenuState | null>(null);
  const setOverlay = useSetPlannerOverlay();
  const pressed = useSharedValue(1);

  const openMenu = () =>
    trigger.current?.measureInWindow((x, y, width, height) =>
      setMenu({ open: true, x, y: y + height + 8, originX: width / 2 }),
    );
  const closeMenu = () => setMenu((m) => (m ? { ...m, open: false } : m));

  // The menu stays mounted after its first open; `open` only drives its animation.
  useEffect(() => {
    if (!menu) return;
    const select = (filter: TripFilter) => {
      onChange(filter);
      setMenu((m) => (m ? { ...m, open: false } : m));
    };
    setOverlay(
      <>
        {menu.open ? (
          <Pressable
            style={StyleSheet.absoluteFill}
            onPressIn={() => setMenu((m) => (m ? { ...m, open: false } : m))}
          />
        ) : null}
        <PopMenu
          open={menu.open}
          direction="down"
          width={MENU_WIDTH}
          originX={menu.originX}
          designHeight={222}
          color={colors.white100}
          flash={colors.blue300}
          shadow="0px 1px 4px 0px rgba(0, 0, 0, 0.2)"
          style={{ position: 'absolute', top: menu.y, left: menu.x }}>
          <View style={styles.options}>
            {OPTIONS.map((option) => {
              const selected = option === value;
              return (
                <Pressable
                  key={option}
                  accessibilityRole="menuitem"
                  accessibilityState={{ selected }}
                  onPress={() => select(option)}
                  hitSlop={5}
                  style={styles.option}>
                  <Text style={[styles.optionLabel, selected && styles.optionSelected]}>
                    {filterLabel(option)}
                  </Text>
                  {selected ? <Image source={icons.check} style={styles.check} /> : null}
                </Pressable>
              );
            })}
          </View>
        </PopMenu>
      </>,
    );
  }, [menu, value, onChange, setOverlay]);

  useEffect(() => () => setOverlay(null), [setOverlay]);

  const triggerStyle = useAnimatedStyle(() => ({ transform: [{ scale: pressed.value }] }));

  return (
    <View ref={trigger} collapsable={false}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`Showing ${filterLabel(value)}. Change category`}
        onPress={menu?.open ? closeMenu : openMenu}
        onPressIn={() => pressed.set(withSpring(0.9))}
        onPressOut={() => pressed.set(withSpring(1))}>
        <Animated.View style={[styles.trigger, triggerStyle]}>
          <Image source={icons.caretDown} style={styles.caret} />
          <Text style={styles.triggerLabel}>{filterLabel(value)}</Text>
        </Animated.View>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  trigger: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  caret: {
    width: 20,
    height: 20,
  },
  triggerLabel: {
    fontFamily: fonts.boldItalic,
    fontSize: 24,
    letterSpacing: -0.96,
    color: colors.blue900,
  },
  options: {
    padding: 16,
    gap: 10,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  optionLabel: {
    fontFamily: fonts.boldItalic,
    fontSize: 24,
    letterSpacing: -0.96,
    color: colors.gray400,
  },
  optionSelected: {
    color: colors.blue900,
  },
  check: {
    width: 24,
    height: 24,
  },
});
