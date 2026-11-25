import { Text, type TextProps } from 'react-native';
import { useTheme } from '../theme';

type Props = TextProps & {
  weight?: 'regular' | 'medium' | 'semiBold' | 'boldItalic';
  size?: number;
  color?: string;
};

const weights = {
  regular: '400' as const,
  medium: '500' as const,
  semiBold: '600' as const,
  boldItalic: '700' as const,
};

export default function Txt({ weight = 'regular', size = 14, color, style, ...rest }: Props) {
  const t = useTheme();
  return (
    <Text
      {...rest}
      style={[
        {
          fontSize: size,
          fontWeight: weights[weight],
          fontStyle: weight === 'boldItalic' ? 'italic' : 'normal',
          letterSpacing: -size * 0.025,
          color: color ?? t.body,
        },
        style,
      ]}
    />
  );
}
