import React from 'react';
import { Tabs } from 'expo-router';
import Navbar from '../../../components/navbar';

export default function TabLayout() {
  return (
    <Tabs
      tabBar={() => <Navbar />}
      screenOptions={{
        headerShown: false,
        sceneStyle: {
          backgroundColor: '#E7E7F1',
        },
      }}
    >
      <Tabs.Screen name="index" />
      <Tabs.Screen name="planner" />
      <Tabs.Screen name="saved" />
      <Tabs.Screen name="account" />
    </Tabs>
  );
}