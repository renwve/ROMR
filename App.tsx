import { useMemo, useState } from "react";
import { Alert, Pressable, ScrollView, StyleSheet, Switch, Text, View, useColorScheme } from "react-native";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { buildAchievements, visitedSet, worldPercent } from "./src/achievements";
import Achievements from "./src/components/Achievements";
import Avatar from "./src/components/Avatar";
import Button from "./src/components/Button";
import EditProfileModal from "./src/components/EditProfileModal";
import PeopleModal, { PeopleTab } from "./src/components/PeopleModal";
import TripList from "./src/components/TripList";
import TripModal from "./src/components/TripModal";
import WorldMap from "./src/components/WorldMap";
import { COUNTRIES } from "./src/data/countries";
import { useProfile } from "./src/store";
import { ThemeContext, cardStyle, darkTheme, lightTheme } from "./src/theme";

export default function App() {
  const system = useColorScheme();
  const { state, ready, update, reset } = useProfile();
  const [demo, setDemo] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [tripOpen, setTripOpen] = useState(false);
  const [tab, setTab] = useState<PeopleTab | null>(null);

  const themeName = state.theme ?? (system === "dark" ? "dark" : "light");
  const t = themeName === "dark" ? darkTheme : lightTheme;

  const visited = useMemo(() => visitedSet(state), [state.trips, state.manual]);
  const pct = worldPercent(visited);
  const groups = useMemo(() => buildAchievements(visited, state.trips), [visited, state.trips]);

  if (!ready) return null;

  const items = groups.flatMap((g) => g.items);
  const unlocked = items.filter((a) => a.real || state.demoUnlocked.includes(a.id)).length;
  const followers = state.people.filter((p) => p.followsMe).length;
  const following = state.people.filter((p) => p.following).length;

  const toggleIn = (list: string[], id: string) => (list.includes(id) ? list.filter((x) => x !== id) : [...list, id]);

  const onCountryPress = (code: string) => {
    if (demo) update((s) => ({ manual: toggleIn(s.manual, code) }));
  };

  const confirmReset = () =>
    Alert.alert("Reset profile", "Reset the profile back to the defaults?", [
      { text: "Cancel", style: "cancel" },
      { text: "Reset", style: "destructive", onPress: reset },
    ]);

  const card = cardStyle(t);

  return (
    <SafeAreaProvider>
      <ThemeContext.Provider value={t}>
        <SafeAreaView style={{ flex: 1, backgroundColor: t.bg }}>
          <StatusBar style={themeName === "dark" ? "light" : "dark"} />
          <ScrollView contentContainerStyle={styles.content}>
            <View style={styles.head}>
              <Text style={[styles.logo, { color: t.brand }]}>ROMR</Text>
              <Button
                small
                label={themeName === "dark" ? "☀️ Light" : "🌙 Dark"}
                onPress={() => update({ theme: themeName === "dark" ? "light" : "dark" })}
              />
            </View>

            <View style={card}>
              <View style={styles.top}>
                <Avatar uri={state.avatar} />
                <View style={{ flex: 1 }}>
                  <Text style={[styles.name, { color: t.text }]}>{state.name}</Text>
                  <Text style={{ color: t.muted }}>{`@${state.username}`}</Text>
                </View>
                <Button label="Edit profile" onPress={() => setEditOpen(true)} />
              </View>
              {state.bio ? <Text style={[styles.bio, { color: t.muted }]}>{state.bio}</Text> : null}
              <View style={[styles.stats, { borderTopColor: t.line }]}>
                <Pressable onPress={() => setTab("followers")}>
                  <Text style={[styles.statNum, { color: t.text }]}>{followers}</Text>
                  <Text style={[styles.statLabel, { color: t.muted }]}>Followers</Text>
                </Pressable>
                <Pressable onPress={() => setTab("following")}>
                  <Text style={[styles.statNum, { color: t.text }]}>{following}</Text>
                  <Text style={[styles.statLabel, { color: t.muted }]}>Following</Text>
                </Pressable>
                <View>
                  <Text style={[styles.statNum, { color: t.text }]}>{unlocked}</Text>
                  <Text style={[styles.statLabel, { color: t.muted }]}>Achievements</Text>
                </View>
              </View>
            </View>

            <Text style={[styles.h2, { color: t.text }]}>World map</Text>
            <View style={card}>
              <Text style={{ color: t.muted }}>
                <Text style={{ color: t.text, fontWeight: "700" }}>{`${pct}% `}</Text>
                {`of the world explored (${visited.size} of ${COUNTRIES.length} countries)`}
              </Text>
              <View style={[styles.bar, { backgroundColor: t.lock }]}>
                <View style={{ width: `${pct}%`, height: "100%", backgroundColor: t.brand }} />
              </View>
              <WorldMap visited={visited} onPress={onCountryPress} />
              <Text style={{ color: t.muted, fontSize: 13 }}>
                {demo ? "Demo mode: tap a country to light it up." : "Countries light up automatically from your trip history."}
              </Text>
            </View>

            <View style={styles.row}>
              <Text style={[styles.h2, { color: t.text, marginTop: 0 }]}>Trip history</Text>
              <Button small variant="primary" label="+ Add trip" onPress={() => setTripOpen(true)} />
            </View>
            <TripList trips={state.trips} />

            <Text style={[styles.h2, { color: t.text }]}>Achievements</Text>
            <Text style={{ color: t.muted }}>{`${unlocked} of ${items.length} unlocked`}</Text>
            <Achievements
              groups={groups}
              demoUnlocked={state.demoUnlocked}
              demoMode={demo}
              onToggle={(id) => update((s) => ({ demoUnlocked: toggleIn(s.demoUnlocked, id) }))}
            />

            <View style={styles.demoRow}>
              <Switch value={demo} onValueChange={setDemo} trackColor={{ true: t.brand }} />
              <Text style={{ color: t.muted, flex: 1, fontSize: 13 }}>
                Demo mode (tap countries to light them up, tap an achievement to unlock it)
              </Text>
            </View>
            {demo ? (
              <View style={styles.demoTools}>
                <Button
                  small
                  label="Visit everything"
                  onPress={() => update({ manual: COUNTRIES.map((c) => c.code), demoUnlocked: ["everest"] })}
                />
                <Button small label="Clear demo visits" onPress={() => update({ manual: [], demoUnlocked: [] })} />
              </View>
            ) : null}
            <Pressable onPress={confirmReset} style={{ marginTop: 14 }}>
              <Text style={{ color: t.muted, fontSize: 13, textDecorationLine: "underline" }}>Reset profile</Text>
            </Pressable>
          </ScrollView>

          <EditProfileModal
            visible={editOpen}
            profile={state}
            onClose={() => setEditOpen(false)}
            onSave={(patch) => update(patch)}
          />
          <TripModal
            visible={tripOpen}
            onClose={() => setTripOpen(false)}
            onSave={(trip) => update((s) => ({ trips: [...s.trips, { ...trip, id: `t${Date.now()}` }] }))}
          />
          <PeopleModal
            tab={tab}
            onTab={setTab}
            onClose={() => setTab(null)}
            people={state.people}
            onToggleFollow={(id) =>
              update((s) => ({ people: s.people.map((p) => (p.id === id ? { ...p, following: !p.following } : p)) }))
            }
          />
        </SafeAreaView>
      </ThemeContext.Provider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  content: { padding: 16, paddingBottom: 48 },
  head: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 16 },
  logo: { fontWeight: "800", letterSpacing: 2, fontSize: 16 },
  top: { flexDirection: "row", alignItems: "center", gap: 14 },
  name: { fontSize: 20, fontWeight: "700" },
  bio: { marginTop: 14, lineHeight: 21 },
  stats: { flexDirection: "row", gap: 28, marginTop: 16, paddingTop: 16, borderTopWidth: 1 },
  statNum: { fontSize: 18, fontWeight: "700" },
  statLabel: { fontSize: 13 },
  h2: { fontSize: 17, fontWeight: "700", marginTop: 28, marginBottom: 8 },
  bar: { height: 8, borderRadius: 99, overflow: "hidden", marginTop: 10 },
  row: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 28, marginBottom: 8 },
  demoRow: { flexDirection: "row", alignItems: "center", gap: 10, marginTop: 24 },
  demoTools: { flexDirection: "row", gap: 8, marginTop: 10 },
});
