import { Image } from 'expo-image';
import { router, useFocusEffect, useLocalSearchParams } from 'expo-router';
import { useCallback } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, {
  clamp,
  useAnimatedScrollHandler,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import { colors, fonts } from '@/constants/theme';
import { icons } from '@/features/planner/assets';
import { ContinuePlanningButton } from '@/features/planner/components/ChatInputBar';
import { ItineraryCard } from '@/features/planner/components/ItineraryCard';
import {
  HEADER_INSET,
  HEADER_RESIZE,
  TRIP_HEIGHT,
  useHeaderCollapse,
  useHeaderHeights,
} from '@/features/planner/header';
import { useTrip } from '@/features/planner/TripsContext';

// Keeps the last card scrollable out from under the floating input bar.
const INPUT_BAR_CLEARANCE = 40 + 58 + 16;
// Content starts below the open header: the 300pt card plus its inset above and below.
const OPEN_HEADER = TRIP_HEIGHT + HEADER_INSET * 2;

export default function TripOpenScreen() {
  const { tripId } = useLocalSearchParams<{ tripId: string }>();
  const trip = useTrip(tripId);
  const collapse = useHeaderCollapse();
  const collapseRange = TRIP_HEIGHT - useHeaderHeights().tripCollapsed;
  const scrollY = useSharedValue(0);

  // The header shrinks point for point with the scroll, so the content stays
  // flush beneath it until it is collapsed, then scrolls on underneath.
  const onScroll = useAnimatedScrollHandler((event) => {
    scrollY.set(event.contentOffset.y);
    collapse.set(clamp(event.contentOffset.y / collapseRange, 0, 1));
  });

  // Coming back from Continue Planning, restore the header to match the scroll.
  useFocusEffect(
    useCallback(() => {
      collapse.set(withTiming(clamp(scrollY.get() / collapseRange, 0, 1), HEADER_RESIZE));
    }, [collapse, scrollY, collapseRange]),
  );

  if (!trip) return null;

  const stats = [
    { value: trip.stats.othersGoing, label: 'Others going' },
    { value: trip.stats.budget, label: 'Your budget' },
    { value: trip.stats.thingsToDo, label: 'Things to do' },
  ];

  return (
    <View style={styles.screen}>
      <Animated.ScrollView
        onScroll={onScroll}
        scrollEventThrottle={16}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        <View style={styles.overview}>
          <ItineraryCard trip={trip} />
          <View style={styles.stats}>
            {stats.map((stat) => (
              <View key={stat.label} style={[styles.box, styles.stat]}>
                <Text style={styles.statValue}>{stat.value}</Text>
                <Text style={styles.statLabel}>{stat.label}</Text>
              </View>
            ))}
          </View>
        </View>

        {trip.tips.length > 0 ? (
          <View style={[styles.box, styles.tips]}>
            <View style={styles.heading}>
              <Image source={icons.sparkleDark} style={styles.sparkle} />
              <Text style={styles.headingText}>Know more before your trip</Text>
            </View>
            <View style={styles.tipGroups}>
              {trip.tips.map((group) => (
                <View key={group.title} style={styles.tipGroup}>
                  <Text style={styles.tipTitle}>{group.title}</Text>
                  <View style={styles.tipItems}>
                    {group.items.map((item) => (
                      <Text key={item} style={styles.tipItem}>
                        {item}
                      </Text>
                    ))}
                  </View>
                </View>
              ))}
            </View>
          </View>
        ) : null}
      </Animated.ScrollView>

      <ContinuePlanningButton
        onPress={() =>
          router.push({ pathname: '/planner/[tripId]/continue', params: { tripId: trip.id } })
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  content: {
    gap: 8,
    paddingTop: OPEN_HEADER,
    paddingHorizontal: 16,
    paddingBottom: INPUT_BAR_CLEARANCE,
  },
  overview: {
    gap: 4,
  },
  box: {
    backgroundColor: colors.white100,
    borderWidth: 1,
    borderColor: colors.gray100,
    borderRadius: 12,
  },
  stats: {
    flexDirection: 'row',
    gap: 4,
  },
  stat: {
    flex: 1,
    alignItems: 'center',
    gap: 8,
    padding: 8,
  },
  statValue: {
    fontFamily: fonts.boldItalic,
    fontSize: 32,
    letterSpacing: -1.28,
    color: colors.blue900,
  },
  statLabel: {
    fontFamily: fonts.medium,
    fontSize: 14,
    letterSpacing: -0.56,
    color: colors.dark800,
  },
  tips: {
    padding: 16,
    gap: 32,
  },
  heading: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  sparkle: {
    width: 16,
    height: 16,
  },
  headingText: {
    fontFamily: fonts.medium,
    fontSize: 14,
    letterSpacing: -0.56,
    color: colors.blue900,
  },
  tipGroups: {
    gap: 32,
  },
  tipGroup: {
    gap: 12,
  },
  tipTitle: {
    fontFamily: fonts.semiBold,
    fontSize: 16,
    letterSpacing: -0.64,
    color: colors.blue900,
  },
  tipItems: {
    gap: 8,
  },
  tipItem: {
    fontFamily: fonts.medium,
    fontSize: 12,
    letterSpacing: -0.48,
    color: colors.blue900,
  },
});
