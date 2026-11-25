import { Pressable, Text } from "react-native";
import { useTheme } from "../theme";

type Props = {
  label: string;
  onPress: () => void;
  variant?: "default" | "primary" | "ghost";
  small?: boolean;
};

export default function Button({ label, onPress, variant = "default", small }: Props) {
  const t = useTheme();
  const primary = variant === "primary";
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => ({
        borderWidth: 1,
        borderColor: primary ? t.brand : t.line,
        backgroundColor: primary ? t.brand : variant === "ghost" ? "transparent" : t.card,
        paddingVertical: small ? 6 : 9,
        paddingHorizontal: small ? 10 : 14,
        borderRadius: 10,
        opacity: pressed ? 0.7 : 1,
      })}
    >
      <Text style={{ color: primary ? "#ffffff" : t.text, fontSize: small ? 13 : 15 }}>{label}</Text>
    </Pressable>
  );
}
