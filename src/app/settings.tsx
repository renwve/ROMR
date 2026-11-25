import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View,
} from "react-native";

const COLORS = {
  navy: "#10184B",
  white: "#FFFFFF",
  background: "#F7F8FA",
  grey: "#737987",
  border: "#E8EAF0",
  red: "#D64545",
  blue: "#E9F1FF",
};

type IconName = React.ComponentProps<typeof Ionicons>["name"];

function SettingsRow({
  icon,
  title,
  subtitle,
  onPress,
  danger = false,
}: {
  icon: IconName;
  title: string;
  subtitle?: string;
  onPress: () => void;
  danger?: boolean;
}) {
  return (
    <Pressable style={styles.row} onPress={onPress}>
      <View style={styles.iconBox}>
        <Ionicons
          name={icon}
          size={21}
          color={danger ? COLORS.red : COLORS.navy}
        />
      </View>

      <View style={styles.rowText}>
        <Text style={[styles.rowTitle, danger && { color: COLORS.red }]}>
          {title}
        </Text>
        {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
      </View>

      <Ionicons name="chevron-forward" size={18} color={COLORS.grey} />
    </Pressable>
  );
}

export default function SettingsScreen() {
  const [anonymous, setAnonymous] = useState(false);
  const [loaded, setLoaded] = useState(false);

  // Load saved anonymous sharing preference
  useEffect(() => {
    const loadAnonymous = async () => {
      try {
        const saved = await AsyncStorage.getItem("anonymousSharing");

        if (saved !== null) {
          setAnonymous(saved === "true");
        }

        setLoaded(true);
      } catch (error) {
        console.error("Error loading anonymous preference:", error);
      }
    };

    loadAnonymous();
  }, []);

  // Save anonymous sharing preference
  useEffect(() => {
    if (!loaded) return;

    const saveAnonymous = async () => {
      try {
        await AsyncStorage.setItem("anonymousSharing", String(anonymous));
      } catch (error) {
        console.error("Error saving anonymous preference:", error);
      }
    };

    saveAnonymous();
  }, [anonymous, loaded]);

  const notConnected = (feature: string) => {
    Alert.alert(
      feature,
      "This feature will be connected when account management is implemented.",
    );
  };

  const confirmReset = () => {
    Alert.alert(
      "Reset App Data?",
      "This would clear your saved destinations and personal app preferences.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Reset",
          style: "destructive",
          onPress: () => notConnected("Reset App Data"),
        },
      ],
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={COLORS.navy} />
        </Pressable>
        <Text style={styles.headerTitle}>Settings</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.welcome}>
          <Text style={styles.welcomeTitle}>Your ROMR, your way</Text>
          <Text style={styles.welcomeText}>
            Manage your account, privacy, and travel preferences.
          </Text>
        </View>

        <Text style={styles.sectionTitle}>ACCOUNT</Text>
        <View style={styles.card}>
          <SettingsRow
            icon="person-outline"
            title="Personal Information"
            subtitle="Manage your name and email."
            onPress={() => notConnected("Personal Information ")}
          />
          <View style={styles.divider} />
        </View>

        <Text style={styles.sectionTitle}>NOTIFICATIONS</Text>

        <View style={styles.card}>
          <SettingsRow
            icon="notifications-outline"
            title="Notification Preferences"
            subtitle="Manage your travel alerts and updates"
            onPress={() => router.push("/settings-notifications")}
          />
        </View>

        <Text style={styles.sectionTitle}>PRIVACY & SHARING</Text>
        <View style={styles.card}>
          <View style={styles.row}>
            <View style={styles.iconBox}>
              <Ionicons name="eye-off-outline" size={21} color={COLORS.navy} />
            </View>
            <View style={styles.rowText}>
              <Text style={styles.rowTitle}>Anonymous Sharing</Text>
              <Text style={styles.subtitle}>
                Hide your name on shared trips
              </Text>
            </View>
            <Switch
              value={anonymous}
              onValueChange={setAnonymous}
              disabled={!loaded}
              trackColor={{ false: "#D5D8E0", true: "#AFC5F5" }}
              thumbColor={anonymous ? COLORS.navy : COLORS.white}
            />
          </View>
        </View>

        <Text style={styles.sectionTitle}>SUPPORT & ABOUT</Text>

        <View style={styles.card}>
          <SettingsRow
            icon="help-circle-outline"
            title="Help & Support"
            subtitle="Get help using ROMR"
            onPress={() => router.push("/settings-help")}
          />

          <View style={styles.divider} />

          <SettingsRow
            icon="chatbubble-outline"
            title="Send Feedback"
            subtitle="Help us improve your experience"
            onPress={() => router.push("/settings-feedback")}
          />

          <View style={styles.divider} />

          <SettingsRow
            icon="shield-checkmark-outline"
            title="Privacy & Data"
            subtitle="Learn about your privacy and preferences"
            onPress={() => router.push("/settings-privacy")}
          />
        </View>

        <Text style={styles.sectionTitle}>DATA & SECURITY</Text>
        <View style={styles.card}>
          <SettingsRow
            icon="refresh-outline"
            title="Reset App Data"
            subtitle="Clear saved destinations and preferences"
            onPress={confirmReset}
          />
        </View>

        <Text style={styles.version}>ROMR • Version 1.0</Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    backgroundColor: COLORS.white,
    paddingTop: 55,
    paddingHorizontal: 20,
    paddingBottom: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 22,
    fontFamily: "BeVietnamProBold",
    color: COLORS.navy,
  },
  content: {
    padding: 20,
    paddingBottom: 45,
  },
  welcome: {
    backgroundColor: COLORS.blue,
    borderRadius: 18,
    padding: 20,
    marginBottom: 14,
  },
  welcomeTitle: {
    fontFamily: "BeVietnamProBold",
    fontSize: 18,
    color: COLORS.navy,
    marginBottom: 6,
  },
  welcomeText: {
    fontFamily: "BeVietnamProRegular",
    fontSize: 12,
    color: COLORS.grey,
    lineHeight: 19,
  },
  sectionTitle: {
    fontFamily: "BeVietnamProSemiBold",
    fontSize: 11,
    letterSpacing: 1,
    color: COLORS.grey,
    marginTop: 23,
    marginBottom: 10,
  },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    minHeight: 76,
  },
  iconBox: {
    width: 38,
    height: 38,
    backgroundColor: COLORS.background,
    borderRadius: 11,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  rowText: {
    flex: 1,
  },
  rowTitle: {
    fontFamily: "BeVietnamProSemiBold",
    fontSize: 13,
    color: COLORS.navy,
  },
  subtitle: {
    fontFamily: "BeVietnamProRegular",
    fontSize: 11,
    color: COLORS.grey,
    marginTop: 4,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginLeft: 65,
  },

  version: {
    textAlign: "center",
    fontFamily: "BeVietnamProRegular",
    fontSize: 11,
    color: COLORS.grey,
    marginTop: 25,
  },
});
