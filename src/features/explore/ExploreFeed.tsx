import { useEffect, useRef } from 'react';
import { StyleSheet, useWindowDimensions, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

import { NAV_CLEARANCE } from '@/components/NavBar';
import { RubberBandScrollView } from '@/components/RubberBandScrollView';
import { WhiteButton } from '@/components/WhiteButton';
import { SLIDE } from '@/constants/motion';
import type { ExploreContent } from './content';
import { DailyRecs } from './DailyRecs';
import { ExploreSkeleton } from './ExploreSkeleton';
import { PlaceSection } from './PlaceSection';

// Off-screen pages park this many screen widths away, out of sight and reach.
const PARKED = 3;

// Figma "Explore/Home - Travel" / "- Food": everything under the category
// tabs, scrolling up behind the nav bar. One stays mounted per category so it
// keeps its scroll position. When it becomes `active` it slides in from
// `enterFrom`; when it stops being active it's gone at once. Until `loaded`, it
// shows a pulsing skeleton (Figma "Explore/Home - Loading Skeleton") instead.
export function ExploreFeed({
  content,
  active,
  enterFrom,
  loaded,
}: {
  content: ExploreContent;
  active: boolean;
  enterFrom: 'left' | 'right' | null;
  loaded: boolean;
}) {
  const { width } = useWindowDimensions();
  // A page first shown by switching to it (so with a side to come from)
  // slides in like any other; the very first page is just there.
  const startsShown = active && enterFrom === null;
  const offset = useSharedValue(startsShown ? 0 : width * PARKED);
  const wasActive = useRef(startsShown);

  useEffect(() => {
    if (wasActive.current === active) return;
    wasActive.current = active;
    if (active) {
      offset.set(enterFrom === 'left' ? -width : width);
      offset.set(withTiming(0, SLIDE));
    } else {
      offset.set(width * PARKED);
    }
  }, [active, enterFrom, width, offset]);

  const slideStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: offset.get() }],
  }));

  return (
    <Animated.View
      pointerEvents={active ? 'auto' : 'none'}
      accessibilityElementsHidden={!active}
      importantForAccessibility={active ? 'auto' : 'no-hide-descendants'}
      style={[styles.page, slideStyle]}>
      {loaded ? (
        <RubberBandScrollView
          style={styles.scroll}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}>
          <DailyRecs recs={content.recs} />
          {content.sections.map((section) => (
            <PlaceSection
              key={section.title}
              title={section.title}
              subtitle={section.subtitle}
              action={section.refine ? <WhiteButton label="Refine" outlined /> : null}
            />
          ))}
          <View style={styles.footer}>
            <WhiteButton
              icon={require('@/assets/icons/plus.svg')}
              label="Share your own plans"
              outlined
            />
            <WhiteButton
              icon={require('@/assets/icons/faders-horizontal.svg')}
              label="Refine your preferences"
              outlined
            />
          </View>
        </RubberBandScrollView>
      ) : (
        <ExploreSkeleton />
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  // The pages stack in the same spot; only the active one is on screen.
  page: {
    ...StyleSheet.absoluteFill,
  },
  scroll: {
    flex: 1,
  },
  content: {
    // Scrolled to the end, the last button rests 24pt above the nav bar.
    paddingBottom: NAV_CLEARANCE + 24,
  },
  footer: {
    gap: 8,
    paddingHorizontal: 16,
  },
});
