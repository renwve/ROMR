import { Image } from 'expo-image';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { WhiteButton } from '@/components/WhiteButton';
import { colors, fonts } from '@/constants/theme';
import { Wordmark } from '@/features/onboarding/components';

// The wordmark's height at 72pt; "Just Go." overlaps its last 14.5pt (Figma
// has it at 468pt, the wordmark's box ending at 482.5pt), 2pt left of it.
const WORDMARK_HEIGHT = 91;
const TAGLINE_OVERLAP = 14.5;

// Figma "Get Started" (Onboarding - Refinement): the wordmark over the Earth
// at night. Get Started begins onboarding; Log in goes to Login. The sky,
// glow and Earth are one picture exported from Figma, since the glow is a
// blur that Android can't draw.
export default function GetStartedScreen() {
  const insets = useSafeAreaInsets();
  return (
    <View style={styles.page}>
      <StatusBar style="light" />
      <Image
        source={require('@/assets/images/onboarding/get-started-bg.webp')}
        style={StyleSheet.absoluteFill}
        contentFit="cover"
      />
      <View style={styles.centre} pointerEvents="none">
        <View>
          <Wordmark size={72} light />
          <Text style={styles.tagline}>Just Go.</Text>
        </View>
      </View>
      <View style={[styles.bottom, { bottom: Math.max(40, insets.bottom + 16) }]}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Log in"
          hitSlop={8}
          onPress={() => router.push('/login')}
          style={styles.loginRow}>
          <Text style={styles.loginPrompt}>Already have an account? </Text>
          <Text style={styles.loginLink}>Log in</Text>
        </Pressable>
        <WhiteButton
          label="Get Started"
          shape="rounded"
          onPress={() => router.push('/onboarding')}
          style={styles.buttonTarget}
          contentStyle={styles.button}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: colors.blue900,
  },
  centre: {
    ...StyleSheet.absoluteFill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tagline: {
    position: 'absolute',
    top: WORDMARK_HEIGHT - TAGLINE_OVERLAP,
    left: -2,
    fontFamily: fonts.bold,
    fontSize: 24,
    lineHeight: 30,
    letterSpacing: -1.2,
    color: colors.white100,
  },
  bottom: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
    gap: 16,
  },
  loginRow: {
    flexDirection: 'row',
    gap: 8,
  },
  loginPrompt: {
    fontFamily: fonts.regular,
    fontSize: 16,
    lineHeight: 20,
    letterSpacing: -0.8,
    color: colors.white200,
  },
  loginLink: {
    fontFamily: fonts.bold,
    fontSize: 16,
    lineHeight: 20,
    letterSpacing: -0.8,
    color: colors.white100,
  },
  buttonTarget: {
    alignSelf: 'stretch',
    paddingHorizontal: 16,
  },
  button: {
    height: 56,
  },
});
