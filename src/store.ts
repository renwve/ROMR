import { useCallback, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ProfileState } from "./types";

const STORAGE_KEY = "romr_profile_v2";

export const DEFAULT_STATE: ProfileState = {
  name: "Alex Rivera",
  username: "alexroams",
  bio: "Chasing sunsets and street food. Planning the next trip with Romr.",
  avatar: null,
  theme: null,
  demoUnlocked: [],
  manual: [],
  trips: [
    { id: "t1", place: "Tokyo", country: "JPN", start: "2025-03-02", end: "2025-03-12", note: "Ramen every day.", everest: false },
    { id: "t2", place: "Paris", country: "FRA", start: "2024-06-10", end: "2024-06-17", note: "", everest: false },
    { id: "t3", place: "New York", country: "USA", start: "2023-12-20", end: "2023-12-27", note: "Holiday trip.", everest: false },
  ],
  people: [
    { id: "p1", name: "Maya Chen", username: "mayaexplores", emoji: "🌸", followsMe: true, following: true },
    { id: "p2", name: "Jordan Lee", username: "jlee.travels", emoji: "🎒", followsMe: true, following: false },
    { id: "p3", name: "Sam Okafor", username: "samgoesplaces", emoji: "🌍", followsMe: false, following: true },
    { id: "p4", name: "Priya Nair", username: "priyainparis", emoji: "🥐", followsMe: true, following: true },
    { id: "p5", name: "Luca Rossi", username: "lucaroams", emoji: "🍕", followsMe: true, following: false },
    { id: "p6", name: "Emma Wilson", username: "emmaweekends", emoji: "⛰️", followsMe: false, following: true },
    { id: "p7", name: "Kai Tanaka", username: "kaitrips", emoji: "🗻", followsMe: true, following: true },
    { id: "p8", name: "Noor Hassan", username: "noorabroad", emoji: "🐪", followsMe: true, following: false },
  ],
};

type Patch = Partial<ProfileState> | ((s: ProfileState) => Partial<ProfileState>);

export function useProfile() {
  const [state, setState] = useState<ProfileState>(DEFAULT_STATE);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((raw) => {
        if (raw) setState({ ...DEFAULT_STATE, ...JSON.parse(raw) });
      })
      .catch(() => {})
      .finally(() => setReady(true));
  }, []);

  useEffect(() => {
    if (ready) AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state)).catch(() => {});
  }, [state, ready]);

  const update = useCallback((patch: Patch) => {
    setState((s) => ({ ...s, ...(typeof patch === "function" ? patch(s) : patch) }));
  }, []);

  const reset = useCallback(() => setState(DEFAULT_STATE), []);

  return { state, ready, update, reset };
}
