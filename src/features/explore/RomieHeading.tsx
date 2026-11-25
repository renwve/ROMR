import { Image } from 'expo-image';
import { StyleSheet, View } from 'react-native';
import Animated, {
  type SharedValue,
  useAnimatedProps,
  useAnimatedStyle,
} from 'react-native-reanimated';
import Svg, { Defs, LinearGradient, Path, Stop } from 'react-native-svg';

import { colors } from '@/constants/theme';

const AnimatedLinearGradient = Animated.createAnimatedComponent(LinearGradient);

// "Why this is for you" in Be Vietnam Pro Medium 16, outlined by Figma so the
// gradient can fill it.
const TEXT_PATH =
  'M29.904 16H27.664L24.576 4.16H26.48L28.8 13.392L31.248 4.16H33.12L35.552 13.36L37.872 4.16H39.776L36.688 16H34.448L32.176 7.408L29.904 16ZM42.5994 16H40.7754V3.84H42.5994V8.752H42.6954C42.9194 8.32 43.5754 7.36 45.0794 7.36C46.9674 7.36 47.9594 8.8 47.9594 10.528V16H46.1354V10.72C46.1354 9.712 45.5754 8.896 44.4554 8.896C43.1434 8.896 42.5994 10.016 42.5994 11.184V16ZM49.279 19.12C48.751 19.12 48.367 19.056 48.367 19.056V17.536C48.367 17.536 48.767 17.584 49.183 17.584C50.351 17.584 51.071 17.2 51.599 16.112L48.367 7.52H50.223L52.511 13.872L54.799 7.52H56.687L53.487 15.904C52.639 18.112 51.391 19.12 49.279 19.12ZM64.0368 16.16C62.0047 16.16 61.2847 14.928 61.2847 13.472V8.992H59.7967V7.52H61.2847V5.408H63.1087V7.52H65.0928V8.992H63.1087V13.44C63.1087 14.256 63.5567 14.64 64.4367 14.64C64.8688 14.64 65.3488 14.544 65.3488 14.544V16.032C65.3488 16.032 64.7407 16.16 64.0368 16.16ZM68.3994 16H66.5754V3.84H68.3994V8.752H68.4954C68.7194 8.32 69.3754 7.36 70.8794 7.36C72.7674 7.36 73.7594 8.8 73.7594 10.528V16H71.9354V10.72C71.9354 9.712 71.3754 8.896 70.2554 8.896C68.9434 8.896 68.3994 10.016 68.3994 11.184V16ZM76.2045 6.064C75.5485 6.064 75.0685 5.552 75.0685 4.944C75.0685 4.32 75.5485 3.824 76.2045 3.824C76.8605 3.824 77.3565 4.32 77.3565 4.944C77.3565 5.568 76.8605 6.064 76.2045 6.064ZM77.1325 16H75.3085V7.52H77.1325V16ZM81.9388 16.16C78.6108 16.16 78.4028 13.392 78.4028 13.392H80.1788C80.1788 13.392 80.3388 14.704 81.9868 14.704C82.9628 14.704 83.4428 14.192 83.4428 13.6C83.4428 13.04 83.0268 12.736 82.2747 12.576L81.1228 12.32C79.7788 12.016 78.5628 11.392 78.5628 9.904C78.5628 8.432 79.7628 7.36 81.6348 7.36C84.6748 7.36 84.9148 9.872 84.9148 9.872H83.2028C83.2028 9.872 83.0428 8.784 81.6348 8.784C80.6748 8.784 80.2747 9.296 80.2747 9.792C80.2747 10.288 80.7388 10.576 81.4108 10.72L82.5468 10.976C84.0508 11.312 85.1548 12.032 85.1548 13.504C85.1548 14.976 83.9868 16.16 81.9388 16.16ZM90.1795 6.064C89.5235 6.064 89.0435 5.552 89.0435 4.944C89.0435 4.32 89.5235 3.824 90.1795 3.824C90.8355 3.824 91.3315 4.32 91.3315 4.944C91.3315 5.568 90.8355 6.064 90.1795 6.064ZM91.1075 16H89.2835V7.52H91.1075V16ZM95.9137 16.16C92.5857 16.16 92.3777 13.392 92.3777 13.392H94.1537C94.1537 13.392 94.3138 14.704 95.9617 14.704C96.9378 14.704 97.4177 14.192 97.4177 13.6C97.4177 13.04 97.0017 12.736 96.2497 12.576L95.0977 12.32C93.7538 12.016 92.5378 11.392 92.5378 9.904C92.5378 8.432 93.7377 7.36 95.6097 7.36C98.6497 7.36 98.8897 9.872 98.8897 9.872H97.1777C97.1777 9.872 97.0178 8.784 95.6097 8.784C94.6497 8.784 94.2497 9.296 94.2497 9.792C94.2497 10.288 94.7138 10.576 95.3857 10.72L96.5218 10.976C98.0257 11.312 99.1298 12.032 99.1298 13.504C99.1298 14.976 97.9618 16.16 95.9137 16.16ZM105.835 16H104.01V8.992H102.634V7.52H104.01V6.608C104.01 5.296 104.603 3.68 106.73 3.68C107.354 3.68 107.803 3.824 107.803 3.824V5.2C107.803 5.2 107.419 5.104 107.05 5.104C106.106 5.104 105.835 5.728 105.835 6.608V7.52H107.723V8.992H105.835V16ZM112.221 16.16C109.453 16.16 107.95 14.032 107.95 11.76C107.95 9.488 109.453 7.36 112.221 7.36C114.973 7.36 116.478 9.488 116.478 11.76C116.478 14.032 114.973 16.16 112.221 16.16ZM112.221 14.608C113.773 14.608 114.637 13.248 114.637 11.76C114.637 10.272 113.773 8.912 112.221 8.912C110.653 8.912 109.805 10.272 109.805 11.76C109.805 13.248 110.653 14.608 112.221 14.608ZM119.477 16H117.653V7.52H119.477V8.64H119.541C119.877 7.984 120.501 7.36 121.813 7.36C122.213 7.36 122.549 7.424 122.549 7.424V9.184C122.549 9.184 122.181 9.12 121.765 9.12C120.277 9.12 119.477 9.904 119.477 11.792V16ZM126.657 19.12C126.129 19.12 125.745 19.056 125.745 19.056V17.536C125.745 17.536 126.145 17.584 126.561 17.584C127.729 17.584 128.449 17.2 128.977 16.112L125.745 7.52H127.601L129.889 13.872L132.177 7.52H134.065L130.865 15.904C130.017 18.112 128.769 19.12 126.657 19.12ZM138.396 16.16C135.629 16.16 134.125 14.032 134.125 11.76C134.125 9.488 135.629 7.36 138.396 7.36C141.148 7.36 142.653 9.488 142.653 11.76C142.653 14.032 141.148 16.16 138.396 16.16ZM138.396 14.608C139.949 14.608 140.812 13.248 140.812 11.76C140.812 10.272 139.949 8.912 138.396 8.912C136.828 8.912 135.98 10.272 135.98 11.76C135.98 13.248 136.828 14.608 138.396 14.608ZM146.548 16.16C144.836 16.16 143.828 15.008 143.828 13.232V7.52H145.652V13.008C145.652 14.016 146.228 14.624 147.172 14.624C148.532 14.624 149.06 13.408 149.06 12.224V7.52H150.884V16H149.06V14.784H148.964C148.708 15.264 148.052 16.16 146.548 16.16Z';
// The text's box in Figma's export (the sparkle and 4pt gap come before it).
const TEXT_LEFT = 24;
const TEXT_WIDTH = 131;
const HEIGHT = 20;
// Figma's "Romie Gradient" runs across the text, from x 24 to 152.
const GRADIENT_CENTRE = { x: 88, y: 10 };
const GRADIENT_HALF = 64;
const ROMIE_STOPS = [
  { offset: 0, color: '#7D87E9' },
  { offset: 0.2404, color: '#7582ED' },
  { offset: 0.4663, color: '#6ABDC7' },
  { offset: 0.7356, color: '#9B64F8' },
  { offset: 1, color: '#EE88F4' },
];

// The Roverview's "Why this is for you" heading. In "Gradient dismissed" the
// sparkle and text are blue900. While the card glows (`glow` 1) they're the
// Romie gradient, and the text's gradient turns with the glow's (`turn`, 0 → 1
// for one full turn).
export function RomieHeading({
  turn,
  glow,
}: {
  turn: SharedValue<number>;
  glow: SharedValue<number>;
}) {
  const gradientStyle = useAnimatedStyle(() => ({ opacity: glow.get() }));
  const navyStyle = useAnimatedStyle(() => ({ opacity: 1 - glow.get() }));
  const gradientProps = useAnimatedProps(() => {
    const angle = turn.get() * 2 * Math.PI;
    const dx = Math.cos(angle) * GRADIENT_HALF;
    const dy = Math.sin(angle) * GRADIENT_HALF;
    return {
      x1: GRADIENT_CENTRE.x - dx,
      y1: GRADIENT_CENTRE.y - dy,
      x2: GRADIENT_CENTRE.x + dx,
      y2: GRADIENT_CENTRE.y + dy,
    };
  });

  return (
    <View
      style={styles.row}
      accessible
      accessibilityRole="header"
      accessibilityLabel="Why this is for you">
      <View style={styles.sparkle}>
        <Animated.View style={[StyleSheet.absoluteFill, navyStyle]}>
          <Image source={require('@/assets/icons/star-four.svg')} style={styles.sparkle} />
        </Animated.View>
        {/* Figma's blurred colour blend inside the sparkle, pre-rendered at 3×. */}
        <Animated.View style={[StyleSheet.absoluteFill, gradientStyle]}>
          <Image source={require('@/assets/images/romie-sparkle.png')} style={styles.sparkle} />
        </Animated.View>
      </View>
      <View style={styles.text}>
        <Animated.View style={[StyleSheet.absoluteFill, navyStyle]}>
          <Svg
            width={TEXT_WIDTH}
            height={HEIGHT}
            viewBox={`${TEXT_LEFT} 0 ${TEXT_WIDTH} ${HEIGHT}`}>
            <Path d={TEXT_PATH} fill={colors.blue900} />
          </Svg>
        </Animated.View>
        <Animated.View style={[StyleSheet.absoluteFill, gradientStyle]}>
          <Svg
            width={TEXT_WIDTH}
            height={HEIGHT}
            viewBox={`${TEXT_LEFT} 0 ${TEXT_WIDTH} ${HEIGHT}`}>
            <Defs>
              <AnimatedLinearGradient
                id="romie"
                gradientUnits="userSpaceOnUse"
                animatedProps={gradientProps}>
                {ROMIE_STOPS.map((stop) => (
                  <Stop key={stop.offset} offset={stop.offset} stopColor={stop.color} />
                ))}
              </AnimatedLinearGradient>
            </Defs>
            <Path d={TEXT_PATH} fill="url(#romie)" />
          </Svg>
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: 4,
  },
  sparkle: {
    width: HEIGHT,
    height: HEIGHT,
  },
  text: {
    width: TEXT_WIDTH,
    height: HEIGHT,
  },
});
