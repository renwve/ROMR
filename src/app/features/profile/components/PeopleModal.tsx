import { FlatList, View } from 'react-native';

import { useTheme } from '../theme';
import type { Person } from '../types';
import Avatar from './Avatar';
import Button from './Button';
import Sheet from './Sheet';
import Txt from './Txt';

export type PeopleTab = 'followers' | 'following';

type Props = {
  tab: PeopleTab | null;
  onTab: (tab: PeopleTab) => void;
  onClose: () => void;
  people: Person[];
  onToggleFollow: (id: string) => void;
};

export default function PeopleModal({ tab, onTab, onClose, people, onToggleFollow }: Props) {
  const t = useTheme();
  const list = people.filter((p) => (tab === 'followers' ? p.followsMe : p.following));

  return (
    <Sheet
      visible={tab !== null}
      onClose={onClose}
      title={tab === 'following' ? 'Following' : 'Followers'}
      scroll={false}>
      <View style={{ flexDirection: 'row', gap: 8, marginVertical: 12 }}>
        <Button
          small
          variant={tab === 'followers' ? 'primary' : 'default'}
          label="Followers"
          onPress={() => onTab('followers')}
        />
        <Button
          small
          variant={tab === 'following' ? 'primary' : 'default'}
          label="Following"
          onPress={() => onTab('following')}
        />
      </View>
      <FlatList
        data={list}
        keyExtractor={(p) => p.id}
        ListEmptyComponent={<Txt color={t.muted}>Nobody here yet.</Txt>}
        renderItem={({ item }) => (
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 12,
              paddingVertical: 10,
              borderBottomWidth: 1,
              borderBottomColor: t.line,
            }}>
            <Avatar size={44} emoji={item.emoji} />
            <View style={{ flex: 1 }}>
              <Txt weight="semiBold" size={15} color={t.ink}>
                {item.name}
              </Txt>
              <Txt size={13} color={t.muted}>{`@${item.username}`}</Txt>
            </View>
            <Button
              small
              variant={item.following ? 'default' : 'primary'}
              label={item.following ? (tab === 'following' ? 'Unfollow' : 'Following') : 'Follow back'}
              onPress={() => onToggleFollow(item.id)}
            />
          </View>
        )}
      />
      <View style={{ alignItems: 'flex-end', marginTop: 12 }}>
        <Button label="Close" onPress={onClose} />
      </View>
    </Sheet>
  );
}
