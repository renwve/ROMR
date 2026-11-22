import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { Text, View } from 'react-native';

import { useTheme } from '../theme';

type Props = { uri?: string | null; emoji?: string; size?: number };

export default function Avatar({ uri, emoji, size = 72 }: Props) {
  const t = useTheme();
  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: t.brandSoft,
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
      }}>
      {uri ? (
        <Image source={{ uri }} style={{ width: size, height: size }} contentFit="cover" />
      ) : emoji ? (
        <Text style={{ fontSize: size / 2.1 }}>{emoji}</Text>
      ) : (
        <Ionicons name="person" size={size / 2} color={t.brand} />
      )}
    </View>
  );
}
