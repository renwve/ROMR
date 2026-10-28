import React from "react";
import {
  Image,
  Modal,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";

export type PlaceDetails = {
  id: string;
  name: string;
  country: string;
  image: string;
  address: string;
  weather: string;
  temperature: string;
  description: string;
  bestTimeToVisit: string;
  language: string;
  currency: string;
  pros: string[];
  cons: string[];
  costs: {
    category: string;
    estimate: string;
    icon: keyof typeof Ionicons.glyphMap;
  }[];
  customs: string[];
  tips: string[];
  offer?: {
    label: string;
    price: string;
    previousPrice: string;
    includes: string[];
  };
};

type PlaceDetailsModalProps = {
  visible: boolean;
  place: PlaceDetails | null;
  isFavorite: boolean;
  onClose: () => void;
  onToggleFavorite: (place: PlaceDetails) => void;
};

const COLORS = {
  background: "#E7E7F1",
  card: "#FFFFFF",
  text: "#27283B",
  muted: "#77788D",
  accent: "#7C78B8",
  accentLight: "#F0EFFB",
  border: "#E7E5F0",
  green: "#EAF2D7",
  greenText: "#526943",
  red: "#FBE8EB",
  redText: "#A95768",
};

const FONTS = {
  regular: "BeVietnamProRegular",
  semiBold: "BeVietnamProSemiBold",
  italic: "BeVietnamProItalics",
  semiBoldItalic: "BeVietnamProSemiBoldItalics",
};

function Section({
  title,
  subtitle,
  children,
  style,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  style?: any;
}) {
  return (
    <View style={[styles.section, style]}>
      <View style={styles.sectionHeading}>
        <Text style={styles.sectionTitle}>{title}</Text>
        {subtitle ? (
          <Text style={styles.sectionSubtitle}>{subtitle}</Text>
        ) : null}
      </View>
      {children}
    </View>
  );
}

export default function PlaceDetailsModal({
  visible,
  place,
  isFavorite,
  onClose,
  onToggleFavorite,
}: PlaceDetailsModalProps) {
  if (!place) return null;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="overFullScreen"
      transparent
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <StatusBar barStyle="dark-content" />

      <View style={styles.overlay}>
        <Pressable
          style={styles.backdrop}
          onPress={onClose}
          accessibilityLabel="Close place details"
        />

        <SafeAreaView style={styles.modal} edges={["bottom"]}>
          <View style={styles.topBar}>
            <View style={styles.dragIndicator} />

            <View style={styles.topActions}>
              <Pressable
                onPress={onClose}
                style={styles.iconButton}
                accessibilityLabel="Close"
              >
                <Ionicons name="close" size={23} color={COLORS.text} />
              </Pressable>

              <Pressable
                onPress={() => onToggleFavorite(place)}
                style={styles.iconButton}
                accessibilityLabel={
                  isFavorite ? "Remove from favorites" : "Save to favorites"
                }
              >
                <Ionicons
                  name={isFavorite ? "heart" : "heart-outline"}
                  size={22}
                  color={isFavorite ? "#D85D80" : COLORS.text}
                />
              </Pressable>
            </View>
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            <View style={styles.hero}>
              <Image
                source={{ uri: place.image }}
                style={styles.heroImage}
                resizeMode="cover"
              />
              <LinearGradient
                colors={[
                  "rgba(231,231,241,0)",
                  "rgba(231,231,241,0.10)",
                  COLORS.background,
                ]}
                locations={[0.48, 0.76, 1]}
                style={styles.heroFade}
              />
            </View>

            <View style={styles.introBlock}>
              <View style={styles.titleActionRow}>
                <Text style={styles.placeName} numberOfLines={2}>
                  {place.name}
                </Text>
                <Pressable
                  style={({ pressed }) => [
                    styles.chatButton,
                    pressed && styles.buttonPressed,
                  ]}
                  onPress={() => {}}
                  accessibilityRole="button"
                  accessibilityLabel={`Start chat about ${place.name}`}
                >
                  <Text style={styles.chatButtonText}>Start Chat</Text>
                </Pressable>
              </View>

              <View style={styles.quickFactsRow}>
                <View style={styles.quickFact}>
                  <Ionicons
                    name="location-outline"
                    size={16}
                    color={COLORS.text}
                  />
                  <Text style={styles.quickFactText} numberOfLines={1}>
                    {place.country}
                  </Text>
                </View>
                <View style={styles.quickFact}>
                  <Ionicons name="cloudy-outline" size={17} color="#8C8D98" />
                  <Text style={styles.quickFactText} numberOfLines={1}>
                    {place.temperature} {place.weather}
                  </Text>
                </View>
              </View>
              <Text style={styles.addressText} numberOfLines={2}>
                {place.address}
              </Text>
            </View>

            {place.offer ? (
              <View style={styles.offerDetailsWrap}>
                <View style={styles.offerDetailsBadge}>
                  <Ionicons
                    name="pricetag-outline"
                    size={15}
                    color="#8C5C48"
                  />
                  <Text style={styles.offerDetailsBadgeText}>
                    {place.offer.label}
                  </Text>
                </View>
                <View style={styles.offerPriceCard}>
                  <Text style={styles.offerSmallLabel}>
                    YOUR NEXT LITTLE ESCAPE
                  </Text>
                  <Text style={styles.offerBigPrice}>{place.offer.price}</Text>
                  <Text style={styles.offerPreviousPrice}>
                    {place.offer.previousPrice}
                  </Text>
                  <Text style={styles.offerDescription}>
                    {place.description}
                  </Text>
                </View>
                <Section
                  title="What to know before you go"
                  subtitle="Offer details to check before booking"
                  style={styles.offerDetailsSection}
                >
                  <View style={styles.card}>
                    {place.offer.includes.map((item, index) => (
                      <View
                        style={styles.offerIncludeRow}
                        key={`offer-include-${index}`}
                      >
                        <Ionicons
                          name="checkmark-circle-outline"
                          size={18}
                          color={COLORS.accent}
                        />
                        <Text style={styles.bulletText}>{item}</Text>
                      </View>
                    ))}
                  </View>
                </Section>
                <View style={styles.offerFinePrint}>
                  <Ionicons
                    name="information-circle-outline"
                    size={17}
                    color={COLORS.muted}
                  />
                  <Text style={styles.offerFinePrintText}>
                    This is a prototype promotion. Final destination, dates,
                    availability, inclusions, taxes and booking terms must be
                    confirmed before purchase.
                  </Text>
                </View>
              </View>
            ) : (
              <>
                <Section title="A little about this place">
                  <View style={styles.card}>
                    <Text style={styles.description}>{place.description}</Text>

                    <View style={styles.divider} />

                    <View style={styles.factRow}>
                      <Ionicons
                        name="calendar-outline"
                        size={19}
                        color={COLORS.accent}
                      />
                      <View style={styles.factText}>
                        <Text style={styles.factLabel}>Best time to visit</Text>
                        <Text style={styles.factValue}>
                          {place.bestTimeToVisit}
                        </Text>
                      </View>
                    </View>

                    <View style={styles.factRow}>
                      <Ionicons
                        name="chatbubble-ellipses-outline"
                        size={19}
                        color={COLORS.accent}
                      />
                      <View style={styles.factText}>
                        <Text style={styles.factLabel}>Language</Text>
                        <Text style={styles.factValue}>{place.language}</Text>
                      </View>
                    </View>

                    <View style={styles.factRow}>
                      <Ionicons
                        name="wallet-outline"
                        size={19}
                        color={COLORS.accent}
                      />
                      <View style={styles.factText}>
                        <Text style={styles.factLabel}>Currency</Text>
                        <Text style={styles.factValue}>{place.currency}</Text>
                      </View>
                    </View>
                  </View>
                </Section>

                <Section
                  title="The good & the not-so-good"
                  subtitle="A few things to consider before you go"
                >
                  <View style={styles.prosConsRow}>
                    <View style={[styles.prosConsCard, styles.prosCard]}>
                      <View style={styles.prosConsHeading}>
                        <Ionicons
                          name="thumbs-up-outline"
                          size={19}
                          color={COLORS.greenText}
                        />
                        <Text
                          style={[
                            styles.prosConsTitle,
                            { color: COLORS.greenText },
                          ]}
                        >
                          The pros
                        </Text>
                      </View>

                      {place.pros.map((item, index) => (
                        <View
                          style={styles.bulletRow}
                          key={`pro-${index}`}
                        >
                          <Ionicons
                            name="checkmark-circle"
                            size={16}
                            color={COLORS.greenText}
                          />
                          <Text style={styles.bulletText}>{item}</Text>
                        </View>
                      ))}
                    </View>

                    <View style={[styles.prosConsCard, styles.consCard]}>
                      <View style={styles.prosConsHeading}>
                        <Ionicons
                          name="thumbs-down-outline"
                          size={19}
                          color={COLORS.redText}
                        />
                        <Text
                          style={[
                            styles.prosConsTitle,
                            { color: COLORS.redText },
                          ]}
                        >
                          The cons
                        </Text>
                      </View>

                      {place.cons.map((item, index) => (
                        <View
                          style={styles.bulletRow}
                          key={`con-${index}`}
                        >
                          <Ionicons
                            name="alert-circle-outline"
                            size={16}
                            color={COLORS.redText}
                          />
                          <Text style={styles.bulletText}>{item}</Text>
                        </View>
                      ))}
                    </View>
                  </View>
                </Section>

                <Section
                  title="What might it cost?"
                  subtitle="Estimated costs per person"
                >
                  <View style={styles.card}>
                    {place.costs.map((cost, index) => (
                      <View
                        style={[
                          styles.costRow,
                          index !== place.costs.length - 1 &&
                            styles.costBorder,
                        ]}
                        key={`${cost.category}-${index}`}
                      >
                        <View style={styles.costIcon}>
                          <Ionicons
                            name={cost.icon}
                            size={19}
                            color={COLORS.accent}
                          />
                        </View>

                        <Text style={styles.costCategory}>{cost.category}</Text>
                        <Text style={styles.costEstimate}>{cost.estimate}</Text>
                      </View>
                    ))}

                    <Text style={styles.costDisclaimer}>
                      These are estimates, not guaranteed prices. Costs vary by
                      season, location, and personal preferences.
                    </Text>
                  </View>
                </Section>

                <Section
                  title="Local customs & etiquette"
                  subtitle="A little cultural awareness goes a long way"
                >
                  <View style={styles.card}>
                    {place.customs.map((custom, index) => (
                      <View
                        style={styles.customRow}
                        key={`custom-${index}`}
                      >
                        <View style={styles.customNumber}>
                          <Text style={styles.customNumberText}>
                            {index + 1}
                          </Text>
                        </View>
                        <Text style={styles.customText}>{custom}</Text>
                      </View>
                    ))}
                  </View>
                </Section>

                <Section title="Little travel tips">
                  <View style={styles.tipsCard}>
                    <View style={styles.tipsHeader}>
                      <Ionicons
                        name="sparkles-outline"
                        size={19}
                        color={COLORS.accent}
                      />
                      <Text style={styles.tipsHeading}>Before you head out</Text>
                    </View>

                    {place.tips.map((tip, index) => (
                      <View style={styles.bulletRow} key={`tip-${index}`}>
                        <Ionicons
                          name="checkmark"
                          size={17}
                          color={COLORS.accent}
                        />
                        <Text style={styles.bulletText}>{tip}</Text>
                      </View>
                    ))}
                  </View>
                </Section>
              </>
            )}

            {!place.offer ? (
              <Text style={styles.footerNote}>
                Explore thoughtfully. Travel kindly. Keep little memories.
              </Text>
            ) : null}
          </ScrollView>
        </SafeAreaView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(26, 25, 43, 0.42)",
  },
  backdrop: {
    ...StyleSheet.absoluteFill,
  },
  modal: {
    height: "93%",
    backgroundColor: COLORS.background,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    overflow: "hidden",
    position: "relative",
  },
  topBar: {
    position: "absolute",
    top: 7,
    left: 0,
    right: 0,
    paddingTop: 8,
    paddingHorizontal: 16,
    paddingBottom: 8,
    zIndex: 10,
  },
  dragIndicator: {
    alignSelf: "center",
    width: 42,
    height: 5,
    borderRadius: 5,
    backgroundColor: "#C8C7D8",
    marginBottom: 9,
  },
  topActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 8,
  },
  iconButton: {
    width: 37,
    height: 37,
    borderRadius: 19,
    backgroundColor: "rgba(255,255,255,0.88)",
    alignItems: "center",
    justifyContent: "center",
  },
  scrollContent: {
    paddingBottom: 24,
  },
  hero: {
    height: 292,
    width: "100%",
    overflow: "hidden",
    backgroundColor: "#D6D4E6",
  },
  heroImage: {
    width: "100%",
    height: "100%",
    position: "absolute",
  },
  heroFade: {
    ...StyleSheet.absoluteFill,
  },
  introBlock: {
    backgroundColor: COLORS.background,
    paddingHorizontal: 14,
    paddingTop: 3,
    paddingBottom: 19,
  },
  titleActionRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
  },
  placeName: {
    flex: 1,
    fontSize: 30,
    lineHeight: 36,
    fontFamily: FONTS.semiBold,
    color: "#101448",
    letterSpacing: -1.1,
  },
  quickFactsRow: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    columnGap: 17,
    rowGap: 6,
    marginTop: 2,
  },
  quickFact: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    maxWidth: "100%",
  },
  quickFactText: {
    fontFamily: FONTS.regular,
    color: "#202139",
    fontSize: 11,
    flexShrink: 1,
  },
  addressText: {
    color: "#85859B",
    fontFamily: FONTS.regular,
    fontSize: 9,
    lineHeight: 13,
    marginTop: 4,
  },
  section: {
    marginHorizontal: 16,
    marginBottom: 19,
  },
  sectionHeading: {
    marginBottom: 9,
  },
  sectionTitle: {
    fontFamily: FONTS.semiBold,
    color: COLORS.text,
    fontSize: 16,
  },
  sectionSubtitle: {
    fontFamily: FONTS.regular,
    color: COLORS.muted,
    fontSize: 11,
    lineHeight: 17,
    marginTop: 4,
  },
  card: {
    backgroundColor: COLORS.card,
    borderRadius: 17,
    padding: 14,
  },
  description: {
    fontFamily: FONTS.regular,
    color: COLORS.text,
    fontSize: 12,
    lineHeight: 21,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: 12,
  },
  factRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 11,
    marginTop: 10,
  },
  factText: {
    flex: 1,
  },
  factLabel: {
    fontFamily: FONTS.regular,
    color: COLORS.muted,
    fontSize: 10,
  },
  factValue: {
    fontFamily: FONTS.semiBold,
    color: COLORS.text,
    fontSize: 12,
    marginTop: 3,
  },
  prosConsRow: {
    flexDirection: "row",
    alignItems: "stretch",
    gap: 8,
  },
  prosConsCard: {
    flex: 1,
    borderRadius: 16,
    padding: 10,
  },
  prosCard: {
    backgroundColor: COLORS.green,
  },
  consCard: {
    backgroundColor: COLORS.red,
  },
  prosConsHeading: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 9,
  },
  prosConsTitle: {
    fontFamily: FONTS.semiBold,
    fontSize: 12,
  },
  bulletRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 7,
    marginBottom: 10,
  },
  bulletText: {
    flex: 1,
    fontFamily: FONTS.regular,
    fontSize: 11,
    lineHeight: 16,
    color: COLORS.text,
  },
  costRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    gap: 8,
  },
  costBorder: {
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  costIcon: {
    width: 34,
    height: 34,
    borderRadius: 12,
    backgroundColor: COLORS.accentLight,
    alignItems: "center",
    justifyContent: "center",
  },
  costCategory: {
    flex: 1,
    fontFamily: FONTS.regular,
    fontSize: 12,
    color: COLORS.text,
  },
  costEstimate: {
    fontFamily: FONTS.semiBold,
    fontSize: 12,
    color: COLORS.text,
    textAlign: "right",
  },
  costDisclaimer: {
    fontFamily: FONTS.italic,
    color: COLORS.muted,
    fontSize: 10,
    lineHeight: 16,
    marginTop: 10,
  },
  customRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 11,
    marginBottom: 11,
  },
  customNumber: {
    width: 25,
    height: 25,
    borderRadius: 9,
    backgroundColor: COLORS.accentLight,
    alignItems: "center",
    justifyContent: "center",
  },
  customNumberText: {
    fontFamily: FONTS.semiBold,
    color: COLORS.accent,
    fontSize: 11,
  },
  customText: {
    flex: 1,
    fontFamily: FONTS.regular,
    color: COLORS.text,
    fontSize: 11,
    lineHeight: 18,
    paddingTop: 3,
  },
  tipsCard: {
    backgroundColor: "#F6F4FF",
    borderRadius: 17,
    padding: 14,
  },
  tipsHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 11,
  },
  tipsHeading: {
    fontFamily: FONTS.semiBold,
    color: COLORS.text,
    fontSize: 13,
  },
  chatButton: {
    minHeight: 33,
    minWidth: 103,
    paddingHorizontal: 15,
    backgroundColor: "#C5CCFA",
    borderRadius: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  chatButtonText: {
    color: "#FFFFFF",
    fontFamily: FONTS.semiBold,
    fontSize: 10,
  },
  buttonPressed: {
    opacity: 0.8,
  },
  offerDetailsWrap: { marginTop: -4, 
    marginBottom: 12, 
    marginHorizontal: 16 
  },
  offerDetailsBadge: {
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 11,
    paddingVertical: 7,
    borderRadius: 18,
    backgroundColor: "#F8DDE7",
    marginBottom: 12,
  },
  offerDetailsBadgeText: {
    fontFamily: FONTS.semiBold,
    color: "#8C5C48",
    fontSize: 9,
    letterSpacing: 0.8,
  },
  offerPriceCard: {
    backgroundColor: COLORS.card,
    borderRadius: 18,
    padding: 17,
    marginBottom: 22,
    borderWidth: 1,
    borderColor: "#EABBCB",
  },
  offerSmallLabel: {
    fontFamily: FONTS.semiBold,
    color: "#B65478",
    fontSize: 9,
    letterSpacing: 1.1,
  },
  offerBigPrice: {
    fontFamily: FONTS.semiBold,
    color: COLORS.text,
    fontSize: 29,
    marginTop: 5,
  },
  offerPreviousPrice: {
    fontFamily: FONTS.regular,
    color: COLORS.muted,
    fontSize: 10,
    marginTop: 2,
  },
  offerDescription: {
    fontFamily: FONTS.regular,
    color: COLORS.text,
    fontSize: 12,
    lineHeight: 19,
    marginTop: 13,
  },
  offerIncludeRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 9,
    marginBottom: 11,
  },
  offerFinePrint: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
    paddingHorizontal: 3,
    marginBottom: 18,
  },
  offerFinePrintText: {
    flex: 1,
    fontFamily: FONTS.regular,
    color: COLORS.muted,
    fontSize: 10,
    lineHeight: 16,
  },
  offerDetailsSection: { 
    marginHorizontal: 0 
  },
  footerNote: {
    fontFamily: FONTS.italic,
    color: COLORS.muted,
    fontSize: 10,
    textAlign: "center",
    marginHorizontal: 18,
    marginTop: 3,
    marginBottom: 9,
  },
});