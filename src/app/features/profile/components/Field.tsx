import { TextInput, type TextInputProps, View } from 'react-native';
import { useTheme } from '../theme';
import Txt from './Txt';

type Props = TextInputProps & { label: string };

export default function Field({ label, style, ...rest }: Props) {
  const t = useTheme();
  return (
    <View style={{ marginTop: 12 }}>
      <Txt size={13} color={t.muted}>{label}</Txt>
      <TextInput
        placeholderTextColor={t.muted}
        {...rest}
        style={[
          {
            marginTop: 4,
            borderWidth: 1,
            borderColor: t.line,
            borderRadius: 12,
            backgroundColor: t.bg,
            color: t.ink,
            paddingHorizontal: 12,
            paddingVertical: 10,
            fontSize: 15,
          },
          style,
        ]}
      />
    </View>
  );
}
