import { useMemo, useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Switch, useColorScheme, View } from 'react-native';

import { icons } from '@/features/planner/assets';
import { PillButton } from '@/features/planner/components/Buttons';
import { buildAchievements, visitedSet, worldPercent } from './achievements';
import Achievements from './components/Achievements';
import Button from './components/Button';
import EditProfileModal from './components/EditProfileModal';
import PeopleModal, { type PeopleTab } from './components/PeopleModal';
import ProfileHeader from './components/ProfileHeader';
import TripList from './components/TripList';
import TripModal from './components/TripModal';
import Txt from './components/Txt';
import WorldMap from './components/WorldMap';
import { COUNTRIES } from './data/countries';
import { useProfile } from './store';
import { ThemeContext, cardStyle, darkTheme, lightTheme } from './theme';

const NAV_BAR_CLEARANCE = 40 + 61 + 10;

const toggleIn = (list: string[], id: string) =>
  list.includes(id) ? list.filter((x) => x !== id) : [...list, id];

export default function ProfileScreen() {
  const system = useColorScheme();
  const { state, ready, update, reset } = useProfile();
  const [demo, setDemo] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [tripOpen, setTripOpen] = useState(false);
  const [tab, setTab] = useState<PeopleTab | null>(null);

  const themeName = state.theme ?? (system === 'dark' ? 'dark' : 'light');
  const t = themeName === 'dark' ? darkTheme : lightTheme;

  const visited = useMemo(() => visitedSet(state), [state]);
  const pct = worldPercent(visited);
  const groups = useMemo(() => buildAchievements(visited, state.trips), [visited, state.trips]);

  if (!ready) return null;

  const items = groups.flatMap((g) => g.items);
  const unlocked = items.filter((a) => a.real || state.demoUnlocked.includes(a.id)).length;
  const followers = state.people.filter((p) => p.followsMe).length;
  const following = state.people.filter((p) => p.following).length;

  const confirmReset = () =>
    Alert.alert('Reset profile', 'Reset the profile back to the defaults?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Reset', style: 'destructive', onPress: reset },
    ]);

  const card = cardStyle(t);

  return (
    <ThemeContext.Provider value={t}>
      <View style={[styles.screen, { backgroundColor: t.bg }]}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
          <ProfileHeader
            name={state.name}
            username={state.username}
            bio={state.bio}
            avatar={state.avatar}
            followers={followers}
            following={following}
            achievements={unlocked}
            dark={themeName === 'dark'}
            onEdit={() => setEditOpen(true)}
            onToggleTheme={() => update({ theme: themeName === 'dark' ? 'light' : 'dark' })}
            onOpenPeople={setTab}
          />

          <View style={styles.cards}>
            <View style={card}>
              <View style={styles.cardHead}>
                <Txt weight="semiBold" size={16} color={t.ink}>
                  World map
                </Txt>
                <Txt weight="medium" size={14} color={t.brand}>
                  {`${pct}% explored`}
                </Txt>
              </View>
              <View style={[styles.bar, { backgroundColor: t.lock }]}>
                <View style={{ width: `${pct}%`, height: '100%', backgroundColor: t.brand }} />
              </View>
              <WorldMap
                visited={visited}
                onPress={(code) => {
                  if (demo) update((s) => ({ manual: toggleIn(s.manual, code) }));
                }}
              />
              <Txt size={13} color={t.muted}>
                {demo
                  ? 'Demo mode: tap a country to light it up.'
                  : `${visited.size} of ${COUNTRIES.length} countries. They light up automatically from your trip history.`}
              </Txt>
            </View>

            <View style={styles.toolbar}>
              <Txt weight="semiBold" size={18} color={t.ink}>
                Trip history
              </Txt>
              <PillButton icon={icons.plusWhite16} label="Add trip" onPress={() => setTripOpen(true)} />
            </View>
            <TripList trips={state.trips} />

            <View style={styles.toolbar}>
              <Txt weight="semiBold" size={18} color={t.ink}>
                Achievements
              </Txt>
              <Txt weight="medium" size={14} color={t.brand}>
                {`${unlocked} of ${items.length} unlocked`}
              </Txt>
            </View>
            <Achievements
              groups={groups}
              demoUnlocked={state.demoUnlocked}
              demoMode={demo}
              onToggle={(id) => update((s) => ({ demoUnlocked: toggleIn(s.demoUnlocked, id) }))}
            />

            <View style={card}>
              <View style={styles.demoRow}>
                <Switch value={demo} onValueChange={setDemo} trackColor={{ true: t.brand }} />
                <Txt size={13} color={t.muted} style={styles.demoText}>
                  Demo mode (tap countries to light them up, tap an achievement to unlock it)
                </Txt>
              </View>
              {demo ? (
                <View style={styles.demoTools}>
                  <Button
                    small
                    label="Visit everything"
                    onPress={() => update({ manual: COUNTRIES.map((c) => c.code), demoUnlocked: ['everest'] })}
                  />
                  <Button small label="Clear demo visits" onPress={() => update({ manual: [], demoUnlocked: [] })} />
                </View>
              ) : null}
              <Pressable accessibilityRole="button" onPress={confirmReset}>
                <Txt size={13} color={t.muted} style={styles.reset}>
                  Reset profile
                </Txt>
              </Pressable>
            </View>
          </View>
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
            update((s) => ({
              people: s.people.map((p) => (p.id === id ? { ...p, following: !p.following } : p)),
            }))
          }
        />
      </View>
    </ThemeContext.Provider>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  scroll: {
    paddingBottom: NAV_BAR_CLEARANCE,
  },
  cards: {
    gap: 10,
    paddingTop: 16,
    paddingHorizontal: 16,
  },
  cardHead: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  bar: {
    height: 8,
    borderRadius: 99,
    overflow: 'hidden',
  },
  toolbar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 14,
    paddingBottom: 4,
  },
  demoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  demoText: {
    flex: 1,
  },
  demoTools: {
    flexDirection: 'row',
    gap: 8,
  },
  reset: {
    textDecorationLine: 'underline',
  },
});
