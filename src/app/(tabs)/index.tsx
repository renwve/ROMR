import { useEffect, useRef, useState } from 'react';
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

// How long after a category is first opened its page is built: about as long
// as the tabs take to move, so building it doesn't hold them up.
const PAGE_BUILD_DELAY_MS = 350;

// Figma "Explore/Home"; during a New Plan, Figma "New Plan" and "New Plan - Chatting".
export default function ExploreScreen() {
  const { active, messages } = useNewPlan();
  const [category, setCategory] = useState<Category>('Travel');
  // Which side the current category's page slides in from: the side its tab
  // is on, relative to the last one. None on first show.
  const [enterFrom, setEnterFrom] = useState<'left' | 'right' | null>(null);
  // Categories opened so far. A page is only built the first time it's opened,
  // then kept, so launching the app builds one page rather than all of them.
  const [opened, setOpened] = useState<Category[]>(['Travel']);
  // Opened categories whose page is built. A newly opened one shows a skeleton
  // first and is built a moment later, so the tabs' own animation runs
  // straight away instead of waiting on the page.
  const [loaded, setLoaded] = useState<Category[]>(['Travel']);
  const loadTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => () => clearTimeout(loadTimer.current), []);

  const changeCategory = (next: Category) => {
    if (next === category) return;
    setEnterFrom(CATEGORIES.indexOf(next) > CATEGORIES.indexOf(category) ? 'right' : 'left');
    setCategory(next);
    if (!opened.includes(next)) {
      setOpened([...opened, next]);
      loadTimer.current = setTimeout(
        () => setLoaded((done) => (done.includes(next) ? done : [...done, next])),
        PAGE_BUILD_DELAY_MS,
      );
    }
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
            {CATEGORIES.filter((option) => opened.includes(option)).map((option) => (
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
