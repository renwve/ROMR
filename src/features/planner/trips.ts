import type { ImageSource } from 'expo-image';
import type { DimensionValue } from 'react-native';

import { icons, photos } from './assets';

export type TripStatus = 'Ready' | 'Planning' | 'Finished' | 'Cancelled';

export const TRIP_STATUSES: TripStatus[] = ['Ready', 'Planning', 'Finished', 'Cancelled'];

export type ItineraryStop =
  | { id: string; kind: 'photo'; image: ImageSource }
  | { id: string; kind: 'icon'; icon: ImageSource };

export type ChatMessage = { id: string; text: string };

export type Trip = {
  id: string;
  name: string;
  city: string;
  when: string;
  status: TripStatus;
  image?: ImageSource;
  // Figma places some card photos at full width and a set offset instead of
  // using object-fit: cover. `aspectRatio` is the photo's own width / height.
  cardImageCrop?: { top: DimensionValue; aspectRatio: number };
  location: string;
  date: string;
  itineraryUpdated: string;
  itinerary: ItineraryStop[];
  stats: { othersGoing: string; budget: string; thingsToDo: string };
  tips: { title: string; items: string[] }[];
  messages: ChatMessage[];
};

export const initialTrips: Trip[] = [
  {
    id: 'japan-trip',
    name: 'Japan Trip w/ friends',
    city: 'Tokyo',
    when: 'In 1 week',
    status: 'Ready',
    image: photos.tokyo,
    location: 'Japan, Tokyo',
    date: 'Nov 3, 2026',
    itineraryUpdated: 'Updated 2 weeks ago',
    itinerary: [
      { id: 'flight', kind: 'photo', image: photos.calgary },
      { id: 'hotel', kind: 'icon', icon: icons.building },
      { id: 'skydive', kind: 'photo', image: photos.itinerary3 },
      { id: 'cafe', kind: 'photo', image: photos.itinerary4 },
      { id: 'city', kind: 'photo', image: photos.tokyo },
    ],
    stats: { othersGoing: '6', budget: '2.2K', thingsToDo: '9+' },
    tips: [
      {
        title: 'Little travel tips',
        items: [
          'Get a Suica or Pasmo card',
          'Carry some cash',
          'Avoid rush hour on trains (Roughly 7:30-9:30 AM and 5-7PM)',
        ],
      },
      {
        title: 'Local customs & etiquette',
        items: ['Keep it quiet on public transit', 'Don’t tip', 'Mind your manners when eating'],
      },
    ],
    messages: [{ id: 'm1', text: 'Where should we go after we land at the airport?' }],
  },
  {
    id: 'solo-hiking',
    name: 'Solo Hiking',
    city: 'Banff',
    when: 'Sept 8-10',
    status: 'Planning',
    image: photos.banff,
    location: 'Canada, Banff',
    date: 'Sept 8, 2026',
    itineraryUpdated: 'Updated 3 days ago',
    itinerary: [
      { id: 'town', kind: 'photo', image: photos.banff },
      { id: 'lodge', kind: 'icon', icon: icons.building },
    ],
    stats: { othersGoing: '0', budget: '800', thingsToDo: '4' },
    tips: [{ title: 'Little travel tips', items: ['Pack layers', 'Buy a park pass'] }],
    messages: [],
  },
  {
    id: 'fifa-world-cup',
    name: 'FIFA World Cup',
    city: 'New Jersey',
    when: 'July 19',
    status: 'Finished',
    image: photos.fifa,
    cardImageCrop: { top: '-97.93%', aspectRatio: 4096 / 2305 },
    location: 'USA, New Jersey',
    date: 'July 19, 2026',
    itineraryUpdated: 'Updated 3 months ago',
    itinerary: [
      { id: 'stadium', kind: 'photo', image: photos.fifa },
      { id: 'hotel', kind: 'icon', icon: icons.building },
    ],
    stats: { othersGoing: '3', budget: '1.5K', thingsToDo: '5' },
    tips: [{ title: 'Little travel tips', items: ['Arrive at the stadium early'] }],
    messages: [],
  },
  {
    id: 'going-to-work',
    name: 'Going to work',
    city: 'Calgary',
    when: 'Tomorrow',
    status: 'Cancelled',
    image: photos.calgary,
    location: 'Canada, Calgary',
    date: 'Oct 29, 2026',
    itineraryUpdated: 'Updated yesterday',
    itinerary: [{ id: 'office', kind: 'icon', icon: icons.building }],
    stats: { othersGoing: '0', budget: '200', thingsToDo: '1' },
    tips: [],
    messages: [],
  },
];

export function createBlankTrip(): Trip {
  return {
    id: `trip-${Date.now()}`,
    name: 'New Trip',
    city: 'Anywhere',
    when: 'Not set',
    status: 'Planning',
    location: 'Anywhere',
    date: 'Not set',
    itineraryUpdated: 'Updated just now',
    itinerary: [],
    stats: { othersGoing: '0', budget: '0', thingsToDo: '0' },
    tips: [],
    messages: [],
  };
}
