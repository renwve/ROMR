import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { colors, fonts } from '@/constants/theme';
import { PrimaryButton, StepPage, StepTitle } from './components';
import { useOnboarding } from './OnboardingContext';

// Figma "ROMR summary": a card per answer, each with its answers as tags and
// an Edit that goes back to that step.
export function SummaryStep({
  onEdit,
  onConfirm,
}: {
  onEdit: (step: number) => void;
  onConfirm: () => void;
}) {
  const { data } = useOnboarding();
  const cards = [
    { title: 'Your selected destinations', tags: data.destinations.map(({ name }) => name) },
    { title: 'Travel preferences', tags: data.travelScope },
    { title: 'Device location', tags: [data.location === 'granted' ? 'Shared' : 'Not shared'] },
    { title: 'Traveler personality', tags: data.travellerTypes },
  ];

  return (
    <StepPage footer={<PrimaryButton label="Yes, looks good" onPress={onConfirm} />}>
      <View style={styles.content}>
        <StepTitle
          title="This is your ROMR profile"
          subtitle="Everything look right? You can always change it later."
        />
        <View style={styles.cards}>
          {cards.map((card, step) => (
            <SummaryCard key={card.title} {...card} onEdit={() => onEdit(step)} />
          ))}
        </View>
      </View>
    </StepPage>
  );
}

// Figma "ROMR summary card". Tags that don't fit scroll sideways, out to the
// card's edges. Edit turns blue900 while it's pressed.
function SummaryCard({
  title,
  tags,
  onEdit,
}: {
  title: string;
  tags: readonly string[];
  onEdit: () => void;
}) {
  return (
    <View style={styles.card}>
      <View style={styles.cardBody}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>{title}</Text>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`Edit ${title.toLowerCase()}`}
            hitSlop={12}
            onPress={onEdit}>
            {({ pressed }) => (
              <Text style={[styles.edit, pressed && styles.editPressed]}>Edit</Text>
            )}
          </Pressable>
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.tagScroll}
          contentContainerStyle={styles.tags}>
          {tags.map((tag) => (
            <View key={tag} style={styles.tag}>
              <Text style={styles.tagLabel}>{tag}</Text>
            </View>
          ))}
        </ScrollView>
      </View>
    </View>
  );
}

// The card's 4pt padding and its body's 12pt.
const CARD_INSET = 16;

// Tighter than Figma's 40pt (title to cards) and 24pt (card heading to tags)
// so the whole profile fits on a 360×780pt phone like the S23 without scrolling.
const styles = StyleSheet.create({
  content: {
    gap: 24,
  },
  cards: {
    gap: 4,
  },
  card: {
    padding: 4,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.gray200,
    borderRadius: 12,
    backgroundColor: colors.white100,
  },
  cardBody: {
    gap: 12,
    padding: 12,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cardTitle: {
    fontFamily: fonts.regular,
    fontSize: 16,
    lineHeight: 20,
    letterSpacing: -0.8,
    color: colors.blue900,
  },
  edit: {
    fontFamily: fonts.medium,
    fontSize: 14,
    lineHeight: 18,
    letterSpacing: -0.7,
    color: colors.gray400,
  },
  editPressed: {
    color: colors.blue900,
  },
  tagScroll: {
    marginHorizontal: -CARD_INSET,
  },
  tags: {
    gap: 4,
    paddingHorizontal: CARD_INSET,
  },
  tag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: colors.blue300,
    borderRadius: 100,
    backgroundColor: colors.blue100,
  },
  tagLabel: {
    fontFamily: fonts.medium,
    fontSize: 14,
    lineHeight: 18,
    letterSpacing: -0.7,
    color: colors.blue900,
  },
});
