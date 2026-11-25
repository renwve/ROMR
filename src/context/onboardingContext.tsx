import React, { createContext, useContext, useState } from "react";

export type Destination = { id: string; name: string; description: string };
export type TravelScope = "Local" | "Domestic" | "International";
export type TravellerType =
  | "Frequent Traveller"
  | "Local Discovery Demon"
  | "Sight Seer"
  | "Experience Seeker"
  | "Food Lover"
  | "Entertainment Driven";

type OnboardingData = {
  destinations: Destination[];
  travelScope: TravelScope[];
  locationPermission: "granted" | "denied" | "skipped" | null;
  latitude: number | null;
  longitude: number | null;
  travellerTypes: TravellerType[];
};

type OnboardingContextType = {
  data: OnboardingData;
  setDestinations: (value: Destination[]) => void;
  setTravelScope: (value: TravelScope[]) => void;
  setLocation: (status: "granted" | "denied" | "skipped", latitude?: number, longitude?: number) => void;
  setTravellerTypes: (value: TravellerType[]) => void;
  resetOnboarding: () => void;
};

const initialData: OnboardingData = {
  destinations: [], travelScope: [], locationPermission: null,
  latitude: null, longitude: null, travellerTypes: [],
};

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined);

export function OnboardingProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<OnboardingData>(initialData);
  const setDestinations = (value: Destination[]) => setData((prev) => ({ ...prev, destinations: value }));
  const setTravelScope = (value: TravelScope[]) => setData((prev) => ({ ...prev, travelScope: value }));
  const setLocation = (status: "granted" | "denied" | "skipped", latitude?: number, longitude?: number) =>
    setData((prev) => ({ ...prev, locationPermission: status, latitude: latitude ?? null, longitude: longitude ?? null }));
  const setTravellerTypes = (value: TravellerType[]) => setData((prev) => ({ ...prev, travellerTypes: value }));
  const resetOnboarding = () => setData(initialData);

  return (
    <OnboardingContext.Provider value={{ data, setDestinations, setTravelScope, setLocation, setTravellerTypes, resetOnboarding }}>
      {children}
    </OnboardingContext.Provider>
  );
}

export function useOnboarding() {
  const context = useContext(OnboardingContext);
  if (!context) throw new Error("useOnboarding must be used inside OnboardingProvider");
  return context;
}
