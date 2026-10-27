import { useState } from "react";
import { Text, View } from "react-native";
import Svg, { Path } from "react-native-svg";
import { COUNTRIES } from "../data/countries";
import { useTheme } from "../theme";

type Props = { visited: Set<string>; onPress: (code: string) => void };

export default function WorldMap({ visited, onPress }: Props) {
  const t = useTheme();
  const [picked, setPicked] = useState<string | null>(null);
  const country = COUNTRIES.find((c) => c.code === picked);

  return (
    <View style={{ marginTop: 12 }}>
      <Svg viewBox="0 0 960 500" style={{ width: "100%", aspectRatio: 960 / 500 }}>
        {COUNTRIES.map((c) => (
          <Path
            key={c.code}
            d={c.path}
            fill={visited.has(c.code) ? t.brand : t.lock}
            stroke={t.card}
            strokeWidth={0.5}
            onPress={() => {
              setPicked(c.code);
              onPress(c.code);
            }}
          />
        ))}
      </Svg>
      <Text style={{ color: t.muted, fontSize: 13, height: 20, marginTop: 6 }}>
        {country ? `${country.flag} ${country.name}` : " "}
      </Text>
    </View>
  );
}
