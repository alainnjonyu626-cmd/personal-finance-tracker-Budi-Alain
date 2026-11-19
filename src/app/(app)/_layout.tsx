/**
 * Layout for the screens shown when a user is logged in
 * (reports, add report, edit report).
 */

import { Redirect, Stack } from "expo-router";

import { useAuth } from "@/context/AuthContext";
import { colors } from "@/theme";

export default function AppLayout() {
  const { user, loading } = useAuth();

  // Wait while the saved session is being checked.
  if (loading) {
    return null;
  }

  // Nobody logged in: send the user to the login screen.
  if (!user) {
    return <Redirect href="/login" />;
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.paper },
      }}
    />
  );
}
