import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useEffect } from 'react';
import { StyleSheet, Text, View, type LayoutChangeEvent } from 'react-native';
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
  type SharedValue,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors, fonts } from '@/constants/theme';
import { icons } from '../assets';
import {
  HEADER_INSET as INSET,
  HEADER_RESIZE as RESIZE,
  TRIP_HEIGHT,
  useHeaderCollapse,
  useHeaderHeights,
} from '../header';
import type { Trip } from '../trips';
import { CircleIconButton, PillButton } from './Buttons';

export type HeaderMode = 'list' | 'trip' | 'continue';

// On the way to a trip the header starts gaining its 8pt inset on every side
// at 200pt and has all of it by 300pt.
const INSET_FROM = 200;
const RADIUS = 40;
// The open trip title is 24pt; collapsed it is 20pt.
const COLLAPSED_TITLE_SCALE = 20 / 24;

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

function formatToday() {
  const now = new Date();
  return `${MONTHS[now.getMonth()]} ${now.getDate()}`;
}

function goBack() {
  if (router.canGoBack()) router.back();
  else router.replace('/planner');
}

function useCrossFade(visible: boolean) {
  const opacity = useSharedValue(visible ? 1 : 0);
  useEffect(() => {
    opacity.set(
      visible
        ? withDelay(120, withTiming(1, { duration: 280 }))
        : withTiming(0, { duration: 160 }),
    );
  }, [visible, opacity]);
  return useAnimatedStyle(() => ({ opacity: opacity.value }));
}

function insetFor(height: SharedValue<number>) {
  'worklet';
  return interpolate(height.value, [INSET_FROM, TRIP_HEIGHT], [0, INSET], Extrapolation.CLAMP);
}

// Floats over the planner screens; each screen pads its content down to clear it.
export function PlannerHeader({ mode, trip }: { mode: HeaderMode; trip?: Trip }) {
  const insets = useSafeAreaInsets();
  const heights = useHeaderHeights();
  const collapse = useHeaderCollapse();
  const target = heights[mode];
  const showPhoto = mode === 'trip' && !!trip?.image;
  const collapseRange = TRIP_HEIGHT - heights.tripCollapsed;

  // `height` carries the screen-to-screen transitions; the trip screen's scroll
  // takes up to `collapseRange` off it through `collapse`.
  const height = useSharedValue(target);
  const photo = useSharedValue(showPhoto ? 1 : 0);

  useEffect(() => {
    height.set(withTiming(target, RESIZE));
    photo.set(withTiming(showPhoto ? 1 : 0, RESIZE));
    // Unwinds on the same curve as `height`, so leaving a collapsed trip header
    // moves in one straight line to the next screen's header.
    if (mode !== 'trip') collapse.set(withTiming(0, RESIZE));
  }, [mode, target, showPhoto, height, photo, collapse]);

  // Shared values are read in each style itself (not inside a helper) so
  // Reanimated sees them and re-runs the style when they change.
  const frameStyle = useAnimatedStyle(() => {
    // The inset follows the transition only, so a collapsed trip card keeps it.
    const inset = insetFor(height);
    const cardHeight = height.value - collapseRange * collapse.value;
    return { height: cardHeight + inset * 2, padding: inset };
  });

  const tripLayerStyle = useAnimatedStyle(() => ({
    height: Math.max(height.value - collapseRange * collapse.value, heights.tripCollapsed),
  }));

  const cardStyle = useAnimatedStyle(() => {
    const topRadius = interpolate(insetFor(height), [0, INSET], [0, RADIUS]);
    return { borderTopLeftRadius: topRadius, borderTopRightRadius: topRadius };
  });

  const photoStyle = useAnimatedStyle(() => ({ opacity: photo.value }));
  const listStyle = useCrossFade(mode === 'list');
  const tripStyle = useCrossFade(mode === 'trip');
  const continueStyle = useCrossFade(mode === 'continue');

  const contentTop = { paddingTop: insets.top + 8 };

  return (
    <Animated.View pointerEvents="box-none" style={[styles.frame, frameStyle]}>
      <Animated.View style={[styles.card, cardStyle]}>
        {trip?.image ? (
          <Animated.View style={[StyleSheet.absoluteFill, photoStyle]}>
            {/* Sized to the open card and pinned to its top, so shrinking the card
                (on scroll or between screens) crops the photo rather than rescaling it. */}
            <Image source={trip.image} contentFit="cover" style={styles.photo} />
            <LinearGradient
              colors={['rgba(192, 202, 249, 0)', 'rgba(0, 0, 0, 0.75)']}
              style={StyleSheet.absoluteFill}
            />
          </Animated.View>
        ) : null}

        <Animated.View
          pointerEvents={mode === 'list' ? 'box-none' : 'none'}
          style={[styles.layer, contentTop, { height: heights.list }, listStyle]}>
          <TitleRow title="Planner" />
        </Animated.View>

        <Animated.View
          pointerEvents={mode === 'trip' ? 'box-none' : 'none'}
          style={[styles.layer, { paddingTop: heights.tripPaddingTop }, tripLayerStyle, tripStyle]}>
          {trip ? <TripContent trip={trip} collapse={collapse} /> : null}
        </Animated.View>

        <Animated.View
          pointerEvents={mode === 'continue' ? 'box-none' : 'none'}
          style={[styles.layer, styles.continueLayer, contentTop, { height: heights.continue }, continueStyle]}>
          <TitleRow title="Continue Planning" />
          <View style={styles.row}>
            <View style={styles.rowStart}>
              <CircleIconButton icon={icons.caretLeft} label="Back" onPress={goBack} />
              <Text style={styles.smallLabel}>{trip?.name}</Text>
            </View>
            <CircleIconButton icon={icons.list} label="Menu" />
          </View>
        </Animated.View>
      </Animated.View>
    </Animated.View>
  );
}

function TitleRow({ title }: { title: string }) {
  return (
    <View style={styles.titleRow}>
      <View>
        <Text style={styles.brand}>ROMR</Text>
        <Image source={icons.romrStar} style={styles.brandStar} />
      </View>
      <Text style={styles.date}>{formatToday()}</Text>
      <View pointerEvents="none" style={styles.titleWrap}>
        <Text style={styles.title}>{title}</Text>
      </View>
    </View>
  );
}

// Open: title above the location and date, pinned to the card's bottom.
// Collapsed: the location and date fade out and the title drops into their
// place, shrinking from 24pt to 20pt.
function TripContent({ trip, collapse }: { trip: Trip; collapse: SharedValue<number> }) {
  const metaHeight = useSharedValue(40);

  const titleStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: -(12 + metaHeight.value) * (1 - collapse.value) },
      { scale: interpolate(collapse.value, [0, 1], [1, COLLAPSED_TITLE_SCALE]) },
    ],
  }));

  const metaStyle = useAnimatedStyle(() => ({
    opacity: interpolate(collapse.value, [0, 0.5], [1, 0], Extrapolation.CLAMP),
  }));

  const onMetaLayout = (event: LayoutChangeEvent) => {
    metaHeight.set(event.nativeEvent.layout.height);
  };

  return (
    <>
      <View style={styles.row}>
        <View style={styles.rowStart}>
          <CircleIconButton icon={icons.caretLeft} label="Back" onPress={goBack} />
          <Text style={styles.smallLabel}>{trip.status}</Text>
        </View>
        <View style={styles.rowEnd}>
          <PillButton icon={icons.usersDark} label="Invite" variant="white" />
          <CircleIconButton icon={icons.list} label="Menu" />
        </View>
      </View>
      <Animated.Text numberOfLines={1} style={[styles.tripName, titleStyle]}>
        {trip.name}
      </Animated.Text>
      <Animated.View onLayout={onMetaLayout} style={[styles.tripMeta, metaStyle]}>
          <View style={styles.metaRow}>
            <Image source={icons.mapPin} style={styles.metaIcon} />
            <Text style={styles.metaText}>{trip.location}</Text>
          </View>
          <View style={styles.metaRow}>
            <Image source={icons.calendarBlank} style={styles.metaIcon} />
            <Text style={styles.metaText}>{trip.date}</Text>
            <Image source={icons.dotLight} style={styles.dot} />
            <Text style={styles.metaText}>{trip.when}</Text>
          </View>
      </Animated.View>
    </>
  );
}

const styles = StyleSheet.create({
  frame: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    // Hides trip content scrolled up behind the card's inset and corners.
    backgroundColor: colors.white200,
  },
  card: {
    flex: 1,
    backgroundColor: colors.blue300,
    borderBottomLeftRadius: RADIUS,
    borderBottomRightRadius: RADIUS,
    overflow: 'hidden',
  },
  photo: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: TRIP_HEIGHT,
  },
  layer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 16,
  },
  continueLayer: {
    gap: 32,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
  },
  brand: {
    fontFamily: fonts.boldItalic,
    fontSize: 12,
    letterSpacing: -0.96,
    color: colors.white100,
  },
  brandStar: {
    position: 'absolute',
    left: 31,
    top: -2,
    width: 7.869,
    height: 7.869,
  },
  date: {
    fontFamily: fonts.boldItalic,
    fontSize: 12,
    letterSpacing: -0.48,
    color: colors.white100,
  },
  titleWrap: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: -5,
    alignItems: 'center',
  },
  title: {
    fontFamily: fonts.boldItalic,
    fontSize: 20,
    letterSpacing: -0.8,
    color: colors.white100,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  rowStart: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 18,
  },
  rowEnd: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  smallLabel: {
    fontFamily: fonts.medium,
    fontSize: 14,
    letterSpacing: -0.56,
    color: colors.white100,
  },
  tripName: {
    position: 'absolute',
    left: 16,
    right: 16,
    bottom: 24,
    fontFamily: fonts.boldItalic,
    fontSize: 24,
    lineHeight: 30,
    includeFontPadding: false,
    letterSpacing: -0.96,
    color: colors.white100,
    transformOrigin: 'left bottom',
  },
  tripMeta: {
    position: 'absolute',
    left: 16,
    right: 16,
    bottom: 24,
    gap: 4,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaIcon: {
    width: 16,
    height: 16,
  },
  metaText: {
    fontFamily: fonts.regular,
    fontSize: 14,
    letterSpacing: -0.56,
    color: colors.white200,
  },
  dot: {
    width: 4,
    height: 4,
  },
});
