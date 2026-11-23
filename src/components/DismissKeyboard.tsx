import type { ReactNode } from 'react';
import { Keyboard, StyleSheet, View } from 'react-native';

// Fills the page; while the keyboard is up, a tap on any empty part of it puts
// the keyboard away. Buttons inside still take their own taps first.
//
// It only claims touches while the keyboard is showing: a touch-claiming
// wrapper (like a Pressable) around the page stops Android's scroll views from
// picking up swipes that start on plain content.
export function DismissKeyboard({ children }: { children: ReactNode }) {
  return (
    <View
      style={styles.fill}
      onStartShouldSetResponder={() => Keyboard.isVisible?.() ?? false}
      onResponderRelease={() => Keyboard.dismiss()}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  fill: {
    flex: 1,
  },
});
