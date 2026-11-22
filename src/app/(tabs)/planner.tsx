import { DismissKeyboard } from '@/components/DismissKeyboard';
import { NewPlanHeader, StatusBarSpace } from '@/components/PageHeader';
import { Chat } from '@/features/new-plan/Chat';
import { useNewPlan } from '@/features/new-plan/NewPlanContext';

// Figma "Planner": empty above the nav bar for now; during a New Plan, its
// header and chat.
export default function PlannerScreen() {
  const { active, messages } = useNewPlan();
  return (
    <DismissKeyboard>
      <StatusBarSpace />
      {active ? (
        <>
          <NewPlanHeader />
          <Chat messages={messages} />
        </>
      ) : null}
    </DismissKeyboard>
  );
}
