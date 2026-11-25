import { StyleSheet, Text, View } from 'react-native';

import { colors, fonts } from '@/constants/theme';
import type { TripStatus } from '../trips';

// Figma component "Trip Card Status". Ready is set smaller than the other three.
const labelStyles: Record<TripStatus, { color: string; fontSize: number; letterSpacing: number }> = {
  Ready: { color: colors.green, fontSize: 14, letterSpacing: -0.56 },
  Planning: { color: colors.blue300, fontSize: 16, letterSpacing: -0.64 },
  Cancelled: { color: colors.red, fontSize: 16, letterSpacing: -0.64 },
  Finished: { color: colors.dark800, fontSize: 16, letterSpacing: -0.64 },
};

export function TripStatusChip({ status }: { status: TripStatus }) {
  return (
    <View style={styles.chip}>
      <Text style={[styles.label, labelStyles[status]]}>{status}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  chip: {
    backgroundColor: colors.white100,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontFamily: fonts.medium,
  },
});
