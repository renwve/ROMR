import { createContext, type ReactNode, useContext, useState } from 'react';

// The Everything Collection's id, beside the user's own collections' (and in
// its page's route, /collection?id=everything).
export const EVERYTHING_ID = 'everything';

type SavesValue = {
  // The page ids of the Daily Recs the user has hearted, newest first: The
  // Everything Collection.
  savedIds: string[];
  isSaved: (id: string) => boolean;
  // Hearts the rec, or un-hearts it if it's already saved.
  toggleSave: (id: string) => void;
};

const SavesContext = createContext<SavesValue | null>(null);

// What the user has saved, shared by every heart on a Daily Rec (its card on
// Explore and the bar on its page) and by Saved. Kept in memory for now (there's
// no backend yet, so saves are gone when the app restarts).
export function SavesProvider({ children }: { children: ReactNode }) {
  const [savedIds, setSavedIds] = useState<string[]>([]);

  const isSaved = (id: string) => savedIds.includes(id);

  const toggleSave = (id: string) => {
    setSavedIds((current) =>
      current.includes(id) ? current.filter((savedId) => savedId !== id) : [id, ...current],
    );
  };

  return (
    <SavesContext.Provider value={{ savedIds, isSaved, toggleSave }}>
      {children}
    </SavesContext.Provider>
  );
}

export function useSaves() {
  const value = useContext(SavesContext);
  if (!value) throw new Error('useSaves needs a SavesProvider above it.');
  return value;
}
