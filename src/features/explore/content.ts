// What Explore shows under each top-nav category. Placeholder copy from the
// Figma frames until there's a backend.

// Placeholder until there's a backend and enough users to measure it.
const SEEN_BY_PERCENT = 19.3;

export type DailyRec = {
  title: string;
  detail: string;
  action: string;
};

export type ExploreSection = {
  title: string;
  subtitle: string;
  // Shows the Refine button beside the heading.
  refine?: boolean;
};

export type ExploreContent = {
  rec: DailyRec;
  sections: ExploreSection[];
};

// Figma "Explore/Home - Example Cards".
const TRAVEL: ExploreContent = {
  rec: { title: 'Oia, Greece', detail: 'Village on Santorini', action: 'Start Planning' },
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
  rec: {
    title: 'Seniore’s Pizza',
    detail:
      'Counter-serve pizzeria offering specialty pies, wings & wraps in a snug space with late-night hours',
    action: 'Look at their menu',
  },
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
  rec: { title: 'Cineplex', detail: 'Seton and VIP', action: 'Watch a movie' },
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
