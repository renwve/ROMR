import { createContext, type ReactNode, useContext, useState } from 'react';

import type { TravelScope, TravellerType } from './options';

// What onboarding learns about the traveller (from the banana branch's
// onboardingContext). There's no backend or sign-in yet, so it lives in memory:
// every launch starts at Get Started again.

export type Destination = { id: string; name: string };
// 'skipped' is Maybe later; 'denied' is a no on the system prompt.
export type LocationStatus = 'granted' | 'denied' | 'skipped' | null;

export type OnboardingData = {
  destinations: Destination[];
  travelScope: TravelScope[];
  location: LocationStatus;
  latitude: number | null;
  longitude: number | null;
  travellerTypes: TravellerType[];
};

const INITIAL_DATA: OnboardingData = {
  destinations: [],
  travelScope: [],
  location: null,
  latitude: null,
  longitude: null,
  travellerTypes: [],
};

type OnboardingContextValue = {
  data: OnboardingData;
  update: (changes: Partial<OnboardingData>) => void;
  // Whether the traveller has finished onboarding (or logged in): the app's
  // tabs are only reachable once it's true.
  done: boolean;
  finish: () => void;
  // Account's Restart Onboarding: clears the answers and goes back to Get Started.
  restart: () => void;
};

const OnboardingContext = createContext<OnboardingContextValue | null>(null);

export function OnboardingProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState(INITIAL_DATA);
  const [done, setDone] = useState(false);

  const value: OnboardingContextValue = {
    data,
    update: (changes) => setData((current) => ({ ...current, ...changes })),
    done,
    finish: () => setDone(true),
    restart: () => {
      setData(INITIAL_DATA);
      setDone(false);
    },
  };

  return <OnboardingContext.Provider value={value}>{children}</OnboardingContext.Provider>;
}

export function useOnboarding() {
  const context = useContext(OnboardingContext);
  if (!context) throw new Error('useOnboarding needs an OnboardingProvider');
  return context;
}
