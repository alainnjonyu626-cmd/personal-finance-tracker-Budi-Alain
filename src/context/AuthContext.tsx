/**
 * The login state of the whole app, shared by every screen.
 * Screens read the current user from here instead of loading it themselves.
 */

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";

import { clearSession, loadSession, saveSession } from "@/storage/auth";
import type { SessionUser } from "@/types/models";

// What the context offers to every screen under the provider.
interface AuthContextValue {
  // The logged-in user, or null when nobody is logged in.
  user: SessionUser | null;
  // True while we are still checking if there is a saved session.
  loading: boolean;
  // Log in a user. `remember` also saves the session for the next visit.
  signIn: (user: SessionUser, remember: boolean) => Promise<void>;
  // Log out the current user.
  signOut: () => Promise<void>;
}

// null means "no provider above": useAuth turns that into a clear error.
const AuthContext = createContext<AuthContextValue | null>(null);

/** Wraps the app and keeps the logged-in user in memory. */
export function AuthProvider({ children }: { children: ReactNode }) {
  // Nobody is logged in until we have finished reading the saved session.
  const [user, setUser] = useState<SessionUser | null>(null);
  // True until the first check is done, so screens can wait.
  const [loading, setLoading] = useState(true);

  // On the first mount only: read the saved session, then stop loading.
  useEffect(() => {
    let stillMounted = true;

    async function restoreSession() {
      try {
        const savedUser = await loadSession();
        if (stillMounted) {
          setUser(savedUser);
        }
      } catch {
        // A storage problem just means "nobody is logged in".
        if (stillMounted) {
          setUser(null);
        }
      } finally {
        // Even if it failed, the app must not stay stuck on loading.
        if (stillMounted) {
          setLoading(false);
        }
      }
    }

    restoreSession();

    // If this provider is removed before the check ends, stop updating it.
    return () => {
      stillMounted = false;
    };
  }, []);

  // The functions are stable, so screens do not re-render for nothing.
  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      loading,
      // Log in: save the session first, then remember the user in memory.
      signIn: async (nextUser: SessionUser, remember: boolean) => {
        await saveSession(nextUser, remember);
        setUser(nextUser);
      },
      // Log out: forget the saved session, then clear the user in memory.
      signOut: async () => {
        await clearSession();
        setUser(null);
      },
    }),
    [user, loading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/** Read the login state. Must be used inside <AuthProvider>. */
export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside an AuthProvider.");
  }

  return context;
}
