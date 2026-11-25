import { StyleSheet, View } from 'react-native';

import { OptionCard, PrimaryButton, StepPage, StepTitle } from './components';
import { useOnboarding } from './OnboardingContext';
import { TRAVEL_SCOPES, TRAVELLER_TYPES } from './options';

// Adds `value` to the list, or takes it out if it's already there.
function toggle<T>(list: readonly T[], value: T) {
  return list.includes(value) ? list.filter((item) => item !== value) : [...list, value];
}

// Figma "Travel Pref": any of Local, Domestic and International. Continue stays
// disabled until at least one is picked.
export function TravelPrefStep({ onContinue }: { onContinue: () => void }) {
  const { data, update } = useOnboarding();
  return (
    <StepPage
      footer={
        <PrimaryButton
          label="Continue"
          disabled={data.travelScope.length === 0}
          onPress={onContinue}
        />
      }>
      <View style={styles.content}>
        <StepTitle
          title="What’s your travel preference?"
          subtitle="What kind of trips are you interested in?"
        />
        <View style={styles.options}>
          {TRAVEL_SCOPES.map((option) => (
            <OptionCard
              key={option.title}
              {...option}
              selected={data.travelScope.includes(option.title)}
              onPress={() => update({ travelScope: toggle(data.travelScope, option.title) })}
            />
          ))}
        </View>
      </View>
    </StepPage>
  );
}

// Figma "Traveller Type": as many as fit. Like the other steps, Continue needs
// at least one. The title and Continue stay put; the cards between them scroll
// when they don't all fit.
export function TravellerTypeStep({ onContinue }: { onContinue: () => void }) {
  const { data, update } = useOnboarding();
  return (
    <StepPage
      header={
        <StepTitle
          title="What type of traveler are you?"
          subtitle="Everyone travels differently, pick one or a few that feels like you."
        />
      }
      footer={
        <PrimaryButton
          label="Continue"
          disabled={data.travellerTypes.length === 0}
          onPress={onContinue}
        />
      }>
      <View style={styles.options}>
        {TRAVELLER_TYPES.map((option) => (
          <OptionCard
            key={option.title}
            {...option}
            selected={data.travellerTypes.includes(option.title)}
            onPress={() => update({ travellerTypes: toggle(data.travellerTypes, option.title) })}
          />
        ))}
      </View>
    </StepPage>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: 40,
  },
  options: {
    gap: 4,
  },
});
