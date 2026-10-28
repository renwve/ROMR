import { router } from "expo-router";
import { Pressable, ScrollView, StyleSheet, Text } from "react-native";
import { useSaved } from "../../../context/savedContext";

const Saved = () => {
  const { savedItems } = useSaved();

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>My Saved Collections</Text>

      <Pressable
        style={styles.collectionCard}
        onPress={() => router.push("../saved-collection")}
      >
        <Text style={styles.collectionTitle}>My Dream Destinations</Text>

        <Text style={styles.collectionCount}>
          {savedItems.length} saved destination
          {savedItems.length === 1 ? "" : "s"}
        </Text>
      </Pressable>
    </ScrollView>
  );
};

export default Saved;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E7E7F1",
  },

  collectionCard: {
    backgroundColor: "#FFFFFF",
    marginHorizontal: 20,
    marginTop: 25,
    padding: 20,
    borderRadius: 16,
  },

  collectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#3E3630",
  },

  collectionCount: {
    fontSize: 14,
    color: "#777777",
    marginTop: 8,
  },

  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#3E3630",
    marginTop: 40,
    marginLeft: 20,
  },
});
