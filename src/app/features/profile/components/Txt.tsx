import { Text, type TextProps } from 'react-native';

import { fonts } from '@/constants/theme';
import { useTheme } from '../theme';

type Props = TextProps & {
  weight?: 'regular' | 'medium' | 'semiBold' | 'boldItalic';
  size?: number;
  color?: string;
};

export default function Txt({ weight = 'regular', size = 14, color, style, ...rest }: Props) {
  const t = useTheme();
  return (
    <Text
      {...rest}
      style={[
        { fontFamily: fonts[weight], fontSize: size, letterSpacing: -size * 0.04, color: color ?? t.body },
        style,
      ]}
    />
  );
}
