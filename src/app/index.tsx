import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { Pressable, StatusBar, StyleSheet, Text, View } from "react-native";
import { COLORS, FONTS } from "../constants/theme";

export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <LinearGradient
        colors={["#FFFFFF", "#FFFFFF", "#F8F2FF", "#E4CCFF", "#BC82F7", "#8738ED"]}
        locations={[0, 0.43, 0.55, 0.72, 0.89, 1]}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={StyleSheet.absoluteFill}
      />

      <View style={styles.hero}>
        <View>
          <View style={styles.brandRow}>
            <Text style={styles.logo}>ROMR</Text>
            <Text style={styles.sparkle}>✦</Text>
          </View>
          <Text style={styles.tagline}>Just go.</Text>
        </View>
      </View>

      <View style={styles.bottom}>
        <Pressable
          onPress={() => router.push("/onboarding")}
          style={({ pressed }) => [styles.button, pressed && styles.pressed]}
        >
          <Text style={styles.buttonText}>Get Started</Text>
        </Pressable>
        <Pressable onPress={() => router.push("/login")} style={styles.loginButton}>
          <Text style={styles.loginText}>
            Already have an account? <Text style={styles.loginHighlight}>Log in</Text>
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFFFFF" },
  hero: { flex: 1, justifyContent: "center", paddingHorizontal: 34, paddingTop: 10 },
  brandRow: { flexDirection: "row", alignItems: "flex-start" },
  logo: {
    color: COLORS.primary,
    fontFamily: FONTS.blackItalic,
    fontSize: 63,
    lineHeight: 75,
    letterSpacing: -3.5,
  },
  sparkle: { color: COLORS.primary, fontSize: 32, marginLeft: -8.5, marginTop: -10.5 },
  tagline: { color: "#171717", fontFamily: FONTS.regular, fontSize: 15, marginTop: 0, marginLeft: 2 },
  bottom: { paddingHorizontal: 34, paddingBottom: 22, gap: 5 },
  button: {
    height: 59,
    backgroundColor: COLORS.primary,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  pressed: { opacity: 0.86, transform: [{ scale: 0.99 }] },
  buttonText: { color: "#FFFFFF", fontFamily: FONTS.semiBold, fontSize: 18 },
  loginButton: { alignItems: "center", paddingVertical: 3 },
  loginText: { color: COLORS.primary, fontFamily: FONTS.regular, fontSize: 14, marginBottom: 30 },
  loginHighlight: { fontFamily: FONTS.semiBold },
});