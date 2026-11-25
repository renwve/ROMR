import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

const privacySections = [
  {
    title: "Your Preferences",
    description:
      "Your notification and anonymous sharing preferences are stored locally so your choices can be remembered.",
  },
  {
    title: "Anonymous Sharing",
    description:
      "You can manage your anonymous sharing preference in Settings. Anonymous sharing functionality is still under development.",
  },
  {
    title: "Feedback",
    description:
      "You can explore the feedback form, but feedback is not currently transmitted or submitted to ROMR.",
  },
  {
    title: "About This Version",
    description:
      "ROMR is currently a student project under development. Privacy information may be updated as new features are introduced.",
  },
];

export default function PrivacyScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#10184B" />
        </Pressable>

        <Text style={styles.headerTitle}>Privacy & Data</Text>

        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.welcome}>
          <Ionicons name="shield-checkmark-outline" size={32} color="#10184B" />

          <Text style={styles.welcomeTitle}>Your privacy matters</Text>

          <Text style={styles.welcomeText}>
            Learn more about your preferences and data in ROMR.
          </Text>
        </View>

        <Text style={styles.sectionTitle}>PRIVACY INFORMATION</Text>

        {privacySections.map((section) => (
          <View key={section.title} style={styles.card}>
            <Text style={styles.cardTitle}>{section.title}</Text>

            <Text style={styles.description}>{section.description}</Text>
          </View>
        ))}

        <Text style={styles.footer}>ROMR • Version 1.0</Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7F8FA",
  },

  header: {
    backgroundColor: "#FFFFFF",
    paddingTop: 55,
    paddingHorizontal: 20,
    paddingBottom: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: "#E8EAF0",
  },

  backButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
  },

  headerTitle: {
    fontSize: 22,
    fontFamily: "BeVietnamProBold",
    color: "#10184B",
  },

  content: {
    padding: 20,
    paddingBottom: 45,
  },

  welcome: {
    backgroundColor: "#E9F1FF",
    borderRadius: 18,
    padding: 20,
    marginBottom: 14,
  },

  welcomeTitle: {
    fontFamily: "BeVietnamProBold",
    fontSize: 18,
    color: "#10184B",
    marginTop: 12,
    marginBottom: 6,
  },

  welcomeText: {
    fontFamily: "BeVietnamProRegular",
    fontSize: 12,
    color: "#737987",
    lineHeight: 19,
  },

  sectionTitle: {
    fontFamily: "BeVietnamProSemiBold",
    fontSize: 11,
    letterSpacing: 1,
    color: "#737987",
    marginTop: 23,
    marginBottom: 10,
  },

  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E8EAF0",
    padding: 18,
    marginBottom: 12,
  },

  cardTitle: {
    fontFamily: "BeVietnamProSemiBold",
    fontSize: 14,
    color: "#10184B",
    marginBottom: 8,
  },

  description: {
    fontFamily: "BeVietnamProRegular",
    fontSize: 12,
    color: "#737987",
    lineHeight: 21,
  },

  footer: {
    fontFamily: "BeVietnamProRegular",
    fontSize: 11,
    color: "#737987",
    textAlign: "center",
    marginTop: 20,
  },
});
