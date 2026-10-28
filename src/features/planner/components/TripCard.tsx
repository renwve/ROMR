import { Image } from 'expo-image';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, fonts } from '@/constants/theme';
import { icons } from '../assets';
import type { Trip } from '../trips';
import { PillButton } from './Buttons';
import { TripStatusChip } from './TripStatusChip';

export function TripCard({ trip, onPress }: { trip: Trip; onPress: () => void }) {
  const cancelled = trip.status === 'Cancelled';
  // Upcoming trips get the tall photo; finished and cancelled ones collapse to a strip.
  const tall = trip.status === 'Ready' || trip.status === 'Planning';

  // The press target sits behind the content rather than wrapping it, so the
  // Invite/Share button is a sibling instead of a button nested in a button.
  return (
    <View style={styles.card}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`Open ${trip.name}`}
        onPress={onPress}
        style={StyleSheet.absoluteFill}
      />
      <View
        pointerEvents="none"
        style={[styles.photo, tall && styles.photoTall, !trip.image && styles.photoEmpty]}>
        {trip.image ? (
          trip.cardImageCrop ? (
            <Image
              source={trip.image}
              contentFit="fill"
              style={[styles.croppedImage, trip.cardImageCrop]}
            />
          ) : (
            <Image source={trip.image} contentFit="cover" style={StyleSheet.absoluteFill} />
          )
        ) : null}
        <TripStatusChip status={trip.status} />
      </View>
      <View pointerEvents="box-none" style={styles.footer}>
        <View pointerEvents="none" style={styles.info}>
          <Text style={[styles.name, cancelled && { color: colors.gray400 }]}>{trip.name}</Text>
          <View style={styles.meta}>
            <Text style={[styles.metaText, cancelled && { color: colors.gray300 }]}>
              {trip.city}
            </Text>
            <Image source={cancelled ? icons.dotGray : icons.dotDark} style={styles.dot} />
            <Text style={[styles.metaText, cancelled && { color: colors.gray300 }]}>
              {trip.when}
            </Text>
          </View>
        </View>
        {trip.status === 'Finished' ? (
          <PillButton icon={icons.paperPlaneTiltWhite} label="Share" />
        ) : cancelled ? null : (
          <PillButton icon={icons.usersWhite} label="Invite" />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white100,
    borderWidth: 1,
    borderColor: colors.gray100,
    borderRadius: 20,
    paddingTop: 8,
    paddingHorizontal: 8,
    paddingBottom: 16,
    gap: 12,
  },
  photo: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 8,
    borderRadius: 12,
    overflow: 'hidden',
  },
  photoTall: {
    height: 140,
  },
  photoEmpty: {
    backgroundColor: colors.blue100,
  },
  // Width from left/right edges rather than a percentage, which Android can
  // resolve short on an absolutely positioned image.
  croppedImage: {
    position: 'absolute',
    left: 0,
    right: 0,
  },
  footer: {
    height: 44,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  info: {
    gap: 4,
    paddingHorizontal: 4,
  },
  name: {
    fontFamily: fonts.semiBold,
    fontSize: 16,
    letterSpacing: -0.64,
    color: colors.blue900,
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontFamily: fonts.regular,
    fontSize: 14,
    letterSpacing: -0.56,
    color: colors.dark800,
  },
  dot: {
    width: 4,
    height: 4,
  },
});
