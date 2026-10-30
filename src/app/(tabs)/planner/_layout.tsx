import { Stack, usePathname } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { colors } from '@/constants/theme';
import { PlannerHeader, type HeaderMode } from '@/features/planner/components/PlannerHeader';
import { HeaderCollapseProvider } from '@/features/planner/header';
import { PlannerOverlayHost } from '@/features/planner/PlannerOverlay';
import { TripsProvider, useTrip } from '@/features/planner/TripsContext';

export default function PlannerLayout() {
  return (
    <TripsProvider>
      <HeaderCollapseProvider>
        <PlannerOverlayHost>
          <PlannerShell />
        </PlannerOverlayHost>
      </HeaderCollapseProvider>
    </TripsProvider>
  );
}

// The app header lives here, floating over the stack, so it can grow and
// cross-fade between screens while the screen bodies fade underneath it.
// Floating rather than stacked above means resizing it never re-lays out a screen.
function PlannerShell() {
  // "/planner", "/planner/<tripId>" or "/planner/<tripId>/continue"
  const [, , tripId, subpage] = usePathname().split('/');
  const mode: HeaderMode = !tripId ? 'list' : subpage === 'continue' ? 'continue' : 'trip';

  // Keep the last trip on show while the header fades back to the list.
  const [lastTripId, setLastTripId] = useState(tripId);
  if (tripId && tripId !== lastTripId) setLastTripId(tripId);
  const trip = useTrip(tripId ?? lastTripId);

  return (
    <View style={styles.root}>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerShown: false,
          animation: 'fade',
          contentStyle: { backgroundColor: colors.white200 },
        }}
      />
      <PlannerHeader mode={mode} trip={trip} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.white200,
  },
});
