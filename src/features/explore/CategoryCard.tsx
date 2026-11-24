import { Image } from 'expo-image';
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { ScalePressable } from '@/components/ScalePressable';
import { colors, fonts } from '@/constants/theme';
import { useToast } from '@/features/toast/ToastContext';

export const CATEGORY_CARD_WIDTH = 240;

// Figma component set "Category Card": a place in one of Explore's category
// rows, with a heart to save it. The heart is an outline by default and fills
// pink once saved ("Card Saved"); tapping it toggles. Saving shows the "Plan
// Saved" toast.
export function CategoryCard({ title, detail }: { title: string; detail: string }) {
  const [saved, setSaved] = useState(false);
  const { showPlanSaved } = useToast();

  return (
    <View style={styles.card}>
      <View style={styles.image} />
      <View style={styles.footer}>
        <View style={styles.text}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.detail}>{detail}</Text>
        </View>
        <ScalePressable
          accessibilityRole="button"
          accessibilityLabel="Save"
          accessibilityState={{ selected: saved }}
          hitSlop={12}
          onPress={() => {
            if (!saved) showPlanSaved();
            setSaved(!saved);
          }}>
          <Image
            source={
              saved
                ? require('@/assets/icons/heart-saved.svg')
                : require('@/assets/icons/heart.svg')
            }
            style={styles.heart}
          />
        </ScalePressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: CATEGORY_CARD_WIDTH,
    gap: 8,
  },
  image: {
    height: 140,
    borderRadius: 16,
    backgroundColor: colors.blue100,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingRight: 4,
  },
  text: {
    gap: 4,
  },
  title: {
    fontFamily: fonts.semiBold,
    fontSize: 16,
    lineHeight: 20,
    letterSpacing: -0.8,
    color: colors.blue900,
  },
  detail: {
    fontFamily: fonts.medium,
    fontSize: 14,
    lineHeight: 18,
    letterSpacing: -0.7,
    color: colors.gray700,
  },
  heart: {
    width: 20,
    height: 20,
  },
});
