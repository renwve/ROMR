import { icons } from "@/features/planner/assets";
import { Ionicons } from "@expo/vector-icons";
import { Image as ExpoImage } from "expo-image";
import { router } from "expo-router";
import { useState } from "react";
import {
  ImageBackground,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import { useSaved } from "../../../context/savedContext";

export default function Saved() {
  const { savedItems } = useSaved();

  const [modalVisible, setModalVisible] = useState(false);
  const [collectionName, setCollectionName] = useState("");
  const [collections, setCollections] = useState<string[]>([]);

  const today = new Date().toLocaleDateString("en-CA", {
    month: "long",
    day: "numeric",
  });

  const closeModal = () => {
    setModalVisible(false);
    setCollectionName("");
  };

  const createCollection = () => {
    const name = collectionName.trim();

    if (!name) return;

    setCollections((previous) => [...previous, name]);
    closeModal();
  };

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Blue ROMR header */}
        <View style={styles.header}>
          <View style={styles.headerBrandContainer}>
            <Text style={styles.headerBrand}>ROMR</Text>

            <ExpoImage
              source={icons.romrStar}
              style={styles.romrStar}
              contentFit="contain"
            />
          </View>

          <Text style={styles.headerTitle}>Saved</Text>

          <View style={styles.headerRight}>
            <Text style={styles.headerDate}>{today}</Text>
          </View>
        </View>

        {/* Page introduction */}
        <View style={styles.intro}>
          <Text style={styles.pageTitle}>Your travel wishlist </Text>

          <Text style={styles.pageSubtitle}>
            All the places that caught your heart
          </Text>
        </View>

        {/* Saved places counter */}
        <View style={styles.statsContainer}>
          <View style={styles.statsIcon}>
            <Ionicons name="bookmark-outline" size={22} color="#3478E5" />
          </View>

          <View>
            <Text style={styles.statsNumber}>{savedItems.length}</Text>

            <Text style={styles.statsLabel}>Saved places</Text>
          </View>
        </View>

        {/* Collections heading */}
        <View style={styles.sectionHeader}>
          <View style={styles.sectionRow}>
            <Text style={styles.sectionTitle}>Your collections</Text>

            <Pressable
              style={styles.newCollectionButton}
              onPress={() => setModalVisible(true)}
            >
              <Ionicons name="add" size={16} color="#FFFFFF" />

              <Text style={styles.newCollectionText}>New Collection</Text>
            </Pressable>
          </View>

          <Text style={styles.sectionSubtitle}>
            {savedItems.length} places waiting to be explored ✈️
          </Text>
        </View>

        {/* My Dream Destinations */}
        <Pressable
          style={styles.collectionCard}
          onPress={() => router.push("../saved-collection")}
        >
          <ImageBackground
            source={require("../../../assets/images/saved/dream destinations.webp")}
            style={styles.collectionImage}
            imageStyle={styles.collectionImageRounded}
            resizeMode="cover"
          >
            <View style={styles.imageOverlay}>
              <View style={styles.collectionText}>
                <Text style={styles.collectionTitle}>
                  My Dream Destinations
                </Text>

                <Text style={styles.collectionCount}>
                  {savedItems.length} saved destination
                  {savedItems.length === 1 ? "" : "s"}
                </Text>
              </View>

              <View style={styles.arrowButton}>
                <Ionicons name="chevron-forward" size={21} color="#FFFFFF" />
              </View>
            </View>
          </ImageBackground>
        </Pressable>

        {/* Travel Ideas */}
        <View style={styles.collectionCard}>
          <ImageBackground
            source={require("../../../assets/images/planner/tokyo.jpg")}
            style={styles.collectionImage}
            imageStyle={styles.collectionImageRounded}
            resizeMode="cover"
          >
            <View style={styles.imageOverlay}>
              <View style={styles.collectionText}>
                <Text style={styles.collectionTitle}>Travel Ideas</Text>

                <Text style={styles.collectionCount}>
                  Inspiration for your next adventure ✈️
                </Text>
              </View>

              <View style={styles.arrowButton}>
                <Ionicons name="chevron-forward" size={21} color="#FFFFFF" />
              </View>
            </View>
          </ImageBackground>
        </View>

        {/* User-created collections */}
        {collections.map((name, index) => (
          <View key={`${name}-${index}`} style={styles.customCollectionCard}>
            <View style={styles.customCollectionIcon}>
              <Ionicons name="folder-outline" size={23} color="#3478E5" />
            </View>

            <View style={styles.customCollectionText}>
              <Text style={styles.customCollectionTitle}>{name}</Text>

              <Text style={styles.customCollectionSubtitle}>
                New collection · 0 places
              </Text>
            </View>

            <Ionicons name="chevron-forward" size={21} color="#3478E5" />
          </View>
        ))}
      </ScrollView>

      {/* New Collection pop-up */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={closeModal}
      >
        <KeyboardAvoidingView
          style={styles.modalBackground}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
          <View style={styles.modalCard}>
            <View style={styles.modalIcon}>
              <Ionicons name="folder-open-outline" size={28} color="#3478E5" />
            </View>

            <Text style={styles.modalTitle}>New Collection</Text>

            <Text style={styles.modalSubtitle}>
              Give your travel collection a name.
            </Text>

            <TextInput
              style={styles.modalInput}
              placeholder="e.g. Summer in Europe"
              placeholderTextColor="#98A2B3"
              value={collectionName}
              onChangeText={setCollectionName}
              maxLength={40}
              autoFocus
            />

            <View style={styles.modalButtons}>
              <Pressable style={styles.cancelButton} onPress={closeModal}>
                <Text style={styles.cancelText}>Cancel</Text>
              </Pressable>

              <Pressable
                style={[
                  styles.createButton,
                  !collectionName.trim() && styles.disabledButton,
                ]}
                onPress={createCollection}
                disabled={!collectionName.trim()}
              >
                <Text style={styles.createText}>Create</Text>
              </Pressable>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },

  scrollView: {
    flex: 1,
  },

  scrollContent: {
    paddingBottom: 150,
  },

  header: {
    backgroundColor: "#3478E5",
    borderBottomLeftRadius: 22,
    borderBottomRightRadius: 22,
    paddingHorizontal: 20,
    paddingVertical: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  headerBrandContainer: {
    width: 75,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    gap: 2,
  },

  headerBrand: {
    fontFamily: "BeVietnamProBold",
    color: "#FFFFFF",
    fontSize: 12,
    letterSpacing: 0,
  },

  romrStar: {
    width: 14,
    height: 14,
  },

  headerTitle: {
    fontFamily: "BeVietnamProBold",
    color: "#FFFFFF",
    fontSize: 18,
  },

  headerRight: {
    width: 75,
    alignItems: "flex-end",
  },

  headerDate: {
    fontFamily: "BeVietnamProMedium",
    fontSize: 12,
    color: "#FFFFFF",
  },

  intro: {
    marginHorizontal: 20,
    marginTop: 28,
  },

  pageTitle: {
    fontFamily: "BeVietnamProBold",
    fontSize: 25,
    color: "#1D2939",
  },

  pageSubtitle: {
    fontFamily: "BeVietnamProRegular",
    fontSize: 14,
    color: "#667085",
    marginTop: 8,
    lineHeight: 21,
  },

  statsContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 20,
    marginTop: 22,
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: "#F3F8FF",
    borderRadius: 16,
  },

  statsIcon: {
    width: 44,
    height: 44,
    borderRadius: 13,
    backgroundColor: "#E3EFFF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },

  statsNumber: {
    fontFamily: "BeVietnamProBold",
    fontSize: 23,
    color: "#1D2939",
  },

  statsLabel: {
    fontFamily: "BeVietnamProRegular",
    fontSize: 13,
    color: "#667085",
    marginTop: 2,
  },

  sectionHeader: {
    marginHorizontal: 20,
    marginTop: 28,
  },

  sectionRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
  },

  sectionTitle: {
    fontFamily: "BeVietnamProBold",
    fontSize: 20,
    color: "#1D2939",
    flexShrink: 1,
  },

  sectionSubtitle: {
    fontFamily: "BeVietnamProRegular",
    fontSize: 13,
    color: "#667085",
    marginTop: 8,
  },

  newCollectionButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#3478E5",
    paddingHorizontal: 11,
    paddingVertical: 9,
    borderRadius: 20,
    gap: 3,
  },

  newCollectionText: {
    fontFamily: "BeVietnamProSemiBold",
    fontSize: 11,
    color: "#FFFFFF",
  },

  collectionCard: {
    marginHorizontal: 20,
    marginTop: 17,
    borderRadius: 18,
    overflow: "hidden",
    backgroundColor: "#F3F8FF",
  },

  collectionImage: {
    width: "100%",
    height: 220,
    justifyContent: "flex-end",
  },

  collectionImageRounded: {
    borderRadius: 18,
  },

  imageOverlay: {
    backgroundColor: "rgba(15, 30, 55, 0.62)",
    paddingHorizontal: 17,
    paddingVertical: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  collectionText: {
    flex: 1,
    paddingRight: 10,
  },

  collectionTitle: {
    fontFamily: "BeVietnamProBold",
    fontSize: 18,
    color: "#FFFFFF",
  },

  collectionCount: {
    fontFamily: "BeVietnamProRegular",
    fontSize: 13,
    color: "#E8F0FF",
    marginTop: 7,
  },

  arrowButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.23)",
    justifyContent: "center",
    alignItems: "center",
  },

  customCollectionCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F3F8FF",
    marginHorizontal: 20,
    marginTop: 14,
    borderRadius: 16,
    padding: 15,
  },

  customCollectionIcon: {
    width: 44,
    height: 44,
    borderRadius: 13,
    backgroundColor: "#E3EFFF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },

  customCollectionText: {
    flex: 1,
  },

  customCollectionTitle: {
    fontFamily: "BeVietnamProSemiBold",
    fontSize: 16,
    color: "#1D2939",
  },

  customCollectionSubtitle: {
    fontFamily: "BeVietnamProRegular",
    fontSize: 12,
    color: "#667085",
    marginTop: 5,
  },

  modalBackground: {
    flex: 1,
    backgroundColor: "rgba(15, 30, 55, 0.5)",
    justifyContent: "center",
    paddingHorizontal: 25,
  },

  modalCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 22,
    padding: 24,
    alignItems: "center",
  },

  modalIcon: {
    width: 60,
    height: 60,
    borderRadius: 18,
    backgroundColor: "#E3EFFF",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
  },

  modalTitle: {
    fontFamily: "BeVietnamProBold",
    fontSize: 22,
    color: "#1D2939",
  },

  modalSubtitle: {
    fontFamily: "BeVietnamProRegular",
    fontSize: 14,
    color: "#667085",
    marginTop: 8,
    marginBottom: 22,
    textAlign: "center",
  },

  modalInput: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#D0D5DD",
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 13,
    fontFamily: "BeVietnamProRegular",
    fontSize: 15,
    color: "#1D2939",
    backgroundColor: "#F8FAFC",
  },

  modalButtons: {
    flexDirection: "row",
    width: "100%",
    gap: 12,
    marginTop: 22,
  },

  cancelButton: {
    flex: 1,
    paddingVertical: 13,
    borderRadius: 12,
    backgroundColor: "#F2F4F7",
    alignItems: "center",
  },

  cancelText: {
    fontFamily: "BeVietnamProSemiBold",
    fontSize: 14,
    color: "#475467",
  },

  createButton: {
    flex: 1,
    paddingVertical: 13,
    borderRadius: 12,
    backgroundColor: "#3478E5",
    alignItems: "center",
  },

  disabledButton: {
    opacity: 0.45,
  },

  createText: {
    fontFamily: "BeVietnamProSemiBold",
    fontSize: 14,
    color: "#FFFFFF",
  },
});

