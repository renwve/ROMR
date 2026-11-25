import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Alert,
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { COLORS, FONTS } from "../constants/theme";

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <Pressable onPress={() => router.back()} style={styles.backButton}>
        <Text style={styles.back}>‹</Text>
      </Pressable>

      <View style={styles.content}>
        <View style={styles.brandRow}>
          <Text style={styles.logo}>ROMR</Text>
          <Text style={styles.sparkle}>✦</Text>
        </View>

        <Text style={styles.heading}>Welcome back, traveler!</Text>
        <Text style={styles.description}>
          Log in to continue your journey.
        </Text>

        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          placeholder="@gmail.com, @yahoo.com, @outlook.com, etc."
          placeholderTextColor="#92929B"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
        />

        <Text style={styles.label}>Password</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your password"
          placeholderTextColor="#92929B"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <Pressable
          style={({ pressed }) => [styles.button, pressed && styles.pressed]}
          onPress={() =>
            Alert.alert(
              "Login",
              "Connect your authentication backend to enable login.",
            )
          }
        >
          <Text style={styles.buttonText}>Log In</Text>
        </Pressable>

        <Pressable style={styles.footerButton}>
          <Text style={styles.footer}>
            Don't have an account?{" "}
            <Text style={styles.footerStrong}>Create one</Text>
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFFFFF" },
  backButton: {
    position: "absolute",
    top: 52,
    left: 26,
    zIndex: 2,
    width: 40,
    height: 40,
    justifyContent: "center",
  },
  back: { color: COLORS.primary, fontSize: 38, lineHeight: 42 },
  content: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 30,
    paddingTop: 10,
  },
  brandRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 15,
  },
  logo: {
    color: COLORS.primary,
    fontFamily: FONTS.blackItalic,
    fontSize: 27,
    letterSpacing: -1,
  },
  sparkle: {
    color: COLORS.primary,
    fontSize: 15,
    marginLeft: -3.5,
    marginTop: 1,
  },
  heading: {
    color: COLORS.text,
    fontFamily: FONTS.semiBold,
    fontSize: 29,
  },
  description: {
    color: "#666672",
    fontFamily: FONTS.regular,
    fontSize: 13,
    marginTop: 1,
    marginBottom: 15,
  },
  label: {
    color: COLORS.primary,
    fontFamily: FONTS.semiBold,
    fontSize: 10,
    letterSpacing: 1.2,
    marginBottom: 8,
    marginTop: 16,
  },
  input: {
    height: 54,
    backgroundColor: "#FFFFFF",
    borderColor: "#DCD6E8",
    borderWidth: 1,
    borderRadius: 13,
    paddingHorizontal: 15,
    color: COLORS.text,
    fontFamily: FONTS.regular,
    fontSize: 13,
  },
  button: {
    height: 58,
    backgroundColor: COLORS.primary,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 15,
  },
  pressed: { opacity: 0.86 },
  buttonText: {
    color: "#FFFFFF",
    fontFamily: FONTS.semiBold,
    fontSize: 17,
  },
  footerButton: { alignItems: "center", marginTop: 10 },
  footer: {
    color: COLORS.primary,
    fontFamily: FONTS.regular,
    fontSize: 12,
  },
  footerStrong: { fontFamily: FONTS.semiBold },
});
