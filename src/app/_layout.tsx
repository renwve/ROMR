import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { ActivityIndicator, View } from "react-native";
import { COLORS } from "../constants/theme";
import { OnboardingProvider } from "../context/onboardingContext";

export default function RootLayout() {
  const [loaded] = useFonts({
    BeVietnamProRegular: require("../../assets/fonts/BeVietnamPro-Regular.ttf"),
    BeVietnamProSemiBold: require("../../assets/fonts/BeVietnamPro-SemiBold.ttf"),
    BeVietnamProItalics: require("../../assets/fonts/BeVietnamPro-Italic.ttf"),
    BeVietnamProSemiBoldItalics: require("../../assets/fonts/BeVietnamPro-SemiBoldItalic.ttf"),
    BeVietnamProBold: require("../../assets/fonts/BeVietnamPro-Bold.ttf"),
    BeVietnamProBoldItalics: require("../../assets/fonts/BeVietnamPro-BoldItalic.ttf"),
    BeVietnamProBlackItalics: require("../../assets/fonts/BeVietnamPro-BlackItalic.ttf")
  });

  if (!loaded) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: COLORS.background,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ActivityIndicator color={COLORS.primary} />
      </View>
    );
  }

  return (
    <OnboardingProvider>
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: {
            backgroundColor: COLORS.background,
          },
          animation: "slide_from_right",
        }}
      />
    </OnboardingProvider>
  );
}
