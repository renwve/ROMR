import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
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

  const confirmDelete = () => {
    Alert.alert(
      "Delete Account?",
      "Account deletion is permanent. This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Continue",
          style: "destructive",
          onPress: () => notConnected("Delete Account"),
        },
      ],
    );
  };

  const confirmSignOut = () => {
    Alert.alert("Sign Out?", "Are you sure you want to sign out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Sign Out",
        onPress: () => notConnected("Sign Out"),
      },
    ]);
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
          <SettingsRow
            icon="lock-closed-outline"
            title="Password & Security"
            subtitle="Manage your password and account security"
            onPress={() => notConnected("Password & Security")}
          />
        </View>

        <Text style={styles.sectionTitle}>NOTIFICATIONS</Text>

        <View style={styles.card}>
          <SettingsRow
            icon="notifications-outline"
            title="Notification Preferences"
            subtitle="Manage your travel alerts and updates"
            onPress={() => notConnected("Notification Preferences")}
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
            onPress={() => notConnected("Help & Support")}
          />

          <View style={styles.divider} />

          <SettingsRow
            icon="chatbubble-outline"
            title="Send Feedback"
            subtitle="Help us improve your experience"
            onPress={() => notConnected("Send Feedback")}
          />

          <View style={styles.divider} />

          <SettingsRow
            icon="shield-checkmark-outline"
            title="Privacy Policy"
            subtitle="Learn how we handle your data"
            onPress={() => notConnected("Privacy Policy")}
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
          <View style={styles.divider} />
          <SettingsRow
            icon="trash-outline"
            title="Delete Account"
            subtitle="Permanently delete your ROMR account"
            onPress={confirmDelete}
            danger
          />
        </View>

        <Pressable style={styles.signOut} onPress={confirmSignOut}>
          <Ionicons name="log-out-outline" size={22} color={COLORS.red} />
          <Text style={styles.signOutText}>Sign Out</Text>
        </Pressable>

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

  signOut: {
    marginTop: 28,
    backgroundColor: COLORS.white,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 17,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  signOutText: {
    fontFamily: "BeVietnamProSemiBold",
    fontSize: 14,
    color: COLORS.red,
  },
  version: {
    textAlign: "center",
    fontFamily: "BeVietnamProRegular",
    fontSize: 11,
    color: COLORS.grey,
    marginTop: 25,
  },
});
