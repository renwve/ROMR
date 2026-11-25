import type { PlaceDetails } from "./placedetailsmodal";

export type TravelCardData = {
  id: string;
  title: string;
  image: string;
  price: string;
  rating: string;
  tag: string;
};

export type InspirationCard = {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  badge: string;
};

export const placeDetails: Record<string, PlaceDetails> = {
  oia: {
    id: "oia",
    name: "Oia",
    country: "Greece",
    image:
      "https://images.unsplash.com/photo-1580502304784-8985b7eb7260?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D",
    address: "Oia, Santorini, South Aegean, Greece",
    weather: "Mediterranean climate · sample only",
    temperature: "20°C",
    description:
      "Oia is a cliffside village on Santorini known for whitewashed homes, blue-domed churches, caldera views and spectacular sunsets. Expect narrow lanes, small galleries and restaurants with sea views.",
    bestTimeToVisit: "April–June or September–October",
    language: "Greek (English is common in visitor areas)",
    currency: "Euro (EUR)",
    pros: [
      "Iconic caldera and sunset views",
      "Walkable village with cafés and galleries",
      "Great base for exploring Santorini",
    ],
    cons: [
      "Very crowded around sunset in peak season",
      "Accommodation and dining can be expensive",
      "Steep paths and stairs may be challenging",
    ],
    costs: [
      {
        category: "Casual meal",
        estimate: "€15–€25",
        icon: "restaurant-outline",
      },
      {
        category: "Local bus",
        estimate: "About €2–€3",
        icon: "bus-outline",
      },
      {
        category: "Mid-range room",
        estimate: "€150–€350+",
        icon: "bed-outline",
      },
    ],
    customs: [
      "Greet people politely; a friendly hello is appreciated.",
      "Dress respectfully when visiting churches and monasteries.",
      "Avoid blocking narrow lanes while taking photos and respect private homes.",
    ],
    tips: [
      "Book sunset dinner tables ahead in high season.",
      "Bring comfortable shoes for uneven stone paths.",
      "Consider visiting early morning for quieter photos.",
    ],
  },
  kyoto: {
    id: "kyoto",
    name: "Kyoto",
    country: "Japan",
    image:
      "https://images.unsplash.com/photo-1558870832-c8db4b5b47d1?q=80&w=688&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D",
    address: "Kyoto, Kyoto Prefecture, Japan",
    weather: "Seasonal; check the forecast before travel",
    temperature: "18°C",
    description:
      "Kyoto blends historic temples, traditional streets, gardens, tea houses and modern neighbourhoods. It is especially atmospheric during spring blossoms and autumn foliage.",
    bestTimeToVisit: "March–May or October–November",
    language: "Japanese",
    currency: "Japanese yen (JPY)",
    pros: [
      "Remarkable temples, gardens and architecture",
      "Excellent food and cultural experiences",
      "Good public transit and rail connections",
    ],
    cons: [
      "Popular sites can be extremely busy",
      "Some sights require lots of walking",
      "Peak foliage and blossom dates book up early",
    ],
    costs: [
      {
        category: "Casual meal",
        estimate: "¥800–¥1,800",
        icon: "restaurant-outline",
      },
      {
        category: "Local transit",
        estimate: "¥230–¥1,000/day",
        icon: "train-outline",
      },
      {
        category: "Temple entry",
        estimate: "Often ¥400–¥1,000",
        icon: "ticket-outline",
      },
    ],
    customs: [
      "Keep your voice low on public transportation.",
      "Remove shoes where signs or hosts ask you to.",
      "Follow photography rules and avoid entering private lanes or homes.",
    ],
    tips: [
      "Start early at famous temples.",
      "Carry a little cash for small shops and entry fees.",
      "Use transit cards or check route passes before your trip.",
    ],
  },
  amalfi: {
    id: "amalfi",
    name: "Amalfi Coast",
    country: "Italy",
    image:
      "https://images.unsplash.com/photo-1561956021-947f09ae0101?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D",
    address: "Amalfi, Province of Salerno, Campania, Italy",
    weather: "Mediterranean coastal climate · sample only",
    temperature: "24°C",
    description:
      "The Amalfi Coast is a dramatic stretch of coastline with pastel villages, lemon groves, beaches and winding roads. Amalfi, Positano and Ravello each offer a different pace and view.",
    bestTimeToVisit: "May–June or September",
    language: "Italian (English in many tourist businesses)",
    currency: "Euro (EUR)",
    pros: [
      "Beautiful sea views and colourful towns",
      "Regional food, lemon treats and seafood",
      "Easy to combine villages by ferry in season",
    ],
    cons: [
      "Roads can be winding and congested",
      "Peak-season lodging is expensive",
      "Many towns involve stairs and steep hills",
    ],
    costs: [
      {
        category: "Casual meal",
        estimate: "€15–€30",
        icon: "restaurant-outline",
      },
      {
        category: "Bus or ferry",
        estimate: "€5–€20+ per ride",
        icon: "boat-outline",
      },
      {
        category: "Mid-range room",
        estimate: "€130–€300+",
        icon: "bed-outline",
      },
    ],
    customs: [
      "Dress modestly when entering churches.",
      "A polite buongiorno or buonasera is a nice greeting.",
      "Respect beach access rules and private terraces.",
    ],
    tips: [
      "Compare ferry and bus schedules for your dates.",
      "Reserve popular restaurants and lodging early.",
      "Pack shoes with grip for stairs and cobblestones.",
    ],
  },
  bali: {
    id: "bali",
    name: "Ubud",
    country: "Indonesia",
    image:
      "https://plus.unsplash.com/premium_photo-1661878915254-f3163e91d870?q=80&w=1171&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D",
    address: "Ubud, Gianyar Regency, Bali, Indonesia",
    weather: "Tropical and humid · sample only",
    temperature: "29°C",
    description:
      "Ubud is a cultural hub surrounded by rice terraces, forested ravines, craft markets and temples. It is a popular place for wellness stays, nature walks and Balinese food.",
    bestTimeToVisit: "April–October for generally drier weather",
    language: "Indonesian and Balinese",
    currency: "Indonesian rupiah (IDR)",
    pros: [
      "Lush scenery and wellness activities",
      "Rich arts, crafts and food culture",
      "Many accommodation styles and day trips",
    ],
    cons: [
      "Traffic can be slow around central Ubud",
      "Humidity and rain can affect outdoor plans",
      "Some attractions are spread out",
    ],
    costs: [
      {
        category: "Local meal",
        estimate: "Rp 30,000–100,000",
        icon: "restaurant-outline",
      },
      {
        category: "Driver / transfer",
        estimate: "Varies by route",
        icon: "car-outline",
      },
      {
        category: "Mid-range room",
        estimate: "Rp 500,000–1,500,000+",
        icon: "bed-outline",
      },
    ],
    customs: [
      "Wear a sarong and cover shoulders where required at temples.",
      "Never step on offerings placed on the ground.",
      "Ask permission before photographing ceremonies or people.",
    ],
    tips: [
      "Bring light rain protection and insect repellent.",
      "Use licensed transport and agree on prices beforehand.",
      "Check local guidance before visiting sacred sites.",
    ],
  },
  lucerne: {
    id: "lucerne",
    name: "Lucerne",
    country: "Switzerland",
    image:
      "https://images.unsplash.com/photo-1531366936337-7c912a4589a7?auto=format&fit=crop&w=1200&q=85",
    address: "Lucerne, Canton of Lucerne, Switzerland",
    weather: "Alpine weather changes quickly · sample only",
    temperature: "12°C",
    description:
      "Lucerne sits beside a lake with a historic old town and mountain scenery nearby. It makes a scenic base for boat trips, lakeside walks and mountain excursions.",
    bestTimeToVisit:
      "June–September for hiking; December for winter atmosphere",
    language: "German (English is common in visitor areas)",
    currency: "Swiss franc (CHF)",
    pros: [
      "Lake, old town and mountain views",
      "Reliable public transportation",
      "Great base for scenic day trips",
    ],
    cons: [
      "Switzerland can be costly",
      "Mountain weather can change quickly",
      "Popular excursions may need advance booking",
    ],
    costs: [
      {
        category: "Casual meal",
        estimate: "CHF 20–35",
        icon: "restaurant-outline",
      },
      {
        category: "Local transit",
        estimate: "Check local passes",
        icon: "train-outline",
      },
      {
        category: "Mountain excursion",
        estimate: "Often CHF 50+",
        icon: "ticket-outline",
      },
    ],
    customs: [
      "Be punctual for booked activities and transport.",
      "Keep noise considerate in residential areas.",
      "Follow trail signs and local mountain-safety advice.",
    ],
    tips: [
      "Check mountain lift operations and weather.",
      "Look into visitor cards or transit passes.",
      "Bring layers even in warmer months.",
    ],
  },
  banff: {
    id: "banff",
    name: "Banff National Park",
    country: "Canada",
    image:
      "https://images.unsplash.com/photo-1503614472-8c93d56e92ce?q=80&w=1111&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D",
    address: "Banff National Park, Alberta, Canada",
    weather: "Mountain conditions vary by elevation · sample only",
    temperature: "8°C",
    description:
      "Banff is known for turquoise lakes, mountain peaks, forest trails and wildlife. The surrounding Canadian Rockies offer scenic drives and outdoor activities in every season.",
    bestTimeToVisit:
      "June–September for many hikes; winter for snow activities",
    language: "English and French (English widely used locally)",
    currency: "Canadian dollar (CAD)",
    pros: [
      "World-class mountain and lake scenery",
      "Outdoor activities in every season",
      "Well-developed visitor services in Banff town",
    ],
    cons: [
      "Busy roads and parking at popular lakes",
      "Weather can change quickly",
      "Wildlife and trail safety rules matter",
    ],
    costs: [
      {
        category: "Casual meal",
        estimate: "C$20–35",
        icon: "restaurant-outline",
      },
      {
        category: "Park admission",
        estimate: "Check current Parks Canada fees",
        icon: "ticket-outline",
      },
      {
        category: "Accommodation",
        estimate: "Varies greatly by season",
        icon: "bed-outline",
      },
    ],
    customs: [
      "Give wildlife plenty of space and never feed animals.",
      "Pack out litter and stay on marked trails.",
      "Follow park closures and fire restrictions.",
    ],
    tips: [
      "Reserve shuttles and accommodation early in summer.",
      "Check road, trail and lake access updates.",
      "Bring layers, water and bear-aware hiking essentials.",
    ],
  },
  reykjavik: {
    id: "reykjavik",
    name: "Reykjavík",
    country: "Iceland",
    image:
      "https://images.unsplash.com/photo-1476610182048-b716b8518aae?auto=format&fit=crop&w=1200&q=85",
    address: "Reykjavík, Capital Region, Iceland",
    weather: "Windy maritime climate · sample only",
    temperature: "7°C",
    description:
      "Iceland's capital is a colourful, creative base for geothermal pools, coastal walks, museums and road trips to waterfalls, lava fields and volcanic landscapes.",
    bestTimeToVisit:
      "June–August for long days; September–March for aurora chances",
    language: "Icelandic (English is widely spoken)",
    currency: "Icelandic króna (ISK)",
    pros: [
      "Unique volcanic and coastal scenery",
      "Excellent geothermal bathing culture",
      "Good base for guided nature trips",
    ],
    cons: [
      "Weather is unpredictable and windy",
      "Food and transport can be expensive",
      "Winter daylight is limited",
    ],
    costs: [
      {
        category: "Casual meal",
        estimate: "ISK 2,500–4,500",
        icon: "restaurant-outline",
      },
      {
        category: "Geothermal bath",
        estimate: "Varies by venue",
        icon: "water-outline",
      },
      {
        category: "Day tour",
        estimate: "Often ISK 10,000+",
        icon: "bus-outline",
      },
    ],
    customs: [
      "Shower thoroughly before entering public geothermal pools.",
      "Respect fragile moss and stay on marked paths.",
      "Follow weather and road-safety advisories.",
    ],
    tips: [
      "Pack waterproof outer layers year-round.",
      "Do not stop on roads for photos.",
      "Check aurora forecasts and cloud cover if chasing northern lights.",
    ],
  },
  paris: {
    id: "paris",
    name: "Paris",
    country: "France",
    image:
      "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1200&q=85",
    address: "Paris, Île-de-France, France",
    weather: "Temperate climate · sample only",
    temperature: "16°C",
    description:
      "Paris combines celebrated museums, neighbourhood cafés, architecture, parks and riverside walks. Each arrondissement has its own rhythm, from grand landmarks to quieter local streets.",
    bestTimeToVisit: "April–June or September–October",
    language: "French",
    currency: "Euro (EUR)",
    pros: [
      "Museums, architecture and food culture",
      "Extensive public transit",
      "Neighbourhoods suited to walking and exploring",
    ],
    cons: [
      "Major attractions can be crowded",
      "Central accommodation can be expensive",
      "Pickpocketing can occur in busy tourist areas",
    ],
    costs: [
      {
        category: "Casual meal",
        estimate: "€15–€25",
        icon: "restaurant-outline",
      },
      {
        category: "Metro trip",
        estimate: "Check current RATP fares",
        icon: "train-outline",
      },
      {
        category: "Museum entry",
        estimate: "Varies by museum",
        icon: "ticket-outline",
      },
    ],
    customs: [
      "Start interactions with bonjour or bonsoir.",
      "Keep voices considerate in cafés and public transport.",
      "Observe museum, church and photography rules.",
    ],
    tips: [
      "Book timed-entry tickets for major sights.",
      "Keep valuables secure in busy areas.",
      "Explore one or two neighbourhoods per day rather than rushing.",
    ],
  },
  marrakech: {
    id: "marrakech",
    name: "Marrakech",
    country: "Morocco",
    image:
      "https://images.unsplash.com/photo-1597212618440-806262de4f6b?auto=format&fit=crop&w=1200&q=85",
    address: "Marrakech, Marrakech-Safi, Morocco",
    weather: "Often sunny; summers can be very hot · sample only",
    temperature: "25°C",
    description:
      "Marrakech is known for lively souks, gardens, historic architecture and riad courtyards. It is a sensory city with traditional crafts, fragrant food and day trips to nearby landscapes.",
    bestTimeToVisit: "March–May or September–November",
    language: "Arabic and Amazigh; French is also widely used",
    currency: "Moroccan dirham (MAD)",
    pros: [
      "Distinctive markets, design and architecture",
      "Memorable local cuisine",
      "Good base for guided day trips",
    ],
    cons: [
      "Busy souks can feel overwhelming",
      "Heat can be intense in summer",
      "Visitors may need to negotiate prices in markets",
    ],
    costs: [
      {
        category: "Local meal",
        estimate: "MAD 40–120",
        icon: "restaurant-outline",
      },
      {
        category: "Taxi / transfer",
        estimate: "Agree fare in advance",
        icon: "car-outline",
      },
      {
        category: "Riad stay",
        estimate: "Varies by season",
        icon: "bed-outline",
      },
    ],
    customs: [
      "Dress respectfully, especially around religious sites.",
      "Ask before photographing people.",
      "Use polite bargaining and confirm prices before accepting services.",
    ],
    tips: [
      "Carry small cash for markets and tips.",
      "Arrange airport transfers with your accommodation.",
      "Take breaks and drink water when exploring in warm weather.",
    ],
  },
  patagonia: {
    id: "patagonia",
    name: "Patagonia",
    country: "Argentina & Chile",
    image:
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=85",
    address: "Patagonia, southern Argentina and Chile",
    weather: "Windy, variable conditions · sample only",
    temperature: "10°C",
    description:
      "Patagonia is a vast region of jagged peaks, glaciers, lakes and open steppe shared by Argentina and Chile. It rewards hikers and nature lovers with immense landscapes and remote-feeling trails.",
    bestTimeToVisit:
      "November–March for many southern-hemisphere hikes",
    language: "Spanish",
    currency: "Argentine peso in Argentina; Chilean peso in Chile",
    pros: [
      "Dramatic mountain and glacier scenery",
      "Excellent hiking and wildlife viewing",
      "A sense of space and wilderness",
    ],
    cons: [
      "Long travel distances between highlights",
      "Weather can change rapidly",
      "Remote trips can require careful budgeting and planning",
    ],
    costs: [
      {
        category: "Meals",
        estimate: "Varies by town and country",
        icon: "restaurant-outline",
      },
      {
        category: "Park entry",
        estimate: "Check each park's current fees",
        icon: "ticket-outline",
      },
      {
        category: "Guided trek",
        estimate: "Varies by route",
        icon: "walk-outline",
      },
    ],
    customs: [
      "Stay on marked trails and follow park guidance.",
      "Pack out all rubbish and protect fragile habitats.",
      "Respect wildlife and keep a safe distance.",
    ],
    tips: [
      "Build buffer days for wind and weather.",
      "Carry layers and proper rain protection.",
      "Check park transport, permits and trail conditions in advance.",
    ],
  },
  dolomites: {
    id: "dolomites",
    name: "The Dolomites",
    country: "Italy",
    image:
      "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1200&q=85",
    address: "Dolomites, northeastern Italy",
    weather: "Alpine conditions vary by elevation · sample only",
    temperature: "11°C",
    description:
      "The Dolomites feature dramatic pale limestone peaks, alpine meadows, mountain huts and winding passes. They are especially beautiful for hiking, photography and scenic drives.",
    bestTimeToVisit:
      "June–September for many hikes; winter for snow sports",
    language: "Italian and German in many areas; Ladin in some valleys",
    currency: "Euro (EUR)",
    pros: [
      "Exceptional mountain scenery",
      "Marked trails and mountain huts",
      "Beautiful villages and regional food",
    ],
    cons: [
      "Mountain weather changes quickly",
      "Popular trailheads can be crowded",
      "Some lifts and huts operate seasonally",
    ],
    costs: [
      {
        category: "Mountain hut meal",
        estimate: "€15–€30",
        icon: "restaurant-outline",
      },
      {
        category: "Cable car",
        estimate: "Varies by route",
        icon: "ticket-outline",
      },
      {
        category: "Mountain lodging",
        estimate: "Book well ahead",
        icon: "bed-outline",
      },
    ],
    customs: [
      "Stay on marked paths and respect trail closures.",
      "Carry out rubbish and keep noise low in nature.",
      "Check hut rules and reserve overnight stays where needed.",
    ],
    tips: [
      "Check lift opening dates before planning routes.",
      "Bring sturdy footwear and weather layers.",
      "Choose hikes that match your fitness and experience.",
    ],
  },
  machupicchu: {
    id: "machupicchu",
    name: "Machu Picchu",
    country: "Peru",
    image:
      "https://images.unsplash.com/photo-1526392060635-9d6019884377?auto=format&fit=crop&w=1200&q=85",
    address: "Machu Picchu, Cusco Region, Peru",
    weather: "Mountain and cloud-forest conditions · sample only",
    temperature: "14°C",
    description:
      "Machu Picchu is an Inca citadel set high in the Andes, surrounded by steep green mountains and cloud forest. Visits combine archaeology, dramatic views and careful route planning.",
    bestTimeToVisit: "May–September is generally drier",
    language: "Spanish and Quechua",
    currency: "Peruvian sol (PEN)",
    pros: [
      "Remarkable archaeology and mountain scenery",
      "A memorable cultural experience",
      "Can be combined with Cusco and the Sacred Valley",
    ],
    cons: [
      "Entry and route capacity are controlled",
      "Altitude can affect some travellers",
      "Travel logistics take planning",
    ],
    costs: [
      {
        category: "Meals",
        estimate: "Varies by town and tour",
        icon: "restaurant-outline",
      },
      {
        category: "Entry / transport",
        estimate: "Check official current ticket rules",
        icon: "ticket-outline",
      },
      {
        category: "Guided visit",
        estimate: "Varies by group and route",
        icon: "walk-outline",
      },
    ],
    customs: [
      "Follow site rules and designated routes.",
      "Treat archaeological structures with care and do not climb restricted areas.",
      "Ask permission before photographing local people.",
    ],
    tips: [
      "Buy tickets through official channels well in advance.",
      "Allow time to acclimatize to altitude.",
      "Pack rain protection and follow current access guidance.",
    ],
  },
  "beach-offer": {
    id: "beach-offer",
    name: "A little beach escape",
    country: "Limited-time getaway",
    image:
      "https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&w=1200&q=85",
    address: "A hand-picked coastal stay · destination varies by availability",
    weather: "Sunny-day inspiration · conditions vary",
    temperature: "From $299",
    description:
      "A wallet-friendlier little escape for anyone craving ocean air, slow mornings and a change of scenery. This is a promotional concept card, so final dates, destinations, inclusions and pricing would need to be confirmed before booking.",
    bestTimeToVisit: "Seasonal availability; check dates before booking",
    language: "Depends on the selected destination",
    currency: "Price shown in USD for this concept offer",
    pros: [
      "A lower starting price for a short getaway",
      "A simple idea for a quick change of scenery",
      "Useful inspiration when planning on a budget",
    ],
    cons: [
      "Availability and final price may change",
      "Transport and extras may not be included",
      "The destination is not fixed in this prototype",
    ],
    costs: [
      {
        category: "Promotional starting price",
        estimate: "From $299",
        icon: "pricetag-outline",
      },
      {
        category: "Transport",
        estimate: "Check offer details",
        icon: "airplane-outline",
      },
      {
        category: "Meals and extras",
        estimate: "May cost extra",
        icon: "restaurant-outline",
      },
    ],
    customs: [
      "Check the destination's local guidance before travelling.",
      "Respect local communities, beaches and wildlife.",
      "Review cancellation and booking terms before confirming.",
    ],
    tips: [
      "Compare the final total, not only the starting price.",
      "Check what accommodation and transport are included.",
      "Confirm travel dates, availability and cancellation terms before booking.",
    ],
    offer: {
      label: "LIMITED OFFER",
      price: "From $299",
      previousPrice: "Prices vary",
      includes: [
        "Budget-friendly getaway inspiration",
        "Flexible destination concept",
        "Details to be confirmed before booking",
      ],
    },
  },

  "mountain-offer": {
    id: "mountain-offer",
    name: "A little mountain escape",
    country: "Limited-time getaway",
    image:
      "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1200&q=85",
    address:
      "A hand-picked mountain stay · destination varies by availability",
    weather: "Cool mountain air · conditions vary",
    temperature: "From $349",
    description:
      "Trade busy streets for mountain views, peaceful trails and cosy evenings. This promotional concept is designed for travellers who want a refreshing change of scenery without planning an elaborate trip. The final destination, accommodation, dates and inclusions must be confirmed before booking.",
    bestTimeToVisit:
      "Seasonal availability; check weather and travel dates before booking",
    language: "Depends on the selected destination",
    currency: "Price shown in USD for this concept offer",
    pros: [
      "A starting price for a mountain-inspired getaway",
      "An opportunity to enjoy nature and outdoor activities",
      "A flexible concept for couples, friends or solo travellers",
    ],
    cons: [
      "Mountain destinations can have unpredictable weather",
      "Transport and outdoor activities may cost extra",
      "The destination and accommodation are not fixed in this prototype",
    ],
    costs: [
      {
        category: "Promotional starting price",
        estimate: "From $349",
        icon: "pricetag-outline",
      },
      {
        category: "Transport",
        estimate: "Check offer details",
        icon: "airplane-outline",
      },
      {
        category: "Activities and equipment",
        estimate: "May cost extra",
        icon: "walk-outline",
      },
    ],
    customs: [
      "Follow local trail rules and respect protected natural areas.",
      "Check weather alerts and outdoor safety guidance.",
      "Leave natural spaces clean and avoid disturbing wildlife.",
    ],
    tips: [
      "Pack layers suitable for changing mountain weather.",
      "Check whether accommodation is near the trails you want to visit.",
      "Confirm transport, activity costs and cancellation terms before booking.",
    ],
    offer: {
      label: "MOUNTAIN GETAWAY",
      price: "From $349",
      previousPrice: "Prices vary",
      includes: [
        "Mountain getaway inspiration",
        "Potential access to scenic outdoor destinations",
        "Details to be confirmed before booking",
      ],
    },
  },

  "city-offer": {
    id: "city-offer",
    name: "A little city escape",
    country: "Limited-time getaway",
    image:
      "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1200&q=85",
    address: "A hand-picked city stay · destination varies by availability",
    weather: "City weather varies by destination and season",
    temperature: "From $279",
    description:
      "A little city break for anyone who loves wandering charming streets, finding hidden cafés, exploring local shops and discovering somewhere new. This promotional concept offers an affordable starting point for a short urban getaway. The actual city, accommodation, dates, transport and inclusions must be confirmed before booking.",
    bestTimeToVisit:
      "Available dates and ideal seasons depend on the selected city",
    language: "Depends on the selected destination",
    currency: "Price shown in USD for this concept offer",
    pros: [
      "An affordable starting point for a short city break",
      "Plenty of opportunities to explore food, culture and local shops",
      "Suitable for a weekend away or a longer city stay",
    ],
    cons: [
      "Popular cities can have expensive food and attractions",
      "Flights, local transport and activities may cost extra",
      "The destination and accommodation are not fixed in this prototype",
    ],
    costs: [
      {
        category: "Promotional starting price",
        estimate: "From $279",
        icon: "pricetag-outline",
      },
      {
        category: "Local transport",
        estimate: "Check offer details",
        icon: "bus-outline",
      },
      {
        category: "Food and attractions",
        estimate: "Budget separately",
        icon: "restaurant-outline",
      },
    ],
    customs: [
      "Respect local customs, public spaces and residential neighbourhoods.",
      "Check local guidance for public transport and visitor attractions.",
      "Be considerate when photographing people and private property.",
    ],
    tips: [
      "Make a shortlist of neighbourhoods and attractions before travelling.",
      "Check whether public transport passes could help you save money.",
      "Compare accommodation locations and confirm what the offer includes.",
    ],
    offer: {
      label: "CITY BREAK",
      price: "From $279",
      previousPrice: "Prices vary",
      includes: [
        "City-break inspiration",
        "Potential access to cultural and urban destinations",
        "Details to be confirmed before booking",
      ],
    },
  },

  "island-offer": {
    id: "island-offer",
    name: "A little island escape",
    country: "Limited-time getaway",
    image:
      "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=1200&q=85",
    address: "A hand-picked island stay · destination varies by availability",
    weather: "Warm coastal weather · conditions vary",
    temperature: "From $399",
    description:
      "Dreaming of turquoise water, sandy beaches and slow mornings? This island getaway concept is made for travellers who want to unwind somewhere beautiful. The promotional price is an illustrative starting point, not a confirmed booking price. The island, accommodation, dates, transport and final inclusions must be verified before booking.",
    bestTimeToVisit:
      "Depends on the selected island, rainy seasons and local weather conditions",
    language: "Depends on the selected destination",
    currency: "Price shown in USD for this concept offer",
    pros: [
      "A starting price for a relaxing island-inspired getaway",
      "An opportunity to enjoy beaches, coastal walks and ocean views",
      "A flexible idea for a romantic or restorative holiday",
    ],
    cons: [
      "Island transport can be expensive or limited",
      "Weather and seasonal conditions may affect activities",
      "Flights, ferries, meals and excursions may not be included",
    ],
    costs: [
      {
        category: "Promotional starting price",
        estimate: "From $399",
        icon: "pricetag-outline",
      },
      {
        category: "Flights or ferry transfers",
        estimate: "Check offer details",
        icon: "airplane-outline",
      },
      {
        category: "Meals and excursions",
        estimate: "May cost extra",
        icon: "restaurant-outline",
      },
    ],
    customs: [
      "Respect local communities, beaches and marine wildlife.",
      "Follow local swimming, boating and water-safety guidance.",
      "Avoid disturbing coral reefs and other fragile coastal environments.",
    ],
    tips: [
      "Check the island's rainy season and expected travel conditions.",
      "Confirm how you will travel from the airport or ferry terminal to your stay.",
      "Review baggage restrictions, transfers and cancellation terms before booking.",
    ],
    offer: {
      label: "ISLAND GETAWAY",
      price: "From $399",
      previousPrice: "Prices vary",
      includes: [
        "Island getaway inspiration",
        "Potential access to coastal and island destinations",
        "Details to be confirmed before booking",
      ],
    },
  },

  calgary: {
    id: "calgary",
    name: "Calgary",
    country: "Canada",
    image:
      "https://images.unsplash.com/photo-1517935706615-2717063c2225?auto=format&fit=crop&w=1200&q=85",
    address: "Calgary, Alberta, Canada",
    weather: "Four distinct seasons · check the forecast before travelling",
    temperature: "Seasonal",
    description:
      "Calgary is a lively Alberta city with a walkable downtown, river pathways, great food, arts venues and easy access to the Canadian Rockies. These sample offers are mockups for the ROMR prototype, not live travel prices.",
    bestTimeToVisit:
      "June–September for warm weather; December–March for winter activities",
    language: "English",
    currency: "Canadian dollar (CAD)",
    pros: [
      "Easy access to the Canadian Rockies",
      "A lively food and arts scene",
      "River pathways and urban parks",
    ],
    cons: [
      "Weather can change quickly",
      "Some mountain trips require a car or tour",
      "Prices vary by event and season",
    ],
    costs: [
      {
        category: "Casual meal",
        estimate: "C$18–35",
        icon: "restaurant-outline",
      },
      {
        category: "Local transit",
        estimate: "Check current fares",
        icon: "bus-outline",
      },
      {
        category: "Hotel room",
        estimate: "Varies by date and area",
        icon: "bed-outline",
      },
    ],
    customs: [
      "Be considerate in shared public spaces.",
      "Check local weather before outdoor activities.",
      "Follow posted park and pathway guidance.",
    ],
    tips: [
      "Compare flight and hotel dates before booking.",
      "Consider adding a day trip to Banff if time allows.",
      "These ROMR offer cards are demonstration content only.",
    ],
  },
};

export const thingsToDo: TravelCardData[] = [
  {
    id: "tokyo",
    title: "Tokyo Tower, Japan",
    image:
      "https://images.unsplash.com/photo-1536098561742-ca998e48cbcc?auto=format&fit=crop&w=700&q=80",
    price: "From ¥1,200",
    rating: "4.7",
    tag: "Popular",
  },
  {
    id: "resort",
    title: "Lake Como, Italy",
    image:
      "https://images.unsplash.com/photo-1516483638261-f4dbaf036963?auto=format&fit=crop&w=700&q=80",
    price: "From €35",
    rating: "4.6",
    tag: "",
  },
  {
    id: "sky",
    title: "Blue Lagoon, Iceland",
    image:
      "https://images.unsplash.com/photo-1476610182048-b716b8518aae?auto=format&fit=crop&w=700&q=80",
    price: "Check entry prices",
    rating: "4.8",
    tag: "",
  },
];

export const communityTrips: TravelCardData[] = [
  {
    id: "midlife",
    title: "A slow week in Kyoto",
    image:
      "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=700&q=80",
    price: "From $2,300",
    rating: "4.8",
    tag: "Community pick",
  },
  {
    id: "work",
    title: "A quiet cabin escape",
    image:
      "https://images.unsplash.com/photo-1449158743715-0a90ebb6d2d8?auto=format&fit=crop&w=700&q=80",
    price: "From $180",
    rating: "5.0",
    tag: "",
  },
  {
    id: "aurora",
    title: "Northern lights trip",
    image:
      "https://images.unsplash.com/photo-1531366936337-7c912a4589a7?auto=format&fit=crop&w=700&q=80",
    price: "From $450",
    rating: "4.9",
    tag: "",
  },
];

export const bestOffers: TravelCardData[] = [
  {
    id: "beach",
    title: "A little beach escape",
    image:
      "https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&w=1200&q=85",
    price: "From $299",
    rating: "4.9",
    tag: "LIMITED OFFER",
  },
  {
    id: "mountain",
    title: "A little mountain escape",
    image:
      "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1200&q=85",
    price: "From $349",
    rating: "4.8",
    tag: "MOUNTAIN GETAWAY",
  },
  {
    id: "city",
    title: "A little city escape",
    image:
      "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1200&q=85",
    price: "From $279",
    rating: "4.9",
    tag: "CITY BREAK",
  },
  {
    id: "island",
    title: "A little island escape",
    image:
      "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=1200&q=85",
    price: "From $399",
    rating: "4.8",
    tag: "ISLAND GETAWAY",
  },
];

export const fallPlaces: InspirationCard[] = [
  {
    id: "kyoto",
    title: "Kyoto, Japan",
    subtitle: "Copper leaves around quiet temples",
    image:
      "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=900&q=85",
    badge: "01 · AUTUMN",
  },
  {
    id: "dolomites",
    title: "The Dolomites",
    subtitle: "Golden larches and mountain air",
    image:
      "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=900&q=85",
    badge: "02 · OUTDOORS",
  },
  {
    id: "banff",
    title: "Banff, Canada",
    subtitle: "Larch trails and crisp lake views",
    image:
      "https://images.unsplash.com/photo-1503614472-8c93d56e92ce?q=80&w=1111&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D",
    badge: "03 · NATURE",
  },
  {
    id: "paris",
    title: "Paris, France",
    subtitle: "Leafy parks and café afternoons",
    image:
      "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=900&q=85",
    badge: "04 · CITY",
  },
  {
    id: "lucerne",
    title: "Lucerne, Switzerland",
    subtitle: "Lake walks with mountain backdrops",
    image:
      "https://images.unsplash.com/photo-1531366936337-7c912a4589a7?auto=format&fit=crop&w=900&q=85",
    badge: "05 · LAKESIDE",
  },
  {
    id: "reykjavik",
    title: "Reykjavík, Iceland",
    subtitle: "Moody skies and aurora season",
    image:
      "https://images.unsplash.com/photo-1476610182048-b716b8518aae?auto=format&fit=crop&w=900&q=85",
    badge: "06 · NORTHERN",
  },
  {
    id: "marrakech",
    title: "Marrakech, Morocco",
    subtitle: "Warm days and colourful souks",
    image:
      "https://images.unsplash.com/photo-1597212618440-806262de4f6b?auto=format&fit=crop&w=900&q=85",
    badge: "07 · WARMER DAYS",
  },
  {
    id: "oia",
    title: "Oia, Greece",
    subtitle: "Quieter island views after summer",
    image:
      "https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?auto=format&fit=crop&w=900&q=85",
    badge: "08 · COAST",
  },
  {
    id: "patagonia",
    title: "Patagonia",
    subtitle: "Springtime hikes in the south",
    image:
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=900&q=85",
    badge: "09 · ADVENTURE",
  },
  {
    id: "bali",
    title: "Ubud, Indonesia",
    subtitle: "Tropical greenery between showers",
    image:
      "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=900&q=85",
    badge: "10 · TROPICAL",
  },
];

export const nicheCities: InspirationCard[] = [
  {
    id: "lucerne",
    title: "Lucerne, Switzerland",
    subtitle: "A storybook old town beside the lake",
    image:
      "https://images.unsplash.com/photo-1531366936337-7c912a4589a7?auto=format&fit=crop&w=900&q=85",
    badge: "SLOW & SCENIC",
  },
  {
    id: "marrakech",
    title: "Marrakech, Morocco",
    subtitle: "Hidden riads, gardens and tiny lanes",
    image:
      "https://images.unsplash.com/photo-1597212618440-806262de4f6b?auto=format&fit=crop&w=900&q=85",
    badge: "SENSORY CITY",
  },
  {
    id: "reykjavik",
    title: "Reykjavík, Iceland",
    subtitle: "Creative cafés and coastal landscapes",
    image:
      "https://images.unsplash.com/photo-1476610182048-b716b8518aae?auto=format&fit=crop&w=900&q=85",
    badge: "NORDIC MOOD",
  },
  {
    id: "oia",
    title: "Oia, Greece",
    subtitle: "Small lanes and sea-facing corners",
    image:
      "https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?auto=format&fit=crop&w=900&q=85",
    badge: "ISLAND CHARM",
  },
  {
    id: "kyoto",
    title: "Kyoto, Japan",
    subtitle: "Traditional streets and tucked-away tea shops",
    image:
      "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=900&q=85",
    badge: "CULTURE FIND",
  },
];

export const cityEscapes2026: InspirationCard[] = [
  {
    id: "paris",
    title: "Paris, France",
    subtitle: "Art, neighbourhood cafés and iconic streets",
    image:
      "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=900&q=85",
    badge: "CITY CLASSIC",
  },
  {
    id: "kyoto",
    title: "Kyoto, Japan",
    subtitle: "Temples, food lanes and seasonal gardens",
    image:
      "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=900&q=85",
    badge: "CULTURE",
  },
  {
    id: "marrakech",
    title: "Marrakech, Morocco",
    subtitle: "Markets, design stays and local flavours",
    image:
      "https://images.unsplash.com/photo-1597212618440-806262de4f6b?auto=format&fit=crop&w=900&q=85",
    badge: "COLOURFUL",
  },
  {
    id: "reykjavik",
    title: "Reykjavík, Iceland",
    subtitle: "A compact capital with big nature nearby",
    image:
      "https://images.unsplash.com/photo-1476610182048-b716b8518aae?auto=format&fit=crop&w=900&q=85",
    badge: "NORTHBOUND",
  },
  {
    id: "lucerne",
    title: "Lucerne, Switzerland",
    subtitle: "Easygoing city days and alpine views",
    image:
      "https://images.unsplash.com/photo-1531366936337-7c912a4589a7?auto=format&fit=crop&w=900&q=85",
    badge: "SCENIC BREAK",
  },
];