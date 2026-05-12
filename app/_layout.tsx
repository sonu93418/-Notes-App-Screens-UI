import { Stack } from "expo-router";
import { ImageBackground, StyleSheet, View } from "react-native";
import { useColorScheme } from "react-native";

const bg = require("../assets/images/splash-icon.png");

export default function RootLayout() {
  const scheme = useColorScheme();
  const overlayColor = scheme === "dark" ? "rgba(0,0,0,0.35)" : "rgba(255,255,255,0.15)";

  return (
    <ImageBackground source={bg} style={styles.container} imageStyle={styles.image}>
      <View style={[styles.overlay, { backgroundColor: overlayColor }]} />
      <Stack />
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  image: {
    resizeMode: "cover",
    opacity: 0.95,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 0,
  },
});
