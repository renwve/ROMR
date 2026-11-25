import { Image } from 'expo-image';
import { useEffect, useRef } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

import { SLIDE } from '@/constants/motion';
import { colors, fonts, shadows } from '@/constants/theme';
import { TRIP_FILTER_ICONS, type Trip } from './trips';

const RADIUS = 24;
// The photo's height when open: taller on an ongoing trip, which has Romie's
// note on it ("Expanded Ongoing"), than on one that hasn't started ("Expanded
// Ready").
const PHOTO_ONGOING = 200;
const PHOTO_READY = 160;
// Figma's "Image Card w/Gradient" placeholder colour, for trips without a photo
// yet (not a Figma variable).
const PLACEHOLDER_COLOR = '#0069E2';

// Figma component set "Trip cards". Closed, a trip shows its name, dates and
// (if it's under way) how long is left ("Variant2", "Not yet started"). Pressing
// the caret opens it smoothly: its photo unfolds above, with its status and
// category, and the card lifts onto a shadow ("Expanded Ongoing",
// "Expanded Ready"). The caret turns half a turn clockwise each time.
export function TripCard({
  trip,
  open,
  onToggle,
}: {
  trip: Trip;
  open: boolean;
  onToggle: () => void;
}) {
  const photoHeight = trip.ongoing ? PHOTO_ONGOING : PHOTO_READY;
  const progress = useSharedValue(open ? 1 : 0);
  // How far the caret has turned in all, in half turns, so it always turns on
  // clockwise. 0 points up (closed); 1 points down (open).
  const turns = useSharedValue(open ? 1 : 0);
  const wasOpen = useRef(open);

  useEffect(() => {
    if (wasOpen.current === open) return;
    wasOpen.current = open;
    progress.set(withTiming(open ? 1 : 0, SLIDE));
    turns.set(withTiming(turns.get() + 1, SLIDE));
  }, [open, progress, turns]);

  const photoStyle = useAnimatedStyle(() => ({ height: progress.get() * photoHeight }));
  const shadowStyle = useAnimatedStyle(() => ({ opacity: progress.get() }));
  const caretStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${turns.get() * 180}deg` }],
  }));

  return (
    <View>
      <Animated.View style={[styles.shadow, shadowStyle]} />
      <View style={styles.card}>
        {/* The photo unfolds from the top; its contents stay put, so they're
            uncovered from the top down as it opens. */}
        <Animated.View style={[styles.photoClip, photoStyle]}>
          <View
            style={[
              styles.photo,
              { height: photoHeight },
              !trip.photo && { backgroundColor: PLACEHOLDER_COLOR },
            ]}>
            {trip.photo ? (
              <Image source={trip.photo} style={StyleSheet.absoluteFill} contentFit="cover" />
            ) : null}
            <View style={styles.photoTop}>
              <View style={styles.pill}>
                <Text style={styles.pillText}>{trip.ongoing ? 'Ongoing' : 'Ready'}</Text>
              </View>
              <View style={styles.badge} accessibilityLabel={trip.category}>
                <Image source={TRIP_FILTER_ICONS[trip.category]} style={styles.badgeIcon} />
              </View>
            </View>
            {trip.ongoing ? (
              <View style={styles.note}>
                <Image source={require('@/assets/icons/star-four.svg')} style={styles.noteIcon} />
                <Text style={styles.noteText}>{trip.ongoing.note}</Text>
              </View>
            ) : null}
          </View>
        </Animated.View>
        <View style={styles.info}>
          <View style={styles.titleRow}>
            <View style={styles.titleText}>
              <Text style={styles.title}>{trip.title}</Text>
              <View style={styles.dateRow}>
                <Text style={styles.dates}>{trip.dates}</Text>
                {trip.ongoing ? null : <Text style={styles.notStarted}>Not yet started</Text>}
              </View>
            </View>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={open ? `Close ${trip.title}` : `Open ${trip.title}`}
              accessibilityState={{ expanded: open }}
              hitSlop={12}
              onPress={onToggle}>
              <Animated.View style={caretStyle}>
                <Image source={require('@/assets/icons/caret-up.svg')} style={styles.caret} />
              </Animated.View>
            </Pressable>
          </View>
          {trip.ongoing ? (
            <View style={styles.progressRow}>
              <Text style={styles.left}>{trip.ongoing.left}</Text>
              <View style={styles.track}>
                <View
                  style={[styles.fill, { width: `${Math.round(trip.ongoing.progress * 100)}%` }]}
                />
              </View>
            </View>
          ) : null}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  // An open card rests on Figma's Medium Soft shadow; a closed one has none.
  shadow: {
    position: 'absolute',
    inset: 0,
    borderRadius: RADIUS,
    backgroundColor: colors.white100,
    boxShadow: shadows.mediumSoft,
  },
  card: {
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.white200,
    borderRadius: RADIUS,
    backgroundColor: colors.white100,
  },
  photoClip: {
    overflow: 'hidden',
  },
  photo: {
    justifyContent: 'space-between',
    padding: 16,
  },
  photoTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  pill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: colors.white200,
    borderRadius: 100,
    backgroundColor: colors.white100,
    boxShadow: shadows.soft,
  },
  pillText: {
    fontFamily: fonts.medium,
    fontSize: 14,
    lineHeight: 18,
    letterSpacing: -0.7,
    color: colors.blue900,
  },
  badge: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.white200,
    borderRadius: 16,
    backgroundColor: colors.white100,
    boxShadow: shadows.soft,
  },
  badgeIcon: {
    width: 20,
    height: 20,
  },
  note: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    backgroundColor: colors.white100,
  },
  noteIcon: {
    width: 20,
    height: 20,
  },
  // Centred across the whole note, as in Figma, not just the room beside the icon.
  noteText: {
    position: 'absolute',
    left: 0,
    right: 0,
    textAlign: 'center',
    fontFamily: fonts.regular,
    fontSize: 14,
    lineHeight: 18,
    letterSpacing: -0.7,
    color: colors.blue900,
  },
  info: {
    gap: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  titleText: {
    flex: 1,
  },
  title: {
    fontFamily: fonts.semiBold,
    fontSize: 16,
    lineHeight: 20,
    letterSpacing: -0.8,
    color: colors.blue900,
  },
  dateRow: {
    flexDirection: 'row',
    gap: 8,
  },
  dates: {
    fontFamily: fonts.regular,
    fontSize: 16,
    lineHeight: 20,
    letterSpacing: -0.8,
    color: colors.gray500,
  },
  notStarted: {
    fontFamily: fonts.regular,
    fontSize: 16,
    lineHeight: 20,
    letterSpacing: -0.8,
    color: colors.gray400,
  },
  caret: {
    width: 24,
    height: 24,
  },
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  left: {
    fontFamily: fonts.regular,
    fontSize: 14,
    lineHeight: 18,
    letterSpacing: -0.7,
    color: colors.gray500,
  },
  track: {
    flex: 1,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.gray200,
  },
  fill: {
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.blue900,
  },
});
