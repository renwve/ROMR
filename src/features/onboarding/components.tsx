import { Image, type ImageSource } from 'expo-image';
import { useEffect, type ReactNode } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ScalePressable } from '@/components/ScalePressable';
import { SLIDE } from '@/constants/motion';
import { colors, fonts, shadows } from '@/constants/theme';

// The ROMR wordmark with its four-point star, as on Figma "Get Started" (72pt,
// white) and "Login" (25.3pt, navy). Figma's measurements at 72pt, scaled.
const WORDMARK_SIZE = 72;
const WORDMARK_LINE_HEIGHT = 91;
const STAR = { size: 36, left: 204, top: -3 };

export function Wordmark({ size, light = false }: { size: number; light?: boolean }) {
  const scale = size / WORDMARK_SIZE;
  return (
    <View>
      <Text
        style={[
          styles.wordmark,
          {
            fontSize: size,
            lineHeight: WORDMARK_LINE_HEIGHT * scale,
            letterSpacing: -0.05 * size,
            color: light ? colors.white100 : colors.blue900,
          },
        ]}>
        ROMR
      </Text>
      <Image
        source={
          light
            ? require('@/assets/icons/wordmark-star-white.svg')
            : require('@/assets/icons/wordmark-star-navy.svg')
        }
        style={{
          position: 'absolute',
          left: STAR.left * scale,
          top: STAR.top * scale,
          width: STAR.size * scale,
          height: STAR.size * scale,
        }}
      />
    </View>
  );
}

// The onboarding's full-width buttons: white label on navy ("Continue",
// "Login"), or on gray500 ("Maybe later", and Continue while it's disabled).
export function PrimaryButton({
  label,
  onPress,
  disabled = false,
  muted = false,
}: {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  muted?: boolean;
}) {
  return (
    <ScalePressable
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={onPress}
      style={styles.buttonTarget}
      contentStyle={[
        styles.button,
        { backgroundColor: disabled || muted ? colors.gray500 : colors.blue900 },
      ]}>
      <Text style={styles.buttonLabel}>{label}</Text>
    </ScalePressable>
  );
}

// A heading and the line under it ("Where would you like to go?").
export function StepTitle({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <View>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.subtitle}>{subtitle}</Text>
    </View>
  );
}

// One onboarding page under the progress header (24pt sides, 40pt top and
// bottom): an optional heading that stays put, the content, and its button(s)
// locked to the bottom, 40pt apart. The content scrolls on its own when it
// doesn't fit (Traveller Type's cards on smaller phones).
export function StepPage({
  header,
  children,
  footer,
}: {
  header?: ReactNode;
  children: ReactNode;
  footer: ReactNode;
}) {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.page, { paddingBottom: Math.max(PAGE_PADDING, insets.bottom + 16) }]}>
      {header}
      <ScrollView
        style={styles.fill}
        contentContainerStyle={styles.pageContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}>
        {children}
      </ScrollView>
      <View style={styles.footer}>{footer}</View>
    </View>
  );
}

const PAGE_PADDING = 40;

// Figma's progress header: back, the step count ("1/4", or "Summary"), and a
// bar that fills a quarter per step. The bar slides to its new length either
// way, so going back shortens it smoothly too.
export function ProgressHeader({
  label,
  strong = false,
  progress,
  onBack,
}: {
  label: string;
  // The summary's bold "Summary" instead of the semibold step count.
  strong?: boolean;
  progress: number;
  onBack: () => void;
}) {
  const fill = useSharedValue(progress);

  useEffect(() => {
    fill.set(withTiming(progress, SLIDE));
  }, [fill, progress]);

  const fillStyle = useAnimatedStyle(() => ({ width: `${fill.get() * 100}%` }));

  return (
    <View style={styles.header}>
      <View style={styles.headerRow}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Back"
          hitSlop={12}
          onPress={onBack}>
          <Image source={require('@/assets/icons/caret-left.svg')} style={styles.icon} />
        </Pressable>
        <Text style={[styles.headerLabel, strong && styles.headerLabelStrong]}>{label}</Text>
      </View>
      <View style={styles.track}>
        <Animated.View style={[styles.trackFill, fillStyle]} />
      </View>
    </View>
  );
}

// Figma's selectable rows on "Travel Pref" and "Traveller Type": an icon, a
// title and description, and a checkbox. Selected rows are white200 with a navy
// outline and a ticked box.
export function OptionCard({
  icon,
  title,
  subtitle,
  selected,
  onPress,
}: {
  icon: ImageSource;
  title: string;
  subtitle: string;
  selected: boolean;
  onPress: () => void;
}) {
  return (
    <ScalePressable
      accessibilityRole="checkbox"
      accessibilityState={{ checked: selected }}
      onPress={onPress}
      contentStyle={[styles.card, selected && styles.cardSelected]}>
      <View style={styles.cardRow}>
        <View style={styles.cardLabel}>
          <Image source={icon} style={styles.icon} />
          <View style={styles.cardText}>
            <Text style={styles.cardTitle}>{title}</Text>
            <Text style={styles.cardSubtitle}>{subtitle}</Text>
          </View>
        </View>
        <Image
          source={
            selected
              ? require('@/assets/icons/check-square.svg')
              : require('@/assets/icons/square.svg')
          }
          style={styles.icon}
        />
      </View>
    </ScalePressable>
  );
}

const styles = StyleSheet.create({
  fill: {
    flex: 1,
  },
  wordmark: {
    fontFamily: fonts.blackItalic,
  },
  buttonTarget: {
    alignSelf: 'stretch',
  },
  button: {
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    borderRadius: 12,
    boxShadow: shadows.soft,
  },
  buttonLabel: {
    fontFamily: fonts.medium,
    fontSize: 14,
    lineHeight: 18,
    letterSpacing: -0.7,
    color: colors.white100,
  },
  title: {
    fontFamily: fonts.bold,
    fontSize: 24,
    lineHeight: 30,
    letterSpacing: -1.2,
    color: colors.blue900,
  },
  subtitle: {
    fontFamily: fonts.medium,
    fontSize: 14,
    lineHeight: 18,
    letterSpacing: -0.7,
    color: colors.gray700,
  },
  page: {
    flex: 1,
    gap: PAGE_PADDING,
    paddingHorizontal: 24,
    paddingTop: PAGE_PADDING,
  },
  pageContent: {
    flexGrow: 1,
  },
  footer: {
    gap: 4,
  },
  header: {
    gap: 16,
    padding: 16,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerLabel: {
    fontFamily: fonts.semiBold,
    fontSize: 16,
    lineHeight: 20,
    letterSpacing: -0.8,
    color: colors.blue900,
  },
  headerLabelStrong: {
    fontFamily: fonts.bold,
  },
  track: {
    height: 4,
    borderRadius: 4,
    overflow: 'hidden',
    backgroundColor: colors.gray200,
  },
  trackFill: {
    height: 4,
    borderRadius: 4,
    backgroundColor: colors.blue900,
  },
  icon: {
    width: 24,
    height: 24,
  },
  card: {
    padding: 4,
    borderWidth: 1,
    borderColor: colors.gray200,
    borderRadius: 12,
    backgroundColor: colors.white100,
  },
  cardSelected: {
    borderColor: colors.blue900,
    backgroundColor: colors.white200,
  },
  cardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    padding: 12,
  },
  cardLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    flexShrink: 1,
    gap: 12,
  },
  cardText: {
    flexShrink: 1,
  },
  cardTitle: {
    fontFamily: fonts.regular,
    fontSize: 16,
    lineHeight: 20,
    letterSpacing: -0.8,
    color: colors.blue900,
  },
  cardSubtitle: {
    fontFamily: fonts.regular,
    fontSize: 14,
    lineHeight: 18,
    letterSpacing: -0.7,
    color: colors.gray500,
  },
});
