import * as Location from "expo-location";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Keyboard,
    Pressable,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    View,
    Vibration,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS, FONTS } from "../constants/theme";
import {
    Destination,
    TravelScope,
    TravellerType,
    useOnboarding,
} from "../context/onboardingContext";

type Suggestion = {
  id: string;
  name: string;
  description: string;
};

const GOOGLE_API_KEY = process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY;

const travelOptions: {
  title: TravelScope;
  subtitle: string;
  icon: keyof typeof Ionicons.glyphMap;
}[] = [
  {
    title: "Local",
    subtitle: "Explore places around me",
    icon: "location-sharp",
  },
  {
    title: "Domestic",
    subtitle: "Travel within my country",
    icon: "home-outline",
  },
  {
    title: "International",
    subtitle: "Explore the world",
    icon: "globe-outline",
  },
];

const travellerOptions: {
  title: TravellerType;
  subtitle: string;
  icon: keyof typeof Ionicons.glyphMap;
}[] = [
  {
    title: "Frequent Traveller",
    subtitle: "Always planning my next adventure",
    icon: "airplane-outline",
  },
  {
    title: "Local Discovery Demon",
    subtitle: "Finding hidden gems everywhere",
    icon: "map-outline",
  },
  {
    title: "Sight Seer",
    subtitle: "Landmarks, architecture and beautiful views",
    icon: "business-outline",
  },
  {
    title: "Experience Seeker",
    subtitle: "Hiking, skydiving and adrenaline-filled adventures",
    icon: "fitness-outline",
  },
  {
    title: "Food Lover",
    subtitle: "Restaurants, street food and local cuisine",
    icon: "restaurant-outline",
  },
  {
    title: "Entertainment Driven",
    subtitle: "Concerts, esports and music festivals",
    icon: "musical-notes-outline",
  },
];

const titles = [
  "Where do you want to go?",
  "How do you like to travel?",
  "Let's get your location.",
  "What kind of traveller are you?",
];

export default function OnboardingScreen() {
  const router = useRouter();

  const {
    data,
    setDestinations,
    setTravelScope,
    setLocation,
    setTravellerTypes,
  } = useOnboarding();

  const [step, setStep] = useState(0);

  const [search, setSearch] = useState("");
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [searching, setSearching] = useState(false);
  const [searchError, setSearchError] = useState("");

  const [locationLoading, setLocationLoading] = useState(false);
  const [inlineError, setInlineError] = useState("");

  const showInlineError = (message: string) => {
    setInlineError(message);
    Vibration.vibrate(100);
  };

  useEffect(() => {
    if (step !== 0 || search.trim().length < 2) {
      setSuggestions([]);
      setSearchError("");
      return;
    }

    if (!GOOGLE_API_KEY) {
      setSearchError("Google Places API key is missing.");
      return;
    }

    let cancelled = false;

    const timer = setTimeout(async () => {
      setSearching(true);
      setSearchError("");

      try {
        const response = await fetch(
          "https://places.googleapis.com/v1/places:autocomplete",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "X-Goog-Api-Key": GOOGLE_API_KEY,
              "X-Goog-FieldMask":
                "suggestions.placePrediction.placeId,suggestions.placePrediction.text,suggestions.placePrediction.structuredFormat",
            },
            body: JSON.stringify({
              input: search.trim(),
              includedPrimaryTypes: [
                "country",
                "locality",
                "administrative_area_level_1",
              ],
            }),
          },
        );

        if (!response.ok) {
          throw new Error("Places search failed.");
        }

        const result = await response.json();

        if (cancelled) return;

        const formatted: Suggestion[] = (result.suggestions ?? [])
          .filter((item: any) => item.placePrediction)
          .map((item: any) => {
            const place = item.placePrediction;

            return {
              id: place.placeId,
              name:
                place.structuredFormat?.mainText?.text ??
                place.text?.text ??
                "Unknown destination",
              description: place.structuredFormat?.secondaryText?.text ?? "",
            };
          });

        setSuggestions(formatted);
      } catch {
        if (!cancelled) {
          setSearchError("Couldn't search destinations. Check your API setup.");
        }
      } finally {
        if (!cancelled) setSearching(false);
      }
    }, 300);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [search, step]);

  const toggleScope = (value: TravelScope) => {
    const updated = data.travelScope.includes(value)
      ? data.travelScope.filter((item) => item !== value)
      : [...data.travelScope, value];

    setTravelScope(updated);
    setInlineError("");
  };

  const toggleTraveller = (value: TravellerType) => {
    const updated = data.travellerTypes.includes(value)
      ? data.travellerTypes.filter((item) => item !== value)
      : [...data.travellerTypes, value];

    setTravellerTypes(updated);
    setInlineError("");
  };

  const addDestination = (item: Suggestion) => {
    if (data.destinations.some((d) => d.id === item.id)) {
      setSearch("");
      setSuggestions([]);
      Keyboard.dismiss();
      return;
    }

    if (data.destinations.length >= 5) {
      showInlineError("You can select up to five destinations.");
      return;
    }

    const newDestination: Destination = {
      id: item.id,
      name: item.name,
      description: item.description,
    };

    setDestinations([...data.destinations, newDestination]);
    setInlineError("");
    setSearch("");
    setSuggestions([]);
    Keyboard.dismiss();
  };

  const removeDestination = (id: string) => {
    setDestinations(data.destinations.filter((item) => item.id !== id));
    setInlineError("");
  };

  // DEVICE LOCATION
  const requestLocation = async () => {
    setLocationLoading(true);

    try {
      const permission = await Location.requestForegroundPermissionsAsync();

      if (permission.status !== "granted") {
        setLocation("denied");
        return;
      }

      const position = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      setLocation(
        "granted",
        position.coords.latitude,
        position.coords.longitude,
      );
      setInlineError("");

      Keyboard.dismiss();
      setStep(3);
    } catch {
      showInlineError("Location unavailable. You can skip this step.");
    } finally {
      setLocationLoading(false);
    }
  };

  const validateStep = () => {
    if (step === 0 && data.destinations.length === 0) {
      showInlineError("Please choose at least one destination.");
      return false;
    }

    if (step === 1 && data.travelScope.length === 0) {
      showInlineError("Please select at least one travel preference.");
      return false;
    }

    if (step === 2 && data.locationPermission === null) {
      showInlineError("Allow location or choose Skip for now.");
      return false;
    }

    if (step === 3 && data.travellerTypes.length === 0) {
      showInlineError("Please choose at least one traveller type.");
      return false;
    }

    setInlineError("");
    return true;
  };

  const next = () => {
    Keyboard.dismiss();

    if (!validateStep()) return;

    setInlineError("");
    setStep((previous) => Math.min(previous + 1, 4));
  };

  const back = () => {
    Keyboard.dismiss();

    if (step === 0) {
      router.back();
    } else {
      setStep((previous) => previous - 1);
    }
    setInlineError("");
  };

  const goToEdit = (target: number) => {
    setInlineError("");
    setStep(target);
  };

const confirmProfile = () => {
  router.replace("../(tabs)");
};

  const selected = (value: string, values: string[]) => values.includes(value);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.header}>
        <Pressable onPress={back} style={styles.backButton}>
          <Text style={styles.backArrow}>‹</Text>
        </Pressable>

        <View style={styles.headerCenter}>
          <Text style={styles.brand}>ROMR</Text>
          <Text style={styles.headerSubtitle}>Help us get to know you!</Text>
        </View>

        <View style={styles.stepNumber}>
          <Text style={styles.stepNumberText}>
            {step === 4 ? <Ionicons name="checkmark-circle" size={17} color={COLORS.primary} /> : `${step + 1}/4`}
          </Text>
        </View>
      </View>

      <View style={styles.progressBackground}>
        <View
          style={[styles.progressFill, { width: `${((step + 1) / 5) * 100}%` }]}
        />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {step < 4 ? (
          <>
            <Text style={styles.questionNumber}>Question {step + 1}</Text>

            <Text style={styles.heading}>{titles[step]}</Text>

            <Text style={styles.description}>
              {step === 0 &&
                "Tell us which places are on your bucket list. You can select up to five."}

              {step === 1 &&
                "What kind of trips are you interested in? Choose as many as you like."}

              {step === 2 &&
                "Allow us to use your location to discover nearby attractions, restaurants and experiences."}

              {step === 3 &&
                "Everyone travels differently. Pick all the personalities that describe you."}
            </Text>

            {step === 0 && (
              <>
                <View style={styles.searchBox}>
                  <Ionicons name="search-outline" size={21} color={COLORS.primary} />

                  <TextInput
                    style={styles.searchInput}
                    placeholder="Search countries or cities..."
                    placeholderTextColor={COLORS.muted}
                    value={search}
                    onChangeText={setSearch}
                    autoCorrect={false}
                  />

                  {searching && <ActivityIndicator color={COLORS.primary} />}

                  {search.length > 0 && (
                    <Pressable onPress={() => setSearch("")}>
                      <Ionicons name="close-circle" size={19} color={COLORS.muted} />
                    </Pressable>
                  )}
                </View>

                {searchError !== "" && (
                  <Text style={styles.errorText}>{searchError}</Text>
                )}

                {suggestions.length > 0 && (
                  <View style={styles.suggestions}>
                    {suggestions.map((item) => (
                      <Pressable
                        key={item.id}
                        style={styles.suggestion}
                        onPress={() => addDestination(item)}
                      >
<View style={styles.suggestionIcon}>
  <Ionicons name="location-outline" size={20} color={COLORS.primary} />
</View>

                        <View style={{ flex: 1 }}>
                          <Text style={styles.suggestionName}>{item.name}</Text>
                          <Text style={styles.suggestionDescription}>
                            {item.description}
                          </Text>
                        </View>

                        <Text style={styles.addIcon}>+</Text>
                      </Pressable>
                    ))}
                  </View>
                )}

                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionTitle}>Your destinations</Text>

                  <Text style={styles.counter}>
                    {data.destinations.length}/5
                  </Text>
                </View>

                {data.destinations.length === 0 ? (
                  <View style={styles.emptyBox}>
                    <Ionicons name="earth-outline" size={27} color={COLORS.primary} />
                    <Text style={styles.emptyText}>
                      Selections will appear here.
                    </Text>
                  </View>
                ) : (
                  data.destinations.map((item, index) => (
                    <View key={item.id} style={styles.destinationCard}>
                      <View style={styles.destinationNumber}>
                        <Text style={styles.destinationNumberText}>
                          {index + 1}
                        </Text>
                      </View>

                      <View style={{ flex: 1 }}>
                        <Text style={styles.destinationName}>{item.name}</Text>
                        <Text style={styles.destinationDescription}>
                          {item.description}
                        </Text>
                      </View>

                      <Pressable
                        onPress={() => removeDestination(item.id)}
                        style={styles.removeButton}
                      >
                        <Ionicons name="close" size={18} color={COLORS.danger} />
                      </Pressable>
                    </View>
                  ))
                )}
              </>
            )}

            {step === 1 && (
              <View style={styles.optionList}>
                {travelOptions.map((item) => {
                  const active = selected(item.title, data.travelScope);

                  return (
                    <Pressable
                      key={item.title}
                      onPress={() => toggleScope(item.title)}
                      style={[styles.optionCard, active && styles.selectedCard]}
                    >
                      <View style={styles.optionIcon}>
                        <Ionicons name={item.icon} size={26} color={COLORS.primary} />
                      </View>

                      <View style={{ flex: 1 }}>
                        <Text style={styles.optionTitle}>{item.title}</Text>
                        <Text style={styles.optionSubtitle}>
                          {item.subtitle}
                        </Text>
                      </View>

                      <View style={[styles.checkbox, active && styles.checked]}>
                        {active && <Ionicons name="checkmark" size={14} color={COLORS.background} />}
                      </View>
                    </Pressable>
                  );
                })}
              </View>
            )}

            {step === 2 && (
              <View style={styles.locationContainer}>
                <View style={styles.locationIllustration}>
                  <Ionicons name="location-sharp" size={100} color={COLORS.primary} />
                  <View style={styles.locationOrbit} />
                </View>
              </View>
            )}

            {step === 3 && (
              <View style={styles.travellerGrid}>
                {travellerOptions.map((item) => {
                  const active = selected(item.title, data.travellerTypes);

                  return (
                    <Pressable
                      key={item.title}
                      onPress={() => toggleTraveller(item.title)}
                      style={[
                        styles.travellerCard,
                        active && styles.selectedCard,
                      ]}
                    >
                      <View style={styles.travellerTop}>
                        <Ionicons name={item.icon} size={27} color={COLORS.primary} />

                        <View
                          style={[styles.checkbox, active && styles.checked]}
                        >
                          {active && <Ionicons name="checkmark" size={14} color={COLORS.background} />}
                        </View>
                      </View>

                      <Text style={styles.travellerTitle}>{item.title}</Text>

                      <Text style={styles.travellerSubtitle}>
                        {item.subtitle}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            )}
          </>
        ) : (
          <>
            <Text style={styles.questionNumber}>Almost there...</Text>

            <Text style={styles.heading}>Your travel profile.</Text>

            <Text style={styles.description}>
              Here's what we've learned about you. Does everything look right?
            </Text>

            <View style={styles.reviewCard}>
              <View style={styles.reviewHeader}>
                <Ionicons name="globe-outline" size={24} color={COLORS.primary} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.reviewTitle}>Your destinations</Text>
                  <Text style={styles.reviewSubtitle}>
                    Where you dream of going
                  </Text>
                </View>
                <Pressable onPress={() => goToEdit(0)}>
                  <Text style={styles.editText}>EDIT</Text>
                </Pressable>
              </View>

              <View style={styles.chipContainer}>
                {data.destinations.map((item) => (
                  <View key={item.id} style={styles.chip}>
                    <Text style={styles.chipText}>{item.name}</Text>
                  </View>
                ))}
              </View>
            </View>

            <View style={styles.reviewCard}>
              <View style={styles.reviewHeader}>
                <Ionicons name="airplane-outline" size={24} color={COLORS.primary} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.reviewTitle}>Travel preferences</Text>
                  <Text style={styles.reviewSubtitle}>
                    How you like to travel
                  </Text>
                </View>
                <Pressable onPress={() => goToEdit(1)}>
                  <Text style={styles.editText}>EDIT</Text>
                </Pressable>
              </View>

              <View style={styles.chipContainer}>
                {data.travelScope.map((item) => (
                  <View key={item} style={styles.chip}>
                    <Text style={styles.chipText}>{item}</Text>
                  </View>
                ))}
              </View>
            </View>

            <View style={styles.reviewCard}>
              <View style={styles.reviewHeader}>
                <Ionicons name="location-outline" size={24} color={COLORS.primary} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.reviewTitle}>Device location</Text>
                  <Text style={styles.reviewSubtitle}>
                    Location preferences
                  </Text>
                </View>
                <Pressable onPress={() => goToEdit(2)}>
                  <Text style={styles.editText}>EDIT</Text>
                </Pressable>
              </View>

              <Text style={styles.reviewValue}>
                {data.locationPermission === "granted"
                  ? "✓ Location enabled"
                  : data.locationPermission === "denied"
                    ? "Location permission denied"
                    : "Skipped for now"}
              </Text>
            </View>

            <View style={styles.reviewCard}>
              <View style={styles.reviewHeader}>
                <Ionicons name="sparkles-outline" size={24} color={COLORS.primary} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.reviewTitle}>
                    Your traveller personality
                  </Text>
                  <Text style={styles.reviewSubtitle}>
                    What makes your trips special
                  </Text>
                </View>
                <Pressable onPress={() => goToEdit(3)}>
                  <Text style={styles.editText}>EDIT</Text>
                </Pressable>
              </View>

              <View style={styles.chipContainer}>
                {data.travellerTypes.map((item) => (
                  <View key={item} style={styles.chip}>
                    <Text style={styles.chipText}>{item}</Text>
                  </View>
                ))}
              </View>
            </View>

            <View style={styles.accuracyBox}>
              <Text style={styles.accuracyTitle}>Is this accurate?</Text>
              <Text style={styles.accuracyDescription}>
                We'll use these preferences to personalize your travel
                recommendations and experiences.
              </Text>
            </View>
          </>
        )}
      </ScrollView>

      <View style={styles.bottom}>
        {inlineError !== "" && (
          <Text style={styles.bottomError}>{inlineError}</Text>
        )}

        {step === 2 ? (
          <>
            <Pressable
              onPress={requestLocation}
              disabled={locationLoading}
              style={styles.locationButtonWrapper}
            >
              <View style={styles.locationButton}>
                {locationLoading ? (
                  <ActivityIndicator color={COLORS.background} />
                ) : (
                  <Text style={styles.locationButtonText}>
                    {data.locationPermission === "granted"
                      ? "LOCATION ENABLED ✓"
                      : "ALLOW LOCATION"}
                  </Text>
                )}
              </View>
            </Pressable>

            {data.locationPermission === "granted" && (
              <Text style={styles.permissionSuccess}>
                ✓ Your device location is enabled.
              </Text>
            )}

            {data.locationPermission === "denied" && (
              <Text style={styles.helperText}>
                Permission denied. You can continue without location.
              </Text>
            )}

            <Pressable
              onPress={() => {
                setLocation("skipped");
                setInlineError("");
                Keyboard.dismiss();
                setStep(3);
              }}
              style={[
                styles.skipButton,
                data.locationPermission === "skipped" && styles.skipSelected,
              ]}
            >
              <Text style={styles.skipText}>
                {data.locationPermission === "skipped"
                  ? "✓ SKIPPED FOR NOW"
                  : "SKIP FOR NOW"}
              </Text>
            </Pressable>
          </>
        ) : step === 4 ? (
          <Pressable onPress={confirmProfile} style={styles.nextWrapper}>
            <View style={styles.nextButton}>
              <Text style={styles.nextText}>Yes, looks good!</Text>
            </View>
          </Pressable>
        ) : (
          <Pressable onPress={next} style={styles.nextWrapper}>
            <View
              style={[
                styles.nextButton,
                inlineError !== "" && styles.nextButtonDisabled,
              ]}
            >
              <Text style={styles.nextText}>Continue</Text>
            </View>
          </Pressable>
        )}

        {step === 4 && (
          <Pressable onPress={() => setStep(0)}>
            <Text style={styles.reviewBackText}>Start Over</Text>
          </Pressable>
        )}

        {step < 4 && (
          <Text style={styles.bottomHint}>STEP {step + 1} OF 4</Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingTop: 38,
  },
  header: {
    height: 55,
    paddingHorizontal: 28,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  backButton: {
    width: 38,
    height: 38,
    alignItems: "center",
    justifyContent: "center",
  },
  backArrow: {
    fontSize: 36,
    color: COLORS.primary,
    marginTop: -5,
  },
  headerCenter: {
    alignItems: "center",
  },
  brand: {
    color: COLORS.primary,
    fontFamily: FONTS.blackItalic,
    letterSpacing: -0.5,
    fontSize: 20,
  },
  headerSubtitle: {
    color: COLORS.text,
    fontFamily: FONTS.regular,
    fontSize: 8,
    letterSpacing: 0,
    marginTop: 1,
  },
  stepNumber: {
    width: 42,
    alignItems: "center",
  },
  stepNumberText: {
    color: COLORS.text,
    fontFamily: FONTS.semiBold,
    fontSize: 11,
  },
  progressBackground: {
    height: 2,
    backgroundColor: "#D5D6E2",
    marginHorizontal: 28,
    marginTop: 1,
    borderRadius: 5,
  },
  progressFill: {
    height: 2,
    backgroundColor: COLORS.primary,
    borderRadius: 5,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 28,
    paddingTop: 58,
    paddingBottom: 20,
  },
  questionNumber: {
    fontFamily: FONTS.semiBold,
    fontSize: 14,
    color: "#636EEC",
    letterSpacing: 0,
    marginBottom: 15,
  },
  heading: {
    fontFamily: FONTS.bold,
    color: COLORS.text,
    fontSize: 25,
    lineHeight: 30,
  },
  description: {
    fontFamily: FONTS.regular,
    color: "#989BB8",
    fontSize: 11,
    lineHeight: 19,
    marginTop: 4,
    marginBottom: 15,
  },
  searchBox: {
    height: 55,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 13,
    paddingHorizontal: 15,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  searchInput: {
    flex: 1,
    color: COLORS.text,
    fontFamily: FONTS.regular,
    fontSize: 12,
  },
  errorText: {
    color: COLORS.danger,
    fontFamily: FONTS.regular,
    fontSize: 11,
    marginTop: 8,
  },
  suggestions: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginTop: 8,
    overflow: "hidden",
  },
  suggestion: {
    minHeight: 64,
    paddingHorizontal: 12,
    paddingVertical: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  suggestionIcon: {
    width: 35,
    height: 35,
    borderRadius: 10,
    backgroundColor: COLORS.surfaceLight,
    justifyContent: "center",
    alignItems: "center",
  },
  suggestionName: {
    color: COLORS.text,
    fontFamily: FONTS.semiBold,
    fontSize: 12,
  },
  suggestionDescription: {
    color: COLORS.muted,
    fontFamily: FONTS.regular,
    fontSize: 10,
    marginTop: 3,
  },
  addIcon: {
    color: COLORS.primary,
    fontSize: 24,
    paddingHorizontal: 5,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 15,
    marginBottom: 13,
  },
  sectionTitle: {
    fontFamily: FONTS.bold,
    color: COLORS.muted,
    fontSize: 10,
  },
  counter: {
    color: COLORS.primary,
    fontFamily: FONTS.bold,
    fontSize: 11,
  },
  emptyBox: {
    height: 115,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: COLORS.border,
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",
    gap: 7,
  },
  emptyText: {
    color: COLORS.muted,
    fontFamily: FONTS.regular,
    fontSize: 10,
  },
  destinationCard: {
    minHeight: 68,
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 12,
    marginBottom: 9,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  destinationNumber: {
    width: 31,
    height: 31,
    borderRadius: 9,
    backgroundColor: COLORS.surfaceLight,
    justifyContent: "center",
    alignItems: "center",
  },
  destinationNumberText: {
    color: COLORS.primary,
    fontFamily: FONTS.bold,
  },
  destinationName: {
    color: COLORS.text,
    fontFamily: FONTS.semiBold,
    fontSize: 12,
  },
  destinationDescription: {
    color: COLORS.muted,
    fontFamily: FONTS.regular,
    fontSize: 10,
    marginTop: 3,
  },
  removeButton: {
    padding: 8,
  },
  helperText: {
    color: COLORS.muted,
    fontFamily: FONTS.italic,
    fontSize: 10,
    marginTop: 14,
  },
  optionList: {
    gap: 13,
  },
  optionIcon: {
    width: 49,
    height: 49,
    backgroundColor: COLORS.surfaceLight,
    borderRadius: 13,
    justifyContent: "center",
    alignItems: "center",
  },
  optionCard: {
    minHeight: 91,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 15,
    padding: 15,
    flexDirection: "row",
    alignItems: "center",
    gap: 13,
  },
  selectedCard: {
    borderColor: COLORS.primary,
    backgroundColor: "#E7E7F1",
  },
  optionTitle: {
    color: COLORS.text,
    fontFamily: FONTS.bold,
    fontSize: 13,
  },
  optionSubtitle: {
    color: COLORS.muted,
    fontFamily: FONTS.regular,
    fontSize: 10,
    marginTop: 5,
  },
  checkbox: {
    width: 21,
    height: 21,
    borderWidth: 1.5,
    borderColor: COLORS.muted,
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
  },
  checked: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  locationContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 250,
  },
  locationIllustration: {
    height: 230,
    width: 230,
    borderRadius: 115,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: "center",
    justifyContent: "center",
  },
  locationOrbit: {
    position: "absolute",
    width: 194,
    height: 194,
    borderRadius: 97,
    borderWidth: 1,
    borderColor: COLORS.primary + "60",
  },
  locationTitle: {
    fontFamily: FONTS.bold,
    fontSize: 19,
    color: COLORS.text,
    textAlign: "center",
  },
  locationDescription: {
    fontFamily: FONTS.regular,
    color: COLORS.muted,
    fontSize: 11,
    lineHeight: 21,
    textAlign: "center",
    marginTop: 12,
    marginBottom: 27,
    maxWidth: 290,
  },
  locationButtonWrapper: {
    width: "100%",
    borderRadius: 13,
    overflow: "hidden",
  },
  locationButton: {
    height: 54,
    backgroundColor: COLORS.primary,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 13,
  },
  locationButtonText: {
    fontFamily: FONTS.bold,
    color: COLORS.background,
    fontSize: 11,
    letterSpacing: 1,
  },
  permissionSuccess: {
    color: COLORS.primary,
    fontFamily: FONTS.semiBold,
    fontSize: 11,
    marginTop: 15,
  },
  skipButton: {
    width: "100%",
    height: 50,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 13,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 1,
  },
  skipSelected: {
    borderColor: COLORS.primary,
  },
  skipText: {
    color: COLORS.muted,
    fontFamily: FONTS.bold,
    fontSize: 10,
    letterSpacing: 1,
  },
  privacyText: {
    color: COLORS.muted,
    fontFamily: FONTS.italic,
    fontSize: 9,
    textAlign: "center",
    lineHeight: 17,
    marginTop: 22,
  },
  travellerGrid: {
    gap: 12,
  },
  travellerCard: {
    minHeight: 105,
    backgroundColor: COLORS.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 14,
  },
  travellerTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 9,
  },
  travellerTitle: {
    color: COLORS.text,
    fontFamily: FONTS.bold,
    fontSize: 12,
  },
  travellerSubtitle: {
    color: COLORS.muted,
    fontFamily: FONTS.regular,
    fontSize: 10,
    marginTop: 1,
    lineHeight: 16,
  },
  reviewCard: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 14,
    padding: 16,
    marginBottom: 13,
  },
  reviewHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  reviewTitle: {
    color: COLORS.text,
    fontFamily: FONTS.bold,
    fontSize: 12,
  },
  reviewSubtitle: {
    color: COLORS.muted,
    fontFamily: FONTS.regular,
    fontSize: 9,
    marginTop: 4,
  },
  editText: {
    color: COLORS.primary,
    fontFamily: FONTS.bold,
    fontSize: 10,
    letterSpacing: 1,
  },
  chipContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 15,
  },
  chip: {
    paddingHorizontal: 11,
    paddingVertical: 8,
    borderRadius: 9,
    backgroundColor: COLORS.surfaceLight,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  chipText: {
    color: COLORS.primary,
    fontFamily: FONTS.semiBold,
    fontSize: 10,
  },
  reviewValue: {
    color: COLORS.primary,
    fontFamily: FONTS.semiBold,
    fontSize: 11,
    marginTop: 15,
  },
  accuracyBox: {
    padding: 20,
    backgroundColor: "#E7E7F1",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginTop: 7,
    marginBottom: 15,
  },
  accuracyTitle: {
    color: COLORS.primary,
    fontFamily: FONTS.bold,
    fontSize: 17,
  },
  accuracyDescription: {
    color: COLORS.muted,
    fontFamily: FONTS.regular,
    fontSize: 11,
    lineHeight: 19,
    marginTop: 8,
  },
  bottom: {
    paddingHorizontal: 28,
    paddingTop: 12,
    paddingBottom: 20,
    backgroundColor: "transparent",
    alignItems: "center",
    gap: 11,
  },
  nextWrapper: {
    width: "100%",
    borderRadius: 19,
    overflow: "hidden",
  },
  nextButton: {
    height: 58,
    backgroundColor: COLORS.primary,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 19,
  },
  nextButtonDisabled: {
    backgroundColor: "#B8B8C2",
  },
  bottomError: {
    color: COLORS.danger,
    fontFamily: FONTS.semiBold,
    fontSize: 10,
    textAlign: "center",
    marginBottom: 2,
  },
  nextText: {
    color: COLORS.background,
    fontFamily: FONTS.semiBold,
    fontSize: 16,
    letterSpacing: 0,
  },
  bottomHint: {
    color: COLORS.primary,
    fontFamily: FONTS.semiBold,
    fontSize: 9,
    letterSpacing: 1,
    marginBottom: 30,
  },
  reviewBackText: {
    color: COLORS.muted,
    fontFamily: FONTS.bold,
    fontSize: 10,
    letterSpacing: 1.5,
    padding: 5,
    marginBottom: 30,
  },
});
