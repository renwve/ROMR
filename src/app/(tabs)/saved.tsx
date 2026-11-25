import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { FadeOut, LinearTransition } from 'react-native-reanimated';

import { NAV_TABS_CLEARANCE } from '@/components/NavBar';
import { useNavBarLock } from '@/components/NavBarLock';
import { SavedHeader, StatusBarSpace } from '@/components/PageHeader';
import { RubberBandScrollView } from '@/components/RubberBandScrollView';
import { SLIDE } from '@/constants/motion';
import { PlaceSection } from '@/features/explore/PlaceSection';
import { CollectionCard } from '@/features/saved/CollectionCard';
import { CollectionMenu } from '@/features/saved/CollectionMenu';
import { useCollections } from '@/features/saved/CollectionsContext';
import { DeletableCollection } from '@/features/saved/DeletableCollection';

// Every collection shows this count until there's a backend to count saves.
const PLACEHOLDER_COUNT = '+99';
// The Everything Collection's id, alongside the user's own collections'.
const EVERYTHING_ID = 'everything';

// A deleted collection fades away while the ones below slide up into its place.
const LEAVE = FadeOut.duration(200);
const CLOSE_UP = LinearTransition.duration(SLIDE.duration);

// Figma "Saved": the user's collections of saved plans, then suggestions
// based on what they've saved. The Everything Collection always comes first;
// collections the user makes with the header's plus follow it, newest first,
// and can be swiped left to delete. Holding any of them opens its menu
// (Figma "Saved - Edit Collection").
export default function SavedScreen() {
  const { collections, removeCollection } = useCollections();
  // The collection whose menu is showing, where the menu opens, and whether it's
  // open or on its way out (it stays until it has shrunk away).
  const [menu, setMenu] = useState<{
    id: string;
    anchor: { x: number; y: number };
    open: boolean;
  } | null>(null);
  const closeMenu = () => setMenu((current) => current && { ...current, open: false });
  const menuOpen = !!menu?.open;

  // While the menu is open the nav bar is locked too: tapping it closes the menu.
  const { setOnLockedTap } = useNavBarLock();
  useEffect(() => {
    setOnLockedTap(menuOpen ? closeMenu : null);
    return () => setOnLockedTap(null);
  }, [menuOpen, setOnLockedTap]);

  const isHeld = (id: string) => menu?.id === id && menu.open;
  const openMenu = (id: string) => (anchor: { x: number; y: number }) =>
    setMenu({ id, anchor, open: true });

  return (
    <View style={styles.page}>
      <StatusBarSpace />
      <SavedHeader />
      <RubberBandScrollView
        style={styles.page}
        contentContainerStyle={styles.content}
        // While a menu is open, the page stays put.
        scrollEnabled={!menu}
        showsVerticalScrollIndicator={false}>
        <View style={styles.collections}>
          <CollectionCard
            name="The Everything Collection"
            count={PLACEHOLDER_COUNT}
            everything
            onHold={openMenu(EVERYTHING_ID)}
            held={isHeld(EVERYTHING_ID)}
            locked={!!menu}
          />
          {collections.map((collection) => (
            <Animated.View key={collection.id} exiting={LEAVE} layout={CLOSE_UP}>
              <DeletableCollection
                name={collection.name}
                count={PLACEHOLDER_COUNT}
                onDelete={() => removeCollection(collection.id)}
                onHold={openMenu(collection.id)}
                held={isHeld(collection.id)}
                locked={!!menu}
              />
            </Animated.View>
          ))}
        </View>
        {/* Placeholder suggestions until there's a backend to base them on. */}
        <Animated.View layout={CLOSE_UP}>
          <PlaceSection title="Based On Your Saves" subtitle="You’ll love what we found" />
        </Animated.View>
      </RubberBandScrollView>
      {menu ? (
        <CollectionMenu
          anchor={menu.anchor}
          open={menu.open}
          onClose={closeMenu}
          onSelect={(label) => {
            closeMenu();
            // Only Edit Collection does anything yet, and The Everything
            // Collection (every save) can't be renamed.
            if (label === 'Edit Collection' && menu.id !== EVERYTHING_ID) {
              router.push({ pathname: '/new-collection', params: { id: menu.id } });
            }
          }}
          onClosed={() => setMenu(null)}
        />
      ) : null}
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
