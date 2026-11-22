import * as ImagePicker from 'expo-image-picker';
import { useState } from 'react';
import { View } from 'react-native';

import { useTheme } from '../theme';
import type { ProfileState } from '../types';
import Avatar from './Avatar';
import Button from './Button';
import Field from './Field';
import Sheet from './Sheet';
import Txt from './Txt';

type Editable = Pick<ProfileState, 'name' | 'username' | 'bio' | 'avatar'>;

type Props = {
  visible: boolean;
  profile: Editable;
  onClose: () => void;
  onSave: (patch: Editable) => void;
};

export default function EditProfileModal({ visible, profile, onClose, onSave }: Props) {
  return (
    <Sheet visible={visible} onClose={onClose} title="Edit profile">
      {visible ? <EditForm profile={profile} onClose={onClose} onSave={onSave} /> : null}
    </Sheet>
  );
}

function EditForm({ profile, onClose, onSave }: Omit<Props, 'visible'>) {
  const t = useTheme();
  const [name, setName] = useState(profile.name);
  const [username, setUsername] = useState(profile.username);
  const [bio, setBio] = useState(profile.bio);
  const [avatar, setAvatar] = useState<string | null>(profile.avatar);
  const [error, setError] = useState('');

  const pickPhoto = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.4,
      base64: true,
    });
    if (!result.canceled && result.assets[0].base64) {
      setAvatar(`data:image/jpeg;base64,${result.assets[0].base64}`);
    }
  };

  const save = () => {
    const clean = username.trim().replace(/^@/, '');
    if (!/^[A-Za-z0-9_.]{3,20}$/.test(clean)) {
      setError('Username: 3–20 characters, letters, numbers, _ or . only.');
      return;
    }
    onSave({ name: name.trim() || profile.name, username: clean, bio: bio.trim(), avatar });
    onClose();
  };

  return (
    <View>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginTop: 14 }}>
        <Avatar uri={avatar} />
        <Button small label="Change photo" onPress={pickPhoto} />
        <Button small variant="ghost" label="Remove" onPress={() => setAvatar(null)} />
      </View>
      <Field label="Name" value={name} onChangeText={setName} maxLength={40} />
      <Field
        label="Username"
        value={username}
        onChangeText={setUsername}
        maxLength={20}
        autoCapitalize="none"
        autoCorrect={false}
      />
      <Field
        label="Bio"
        value={bio}
        onChangeText={setBio}
        maxLength={150}
        multiline
        style={{ minHeight: 70, textAlignVertical: 'top' }}
      />
      <Txt size={12} color={t.muted} style={{ marginTop: 4 }}>{`${bio.length}/150`}</Txt>
      <Txt size={13} color={t.danger} style={{ marginTop: 6, minHeight: 18 }}>
        {error}
      </Txt>
      <View style={{ flexDirection: 'row', justifyContent: 'flex-end', gap: 8, marginTop: 10 }}>
        <Button variant="ghost" label="Cancel" onPress={onClose} />
        <Button variant="primary" label="Save" onPress={save} />
      </View>
    </View>
  );
}
