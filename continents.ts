import { ContinentId } from "../types";

export const CONTINENTS: { id: ContinentId; icon: string; title: string }[] = [
  { id: "asia", icon: "🏯", title: "Asia" },
  { id: "europe", icon: "🏰", title: "Europe" },
  { id: "north-america", icon: "🗽", title: "North America" },
  { id: "south-america", icon: "🌋", title: "South America" },
  { id: "africa", icon: "🦁", title: "Africa" },
  { id: "oceania", icon: "🦘", title: "Oceania" },
  { id: "antarctica", icon: "🐧", title: "Antarctica" },
];

export const TIERS = [25, 50, 75, 100];
