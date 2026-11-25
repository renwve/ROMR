import { router, useFocusEffect } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useCallback, useState } from 'react';
import { BackHandler, Keyboard } from 'react-native';

import { DismissKeyboard } from '@/components/DismissKeyboard';
import { StatusBarSpace } from '@/components/PageHeader';
import { TravelPrefStep, TravellerTypeStep } from '@/features/onboarding/ChoiceSteps';
import { ProgressHeader } from '@/features/onboarding/components';
import { LocationStep } from '@/features/onboarding/LocationStep';
import { useOnboarding } from '@/features/onboarding/OnboardingContext';
import { SummaryStep } from '@/features/onboarding/SummaryStep';
import { WhereStep } from '@/features/onboarding/WhereStep';

// The four questions, then the summary.
const QUESTIONS = 4;
const SUMMARY = QUESTIONS;

// Figma "Onboarding - Refinement", from Where to the ROMR summary, under one
// progress header. Back (the caret or Android's back) goes to the previous
// step, and from the first back to Get Started. "Yes, looks good" opens the app.
export default function OnboardingScreen() {
  const { finish } = useOnboarding();
  const [step, setStep] = useState(0);

  const goTo = (next: number) => {
    Keyboard.dismiss();
    setStep(next);
  };
  const next = () => goTo(step + 1);
  const back = () => (step === 0 ? router.back() : goTo(step - 1));

  useFocusEffect(
    useCallback(() => {
      const subscription = BackHandler.addEventListener('hardwareBackPress', () => {
        if (step === 0) return false;
        setStep(step - 1);
        return true;
      });
      return () => subscription.remove();
    }, [step]),
  );

  return (
    <DismissKeyboard>
      <StatusBar style="dark" />
      <StatusBarSpace />
      <ProgressHeader
        label={step === SUMMARY ? 'Summary' : `${step + 1}/${QUESTIONS}`}
        strong={step === SUMMARY}
        progress={Math.min(step + 1, QUESTIONS) / QUESTIONS}
        onBack={back}
      />
      {step === 0 ? <WhereStep onContinue={next} /> : null}
      {step === 1 ? <TravelPrefStep onContinue={next} /> : null}
      {step === 2 ? <LocationStep onContinue={next} /> : null}
      {step === 3 ? <TravellerTypeStep onContinue={next} /> : null}
      {step === SUMMARY ? <SummaryStep onEdit={goTo} onConfirm={finish} /> : null}
    </DismissKeyboard>
  );
}
