import { type ComponentProps, useState } from 'react';
import { StyleSheet } from 'react-native';

import { WhiteButton } from '@/components/WhiteButton';
import { useToast } from '@/features/toast/ToastContext';

// Figma component set "Save Button": a white heart button that's an outlined
// navy heart by default and a filled pink heart once saved. Tapping toggles it.
// Saving shows the "Plan Saved" toast.
export function SaveButton({
  shadow,
}: {
  shadow?: ComponentProps<typeof WhiteButton>['shadow'];
} = {}) {
  const [saved, setSaved] = useState(false);
  const { showPlanSaved } = useToast();

  return (
    <WhiteButton
      accessibilityLabel="Save"
      accessibilityState={{ selected: saved }}
      onPress={() => {
        if (!saved) showPlanSaved();
        setSaved(!saved);
      }}
      shape="rounded"
      shadow={shadow}
      icon={saved ? require('@/assets/icons/heart-saved.svg') : require('@/assets/icons/heart.svg')}
      contentStyle={styles.square}
    />
  );
}

const styles = StyleSheet.create({
  square: {
    width: 44,
    paddingHorizontal: 0,
  },
});
