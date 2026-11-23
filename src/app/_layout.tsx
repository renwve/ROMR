import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useCallback, useEffect, useState } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { SplashPage } from '@/components/SplashPage';
import { CollectionsProvider } from '@/features/saved/CollectionsContext';

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
      {/* Collections are shared by Saved and the New Collection page above the tabs. */}
      <CollectionsProvider>
        <Stack screenOptions={{ headerShown: false }} />
      </CollectionsProvider>
      {showSplash ? <SplashPage onFinish={hideSplash} /> : null}
    </GestureHandlerRootView>
  );
}
