/**
 * Layout for the screens shown when nobody is logged in
 * (login, register, forgot password, reset password).
 */

import { Redirect, Stack } from "expo-router";

import { useAuth } from "@/context/AuthContext";
import { colors } from "@/theme";

export default function AuthLayout() {
  const { user, loading } = useAuth();

  // Wait while the saved session is being checked.
  if (loading) {
    return null;
  }

  // A logged-in user has nothing to do here: send them to the reports.
  if (user) {
    return <Redirect href="/reports" />;
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
