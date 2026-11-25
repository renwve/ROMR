// Tokens from the ROMR Figma file (Redesign section).
export const colors = {
  white100: '#FFFFFF',
  white200: '#E7E7F1',
  blue100: '#C0CAF9',
  blue300: '#636EEC',
  blue900: '#0B1049',
  gray100: '#D5D6E2',
  pink200: '#F4BED2',
  gray200: '#B7B8CD',
  gray300: '#989BB8',
  gray400: '#7A7EA3',
  gray500: '#60648B',
  gray700: '#36394E',
  dark800: '#18191B',
} as const;

// Keys registered with useFonts in src/app/_layout.tsx.
export const fonts = {
  regular: 'BeVietnamProRegular',
  medium: 'BeVietnamProMedium',
  semiBold: 'BeVietnamProSemiBold',
  bold: 'BeVietnamProBold',
  black: 'BeVietnamProBlack',
} as const;

// Effect styles from the ROMR Figma file, as CSS box shadows.
export const shadows = {
  soft: '0px 0px 30px 0px rgba(0, 0, 0, 0.1)',
  mediumSoft: '0px 0px 30px 0px rgba(0, 0, 0, 0.2)',
} as const;
