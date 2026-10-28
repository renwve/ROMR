import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  Image,
  ImageBackground,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useSaved } from "../context/SavedContext";

const SCREEN_WIDTH = Dimensions.get("window").width;
const SCREEN_HEIGHT = Dimensions.get("window").height;
const COLLAPSED_HEIGHT = 170;
const EXPANDED_HEIGHT = Math.min(SCREEN_HEIGHT * 0.7, 590);

const COLORS = {
  cream: "#FCF7DF",
  blue: "#C7D3DB",
  taupe: "#A79A8A",
  chocolate: "#3E3630",
  white: "#FFFFFF",
  black: "#000000",
  background: "#E7E7F1",
};

const FONTS = {
  regular: "BeVietnamProRegular",
  semibold: "BeVietnamProSemiBold",
  italics: "BeVietnamProItalics",
  semiboldItalics: "BeVietnamProSemiBoldItalics",
};

const destinations = [
  {
    name: "Oia, Greece",
    subtitle: "Daily Recs",
    country: "Greece",
    image:
      "https://www.thehealthy.com/wp-content/uploads/2022/01/GettyImages-1046941212-MLedit.jpg?fit=750%2C750",
    weather: "Sunny",
    temperature: "20°C",
    description: "Whitewashed buildings, blue seas and slow afternoons.",
  },
  {
    name: "Kyoto, Japan",
    subtitle: "Culture & Calm",
    country: "Japan",
    image:
      "https://www.thehealthy.com/wp-content/uploads/2022/01/GettyImages-1046941212-MLedit.jpg?fit=750%2C750",
    weather: "Cloudy",
    temperature: "18°C",
    description: "Quiet temples, charming streets and little cafés.",
  },
  {
    name: "Amalfi, Italy",
    subtitle: "Coastal Escapes",
    country: "Italy",
    image:
      "https://www.thehealthy.com/wp-content/uploads/2022/01/GettyImages-1046941212-MLedit.jpg?fit=750%2C750",
    weather: "Sunny",
    temperature: "24°C",
    description: "Colourful seaside villages and long lunches.",
  },
  {
    name: "Bali, Indonesia",
    subtitle: "Island Living",
    country: "Indonesia",
    image:
      "https://www.thehealthy.com/wp-content/uploads/2022/01/GettyImages-1046941212-MLedit.jpg?fit=750%2C750",
    weather: "Partly sunny",
    temperature: "29°C",
    description: "Tropical greenery, ocean views and peaceful stays.",
  },
];

type TravelCardData = {
  id: string;
  title: string;
  image: string;
  price: string;
  rating: string;
  tag: string;
};

const thingsToDo: TravelCardData[] = [
  {
    id: "tokyo",
    title: "Tokyo Tower, Japan",
    image:
      "https://www.thehealthy.com/wp-content/uploads/2022/01/GettyImages-1046941212-MLedit.jpg?fit=750%2C750",
    price: "From $2,300",
    rating: "4.7",
    tag: "Popular",
  },
  {
    id: "resort",
    title: "Some Resort",
    image:
      "https://www.thehealthy.com/wp-content/uploads/2022/01/GettyImages-1046941212-MLedit.jpg?fit=750%2C750",
    price: "From $115",
    rating: "4.6",
    tag: "",
  },
  {
    id: "sky",
    title: "Sky Diving",
    image:
      "https://www.thehealthy.com/wp-content/uploads/2022/01/GettyImages-1046941212-MLedit.jpg?fit=750%2C750",
    price: "Free walk",
    rating: "4.8",
    tag: "",
  },
];

const communityTrips: TravelCardData[] = [
  {
    id: "midlife",
    title: "Mid-life Japan Trip",
    image:
      "https://www.thehealthy.com/wp-content/uploads/2022/01/GettyImages-1046941212-MLedit.jpg?fit=750%2C750",
    price: "From $2,300",
    rating: "4.8",
    tag: "Popular",
  },
  {
    id: "work",
    title: "Forgetting about work",
    image:
      "https://www.thehealthy.com/wp-content/uploads/2022/01/GettyImages-1046941212-MLedit.jpg?fit=750%2C750",
    price: "Free",
    rating: "5.0",
    tag: "",
  },
  {
    id: "aurora",
    title: "Aurora Hunting",
    image:
      "https://www.thehealthy.com/wp-content/uploads/2022/01/GettyImages-1046941212-MLedit.jpg?fit=750%2C750",
    price: "From $450",
    rating: "4.9",
    tag: "",
  },
];

const bestOffers: TravelCardData[] = [
  {
    id: "beach",
    title: "A little beach escape",
    image:
      "https://www.thehealthy.com/wp-content/uploads/2022/01/GettyImages-1046941212-MLedit.jpg?fit=750%2C750",
    price: "From $299",
    rating: "4.9",
    tag: "Limited",
  },
  {
    id: "mountain",
    title: "Mountain hideaway",
    image:
      "https://www.thehealthy.com/wp-content/uploads/2022/01/GettyImages-1046941212-MLedit.jpg?fit=750%2C750",
    price: "From $180",
    rating: "4.8",
    tag: "",
  },
  {
    id: "island",
    title: "Island weekend",
    image:
      "https://www.thehealthy.com/wp-content/uploads/2022/01/GettyImages-1046941212-MLedit.jpg?fit=750%2C750",
    price: "From $350",
    rating: "4.7",
    tag: "",
  },
];

export default function ExploreScreen() {
  const insets = useSafeAreaInsets();
  const carouselRef = useRef<ScrollView>(null);

  const heroHeight = useRef(new Animated.Value(COLLAPSED_HEIGHT)).current;

  const expandedOpacity = useRef(new Animated.Value(0)).current;

  const [activeIndex, setActiveIndex] = useState(0);
  const [expanded, setExpanded] = useState(false);
  const { savedItems, toggleSaved } = useSaved();

  const activeDestination = destinations[activeIndex];

  const toggleExpanded = () => {
    const nextExpanded = !expanded;

    setExpanded(nextExpanded);

    Animated.parallel([
      Animated.spring(heroHeight, {
        toValue: nextExpanded ? EXPANDED_HEIGHT : COLLAPSED_HEIGHT,
        useNativeDriver: false,
        damping: 22,
        stiffness: 100,
        mass: 0.9,
      }),
      Animated.timing(expandedOpacity, {
        toValue: nextExpanded ? 1 : 0,
        duration: 240,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const goToSlide = (index: number) => {
    const nextIndex = (index + destinations.length) % destinations.length;

    setActiveIndex(nextIndex);

    carouselRef.current?.scrollTo({
      x: nextIndex * SCREEN_WIDTH,
      animated: true,
    });
  };

  useEffect(() => {
    const interval = setInterval(() => {
      const nextIndex = (activeIndex + 1) % destinations.length;

      setActiveIndex(nextIndex);

      carouselRef.current?.scrollTo({
        x: nextIndex * SCREEN_WIDTH,
        animated: true,
      });
    }, 5000);

    return () => clearInterval(interval);
  }, [activeIndex]);

  const handleCarouselScroll = (
    event: NativeSyntheticEvent<NativeScrollEvent>,
  ) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(offsetX / SCREEN_WIDTH);

    if (index >= 0 && index < destinations.length && index !== activeIndex) {
      setActiveIndex(index);
    }
  };

  const openTrip = () => {
    router.push("/planner");
  };

  const renderTravelCard = (item: TravelCardData) => {
    const isSaved = savedItems.includes(item.id);

    return (
      <Pressable key={item.id} style={styles.travelCard} onPress={() => {}}>
        <View style={styles.cardImageContainer}>
          <Image
            source={{ uri: item.image }}
            style={styles.cardImage}
            resizeMode="cover"
          />

          {item.tag ? (
            <View style={styles.popularTag}>
              <Text style={styles.popularTagText}>{item.tag}</Text>
            </View>
          ) : null}

          <Pressable
            accessibilityRole="button"
            accessibilityLabel={
              isSaved ? "Remove from saved" : "Save destination"
            }
            hitSlop={8}
            style={styles.cardHeart}
            onPress={() => toggleSaved(item.id)}
          >
            <Ionicons
              name={isSaved ? "heart" : "heart-outline"}
              size={23}
              color={COLORS.white}
            />
          </Pressable>
        </View>

        <Text style={styles.cardTitle} numberOfLines={1}>
          {item.title}
        </Text>

        <View style={styles.cardMeta}>
          <Text style={styles.cardPrice} numberOfLines={1}>
            {item.price}
          </Text>

          <View style={styles.ratingContainer}>
            <Ionicons name="star" size={10} color={COLORS.chocolate} />
            <Text style={styles.cardRating}>{item.rating}</Text>
          </View>
        </View>
      </Pressable>
    );
  };

  const renderSection = (title: string, data: TravelCardData[]) => (
    <View style={styles.section} key={title}>
      <View style={styles.sectionHeading}>
        <Text style={styles.sectionTitle}>{title}</Text>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`See all ${title.toLowerCase()}`}
          onPress={() => {}}
          hitSlop={10}
        >
          <Ionicons name="chevron-forward" size={20} color={COLORS.black} />
        </Pressable>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.cardsRow}
      >
        {data.map(renderTravelCard)}
      </ScrollView>
    </View>
  );

  return (
    <View style={styles.screen}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent
      />

      <ScrollView
        style={styles.pageScroll}
        contentContainerStyle={[
          styles.pageContent,
          {
            paddingBottom: 100 + insets.bottom,
          },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View
          style={[
            styles.hero,
            {
              height: heroHeight,
            },
          ]}
        >
          <ScrollView
            ref={carouselRef}
            horizontal
            pagingEnabled
            scrollEnabled={expanded}
            showsHorizontalScrollIndicator={false}
            onMomentumScrollEnd={handleCarouselScroll}
            scrollEventThrottle={16}
            bounces={false}
            style={styles.carousel}
          >
            {destinations.map((destination) => (
              <ImageBackground
                key={destination.name}
                source={{ uri: destination.image }}
                style={styles.heroImage}
                imageStyle={styles.heroImageStyle}
                resizeMode="cover"
              >
                <View style={styles.imageShade} />
              </ImageBackground>
            ))}
          </ScrollView>

          <View
            style={[styles.brandRow, { top: insets.top + 8 }]}
            pointerEvents="none"
          >
            <Text style={styles.brand}>ROMR˙</Text>

            <Text style={styles.date}>October 2</Text>
          </View>

          <Animated.View
            pointerEvents={expanded ? "auto" : "none"}
            style={[
              styles.expandedContent,
              {
                opacity: expandedOpacity,
              },
            ]}
          >
            <View style={styles.destinationDetails}>
              <Text style={styles.destinationSubtitle}>
                {activeDestination.subtitle}
              </Text>

              <Text style={styles.destinationName}>
                {activeDestination.name}
              </Text>

              <View style={styles.weatherRow}>
                <Ionicons name="sunny-outline" size={23} color={COLORS.white} />
                <Text style={styles.weatherText}>
                  {activeDestination.weather}
                </Text>
              </View>

              <View style={styles.weatherRow}>
                <Ionicons
                  name="thermometer-outline"
                  size={23}
                  color={COLORS.white}
                />
                <Text style={styles.weatherText}>
                  {activeDestination.temperature}
                </Text>
              </View>

              <Text style={styles.destinationDescription}>
                {activeDestination.description}
              </Text>
            </View>

            <View style={styles.heroActions}>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Save destination"
                style={styles.roundAction}
                onPress={() => toggleSaved(activeDestination.name)}
              >
                <Ionicons
                  name={
                    savedItems.includes(activeDestination.name)
                      ? "heart"
                      : "heart-outline"
                  }
                  size={24}
                  color={COLORS.white}
                />
              </Pressable>

              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Open trip planner"
                style={styles.roundAction}
                onPress={openTrip}
              >
                <Ionicons
                  name="arrow-up"
                  size={25}
                  color={COLORS.white}
                  style={styles.diagonalArrow}
                />
              </Pressable>
            </View>

            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Plan this trip"
              style={styles.planButton}
              onPress={openTrip}
            >
              <Text style={styles.planButtonText}>Plan this trip ✦</Text>
            </Pressable>

            <View style={styles.pagination}>
              {destinations.map((destination, index) => (
                <Pressable
                  key={destination.name}
                  accessibilityRole="button"
                  accessibilityLabel={`Show ${destination.name}`}
                  onPress={() => goToSlide(index)}
                  style={[
                    styles.dot,
                    activeIndex === index && styles.activeDot,
                  ]}
                />
              ))}
            </View>
          </Animated.View>

          <Pressable
            accessibilityRole="button"
            accessibilityLabel={
              expanded
                ? "Collapse destination slideshow"
                : "Expand destination slideshow"
            }
            onPress={toggleExpanded}
            style={[
              styles.notification,
              {
                top: insets.top + 38,
              },
            ]}
          >
            <View style={styles.notificationAvatar}>
              <Image
                source={{
                  uri: "https://www.thehealthy.com/wp-content/uploads/2022/01/GettyImages-1046941212-MLedit.jpg?fit=750%2C750",
                }}
                style={styles.notificationAvatarImage}
              />
            </View>

            <View style={styles.notificationTextContainer}>
              <Text style={styles.notificationGreeting}>Hey, Callie</Text>

              <Text style={styles.notificationMessage} numberOfLines={1}>
                Your Japan trip planning is complete
              </Text>
            </View>

            <Ionicons
              name="notifications-outline"
              size={21}
              color={COLORS.white}
            />
          </Pressable>
        </Animated.View>

        <View style={styles.recommendations}>
          {renderSection("Things to do near you", thingsToDo)}

          {renderSection("What others are doing", communityTrips)}

          {renderSection("Our best offers", bestOffers)}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  pageScroll: {
    flex: 1,
  },

  pageContent: {
    flexGrow: 1,
    backgroundColor: COLORS.background,
  },

  hero: {
    width: SCREEN_WIDTH,
    overflow: "hidden",
    position: "relative",
    backgroundColor: "#16475B",
    borderBottomLeftRadius: 36,
    borderBottomRightRadius: 36,
  },

  carousel: {
    ...StyleSheet.absoluteFill,
  },

  heroImage: {
    width: SCREEN_WIDTH,
    height: EXPANDED_HEIGHT,
    justifyContent: "flex-start",
  },

  heroImageStyle: {
    width: SCREEN_WIDTH,
    height: EXPANDED_HEIGHT,
    resizeMode: "cover",
  },

  imageShade: {
    ...StyleSheet.absoluteFill,
    backgroundColor: "rgba(0, 24, 38, 0.36)",
  },

  brandRow: {
    position: "absolute",
    left: 40,
    right: 40,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    zIndex: 11,
  },

  brand: {
    fontFamily: FONTS.semiboldItalics,
    color: COLORS.white,
    fontSize: 12,
    letterSpacing: -0.7,
  },

  date: {
    fontFamily: FONTS.semibold,
    color: COLORS.white,
    fontSize: 12,
  },

  notification: {
    position: "absolute",
    left: 38,
    right: 38,
    minHeight: 64,
    paddingVertical: 9,
    paddingHorizontal: 11,
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 36,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.65)",
    backgroundColor: "rgba(214, 226, 233, 0.32)",
    zIndex: 12,
  },

  notificationAvatar: {
    width: 35,
    height: 35,
    borderRadius: 22,
    overflow: "hidden",
    backgroundColor: "#E7E7F1",
    marginRight: 6,
  },

  notificationAvatarImage: {
    width: "100%",
    height: "100%",
    borderRadius: 22,
  },

  notificationTextContainer: {
    flex: 1,
    justifyContent: "center",
    marginRight: 6,
  },

  notificationGreeting: {
    fontFamily: FONTS.semibold,
    color: COLORS.white,
    fontSize: 15,
    lineHeight: 20,
  },

  notificationMessage: {
    fontFamily: FONTS.regular,
    color: COLORS.white,
    fontSize: 12,
    lineHeight: 17,
  },

  expandedContent: {
    ...StyleSheet.absoluteFill,
    zIndex: 5,
  },

  destinationDetails: {
    position: "absolute",
    top: "29%",
    left: 39,
    right: 95,
    zIndex: 3,
  },

  destinationSubtitle: {
    fontFamily: FONTS.regular,
    fontSize: 15,
    color: "rgba(255,255,255,0.9)",
    marginBottom: 1,
  },

  destinationName: {
    fontFamily: FONTS.semiboldItalics,
    fontSize: 35,
    lineHeight: 44,
    color: COLORS.white,
    letterSpacing: -1.2,
    marginBottom: 11,
  },

  weatherRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 7,
    gap: 7,
  },

  weatherText: {
    fontFamily: FONTS.italics,
    color: "rgba(255,255,255,0.9)",
    fontSize: 19,
  },

  destinationDescription: {
    fontFamily: FONTS.regular,
    color: "rgba(255,255,255,0.85)",
    fontSize: 12,
    lineHeight: 18,
    marginTop: 5,
  },

  heroActions: {
    position: "absolute",
    right: 24,
    top: "29%",
    alignItems: "center",
    gap: 9,
    zIndex: 4,
  },

  roundAction: {
    width: 54,
    height: 54,
    borderRadius: 28,
    backgroundColor: "rgba(220, 231, 235, 0.38)",
    borderColor: "rgba(255,255,255,0.75)",
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  diagonalArrow: {
    transform: [{ rotate: "45deg" }],
  },

  planButton: {
    position: "absolute",
    bottom: 63,
    alignSelf: "center",
    minHeight: 45,
    paddingHorizontal: 17,
    paddingVertical: 9,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.white,
    borderColor: "#D9B9D0",
    borderWidth: 2,
    borderRadius: 26,
    zIndex: 8,
  },

  planButtonText: {
    fontFamily: FONTS.semibold,
    fontSize: 17,
    color: "#333333",
  },

  pagination: {
    position: "absolute",
    bottom: 27,
    alignSelf: "center",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    zIndex: 8,
  },

  dot: {
    width: 16,
    height: 7,
    borderRadius: 5,
    backgroundColor: "rgba(255,255,255,0.72)",
  },

  activeDot: {
    width: 39,
    backgroundColor: COLORS.white,
  },

  recommendations: {
    paddingTop: 23,
    backgroundColor: COLORS.background,
  },

  section: {
    marginBottom: 18,
  },

  sectionHeading: {
    paddingHorizontal: 20,
    marginBottom: 11,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  sectionTitle: {
    fontFamily: FONTS.semibold,
    color: COLORS.black,
    fontSize: 17,
    letterSpacing: -0.5,
  },

  cardsRow: {
    paddingLeft: 20,
    paddingRight: 15,
    gap: 12,
  },

  travelCard: {
    width: 160,
  },

  cardImageContainer: {
    height: 146,
    width: 160,
    borderRadius: 15,
    overflow: "hidden",
    backgroundColor: COLORS.blue,
    position: "relative",
  },

  cardImage: {
    width: "100%",
    height: "100%",
  },

  popularTag: {
    position: "absolute",
    top: 11,
    left: 11,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 16,
    backgroundColor: COLORS.white,
  },

  popularTagText: {
    fontFamily: FONTS.semibold,
    color: COLORS.black,
    fontSize: 11,
  },

  cardHeart: {
    position: "absolute",
    top: 10,
    right: 10,
    width: 30,
    height: 30,
    alignItems: "center",
    justifyContent: "center",
  },

  cardTitle: {
    fontFamily: FONTS.regular,
    fontSize: 11,
    color: COLORS.black,
    marginTop: 7,
    marginBottom: 3,
  },

  cardMeta: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  cardPrice: {
    fontFamily: FONTS.regular,
    color: "#555555",
    fontSize: 9,
    flexShrink: 1,
    marginRight: 4,
  },

  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
  },

  cardRating: {
    fontFamily: FONTS.regular,
    color: "#555555",
    fontSize: 9,
  },
});
