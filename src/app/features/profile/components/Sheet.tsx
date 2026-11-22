import type { ReactNode } from 'react';
import { KeyboardAvoidingView, Modal, Platform, Pressable, ScrollView, View } from 'react-native';

import { useTheme } from '../theme';
import Txt from './Txt';

type Props = {
  visible: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  scroll?: boolean;
};

export default function Sheet({ visible, onClose, title, children, scroll = true }: Props) {
  const t = useTheme();
  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(11,16,73,0.5)' }}>
        <Pressable style={{ flex: 1 }} onPress={onClose} />
        <View
          style={{
            backgroundColor: t.card,
            borderTopLeftRadius: 24,
            borderTopRightRadius: 24,
            padding: 20,
            maxHeight: '85%',
          }}>
          {title ? (
            <Txt weight="semiBold" size={20} color={t.ink}>
              {title}
            </Txt>
          ) : null}
          {scroll ? (
            <ScrollView keyboardShouldPersistTaps="handled">{children}</ScrollView>
          ) : (
            <View style={{ flexShrink: 1 }}>{children}</View>
          )}
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}
