import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { Platform, StyleSheet, View } from "react-native";

// The exact font weights this app uses. Loading only these keeps startup fast.
import { Fraunces_600SemiBold, Fraunces_700Bold } from "@expo-google-fonts/fraunces";
import {
  InstrumentSans_400Regular,
  InstrumentSans_600SemiBold,
} from "@expo-google-fonts/instrument-sans";
import {
  IBMPlexMono_500Medium,
  IBMPlexMono_600SemiBold,
} from "@expo-google-fonts/ibm-plex-mono";

import { colors, layout } from "@/theme";

// Keep the splash screen up until we tell it to hide (after fonts load).
SplashScreen.preventAutoHideAsync();

// On desktop web the screen is wider than a phone, so we draw a phone-width
// frame in the middle and colour the empty space around it with paperDeep.
const styles = StyleSheet.create({
  screen: {
    flex: 1,
    // a column so the frame can fill the height
    alignItems: "center",
    // on phones the frame fills the width, so this is the page background;
    // on wide screens this is the colour of the area outside the frame
    backgroundColor: colors.paperDeep,
  },
  frame: {
    flex: 1,
    width: "100%",
    maxWidth: layout.maxContentWidth,
    // the actual "paper" the app is drawn on
    backgroundColor: colors.paper,
    // a soft edge on desktop so the frame reads as a phone
    ...Platform.select({
      web: {
        boxShadow: `0 0 24px ${colors.line}`,
      },
      default: {},
    }),
  },
});

export default function RootLayout() {
  // Load the three font families. `loaded` turns true when they are ready.
  const [loaded, error] = useFonts({
    Fraunces_700Bold,
    Fraunces_600SemiBold,
    InstrumentSans_400Regular,
    InstrumentSans_600SemiBold,
    IBMPlexMono_500Medium,
    IBMPlexMono_600SemiBold,
  });

  // Hide the splash screen once fonts are ready (or if loading failed, so the
  // app is never stuck forever on a splash screen).
  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  // Nothing is rendered until the fonts are ready, so text never
  // flickers in a fallback font before switching.
  if (!loaded && !error) {
    return null;
  }

  return (
    <View style={styles.screen}>
      {/* dark status bar icons, readable on the cream paper */}
      <StatusBar style="dark" />
      <View style={styles.frame}>
        {/* every screen is drawn inside this frame */}
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: colors.paper },
          }}
        />
      </View>
    </View>
  );
}
