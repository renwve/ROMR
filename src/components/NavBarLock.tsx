import { createContext, useCallback, useContext, useState, type ReactNode } from 'react';

type NavBarLockValue = {
  // While set, the nav bar's buttons don't respond: a tap anywhere on the bar
  // calls this instead (e.g. to close a menu that's open on the page).
  onLockedTap: (() => void) | null;
  setOnLockedTap: (onTap: (() => void) | null) => void;
};

const NavBarLockContext = createContext<NavBarLockValue | null>(null);

// Lets a page lock the nav bar while something on it needs the user's
// attention, such as a collection's menu on Saved.
export function NavBarLockProvider({ children }: { children: ReactNode }) {
  const [onLockedTap, setTap] = useState<(() => void) | null>(null);
  // Stable, so pages can set it from an effect. (A function in state has to be
  // set through an updater.)
  const setOnLockedTap = useCallback((onTap: (() => void) | null) => setTap(() => onTap), []);

  return (
    <NavBarLockContext.Provider value={{ onLockedTap, setOnLockedTap }}>
      {children}
    </NavBarLockContext.Provider>
  );
}

export function useNavBarLock() {
  const value = useContext(NavBarLockContext);
  if (!value) throw new Error('useNavBarLock needs a NavBarLockProvider above it.');
  return value;
}
