import { StyleSheet, View } from 'react-native';
import { COUNTRIES } from '../data/countries';
import { useTheme } from '../theme';
import type { Trip } from '../types';
import Txt from './Txt';

const fmt = (s: string) => new Date(`${s}T00:00:00`).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });

export default function TripList({ trips }: { trips: Trip[] }) {
  const t = useTheme();
  if (!trips.length) return <Txt color={t.muted}>No trips yet. Add your first one!</Txt>;

  return (
    <>
      {[...trips].sort((a, b) => b.start.localeCompare(a.start)).map((trip) => {
        const country = COUNTRIES.find((x) => x.code === trip.country);
        return (
          <View key={trip.id} style={[styles.card, { backgroundColor: t.card, borderColor: t.line }]}>
            <View style={[styles.photo, { backgroundColor: t.brandSoft }]}>
              <View style={styles.chip}><Txt weight="medium" size={12} color="#172554">{`${fmt(trip.start)} – ${fmt(trip.end)}`}</Txt></View>
              <Txt size={44} style={styles.flag}>{country?.flag ?? '📍'}</Txt>
            </View>
            <View style={styles.info}>
              <Txt weight="semiBold" size={16} color={t.ink}>{trip.place}{trip.everest ? ' 🏔️' : ''}</Txt>
              <Txt size={14} color={t.muted}>{`${country?.name ?? trip.country}${trip.note ? ` · ${trip.note}` : ''}`}</Txt>
            </View>
          </View>
        );
      })}
    </>
  );
}

const styles = StyleSheet.create({
  card: { borderWidth: 1, borderRadius: 20, paddingTop: 8, paddingHorizontal: 8, paddingBottom: 16, gap: 12 },
  photo: { minHeight: 88, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 8, borderRadius: 12 },
  chip: { alignSelf: 'flex-start', backgroundColor: '#FFFFFF', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 100 },
  flag: { lineHeight: 52, includeFontPadding: false },
  info: { gap: 4, paddingHorizontal: 4 },
});
