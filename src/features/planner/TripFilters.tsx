import { Image } from 'expo-image';
import { StyleSheet, Text, View } from 'react-native';

import { ScalePressable } from '@/components/ScalePressable';
import { colors, fonts } from '@/constants/theme';
import { TRIP_FILTER_ICONS, TRIP_FILTERS, type TripFilter } from './trips';

// Figma "Planner": All / Travel / Food / Hangout, which narrow the trips below to
// one kind. The selected one is blue100 with a blue300 outline.
export function TripFilters({
  value,
  onChange,
}: {
  value: TripFilter;
  onChange: (filter: TripFilter) => void;
}) {
  return (
    <View style={styles.row}>
      {TRIP_FILTERS.map((filter) => {
        const selected = filter === value;
        return (
          <ScalePressable
            key={filter}
            accessibilityRole="button"
            accessibilityState={{ selected }}
            onPress={() => onChange(filter)}
            style={styles.target}
            contentStyle={[styles.chip, selected && styles.chipSelected]}>
            <Image source={TRIP_FILTER_ICONS[filter]} style={styles.icon} />
            <Text style={styles.label}>{filter}</Text>
          </ScalePressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: 4,
    // No bottom padding: the trips below start with that space inside their
    // scroll area, so the first card's shadow has room and isn't cut off.
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  target: {
    flex: 1,
  },
  chip: {
    height: 80,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: colors.white200,
    borderRadius: 12,
    backgroundColor: colors.white100,
  },
  chipSelected: {
    borderColor: colors.blue300,
    backgroundColor: colors.blue100,
  },
  icon: {
    width: 20,
    height: 20,
  },
  label: {
    fontFamily: fonts.medium,
    fontSize: 14,
    lineHeight: 18,
    letterSpacing: -0.7,
    color: colors.blue900,
  },
});
