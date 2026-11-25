import { createContext, useContext, useState, type ReactNode } from 'react';

import { createBlankTrip, initialTrips, type Trip } from './trips';

type TripsContextValue = {
  trips: Trip[];
  createTrip: () => Trip;
  addMessage: (tripId: string, text: string) => void;
};

const TripsContext = createContext<TripsContextValue | null>(null);

export function TripsProvider({ children }: { children: ReactNode }) {
  const [trips, setTrips] = useState(initialTrips);

  const createTrip = () => {
    const trip = createBlankTrip();
    setTrips((prev) => [trip, ...prev]);
    return trip;
  };

  const addMessage = (tripId: string, text: string) => {
    setTrips((prev) =>
      prev.map((trip) =>
        trip.id === tripId
          ? { ...trip, messages: [...trip.messages, { id: `m${Date.now()}`, text }] }
          : trip,
      ),
    );
  };

  return (
    <TripsContext.Provider value={{ trips, createTrip, addMessage }}>
      {children}
    </TripsContext.Provider>
  );
}

export function useTrips() {
  const value = useContext(TripsContext);
  if (!value) throw new Error('useTrips must be used inside TripsProvider');
  return value;
}

export function useTrip(tripId: string | undefined) {
  return useTrips().trips.find((trip) => trip.id === tripId);
}
