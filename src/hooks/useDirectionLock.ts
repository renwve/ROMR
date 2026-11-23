import { Gesture } from 'react-native-gesture-handler';
import { useSharedValue } from 'react-native-reanimated';

// Direction lock: decides early whether a drag is sideways or up-and-down, then
// sticks with it until the finger lifts, so a sideways swipe that drifts a bit
// never turns into a page scroll (and vice versa).
//
// How it decides, once the finger has moved SLOP points from where it landed:
//   - within HORIZONTAL_MAX_ANGLE of flat    → sideways
//   - within 90 − VERTICAL_MIN_ANGLE of upright → up-and-down
//   - anywhere between, it keeps watching until the finger has moved
//     DECIDE_DISTANCE, then goes with whichever axis moved more.
//
// Tuning: raise HORIZONTAL_MAX_ANGLE to forgive sloppier sideways swipes (at the
// cost of diagonal scrolls being caught as swipes); lower SLOP for a quicker
// decision (at the cost of more misreads from jittery fingers).
export const SLOP = 10;
export const HORIZONTAL_MAX_ANGLE = 30;
export const VERTICAL_MIN_ANGLE = 60;
export const DECIDE_DISTANCE = 30;

type Axis = 'horizontal' | 'vertical';

// A pan gesture that only activates for drags along `axis`, and fails (handing
// the touch on) for drags along the other one. Runs entirely on the UI thread.
export function useDirectionLock(axis: Axis) {
  const startX = useSharedValue(0);
  const startY = useSharedValue(0);
  const decided = useSharedValue(false);

  return Gesture.Pan()
    .manualActivation(true)
    .onTouchesDown((event) => {
      'worklet';
      const touch = event.allTouches[0];
      if (!touch || event.numberOfTouches > 1) return;
      startX.set(touch.absoluteX);
      startY.set(touch.absoluteY);
      decided.set(false);
    })
    .onTouchesMove((event, manager) => {
      'worklet';
      const touch = event.allTouches[0];
      if (decided.get() || !touch) return;
      const dx = Math.abs(touch.absoluteX - startX.get());
      const dy = Math.abs(touch.absoluteY - startY.get());
      const distance = Math.hypot(dx, dy);
      if (distance < SLOP) return;

      const angle = (Math.atan2(dy, dx) * 180) / Math.PI;
      let locked: Axis | null = null;
      if (angle <= HORIZONTAL_MAX_ANGLE) locked = 'horizontal';
      else if (angle >= VERTICAL_MIN_ANGLE) locked = 'vertical';
      else if (distance >= DECIDE_DISTANCE) locked = dx >= dy ? 'horizontal' : 'vertical';
      if (locked === null) return;

      decided.set(true);
      if (locked === axis) manager.activate();
      else manager.fail();
    });
}
