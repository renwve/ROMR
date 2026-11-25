// What Explore shows under each top-nav category. Placeholder copy from the
// Figma frames until there's a backend.

// Placeholder until there's a backend and enough users to measure it.
const SEEN_BY_PERCENT = 19.3;

export type DailyRec = {
  title: string;
  detail: string;
  action: string;
  // The card's photo, with Figma's darkening gradient already baked in. Without
  // one, the card shows a placeholder colour.
  image?: number;
  // The rec's own page (Figma "Explore/Home - Daily Recs"), opened by tapping
  // its card. Only the Travel recs have one so far.
  page?: DailyRecPage;
};

export type DailyRecPage = {
  // Used in the page's route, /daily-rec?id=…
  id: string;
  // The 402 × 200 photo at the top, darkening gradient baked in.
  hero: number;
  // Romie's "Why this is for you" blurb, written for a traveller in Calgary
  // (placeholder copy until there's a backend).
  why: string;
  bestTime: string;
  // From Calgary.
  flightTime: string;
  // Replaces "Est. Flight time" where it's a drive (Banff).
  travelLabel?: string;
  stay: string;
};

export type ExploreSection = {
  title: string;
  subtitle: string;
  // Shows the Refine button beside the heading.
  refine?: boolean;
};

export type ExploreContent = {
  // Today's recs, one card each.
  recs: DailyRec[];
  sections: ExploreSection[];
};

// The same rec on every card, until a category has its own five.
const fiveOf = (rec: DailyRec) => Array.from({ length: 5 }, () => rec);

// Figma "Explore/Home - Example Cards"; the recs are Figma "Daily Recs Examples - Travel".
// Its photos are 900 × 1200 WebP: the 300 × 400 card at 3×, sharp on any
// current phone, and scaled down on lower-density screens.
const TRAVEL: ExploreContent = {
  recs: [
    {
      title: 'Oia, Greece',
      detail: 'Village on Santorini',
      action: 'Start Planning',
      image: require('@/assets/images/daily-recs/oia.webp'),
      page: {
        id: 'oia',
        // 1206 × 600 WebP: the 402 × 200 photo at 3×.
        hero: require('@/assets/images/daily-rec-pages/oia-hero.webp'),
        why: "Trade Alberta's winter grey for golden-hour views over the Aegean. Romantic, quiet and made for slow evenings.",
        bestTime: 'May-Oct',
        flightTime: '16-20 hrs',
        stay: '2-3 days',
      },
    },
    {
      title: 'Banff, Canada',
      detail: 'Turquoise lakes in the Canadian Rockies',
      action: 'Start Planning',
      image: require('@/assets/images/daily-recs/banff.webp'),
      page: {
        id: 'banff',
        hero: require('@/assets/images/daily-rec-pages/banff.webp'),
        why: 'Just 90 minutes down the Trans-Canada from Calgary. Swap the city for glacier-fed lakes and mountain air, no airport needed.',
        bestTime: 'Jun-Sep',
        flightTime: '1.5 hrs',
        travelLabel: 'Est. Drive time',
        stay: '2-3 days',
      },
    },
    {
      title: 'Singapore',
      detail: 'Modern city with lush gardens and iconic skylines',
      action: 'Start Planning',
      image: require('@/assets/images/daily-recs/singapore.webp'),
      page: {
        id: 'singapore',
        hero: require('@/assets/images/daily-rec-pages/singapore.webp'),
        why: "Leave Calgary's chinook whiplash for steady 30° evenings. Hawker stalls, garden domes and a skyline made for night walks.",
        bestTime: 'Feb-Apr',
        flightTime: '20-24 hrs',
        stay: '3-4 days',
      },
    },
    {
      title: 'Cappadoica, Türkiye',
      detail: 'Scenic valleys and iconic hot air balloons',
      action: 'Start Planning',
      image: require('@/assets/images/daily-recs/cappadocia.webp'),
      page: {
        id: 'cappadocia',
        hero: require('@/assets/images/daily-rec-pages/cappadocia.webp'),
        why: 'Trade big prairie skies for ones filled with hot air balloons at sunrise. Cave hotels and quiet valleys made for early mornings.',
        bestTime: 'Apr-Oct',
        flightTime: '16-20 hrs',
        stay: '2-3 days',
      },
    },
    {
      title: 'Cape Town, South Africa',
      detail: 'Coastal city beneath Table Mountain',
      action: 'Start Planning',
      image: require('@/assets/images/daily-recs/cape-town.webp'),
      page: {
        id: 'cape-town',
        hero: require('@/assets/images/daily-rec-pages/cape-town.webp'),
        why: "When Calgary's in deep freeze, it's summer in Cape Town. Beaches, wine country and Table Mountain hikes in one trip.",
        bestTime: 'Nov-Mar',
        flightTime: '24-30 hrs',
        stay: '5-7 days',
      },
    },
  ],
  sections: [
    {
      title: 'Newly Discovered',
      subtitle: `Only ${SEEN_BY_PERCENT}% of users have seen this`,
      refine: true,
    },
    { title: 'Near You', subtitle: 'We found 5 things you can do right now' },
    { title: 'Community Submissions', subtitle: 'What others are doing' },
    { title: 'Best Offers', subtitle: 'Spend less, experience more' },
    { title: 'Memorable Getaways', subtitle: 'Adventures you simply can’t miss' },
  ],
};

// Figma "Explore/Home - Food".
const FOOD: ExploreContent = {
  recs: fiveOf({
    title: 'Seniore’s Pizza',
    detail:
      'Counter-serve pizzeria offering specialty pies, wings & wraps in a snug space with late-night hours',
    action: 'Look at their menu',
  }),
  sections: [
    {
      title: 'Just Opened',
      subtitle: `Only ${SEEN_BY_PERCENT}% of users have seen this`,
      refine: true,
    },
    { title: 'Near You', subtitle: 'We found 5 places you can order from right now' },
    { title: 'Community Submissions', subtitle: 'What others are doing' },
    { title: 'Best Offers', subtitle: 'Spend less, eat more' },
    { title: 'Unforgettable Meals', subtitle: 'Dining you simply can’t miss' },
  ],
};

// Figma "Explore/Home - Hang out".
const HANG_OUT: ExploreContent = {
  recs: fiveOf({ title: 'Cineplex', detail: 'Seton and VIP', action: 'Watch a movie' }),
  sections: [
    {
      title: 'Just Opened',
      subtitle: `Only ${SEEN_BY_PERCENT}% of users have seen this`,
      refine: true,
    },
    { title: 'Near You', subtitle: 'We found 5 things you can do right now' },
    { title: 'Community Submissions', subtitle: 'What others are doing' },
    { title: 'Best Offers', subtitle: 'Spend less, do more' },
    { title: 'Relaxing Spaces', subtitle: 'Places you can chill in' },
  ],
};

export const CATEGORIES = ['Travel', 'Food', 'Hang Out'] as const;
export type Category = (typeof CATEGORIES)[number];

export const EXPLORE_CONTENT: Record<Category, ExploreContent> = {
  Travel: TRAVEL,
  Food: FOOD,
  'Hang Out': HANG_OUT,
};

// The rec whose page has this id, for the Daily Rec page.
export function findRecByPageId(id: string | undefined) {
  return Object.values(EXPLORE_CONTENT)
    .flatMap((content) => content.recs)
    .find((rec) => rec.page?.id === id);
}
