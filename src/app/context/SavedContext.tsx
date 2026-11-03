import React, { createContext, useContext, useState } from "react";

type SavedContextType = {
  savedItems: string[];
  toggleSaved: (id: string) => void;
};

const SavedContext = createContext<SavedContextType | undefined>(undefined);

export function SavedProvider({ children }: { children: React.ReactNode }) {
  const [savedItems, setSavedItems] = useState<string[]>([]);

  const toggleSaved = (id: string) => {
    setSavedItems((previous) =>
      previous.includes(id)
        ? previous.filter((item) => item !== id)
        : [...previous, id],
    );
  };

  return (
    <SavedContext.Provider value={{ savedItems, toggleSaved }}>
      {children}
    </SavedContext.Provider>
  );
}

export function useSaved() {
  const context = useContext(SavedContext);

  if (!context) {
    throw new Error("useSaved must be used inside SavedProvider");
  }

  return context;
}
