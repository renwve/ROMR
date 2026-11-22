import { useAnimatedKeyboard } from 'react-native-reanimated';

// The on-screen keyboard's height as a shared value, updated every frame of its
// animation so views can move in step with it.
//
// Reanimated's useAnimatedKeyboard is deprecated in favour of
// react-native-keyboard-controller, but that library isn't in Expo Go. Swap the
// body of this hook for its useKeyboardHandler once the app uses a development build.
export function useKeyboardHeight() {
  // The app draws edge-to-edge on Android, behind both system bars.
  return useAnimatedKeyboard({
    isStatusBarTranslucentAndroid: true,
    isNavigationBarTranslucentAndroid: true,
  }).height;
}
