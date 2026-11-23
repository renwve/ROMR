import { createContext, type ReactNode, useContext, useState } from 'react';

export type Collection = {
  id: string;
  name: string;
  // Ids of the saves picked for it.
  saveIds: string[];
};

type CollectionsValue = {
  // The user's own collections, newest first. (The Everything Collection isn't
  // one of these: it's every save, always.)
  collections: Collection[];
  addCollection: (name: string, saveIds: string[]) => void;
  removeCollection: (id: string) => void;
};

const CollectionsContext = createContext<CollectionsValue | null>(null);

// The user's collections, kept in memory for now (there's no backend yet, so
// they're gone when the app restarts).
export function CollectionsProvider({ children }: { children: ReactNode }) {
  const [collections, setCollections] = useState<Collection[]>([]);

  const addCollection = (name: string, saveIds: string[]) => {
    setCollections((current) => [
      { id: `${Date.now()}-${current.length}`, name, saveIds },
      ...current,
    ]);
  };

  const removeCollection = (id: string) => {
    setCollections((current) => current.filter((collection) => collection.id !== id));
  };

  return (
    <CollectionsContext.Provider value={{ collections, addCollection, removeCollection }}>
      {children}
    </CollectionsContext.Provider>
  );
}

export function useCollections() {
  const value = useContext(CollectionsContext);
  if (!value) throw new Error('useCollections needs a CollectionsProvider above it.');
  return value;
}
