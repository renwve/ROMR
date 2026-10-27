import { Pressable, Text, View } from "react-native";
import { Achievement, AchievementGroup } from "../types";
import { useTheme } from "../theme";

type Props = {
  groups: AchievementGroup[];
  demoUnlocked: string[];
  demoMode: boolean;
  onToggle: (id: string) => void;
};

export default function Achievements({ groups, demoUnlocked, demoMode, onToggle }: Props) {
  const t = useTheme();

  const renderTile = (a: Achievement) => {
    const on = a.real || demoUnlocked.includes(a.id);
    return (
      <Pressable
        key={a.id}
        onPress={() => {
          if (demoMode && !a.real) onToggle(a.id);
        }}
        style={{
          width: "48%",
          marginTop: 12,
          padding: 14,
          alignItems: "center",
          borderRadius: 14,
          borderWidth: 1,
          borderColor: on ? t.brand : t.line,
          backgroundColor: on ? t.brandSoft : t.lock,
          opacity: on ? 1 : 0.6,
        }}
      >
        <Text style={{ fontSize: 30 }}>{on ? a.icon : "🔒"}</Text>
        <Text style={{ color: on ? t.text : t.muted, fontWeight: "600", fontSize: 14, marginTop: 6, textAlign: "center" }}>
          {a.title}
        </Text>
        <Text style={{ color: t.muted, fontSize: 12, marginTop: 3, textAlign: "center" }}>{a.desc}</Text>
      </Pressable>
    );
  };

  return (
    <View>
      {groups.map((g) => (
        <View key={g.title} style={{ marginTop: 20 }}>
          <Text style={{ color: t.text, fontSize: 15, fontWeight: "700" }}>
            {g.title}
            {g.sub ? <Text style={{ color: t.muted, fontWeight: "400" }}>{` · ${g.sub}`}</Text> : null}
          </Text>
          <View style={{ flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between" }}>
            {g.items.map(renderTile)}
          </View>
        </View>
      ))}
    </View>
  );
}
