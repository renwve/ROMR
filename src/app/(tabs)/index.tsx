import { useState } from 'react';

import { CategoryTabs } from '@/components/CategoryTabs';
import { DismissKeyboard } from '@/components/DismissKeyboard';
import { HomeHeader, NewPlanHeader, StatusBarSpace } from '@/components/PageHeader';
import { Chat } from '@/features/new-plan/Chat';
import { useNewPlan } from '@/features/new-plan/NewPlanContext';

const CATEGORIES = ['Travel', 'Food', 'Hang Out'] as const;

// Figma "Explore/Home"; during a New Plan, Figma "New Plan" and "New Plan - Chatting".
export default function ExploreScreen() {
  const { active, messages } = useNewPlan();
  const [category, setCategory] = useState<(typeof CATEGORIES)[number]>('Travel');

  return (
    <DismissKeyboard>
      <StatusBarSpace />
      {active ? (
        <>
          <NewPlanHeader />
          <Chat messages={messages} />
        </>
      ) : (
        <>
          <HomeHeader />
          <CategoryTabs options={CATEGORIES} value={category} onChange={setCategory} />
        </>
      )}
    </DismissKeyboard>
  );
}
