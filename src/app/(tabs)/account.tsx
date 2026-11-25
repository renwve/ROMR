import { StyleSheet, View } from 'react-native';

import { WhiteButton } from '@/components/WhiteButton';
import { useOnboarding } from '@/features/onboarding/OnboardingContext';

// Figma "Account": for now just Restart Onboarding, in the middle, which clears
// the onboarding answers and goes back to Get Started (for testing the flow).
export default function AccountScreen() {
  const { restart } = useOnboarding();
  return (
    <View style={styles.page}>
      <WhiteButton label="Restart Onboarding" outlined onPress={restart} />
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
