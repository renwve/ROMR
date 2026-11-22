import { Image } from 'expo-image';
import type { ReactNode } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { colors, fonts } from '@/constants/theme';
import { icons } from '../assets';

// Floating 354pt input pill, 40pt above the bottom of the screen.
function Bar({ children }: { children: ReactNode }) {
  return <View style={styles.bar}>{children}</View>;
}

// Trip Open: a tappable stand-in that opens Continue Planning.
export function ContinuePlanningButton({ onPress }: { onPress: () => void }) {
  return (
    <Pressable accessibilityRole="button" onPress={onPress} style={styles.position}>
      <Bar>
        <View style={styles.start}>
          <Image source={icons.plus24} style={styles.icon} />
          <Text style={styles.placeholder}>Continue Planning</Text>
        </View>
        <Image source={icons.microphone} style={styles.icon} />
      </Bar>
    </Pressable>
  );
}

// Continue Planning: the real text field.
export function ChatInput({
  value,
  onChangeText,
  onSubmit,
}: {
  value: string;
  onChangeText: (text: string) => void;
  onSubmit: () => void;
}) {
  return (
    <View style={styles.position}>
      <Bar>
        <View style={[styles.start, styles.grow]}>
          <Pressable accessibilityRole="button" accessibilityLabel="Add">
            <Image source={icons.plus24} style={styles.icon} />
          </Pressable>
          <TextInput
            value={value}
            onChangeText={onChangeText}
            onSubmitEditing={onSubmit}
            placeholder="Anything you want to add?"
            placeholderTextColor={colors.gray300}
            returnKeyType="send"
            submitBehavior="submit"
            style={[styles.placeholder, styles.input]}
          />
        </View>
        <Pressable accessibilityRole="button" accessibilityLabel="Voice input">
          <Image source={icons.microphone} style={styles.icon} />
        </Pressable>
      </Bar>
    </View>
  );
}

const styles = StyleSheet.create({
  position: {
    position: 'absolute',
    left: 24,
    right: 24,
    bottom: 40,
  },
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: colors.gray100,
    backgroundColor: colors.white100,
  },
  start: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  grow: {
    flex: 1,
    marginRight: 8,
  },
  icon: {
    width: 24,
    height: 24,
  },
  placeholder: {
    fontFamily: fonts.medium,
    fontSize: 16,
    letterSpacing: -0.64,
    color: colors.gray300,
  },
  input: {
    flex: 1,
    padding: 0,
    color: colors.blue900,
  },
});
