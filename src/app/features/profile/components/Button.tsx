import { Pressable, StyleSheet } from 'react-native';
import { useTheme } from '../theme';
import Txt from './Txt';

type Props = {
  label: string;
  onPress: () => void;
  variant?: 'default' | 'primary' | 'ghost' | 'white';
  small?: boolean;
};

export default function Button({ label, onPress, variant = 'default', small }: Props) {
  const t = useTheme();
  const primary = variant === 'primary';
  const white = variant === 'white';
  const backgroundColor = primary ? t.brand : white ? '#FFFFFF' : variant === 'ghost' ? 'transparent' : t.card;
  const borderColor = primary || white ? backgroundColor : variant === 'ghost' ? 'transparent' : t.line;
  const color = primary ? '#FFFFFF' : white ? '#172554' : t.ink;

  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [
        styles.pill,
        small && styles.small,
        { backgroundColor, borderColor, opacity: pressed ? 0.7 : 1 },
      ]}>
      <Txt weight="medium" size={small ? 14 : 16} color={color} style={styles.label}>{label}</Txt>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pill: { alignItems: 'center', justifyContent: 'center', paddingHorizontal: 16, paddingVertical: 12, borderRadius: 100, borderWidth: 1 },
  small: { paddingHorizontal: 14, paddingVertical: 8 },
  label: { lineHeight: 20, includeFontPadding: false, textAlignVertical: 'center' },
});
