import { createContext, useContext } from "react";
import { ViewStyle } from "react-native";

export type Theme = {
  bg: string;
  card: string;
  text: string;
  muted: string;
  line: string;
  brand: string;
  brandSoft: string;
  lock: string;
  danger: string;
};

export const lightTheme: Theme = {
  bg: "#f6f7f9",
  card: "#ffffff",
  text: "#14212b",
  muted: "#6b7a86",
  line: "#e3e8ec",
  brand: "#0f9d8a",
  brandSoft: "#dff5f1",
  lock: "#eceff2",
  danger: "#d64545",
};

export const darkTheme: Theme = {
  bg: "#0f1519",
  card: "#18222a",
  text: "#eaf0f4",
  muted: "#93a3ae",
  line: "#27343d",
  brand: "#2dd4bf",
  brandSoft: "#12332f",
  lock: "#212d35",
  danger: "#ff7a7a",
};

export const ThemeContext = createContext<Theme>(lightTheme);
export const useTheme = () => useContext(ThemeContext);

export const cardStyle = (t: Theme): ViewStyle => ({
  backgroundColor: t.card,
  borderColor: t.line,
  borderWidth: 1,
  borderRadius: 16,
  padding: 20,
});
