import React, { useState } from "react";
import {
  Image,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import PlaceDetailsModal, {
  type PlaceDetails,
} from "../components/placedetailsmodal";

import {
  cityEscapes2026,
  communityTrips,
  fallPlaces,
  nicheCities,
  placeDetails,
  thingsToDo,
  type InspirationCard,
  type TravelCardData,
} from "../components/exploredata";

const COLORS = {
  cream: "#FCF7DF",
  blue: "#C7D3DB",
  taupe: "#A79A8A",
  chocolate: "#3E3630",
  white: "#FFFFFF",
  navy: "#0B1049",
  background: "#E7E7F1",
};

const FONTS = {
  regular: "BeVietnamProRegular",
  semibold: "BeVietnamProSemiBold",
  italics: "BeVietnamProItalics",
  semiboldItalics: "BeVietnamProSemiBoldItalics",
};

type Category =
  | "fall"
  | "niche"
  | "cities"
  | "things"
  | "community"
  | "scenery"
  | "gems";

const categoryInfo: Record<
  Category,
  { title: string; subtitle: string; eyebrow: string }
> = {
  fall: {
    title: "Top 10 places to visit in fall",
    subtitle: "Autumn colours, cosy cities and seasonal escapes.",
    eyebrow: "THE SEASONAL EDIT",
  },
  niche: {
    title: "Niche cities around the world",
    subtitle: "Smaller spots with their own rhythm.",
    eyebrow: "SMALLER SPOTS, BIG FEELING",
  },
  cities: {
    title: "Popular city escapes for 2026",
    subtitle: "A little city inspiration for your next trip.",
    eyebrow: "THE 2026 CITY EDIT",
  },
  things: {
    title: "Things to do near you",
    subtitle: "Ideas for your next little adventure.",
    eyebrow: "GET OUT THERE",
  },
  community: {
    title: "What others are doing",
    subtitle: "A little inspiration from fellow travellers.",
    eyebrow: "TRAVELLER FAVOURITES",
  },
  scenery: {
    title: "Beautiful places around the world",
    subtitle: "Views worth travelling for.",
    eyebrow: "WORTH THE VIEW",
  },
  gems: {
    title: "Hidden gems",
    subtitle: "A little off the usual travel map.",
    eyebrow: "A LITTLE OFF THE MAP",
  },
};

const getDetailId = (id: string) => {
  const detailIds: Record<string, string> = {
    tokyo: "kyoto",
    resort: "amalfi",
    sky: "reykjavik",
    midlife: "kyoto",
    work: "lucerne",
    aurora: "reykjavik",
    mountain: "dolomites",
  };

  return detailIds[id] ?? id;
};

export default function SeeMoreScreen() {
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ category?: string | string[] }>();

  const rawCategory = Array.isArray(params.category)
    ? params.category[0]
    : params.category;

  const category: Category =
    rawCategory && rawCategory in categoryInfo
      ? (rawCategory as Category)
      : "fall";

  const info = categoryInfo[category];

  const [savedItems, setSavedItems] = useState<string[]>([]);
  const [selectedPlace, setSelectedPlace] = useState<PlaceDetails | null>(
    null,
  );
  const [modalVisible, setModalVisible] = useState(false);

  const openPlace = (id: string) => {
    const place = placeDetails[getDetailId(id)];

    if (!place) return;

    setSelectedPlace(place);
    setModalVisible(true);
  };

  const toggleSaved = (id: string) => {
    setSavedItems((previous) =>
      previous.includes(id)
        ? previous.filter((savedId) => savedId !== id)
        : [...previous, id],
    );
  };

  const openTravelCard = (item: TravelCardData) => {
    openPlace(item.id);
  };

  const renderTravelCard = (item: TravelCardData, index: number) => {
    const isSaved = savedItems.includes(item.id);

    return (
      <Pressable
        key={`${item.id}-${index}`}
        style={styles.travelCard}
        onPress={() => openTravelCard(item)}
      >
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: item.image }}
            style={styles.cardImage}
            resizeMode="cover"
          />

          <View style={styles.imageShade} />

          {item.tag ? (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{item.tag}</Text>
            </View>
          ) : null}

          <Pressable
            style={styles.heartButton}
            onPress={(event) => {
              event.stopPropagation();
              toggleSaved(item.id);
            }}
            accessibilityRole="button"
            accessibilityLabel={isSaved ? "Remove from saved" : "Save item"}
          >
            <Ionicons
              name={isSaved ? "heart" : "heart-outline"}
              size={21}
              color={COLORS.white}
            />
          </Pressable>

          <View style={styles.cardText}>
            <Text style={styles.cardTitle}>{item.title}</Text>

            <View style={styles.cardMeta}>
              <Text style={styles.cardPrice}>{item.price}</Text>

              <View style={styles.rating}>
                <Ionicons name="star" size={12} color={COLORS.white} />
                <Text style={styles.ratingText}>{item.rating}</Text>
              </View>
            </View>
          </View>
        </View>
      </Pressable>
    );
  };

  const renderInspirationCard = (item: InspirationCard, index: number) => (
    <Pressable
      key={`${item.id}-${index}`}
      style={[
        styles.inspirationCard,
        category === "fall" && styles.fallCard,
        category === "niche" && styles.nicheCard,
        category === "cities" && styles.cityCard,
      ]}
      onPress={() => openPlace(item.id)}
    >
      <Image
        source={{ uri: item.image }}
        style={styles.cardImage}
        resizeMode="cover"
      />

      <View style={styles.imageShade} />

      <View style={styles.badge}>
        <Text style={styles.badgeText}>{item.badge}</Text>
      </View>

      <View style={styles.inspirationText}>
        <Text style={styles.cardTitle}>{item.title}</Text>
        <Text style={styles.cardSubtitle}>{item.subtitle}</Text>
      </View>
    </Pressable>
  );

  const renderContent = () => {
    if (category === "things") {
      return (
        <View style={styles.travelList}>
          {thingsToDo.map(renderTravelCard)}
        </View>
      );
    }

    if (category === "community") {
      return (
        <View style={styles.travelList}>
          {communityTrips.map(renderTravelCard)}
        </View>
      );
    }

    let data: InspirationCard[] = [];

    if (category === "fall") data = fallPlaces;
    if (category === "niche") data = nicheCities;
    if (category === "cities") data = cityEscapes2026;

    return (
      <View style={styles.inspirationList}>
        {data.map(renderInspirationCard)}
      </View>
    );
  };

  return (
    <View style={styles.screen}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.pageContent,
          {
            paddingTop: insets.top + 8,
            paddingBottom: insets.bottom + 35,
          },
        ]}
      >
        <View style={styles.topBar}>
          <Pressable
            style={styles.backButton}
            onPress={() => router.back()}
            accessibilityRole="button"
            accessibilityLabel="Go back"
          >
            <Ionicons name="arrow-back" size={21} color={COLORS.chocolate} />
          </Pressable>

          <View style={styles.topBarSpacer} />
        </View>

        <View style={styles.heading}>
          <Text style={styles.eyebrow}>{info.eyebrow}</Text>
          <Text style={styles.headingTitle}>{info.title}</Text>
          <Text style={styles.headingSubtitle}>{info.subtitle}</Text>
        </View>

        {renderContent()}
      </ScrollView>

      <PlaceDetailsModal
        visible={modalVisible}
        place={selectedPlace}
        isFavorite={
          selectedPlace ? savedItems.includes(selectedPlace.id) : false
        }
        onClose={() => setModalVisible(false)}
        onToggleFavorite={(place) => toggleSaved(place.id)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  pageContent: {
    flexGrow: 1,
  },
  topBar: {
    paddingHorizontal: 19,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  backButton: {
    width: 43,
    height: 43,
    alignItems: "center",
    justifyContent: "center",
  },
  topBarBrand: {
    fontFamily: FONTS.semiboldItalics,
    fontSize: 14,
    color: COLORS.chocolate,
    letterSpacing: -0.5,
  },
  topBarSpacer: {
    width: 43,
  },
  heading: {
    paddingHorizontal: 20,
    marginBottom: 23,
  },
  eyebrow: {
    fontFamily: FONTS.semibold,
    fontSize: 9,
    letterSpacing: 1.6,
    color: "#777064",
    marginBottom: 8,
  },
  headingTitle: {
    fontFamily: FONTS.semiboldItalics,
    color: COLORS.chocolate,
    fontSize: 29,
    lineHeight: 37,
    letterSpacing: -0.8,
  },
  headingSubtitle: {
    fontFamily: FONTS.regular,
    color: "#615D58",
    fontSize: 12,
    lineHeight: 19,
    marginTop: 7,
  },
  travelList: {
    paddingHorizontal: 16,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    rowGap: 17,
  },
  travelCard: {
    width: "48%",
    marginBottom: 4,
  },
  imageContainer: {
    height: 235,
    width: "100%",
    borderRadius: 21,
    overflow: "hidden",
    backgroundColor: COLORS.blue,
    position: "relative",
  },
  cardImage: {
    ...StyleSheet.absoluteFill,
    width: "100%",
    height: "100%",
  },
  imageShade: {
    ...StyleSheet.absoluteFill,
    backgroundColor: "rgba(20,25,35,0.34)",
  },
  badge: {
    position: "absolute",
    top: 12,
    left: 12,
    maxWidth: "78%",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 15,
    backgroundColor: "rgba(255,255,255,0.92)",
  },
  badgeText: {
    fontFamily: FONTS.semibold,
    color: COLORS.chocolate,
    fontSize: 8,
    letterSpacing: 0.6,
  },
  heartButton: {
    position: "absolute",
    top: 10,
    right: 10,
    width: 35,
    height: 35,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(30,30,30,0.22)",
  },
  cardText: {
    position: "absolute",
    left: 13,
    right: 13,
    bottom: 13,
  },
  cardTitle: {
    fontFamily: FONTS.semiboldItalics,
    color: COLORS.white,
    fontSize: 18,
    lineHeight: 24,
  },
  cardMeta: {
    marginTop: 7,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 5,
  },
  cardPrice: {
    fontFamily: FONTS.semibold,
    color: COLORS.white,
    fontSize: 11,
    flexShrink: 1,
  },
  rating: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  ratingText: {
    fontFamily: FONTS.regular,
    color: COLORS.white,
    fontSize: 10,
  },
  inspirationList: {
    paddingHorizontal: 16,
    gap: 15,
  },
  inspirationCard: {
    width: "100%",
    height: 235,
    borderRadius: 22,
    overflow: "hidden",
    backgroundColor: COLORS.blue,
    position: "relative",
  },
  fallCard: {
    height: 190,
    borderRadius: 18,
  },
  nicheCard: {
    height: 220,
    borderRadius: 25,
  },
  cityCard: {
    height: 205,
    borderRadius: 17,
  },
  inspirationText: {
    position: "absolute",
    left: 16,
    right: 16,
    bottom: 15,
  },
  cardSubtitle: {
    fontFamily: FONTS.regular,
    color: "rgba(255,255,255,0.92)",
    fontSize: 11,
    lineHeight: 17,
    marginTop: 5,
  },
  rankCircle: {
    position: "absolute",
    right: 13,
    top: 13,
    width: 37,
    height: 37,
    borderRadius: 19,
    backgroundColor: "rgba(255,255,255,0.9)",
    alignItems: "center",
    justifyContent: "center",
  },
  rankText: {
    fontFamily: FONTS.semibold,
    fontSize: 10,
    color: COLORS.chocolate,
  },
});