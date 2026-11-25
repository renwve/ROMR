// The choices on Figma "Travel Pref" and "Traveller Type" (Onboarding - Refinement).

export const TRAVEL_SCOPES = [
  {
    title: 'Local',
    subtitle: 'Explore the places around you',
    icon: require('@/assets/icons/coffee.svg'),
  },
  {
    title: 'Domestic',
    subtitle: 'Discover more of your country',
    icon: require('@/assets/icons/mountains.svg'),
  },
  {
    title: 'International',
    subtitle: 'Travel beyond your borders',
    icon: require('@/assets/icons/airplane-tilt.svg'),
  },
] as const;

export const TRAVELLER_TYPES = [
  {
    title: 'Frequent Traveler',
    subtitle: 'Always planning your next trip',
    icon: require('@/assets/icons/airplane-tilt.svg'),
  },
  {
    title: 'Local Discovery Demon',
    subtitle: 'Finding hidden gems everywhere',
    icon: require('@/assets/icons/person-simple-run.svg'),
  },
  {
    title: 'Sight Seer',
    subtitle: 'Landmarks and beautiful views',
    icon: require('@/assets/icons/mountains.svg'),
  },
  {
    title: 'Experience Seeker',
    subtitle: 'Adrenaline filled adventures',
    icon: require('@/assets/icons/pulse.svg'),
  },
  {
    title: 'Food Lover',
    subtitle: 'Restaurants and local cuisine',
    icon: require('@/assets/icons/ice-cream-24.svg'),
  },
  {
    title: 'Entertainment Driven',
    subtitle: 'Concerts, and music festivals',
    icon: require('@/assets/icons/music-notes-simple.svg'),
  },
] as const;

export type TravelScope = (typeof TRAVEL_SCOPES)[number]['title'];
export type TravellerType = (typeof TRAVELLER_TYPES)[number]['title'];

// Most destinations the traveller can pick ("0/5").
export const MAX_DESTINATIONS = 5;
