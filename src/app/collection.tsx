import { Image } from 'expo-image';
import { router, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { CollectionHeader, StatusBarSpace } from '@/components/PageHeader';
import { RubberBandScrollView } from '@/components/RubberBandScrollView';
import { colors, fonts } from '@/constants/theme';
import { type DailyRec, findRecByPageId } from '@/features/explore/content';
import { EVERYTHING_ID, useSaves } from '@/features/saved/SavesContext';

// Figma "Saved - Open Collection": a collection's saves, newest first. The
// newest spans the width; the rest follow two to a row. Each shows its Daily
// Rec's photo and title, and opens that rec's page when tapped.
//
// Only The Everything Collection (every hearted Daily Rec) opens so far.
export default function CollectionScreen() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const { savedIds } = useSaves();
  const insets = useSafeAreaInsets();

  const saves =
    id === EVERYTHING_ID
      ? savedIds.flatMap((savedId) => {
          const rec = findRecByPageId(savedId);
          return rec?.page ? [{ id: savedId, rec }] : [];
        })
      : [];
  const [first, ...rest] = saves;
  const pairs = rest.reduce<(typeof rest)[]>((rows, save, index) => {
    if (index % 2 === 0) rows.push([save]);
    else rows[rows.length - 1].push(save);
    return rows;
  }, []);

  return (
    <View style={styles.page}>
      <StatusBar style="dark" />
      <StatusBarSpace />
      <CollectionHeader title="The Everything Collection" />
      <RubberBandScrollView
        style={styles.page}
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 24 }]}
        showsVerticalScrollIndicator={false}>
        <View style={styles.list}>
          {first ? <SaveTile id={first.id} rec={first.rec} /> : null}
          {pairs.map((row) => (
            <View key={row[0].id} style={styles.row}>
              {row.map((save) => (
                <SaveTile key={save.id} id={save.id} rec={save.rec} />
              ))}
              {/* An odd one out keeps a half-width tile. */}
              {row.length === 1 ? <View style={styles.tile} /> : null}
            </View>
          ))}
        </View>
      </RubberBandScrollView>
    </View>
  );
}

// One save: its photo (a 170pt-tall blue100 tile without one) and its title.
function SaveTile({ id, rec }: { id: string; rec: DailyRec }) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={rec.title}
      onPress={() => router.push({ pathname: '/daily-rec', params: { id } })}
      style={styles.tile}>
      <View style={styles.photo}>
        {rec.image ? (
          <Image source={rec.image} style={StyleSheet.absoluteFill} contentFit="cover" />
        ) : null}
      </View>
      <Text style={styles.title} numberOfLines={1}>
        {rec.title}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: colors.white100,
  },
  content: {
    paddingTop: 38,
    paddingHorizontal: 16,
  },
  list: {
    gap: 16,
  },
  row: {
    flexDirection: 'row',
    gap: 8,
  },
  tile: {
    flex: 1,
    gap: 8,
  },
  photo: {
    height: 170,
    overflow: 'hidden',
    borderRadius: 16,
    backgroundColor: colors.blue100,
  },
  title: {
    fontFamily: fonts.semiBold,
    fontSize: 16,
    lineHeight: 20,
    letterSpacing: -0.8,
    color: colors.blue900,
  },
});
