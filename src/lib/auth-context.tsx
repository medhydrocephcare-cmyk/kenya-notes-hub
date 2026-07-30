import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

type AuthCtx = {
  user: User | null;
  session: Session | null;
  loading: boolean;
  isAdmin: boolean;
  signOut: () => Promise<void>;
  refreshRole: () => Promise<void>;
};

const Ctx = createContext<AuthCtx>({
  user: null,
  session: null,
  loading: true,
  isAdmin: false,
  signOut: async () => {},
  refreshRole: async () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  async function loadRole(uid: string | undefined) {
    if (!uid) return setIsAdmin(false);
    try {
      const { data } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", uid)
        .eq("role", "admin")
        .maybeSingle();
      setIsAdmin(Boolean(data));
    } catch {
      setIsAdmin(false);
    }
  }

  useEffect(() => {
    let subscription: { unsubscribe: () => void } | undefined;
    try {
      const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => {
        setSession(s);
        loadRole(s?.user.id);
      });
      subscription = sub.subscription;
      supabase.auth.getSession().then(({ data }) => {
        setSession(data.session);
        loadRole(data.session?.user.id);
        setLoading(false);
      }).catch(() => {
        setSession(null);
        setIsAdmin(false);
        setLoading(false);
      });
    } catch {
      setSession(null);
      setIsAdmin(false);
      setLoading(false);
    }
    return () => subscription?.unsubscribe();
  }, []);

  return (
    <Ctx.Provider
      value={{
        user: session?.user ?? null,
        session,
        loading,
        isAdmin,
        signOut: async () => {
          await supabase.auth.signOut();
        },
        refreshRole: async () => loadRole(session?.user.id),
      }}
    >
      {children}
    </Ctx.Provider>
  );
}

export const useAuth = () => useContext(Ctx);
