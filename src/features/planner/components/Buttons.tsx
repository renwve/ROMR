import { Image, type ImageSource } from 'expo-image';
import { Pressable, StyleSheet, Text } from 'react-native';

import { colors, fonts } from '@/constants/theme';

type PillButtonProps = {
  icon: ImageSource;
  label: string;
  variant?: 'blue' | 'white';
  onPress?: () => void;
};

// Rounded 44pt pill: "New Plan", "Invite", "Share".
export function PillButton({ icon, label, variant = 'blue', onPress }: PillButtonProps) {
  const white = variant === 'white';
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={[styles.pill, { backgroundColor: white ? colors.white100 : colors.blue300 }]}>
      <Image source={icon} style={styles.pillIcon} />
      <Text style={[styles.pillLabel, { color: white ? colors.blue900 : colors.white100 }]}>
        {label}
      </Text>
    </Pressable>
  );
}

// 44pt white circle holding a 24pt icon: back and list buttons in the header.
export function CircleIconButton({
  icon,
  label,
  onPress,
}: {
  icon: ImageSource;
  label: string;
  onPress?: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      style={styles.circle}>
      <Image source={icon} style={styles.circleIcon} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 100,
  },
  pillIcon: {
    width: 16,
    height: 16,
  },
  pillLabel: {
    fontFamily: fonts.medium,
    fontSize: 16,
    // Figma's 20pt text box. Without this Android adds font padding above the
    // glyphs and the label sits low next to its icon.
    lineHeight: 20,
    includeFontPadding: false,
    textAlignVertical: 'center',
    letterSpacing: -0.64,
  },
  circle: {
    width: 44,
    height: 44,
    borderRadius: 100,
    backgroundColor: colors.white100,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  circleIcon: {
    width: 24,
    height: 24,
  },
});
