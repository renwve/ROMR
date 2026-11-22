import { Image } from 'expo-image';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { colors, fonts } from '@/constants/theme';
import { icons } from '../assets';
import type { Trip } from '../trips';

// Geometry from Figma "Frame 92": 48pt tiles turned -9°, each in a 54.918pt slot
// 24pt apart; below them 30pt step markers every 82pt joined by 80×6 bars.
const TILE_SLOT = 54.918;
const TILE_GAP = 24;
const STEP_SIZE = 30;
const STEP_PITCH = 82;
const CARD_PADDING = 16;

export function ItineraryCard({ trip }: { trip: Trip }) {
  const stops = trip.itinerary;
  const trackWidth = stops.length > 0 ? (stops.length - 1) * STEP_PITCH + STEP_SIZE : 0;

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.heading}>
          <Image source={icons.sparkleDark} style={styles.sparkle} />
          <Text style={styles.headingText}>Your itinerary</Text>
        </View>
        <Text style={styles.updated}>{trip.itineraryUpdated}</Text>
      </View>

      {stops.length > 0 ? (
        // Bleeds into the card's padding so the row is clipped at the card edge, as in Figma.
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.scroller}
          contentContainerStyle={styles.scrollContent}>
          <View style={styles.track}>
            <View style={styles.tiles}>
              {stops.map((stop) => (
                <View key={stop.id} style={styles.tileSlot}>
                  {stop.kind === 'photo' ? (
                    <View style={styles.tile}>
                      <Image source={stop.image} contentFit="cover" style={StyleSheet.absoluteFill} />
                    </View>
                  ) : (
                    <View style={[styles.tile, styles.iconTile]}>
                      <Image source={stop.icon} style={styles.tileIcon} />
                    </View>
                  )}
                </View>
              ))}
            </View>
            <View style={styles.stepsWrap}>
              <View style={[styles.steps, { width: trackWidth }]}>
                {stops.slice(1).map((stop, i) => (
                  <View key={stop.id} style={[styles.bar, { left: 15 + i * STEP_PITCH }]} />
                ))}
                {stops.map((stop, i) => (
                  <View key={stop.id} style={[styles.step, { left: i * STEP_PITCH }]}>
                    <Image
                      source={i === 0 ? icons.stepCurrent : icons.stepUpcoming}
                      style={styles.stepIcon}
                    />
                  </View>
                ))}
              </View>
            </View>
            <Text style={styles.startHere}>Start here</Text>
          </View>
        </ScrollView>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white100,
    borderWidth: 1,
    borderColor: colors.gray100,
    borderRadius: 12,
    padding: CARD_PADDING,
    gap: 24,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
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
  updated: {
    fontFamily: fonts.regular,
    fontSize: 14,
    letterSpacing: -0.56,
    color: colors.gray400,
  },
  scroller: {
    marginHorizontal: -CARD_PADDING,
  },
  scrollContent: {
    paddingHorizontal: CARD_PADDING,
  },
  track: {
    gap: 8,
    alignItems: 'flex-start',
  },
  tiles: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: TILE_GAP,
  },
  tileSlot: {
    width: TILE_SLOT,
    height: TILE_SLOT,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tile: {
    width: 48,
    height: 48,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: colors.blue300,
    overflow: 'hidden',
    transform: [{ rotate: '-9deg' }],
  },
  iconTile: {
    backgroundColor: colors.blue300,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tileIcon: {
    width: 24,
    height: 24,
  },
  stepsWrap: {
    paddingHorizontal: 8,
  },
  steps: {
    height: STEP_SIZE,
  },
  bar: {
    position: 'absolute',
    top: 12,
    width: 80,
    height: 6,
    backgroundColor: colors.blue300,
  },
  step: {
    position: 'absolute',
    top: 0,
    width: STEP_SIZE,
    height: STEP_SIZE,
    borderRadius: 100,
    overflow: 'hidden',
  },
  stepIcon: {
    position: 'absolute',
    left: 3,
    top: 3,
    width: 24,
    height: 24,
  },
  startHere: {
    fontFamily: fonts.medium,
    fontSize: 14,
    letterSpacing: -0.56,
    color: colors.blue900,
  },
});
