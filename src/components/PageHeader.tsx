import { Image } from 'expo-image';
import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors, fonts } from '@/constants/theme';
import { useNewPlan } from '@/features/new-plan/NewPlanContext';

// Figma "Frame 152": a 24pt icon each side of a centred title, 16pt padding,
// directly under the status bar.
function HeaderRow({
  left,
  title,
  right,
  strongTitle = false,
}: {
  left: React.ReactNode;
  title: string;
  right: React.ReactNode;
  // A bold navy title (Saved) instead of the semibold gray one (Explore).
  strongTitle?: boolean;
}) {
  return (
    <View style={styles.row}>
      {left}
      <Text style={[styles.title, strongTitle && styles.titleStrong]}>{title}</Text>
      {right}
    </View>
  );
}

// Explore's header: the R mark, "Hi, Roamer" and notifications.
export function HomeHeader() {
  return (
    <HeaderRow
      left={<Image source={require('@/assets/icons/romr-r.svg')} style={styles.icon} />}
      title="Hi, Roamer"
      right={
        <Pressable accessibilityRole="button" accessibilityLabel="Notifications" hitSlop={10}>
          <Image source={require('@/assets/icons/bell.svg')} style={styles.icon} />
        </Pressable>
      }
    />
  );
}

// Figma "New Plan": shown while the trip input is focused. X leaves New Plan.
export function NewPlanHeader() {
  const { close } = useNewPlan();
  return (
    <HeaderRow
      left={
        <Pressable accessibilityRole="button" accessibilityLabel="Close" hitSlop={10} onPress={close}>
          <Image source={require('@/assets/icons/x.svg')} style={styles.icon} />
        </Pressable>
      }
      title="New Plan"
      right={
        <Pressable accessibilityRole="button" accessibilityLabel="More options" hitSlop={10}>
          <Image source={require('@/assets/icons/dots-three.svg')} style={styles.icon} />
        </Pressable>
      }
    />
  );
}

// Figma "Saved": the R mark, "Saved Plans" and a plus that opens New Collection.
export function SavedHeader() {
  return (
    <HeaderRow
      left={<Image source={require('@/assets/icons/romr-r.svg')} style={styles.icon} />}
      title="Saved Plans"
      strongTitle
      right={
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="New collection"
          hitSlop={10}
          onPress={() => router.push('/new-collection')}>
          <Image source={require('@/assets/icons/plus-24.svg')} style={styles.icon} />
        </Pressable>
      }
    />
  );
}

// Figma "Saved - New Collection": X to leave without saving, "New Collection",
// and a check to create it.
export function NewCollectionHeader({ onClose, onSave }: { onClose: () => void; onSave: () => void }) {
  return (
    <HeaderRow
      left={
        <Pressable accessibilityRole="button" accessibilityLabel="Close" hitSlop={10} onPress={onClose}>
          <Image source={require('@/assets/icons/x-navy.svg')} style={styles.icon} />
        </Pressable>
      }
      title="New Collection"
      strongTitle
      right={
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Create collection"
          hitSlop={10}
          onPress={onSave}>
          <Image source={require('@/assets/icons/check.svg')} style={styles.icon} />
        </Pressable>
      }
    />
  );
}

// Clears the status bar, which every page draws under.
export function StatusBarSpace() {
  return <View style={{ height: useSafeAreaInsets().top }} />;
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  title: {
    fontFamily: fonts.semiBold,
    fontSize: 16,
    lineHeight: 20,
    letterSpacing: -0.8,
    color: colors.gray400,
  },
  titleStrong: {
    fontFamily: fonts.bold,
    color: colors.blue900,
  },
  icon: {
    width: 24,
    height: 24,
  },
});
