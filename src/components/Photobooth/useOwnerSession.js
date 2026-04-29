import { useCallback, useEffect, useState } from "react";
import { getSupabaseClient } from "./photoboothProtocol";

export const useOwnerSession = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const client = getSupabaseClient();
    if (!client) { setLoading(false); return; }

    client.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);

      // Store Drive refresh token if returning from OAuth
      if (session?.provider_refresh_token) {
        storeDriveToken(client, session.access_token, session.provider_refresh_token);
      }

      setLoading(false);
    });

    const { data: { subscription } } = client.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ?? null);
      if (session?.provider_refresh_token) {
        storeDriveToken(client, session.access_token, session.provider_refresh_token);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = useCallback(() => {
    const client = getSupabaseClient();
    if (!client || typeof window === "undefined") return;
    client.auth.signInWithOAuth({
      provider: "google",
      options: {
        scopes: "email profile https://www.googleapis.com/auth/drive.file",
        queryParams: { access_type: "offline", prompt: "consent" },
        redirectTo: `${window.location.origin}/photobooth/`,
      },
    });
  }, []);

  const signOut = useCallback(async () => {
    const client = getSupabaseClient();
    if (!client) return;
    await client.auth.signOut();
  }, []);

  return { user, loading, signIn, signOut };
};

async function storeDriveToken(client, accessToken, refreshToken) {
  const supabaseUrl = process.env.GATSBY_SUPABASE_URL;
  if (!supabaseUrl || !refreshToken) return;
  try {
    await fetch(`${supabaseUrl}/functions/v1/store-drive-token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        apikey: process.env.GATSBY_SUPABASE_ANON_KEY,
      },
      body: JSON.stringify({ refresh_token: refreshToken }),
    });
  } catch (e) {
    console.warn("Could not store Drive token:", e);
  }
}
