import * as Location from 'expo-location';
import { Image } from 'expo-image';
import { StyleSheet, View } from 'react-native';

import { colors, shadows } from '@/constants/theme';
import { PrimaryButton, StepPage, StepTitle } from './components';
import { useOnboarding } from './OnboardingContext';

// Figma "Location Permission". Maybe later moves on without asking. Allow
// location access brings up the system prompt; once it's allowed the button
// becomes Continue, which moves on.
export function LocationStep({ onContinue }: { onContinue: () => void }) {
  const { data, update } = useOnboarding();
  const granted = data.location === 'granted';

  const allow = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      update({ location: 'denied' });
      return;
    }
    update({ location: 'granted' });
    // Where the traveller is, for nearby suggestions later (as the banana
    // branch did). It can take a moment, so it doesn't hold anything up. Only
    // while the phone's location is on: asking with it off brings up Google's
    // "turn on Location Accuracy" dialog on top of the permission prompt.
    if (!(await Location.hasServicesEnabledAsync())) return;
    Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced })
      .then(({ coords }) => update({ latitude: coords.latitude, longitude: coords.longitude }))
      .catch((error) => console.warn(error));
  };

  const later = () => {
    update({ location: 'skipped' });
    onContinue();
  };

  return (
    <StepPage
      footer={
        <>
          {/* Once location is allowed, only Continue moves on. */}
          <PrimaryButton label="Maybe later" muted disabled={granted} onPress={later} />
          <PrimaryButton
            label={granted ? 'Continue' : 'Allow location access'}
            onPress={granted ? onContinue : allow}
          />
        </>
      }>
      <StepTitle
        title="Want recommendations nearby?"
        subtitle="Your location helps us suggest places worth exploring. You can change this anytime in the settings."
      />
      <View style={styles.illustration}>
        <View style={styles.circle}>
          <Image source={require('@/assets/icons/map-pin.svg')} style={styles.pin} />
        </View>
      </View>
    </StepPage>
  );
}

const styles = StyleSheet.create({
  illustration: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  circle: {
    width: 240,
    height: 240,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.white200,
    borderRadius: 120,
    backgroundColor: colors.white100,
    boxShadow: shadows.soft,
  },
  pin: {
    width: 100,
    height: 100,
  },
});
