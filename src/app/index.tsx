/**
 * The first screen the app opens on.
 * It only decides where to send the user: to the reports or to the login.
 */

import { Redirect } from "expo-router";

import { useAuth } from "@/context/AuthContext";

export default function Index() {
  const { user, loading } = useAuth();

  // Nothing yet: the saved session is still being checked.
  if (loading) {
    return null;
  }

  // Logged in? go to the reports list. Otherwise go to the login screen.
  return user ? <Redirect href="/reports" /> : <Redirect href="/login" />;
}
