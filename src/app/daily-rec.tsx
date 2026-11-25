import { Image } from 'expo-image';
import { type NativeStackNavigationProp, useLocalSearchParams, useNavigation } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, {
  useAnimatedReaction,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { scheduleOnRN } from 'react-native-worklets';

import { CategoryTabs } from '@/components/CategoryTabs';
import { DailyRecHeader, StatusBarSpace } from '@/components/PageHeader';
import { SaveButton } from '@/components/SaveButton';
import { WhiteButton } from '@/components/WhiteButton';
import { colors, fonts } from '@/constants/theme';
import { findRecByPageId } from '@/features/explore/content';
import { Roverview } from '@/features/explore/Roverview';

// The floating Start Planning / save row: 24pt off the bottom, 11pt in from the
// sides (380 wide on Figma's 402pt screen).
const BAR_BOTTOM = 24;
const BAR_SIDE = 11;
const BAR_HEIGHT = 44;
// Figma component set "Plan Nav": the rec's tabs, which behave like Explore's
// top nav (the underline slides, the selected tab's icon pops up).
const PLAN_TABS = ['Highlights', 'Reviews', 'Guide'] as const;
type PlanTab = (typeof PLAN_TABS)[number];
const PLAN_TAB_ICONS: Record<PlanTab, number> = {
  Highlights: require('@/assets/icons/sun-horizon.svg'),
  Reviews: require('@/assets/icons/star.svg'),
  Guide: require('@/assets/icons/binoculars.svg'),
};
// Plan Nav's height: 36pt tabs and the 2pt underline.
const PLAN_NAV_HEIGHT = 38;
// Longest the page waits to hear its slide-in has finished.
const OPEN_FALLBACK_MS = 600;

// Figma "Explore/Home - Daily Recs": a daily rec's own page, opened by tapping
// its card. The photo, its name, Romie's overview, and the Highlights /
// Reviews / Guide tabs, with Start Planning and save floating at the bottom.
export default function DailyRecScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const rec = findRecByPageId(id);
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NativeStackNavigationProp<Record<string, object | undefined>>>();
  // The Roverview's glow plays once the page has slid fully in, so the slide
  // doesn't hold it up.
  const [opened, setOpened] = useState(false);
  const [tab, setTab] = useState<PlanTab>('Highlights');
  // The scroll view's visible height.
  const [viewHeight, setViewHeight] = useState(0);
  // How far the page is scrolled, and where Plan Nav sits in it.
  const scrollY = useSharedValue(0);
  const planNavTop = useSharedValue(Number.MAX_SAFE_INTEGER);
  // Whether Plan Nav has reached the header and is pinned there.
  const [pinned, setPinned] = useState(false);

  const onScroll = useAnimatedScrollHandler((event) => {
    scrollY.set(event.contentOffset.y);
  });
  useAnimatedReaction(
    () => scrollY.get() >= planNavTop.get(),
    (reached, before) => {
      if (reached !== before) scheduleOnRN(setPinned, reached);
    },
  );
  // Shown on the very frame Plan Nav reaches the header, so the swap can't be seen.
  const pinnedStyle = useAnimatedStyle(() => ({
    opacity: scrollY.get() >= planNavTop.get() ? 1 : 0,
  }));

  useEffect(() => {
    const unsubscribe = navigation.addListener('transitionEnd', (event) => {
      if (!event.data.closing) setOpened(true);
    });
    // In case the slide's end isn't reported (the web has no slide).
    const fallback = setTimeout(() => setOpened(true), OPEN_FALLBACK_MS);
    return () => {
      unsubscribe();
      clearTimeout(fallback);
    };
  }, [navigation]);

  if (!rec?.page) return null;
  const barBottom = Math.max(BAR_BOTTOM, insets.bottom);

  return (
    <View style={styles.page}>
      <StatusBar style="dark" />
      <StatusBarSpace />
      <DailyRecHeader />
      <View style={styles.page}>
        <Animated.ScrollView
          onScroll={onScroll}
          onLayout={(event) => setViewHeight(event.nativeEvent.layout.height)}
          contentContainerStyle={{ paddingBottom: barBottom + BAR_HEIGHT + 24 }}
          showsVerticalScrollIndicator={false}>
          <View style={styles.hero}>
            <Image source={rec.page.hero} style={StyleSheet.absoluteFill} contentFit="cover" />
            {/* Figma's photo counter. */}
            <View style={styles.counter}>
              <Image source={require('@/assets/icons/image-14.svg')} style={styles.counterIcon} />
              <Text style={styles.counterText}>1/1</Text>
            </View>
          </View>
          <View style={styles.about}>
            <View>
              <Text style={styles.title}>{rec.title}</Text>
              <Text style={styles.detail}>{rec.detail}</Text>
            </View>
            <Roverview page={rec.page} play={opened} />
          </View>
          <View onLayout={(event) => planNavTop.set(event.nativeEvent.layout.y)}>
            <CategoryTabs
              options={PLAN_TABS}
              value={tab}
              onChange={setTab}
              icons={PLAN_TAB_ICONS}
            />
          </View>
          {/* The selected tab's content (none yet). At least a screen tall, so
            Plan Nav can always be scrolled up to the header. */}
          <View style={{ minHeight: viewHeight - PLAN_NAV_HEIGHT }} />
        </Animated.ScrollView>
        {/* Plan Nav sticks under the header once it's scrolled up to it. This
            copy is pinned there and shown in its place, rather than using the
            scroll view's sticky headers: on Android those jumped on a fast
            scroll, and their taps stopped switching tabs. */}
        <Animated.View
          style={[styles.pinned, pinnedStyle]}
          pointerEvents={pinned ? 'auto' : 'none'}>
          <CategoryTabs options={PLAN_TABS} value={tab} onChange={setTab} icons={PLAN_TAB_ICONS} />
        </Animated.View>
      </View>
      <View style={[styles.bar, { bottom: barBottom }]}>
        <WhiteButton
          shape="rounded"
          shadow="mediumSoft"
          icon={require('@/assets/icons/star-four.svg')}
          label="Start Planning"
          style={styles.planButton}
        />
        <SaveButton shadow="mediumSoft" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: colors.white100,
  },
  hero: {
    height: 200,
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
    padding: 12,
    borderRadius: 24,
    overflow: 'hidden',
  },
  counter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 6,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: colors.white100,
  },
  counterIcon: {
    width: 14,
    height: 14,
  },
  // Figma sets this in Inter; the app's font stands in.
  counterText: {
    fontFamily: fonts.regular,
    fontSize: 12,
    lineHeight: 15,
    includeFontPadding: false,
    color: colors.gray700,
  },
  about: {
    gap: 24,
    paddingTop: 12,
    paddingBottom: 24,
    paddingHorizontal: 16,
  },
  title: {
    fontFamily: fonts.bold,
    fontSize: 32,
    lineHeight: 40,
    letterSpacing: -1.6,
    color: colors.dark800,
  },
  detail: {
    fontFamily: fonts.regular,
    fontSize: 16,
    lineHeight: 20,
    letterSpacing: -0.8,
    color: colors.gray700,
  },
  // The copy pinned under the header is white, so the page doesn't show through
  // it. The one in the page is see-through, so the Roverview's glow isn't cut
  // off where it spreads down behind it.
  pinned: {
    backgroundColor: colors.white100,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
  },
  bar: {
    position: 'absolute',
    left: BAR_SIDE,
    right: BAR_SIDE,
    flexDirection: 'row',
    gap: 10,
  },
  planButton: {
    flex: 1,
  },
});
