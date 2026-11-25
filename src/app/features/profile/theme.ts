import { createContext, useContext } from 'react';
import type { ViewStyle } from 'react-native';

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
  bg: '#F5F7FF',
  card: '#FFFFFF',
  ink: '#172554',
  body: '#334155',
  muted: '#8490A5',
  line: '#E5EAF3',
  brand: '#5275E8',
  brandSoft: '#E7EDFF',
  lock: '#E9EDFA',
  land: '#E5EAF3',
  danger: '#D64545',
  onBrand: '#FFFFFF',
};

export const darkTheme: Theme = {
  bg: '#070B33',
  card: '#111747',
  ink: '#FFFFFF',
  body: '#E5E7F0',
  muted: '#A0A8C0',
  line: '#262E78',
  brand: '#5275E8',
  brandSoft: '#1B2275',
  lock: '#151C63',
  land: '#262E78',
  danger: '#FF8A8C',
  onBrand: '#FFFFFF',
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
