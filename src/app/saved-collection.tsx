import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import {
    Image,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from "react-native";
import { useSaved } from "./context/SavedContext";

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
  const { savedItems, toggleSaved } = useSaved();

  const savedDestinations = destinations.filter((destination) =>
    savedItems.includes(destination.id),
  );

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
    >
      {/* Back button */}
      <Pressable style={styles.backButton} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={24} color="#34294F" />
      </Pressable>

      {/* Page heading */}
      <Text style={styles.title}>My Dream Destinations</Text>

      <Text style={styles.subtitle}>All the places you love</Text>

      {/* Destination counter */}
      <View style={styles.counterContainer}>
        <Ionicons name="heart" size={18} color="#E888AC" />

        <Text style={styles.counterText}>
          {savedDestinations.length} saved destination
          {savedDestinations.length === 1 ? "" : "s"}
        </Text>
      </View>

      {/* Empty state */}
      {savedDestinations.length === 0 ? (
        <View style={styles.emptyContainer}>
          <View style={styles.emptyIcon}>
            <Ionicons name="heart-outline" size={42} color="#B69DCE" />
          </View>

          <Text style={styles.emptyTitle}>Your wishlist is waiting!</Text>

          <Text style={styles.emptyText}>
            Explore beautiful destinations and tap the heart to save your
            favourites here
          </Text>

          <Pressable
            style={styles.exploreButton}
            onPress={() => router.push("/")}
          >
            <Ionicons name="compass-outline" size={18} color="#FFFFFF" />

            <Text style={styles.exploreButtonText}>Explore</Text>
          </Pressable>
        </View>
      ) : (
        /* Two-column destination grid */
        <View style={styles.grid}>
          {savedDestinations.map((destination) => (
            <View key={destination.id} style={styles.destinationCard}>
              <View style={styles.imageContainer}>
                <Image
                  source={{ uri: destination.image }}
                  style={styles.destinationImage}
                  resizeMode="cover"
                />

                {/* Heart button */}
                <Pressable
                  style={styles.heartButton}
                  onPress={() => toggleSaved(destination.id)}
                >
                  <Ionicons name="heart" size={20} color="#E888AC" />
                </Pressable>
              </View>

              <View style={styles.cardText}>
                <Text style={styles.destinationName} numberOfLines={2}>
                  {destination.name}
                </Text>

                <View style={styles.locationRow}>
                  <Ionicons name="location-outline" size={13} color="#847698" />

                  <Text style={styles.destinationLocation} numberOfLines={2}>
                    {destination.location}
                  </Text>
                </View>
              </View>
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },

  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 50,
    flexGrow: 1,
  },

  backButton: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: "#EAF3FF",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 25,
  },

  title: {
    fontFamily: "BeVietnamProBold",
    fontSize: 25,
    color: "#1D2939",
  },

  subtitle: {
    fontFamily: "BeVietnamProRegular",
    fontSize: 14,
    color: "#667085",
    marginTop: 9,
    lineHeight: 21,
  },

  counterContainer: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    backgroundColor: "#EAF3FF",
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginTop: 22,
    marginBottom: 25,
    gap: 8,
  },

  counterText: {
    fontFamily: "BeVietnamProSemiBold",
    fontSize: 13,
    color: "#3478E5",
  },

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 12,
  },

  destinationCard: {
    width: "48%",
    backgroundColor: "#F8FAFC",
    borderRadius: 18,
    overflow: "hidden",
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#EDF2F7",
  },

  imageContainer: {
    position: "relative",
  },

  destinationImage: {
    width: "100%",
    height: 165,
    backgroundColor: "#EAF3FF",
  },

  heartButton: {
    position: "absolute",
    top: 10,
    right: 10,
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
  },

  cardText: {
    padding: 12,
  },

  destinationName: {
    fontFamily: "BeVietnamProBold",
    fontSize: 14,
    color: "#1D2939",
  },

  locationRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 4,
    marginTop: 6,
  },

  destinationLocation: {
    fontFamily: "BeVietnamProRegular",
    fontSize: 11,
    color: "#667085",
    flex: 1,
    lineHeight: 16,
  },

  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 15,
    paddingBottom: 60,
  },

  emptyIcon: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: "#EAF3FF",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },

  emptyTitle: {
    fontFamily: "BeVietnamProBold",
    fontSize: 20,
    color: "#1D2939",
    textAlign: "center",
  },

  emptyText: {
    fontFamily: "BeVietnamProRegular",
    fontSize: 14,
    color: "#667085",
    textAlign: "center",
    lineHeight: 23,
    marginTop: 12,
    marginBottom: 25,
  },

  exploreButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#3478E5",
    paddingHorizontal: 22,
    paddingVertical: 14,
    borderRadius: 25,
    gap: 8,
  },

  exploreButtonText: {
    fontFamily: "BeVietnamProSemiBold",
    color: "#FFFFFF",
    fontSize: 14,
  },
});
