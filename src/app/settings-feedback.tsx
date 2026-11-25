import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import {
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";

const categories = [
  "Feature suggestion",
  "Report a problem",
  "General feedback",
];

export default function FeedbackScreen() {
  const [category, setCategory] = useState("Feature suggestion");
  const [feedback, setFeedback] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = () => {
    if (!feedback.trim()) {
      setMessage("Please enter your feedback.");
      return;
    }

    setMessage(
      "Feedback submission is not available in this version of ROMR yet.",
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#10184B" />
        </Pressable>

        <Text style={styles.headerTitle}>Send Feedback</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.welcome}>
          <Ionicons
            name="chatbubble-ellipses-outline"
            size={32}
            color="#10184B"
          />

          <Text style={styles.welcomeTitle}>We'd love to hear from you!</Text>

          <Text style={styles.welcomeText}>
            Help us make ROMR a better travel experience.
          </Text>
        </View>

        <Text style={styles.sectionTitle}>FEEDBACK TYPE</Text>

        <View style={styles.card}>
          {categories.map((item, index) => (
            <View key={item}>
              <Pressable
                style={styles.categoryRow}
                onPress={() => setCategory(item)}
              >
                <Text style={styles.categoryText}>{item}</Text>

                <Ionicons
                  name={
                    category === item ? "radio-button-on" : "radio-button-off"
                  }
                  size={22}
                  color={category === item ? "#10184B" : "#737987"}
                />
              </Pressable>

              {index < categories.length - 1 && <View style={styles.divider} />}
            </View>
          ))}
        </View>

        <Text style={styles.sectionTitle}>YOUR FEEDBACK</Text>

        <TextInput
          style={styles.input}
          placeholder="Tell us what's on your mind..."
          placeholderTextColor="#737987"
          multiline
          maxLength={500}
          value={feedback}
          onChangeText={(text) => {
            setFeedback(text);
            setMessage("");
          }}
          textAlignVertical="top"
        />

        <Text style={styles.counter}>{feedback.length}/500 characters</Text>

        <Pressable style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitText}>Submit Feedback</Text>
        </Pressable>

        {message !== "" && <Text style={styles.message}>{message}</Text>}
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

  categoryRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 18,
    minHeight: 60,
  },

  categoryText: {
    fontFamily: "BeVietnamProSemiBold",
    fontSize: 13,
    color: "#10184B",
  },

  divider: {
    height: 1,
    backgroundColor: "#E8EAF0",
    marginHorizontal: 15,
  },

  input: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E8EAF0",
    padding: 16,
    minHeight: 150,
    fontFamily: "BeVietnamProRegular",
    fontSize: 13,
    color: "#10184B",
  },

  counter: {
    fontFamily: "BeVietnamProRegular",
    fontSize: 11,
    color: "#737987",
    textAlign: "right",
    marginTop: 8,
  },

  submitButton: {
    backgroundColor: "#10184B",
    borderRadius: 14,
    padding: 17,
    alignItems: "center",
    marginTop: 24,
  },

  submitText: {
    fontFamily: "BeVietnamProSemiBold",
    fontSize: 14,
    color: "#FFFFFF",
  },

  message: {
    fontFamily: "BeVietnamProRegular",
    fontSize: 12,
    color: "#737987",
    textAlign: "center",
    marginTop: 14,
    lineHeight: 19,
  },
});
