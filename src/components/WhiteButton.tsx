import { Image } from 'expo-image';
import type { ComponentProps } from 'react';
import { type StyleProp, StyleSheet, Text, type ViewStyle } from 'react-native';

import { ScalePressable } from '@/components/ScalePressable';
import { colors, fonts, shadows } from '@/constants/theme';

const OUTLINE = 1;

type WhiteButtonProps = Omit<ComponentProps<typeof ScalePressable>, 'children' | 'contentStyle'> & {
  label?: string;
  // A 20pt icon before the label.
  icon?: ComponentProps<typeof Image>['source'];
  // A fully rounded pill, or a card button with 12pt corners.
  shape?: 'pill' | 'rounded';
  shadow?: keyof typeof shadows;
  // A 1pt white200 outline around the button, which makes it 2pt bigger each way.
  outlined?: boolean;
  contentStyle?: StyleProp<ViewStyle>;
};

// The app's white button: an optional icon and a navy label on white, with a
// soft shadow. Like every button, its contents shrink while it's held.
export function WhiteButton({
  label,
  icon,
  shape = 'pill',
  shadow = 'soft',
  outlined = false,
  contentStyle,
  ...props
}: WhiteButtonProps) {
  return (
    <ScalePressable
      accessibilityRole="button"
      {...props}
      contentStyle={[
        styles.button,
        { borderRadius: shape === 'pill' ? 100 : 12, boxShadow: shadows[shadow] },
        outlined && styles.outlined,
        contentStyle,
      ]}>
      {icon ? <Image source={icon} style={styles.icon} /> : null}
      {label ? <Text style={styles.label}>{label}</Text> : null}
    </ScalePressable>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: colors.white100,
  },
  outlined: {
    borderWidth: OUTLINE,
    borderColor: colors.white200,
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
