import { createContext, useContext, useState, type ReactNode } from 'react';

import { ChooseCollectionSheet } from './ChooseCollectionSheet';

type ToastValue = {
  // Changes every time the toast is asked for (0 = never yet), so asking again
  // while it's up shows it afresh.
  planSavedKey: number;
  // The Daily Rec (its page id) the toast is about, if the heart was for one.
  planSavedId: string | null;
  showPlanSaved: (saveId?: string) => void;
  // The toast's "Edit": opens Figma "Choose Collection" for that rec.
  openChooseCollection: () => void;
};

const ToastContext = createContext<ToastValue | null>(null);

// The "Plan Saved" toast's trigger, shared by every heart on the tab pages and
// the nav bar, which shows the toast just above itself. Also draws the toast's
// Choose Collection sheet, over every page and the nav bar.
export function ToastProvider({ children }: { children: ReactNode }) {
  const [planSavedKey, setPlanSavedKey] = useState(0);
  const [planSavedId, setPlanSavedId] = useState<string | null>(null);
  // The rec the sheet is choosing collections for, while it's showing, and
  // whether it's open or on its way out (it stays until it has slid away).
  const [sheet, setSheet] = useState<{ saveId: string; open: boolean } | null>(null);

  return (
    <ToastContext.Provider
      value={{
        planSavedKey,
        planSavedId,
        showPlanSaved: (saveId) => {
          setPlanSavedId(saveId ?? null);
          setPlanSavedKey((key) => key + 1);
        },
        openChooseCollection: () => {
          if (planSavedId) setSheet({ saveId: planSavedId, open: true });
        },
      }}>
      {children}
      {sheet ? (
        <ChooseCollectionSheet
          saveId={sheet.saveId}
          open={sheet.open}
          onClose={() => setSheet((current) => current && { ...current, open: false })}
          onClosed={() => setSheet(null)}
        />
      ) : null}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const value = useContext(ToastContext);
  if (!value) throw new Error('useToast needs a ToastProvider above it.');
  return value;
}
