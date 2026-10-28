import { router } from "expo-router";
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSaved } from "../../context/savedContext";

const destinations = [
  {
    id: "tokyo",
    name: "Tokyo Tower",
    location: "Tokyo, Japan",
    image: "https://images.unsplash.com/photo-1536098561742-ca998e48cbcc",
  },
  {
    id: "resort",
    name: "Some Resort",
    location: "Resort Getaway",
    image: "https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e",
  },
  {
    id: "sky",
    name: "Sky Diving",
    location: "Adventure Experience",
    image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34",
  },
  {
    id: "midlife",
    name: "Mid-life Japan Trip",
    location: "Japan",
    image: "https://images.unsplash.com/photo-1536098561742-ca998e48cbcc",
  },
  {
    id: "work",
    name: "Forgetting about Work",
    location: "Relaxing Getaway",
    image: "https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e",
  },
  {
    id: "aurora",
    name: "Aurora Hunting",
    location: "Northern Lights",
    image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34",
  },
  {
    id: "beach",
    name: "A Little Beach Escape",
    location: "Beach Vacation",
    image: "https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e",
  },
  {
    id: "mountain",
    name: "Mountain Hideaway",
    location: "Mountain Retreat",
    image: "https://images.unsplash.com/photo-1536098561742-ca998e48cbcc",
  },
  {
    id: "island",
    name: "Island Weekend",
    location: "Island Getaway",
    image: "https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e",
  },
];

export default function SavedCollection() {
  const { savedItems } = useSaved();

  const savedDestinations = destinations.filter((destination) =>
    savedItems.includes(destination.id),
  );

  return (
    <ScrollView style={styles.container}>
      <Pressable onPress={() => router.replace("/saved")}>
        <Text style={styles.backArrow}>←</Text>
      </Pressable>

      <Text style={styles.title}>My Dream Destinations</Text>

      {savedDestinations.length === 0 ? (
        <Text style={styles.emptyText}>
          No saved destinations yet. Go to Explore and tap a heart to save your
          favourite places!
        </Text>
      ) : (
        savedDestinations.map((destination) => (
          <View key={destination.id} style={styles.destinationCard}>
            <Image
              source={{ uri: destination.image }}
              style={styles.destinationImage}
              resizeMode="cover"
            />

            <Text style={styles.destinationName}>{destination.name}</Text>

            <Text style={styles.destinationLocation}>
              {destination.location}
            </Text>

            <Pressable style={styles.detailsButton}>
              <Text style={styles.detailsButtonText}>View Details</Text>
            </Pressable>
          </View>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E7E7F1",
  },

  backArrow: {
    fontSize: 28,
    color: "#3E3630",
    marginLeft: 20,
    marginTop: 20,
  },

  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#3E3630",
    marginTop: 40,
    marginLeft: 20,
  },

  destinationCard: {
    backgroundColor: "#FFFFFF",
    marginHorizontal: 20,
    marginTop: 20,
    padding: 20,
    borderRadius: 16,
  },

  destinationImage: {
    width: "100%",
    height: 180,
    borderRadius: 12,
    marginBottom: 12,
  },

  destinationName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#3E3630",
    marginBottom: 4,
  },

  destinationLocation: {
    fontSize: 14,
    color: "#777777",
  },

  detailsButton: {
    backgroundColor: "#3E3630",
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 15,
  },

  detailsButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
  },

  emptyText: {
    fontSize: 15,
    color: "#777777",
    marginHorizontal: 20,
    marginTop: 30,
    lineHeight: 24,
  },
});
