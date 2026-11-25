import { Image } from 'expo-image';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { type ReactNode, useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import Animated, { useAnimatedStyle } from 'react-native-reanimated';

import { DismissKeyboard } from '@/components/DismissKeyboard';
import { StatusBarSpace } from '@/components/PageHeader';
import { colors, fonts } from '@/constants/theme';
import { PrimaryButton, Wordmark } from '@/features/onboarding/components';
import { useOnboarding } from '@/features/onboarding/OnboardingContext';
import { useKeyboardHeight } from '@/hooks/useKeyboardHeight';

// Figma "Login" (Onboarding - Refinement). There's no sign-in yet, so the
// fields aren't checked: Login goes straight into the app. Create one starts
// onboarding.
export default function LoginScreen() {
  const { finish } = useOnboarding();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const keyboardHeight = useKeyboardHeight();

  // The form sits in the middle of the screen; with the keyboard up it stays
  // in the middle of what's left above it.
  const formStyle = useAnimatedStyle(() => ({ paddingBottom: keyboardHeight.get() }));

  return (
    <DismissKeyboard>
      <StatusBar style="dark" />
      <Animated.View style={[styles.centre, formStyle]}>
        <View style={styles.form}>
          <Wordmark size={25.319} />
          <View>
            <Text style={styles.title}>Welcome back, Roamer</Text>
            <Text style={styles.subtitle}>Log in to continue your journey</Text>
          </View>
          <View style={styles.fields}>
            <Field label="Email">
              <TextInput
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
                autoCorrect={false}
                style={styles.input}
              />
            </Field>
            <Field label="Password">
              <TextInput
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                autoComplete="password"
                style={styles.input}
              />
            </Field>
          </View>
          <View style={styles.actions}>
            <PrimaryButton label="Login" onPress={finish} />
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Create an account"
              hitSlop={8}
              onPress={() => router.push('/onboarding')}
              style={styles.createRow}>
              <Text style={styles.createPrompt}>Don’t have an account yet?</Text>
              <Text style={styles.createLink}>Create one</Text>
            </Pressable>
          </View>
        </View>
      </Animated.View>
      <StatusBarSpace />
      <View style={styles.header}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Back"
          hitSlop={12}
          onPress={() => router.back()}>
          <Image source={require('@/assets/icons/caret-left.svg')} style={styles.icon} />
        </Pressable>
      </View>
    </DismissKeyboard>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.box}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  centre: {
    ...StyleSheet.absoluteFill,
    justifyContent: 'center',
  },
  form: {
    gap: 32,
    paddingHorizontal: 24,
    paddingVertical: 16,
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
  fields: {
    gap: 16,
  },
  field: {
    gap: 8,
  },
  // Figma's label is plain black, not a colour variable.
  label: {
    fontFamily: fonts.medium,
    fontSize: 14,
    lineHeight: 18,
    letterSpacing: -0.7,
    color: '#000000',
  },
  box: {
    padding: 4,
    borderWidth: 1,
    borderColor: colors.gray200,
    borderRadius: 12,
    backgroundColor: colors.white100,
  },
  input: {
    height: 48,
    paddingHorizontal: 12,
    paddingVertical: 0,
    fontFamily: fonts.regular,
    fontSize: 16,
    letterSpacing: -0.8,
    color: colors.dark800,
    includeFontPadding: false,
  },
  actions: {
    alignItems: 'center',
    gap: 16,
  },
  createRow: {
    flexDirection: 'row',
    gap: 8,
  },
  createPrompt: {
    fontFamily: fonts.regular,
    fontSize: 16,
    lineHeight: 20,
    letterSpacing: -0.8,
    color: colors.gray700,
  },
  createLink: {
    fontFamily: fonts.bold,
    fontSize: 16,
    lineHeight: 20,
    letterSpacing: -0.8,
    color: colors.blue900,
  },
  header: {
    flexDirection: 'row',
    padding: 16,
  },
  icon: {
    width: 24,
    height: 24,
  },
});
