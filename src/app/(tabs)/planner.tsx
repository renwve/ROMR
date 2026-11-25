import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { CategoryTabs } from '@/components/CategoryTabs';
import { DismissKeyboard } from '@/components/DismissKeyboard';
import { NAV_CLEARANCE } from '@/components/NavBar';
import { NewPlanHeader, PlannerHeader, StatusBarSpace } from '@/components/PageHeader';
import { RubberBandScrollView } from '@/components/RubberBandScrollView';
import { Chat } from '@/features/new-plan/Chat';
import { useNewPlan } from '@/features/new-plan/NewPlanContext';
import { TripCard } from '@/features/planner/TripCard';
import { TripFilters } from '@/features/planner/TripFilters';
import { TRIPS, type TripFilter } from '@/features/planner/trips';

// Figma component set "Trips Nav", which works like a daily rec's Plan Nav.
const TRIP_TABS = ['Home', 'Drafts', 'Completed'] as const;
type TripTab = (typeof TRIP_TABS)[number];
const TRIP_TAB_ICONS: Record<TripTab, number> = {
  Home: require('@/assets/icons/house.svg'),
  Drafts: require('@/assets/icons/file-dashed.svg'),
  Completed: require('@/assets/icons/check-20.svg'),
};

// Figma "Planner": the user's trips, which the tabs and filters narrow down.
// Only Home has trips so far. The first trip starts open, as in Figma. During
// a New Plan (the header's plus, or the nav bar's trip input) the page shows
// the New Plan header and chat instead.
export default function PlannerScreen() {
  const { active, messages } = useNewPlan();
  const [tab, setTab] = useState<TripTab>('Home');
  const [filter, setFilter] = useState<TripFilter>('All');
  const [openIds, setOpenIds] = useState<string[]>([TRIPS[0].id]);

  const trips =
    tab === 'Home' ? TRIPS.filter((trip) => filter === 'All' || trip.category === filter) : [];
  const toggle = (id: string) =>
    setOpenIds((ids) => (ids.includes(id) ? ids.filter((open) => open !== id) : [...ids, id]));

  return (
    <DismissKeyboard>
      <StatusBarSpace />
      {active ? (
        <>
          <NewPlanHeader />
          <Chat messages={messages} />
        </>
      ) : (
        <View style={styles.page}>
          <PlannerHeader />
          <CategoryTabs options={TRIP_TABS} value={tab} onChange={setTab} icons={TRIP_TAB_ICONS} />
          <TripFilters value={filter} onChange={setFilter} />
          <RubberBandScrollView
            style={styles.page}
            contentContainerStyle={styles.trips}
            showsVerticalScrollIndicator={false}>
            {/* RubberBandScrollView wraps its children in a view of its own, so
                the gap goes on this list rather than contentContainerStyle. */}
            <View style={styles.list}>
              {trips.map((trip) => (
                <TripCard
                  key={trip.id}
                  trip={trip}
                  open={openIds.includes(trip.id)}
                  onToggle={() => toggle(trip.id)}
                />
              ))}
            </View>
          </RubberBandScrollView>
        </View>
      )}
    </DismissKeyboard>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
  },
  list: {
    gap: 16,
  },
  trips: {
    padding: 16,
    // 16pt under the filters plus 16pt of the filters' own (see TripFilters),
    // kept inside the scroll area so the first card's shadow isn't clipped.
    paddingTop: 32,
    // Scrolled to the end, the last trip rests 24pt above the nav bar.
    paddingBottom: NAV_CLEARANCE + 24,
  },
});
