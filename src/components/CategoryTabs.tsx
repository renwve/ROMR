import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

import { ScalePressable } from '@/components/ScalePressable';
import { SLIDE } from '@/constants/motion';
import { colors, fonts } from '@/constants/theme';

const GAP = 8;
const UNDERLINE = 2;

// Figma "Frame 147": Explore's Travel / Food / Hang Out switcher. One underline
// slides between the options instead of each drawing its own border.
export function CategoryTabs<T extends string>({
  options,
  value,
  onChange,
}: {
  options: readonly T[];
  value: T;
  onChange: (option: T) => void;
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
            style={styles.tab}>
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
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
    borderRadius: 8,
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
    color: colors.dark800,
  },
  labelIdle: {
    fontFamily: fonts.medium,
    color: colors.gray700,
  },
});
