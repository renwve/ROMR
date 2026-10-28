import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  Image,
  ImageBackground,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import PlaceDetailsModal, {
  type PlaceDetails,
} from "../../../components/placedetailsmodal";

const SCREEN_WIDTH = Dimensions.get("window").width;
const SCREEN_HEIGHT = Dimensions.get("window").height;
const COLLAPSED_HEIGHT = 170;
const EXPANDED_HEIGHT = Math.min(SCREEN_HEIGHT * 0.7, 590);

const COLORS = {
  cream: "#FCF7DF",
  blue: "#C7D3DB",
  taupe: "#A79A8A",
  chocolate: "#3E3630",
  white: "#FFFFFF",
  black: "#000000",
  background: "#E7E7F1",
  purple: "#7774AE",
};

const FONTS = {
  regular: "BeVietnamProRegular",
  semibold: "BeVietnamProSemiBold",
  italics: "BeVietnamProItalics",
  semiboldItalics: "BeVietnamProSemiBoldItalics",
};

const destinations = [
  {
    id: "oia",
    name: "Oia, Greece",
    subtitle: "Daily Recs",
    country: "Greece",
    image:
      "https://images.unsplash.com/photo-1580502304784-8985b7eb7260?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D",
    weather: "Mediterranean sunshine",
    temperature: "20°C",
    description: "Whitewashed buildings, blue seas and slow afternoons.",
  },
  {
    id: "kyoto",
    name: "Kyoto, Japan",
    subtitle: "Culture & Calm",
    country: "Japan",
    image:
      "https://images.unsplash.com/photo-1558870832-c8db4b5b47d1?q=80&w=688&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D",
    weather: "Mild seasonal weather",
    temperature: "18°C",
    description: "Quiet temples, charming streets and little cafés.",
  },
  {
    id: "amalfi",
    name: "Amalfi Coast, Italy",
    subtitle: "Coastal Escapes",
    country: "Italy",
    image:
      "https://images.unsplash.com/photo-1561956021-947f09ae0101?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D",
    weather: "Coastal sunshine",
    temperature: "24°C",
    description:
      "Colourful seaside villages, cliffside views and long lunches.",
  },
  {
    id: "bali",
    name: "Ubud, Indonesia",
    subtitle: "Island Living",
    country: "Indonesia",
    image:
      "https://plus.unsplash.com/premium_photo-1661878915254-f3163e91d870?q=80&w=1171&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D",
    weather: "Tropical and humid",
    temperature: "29°C",
    description: "Tropical greenery, rice terraces and peaceful stays.",
  },
];

type TravelCardData = {
  id: string;
  title: string;
  image: string;
  price: string;
  rating: string;
  tag: string;
};

type InspirationCard = {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  badge: string;
};

const placeDetails: Record<string, PlaceDetails> = {
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
      { category: "Casual meal", estimate: "€15–€25", icon: "restaurant-outline" },
      { category: "Local bus", estimate: "About €2–€3", icon: "bus-outline" },
      { category: "Mid-range room", estimate: "€150–€350+", icon: "bed-outline" },
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
      { category: "Casual meal", estimate: "¥800–¥1,800", icon: "restaurant-outline" },
      { category: "Local transit", estimate: "¥230–¥1,000/day", icon: "train-outline" },
      { category: "Temple entry", estimate: "Often ¥400–¥1,000", icon: "ticket-outline" },
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
      { category: "Casual meal", estimate: "€15–€30", icon: "restaurant-outline" },
      { category: "Bus or ferry", estimate: "€5–€20+ per ride", icon: "boat-outline" },
      { category: "Mid-range room", estimate: "€130–€300+", icon: "bed-outline" },
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
      { category: "Local meal", estimate: "Rp 30,000–100,000", icon: "restaurant-outline" },
      { category: "Driver / transfer", estimate: "Varies by route", icon: "car-outline" },
      { category: "Mid-range room", estimate: "Rp 500,000–1,500,000+", icon: "bed-outline" },
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
      { category: "Casual meal", estimate: "CHF 20–35", icon: "restaurant-outline" },
      { category: "Local transit", estimate: "Check local passes", icon: "train-outline" },
      { category: "Mountain excursion", estimate: "Often CHF 50+", icon: "ticket-outline" },
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
      "https://images.unsplash.com/photo-1503614472-8c93d56cd7b7?auto=format&fit=crop&w=1200&q=85",
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
      { category: "Casual meal", estimate: "C$20–35", icon: "restaurant-outline" },
      { category: "Park admission", estimate: "Check current Parks Canada fees", icon: "ticket-outline" },
      { category: "Accommodation", estimate: "Varies greatly by season", icon: "bed-outline" },
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
      { category: "Casual meal", estimate: "ISK 2,500–4,500", icon: "restaurant-outline" },
      { category: "Geothermal bath", estimate: "Varies by venue", icon: "water-outline" },
      { category: "Day tour", estimate: "Often ISK 10,000+", icon: "bus-outline" },
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
      { category: "Casual meal", estimate: "€15–€25", icon: "restaurant-outline" },
      { category: "Metro trip", estimate: "Check current RATP fares", icon: "train-outline" },
      { category: "Museum entry", estimate: "Varies by museum", icon: "ticket-outline" },
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
      { category: "Local meal", estimate: "MAD 40–120", icon: "restaurant-outline" },
      { category: "Taxi / transfer", estimate: "Agree fare in advance", icon: "car-outline" },
      { category: "Riad stay", estimate: "Varies by season", icon: "bed-outline" },
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
      { category: "Meals", estimate: "Varies by town and country", icon: "restaurant-outline" },
      { category: "Park entry", estimate: "Check each park's current fees", icon: "ticket-outline" },
      { category: "Guided trek", estimate: "Varies by route", icon: "walk-outline" },
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
      { category: "Mountain hut meal", estimate: "€15–€30", icon: "restaurant-outline" },
      { category: "Cable car", estimate: "Varies by route", icon: "ticket-outline" },
      { category: "Mountain lodging", estimate: "Book well ahead", icon: "bed-outline" },
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
      { category: "Meals", estimate: "Varies by town and tour", icon: "restaurant-outline" },
      { category: "Entry / transport", estimate: "Check official current ticket rules", icon: "ticket-outline" },
      { category: "Guided visit", estimate: "Varies by group and route", icon: "walk-outline" },
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
      { category: "Promotional starting price", estimate: "From $299", icon: "pricetag-outline" },
      { category: "Transport", estimate: "Check offer details", icon: "airplane-outline" },
      { category: "Meals and extras", estimate: "May cost extra", icon: "restaurant-outline" },
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
};

const thingsToDo: TravelCardData[] = [
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

const communityTrips: TravelCardData[] = [
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

const bestOffers: TravelCardData[] = [
  {
    id: "beach",
    title: "A little beach escape",
    image:
      "https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&w=1000&q=85",
    price: "From $299",
    rating: "4.9",
    tag: "LIMITED OFFER",
  },
];

const fallPlaces: InspirationCard[] = [
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
      "https://images.unsplash.com/photo-1503614472-8c93d56cd7b7?auto=format&fit=crop&w=900&q=85",
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

const nicheCities: InspirationCard[] = [
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

const cityEscapes2026: InspirationCard[] = [
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

const fallCountries: InspirationCard[] = [
  {
    id: "kyoto",
    title: "Japan",
    subtitle: "Maple leaves & temple gardens",
    image:
      "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=900&q=85",
    badge: "01",
  },
  {
    id: "paris",
    title: "France",
    subtitle: "Golden parks & café weather",
    image:
      "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=900&q=85",
    badge: "02",
  },
  {
    id: "dolomites",
    title: "Italy",
    subtitle: "Autumn villages & mountain trails",
    image:
      "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=900&q=85",
    badge: "03",
  },
  {
    id: "banff",
    title: "Canada",
    subtitle: "Larch trees & crisp mountain air",
    image:
      "https://images.unsplash.com/photo-1503614472-8c93d56cd7b7?auto=format&fit=crop&w=900&q=85",
    badge: "04",
  },
  {
    id: "lucerne",
    title: "Switzerland",
    subtitle: "Lakeside walks & alpine views",
    image:
      "https://images.unsplash.com/photo-1531366936337-7c912a4589a7?auto=format&fit=crop&w=900&q=85",
    badge: "05",
  },
  {
    id: "marrakech",
    title: "Morocco",
    subtitle: "Warm days & colourful souks",
    image:
      "https://images.unsplash.com/photo-1597212618440-806262de4f6b?auto=format&fit=crop&w=900&q=85",
    badge: "06",
  },
  {
    id: "oia",
    title: "Greece",
    subtitle: "Shoulder-season island views",
    image:
      "https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?auto=format&fit=crop&w=900&q=85",
    badge: "07",
  },
  {
    id: "reykjavik",
    title: "Iceland",
    subtitle: "Aurora season begins",
    image:
      "https://images.unsplash.com/photo-1476610182048-b716b8518aae?auto=format&fit=crop&w=900&q=85",
    badge: "08",
  },
  {
    id: "patagonia",
    title: "Argentina",
    subtitle: "Spring hikes in Patagonia",
    image:
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=900&q=85",
    badge: "09",
  },
  {
    id: "bali",
    title: "Indonesia",
    subtitle: "Tropical warmth and green escapes",
    image:
      "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=900&q=85",
    badge: "10",
  },
];

const worldScenery: InspirationCard[] = [
  {
    id: "patagonia",
    title: "Patagonia",
    subtitle: "Jagged peaks & glacier-blue lakes",
    image:
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=900&q=85",
    badge: "01",
  },
  {
    id: "machupicchu",
    title: "Machu Picchu",
    subtitle: "Ancient ruins in the Andes",
    image:
      "https://images.unsplash.com/photo-1526392060635-9d6019884377?auto=format&fit=crop&w=900&q=85",
    badge: "02",
  },
  {
    id: "dolomites",
    title: "The Dolomites",
    subtitle: "Pale peaks & alpine meadows",
    image:
      "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=900&q=85",
    badge: "03",
  },
  {
    id: "banff",
    title: "Canadian Rockies",
    subtitle: "Turquoise lakes & forested valleys",
    image:
      "https://images.unsplash.com/photo-1503614472-8c93d56e92ce?q=80&w=1111&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D ",
    badge: "04",
  },
  {
    id: "reykjavik",
    title: "Iceland",
    subtitle: "Waterfalls, lava fields & auroras",
    image:
      "https://images.unsplash.com/photo-1476610182048-b716b8518aae?auto=format&fit=crop&w=900&q=85",
    badge: "05",
  },
];

const hiddenGems: InspirationCard[] = [
  {
    id: "marrakech",
    title: "Marrakech, Morocco",
    subtitle: "Riads, gardens & bustling souks",
    image:
      "https://images.unsplash.com/photo-1597212618440-806262de4f6b?auto=format&fit=crop&w=900&q=85",
    badge: "LOCAL FAVOURITE",
  },
  {
    id: "lucerne",
    title: "Lucerne, Switzerland",
    subtitle: "A lakeside old town with mountain access",
    image:
      "https://images.unsplash.com/photo-1531366936337-7c912a4589a7?auto=format&fit=crop&w=900&q=85",
    badge: "SLOW TRAVEL",
  },
  {
    id: "bali",
    title: "Ubud, Indonesia",
    subtitle: "Rice terraces, craft and calm",
    image:
      "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=900&q=85",
    badge: "NATURE BREAK",
  },
];

export default function ExploreScreen() {
  const insets = useSafeAreaInsets();
  const carouselRef = useRef<ScrollView>(null);
  const heroHeight = useRef(new Animated.Value(COLLAPSED_HEIGHT)).current;
  const expandedOpacity = useRef(new Animated.Value(0)).current;

  const [activeIndex, setActiveIndex] = useState(0);
  const activeIndexRef = useRef(0);
  const [expanded, setExpanded] = useState(false);
  const [savedItems, setSavedItems] = useState<string[]>([]);
  const [selectedPlace, setSelectedPlace] = useState<PlaceDetails | null>(null);
  const [placeDetailsVisible, setPlaceDetailsVisible] = useState(false);

  const activeDestination = destinations[activeIndex];

  const toggleExpanded = () => {
    const nextExpanded = !expanded;
    setExpanded(nextExpanded);
    Animated.parallel([
      Animated.spring(heroHeight, {
        toValue: nextExpanded ? EXPANDED_HEIGHT : COLLAPSED_HEIGHT,
        useNativeDriver: false,
        damping: 22,
        stiffness: 100,
        mass: 0.9,
      }),
      Animated.timing(expandedOpacity, {
        toValue: nextExpanded ? 1 : 0,
        duration: 240,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const goToSlide = (index: number) => {
    const nextIndex = (index + destinations.length) % destinations.length;
    activeIndexRef.current = nextIndex;
    setActiveIndex(nextIndex);
    carouselRef.current?.scrollTo({
      x: nextIndex * SCREEN_WIDTH,
      y: 0,
      animated: true,
    });
  };

  useEffect(() => {
    const interval = setInterval(() => {
      const nextIndex = (activeIndexRef.current + 1) % destinations.length;
      activeIndexRef.current = nextIndex;
      setActiveIndex(nextIndex);
      carouselRef.current?.scrollTo({
        x: nextIndex * SCREEN_WIDTH,
        y: 0,
        animated: true,
      });
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const syncCarouselIndex = (
    event: NativeSyntheticEvent<NativeScrollEvent>,
  ) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const index = Math.max(
      0,
      Math.min(
        destinations.length - 1,
        Math.round(offsetX / SCREEN_WIDTH),
      ),
    );

    if (index !== activeIndexRef.current) {
      activeIndexRef.current = index;
      setActiveIndex(index);
    }
  };

  const toggleSaved = (id: string) => {
    setSavedItems((previous) =>
      previous.includes(id)
        ? previous.filter((item) => item !== id)
        : [...previous, id],
    );
  };

  const openPlace = (id: string) => {
    const place = placeDetails[id];
    if (!place) return;
    setSelectedPlace(place);
    setPlaceDetailsVisible(true);
  };

  const openTrip = () => router.push("/planner");

  const renderTravelCard = (item: TravelCardData) => {
    const isSaved = savedItems.includes(item.id);
    const detailId =
      item.id === "tokyo"
        ? "kyoto"
        : item.id === "resort"
          ? "amalfi"
          : item.id === "sky"
            ? "reykjavik"
            : item.id === "midlife"
              ? "kyoto"
              : item.id === "work"
                ? "lucerne"
                : item.id === "aurora"
                  ? "reykjavik"
                  : item.id === "beach"
                    ? "oia"
                    : item.id === "mountain"
                      ? "dolomites"
                      : "bali";

    return (
      <Pressable
        key={item.id}
        style={styles.travelCard}
        onPress={() => openPlace(detailId)}
      >
        <View style={styles.cardImageContainer}>
          <Image
            source={{ uri: item.image }}
            style={styles.cardImage}
            resizeMode="cover"
          />
          {item.tag ? (
            <View style={styles.popularTag}>
              <Text style={styles.popularTagText}>{item.tag}</Text>
            </View>
          ) : null}
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={isSaved ? "Remove from saved" : "Save destination"}
            hitSlop={8}
            style={styles.cardHeart}
            onPress={(event) => {
              event.stopPropagation();
              toggleSaved(item.id);
            }}
          >
            <Ionicons
              name={isSaved ? "heart" : "heart-outline"}
              size={23}
              color={COLORS.white}
            />
          </Pressable>
        </View>
        <Text style={styles.cardTitle} numberOfLines={1}>
          {item.title}
        </Text>
        <View style={styles.cardMeta}>
          <Text style={styles.cardPrice} numberOfLines={1}>
            {item.price}
          </Text>
          <View style={styles.ratingContainer}>
            <Ionicons name="star" size={10} color={COLORS.chocolate} />
            <Text style={styles.cardRating}>{item.rating}</Text>
          </View>
        </View>
      </Pressable>
    );
  };

  const renderSection = (title: string, data: TravelCardData[]) => (
    <View style={styles.section} key={title}>
      {title === "Our best offers" ? (
        <View style={styles.offerSection}>
          <View style={styles.inspirationHeading}>
            <View style={styles.inspirationHeadingCopy}>
              <Text style={styles.inspirationEyebrow}>
                A LITTLE SOMETHING FOR YOUR NEXT GETAWAY
              </Text>
              <Text style={styles.inspirationTitle}>Our best offers</Text>
              <Text style={styles.inspirationSubtitle}>
                Lovely escapes, a little easier on your wallet.
              </Text>
            </View>
            <View style={styles.inspirationIcon}>
              <Ionicons
                name="pricetag-outline"
                size={21}
                color={COLORS.chocolate}
              />
            </View>
          </View>
          <View style={styles.offerRow}>
            <Pressable
              style={styles.offerCard}
              onPress={() => openPlace("beach-offer")}
              accessibilityRole="button"
              accessibilityLabel="View beach escape offer"
            >
              <Image
                source={{ uri: data[0]?.image }}
                style={styles.offerImage}
                resizeMode="cover"
              />
              <View style={styles.offerImageShade} />
              <View style={styles.offerImageBadge}>
                <Text style={styles.offerImageBadgeText}>LIMITED OFFER</Text>
              </View>
              <View style={styles.offerCopy}>
                <Text style={styles.offerEyebrow}>A LITTLE BEACH ESCAPE</Text>
                <Text style={styles.offerTitle} numberOfLines={2}>
                  {data[0]?.title}
                </Text>
                <View style={styles.offerPriceRow}>
                  <Text style={styles.offerPrice}>{data[0]?.price}</Text>
                  <Text style={styles.offerWasPrice}>special price</Text>
                </View>
                <View style={styles.offerRating}>
                  <Ionicons name="star" size={11} color="#FFE4A3" />
                  <Text style={styles.offerRatingText}>
                    {data[0]?.rating} · getaway pick
                  </Text>
                </View>
              </View>
              <View style={styles.offerArrow} accessibilityLabel="See more offers">
                <Ionicons
                  name="arrow-forward"
                  size={18}
                  color={COLORS.white}
                />
              </View>
            </Pressable>
          </View>
        </View>
      ) : (
        <>
          <View style={styles.sectionHeading}>
            <Text style={styles.sectionTitle}>{title}</Text>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={`See more ${title.toLowerCase()}`}
              onPress={() => {}}
              hitSlop={10}
            >
              <Ionicons
                name="chevron-forward"
                size={20}
                color={COLORS.black}
              />
            </Pressable>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.cardsRow}
          >
            {data.map(renderTravelCard)}
          </ScrollView>
        </>
      )}
    </View>
  );

  const renderInspirationSection = (
    title: string,
    subtitle: string,
    data: InspirationCard[],
    style: "fall" | "scenery" | "gems" | "cities" | "niche",
  ) => (
    <View
      key={title}
      style={[
        styles.inspirationSection,
        style === "fall" && styles.fallSection,
        style === "scenery" && styles.scenerySection,
        style === "gems" && styles.gemsSection,
        style === "cities" && styles.citiesSection,
        style === "niche" && styles.nicheSection,
      ]}
    >
      <View style={styles.inspirationHeading}>
        <View style={styles.inspirationHeadingCopy}>
          <Text style={styles.inspirationEyebrow}>
            {style === "fall"
              ? "THE SEASONAL EDIT"
              : style === "scenery"
                ? "WORTH THE VIEW"
                : style === "cities"
                  ? "THE 2026 CITY EDIT"
                  : style === "niche"
                    ? "SMALLER SPOTS, BIG FEELING"
                    : "A LITTLE OFF THE MAP"}
          </Text>
          <Text style={styles.inspirationTitle}>{title}</Text>
          <Text style={styles.inspirationSubtitle}>{subtitle}</Text>
        </View>
        <View style={styles.inspirationIcon}>
          <Ionicons
            name={
              style === "fall"
                ? "leaf-outline"
                : style === "scenery"
                  ? "earth-outline"
                  : style === "cities"
                    ? "business-outline"
                    : style === "niche"
                      ? "sparkles-outline"
                      : "compass-outline"
            }
            size={21}
            color={COLORS.chocolate}
          />
        </View>
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.inspirationRow}
      >
        {data.map((item, index) => (
          <Pressable
            key={`${title}-${item.id}-${index}`}
            style={[
              styles.inspirationCard,
              style === "scenery" && styles.sceneryCard,
              style === "gems" && styles.gemCard,
              style === "cities" && styles.cityCard,
              style === "niche" && styles.nicheCard,
            ]}
            onPress={() => openPlace(item.id)}
          >
            <Image
              source={{ uri: item.image }}
              style={styles.inspirationImage}
              resizeMode="cover"
            />
            <View style={styles.inspirationShade} />
            <View style={styles.inspirationBadge}>
              <Text style={styles.inspirationBadgeText}>{item.badge}</Text>
            </View>
            <View style={styles.inspirationCardBottom}>
              <Text style={styles.inspirationCardTitle}>{item.title}</Text>
              <Text
                style={styles.inspirationCardSubtitle}
                numberOfLines={2}
              >
                {item.subtitle}
              </Text>
            </View>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );

  return (
    <View style={styles.screen}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent
      />
      <ScrollView
        style={styles.pageScroll}
        contentContainerStyle={[
          styles.pageContent,
          { paddingBottom: 100 + insets.bottom },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View style={[styles.hero, { height: heroHeight }]}>
          <ScrollView
            ref={carouselRef}
            horizontal
            pagingEnabled
            scrollEnabled
            showsHorizontalScrollIndicator={false}
            onScroll={syncCarouselIndex}
            onMomentumScrollEnd={syncCarouselIndex}
            scrollEventThrottle={16}
            bounces={false}
            style={styles.carousel}
          >
            {destinations.map((destination) => (
              <ImageBackground
                key={destination.id}
                source={{ uri: destination.image }}
                style={styles.heroImage}
                imageStyle={styles.heroImageStyle}
                resizeMode="cover"
              >
                <View style={styles.imageShade} />
              </ImageBackground>
            ))}
          </ScrollView>

          <View
            style={[styles.brandRow, { top: insets.top + 8 }]}
            pointerEvents="none"
          >
            <Text style={styles.brand}>ROMR*</Text>
            <Text style={styles.date}>October 27</Text>
          </View>

          <Animated.View
            pointerEvents={expanded ? "box-none" : "none"}
            style={[styles.expandedContent, { opacity: expandedOpacity }]}
          >
            <View style={styles.destinationDetails}>
              <Text style={styles.destinationSubtitle}>
                {activeDestination.subtitle}
              </Text>
              <Text style={styles.destinationName}>
                {activeDestination.name}
              </Text>
              <Text style={styles.destinationDescription}>
                {activeDestination.description}
              </Text>
              <View style={styles.weatherRow}>
                <Ionicons
                  name="sunny-outline"
                  size={23}
                  color={COLORS.white}
                />
                <Text style={styles.weatherText}>
                  {activeDestination.weather}
                </Text>
              </View>
              <View style={styles.weatherRow}>
                <Ionicons
                  name="thermometer-outline"
                  size={23}
                  color={COLORS.white}
                />
                <Text style={styles.weatherText}>
                  {activeDestination.temperature}
                </Text>
              </View>
            </View>

            <View style={styles.heroActions}>
              <Pressable
                style={styles.roundAction}
                onPress={() => toggleSaved(activeDestination.id)}
                accessibilityLabel="Save destination"
              >
                <Ionicons
                  name={
                    savedItems.includes(activeDestination.id)
                      ? "heart"
                      : "heart-outline"
                  }
                  size={24}
                  color={COLORS.white}
                />
              </Pressable>
              <Pressable
                style={styles.roundAction}
                onPress={openTrip}
                accessibilityLabel="Open trip planner"
              >
                <Ionicons
                  name="arrow-up"
                  size={25}
                  color={COLORS.white}
                  style={styles.diagonalArrow}
                />
              </Pressable>
            </View>

            <Pressable style={styles.planButton} onPress={openTrip}>
              <Text style={styles.planButtonText}>Plan this trip ✦</Text>
            </Pressable>

            <View style={styles.pagination}>
              {destinations.map((destination, index) => (
                <Pressable
                  key={destination.id}
                  accessibilityRole="button"
                  accessibilityLabel={`Show ${destination.name}`}
                  onPress={() => goToSlide(index)}
                  style={[styles.dot, activeIndex === index && styles.activeDot]}
                />
              ))}
            </View>
          </Animated.View>

          <Pressable
            accessibilityRole="button"
            accessibilityLabel={
              expanded
                ? "Collapse destination slideshow"
                : "Expand destination slideshow"
            }
            onPress={toggleExpanded}
            style={[styles.notification, { top: insets.top + 38 }]}
          >
            <View style={styles.notificationAvatar}>
              <Image
                source={{
                  uri: "https://images.unsplash.com/photo-1479090793912-eb9929f4fdb2?q=80&w=968&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D",
                }}
                style={styles.notificationAvatarImage}
              />
            </View>
            <View style={styles.notificationTextContainer}>
              <Text style={styles.notificationGreeting}>Hey, Callie</Text>
              <Text style={styles.notificationMessage} numberOfLines={1}>
                Your Japan trip planning is complete
              </Text>
            </View>
            <Ionicons
              name="notifications-outline"
              size={21}
              color={COLORS.white}
            />
          </Pressable>
        </Animated.View>

        <View style={styles.recommendations}>
          {renderInspirationSection(
            "Top 10 places to visit in fall",
            "A mix of autumn colours, cosy cities and seasonal escapes.",
            fallPlaces,
            "fall",
          )}
          {renderInspirationSection(
            "Niche cities around the world",
            "For the curious traveller who likes places with their own rhythm.",
            nicheCities,
            "niche",
          )}
          {renderInspirationSection(
            "Popular city escapes for 2026",
            "A little city inspiration for your next trip.",
            cityEscapes2026,
            "cities",
          )}
          {renderSection("Things to do near you", thingsToDo)}
          {renderSection("What others are doing", communityTrips)}
          {renderSection("Our best offers", bestOffers)}
        </View>
      </ScrollView>

      <PlaceDetailsModal
        visible={placeDetailsVisible}
        place={selectedPlace}
        isFavorite={
          selectedPlace ? savedItems.includes(selectedPlace.id) : false
        }
        onClose={() => setPlaceDetailsVisible(false)}
        onToggleFavorite={(place) => toggleSaved(place.id)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { 
    flex: 1, 
    backgroundColor: COLORS.background 
  },
  pageScroll: { 
    flex: 1 
  },
  pageContent: { 
    flexGrow: 1, 
    backgroundColor: COLORS.background 
  },
  hero: {
    width: SCREEN_WIDTH,
    overflow: "hidden",
    position: "relative",
    backgroundColor: "#16475B",
    borderBottomLeftRadius: 36,
    borderBottomRightRadius: 36,
  },
  carousel: { 
    ...StyleSheet.absoluteFill 
  },
  heroImage: {
    width: SCREEN_WIDTH,
    height: EXPANDED_HEIGHT,
    justifyContent: "flex-start",
  },
  heroImageStyle: {
    width: SCREEN_WIDTH,
    height: EXPANDED_HEIGHT,
    resizeMode: "cover",
  },
  imageShade: {
    ...StyleSheet.absoluteFill,
    backgroundColor: "rgba(0, 24, 38, 0.36)",
  },
  brandRow: {
    position: "absolute",
    left: 20,
    right: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    zIndex: 11,
  },
  brand: {
    fontFamily: FONTS.semiboldItalics,
    color: COLORS.white,
    fontSize: 12,
    letterSpacing: -0.7,
  },
  date: { 
    fontFamily: FONTS.semibold, 
    color: COLORS.white, 
    fontSize: 12 
  },
  notification: {
    position: "absolute",
    left: 18,
    right: 18,
    minHeight: 64,
    paddingVertical: 9,
    paddingHorizontal: 11,
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 36,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.65)",
    backgroundColor: "rgba(214, 226, 233, 0.32)",
    zIndex: 12,
  },
  notificationAvatar: {
    width: 35,
    height: 35,
    borderRadius: 18,
    overflow: "hidden",
    backgroundColor: "#E7E7F1",
    marginRight: 8,
  },
  notificationAvatarImage: {
    width: "100%",
    height: "100%",
    borderRadius: 18,
  },
  notificationTextContainer: {
    flex: 1,
    justifyContent: "center",
    marginRight: 6,
  },
  notificationGreeting: {
    fontFamily: FONTS.semibold,
    color: COLORS.white,
    fontSize: 15,
    lineHeight: 20,
  },
  notificationMessage: {
    fontFamily: FONTS.regular,
    color: COLORS.white,
    fontSize: 12,
    lineHeight: 17,
  },
  expandedContent: { 
    ...StyleSheet.absoluteFill, 
    zIndex: 5 
  },
  destinationDetails: {
    position: "absolute",
    top: "29%",
    left: 20,
    right: 95,
    zIndex: 3,
  },
  destinationSubtitle: {
    fontFamily: FONTS.regular,
    fontSize: 15,
    color: "rgba(255,255,255,0.9)",
    marginBottom: 0.5,
  },
  destinationName: {
    fontFamily: FONTS.semiboldItalics,
    fontSize: 35,
    lineHeight: 44,
    color: COLORS.white,
    letterSpacing: -1.2,
    marginBottom: 1,
  },
  weatherRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 2,
    gap: 7,
  },
  weatherText: {
    fontFamily: FONTS.italics,
    color: "rgba(255,255,255,0.9)",
    fontSize: 16,
  },
  destinationDescription: {
    fontFamily: FONTS.regular,
    color: "rgba(255,255,255,0.85)",
    fontSize: 12,
    lineHeight: 18,
    marginTop: 1,
  },
  heroActions: {
    position: "absolute",
    right: 24,
    top: "29%",
    alignItems: "center",
    gap: 9,
    zIndex: 4,
  },
  roundAction: {
    width: 54,
    height: 54,
    borderRadius: 28,
    backgroundColor: "rgba(220, 231, 235, 0.38)",
    borderColor: "rgba(255,255,255,0.75)",
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  diagonalArrow: { 
    transform: [{ rotate: "45deg" }] 
  },
  planButton: {
    position: "absolute",
    bottom: 63,
    alignSelf: "center",
    minHeight: 45,
    paddingHorizontal: 17,
    paddingVertical: 9,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.white,
    borderColor: "#D9B9D0",
    borderWidth: 2,
    borderRadius: 26,
    zIndex: 8,
  },
  planButtonText: {
    fontFamily: FONTS.semibold,
    fontSize: 17,
    color: "#333333",
  },
  pagination: {
    position: "absolute",
    bottom: 27,
    alignSelf: "center",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    zIndex: 8,
  },
  dot: {
    width: 16,
    height: 7,
    borderRadius: 5,
    backgroundColor: "rgba(255,255,255,0.72)",
  },
  activeDot: { 
    width: 39, 
    backgroundColor: COLORS.white 
  },
  recommendations: { 
    paddingTop: 15, 
    backgroundColor: COLORS.background 
  },
  section: { marginBottom: 18 },
  sectionHeading: {
    paddingHorizontal: 20,
    marginBottom: 11,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  sectionTitle: {
    fontFamily: FONTS.semibold,
    color: COLORS.black,
    fontSize: 17,
    letterSpacing: -0.5,
  },
  cardsRow: { 
    paddingLeft: 20, 
    paddingRight: 15, 
    gap: 12 
  },
  travelCard: { 
    width: 160 
  },
  cardImageContainer: {
    height: 146,
    width: 160,
    borderRadius: 15,
    overflow: "hidden",
    backgroundColor: COLORS.blue,
    position: "relative",
  },
  cardImage: { 
    width: "100%", 
    height: "100%" 
  },
  popularTag: {
    position: "absolute",
    top: 11,
    left: 11,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 16,
    backgroundColor: COLORS.white,
  },
  popularTagText: {
    fontFamily: FONTS.semibold,
    color: COLORS.black,
    fontSize: 11,
  },
  cardHeart: {
    position: "absolute",
    top: 10,
    right: 10,
    width: 30,
    height: 30,
    alignItems: "center",
    justifyContent: "center",
  },
  cardTitle: {
    fontFamily: FONTS.regular,
    fontSize: 11,
    color: COLORS.black,
    marginTop: 7,
    marginBottom: 3,
  },
  cardMeta: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  cardPrice: {
    fontFamily: FONTS.regular,
    color: "#555555",
    fontSize: 9,
    flexShrink: 1,
    marginRight: 4,
  },
  ratingContainer: { 
    flexDirection: "row", 
    alignItems: "center", 
    gap: 3 
  },
  cardRating: { 
    fontFamily: FONTS.regular, 
    color: "#555555", 
    fontSize: 9 
  },

  inspirationSection: {
    marginHorizontal: 14,
    marginBottom: 22,
    borderRadius: 23,
    paddingTop: 17,
    paddingBottom: 15,
    overflow: "hidden",
  },
  fallSection: { 
    backgroundColor: "#F6E6D5", 
    borderWidth: 1, 
    borderColor: "#E9D0B8" 
  },
  scenerySection: { 
    backgroundColor: "#DDE9EC", 
    borderWidth: 1, 
    borderColor: "#CADDE1" 
  },
  gemsSection: { 
    backgroundColor: "#E8E3F1", 
    borderWidth: 1, 
    borderColor: "#D9D0E8" 
  },
  citiesSection: { 
    backgroundColor: "#DDEAF4", 
    borderWidth: 1, 
    borderColor: "#C7D9E8" 
  },
  nicheSection: { 
    backgroundColor: "#E0EBDD", 
    borderWidth: 1, 
    borderColor: "#C9D9C4" 
  },
  inspirationHeading: {
    paddingHorizontal: 16,
    marginBottom: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  inspirationHeadingCopy: { 
    flex: 1, 
    paddingRight: 10 
  },
  inspirationEyebrow: {
    fontFamily: FONTS.semibold,
    fontSize: 8,
    letterSpacing: 1.5,
    color: "#6A6559",
    marginBottom: 5,
  },
  inspirationTitle: {
    fontFamily: FONTS.semiboldItalics,
    color: COLORS.chocolate,
    fontSize: 19,
    lineHeight: 25,
    letterSpacing: -0.5,
  },
  inspirationSubtitle: {
    fontFamily: FONTS.regular,
    color: "#615D58",
    fontSize: 10,
    lineHeight: 15,
    marginTop: 4,
  },
  inspirationIcon: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "rgba(255,255,255,0.62)",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.9)",
  },
  inspirationRow: { 
    paddingHorizontal: 16, 
    gap: 11 
  },
  inspirationCard: {
    width: 205,
    height: 235,
    borderRadius: 18,
    overflow: "hidden",
    backgroundColor: COLORS.blue,
    position: "relative",
  },
  sceneryCard: { 
    height: 220, 
    width: 225, 
    borderRadius: 20 
  },
  gemCard: { 
    height: 205, 
    width: 195, 
    borderRadius: 25 
  },
  cityCard: { 
    height: 225, 
    width: 215, 
    borderRadius: 16 
  },
  nicheCard: { 
    height: 215, 
    width: 195, 
    borderRadius: 22 
  },
  inspirationImage: { 
    ...StyleSheet.absoluteFill, 
    width: "100%", 
    height: "100%" },
  inspirationShade: {
    ...StyleSheet.absoluteFill,
    backgroundColor: "rgba(19,25,36,0.28)",
  },
  inspirationBadge: {
    position: "absolute",
    top: 12,
    left: 12,
    borderRadius: 14,
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: "rgba(255,255,255,0.9)",
  },
  inspirationBadgeText: {
    fontFamily: FONTS.semibold,
    color: COLORS.chocolate,
    fontSize: 8,
    letterSpacing: 0.6,
  },
  inspirationCardBottom: {
    position: "absolute",
    left: 14,
    right: 13,
    bottom: 14,
  },
  inspirationCardTitle: {
    fontFamily: FONTS.semiboldItalics,
    color: "#FFFFFF",
    fontSize: 20,
    lineHeight: 26,
  },
  inspirationCardSubtitle: {
    fontFamily: FONTS.regular,
    color: "rgba(255,255,255,0.92)",
    fontSize: 10,
    lineHeight: 15,
    marginTop: 4,
  },
  offerSection: {
    marginHorizontal: 14,
    marginBottom: 22,
    borderRadius: 23,
    paddingTop: 17,
    paddingBottom: 15,
    overflow: "hidden",
    backgroundColor: "#F6DCE5",
    borderWidth: 1,
    borderColor: "#EABBCB",
  },
  offerRow: { 
    paddingHorizontal: 16 
  },
  offerCard: {
    height: 166,
    width: "100%",
    borderRadius: 19,
    overflow: "hidden",
    backgroundColor: "#D58BA4",
    position: "relative",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.88)",
  },
  offerImage: { 
    ...StyleSheet.absoluteFill, 
    width: "100%",
    height: "100%" 
  },
  offerImageShade: {
    ...StyleSheet.absoluteFill,
    backgroundColor: "rgba(40,15,29,0.43)",
  },
  offerImageBadge: {
    position: "absolute",
    top: 11,
    left: 11,
    borderRadius: 14,
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: "rgba(255,255,255,0.92)",
  },
  offerImageBadgeText: {
    fontFamily: FONTS.semibold,
    color: "#A34D6D",
    fontSize: 8,
    letterSpacing: 0.6,
  },
  offerCopy: {
    position: "absolute",
    left: 14,
    right: 58,
    bottom: 13,
    justifyContent: "flex-end",
  },
  offerEyebrow: {
    fontFamily: FONTS.semibold,
    color: "#FFE0EA",
    fontSize: 8,
    letterSpacing: 1.1,
    marginBottom: 4,
  },
  offerTitle: {
    fontFamily: FONTS.semiboldItalics,
    color: "#FFFFFF",
    fontSize: 20,
    lineHeight: 25,
    marginBottom: 5,
  },
  offerPriceRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    gap: 6,
  },
  offerPrice: {
    fontFamily: FONTS.semibold,
    color: "#FFFFFF",
    fontSize: 12,
  },
  offerWasPrice: {
    fontFamily: FONTS.regular,
    color: "rgba(255,255,255,0.88)",
    fontSize: 9,
  },
  offerRating: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 5,
  },
  offerRatingText: {
    fontFamily: FONTS.regular,
    color: "rgba(255,255,255,0.94)",
    fontSize: 9,
  },
  offerArrow: {
    position: "absolute",
    right: 12,
    bottom: 13,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#C85D83",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.45)",
  },
});