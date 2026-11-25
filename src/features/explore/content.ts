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
  // Figma "Romie overview / Roverview" variant: Travel's (plane and bed icons)
  // by default, Food (car and stool) or Hangout (car and clock).
  roverview?: 'Food' | 'Hangout';
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
  // The Highlights tab's cards (Figma "Explore/Home - Highlights"). Without
  // any, the tab is empty.
  highlights?: Highlight[];
  // The Reviews tab (Figma "Explore/Home - Reviews"). Without it, the tab is
  // empty.
  reviews?: RecReviews;
};

// The overall rating and Romie's summary of the reviews (placeholders until
// there's a backend).
export type RecReviews = {
  // Out of 5, e.g. '4.9'.
  rating: string;
  count: string;
  // About three lines on a 360pt phone, like Figma's.
  summary: string;
  // Two reviews shown under the summary.
  items: Review[];
};

// One review (Figma component "Review pane"). Placeholder content; every review
// is five stars, as in Figma.
export type Review = {
  username: string;
  // How many reviews the reviewer has written.
  reviewerCount: number;
  // When it was written, e.g. 'a month ago'.
  when: string;
  // Up to 6 lines.
  text: string;
};

// One of a rec's highlights: a card in the Highlights row, and the name and
// description shown under the row while its card is selected.
export type Highlight = {
  name: string;
  description: string;
  rating: string;
  reviews: string;
  // A 900 × 1200 WebP (the 300 × 400 card at 3×), darkening gradient baked in.
  // Without one, the card shows Figma's placeholder colour. Photos from
  // Wikimedia Commons are credited in assets/images/highlights/CREDITS.md.
  image?: number;
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
        reviews: {
          rating: '4.9',
          count: '45,307',
          summary:
            'Wow this place is great. really love the scenic views. The sea breeze calms your mind and soul and I can’t get enough of it. Definitely recommend travelling here.',
          items: [
            {
              username: 'maya.travels',
              reviewerCount: 12,
              when: 'a month ago',
              text: 'We stayed three nights in a cave suite and every evening the sunset over the caldera stopped us in our tracks. Get to the castle early for a spot, and wander the back lanes in the morning when it’s quiet.',
            },
            {
              username: 'jordan_k',
              reviewerCount: 34,
              when: '2 months ago',
              text: 'Absolutely stunning village. It gets very busy at sunset, so we watched from our hotel terrace instead. The walk down to Ammoudi Bay for dinner was a highlight.',
            },
          ],
        },
        highlights: [
          // Copy and rating from the Figma frame.
          {
            name: 'Oia Castle (Castle of St. Nicholas)',
            description:
              '15th-century fort ruins overlooking the caldera. Known as a popular sunset spot, though crowds are heavy and regulated—arrive early.',
            rating: '4.7',
            reviews: '2,309',
            image: require('@/assets/images/highlights/oia-castle.webp'),
          },
          // Ratings from the design brief; the descriptions and review counts
          // are placeholders until there's a backend.
          {
            name: 'Ammoudi Bay',
            description:
              'Tiny fishing harbour 300 steps below Oia. Seafood tavernas right on the water, with swimming off the rocks nearby.',
            rating: '4.6',
            reviews: '1,874',
            image: require('@/assets/images/highlights/ammoudi-bay.webp'),
          },
          {
            name: 'Blue Domes & Churches',
            description:
              'The whitewashed chapels and blue domes Santorini is known for. Come early in the morning, before the tour groups.',
            rating: '4.7',
            reviews: '3,126',
            image: require('@/assets/images/highlights/blue-domes.webp'),
          },
        ],
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
        reviews: {
          rating: '4.8',
          count: '38,912',
          summary:
            'Visitors call the lakes unreal in person, bluer than any photo. Expect crowds and early starts in summer, but the hikes, hot springs and mountain town make it worth it.',
          items: [
            {
              username: 'priya.outdoors',
              reviewerCount: 21,
              when: '3 weeks ago',
              text: 'Moraine Lake at sunrise was worth the 4am alarm. Book the Parks Canada shuttle ahead, the lots fill fast. The town is walkable with great food and the hot springs were perfect after hiking.',
            },
            {
              username: 'danny.r',
              reviewerCount: 8,
              when: 'a month ago',
              text: 'Only 90 minutes from Calgary and it feels like another world. We did the gondola and Johnston Canyon in one day. Go midweek if you can, weekends are packed.',
            },
          ],
        },
        highlights: [
          {
            name: 'Lake Louise',
            description:
              'Glacier-fed turquoise lake under Victoria Glacier. Canoe it in summer or skate it in winter—parking fills by 8am.',
            rating: '4.8',
            reviews: '18,412',
            image: require('@/assets/images/highlights/banff-lake-louise.webp'),
          },
          {
            name: 'Moraine Lake',
            description:
              'The Valley of the Ten Peaks reflected in bright blue water. Reachable by shuttle only, so book ahead.',
            rating: '4.9',
            reviews: '12,087',
            image: require('@/assets/images/highlights/banff-moraine-lake.webp'),
          },
          {
            name: 'Banff Gondola',
            description:
              'Eight-minute ride up Sulphur Mountain to boardwalks and views over six mountain ranges. Best near sunset.',
            rating: '4.6',
            reviews: '9,354',
            image: require('@/assets/images/highlights/banff-gondola.webp'),
          },
        ],
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
        reviews: {
          rating: '4.7',
          count: '52,184',
          summary:
            'Travellers love how clean, safe and easy it is to get around. The hawker food is the highlight for most, though many say the heat and prices take some getting used to.',
          items: [
            {
              username: 'lina.eats',
              reviewerCount: 46,
              when: '2 weeks ago',
              text: 'The hawker centres alone are worth the trip. Chicken rice at Maxwell and satay by the bay were the best meals we had. The MRT makes getting around effortless, and Gardens by the Bay at night is magical.',
            },
            {
              username: 'tom.w',
              reviewerCount: 15,
              when: 'a month ago',
              text: 'Clean, safe and so easy to explore. It’s hot and humid, so plan indoor stops for the afternoon. The light show at the Supertrees was a highlight for our kids.',
            },
          ],
        },
        highlights: [
          {
            name: 'Gardens by the Bay',
            description:
              'Supertrees, a cloud forest and the Flower Dome on the waterfront. Stay for the free light show at night.',
            rating: '4.8',
            reviews: '21,730',
            image: require('@/assets/images/highlights/singapore-gardens-by-the-bay.webp'),
          },
          {
            name: 'Marina Bay Sands SkyPark',
            description:
              'Observation deck 57 floors up with views across the bay and skyline. Go just before sunset to see both.',
            rating: '4.6',
            reviews: '14,218',
            image: require('@/assets/images/highlights/singapore-marina-bay-sands-skypark.webp'),
          },
          {
            name: 'Maxwell Food Centre',
            description:
              'Classic hawker centre near Chinatown, famous for its chicken rice. Cheap, fast and busiest at lunch.',
            rating: '4.5',
            reviews: '7,962',
            image: require('@/assets/images/highlights/singapore-maxwell-food-centre.webp'),
          },
        ],
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
        reviews: {
          rating: '4.8',
          count: '27,640',
          summary:
            'The sunrise balloon ride is the moment everyone talks about. Reviewers recommend a cave hotel and a spare day in case flights are cancelled for wind.',
          items: [
            {
              username: 'sofia.m',
              reviewerCount: 27,
              when: '3 weeks ago',
              text: 'The balloon flight at sunrise was the most beautiful thing I’ve ever seen. Ours was cancelled for wind the first morning, so leave a spare day. Our cave hotel was cosy and the breakfasts were huge.',
            },
            {
              username: 'aaron_l',
              reviewerCount: 11,
              when: '2 months ago',
              text: 'Hiking Love Valley and Rose Valley was just as memorable as the balloons. Rent an ATV for sunset if you can. Göreme is small but has great restaurants.',
            },
          ],
        },
        highlights: [
          {
            name: 'Hot Air Balloon Ride',
            description:
              'Sunrise flight over fairy chimneys and valleys with a hundred other balloons. Flights depend on the wind, so plan a spare morning.',
            rating: '4.9',
            reviews: '16,530',
            image: require('@/assets/images/highlights/cappadocia-hot-air-balloon-ride.webp'),
          },
          {
            name: 'Göreme Open-Air Museum',
            description:
              'Rock-cut churches and chapels with Byzantine frescoes. The Dark Church is worth the extra ticket.',
            rating: '4.6',
            reviews: '8,174',
            image: require('@/assets/images/highlights/cappadocia-goreme-open-air-museum.webp'),
          },
          {
            name: 'Love Valley',
            description:
              'Easy hike among tall rock pillars just outside Göreme. Quietest in the late afternoon light.',
            rating: '4.7',
            reviews: '3,905',
            image: require('@/assets/images/highlights/cappadocia-love-valley.webp'),
          },
        ],
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
        reviews: {
          rating: '4.7',
          count: '31,275',
          summary:
            'Reviewers rave about the mix of mountains, beaches and wine country in one trip. Most suggest renting a car and keeping an eye on the wind for Table Mountain.',
          items: [
            {
              username: 'nadia.k',
              reviewerCount: 19,
              when: 'a month ago',
              text: 'Table Mountain, penguins at Boulders Beach and wine tasting in Stellenbosch all in one week. Rent a car and do the Chapman’s Peak drive. Check the wind forecast before heading up the mountain.',
            },
            {
              username: 'chris.b',
              reviewerCount: 9,
              when: '3 months ago',
              text: 'Incredible city with something for everyone. The V&A Waterfront was great for food, and Cape Point was wild and beautiful. People were friendly and the exchange rate made it great value.',
            },
          ],
        },
        highlights: [
          {
            name: 'Table Mountain',
            description:
              'Ride the rotating cableway or hike Platteklip Gorge to the flat top. Closes in high wind, so check before you go.',
            rating: '4.8',
            reviews: '24,661',
            image: require('@/assets/images/highlights/cape-town-table-mountain.webp'),
          },
          {
            name: 'Boulders Beach',
            description:
              'Sheltered coves where a colony of African penguins nests among the granite boulders. Boardwalks keep you close.',
            rating: '4.7',
            reviews: '11,203',
            image: require('@/assets/images/highlights/cape-town-boulders-beach.webp'),
          },
          {
            name: 'Cape Point',
            description:
              'Dramatic cliffs and a lighthouse at the tip of the peninsula. Pair it with the Chapman’s Peak drive.',
            rating: '4.7',
            reviews: '9,816',
            image: require('@/assets/images/highlights/cape-town-cape-point.webp'),
          },
        ],
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

// Figma "Explore/Home - Food". The first rec is Figma's; the rest are local
// Calgary favourites (placeholder content). Photos are 900 × 1200 WebP like
// Travel's, from the restaurants' own and press photos (placeholders only, not
// licensed for release).
//
// Their pages reuse the Travel layout: "Why this is for you" is written for a
// traveller in Calgary, kept to Travel's length so the Roverview stays the same
// size (three lines on a 360pt phone). The travel time is from downtown, and
// "Typical Stay" is how long a meal there usually takes.
const FOOD: ExploreContent = {
  recs: [
    {
      title: 'Seniore’s Pizza',
      detail:
        'Counter-serve pizzeria offering specialty pies, wings & wraps in a snug space with late-night hours',
      action: 'Look at their menu',
      image: require('@/assets/images/daily-recs/seniores-pizza.webp'),
      page: {
        id: 'seniores-pizza',
        roverview: 'Food',
        hero: require('@/assets/images/daily-rec-pages/seniores-pizza.webp'),
        why: 'A true Calgary late-night classic, and home of the original donair pizza. Just the thing after a night out on the town.',
        bestTime: 'Late night',
        flightTime: '10 min',
        travelLabel: 'Est. Drive time',
        stay: '30-45 min',
        reviews: {
          rating: '4.6',
          count: '2,318',
          summary:
            'Locals swear by the donair pizza and its sweet garlicky sauce. It’s a no-frills spot, but the portions are big and it’s a reliable late-night stop.',
          items: [
            {
              username: 'yyc.foodie',
              reviewerCount: 58,
              when: '2 weeks ago',
              text: 'The donair pizza is a Calgary rite of passage. Loaded with meat and that sweet garlic sauce. Not fancy, but it hits every single time after a late night.',
            },
            {
              username: 'kevin_t',
              reviewerCount: 14,
              when: 'a month ago',
              text: 'Huge portions and fair prices. The donair is messy in the best way. Service is quick even when it’s busy late on a Friday.',
            },
          ],
        },
        highlights: [
          {
            name: 'Original Donair Pizza',
            description:
              'Spiced donair meat, onions and tomatoes under sweet donair sauce. The pie that made the place famous.',
            rating: '4.8',
            reviews: '1,942',
          },
          {
            name: 'Donair',
            description:
              'Shaved donair meat wrapped in a warm pita with plenty of sauce. A late-night favourite.',
            rating: '4.6',
            reviews: '876',
            image: require('@/assets/images/highlights/seniores-pizza-donair.webp'),
          },
          {
            name: 'Chicken Wings',
            description: 'Crispy wings in your choice of sauce, made to share alongside a pizza.',
            rating: '4.4',
            reviews: '512',
            image: require('@/assets/images/highlights/seniores-pizza-chicken-wings.webp'),
          },
        ],
      },
    },
    {
      title: 'Ten Foot Henry',
      detail: 'Vegetable-forward sharing plates in a bright, buzzy Beltline room',
      action: 'Look at their menu',
      image: require('@/assets/images/daily-recs/ten-foot-henry.webp'),
      page: {
        id: 'ten-foot-henry',
        roverview: 'Food',
        hero: require('@/assets/images/daily-rec-pages/ten-foot-henry.webp'),
        why: 'A break from Calgary’s steakhouse heaviness without giving up on flavour. Bright Beltline plates made for sharing with friends.',
        bestTime: 'Weeknights',
        flightTime: '5 min',
        travelLabel: 'Est. Drive time',
        stay: '1.5-2 hrs',
        reviews: {
          rating: '4.7',
          count: '3,846',
          summary:
            'Diners love the creative vegetable dishes and say even meat lovers leave happy. The room is lively and bright, and reservations go fast on weekends.',
          items: [
            {
              username: 'emma.eats',
              reviewerCount: 37,
              when: '3 weeks ago',
              text: 'Every vegetable dish surprised us. The cacio e pepe was perfect and the broccoli was the best thing on the table. Bright, fun room and great cocktails. Book ahead for weekends.',
            },
            {
              username: 'matt.g',
              reviewerCount: 6,
              when: '2 months ago',
              text: 'I came in sceptical about a veggie-forward menu and left a convert. Order a bunch of plates to share. Service was warm and super knowledgeable.',
            },
          ],
        },
        highlights: [
          {
            name: 'Cacio e Pepe',
            description:
              'House-made pasta in a peppery pecorino sauce. The dish regulars order every time.',
            rating: '4.8',
            reviews: '1,318',
            image: require('@/assets/images/highlights/ten-foot-henry-cacio-e-pepe.webp'),
          },
          {
            name: 'Charred Broccoli',
            description:
              'Blistered broccoli with a bright, nutty dressing. Proof the vegetables are the point here.',
            rating: '4.7',
            reviews: '904',
          },
          {
            name: 'Steak Frites',
            description:
              'Sliced steak with crisp fries and sauce, for anyone who still wants some meat on the table.',
            rating: '4.6',
            reviews: '687',
            image: require('@/assets/images/highlights/ten-foot-henry-steak-frites.webp'),
          },
        ],
      },
    },
    {
      title: 'Native Tongues Taqueria',
      detail: 'Mexico City-style tacos and mezcal in the Beltline',
      action: 'Look at their menu',
      image: require('@/assets/images/daily-recs/native-tongues.webp'),
      page: {
        id: 'native-tongues',
        roverview: 'Food',
        hero: require('@/assets/images/daily-rec-pages/native-tongues.webp'),
        why: 'Proper Mexico City-style tacos without leaving the Beltline. Grab a mezcal and a few plates for an easy weeknight out.',
        bestTime: 'Weeknights',
        flightTime: '5 min',
        travelLabel: 'Est. Drive time',
        stay: '1-1.5 hrs',
        reviews: {
          rating: '4.6',
          count: '2,972',
          summary:
            'Guests say the tacos taste like Mexico City and the mezcal list is the best in town. It gets loud and busy, so go early or sit at the bar.',
          items: [
            {
              username: 'carla.yyc',
              reviewerCount: 22,
              when: 'a month ago',
              text: 'Tastes like the taquerias I loved in Mexico City. The al pastor tacos are a must and the mezcal list is amazing. It gets loud, but that’s part of the fun.',
            },
            {
              username: 'ben.h',
              reviewerCount: 17,
              when: '3 weeks ago',
              text: 'Great vibe and even better tacos. The suadero was my favourite. Grab a seat at the bar if you’re a small group, the bartenders are great at recommending mezcal.',
            },
          ],
        },
        highlights: [
          {
            name: 'Tacos al Pastor',
            description:
              'Marinated pork shaved off the spit with pineapple and salsa verde on corn tortillas.',
            rating: '4.8',
            reviews: '2,104',
            image: require('@/assets/images/highlights/native-tongues-tacos-al-pastor.webp'),
          },
          {
            name: 'Suadero Tacos',
            description: 'Slow-cooked beef crisped on the plancha, Mexico City street style.',
            rating: '4.7',
            reviews: '1,236',
            image: require('@/assets/images/highlights/native-tongues-suadero-tacos.webp'),
          },
          {
            name: 'Mezcal Flight',
            description:
              'A tasting of three mezcals with orange and sal de gusano. Ask the bar for a guide.',
            rating: '4.6',
            reviews: '743',
            image: require('@/assets/images/highlights/native-tongues-mezcal-flight.webp'),
          },
        ],
      },
    },
    {
      title: 'River Café',
      detail: 'Seasonal Canadian cooking in a lodge on Prince’s Island Park',
      action: 'Look at their menu',
      image: require('@/assets/images/daily-recs/river-cafe.webp'),
      page: {
        id: 'river-cafe',
        roverview: 'Food',
        hero: require('@/assets/images/daily-rec-pages/river-cafe.webp'),
        why: 'Leave the downtown towers behind for a lodge in the middle of the Bow. Seasonal Alberta cooking made for a slow evening.',
        bestTime: 'Summer',
        flightTime: '10 min',
        // Prince's Island is car-free: it's a walk across the bridge.
        travelLabel: 'Est. Walk time',
        stay: '1.5-2 hrs',
        reviews: {
          rating: '4.7',
          count: '4,105',
          summary:
            'Reviewers call it a Calgary classic for special occasions, with a beautiful setting in the park. The patio is the place to be in summer, and service is warm.',
          items: [
            {
              username: 'grace.l',
              reviewerCount: 29,
              when: '2 months ago',
              text: 'We came for our anniversary and it was perfect. Walking across to the island makes it feel like a getaway. Beautifully cooked bison and a lovely patio in summer.',
            },
            {
              username: 'owen.p',
              reviewerCount: 12,
              when: 'a month ago',
              text: 'A Calgary classic for good reason. Seasonal menu, warm service and a cosy fireplace in winter. Pricey, but worth it for a special night.',
            },
          ],
        },
        highlights: [
          {
            name: 'Alberta Bison',
            description:
              'Locally raised bison with seasonal vegetables, cooked over the wood-fired grill.',
            rating: '4.8',
            reviews: '1,072',
          },
          {
            name: 'Charcuterie Board',
            description:
              'House-cured meats, pickles and local cheese. Made for sharing on the patio.',
            rating: '4.7',
            reviews: '836',
            image: require('@/assets/images/highlights/river-cafe-charcuterie-board.webp'),
          },
          {
            name: 'Seasonal Tasting Menu',
            description: 'A few courses built around what Alberta farms are growing that week.',
            rating: '4.7',
            reviews: '591',
          },
        ],
      },
    },
    {
      title: 'Shokunin',
      detail: 'Yakitori and Japanese small plates from the grill in Mission',
      action: 'Look at their menu',
      image: require('@/assets/images/daily-recs/shokunin.webp'),
      page: {
        id: 'shokunin',
        roverview: 'Food',
        hero: require('@/assets/images/daily-rec-pages/shokunin.webp'),
        why: 'Smoky yakitori straight off the grill, a short walk from 4th Street. A cosy Mission spot made for a long night of small plates.',
        bestTime: 'Weeknights',
        flightTime: '10 min',
        travelLabel: 'Est. Drive time',
        stay: '1.5-2 hrs',
        reviews: {
          rating: '4.8',
          count: '2,457',
          summary:
            'Diners rave about the yakitori and the open grill, calling it the closest thing to Tokyo in Calgary. Seating is limited, so booking ahead is a must.',
          items: [
            {
              username: 'hana.s',
              reviewerCount: 41,
              when: '3 weeks ago',
              text: 'The closest thing to a Tokyo yakitori bar in Calgary. Sit at the counter and watch them grill over charcoal. The tsukune with egg yolk and the wagyu were unreal.',
            },
            {
              username: 'luke.m',
              reviewerCount: 10,
              when: 'a month ago',
              text: 'Every skewer was perfectly cooked. Small space, so book well ahead. Great sake list and the staff were happy to recommend pairings.',
            },
          ],
        },
        highlights: [
          {
            name: 'Wagyu',
            description:
              'Richly marbled wagyu, seared and sliced at the table. The dish in their photos for a reason.',
            rating: '4.9',
            reviews: '1,145',
            image: require('@/assets/images/highlights/shokunin-wagyu.webp'),
          },
          {
            name: 'Chicken Thigh Yakitori',
            description: 'Juicy thigh skewers glazed with tare over binchotan charcoal.',
            rating: '4.8',
            reviews: '1,502',
            image: require('@/assets/images/highlights/shokunin-chicken-thigh-yakitori.webp'),
          },
          {
            name: 'Tsukune',
            description: 'Grilled chicken meatball skewer served with an egg yolk for dipping.',
            rating: '4.7',
            reviews: '968',
            image: require('@/assets/images/highlights/shokunin-tsukune.webp'),
          },
        ],
      },
    },
  ],
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
  // The first rec is Figma's; the rest are local Calgary spots (placeholder
  // content). Photos and pages work like Food's: placeholder photos, not
  // licensed for release, and "Typical Stay" is how long people spend there.
  recs: [
    {
      title: 'Cineplex',
      detail: 'Seton and VIP',
      action: 'Watch a movie',
      image: require('@/assets/images/daily-recs/cineplex.webp'),
      page: {
        id: 'cineplex',
        roverview: 'Hangout',
        hero: require('@/assets/images/daily-rec-pages/cineplex.webp'),
        why: 'Recline in heated VIP seats with dinner brought right to you. A cosy escape for when Calgary’s weather keeps you indoors.',
        bestTime: 'Tuesdays',
        flightTime: '30 min',
        travelLabel: 'Est. Drive time',
        stay: '2-3 hrs',
        reviews: {
          rating: '4.4',
          count: '6,213',
          summary:
            'Moviegoers love the VIP recliners and food delivered to the seat. Prices are higher than regular screenings, but most say it’s worth it for a night out.',
          items: [
            {
              username: 'steph.r',
              reviewerCount: 13,
              when: '2 weeks ago',
              text: 'The VIP theatre makes movie night feel special. Comfy recliners, food brought to your seat and no kids running around. A bit pricey, but great for date night.',
            },
            {
              username: 'mike.d',
              reviewerCount: 25,
              when: 'a month ago',
              text: 'Clean theatre with good sound and screens. Tuesdays are great value. Lots of restaurants in Seton for dinner beforehand.',
            },
          ],
        },
        highlights: [
          {
            name: 'VIP Cinemas',
            description:
              '19+ auditoriums with reclining seats and food and drinks brought to your seat.',
            rating: '4.7',
            reviews: '3,284',
            image: require('@/assets/images/highlights/cineplex-vip-cinemas.webp'),
          },
          {
            name: 'Cheap Tuesdays',
            description:
              'Discounted tickets every Tuesday. The easiest night to catch a new release for less.',
            rating: '4.6',
            reviews: '2,051',
          },
          {
            name: 'Seton Urban District',
            description:
              'Restaurants and shops steps from the theatre, for dinner before the movie.',
            rating: '4.4',
            reviews: '1,177',
            image: require('@/assets/images/highlights/cineplex-seton-urban-district.webp'),
          },
        ],
      },
    },
    {
      title: 'Studio Bell',
      detail: 'Hands-on music museum in the East Village',
      action: 'Get tickets',
      image: require('@/assets/images/daily-recs/studio-bell.webp'),
      page: {
        id: 'studio-bell',
        roverview: 'Hangout',
        hero: require('@/assets/images/daily-rec-pages/studio-bell.webp'),
        why: 'Play instruments, mix tracks and see the Rolling Stones’ mobile studio. An easy afternoon out without leaving downtown.',
        bestTime: 'Winter',
        flightTime: '15 min',
        travelLabel: 'Est. Walk time',
        stay: '2-3 hrs',
        reviews: {
          rating: '4.7',
          count: '5,689',
          summary:
            'Visitors love getting hands-on with the instruments and say the building itself is worth seeing. Plan a few hours, and don’t miss the Rolling Stones studio.',
          items: [
            {
              username: 'jess.music',
              reviewerCount: 18,
              when: 'a month ago',
              text: 'You can play so many instruments here, the kids loved it and so did we. The building is stunning inside and out. Don’t miss the Rolling Stones Mobile Studio.',
            },
            {
              username: 'ravi.k',
              reviewerCount: 7,
              when: '2 months ago',
              text: 'Spent three hours and could have stayed longer. The Canadian Music Hall of Fame was a fun walk down memory lane. Great rainy-day plan downtown.',
            },
          ],
        },
        highlights: [
          {
            name: 'Rolling Stones Mobile Studio',
            description:
              'The truck where classics by the Stones and Led Zeppelin were recorded, restored inside the museum.',
            rating: '4.8',
            reviews: '1,623',
          },
          {
            name: 'Canadian Music Hall of Fame',
            description: 'Stories, stage outfits and instruments from Canada’s biggest artists.',
            rating: '4.7',
            reviews: '1,208',
          },
          {
            name: 'Hands-On Instrument Galleries',
            description:
              'Play drums, guitars and synths, or try mixing a track in a recording booth.',
            rating: '4.8',
            reviews: '1,947',
          },
        ],
      },
    },
    {
      title: 'Central Library',
      detail: 'Striking downtown library with cosy reading nooks',
      action: 'Plan a visit',
      image: require('@/assets/images/daily-recs/central-library.webp'),
      page: {
        id: 'central-library',
        roverview: 'Hangout',
        hero: require('@/assets/images/daily-rec-pages/central-library.webp'),
        why: 'A free, quiet escape from downtown in one of the world’s most striking libraries. Bring a book and stay for the views.',
        bestTime: 'Winter',
        flightTime: '10 min',
        travelLabel: 'Est. Walk time',
        stay: '1-2 hrs',
        reviews: {
          rating: '4.9',
          count: '8,432',
          summary:
            'People are amazed by the architecture and call it one of the most beautiful libraries anywhere. It’s free, quiet and great for an afternoon with a book.',
          items: [
            {
              username: 'amy.reads',
              reviewerCount: 33,
              when: '3 weeks ago',
              text: 'One of the most beautiful buildings I’ve ever been in. The wooden atrium is breathtaking. Plenty of quiet spots to read and it’s completely free.',
            },
            {
              username: 'jason.c',
              reviewerCount: 11,
              when: 'a month ago',
              text: 'Took the kids to the children’s floor and they didn’t want to leave. Great programs, cosy nooks and amazing architecture. A hidden gem in the East Village.',
            },
          ],
        },
        highlights: [
          {
            name: 'The Wooden Atrium',
            description:
              'The curving cedar-clad entrance and atrium that made the building famous. Look up as you walk in.',
            rating: '4.9',
            reviews: '2,736',
            image: require('@/assets/images/highlights/central-library-wooden-atrium.webp'),
          },
          {
            name: 'Children’s Library',
            description: 'A whole floor of play spaces, reading nooks and programs for kids.',
            rating: '4.8',
            reviews: '1,092',
          },
          {
            name: 'Top-Floor Reading Room',
            description: 'A quiet room under the skylights with views over the East Village.',
            rating: '4.8',
            reviews: '1,384',
          },
        ],
      },
    },
    {
      title: 'Kensington',
      detail: 'Indie shops, cafés and pubs just over the Bow',
      action: 'Plan a visit',
      image: require('@/assets/images/daily-recs/kensington.webp'),
      page: {
        id: 'kensington',
        roverview: 'Hangout',
        hero: require('@/assets/images/daily-rec-pages/kensington.webp'),
        why: 'Calgary’s best neighbourhood for a slow wander, just over the Louise Bridge. Coffee, record shops and a pint by the Bow.',
        bestTime: 'Summer',
        flightTime: '5 min',
        travelLabel: 'Est. Drive time',
        stay: '2-3 hrs',
        reviews: {
          rating: '4.6',
          count: '3,174',
          summary:
            'Locals love wandering the independent shops and cafés on a sunny day. Reviewers recommend grabbing a coffee and walking along the river afterwards.',
          items: [
            {
              username: 'olivia.w',
              reviewerCount: 24,
              when: '2 weeks ago',
              text: 'My favourite neighbourhood for a slow Saturday. Coffee, a browse at Pages, then a walk along the river. Lots of great independent shops and patios.',
            },
            {
              username: 'sam.t',
              reviewerCount: 9,
              when: 'a month ago',
              text: 'Feels like a small town in the middle of the city. Good mix of cafés, pubs and quirky stores. Easy to get to by C-Train from downtown.',
            },
          ],
        },
        highlights: [
          {
            name: 'Pages on Kensington',
            description:
              'Independent bookstore with hand-picked staff favourites and regular author readings.',
            rating: '4.8',
            reviews: '642',
          },
          {
            name: 'Livingstone & Cavell Extraordinary Toys',
            description: 'Two floors of toys, games and curiosities for kids and grown-ups.',
            rating: '4.8',
            reviews: '911',
          },
          {
            name: 'Kensington Wine Market',
            description:
              'Wine and whisky shop known for its tastings and friendly, knowledgeable staff.',
            rating: '4.7',
            reviews: '574',
            image: require('@/assets/images/highlights/kensington-wine-market.webp'),
          },
        ],
      },
    },
    {
      title: 'Inglewood',
      detail: 'Calgary’s oldest neighbourhood, full of vintage shops and breweries',
      action: 'Plan a visit',
      image: require('@/assets/images/daily-recs/inglewood.webp'),
      page: {
        id: 'inglewood',
        roverview: 'Hangout',
        hero: require('@/assets/images/daily-rec-pages/inglewood.webp'),
        why: 'Swap the Beltline crowds for Calgary’s oldest main street. Vintage shops by day, local breweries and live music by night.',
        bestTime: 'Weekends',
        flightTime: '10 min',
        travelLabel: 'Est. Drive time',
        stay: '2-4 hrs',
        reviews: {
          rating: '4.6',
          count: '2,861',
          summary:
            'Visitors love the vintage shops, record stores and breweries along 9th Avenue. It feels like a small town in the city, and the bird sanctuary is a nice escape.',
          items: [
            {
              username: 'nora.v',
              reviewerCount: 16,
              when: '3 weeks ago',
              text: 'Spent a whole afternoon digging through records and vintage shops on 9th Avenue. Ended the day with a pint at a local brewery. Such a fun neighbourhood.',
            },
            {
              username: 'will.j',
              reviewerCount: 20,
              when: '2 months ago',
              text: 'The bird sanctuary is a peaceful escape right in the city. Combine it with lunch on 9th and a wander through the shops. Great for a weekend afternoon.',
            },
          ],
        },
        highlights: [
          {
            name: 'Recordland',
            description:
              'A maze of vinyl, from bargain bins to rare finds. Plan to dig for a while.',
            rating: '4.7',
            reviews: '1,318',
          },
          {
            name: 'Esker Foundation',
            description: 'Free contemporary art gallery on the upper floors above 9th Avenue.',
            rating: '4.7',
            reviews: '486',
          },
          {
            name: 'Inglewood Bird Sanctuary',
            description: 'Easy trails along the Bow with deer, owls and over 270 species of birds.',
            rating: '4.8',
            reviews: '1,862',
            image: require('@/assets/images/highlights/inglewood-bird-sanctuary.webp'),
          },
        ],
      },
    },
  ],
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
