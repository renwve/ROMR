import { Image } from 'expo-image';
import { useEffect, useState } from 'react';
import { Keyboard, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

import { SLIDE } from '@/constants/motion';
import { colors, fonts } from '@/constants/theme';
import { PrimaryButton, StepPage, StepTitle } from './components';
import { useOnboarding } from './OnboardingContext';
import { MAX_DESTINATIONS } from './options';
import { MIN_QUERY, type PlaceSuggestion, usePlaceSearch } from './usePlaceSearch';

// Figma's "search drop down": 49pt rows (14pt padding round a 20pt line, and a
// 1pt divider) in a box that stops growing at 192pt and scrolls, 8pt under the
// search field.
const ROW_HEIGHT = 49;
const DROPDOWN_MAX = 192;
const DROPDOWN_GAP = 8;
// The box's 1pt border and 4pt padding, top and bottom.
const DROPDOWN_FRAME = 10;

function dropdownHeight(rows: number) {
  return Math.min(DROPDOWN_MAX, DROPDOWN_FRAME + rows * ROW_HEIGHT - 1);
}

// Figma "Where - Empty", "Where - Dropdown" and "Where - Filled": search for up
// to five places, pick them from the suggestions, and remove any again.
export function WhereStep({ onContinue }: { onContinue: () => void }) {
  const { data, update } = useOnboarding();
  const [query, setQuery] = useState('');
  // Still holds the last results after the field is cleared, so the box keeps
  // its rows while it closes.
  const suggestions = usePlaceSearch(query);
  const open = query.trim().length >= MIN_QUERY && suggestions.length > 0;
  const reveal = useSharedValue(0);
  const height = useSharedValue(0);

  // The dropdown opens and closes by growing and shrinking from the field
  // down, fading as it goes.
  useEffect(() => {
    height.set(withTiming(open ? dropdownHeight(suggestions.length) + DROPDOWN_GAP : 0, SLIDE));
    reveal.set(withTiming(open ? 1 : 0, SLIDE));
  }, [open, suggestions.length, height, reveal]);

  const dropdownStyle = useAnimatedStyle(() => ({
    height: height.get(),
    opacity: reveal.get(),
  }));

  const add = (place: PlaceSuggestion) => {
    const { destinations } = data;
    if (!destinations.some((item) => item.id === place.id)) {
      // The sixth pick is ignored (the counter stops at 5/5).
      if (destinations.length >= MAX_DESTINATIONS) return;
      update({ destinations: [...destinations, place] });
    }
    setQuery('');
    Keyboard.dismiss();
  };

  const remove = (id: string) =>
    update({ destinations: data.destinations.filter((item) => item.id !== id) });

  const count = data.destinations.length;

  return (
    <StepPage
      footer={<PrimaryButton label="Continue" disabled={count === 0} onPress={onContinue} />}>
      <View style={styles.content}>
        <View style={styles.top}>
          <StepTitle
            title="Where would you like to go?"
            subtitle="Start with places you can’t stop thinking about"
          />
          <View>
            <View style={styles.box}>
              <View style={styles.field}>
                <Image
                  source={require('@/assets/icons/magnifying-glass-24.svg')}
                  style={styles.icon}
                />
                <TextInput
                  value={query}
                  onChangeText={setQuery}
                  placeholder="Type a country or city"
                  placeholderTextColor={colors.gray400}
                  autoCorrect={false}
                  returnKeyType="search"
                  style={styles.input}
                />
                {query.length > 0 ? (
                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel="Clear search"
                    hitSlop={10}
                    onPress={() => setQuery('')}>
                    <Image source={require('@/assets/icons/x-24.svg')} style={styles.icon} />
                  </Pressable>
                ) : null}
              </View>
            </View>
            <Animated.View style={[styles.dropdownClip, dropdownStyle]}>
              <View
                style={[
                  styles.box,
                  styles.dropdown,
                  { height: dropdownHeight(suggestions.length) },
                ]}>
                <ScrollView keyboardShouldPersistTaps="handled" nestedScrollEnabled>
                  {suggestions.map((place, index) => (
                    <Pressable
                      key={place.id}
                      accessibilityRole="button"
                      onPress={() => add(place)}
                      style={({ pressed }) => [
                        styles.suggestion,
                        index < suggestions.length - 1 && styles.divider,
                        pressed && styles.suggestionPressed,
                      ]}>
                      <Text style={styles.placeName} numberOfLines={1}>
                        {place.name}
                      </Text>
                    </Pressable>
                  ))}
                </ScrollView>
              </View>
            </Animated.View>
          </View>
        </View>
        <View style={styles.selected}>
          <View style={styles.selectedHeader}>
            <Text style={styles.selectedTitle}>
              {count === 0 ? 'You have no selected destinations' : 'Your selected destinations'}
            </Text>
            <Text style={styles.selectedTitle}>
              {count}/{MAX_DESTINATIONS}
            </Text>
          </View>
          {count > 0 ? (
            <View style={styles.cards}>
              {data.destinations.map((destination) => (
                <DestinationCard
                  key={destination.id}
                  name={destination.name}
                  onRemove={() => remove(destination.id)}
                />
              ))}
            </View>
          ) : null}
        </View>
      </View>
    </StepPage>
  );
}

// Figma component "Destination card": Remove turns red600 while it's pressed
// ("Remove Pressed").
function DestinationCard({ name, onRemove }: { name: string; onRemove: () => void }) {
  return (
    <View style={styles.box}>
      <View style={[styles.field, styles.cardRow]}>
        <View style={styles.cardLabel}>
          <Image source={require('@/assets/icons/globe.svg')} style={styles.icon} />
          <Text style={styles.placeName} numberOfLines={1}>
            {name}
          </Text>
        </View>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`Remove ${name}`}
          hitSlop={12}
          onPress={onRemove}>
          {({ pressed }) => (
            <Text style={[styles.remove, pressed && styles.removePressed]}>Remove</Text>
          )}
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: 40,
  },
  top: {
    gap: 32,
  },
  box: {
    padding: 4,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.gray200,
    borderRadius: 12,
    backgroundColor: colors.white100,
  },
  field: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 12,
  },
  icon: {
    width: 24,
    height: 24,
  },
  input: {
    flex: 1,
    height: 24,
    padding: 0,
    fontFamily: fonts.regular,
    fontSize: 16,
    letterSpacing: -0.8,
    color: colors.dark800,
    includeFontPadding: false,
  },
  dropdownClip: {
    overflow: 'hidden',
  },
  dropdown: {
    marginTop: DROPDOWN_GAP,
  },
  suggestion: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    height: ROW_HEIGHT,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: colors.white200,
  },
  // Figma shows the first suggestion on white200: the one under the finger.
  suggestionPressed: {
    backgroundColor: colors.white200,
  },
  placeName: {
    flexShrink: 1,
    fontFamily: fonts.regular,
    fontSize: 16,
    lineHeight: 20,
    letterSpacing: -0.8,
    color: colors.blue900,
  },
  selected: {
    gap: 24,
  },
  selectedHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  selectedTitle: {
    fontFamily: fonts.semiBold,
    fontSize: 16,
    lineHeight: 20,
    letterSpacing: -0.8,
    color: colors.blue900,
  },
  cards: {
    gap: 4,
  },
  cardRow: {
    justifyContent: 'space-between',
  },
  cardLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    flexShrink: 1,
    gap: 12,
  },
  remove: {
    fontFamily: fonts.medium,
    fontSize: 14,
    lineHeight: 18,
    letterSpacing: -0.7,
    color: colors.gray400,
  },
  removePressed: {
    color: colors.red600,
  },
});
