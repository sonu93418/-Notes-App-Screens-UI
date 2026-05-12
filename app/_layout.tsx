import { Slot } from "expo-router";
import { StyleSheet, View, useWindowDimensions } from "react-native";
import { useColorScheme } from "react-native";
import { getPalette } from "./theme";

export default function RootLayout() {
  const scheme = useColorScheme();
  const { width } = useWindowDimensions();
  const colors = getPalette(scheme);
  const horizontal = width > 700 ? 48 : 0;

  // No app-wide background image; editor header handles images now.

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <View style={[styles.content, { paddingHorizontal: horizontal }]}>
        <Slot />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    width: "100%",
  },
  root: {
    flex: 1,
  },
});
