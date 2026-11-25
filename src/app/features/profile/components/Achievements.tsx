import { Pressable, StyleSheet, View } from 'react-native';
import { cardStyle, useTheme } from '../theme';
import type { Achievement, AchievementGroup } from '../types';
import Txt from './Txt';

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
        accessibilityRole="button"
        accessibilityState={{ disabled: !demoMode || a.real }}
        onPress={() => { if (demoMode && !a.real) onToggle(a.id); }}
        style={[styles.tile, { backgroundColor: on ? t.brandSoft : t.lock }]}>
        <View style={styles.icon}><Txt size={30}>{on ? a.icon : '🔒'}</Txt></View>
        <Txt weight="semiBold" size={14} color={on ? t.ink : t.muted} style={styles.center}>{a.title}</Txt>
        <Txt size={12} color={t.muted} style={styles.center}>{a.desc}</Txt>
      </Pressable>
    );
  };

  return (
    <>
      {groups.map((g) => (
        <View key={g.title} style={cardStyle(t)}>
          <View style={styles.head}>
            <Txt weight="semiBold" size={16} color={t.ink}>{g.title}</Txt>
            {g.sub ? <Txt size={14} color={t.muted}>{g.sub}</Txt> : null}
          </View>
          <View style={styles.grid}>{g.items.map(renderTile)}</View>
        </View>
      ))}
    </>
  );
}

const styles = StyleSheet.create({
  head: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  tile: { width: '48.5%', padding: 12, gap: 2, alignItems: 'center', borderRadius: 12 },
  icon: { height: 36, alignItems: 'center', justifyContent: 'center' },
  center: { textAlign: 'center' },
});
