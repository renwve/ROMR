import { COUNTRIES } from "./data/countries";
import { CONTINENTS, TIERS } from "./data/continents";
import { AchievementGroup, ProfileState, Trip } from "./types";

export function visitedSet(state: Pick<ProfileState, "trips" | "manual">): Set<string> {
  const visited = new Set<string>();
  state.trips.forEach((t) => visited.add(t.country));
  state.manual.forEach((c) => visited.add(c));
  return visited;
}

export function worldPercent(visited: Set<string>): number {
  return Math.round((visited.size / COUNTRIES.length) * 100);
}

const WORLD_ICONS: Record<number, string> = { 25: "🌍", 50: "🗺️", 75: "🧳", 100: "🏆" };

export function buildAchievements(visited: Set<string>, trips: Trip[]): AchievementGroup[] {
  const pct = worldPercent(visited);

  const world = TIERS.map((n) => ({
    id: `pct${n}`,
    icon: WORLD_ICONS[n],
    title: `${n}% Explorer`,
    desc: `Visited ${n}% of the world`,
    real: pct >= n,
  }));

  world.push({
    id: "everest",
    icon: "🏔️",
    title: "Mount Everest",
    desc: "You’ve climbed Mount Everest",
    real: trips.some((t) => t.everest),
  });

  let everyContinent = true;
  const groups: AchievementGroup[] = [];

  CONTINENTS.forEach((c) => {
    const inContinent = COUNTRIES.filter((x) => x.continent === c.id);
    const total = inContinent.length;
    const seen = inContinent.filter((x) => visited.has(x.code)).length;
    if (!seen) everyContinent = false;

    groups.push({
      title: `${c.icon} ${c.title}`,
      sub: `${seen} of ${total} visited`,
      items: TIERS.map((n) => {
        const need = Math.ceil((total * n) / 100);
        return {
          id: `${c.id}-${n}`,
          icon: c.icon,
          title: `${n}%`,
          desc: `${need} of ${total} countries`,
          real: total > 0 && seen >= need,
        };
      }),
    });
  });

  world.push({
    id: "all7",
    icon: "🌐",
    title: "All 7 Continents",
    desc: "Visited every continent",
    real: everyContinent,
  });

  return [{ title: "🌍 World", sub: "", items: world }, ...groups];
}
