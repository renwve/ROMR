import { Image } from 'expo-image';
import { StyleSheet, View } from 'react-native';
import Animated, {
  type SharedValue,
  useAnimatedProps,
  useAnimatedStyle,
} from 'react-native-reanimated';
import Svg, { Defs, LinearGradient, Path, Stop } from 'react-native-svg';

import { colors } from '@/constants/theme';
import type { RomieHeadingText } from './romieHeadings';

const AnimatedLinearGradient = Animated.createAnimatedComponent(LinearGradient);

// Where the heading's text starts, after the sparkle and its 4pt gap.
const TEXT_LEFT = 24;
const HEIGHT = 20;
const ROMIE_STOPS = [
  { offset: 0, color: '#7D87E9' },
  { offset: 0.2404, color: '#7582ED' },
  { offset: 0.4663, color: '#6ABDC7' },
  { offset: 0.7356, color: '#9B64F8' },
  { offset: 1, color: '#EE88F4' },
];

// The sparkle and heading of a Romie card: the Roverview's "Why this is for
// you", or the Reviews tab's "Review Summary". In "Gradient dismissed" they're
// blue900. While the card glows (`glow` 1) they're the Romie gradient, and the
// text's gradient turns with the glow's (`turn`, 0 → 1 for one full turn).
export function RomieHeading({
  heading,
  turn,
  glow,
}: {
  heading: RomieHeadingText;
  turn: SharedValue<number>;
  glow: SharedValue<number>;
}) {
  // Figma's "Romie Gradient" runs across the text.
  const centre = TEXT_LEFT + heading.span / 2;
  const half = heading.span / 2;
  const gradientStyle = useAnimatedStyle(() => ({ opacity: glow.get() }));
  const navyStyle = useAnimatedStyle(() => ({ opacity: 1 - glow.get() }));
  const gradientProps = useAnimatedProps(() => {
    const angle = turn.get() * 2 * Math.PI;
    const dx = Math.cos(angle) * half;
    const dy = Math.sin(angle) * half;
    return {
      x1: centre - dx,
      y1: HEIGHT / 2 - dy,
      x2: centre + dx,
      y2: HEIGHT / 2 + dy,
    };
  });
  const textSize = { width: heading.width, height: HEIGHT };
  const viewBox = `${TEXT_LEFT} 0 ${heading.width} ${HEIGHT}`;

  return (
    <View
      style={styles.row}
      accessible
      accessibilityRole="header"
      accessibilityLabel={heading.label}>
      <View style={styles.sparkle}>
        <Animated.View style={[StyleSheet.absoluteFill, navyStyle]}>
          <Image source={require('@/assets/icons/star-four.svg')} style={styles.sparkle} />
        </Animated.View>
        {/* Figma's blurred colour blend inside the sparkle, pre-rendered at 3×. */}
        <Animated.View style={[StyleSheet.absoluteFill, gradientStyle]}>
          <Image source={require('@/assets/images/romie-sparkle.png')} style={styles.sparkle} />
        </Animated.View>
      </View>
      <View style={textSize}>
        <Animated.View style={[StyleSheet.absoluteFill, navyStyle]}>
          <Svg {...textSize} viewBox={viewBox}>
            <Path d={heading.path} fill={colors.blue900} />
          </Svg>
        </Animated.View>
        <Animated.View style={[StyleSheet.absoluteFill, gradientStyle]}>
          <Svg {...textSize} viewBox={viewBox}>
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
            <Path d={heading.path} fill="url(#romie)" />
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
});
