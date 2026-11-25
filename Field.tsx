import { Text, TextInput, TextInputProps, View } from "react-native";
import { useTheme } from "../theme";

type Props = TextInputProps & { label: string };

export default function Field({ label, style, ...rest }: Props) {
  const t = useTheme();
  return (
    <View style={{ marginTop: 12 }}>
      <Text style={{ color: t.muted, fontSize: 13 }}>{label}</Text>
      <TextInput
        placeholderTextColor={t.muted}
        {...rest}
        style={[
          {
            marginTop: 4,
            borderWidth: 1,
            borderColor: t.line,
            borderRadius: 10,
            backgroundColor: t.bg,
            color: t.text,
            paddingHorizontal: 10,
            paddingVertical: 9,
            fontSize: 15,
          },
          style,
        ]}
      />
    </View>
  );
}
