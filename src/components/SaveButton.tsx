import { type ComponentProps, useState } from 'react';
import { StyleSheet } from 'react-native';

import { WhiteButton } from '@/components/WhiteButton';
import { useSaves } from '@/features/saved/SavesContext';
import { useToast } from '@/features/toast/ToastContext';

// Figma component set "Save Button": a white heart button that's an outlined
// navy heart by default and a filled pink heart once saved. Tapping toggles it.
// Saving shows the "Plan Saved" toast.
//
// With a `saveId` (a Daily Rec's page id), the heart saves that rec into The
// Everything Collection, so every heart for the same rec agrees. Without one it
// only remembers its own state.
export function SaveButton({
  saveId,
  shadow,
  size = 44,
}: {
  saveId?: string;
  shadow?: ComponentProps<typeof WhiteButton>['shadow'];
  // The square's side: 44 on cards, 56 on a Daily Rec page's bottom bar.
  size?: number;
} = {}) {
  const [ownSaved, setOwnSaved] = useState(false);
  const { isSaved, toggleSave } = useSaves();
  const { showPlanSaved } = useToast();
  const saved = saveId ? isSaved(saveId) : ownSaved;

  return (
    <WhiteButton
      accessibilityLabel="Save"
      accessibilityState={{ selected: saved }}
      onPress={() => {
        if (!saved) showPlanSaved(saveId);
        if (saveId) toggleSave(saveId);
        else setOwnSaved(!saved);
      }}
      shape="rounded"
      shadow={shadow}
      icon={saved ? require('@/assets/icons/heart-saved.svg') : require('@/assets/icons/heart.svg')}
      contentStyle={[styles.square, { width: size, height: size }]}
    />
  );
}

const styles = StyleSheet.create({
  square: {
    paddingHorizontal: 0,
    paddingVertical: 0,
  },
});
