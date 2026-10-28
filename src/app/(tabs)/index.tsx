import React, { useEffect, useRef, useState } from "react";
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
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import PlaceDetailsModal, {
  type PlaceDetails,
} from "../../../components/placedetailsmodal";

import {
  bestOffers,
  cityEscapes2026,
  communityTrips,
  fallPlaces,
  nicheCities,
  placeDetails,
  thingsToDo,
  type InspirationCard,
  type TravelCardData,
} from "../../../components/exploredata";

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
  navy: "#0B1049",
  background: "#E7E7F1",
  purple: "#7774AE",
};

const FONTS = {
  regular: "BeVietnamProRegular",
  semibold: "BeVietnamProSemiBold",
  italics: "BeVietnamProItalics",
  semiboldItalics: "BeVietnamProSemiBoldItalics",
};

type Destination = {
  id: string;
  name: string;
  subtitle: string;
  country: string;
  image: string;
  weather: string;
  temperature: string;
  description: string;
};

const destinations: Destination[] = [
  {
    id: "oia",
    name: "Oia, Greece",
    subtitle: "Daily Recs",
    country: "Greece",
    image:
      "https://images.unsplash.com/photo-1580502304784-8985b7eb7260?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D",
    weather: "Mediterranean sunshine",
    temperature: "20°C",
    description: "Whitewashed buildings, blue seas and slow afternoons.",
  },
  {
    id: "kyoto",
    name: "Kyoto, Japan",
    subtitle: "Culture & Calm",
    country: "Japan",
    image:
      "https://images.unsplash.com/photo-1558870832-c8db4b5b47d1?q=80&w=688&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D",
    weather: "Mild seasonal weather",
    temperature: "18°C",
    description: "Quiet temples, charming streets and little cafés.",
  },
  {
    id: "amalfi",
    name: "Amalfi Coast, Italy",
    subtitle: "Coastal Escapes",
    country: "Italy",
    image:
      "https://images.unsplash.com/photo-1561956021-947f09ae0101?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D",
    weather: "Coastal sunshine",
    temperature: "24°C",
    description:
      "Colourful seaside villages, cliffside views and long lunches.",
  },
  {
    id: "bali",
    name: "Ubud, Indonesia",
    subtitle: "Island Living",
    country: "Indonesia",
    image:
      "https://plus.unsplash.com/premium_photo-1661878915254-f3163e91d870?q=80&w=1171&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D",
    weather: "Tropical and humid",
    temperature: "29°C",
    description: "Tropical greenery, rice terraces and peaceful stays.",
  },
];

const fallCountries: InspirationCard[] = [
  {
    id: "kyoto",
    title: "Japan",
    subtitle: "Maple leaves & temple gardens",
    image:
      "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=900&q=85",
    badge: "01",
  },
  {
    id: "paris",
    title: "France",
    subtitle: "Golden parks & café weather",
    image:
      "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=900&q=85",
    badge: "02",
  },
  {
    id: "dolomites",
    title: "Italy",
    subtitle: "Autumn villages & mountain trails",
    image:
      "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=900&q=85",
    badge: "03",
  },
  {
    id: "banff",
    title: "Canada",
    subtitle: "Larch trees & crisp mountain air",
    image:
      "https://images.unsplash.com/photo-1503614472-8c93d56e92ce?q=80&w=1111&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D",
    badge: "04",
  },
  {
    id: "lucerne",
    title: "Switzerland",
    subtitle: "Lakeside walks & alpine views",
    image:
      "https://images.unsplash.com/photo-1531366936337-7c912a4589a7?auto=format&fit=crop&w=900&q=85",
    badge: "05",
  },
  {
    id: "marrakech",
    title: "Morocco",
    subtitle: "Warm days & colourful souks",
    image:
      "https://images.unsplash.com/photo-1597212618440-806262de4f6b?auto=format&fit=crop&w=900&q=85",
    badge: "06",
  },
  {
    id: "oia",
    title: "Greece",
    subtitle: "Shoulder-season island views",
    image:
      "https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?auto=format&fit=crop&w=900&q=85",
    badge: "07",
  },
  {
    id: "reykjavik",
    title: "Iceland",
    subtitle: "Aurora season begins",
    image:
      "https://images.unsplash.com/photo-1476610182048-b716b8518aae?auto=format&fit=crop&w=900&q=85",
    badge: "08",
  },
  {
    id: "patagonia",
    title: "Argentina",
    subtitle: "Spring hikes in Patagonia",
    image:
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=900&q=85",
    badge: "09",
  },
  {
    id: "bali",
    title: "Indonesia",
    subtitle: "Tropical warmth and green escapes",
    image:
      "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=900&q=85",
    badge: "10",
  },
];

const worldScenery: InspirationCard[] = [
  {
    id: "patagonia",
    title: "Patagonia",
    subtitle: "Jagged peaks & glacier-blue lakes",
    image:
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=900&q=85",
    badge: "01",
  },
  {
    id: "machupicchu",
    title: "Machu Picchu",
    subtitle: "Ancient ruins in the Andes",
    image:
      "https://images.unsplash.com/photo-1526392060635-9d6019884377?auto=format&fit=crop&w=900&q=85",
    badge: "02",
  },
  {
    id: "dolomites",
    title: "The Dolomites",
    subtitle: "Pale peaks & alpine meadows",
    image:
      "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=900&q=85",
    badge: "03",
  },
  {
    id: "banff",
    title: "Canadian Rockies",
    subtitle: "Turquoise lakes & forested valleys",
    image:
      "https://images.unsplash.com/photo-1503614472-8c93d56e92ce?q=80&w=1111&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D",
    badge: "04",
  },
  {
    id: "reykjavik",
    title: "Iceland",
    subtitle: "Waterfalls, lava fields & auroras",
    image:
      "https://images.unsplash.com/photo-1476610182048-b716b8518aae?auto=format&fit=crop&w=900&q=85",
    badge: "05",
  },
];

const hiddenGems: InspirationCard[] = [
  {
    id: "marrakech",
    title: "Marrakech, Morocco",
    subtitle: "Riads, gardens & bustling souks",
    image:
      "https://images.unsplash.com/photo-1597212618440-806262de4f6b?auto=format&fit=crop&w=900&q=85",
    badge: "LOCAL FAVOURITE",
  },
  {
    id: "lucerne",
    title: "Lucerne, Switzerland",
    subtitle: "A lakeside old town with mountain access",
    image:
      "https://images.unsplash.com/photo-1531366936337-7c912a4589a7?auto=format&fit=crop&w=900&q=85",
    badge: "SLOW TRAVEL",
  },
  {
    id: "bali",
    title: "Ubud, Indonesia",
    subtitle: "Rice terraces, craft and calm",
    image:
      "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=900&q=85",
    badge: "NATURE BREAK",
  },
];

export default function ExploreScreen() {
  const insets = useSafeAreaInsets();
  const carouselRef = useRef<ScrollView>(null);

  const heroHeight = useRef(new Animated.Value(COLLAPSED_HEIGHT)).current;

  const expandedOpacity = useRef(new Animated.Value(0)).current;

  const [activeIndex, setActiveIndex] = useState(0);
  const activeIndexRef = useRef(0);

  const [expanded, setExpanded] = useState(false);
  const [savedItems, setSavedItems] = useState<string[]>([]);
  const [selectedPlace, setSelectedPlace] = useState<PlaceDetails | null>(
    null,
  );
  const [placeDetailsVisible, setPlaceDetailsVisible] = useState(false);

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

    activeIndexRef.current = nextIndex;
    setActiveIndex(nextIndex);

    carouselRef.current?.scrollTo({
      x: nextIndex * SCREEN_WIDTH,
      y: 0,
      animated: true,
    });
  };

  useEffect(() => {
    const interval = setInterval(() => {
      const nextIndex = (activeIndexRef.current + 1) % destinations.length;

      activeIndexRef.current = nextIndex;
      setActiveIndex(nextIndex);

      carouselRef.current?.scrollTo({
        x: nextIndex * SCREEN_WIDTH,
        y: 0,
        animated: true,
      });
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const syncCarouselIndex = (
    event: NativeSyntheticEvent<NativeScrollEvent>,
  ) => {
    const offsetX = event.nativeEvent.contentOffset.x;

    const index = Math.max(
      0,
      Math.min(
        destinations.length - 1,
        Math.round(offsetX / SCREEN_WIDTH),
      ),
    );

    if (index !== activeIndexRef.current) {
      activeIndexRef.current = index;
      setActiveIndex(index);
    }
  };

  const toggleSaved = (id: string) => {
    setSavedItems((previous) =>
      previous.includes(id)
        ? previous.filter((item) => item !== id)
        : [...previous, id],
    );
  };

  const openPlace = (id: string) => {
    const place = placeDetails[id];

    if (!place) {
      console.warn(`No place details found for "${id}".`);
      return;
    }

    setSelectedPlace(place);
    setPlaceDetailsVisible(true);
  };

  const closePlace = () => {
    setPlaceDetailsVisible(false);
  };

  const openTrip = () => {
    router.push("/planner");
  };

  const openCategory = (category: string) => {
    router.push({
      pathname: "/seemore",
      params: { category },
    });
  };

  const getTravelCardDetailId = (item: TravelCardData): string => {
    switch (item.id) {
      case "beach":
        return "beach-offer";
      case "mountain":
        return "mountain-offer";
      case "city":
        return "city-offer";
      case "island":
        return "island-offer";
      case "tokyo":
        return "kyoto";
      case "resort":
        return "amalfi";
      case "sky":
        return "reykjavik";
      case "midlife":
        return "kyoto";
      case "work":
        return "lucerne";
      case "aurora":
        return "reykjavik";
      default:
        return placeDetails[item.id] ? item.id : "bali";
    }
  };

  const renderTravelCard = (item: TravelCardData) => {
    const isSaved = savedItems.includes(item.id);
    const detailId = getTravelCardDetailId(item);

    return (
      <Pressable
        key={item.id}
        style={styles.travelCard}
        onPress={() => openPlace(detailId)}
        accessibilityRole="button"
        accessibilityLabel={`View details for ${item.title}`}
      >
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
            onPress={(event) => {
              event.stopPropagation();
              toggleSaved(item.id);
            }}
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

  const renderOfferCard = (item: TravelCardData) => {
    const detailId = placeDetails[item.id]
      ? item.id
      : getTravelCardDetailId(item);

    const offerDetails = placeDetails[detailId];

    return (
      <Pressable
        key={item.id}
        style={styles.offerCard}
        onPress={() => {
          if (offerDetails) {
            openPlace(detailId);
          } else {
            console.warn(
              `No popup details found for offer "${item.title}". ` +
                `Add an entry for "${item.id}" to placeDetails in exploredata.ts.`,
            );
          }
        }}
        accessibilityRole="button"
        accessibilityLabel={`View details for ${item.title}`}
      >
        <Image
          source={{ uri: item.image }}
          style={styles.offerImage}
          resizeMode="cover"
        />

        <View style={styles.offerImageShade} />

        <View style={styles.offerImageBadge}>
          <Text style={styles.offerImageBadgeText}>
            {item.tag || "SPECIAL OFFER"}
          </Text>
        </View>

        <View style={styles.offerCopy}>
          <Text style={styles.offerEyebrow}>
            A LITTLE SOMETHING FOR YOUR NEXT GETAWAY
          </Text>

          <Text style={styles.offerTitle} numberOfLines={2}>
            {item.title}
          </Text>

          <View style={styles.offerPriceRow}>
            <Text style={styles.offerPrice}>{item.price}</Text>

            <Text style={styles.offerWasPrice}>
              get away for a little less
            </Text>
          </View>

          <View style={styles.offerRating}>
            <Ionicons name="star" size={11} color="#FFE4A3" />

            <Text style={styles.offerRatingText}>
              {item.rating} · a little escape
            </Text>
          </View>
        </View>

        <View style={styles.offerArrow} pointerEvents="none">
          <Ionicons name="arrow-forward" size={18} color={COLORS.white} />
        </View>
      </Pressable>
    );
  };

  const renderSection = (title: string, data: TravelCardData[]) => {
    if (title === "Our best offers") {
      return (
        <View style={styles.section} key={title}>
          <View style={styles.offerSection}>
            <View style={styles.inspirationHeading}>
              <View style={styles.inspirationHeadingCopy}>
                <Text style={styles.inspirationEyebrow}>
                  A LITTLE SOMETHING FOR YOUR NEXT GETAWAY
                </Text>

                <Text style={styles.inspirationTitle}>Our best offers</Text>

                <Text style={styles.inspirationSubtitle}>
                  Lovely escapes, a little easier on your wallet.
                </Text>
              </View>

              <View style={styles.inspirationIcon}>
                <Ionicons
                  name="pricetag-outline"
                  size={21}
                  color={COLORS.chocolate}
                />
              </View>
            </View>

            <View style={styles.offerRow}>
              {data.map((item) => (
                <View key={item.id} style={styles.offerCardWrapper}>
                  {renderOfferCard(item)}
                </View>
              ))}
            </View>
          </View>
        </View>
      );
    }

    const category =
      title === "Things to do near you" ? "things" : "community";

    return (
      <View style={styles.section} key={title}>
        <View style={styles.sectionHeading}>
          <Text style={styles.sectionTitle}>{title}</Text>

          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`See more ${title.toLowerCase()}`}
            onPress={() => openCategory(category)}
            hitSlop={10}
          >
            <Ionicons
              name="chevron-forward"
              size={20}
              color={COLORS.navy}
            />
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
  };

  const renderInspirationSection = (
    title: string,
    subtitle: string,
    data: InspirationCard[],
    style: "fall" | "scenery" | "gems" | "cities" | "niche",
  ) => {
    const category =
      style === "fall"
        ? "fall"
        : style === "niche"
          ? "niche"
          : style === "scenery"
            ? "scenery"
            : style === "gems"
              ? "gems"
              : "cities";

    return (
      <Pressable
        key={title}
        onPress={() => openCategory(category)}
        accessibilityRole="button"
        accessibilityLabel={`See more: ${title}`}
        style={[
          styles.inspirationSection,
          style === "fall" && styles.fallSection,
          style === "scenery" && styles.scenerySection,
          style === "gems" && styles.gemsSection,
          style === "cities" && styles.citiesSection,
          style === "niche" && styles.nicheSection,
        ]}
      >
        <View style={styles.inspirationHeading}>
          <View style={styles.inspirationHeadingCopy}>
            <Text style={styles.inspirationEyebrow}>
              {style === "fall"
                ? "THE SEASONAL EDIT"
                : style === "scenery"
                  ? "WORTH THE VIEW"
                  : style === "cities"
                    ? "THE 2026 CITY EDIT"
                    : style === "niche"
                      ? "SMALLER SPOTS, BIG FEELING"
                      : "A LITTLE OFF THE MAP"}
            </Text>

            <Text style={styles.inspirationTitle}>{title}</Text>

            <Text style={styles.inspirationSubtitle}>{subtitle}</Text>
          </View>

          <View style={styles.inspirationIcon}>
            <Ionicons
              name={
                style === "fall"
                  ? "leaf-outline"
                  : style === "scenery"
                    ? "earth-outline"
                    : style === "cities"
                      ? "business-outline"
                      : style === "niche"
                        ? "sparkles-outline"
                        : "compass-outline"
              }
              size={21}
              color={COLORS.chocolate}
            />
          </View>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.inspirationRow}
          nestedScrollEnabled
        >
          {data.map((item, index) => (
            <Pressable
              key={`${title}-${item.id}-${index}`}
              style={[
                styles.inspirationCard,
                style === "scenery" && styles.sceneryCard,
                style === "gems" && styles.gemCard,
                style === "cities" && styles.cityCard,
                style === "niche" && styles.nicheCard,
              ]}
              onPress={(event) => {
                event.stopPropagation();
                openPlace(item.id);
              }}
              accessibilityRole="button"
              accessibilityLabel={`View details for ${item.title}`}
            >
              <Image
                source={{ uri: item.image }}
                style={styles.inspirationImage}
                resizeMode="cover"
              />

              <View style={styles.inspirationShade} />

              <View style={styles.inspirationBadge}>
                <Text style={styles.inspirationBadgeText}>{item.badge}</Text>
              </View>

              <View style={styles.inspirationCardBottom}>
                <Text style={styles.inspirationCardTitle}>{item.title}</Text>

                <Text
                  style={styles.inspirationCardSubtitle}
                  numberOfLines={2}
                >
                  {item.subtitle}
                </Text>
              </View>
            </Pressable>
          ))}
        </ScrollView>
      </Pressable>
    );
  };

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
          { paddingBottom: 100 + insets.bottom },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View style={[styles.hero, { height: heroHeight }]}>
          <ScrollView
            ref={carouselRef}
            horizontal
            pagingEnabled
            scrollEnabled
            showsHorizontalScrollIndicator={false}
            onScroll={syncCarouselIndex}
            onMomentumScrollEnd={syncCarouselIndex}
            scrollEventThrottle={16}
            bounces={false}
            style={styles.carousel}
          >
            {destinations.map((destination) => (
              <ImageBackground
                key={destination.id}
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
            <Text style={styles.brand}>ROMR*</Text>
            <Text style={styles.date}>October 27</Text>
          </View>

          <Animated.View
            pointerEvents={expanded ? "box-none" : "none"}
            style={[styles.expandedContent, { opacity: expandedOpacity }]}
          >
            <View style={styles.destinationDetails}>
              <Text style={styles.destinationSubtitle}>
                {activeDestination.subtitle}
              </Text>

              <Text style={styles.destinationName}>
                {activeDestination.name}
              </Text>

              <Text style={styles.destinationDescription}>
                {activeDestination.description}
              </Text>

              <View style={styles.weatherRow}>
                <Ionicons
                  name="sunny-outline"
                  size={23}
                  color={COLORS.white}
                />
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
            </View>

            <View style={styles.heroActions}>
              <Pressable
                style={styles.roundAction}
                onPress={() => toggleSaved(activeDestination.id)}
                accessibilityRole="button"
                accessibilityLabel="Save destination"
              >
                <Ionicons
                  name={
                    savedItems.includes(activeDestination.id)
                      ? "heart"
                      : "heart-outline"
                  }
                  size={24}
                  color={COLORS.white}
                />
              </Pressable>

              <Pressable
                style={styles.roundAction}
                onPress={openTrip}
                accessibilityRole="button"
                accessibilityLabel="Open trip planner"
              >
                <Ionicons
                  name="arrow-up"
                  size={25}
                  color={COLORS.white}
                  style={styles.diagonalArrow}
                />
              </Pressable>
            </View>

            <Pressable style={styles.planButton} onPress={openTrip}>
              <Text style={styles.planButtonText}>Plan this trip ✦</Text>
            </Pressable>

            <View style={styles.pagination}>
              {destinations.map((destination, index) => (
                <Pressable
                  key={destination.id}
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
            style={[styles.notification, { top: insets.top + 38 }]}
          >
            <View style={styles.notificationAvatar}>
              <Image
                source={{
                  uri: "https://images.unsplash.com/photo-1479090793912-eb9929f4fdb2?q=80&w=968&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D",
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
          {renderInspirationSection(
            "Top 10 places to visit in fall",
            "A mix of autumn colours, cosy cities and seasonal escapes.",
            fallPlaces,
            "fall",
          )}

          {renderInspirationSection(
            "Niche cities around the world",
            "For the curious traveller who likes places with their own rhythm.",
            nicheCities,
            "niche",
          )}

          {renderInspirationSection(
            "Popular city escapes for 2026",
            "A little city inspiration for your next trip.",
            cityEscapes2026,
            "cities",
          )}

          {renderSection("Things to do near you", thingsToDo)}

          {renderSection("What others are doing", communityTrips)}

          {renderSection("Our best offers", bestOffers)}
        </View>
      </ScrollView>

      <PlaceDetailsModal
        visible={placeDetailsVisible}
        place={selectedPlace}
        isFavorite={
          selectedPlace ? savedItems.includes(selectedPlace.id) : false
        }
        onClose={closePlace}
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
    left: 20,
    right: 20,
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
    left: 18,
    right: 18,
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
    borderRadius: 18,
    overflow: "hidden",
    backgroundColor: "#E7E7F1",
    marginRight: 8,
  },

  notificationAvatarImage: {
    width: "100%",
    height: "100%",
    borderRadius: 18,
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
    left: 20,
    right: 95,
    zIndex: 3,
  },

  destinationSubtitle: {
    fontFamily: FONTS.regular,
    fontSize: 15,
    color: "rgba(255,255,255,0.9)",
    marginBottom: 0.5,
  },

  destinationName: {
    fontFamily: FONTS.semiboldItalics,
    fontSize: 35,
    lineHeight: 44,
    color: COLORS.white,
    letterSpacing: -1.2,
    marginBottom: 1,
  },

  weatherRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 2,
    gap: 7,
  },

  weatherText: {
    fontFamily: FONTS.italics,
    color: "rgba(255,255,255,0.9)",
    fontSize: 16,
  },

  destinationDescription: {
    fontFamily: FONTS.regular,
    color: "rgba(255,255,255,0.85)",
    fontSize: 12,
    lineHeight: 18,
    marginTop: 1,
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
    paddingTop: 15,
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
    color: COLORS.navy,
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
    color: COLORS.navy,
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
    color: COLORS.navy,
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

  inspirationSection: {
    marginHorizontal: 14,
    marginBottom: 22,
    borderRadius: 23,
    paddingTop: 17,
    paddingBottom: 15,
    overflow: "hidden",
  },

  fallSection: {
    backgroundColor: "#F6E6D5",
    borderWidth: 1,
    borderColor: "#E9D0B8",
  },

  scenerySection: {
    backgroundColor: "#DDE9EC",
    borderWidth: 1,
    borderColor: "#CADDE1",
  },

  gemsSection: {
    backgroundColor: "#E8E3F1",
    borderWidth: 1,
    borderColor: "#D9D0E8",
  },

  citiesSection: {
    backgroundColor: "#DDEAF4",
    borderWidth: 1,
    borderColor: "#C7D9E8",
  },

  nicheSection: {
    backgroundColor: "#E0EBDD",
    borderWidth: 1,
    borderColor: "#C9D9C4",
  },

  inspirationHeading: {
    paddingHorizontal: 16,
    marginBottom: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  inspirationHeadingCopy: {
    flex: 1,
    paddingRight: 10,
  },

  inspirationEyebrow: {
    fontFamily: FONTS.semibold,
    fontSize: 8,
    letterSpacing: 1.5,
    color: "#6A6559",
    marginBottom: 5,
  },

  inspirationTitle: {
    fontFamily: FONTS.semiboldItalics,
    color: COLORS.chocolate,
    fontSize: 19,
    lineHeight: 25,
    letterSpacing: -0.5,
  },

  inspirationSubtitle: {
    fontFamily: FONTS.regular,
    color: "#615D58",
    fontSize: 10,
    lineHeight: 15,
    marginTop: 4,
  },

  inspirationIcon: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "rgba(255,255,255,0.62)",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.9)",
  },

  inspirationRow: {
    paddingHorizontal: 16,
    gap: 11,
  },

  inspirationCard: {
    width: 205,
    height: 235,
    borderRadius: 18,
    overflow: "hidden",
    backgroundColor: COLORS.blue,
    position: "relative",
  },

  sceneryCard: {
    height: 220,
    width: 225,
    borderRadius: 20,
  },

  gemCard: {
    height: 205,
    width: 195,
    borderRadius: 25,
  },

  cityCard: {
    height: 225,
    width: 215,
    borderRadius: 16,
  },

  nicheCard: {
    height: 215,
    width: 195,
    borderRadius: 22,
  },

  inspirationImage: {
    ...StyleSheet.absoluteFill,
    width: "100%",
    height: "100%",
  },

  inspirationShade: {
    ...StyleSheet.absoluteFill,
    backgroundColor: "rgba(19,25,36,0.28)",
  },

  inspirationBadge: {
    position: "absolute",
    top: 12,
    left: 12,
    borderRadius: 14,
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: "rgba(255,255,255,0.9)",
  },

  inspirationBadgeText: {
    fontFamily: FONTS.semibold,
    color: COLORS.chocolate,
    fontSize: 8,
    letterSpacing: 0.6,
  },

  inspirationCardBottom: {
    position: "absolute",
    left: 14,
    right: 13,
    bottom: 14,
  },

  inspirationCardTitle: {
    fontFamily: FONTS.semiboldItalics,
    color: "#FFFFFF",
    fontSize: 20,
    lineHeight: 26,
  },

  inspirationCardSubtitle: {
    fontFamily: FONTS.regular,
    color: "rgba(255,255,255,0.92)",
    fontSize: 10,
    lineHeight: 15,
    marginTop: 4,
  },

  categoryFooter: {
    paddingHorizontal: 16,
    paddingTop: 13,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    gap: 7,
  },

  categoryFooterText: {
    fontFamily: FONTS.semibold,
    color: COLORS.chocolate,
    fontSize: 10,
  },

  offerSection: {
    marginHorizontal: 14,
    marginBottom: 22,
    borderRadius: 23,
    paddingTop: 17,
    paddingBottom: 15,
    overflow: "hidden",
    backgroundColor: "#F6DCE5",
    borderWidth: 1,
    borderColor: "#EABBCB",
  },

  offerRow: {
    paddingHorizontal: 16,
    gap: 12,
  },

  offerCardWrapper: {
    width: "100%",
  },

  offerCard: {
    height: 166,
    width: "100%",
    borderRadius: 19,
    overflow: "hidden",
    backgroundColor: "#D58BA4",
    position: "relative",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.88)",
  },

  offerImage: {
    ...StyleSheet.absoluteFill,
    width: "100%",
    height: "100%",
  },

  offerImageShade: {
    ...StyleSheet.absoluteFill,
    backgroundColor: "rgba(40,15,29,0.43)",
  },

  offerImageBadge: {
    position: "absolute",
    top: 11,
    left: 11,
    borderRadius: 14,
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: "rgba(255,255,255,0.92)",
  },

  offerImageBadgeText: {
    fontFamily: FONTS.semibold,
    color: "#A34D6D",
    fontSize: 8,
    letterSpacing: 0.6,
  },

  offerCopy: {
    position: "absolute",
    left: 14,
    right: 58,
    bottom: 13,
    justifyContent: "flex-end",
  },

  offerEyebrow: {
    fontFamily: FONTS.semibold,
    color: "#FFE0EA",
    fontSize: 8,
    letterSpacing: 1.1,
    marginBottom: 4,
  },

  offerTitle: {
    fontFamily: FONTS.semiboldItalics,
    color: "#FFFFFF",
    fontSize: 20,
    lineHeight: 25,
    marginBottom: 5,
  },

  offerPriceRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    gap: 6,
  },

  offerPrice: {
    fontFamily: FONTS.semibold,
    color: "#FFFFFF",
    fontSize: 12,
  },

  offerWasPrice: {
    fontFamily: FONTS.regular,
    color: "rgba(255,255,255,0.88)",
    fontSize: 9,
  },

  offerRating: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 5,
  },

  offerRatingText: {
    fontFamily: FONTS.regular,
    color: "rgba(255,255,255,0.94)",
    fontSize: 9,
  },

  offerArrow: {
    position: "absolute",
    right: 12,
    bottom: 13,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#C85D83",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.45)",
  },

  offerFooter: {
    paddingHorizontal: 18,
    paddingTop: 13,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    gap: 7,
  },
});