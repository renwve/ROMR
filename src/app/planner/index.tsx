import { router } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import { icons } from '@/features/planner/assets';
import { PillButton } from '@/features/planner/components/Buttons';
import { SortTripMenu, type TripFilter } from '@/features/planner/components/SortTripMenu';
import { TripCard } from '@/features/planner/components/TripCard';
import { useHeaderHeights } from '@/features/planner/header';
import { useTrips } from '@/features/planner/TripsContext';

// Clears the floating nav bar (61pt tall, 40pt off the bottom) that sits over this screen.
const NAV_BAR_CLEARANCE = 40 + 61 + 10;

export default function PlannerScreen() {
  const { trips, createTrip } = useTrips();
  const headerHeights = useHeaderHeights();
  const [filter, setFilter] = useState<TripFilter>('All');
  const shown = filter === 'All' ? trips : trips.filter((trip) => trip.status === filter);

  const openTrip = (tripId: string) =>
    router.push({ pathname: '/planner/[tripId]', params: { tripId } });

  const newPlan = () => {
    const trip = createTrip();
    router.push({ pathname: '/planner/[tripId]/continue', params: { tripId: trip.id } });
  };

  return (
    <View style={[styles.screen, { paddingTop: headerHeights.list }]}>
      <View style={styles.toolbar}>
        <SortTripMenu value={filter} onChange={setFilter} />
        <PillButton icon={icons.plusWhite16} label="New Plan" onPress={newPlan} />
      </View>
      <ScrollView contentContainerStyle={styles.cards} showsVerticalScrollIndicator={false}>
        {shown.map((trip) => (
          <TripCard key={trip.id} trip={trip} onPress={() => openTrip(trip.id)} />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  toolbar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 16,
    paddingBottom: 24,
    paddingHorizontal: 16,
  },
  cards: {
    gap: 10,
    paddingHorizontal: 16,
    paddingBottom: NAV_BAR_CLEARANCE,
  },
});
