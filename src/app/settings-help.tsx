import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

const faqs = [
  {
    question: "How do I save a destination?",
    answer:
      "Go to the Explore page and tap the heart icon on a destination you like.",
  },
  {
    question: "Where can I find my saved destinations?",
    answer:
      "Open the Saved tab to view your favourite destinations in one place.",
  },
  {
    question: "How do I plan a trip?",
    answer:
      "Open the Planner tab to explore the available trip planning features.",
  },
  {
    question: "How do I manage my notification preferences?",
    answer:
      "Go to Settings and select Notification Preferences to customize your preferred updates.",
  },
];

export default function HelpScreen() {
  const [expanded, setExpanded] = useState<number | null>(null);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#10184B" />
        </Pressable>

        <Text style={styles.headerTitle}>Help & Support</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.welcome}>
          <Ionicons name="help-circle-outline" size={32} color="#10184B" />

          <Text style={styles.welcomeTitle}>How can we help?</Text>

          <Text style={styles.welcomeText}>
            Find answers to common questions about ROMR.
          </Text>
        </View>

        <Text style={styles.sectionTitle}>FREQUENTLY ASKED QUESTIONS</Text>

        <View style={styles.card}>
          {faqs.map((faq, index) => (
            <View key={index}>
              <Pressable
                style={styles.questionRow}
                onPress={() => setExpanded(expanded === index ? null : index)}
              >
                <Text style={styles.question}>{faq.question}</Text>

                <Ionicons
                  name={expanded === index ? "chevron-up" : "chevron-down"}
                  size={18}
                  color="#737987"
                />
              </Pressable>

              {expanded === index && (
                <Text style={styles.answer}>{faq.answer}</Text>
              )}

              {index < faqs.length - 1 && <View style={styles.divider} />}
            </View>
          ))}
        </View>
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
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#E8EAF0",
  },

  questionRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 18,
    minHeight: 65,
  },

  question: {
    flex: 1,
    fontFamily: "BeVietnamProSemiBold",
    fontSize: 13,
    color: "#10184B",
    marginRight: 12,
  },

  answer: {
    fontFamily: "BeVietnamProRegular",
    fontSize: 12,
    color: "#737987",
    lineHeight: 21,
    paddingHorizontal: 18,
    paddingBottom: 18,
  },

  divider: {
    height: 1,
    backgroundColor: "#E8EAF0",
    marginHorizontal: 15,
  },
});
