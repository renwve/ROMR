import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors, fonts } from '@/constants/theme';
import { icons } from '@/features/planner/assets';
import Avatar from './Avatar';
import Button from './Button';
import type { PeopleTab } from './PeopleModal';
import Txt from './Txt';

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

function formatToday() {
  const now = new Date();
  return `${MONTHS[now.getMonth()]} ${now.getDate()}`;
}

type Props = {
  name: string;
  username: string;
  bio: string;
  avatar: string | null;
  followers: number;
  following: number;
  achievements: number;
  dark: boolean;
  onEdit: () => void;
  onToggleTheme: () => void;
  onOpenPeople: (tab: PeopleTab) => void;
};

export default function ProfileHeader({
  name,
  username,
  bio,
  avatar,
  followers,
  following,
  achievements,
  dark,
  onEdit,
  onToggleTheme,
  onOpenPeople,
}: Props) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.card, { paddingTop: insets.top + 8 }]}>
      <View style={styles.titleRow}>
        <View>
          <Txt weight="boldItalic" size={12} color={colors.white100} style={styles.brand}>
            ROMR
          </Txt>
          <Image source={icons.romrStar} style={styles.brandStar} />
        </View>
        <Txt weight="boldItalic" size={12} color={colors.white100}>
          {formatToday()}
        </Txt>
        <View pointerEvents="none" style={styles.titleWrap}>
          <Txt weight="boldItalic" size={20} color={colors.white100}>
            Account
          </Txt>
        </View>
      </View>

      <View style={styles.profile}>
        <View style={styles.ring}>
          <Avatar uri={avatar} size={72} />
        </View>
        <View style={styles.names}>
          <Txt weight="boldItalic" size={24} color={colors.white100} numberOfLines={1} style={styles.name}>
            {name}
          </Txt>
          <Txt size={14} color={colors.white200} numberOfLines={1}>
            {`@${username}`}
          </Txt>
        </View>
      </View>

      {bio ? (
        <Txt size={14} color={colors.white200} style={styles.bio}>
          {bio}
        </Txt>
      ) : null}

      <View style={styles.stats}>
        <Pressable accessibilityRole="button" onPress={() => onOpenPeople('followers')}>
          <Txt weight="semiBold" size={20} color={colors.white100}>
            {followers}
          </Txt>
          <Txt size={14} color={colors.white200}>
            Followers
          </Txt>
        </Pressable>
        <Pressable accessibilityRole="button" onPress={() => onOpenPeople('following')}>
          <Txt weight="semiBold" size={20} color={colors.white100}>
            {following}
          </Txt>
          <Txt size={14} color={colors.white200}>
            Following
          </Txt>
        </Pressable>
        <View>
          <Txt weight="semiBold" size={20} color={colors.white100}>
            {achievements}
          </Txt>
          <Txt size={14} color={colors.white200}>
            Achievements
          </Txt>
        </View>
      </View>

      <View style={styles.actions}>
        <Button variant="white" label="Edit profile" onPress={onEdit} />
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Toggle dark mode"
          onPress={onToggleTheme}
          style={styles.circle}>
          <Ionicons name={dark ? 'sunny-outline' : 'moon-outline'} size={22} color={colors.blue900} />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.blue300,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
  },
  brand: {
    letterSpacing: -0.96,
  },
  brandStar: {
    position: 'absolute',
    left: 31,
    top: -2,
    width: 7.869,
    height: 7.869,
  },
  titleWrap: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: -5,
    alignItems: 'center',
  },
  profile: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginTop: 32,
  },
  ring: {
    borderRadius: 100,
    borderWidth: 3,
    borderColor: colors.white100,
  },
  names: {
    flex: 1,
    gap: 2,
  },
  name: {
    lineHeight: 30,
    includeFontPadding: false,
    fontFamily: fonts.boldItalic,
  },
  bio: {
    marginTop: 16,
    lineHeight: 21,
  },
  stats: {
    flexDirection: 'row',
    gap: 28,
    marginTop: 16,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 24,
  },
  circle: {
    width: 44,
    height: 44,
    borderRadius: 100,
    backgroundColor: colors.white100,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
