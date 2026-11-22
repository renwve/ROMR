import type { ReactNode } from 'react';
import { Keyboard, Pressable, StyleSheet } from 'react-native';

// Fills the page; a tap on any empty part of it puts the keyboard away.
// Buttons inside still take their own taps first.
export function DismissKeyboard({ children }: { children: ReactNode }) {
  return (
    <Pressable accessible={false} onPress={Keyboard.dismiss} style={styles.fill}>
      {children}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  fill: {
    flex: 1,
    // Not a link or button on web: no pointer cursor.
    cursor: 'auto',
  },
});
