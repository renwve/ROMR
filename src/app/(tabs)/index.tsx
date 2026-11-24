import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { CategoryTabs } from '@/components/CategoryTabs';
import { DismissKeyboard } from '@/components/DismissKeyboard';
import { HomeHeader, NewPlanHeader, StatusBarSpace } from '@/components/PageHeader';
import { colors } from '@/constants/theme';
import { CATEGORIES, type Category, EXPLORE_CONTENT } from '@/features/explore/content';
import { ExploreFeed } from '@/features/explore/ExploreFeed';
import { Chat } from '@/features/new-plan/Chat';
import { useNewPlan } from '@/features/new-plan/NewPlanContext';

const CATEGORY_ICONS: Record<Category, number> = {
  Travel: require('@/assets/icons/airplane-in-flight.svg'),
  Food: require('@/assets/icons/ice-cream.svg'),
  'Hang Out': require('@/assets/icons/air-traffic-control.svg'),
};

// The pages after the first are built while the launch splash is still up
// (it holds for 1.4s before zooming), one at a time so the splash keeps moving
// smoothly: each this long after the one before.
const PAGE_BUILD_STAGGER_MS = 300;

// Figma "Explore/Home"; during a New Plan, Figma "New Plan" and "New Plan - Chatting".
export default function ExploreScreen() {
  const { active, messages } = useNewPlan();
  const [category, setCategory] = useState<Category>('Travel');
  // Which side the current category's page slides in from: the side its tab
  // is on, relative to the last one. None on first show.
  const [enterFrom, setEnterFrom] = useState<'left' | 'right' | null>(null);
  // Categories whose page is built. Travel's is built straight away; the rest
  // follow during the launch splash, so switching to them is instant. (One
  // opened before it's built shows the loading skeleton until it is.)
  const [loaded, setLoaded] = useState<Category[]>([CATEGORIES[0]]);

  useEffect(() => {
    const timers = CATEGORIES.slice(1).map((option, index) =>
      setTimeout(
        () => setLoaded((done) => (done.includes(option) ? done : [...done, option])),
        PAGE_BUILD_STAGGER_MS * (index + 1),
      ),
    );
    return () => timers.forEach(clearTimeout);
  }, []);

  const changeCategory = (next: Category) => {
    if (next === category) return;
    setEnterFrom(CATEGORIES.indexOf(next) > CATEGORIES.indexOf(category) ? 'right' : 'left');
    setCategory(next);
  };

  return (
    <DismissKeyboard>
      <StatusBarSpace />
      <View style={styles.fill}>
        {/* Explore stays built underneath a New Plan, so starting or closing one
            doesn't tear down and rebuild every page (which held up the input
            bar's ride on the keyboard), and the pages keep their places. */}
        <View
          style={styles.fill}
          pointerEvents={active ? 'none' : 'auto'}
          accessibilityElementsHidden={active}
          importantForAccessibility={active ? 'no-hide-descendants' : 'auto'}>
          <HomeHeader />
          <CategoryTabs
            options={CATEGORIES}
            value={category}
            onChange={changeCategory}
            icons={CATEGORY_ICONS}
          />
          {/* Every category keeps its own page, so each remembers where it was
              scrolled; only the selected one is on screen. */}
          <View style={styles.fill}>
            {CATEGORIES.map((option) => (
              <ExploreFeed
                key={option}
                content={EXPLORE_CONTENT[option]}
                active={option === category}
                enterFrom={enterFrom}
                loaded={loaded.includes(option)}
              />
            ))}
          </View>
        </View>
        {active ? (
          <View style={styles.newPlan}>
            <NewPlanHeader />
            <Chat messages={messages} />
          </View>
        ) : null}
      </View>
    </DismissKeyboard>
  );
}

const styles = StyleSheet.create({
  fill: {
    flex: 1,
  },
  // Covers Explore while a New Plan is open.
  newPlan: {
    ...StyleSheet.absoluteFill,
    backgroundColor: colors.white100,
  },
});
