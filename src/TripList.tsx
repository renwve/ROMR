import { Text, View } from "react-native";
import { COUNTRIES } from "../data/countries";
import { cardStyle, useTheme } from "../theme";
import { Trip } from "../types";

const fmt = (s: string) =>
  new Date(`${s}T00:00:00`).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });

export default function TripList({ trips }: { trips: Trip[] }) {
  const t = useTheme();
  if (!trips.length) return <Text style={{ color: t.muted }}>No trips yet. Add your first one!</Text>;

  return (
    <View style={{ gap: 10 }}>
      {[...trips]
        .sort((a, b) => b.start.localeCompare(a.start))
        .map((trip) => {
          const c = COUNTRIES.find((x) => x.code === trip.country);
          return (
            <View key={trip.id} style={[cardStyle(t), { flexDirection: "row", gap: 12, padding: 14 }]}>
              <Text style={{ fontSize: 28 }}>{c ? c.flag : "📍"}</Text>
              <View style={{ flex: 1 }}>
                <Text style={{ color: t.text, fontWeight: "700" }}>
                  {trip.place}
                  {trip.everest ? " 🏔️" : ""}
                </Text>
                <Text style={{ color: t.muted, fontSize: 13 }}>
                  {`${c ? c.name : trip.country} · ${fmt(trip.start)} – ${fmt(trip.end)}`}
                </Text>
                {trip.note ? <Text style={{ color: t.muted, fontSize: 13, marginTop: 4 }}>{trip.note}</Text> : null}
              </View>
            </View>
          );
        })}
    </View>
  );
}
