import { createContext, useContext, useState, type ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

// A full-screen layer drawn over the planner, header included, so a screen can
// float something (the sort menu) above everything without it being clipped.
const OverlayContext = createContext<(node: ReactNode) => void>(() => {});

export function PlannerOverlayHost({ children }: { children: ReactNode }) {
  const [overlay, setOverlay] = useState<ReactNode>(null);
  return (
    <OverlayContext.Provider value={setOverlay}>
      {children}
      <View style={StyleSheet.absoluteFill} pointerEvents="box-none">
        {overlay}
      </View>
    </OverlayContext.Provider>
  );
}

export function useSetPlannerOverlay() {
  return useContext(OverlayContext);
}
