import { Tabs } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import { NavBar } from '@/components/NavBar';
import { colors } from '@/constants/theme';
import { NewPlanProvider } from '@/features/new-plan/NewPlanContext';

export default function TabLayout() {
  return (
    <NewPlanProvider>
      <StatusBar style="dark" />
      <Tabs
        tabBar={(props) => <NavBar {...props} />}
        screenOptions={{
          headerShown: false,
          sceneStyle: { backgroundColor: colors.white100 },
        }}>
        <Tabs.Screen name="index" />
        <Tabs.Screen name="planner" />
        <Tabs.Screen name="saved" />
        <Tabs.Screen name="account" />
      </Tabs>
    </NewPlanProvider>
  );
}
