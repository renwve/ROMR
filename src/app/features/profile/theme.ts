import { createContext, useContext } from 'react';
import type { ViewStyle } from 'react-native';

import { colors } from '@/constants/theme';

export type Theme = {
  bg: string;
  card: string;
  ink: string;
  body: string;
  muted: string;
  line: string;
  brand: string;
  brandSoft: string;
  lock: string;
  land: string;
  danger: string;
  onBrand: string;
};

export const lightTheme: Theme = {
  bg: colors.white200,
  card: colors.white100,
  ink: colors.blue900,
  body: colors.dark800,
  muted: colors.gray400,
  line: colors.gray100,
  brand: colors.blue300,
  brandSoft: colors.blue100,
  lock: colors.white200,
  land: colors.gray100,
  danger: colors.red,
  onBrand: colors.white100,
};

export const darkTheme: Theme = {
  bg: '#070B33',
  card: colors.blue900,
  ink: colors.white100,
  body: colors.gray100,
  muted: colors.gray300,
  line: '#262E78',
  brand: colors.blue300,
  brandSoft: '#1B2275',
  lock: '#151C63',
  land: '#262E78',
  danger: '#FF8A8C',
  onBrand: colors.white100,
};

export const ThemeContext = createContext<Theme>(lightTheme);
export const useTheme = () => useContext(ThemeContext);

export const cardStyle = (t: Theme): ViewStyle => ({
  backgroundColor: t.card,
  borderColor: t.line,
  borderWidth: 1,
  borderRadius: 20,
  padding: 16,
  gap: 12,
});
