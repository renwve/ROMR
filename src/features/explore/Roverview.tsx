import { Image } from 'expo-image';
import { StyleSheet, Text, View } from 'react-native';

import { TextReveal } from '@/components/TextReveal';
import { colors, fonts } from '@/constants/theme';
import type { DailyRecPage } from './content';
import { RomieCard, ROMIE_REVEAL_MS, useRomieGlow } from './RomieCard';
import { RomieHeading } from './RomieHeading';
import { WHY_THIS_IS_FOR_YOU } from './romieHeadings';

const WHY_LINE_HEIGHT = 18;

// Figma component set "Romie overview / Roverview": why Romie picked this rec,
// and its best time to visit, flight time and typical stay. Once `play` is set
// (the page has finished opening), its glow plays (see RomieCard).
export function Roverview({ page, play }: { page: DailyRecPage; play: boolean }) {
  const romie = useRomieGlow(play);
  // Figma's Food and Hangout variants swap the plane for a car, and the bed for
  // a stool (Food) or a clock (Hangout); everything else is the same.
  const local = page.roverview !== undefined;
  const stayIcon =
    page.roverview === 'Food'
      ? require('@/assets/icons/stool.svg')
      : page.roverview === 'Hangout'
        ? require('@/assets/icons/clock.svg')
        : require('@/assets/icons/bed.svg');

  return (
    <RomieCard romie={romie} style={styles.card}>
      <View style={styles.why}>
        <RomieHeading heading={WHY_THIS_IS_FOR_YOU} turn={romie.turn} glow={romie.glow} />
        {/* Romie's reason reveals like a chat message as soon as the page
            shows, while it's still sliding in. */}
        <TextReveal
          text={page.why}
          style={styles.whyText}
          lineHeight={WHY_LINE_HEIGHT}
          background={colors.white100}
          play
          duration={ROMIE_REVEAL_MS}
        />
      </View>
      <View style={styles.divider} />
      <View style={styles.facts}>
        <Fact
          icon={<Image source={require('@/assets/icons/calendar-dots.svg')} style={styles.icon} />}
          value={page.bestTime}
          label="Best time to visit"
        />
        <Fact
          icon={
            local ? (
              <Image source={require('@/assets/icons/car-simple.svg')} style={styles.icon} />
            ) : (
              <Image
                source={require('@/assets/icons/airplane-in-flight-24.svg')}
                style={[styles.icon, styles.plane]}
              />
            )
          }
          value={page.flightTime}
          label={page.travelLabel ?? 'Est. Flight time'}
        />
        <Fact
          icon={<Image source={stayIcon} style={styles.icon} />}
          value={page.stay}
          label="Typical Stay"
        />
      </View>
    </RomieCard>
  );
}

function Fact({ icon, value, label }: { icon: React.ReactNode; value: string; label: string }) {
  return (
    <View style={styles.fact}>
      <View style={styles.factIcon}>{icon}</View>
      <View style={styles.factText}>
        <Text style={styles.factValue}>{value}</Text>
        <Text style={styles.factLabel} numberOfLines={1}>
          {label}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    alignItems: 'center',
  },
  why: {
    alignSelf: 'stretch',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  whyText: {
    fontFamily: fonts.regular,
    fontSize: 14,
    lineHeight: WHY_LINE_HEIGHT,
    letterSpacing: -0.7,
    color: colors.gray500,
  },
  divider: {
    alignSelf: 'stretch',
    height: 1,
    marginHorizontal: 16,
    backgroundColor: colors.white200,
  },
  facts: {
    flexDirection: 'row',
    alignSelf: 'stretch',
    height: 110,
  },
  fact: {
    flex: 1,
    alignItems: 'center',
    gap: 12,
    padding: 12,
  },
  factIcon: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    width: 24,
    height: 24,
  },
  // Figma tilts the plane 20° up.
  plane: {
    transform: [{ rotate: '-20deg' }],
  },
  // The value and label may use the column's padding, so "Est. Flight time"
  // stays on one line on phones narrower than Figma's 402pt (the S23 is 360).
  factText: {
    alignItems: 'center',
    gap: 8,
    marginHorizontal: -12,
  },
  factValue: {
    fontFamily: fonts.semiBold,
    fontSize: 14,
    lineHeight: 18,
    letterSpacing: -0.7,
    color: colors.blue900,
  },
  factLabel: {
    fontFamily: fonts.medium,
    fontSize: 12,
    lineHeight: 15,
    letterSpacing: -0.6,
    color: colors.gray500,
  },
});
