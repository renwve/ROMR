export type ContinentId =
  | "asia"
  | "europe"
  | "north-america"
  | "south-america"
  | "africa"
  | "oceania"
  | "antarctica";

export type Country = {
  code: string;
  name: string;
  continent: ContinentId;
  flag: string;
  path: string;
};

export type Trip = {
  id: string;
  place: string;
  country: string;
  start: string;
  end: string;
  note: string;
  everest: boolean;
};

export type Person = {
  id: string;
  name: string;
  username: string;
  emoji: string;
  followsMe: boolean;
  following: boolean;
};

export type ThemeName = "light" | "dark";

export type ProfileState = {
  name: string;
  username: string;
  bio: string;
  avatar: string | null;
  theme: ThemeName | null;
  trips: Trip[];
  people: Person[];
  manual: string[];
  demoUnlocked: string[];
};

export type Achievement = {
  id: string;
  icon: string;
  title: string;
  desc: string;
  real: boolean;
};

export type AchievementGroup = {
  title: string;
  sub: string;
  items: Achievement[];
};
