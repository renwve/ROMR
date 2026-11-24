import { createContext, useContext, useState, type ReactNode } from 'react';

type ToastValue = {
  // Changes every time the toast is asked for (0 = never yet), so asking again
  // while it's up shows it afresh.
  planSavedKey: number;
  showPlanSaved: () => void;
};

const ToastContext = createContext<ToastValue | null>(null);

// The "Plan Saved" toast's trigger, shared by every heart on the tab pages and
// the nav bar, which shows the toast just above itself.
export function ToastProvider({ children }: { children: ReactNode }) {
  const [planSavedKey, setPlanSavedKey] = useState(0);

  return (
    <ToastContext.Provider
      value={{ planSavedKey, showPlanSaved: () => setPlanSavedKey((key) => key + 1) }}>
      {children}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const value = useContext(ToastContext);
  if (!value) throw new Error('useToast needs a ToastProvider above it.');
  return value;
}
