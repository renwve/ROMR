// The user's trips on the Planner (Figma "Planner"). Placeholder data until
// there's a backend.

export const TRIP_FILTERS = ['All', 'Travel', 'Food', 'Hangout'] as const;
export type TripFilter = (typeof TRIP_FILTERS)[number];
export type TripCategory = Exclude<TripFilter, 'All'>;

// Figma's filter and badge icons: Rows, AirplaneInFlight, IceCream and
// AirTrafficControl.
export const TRIP_FILTER_ICONS: Record<TripFilter, number> = {
  All: require('@/assets/icons/rows.svg'),
  Travel: require('@/assets/icons/airplane-in-flight.svg'),
  Food: require('@/assets/icons/ice-cream.svg'),
  Hangout: require('@/assets/icons/air-traffic-control.svg'),
};

export type Trip = {
  id: string;
  title: string;
  dates: string;
  category: TripCategory;
  // Shown when the card is open. Without one, it shows a placeholder colour.
  photo?: number;
  // A trip that's under way ("Ongoing"): how long is left, how far through it
  // is (0–1), and Romie's note on the photo. Without it the trip hasn't started
  // yet ("Ready", "Not yet started").
  ongoing?: { left: string; progress: number; note: string };
};

export const TRIPS: Trip[] = [
  {
    id: 'japan-taiwan',
    title: 'Japan/Taiwan 3 Week Vacay',
    dates: 'Dec 25 - Jan 3',
    category: 'Travel',
    // Figma's placeholder photo.
    photo: require('@/assets/images/planner/japan-taiwan.webp'),
    ongoing: { left: '20 d left', progress: 1 / 3, note: 'You have nothing for the next 4hr' },
  },
  {
    id: 'doomsday-movie-night',
    title: 'Doomsday movie night',
    dates: 'Dec 18',
    category: 'Hangout',
    // The Cineplex daily rec's photo stands in until the trip has its own.
    photo: require('@/assets/images/daily-rec-pages/cineplex.webp'),
  },
  {
    id: 'germany',
    title: 'Germany trip w friends',
    dates: 'Feb 12 - March12',
    category: 'Travel',
  },
];
