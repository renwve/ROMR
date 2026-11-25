import { Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../theme';
import Avatar from './Avatar';
import Button from './Button';
import type { PeopleTab } from './PeopleModal';
import Txt from './Txt';

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const formatToday = () => {
  const now = new Date();
  return `${MONTHS[now.getMonth()]} ${now.getDate()}`;
};

type Props = {
  name: string; username: string; bio: string; avatar: string | null;
  followers: number; following: number; achievements: number; dark: boolean;
  onEdit: () => void; onToggleTheme: () => void; onOpenPeople: (tab: PeopleTab) => void;
};

export default function ProfileHeader({ name, username, bio, avatar, followers, following, achievements, dark, onEdit, onToggleTheme, onOpenPeople }: Props) {
  const insets = useSafeAreaInsets();
  const t = useTheme();
  return (
    <View style={[styles.card, { backgroundColor: t.brand, paddingTop: insets.top + 12 }]}>
      <View style={styles.titleRow}>
        <Txt weight="boldItalic" size={13} color="#FFFFFF">ROMR ✦</Txt>
        <Txt weight="boldItalic" size={20} color="#FFFFFF">Account</Txt>
        <Txt weight="boldItalic" size={12} color="#FFFFFF">{formatToday()}</Txt>
      </View>
      <View style={styles.profile}>
        <View style={styles.ring}><Avatar uri={avatar} size={72} /></View>
        <View style={styles.names}>
          <Txt weight="boldItalic" size={24} color="#FFFFFF" numberOfLines={1}>{name}</Txt>
          <Txt size={14} color="#E8EDFF" numberOfLines={1}>{`@${username}`}</Txt>
        </View>
      </View>
      {bio ? <Txt size={14} color="#E8EDFF" style={styles.bio}>{bio}</Txt> : null}
      <View style={styles.stats}>
        <Pressable accessibilityRole="button" onPress={() => onOpenPeople('followers')}>
          <Txt weight="semiBold" size={20} color="#FFFFFF">{followers}</Txt>
          <Txt size={14} color="#E8EDFF">Followers</Txt>
        </Pressable>
        <Pressable accessibilityRole="button" onPress={() => onOpenPeople('following')}>
          <Txt weight="semiBold" size={20} color="#FFFFFF">{following}</Txt>
          <Txt size={14} color="#E8EDFF">Following</Txt>
        </Pressable>
        <View>
          <Txt weight="semiBold" size={20} color="#FFFFFF">{achievements}</Txt>
          <Txt size={14} color="#E8EDFF">Achievements</Txt>
        </View>
      </View>
      <View style={styles.actions}>
        <Button variant="white" label="Edit profile" onPress={onEdit} />
        <Pressable accessibilityRole="button" accessibilityLabel="Toggle dark mode" onPress={onToggleTheme} style={styles.circle}>
          <Txt size={20} color="#172554">{dark ? '☀️' : '🌙'}</Txt>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { borderBottomLeftRadius: 36, borderBottomRightRadius: 36, paddingHorizontal: 16, paddingBottom: 24 },
  titleRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 8 },
  profile: { flexDirection: 'row', alignItems: 'center', gap: 16, marginTop: 30 },
  ring: { borderRadius: 100, borderWidth: 3, borderColor: '#FFFFFF' },
  names: { flex: 1, gap: 2 },
  bio: { marginTop: 16, lineHeight: 21 },
  stats: { flexDirection: 'row', gap: 28, marginTop: 16 },
  actions: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 24 },
  circle: { width: 44, height: 44, borderRadius: 100, backgroundColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center' },
});
