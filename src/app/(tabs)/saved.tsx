import { StyleSheet, View } from 'react-native';
import Animated, { FadeOut, LinearTransition } from 'react-native-reanimated';

import { NAV_TABS_CLEARANCE } from '@/components/NavBar';
import { SavedHeader, StatusBarSpace } from '@/components/PageHeader';
import { RubberBandScrollView } from '@/components/RubberBandScrollView';
import { SLIDE } from '@/constants/motion';
import { PlaceSection } from '@/features/explore/PlaceSection';
import { CollectionCard } from '@/features/saved/CollectionCard';
import { useCollections } from '@/features/saved/CollectionsContext';
import { DeletableCollection } from '@/features/saved/DeletableCollection';

// Every collection shows this count until there's a backend to count saves.
const PLACEHOLDER_COUNT = '+99';

// A deleted collection fades away while the ones below slide up into its place.
const LEAVE = FadeOut.duration(200);
const CLOSE_UP = LinearTransition.duration(SLIDE.duration);

// Figma "Saved": the user's collections of saved plans, then suggestions
// based on what they've saved. The Everything Collection always comes first;
// collections the user makes with the header's plus follow it, newest first,
// and can be swiped left to delete.
export default function SavedScreen() {
  const { collections, removeCollection } = useCollections();

  return (
    <View style={styles.page}>
      <StatusBarSpace />
      <SavedHeader />
      <RubberBandScrollView
        style={styles.page}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        <View style={styles.collections}>
          <CollectionCard name="The Everything Collection" count={PLACEHOLDER_COUNT} everything />
          {collections.map((collection) => (
            <Animated.View key={collection.id} exiting={LEAVE} layout={CLOSE_UP}>
              <DeletableCollection
                name={collection.name}
                count={PLACEHOLDER_COUNT}
                onDelete={() => removeCollection(collection.id)}
              />
            </Animated.View>
          ))}
        </View>
        {/* Placeholder suggestions until there's a backend to base them on. */}
        <Animated.View layout={CLOSE_UP}>
          <PlaceSection title="Based On Your Saves" subtitle="You’ll love what we found" />
        </Animated.View>
      </RubberBandScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
  },
  content: {
    // Scrolled to the end, the last of it rests 24pt above the nav bar.
    paddingBottom: NAV_TABS_CLEARANCE + 24,
  },
  collections: {
    gap: 2,
    paddingTop: 38,
  },
});
