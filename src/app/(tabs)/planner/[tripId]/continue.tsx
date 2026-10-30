import { Image } from 'expo-image';
import { useLocalSearchParams } from 'expo-router';
import { Fragment, useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';

import { colors, fonts } from '@/constants/theme';
import { icons } from '@/features/planner/assets';
import { ChatInput } from '@/features/planner/components/ChatInputBar';
import { useHeaderHeights } from '@/features/planner/header';
import { useTrip, useTrips } from '@/features/planner/TripsContext';

const INPUT_BAR_CLEARANCE = 40 + 58 + 16;

// The user's initial, shown on their messages.
const USER_INITIAL = 'C';

export default function ContinuePlanningScreen() {
  const { tripId } = useLocalSearchParams<{ tripId: string }>();
  const trip = useTrip(tripId);
  const { addMessage } = useTrips();
  const headerHeights = useHeaderHeights();
  const [draft, setDraft] = useState('');
  if (!trip) return null;

  const send = () => {
    const text = draft.trim();
    if (!text) return;
    addMessage(trip.id, text);
    setDraft('');
  };

  return (
    <KeyboardAvoidingView
      style={[styles.screen, { paddingTop: headerHeights.continue }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.thread} keyboardShouldPersistTaps="handled">
        {trip.messages.map((message) => (
          <Fragment key={message.id}>
            <View style={styles.message}>
              <View style={styles.userAvatar}>
                <Text style={styles.userInitial}>{USER_INITIAL}</Text>
              </View>
              <Text style={styles.messageText}>{message.text}</Text>
            </View>
            {/* No assistant yet: each question gets a placeholder for its answer. */}
            <View style={styles.reply}>
              <View style={styles.assistantAvatar}>
                <Image source={icons.sparkleWhite} style={styles.sparkle} />
              </View>
              <Text style={styles.replyText}>Reply here</Text>
            </View>
          </Fragment>
        ))}
      </ScrollView>
      <ChatInput value={draft} onChangeText={setDraft} onSubmit={send} />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  thread: {
    gap: 48,
    paddingHorizontal: 16,
    paddingTop: 48,
    paddingBottom: 48 + INPUT_BAR_CLEARANCE,
  },
  message: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  userAvatar: {
    width: 32,
    height: 32,
    borderRadius: 100,
    backgroundColor: colors.blue100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  userInitial: {
    fontFamily: fonts.medium,
    fontSize: 16,
    letterSpacing: -0.64,
    color: colors.blue900,
  },
  messageText: {
    flex: 1,
    fontFamily: fonts.regular,
    fontSize: 16,
    letterSpacing: -0.64,
    color: colors.black,
  },
  reply: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  assistantAvatar: {
    width: 32,
    height: 32,
    borderRadius: 100,
    backgroundColor: colors.blue900,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sparkle: {
    width: 16,
    height: 16,
  },
  replyText: {
    fontFamily: fonts.regular,
    fontSize: 16,
    letterSpacing: -0.64,
    color: colors.black,
  },
});
