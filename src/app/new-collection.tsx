import { Image } from 'expo-image';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { DismissKeyboard } from '@/components/DismissKeyboard';
import { NewCollectionHeader, StatusBarSpace } from '@/components/PageHeader';
import { ScalePressable } from '@/components/ScalePressable';
import { colors, fonts, shadows } from '@/constants/theme';
import { useCollections } from '@/features/saved/CollectionsContext';

// Placeholder saves to pick from until there's a backend: the user's saves,
// i.e. everything in The Everything Collection.
const SAVES = ['1', '2', '3', '4', '5', '6'].map((id) => ({ id, title: 'Title' }));

// Figma "Saved - New Collection" (and "- Keyboard Up" while naming it): name a
// new collection and tick the saves to put in it. The check creates it and
// goes back to Saved; X leaves without creating anything.
export default function NewCollectionScreen() {
  const { addCollection } = useCollections();
  const insets = useSafeAreaInsets();
  const [name, setName] = useState('');
  const [nameFocused, setNameFocused] = useState(false);
  const [picked, setPicked] = useState<string[]>([]);

  const toggle = (id: string) =>
    setPicked((current) =>
      current.includes(id) ? current.filter((pickedId) => pickedId !== id) : [...current, id],
    );

  // Leading spaces are dropped as they're typed, so spaces alone leave it empty.
  const canSave = name.trim().length > 0;

  const create = () => {
    if (!canSave) return;
    addCollection(name.trim(), picked);
    router.back();
  };

  // Two saves per row.
  const rows = SAVES.reduce<(typeof SAVES)[]>((all, save, index) => {
    if (index % 2 === 0) all.push([save]);
    else all[all.length - 1].push(save);
    return all;
  }, []);

  return (
    <View style={styles.page}>
      <StatusBar style="dark" />
      <DismissKeyboard>
        <StatusBarSpace />
        <NewCollectionHeader onClose={() => router.back()} onSave={create} canSave={canSave} />
        <ScrollView
          style={styles.page}
          contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 24 }]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>
          <View style={styles.nameSection}>
            <Text style={styles.heading}>Collection Name</Text>
            {/* Outlined in blue300 while typing ("- Keyboard Up"). */}
            <View style={[styles.nameField, nameFocused && styles.nameFieldFocused]}>
              <TextInput
                value={name}
                onChangeText={(text) => setName(text.replace(/^\s+/, ''))}
                onFocus={() => setNameFocused(true)}
                onBlur={() => setNameFocused(false)}
                returnKeyType="done"
                autoCapitalize="words"
                accessibilityLabel="Collection name"
                selectionColor={colors.blue300}
                style={styles.nameInput}
              />
            </View>
          </View>
          <View style={styles.fillSection}>
            <Text style={styles.heading}>Fill your new collection</Text>
            {rows.map((row) => (
              <View key={row[0].id} style={styles.row}>
                {row.map((save) => {
                  const isPicked = picked.includes(save.id);
                  return (
                    <ScalePressable
                      key={save.id}
                      accessibilityRole="checkbox"
                      accessibilityState={{ checked: isPicked }}
                      accessibilityLabel={save.title}
                      onPress={() => toggle(save.id)}
                      style={styles.tileTarget}
                      contentStyle={styles.tileContent}>
                      <View style={[styles.tile, isPicked && styles.tilePicked]}>
                        <Image
                          source={
                            isPicked
                              ? require('@/assets/icons/check-circle.svg')
                              : require('@/assets/icons/circle-empty.svg')
                          }
                          style={styles.tick}
                        />
                      </View>
                      <Text style={styles.tileTitle}>{save.title}</Text>
                    </ScalePressable>
                  );
                })}
              </View>
            ))}
          </View>
        </ScrollView>
      </DismissKeyboard>
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: colors.white100,
  },
  content: {
    gap: 40,
  },
  nameSection: {
    gap: 16,
    paddingTop: 38,
    paddingHorizontal: 16,
  },
  heading: {
    fontFamily: fonts.bold,
    fontSize: 20,
    lineHeight: 25,
    letterSpacing: -1,
    color: colors.dark800,
  },
  nameField: {
    height: 56,
    justifyContent: 'center',
    padding: 4,
    borderWidth: 1,
    borderColor: colors.white200,
    borderRadius: 12,
    backgroundColor: colors.white100,
    boxShadow: shadows.soft,
  },
  nameFieldFocused: {
    borderColor: colors.blue300,
  },
  nameInput: {
    height: 46,
    paddingHorizontal: 12,
    paddingVertical: 0,
    fontFamily: fonts.regular,
    fontSize: 16,
    letterSpacing: -0.8,
    color: colors.dark800,
    // No browser focus ring; the field's own outline shows focus.
    outlineWidth: 0,
  },
  fillSection: {
    gap: 16,
    paddingHorizontal: 16,
  },
  row: {
    flexDirection: 'row',
    gap: 8,
  },
  tileTarget: {
    flex: 1,
  },
  tileContent: {
    gap: 8,
  },
  tile: {
    height: 170,
    alignItems: 'flex-end',
    padding: 12,
    borderRadius: 16,
    backgroundColor: colors.blue100,
  },
  tilePicked: {
    backgroundColor: colors.blue300,
  },
  tick: {
    width: 20,
    height: 20,
  },
  tileTitle: {
    fontFamily: fonts.semiBold,
    fontSize: 16,
    lineHeight: 20,
    letterSpacing: -0.8,
    color: colors.blue900,
  },
});
