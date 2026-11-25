import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useCallback, useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { SplashPage } from '@/components/SplashPage';
import { colors } from '@/constants/theme';
import { OnboardingProvider, useOnboarding } from '@/features/onboarding/OnboardingContext';
import { CollectionsProvider } from '@/features/saved/CollectionsContext';
import { SavesProvider } from '@/features/saved/SavesContext';
import { ToastProvider } from '@/features/toast/ToastContext';

// Keep the native launch screen up until fonts load, then hand over to SplashPage,
// which plays on every launch and removes itself when its zoom-out finishes.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    BeVietnamProRegular: require('../../assets/fonts/BeVietnamPro-Regular.ttf'),
    BeVietnamProMedium: require('../../assets/fonts/BeVietnamPro-Medium.ttf'),
    BeVietnamProSemiBold: require('../../assets/fonts/BeVietnamPro-SemiBold.ttf'),
    BeVietnamProItalics: require('../../assets/fonts/BeVietnamPro-Italic.ttf'),
    BeVietnamProSemiBoldItalics: require('../../assets/fonts/BeVietnamPro-SemiBoldItalic.ttf'),
    BeVietnamProBold: require('../../assets/fonts/BeVietnamPro-Bold.ttf'),
    BeVietnamProBoldItalics: require('../../assets/fonts/BeVietnamPro-BoldItalic.ttf'),
    BeVietnamProBlack: require('../../assets/fonts/BeVietnamPro-Black.ttf'),
    BeVietnamProBlackItalic: require('../../assets/fonts/BeVietnamPro-BlackItalic.ttf'),
  });
  const [showSplash, setShowSplash] = useState(true);

  const hideSplash = useCallback(() => setShowSplash(false), []);

  useEffect(() => {
    if (fontsLoaded) SplashScreen.hideAsync();
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      {/* Collections are shared by Saved and the New Collection page above the tabs;
          the Plan Saved toast by every page with a heart (the tabs, Daily Rec). */}
      <OnboardingProvider>
        <CollectionsProvider>
          <SavesProvider>
            <ToastProvider>
              <RootStack />
            </ToastProvider>
          </SavesProvider>
        </CollectionsProvider>
      </OnboardingProvider>
      {showSplash ? <SplashPage onFinish={hideSplash} /> : null}
    </GestureHandlerRootView>
  );
}

// Until onboarding is finished (or the traveller logs in) only Get Started,
// Login and onboarding can be shown, starting at Get Started under the launch
// splash; after that only the app. Flipping `done` moves to the other side.
function RootStack() {
  const { done } = useOnboarding();
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Protected guard={!done} redirectTo="/">
        <Stack.Screen name="get-started" />
        <Stack.Screen name="login" options={{ contentStyle: styles.white }} />
        <Stack.Screen name="onboarding" options={{ contentStyle: styles.white }} />
      </Stack.Protected>
      <Stack.Protected guard={done} redirectTo="/get-started">
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="new-collection" />
        <Stack.Screen name="daily-rec" />
        <Stack.Screen name="collection" />
      </Stack.Protected>
    </Stack>
  );
}

const styles = StyleSheet.create({
  white: {
    backgroundColor: colors.white100,
  },
});
