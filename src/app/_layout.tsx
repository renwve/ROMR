import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { SavedProvider } from "./context/SavedContext";

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    BeVietnamProRegular: require("../../assets/fonts/BeVietnamPro-Regular.ttf"),
    BeVietnamProMedium: require("../../assets/fonts/BeVietnamPro-Medium.ttf"),
    BeVietnamProSemiBold: require("../../assets/fonts/BeVietnamPro-SemiBold.ttf"),
    BeVietnamProItalics: require("../../assets/fonts/BeVietnamPro-Italic.ttf"),
    BeVietnamProSemiBoldItalics: require("../../assets/fonts/BeVietnamPro-SemiBoldItalic.ttf"),
    BeVietnamProBold: require("../../assets/fonts/BeVietnamPro-Bold.ttf"),
    BeVietnamProBoldItalics: require("../../assets/fonts/BeVietnamPro-BoldItalic.ttf"),
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <SavedProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="(tabs)" />
      </Stack>
    </SavedProvider>
  );
}
