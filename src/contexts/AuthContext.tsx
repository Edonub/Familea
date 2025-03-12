import { createContext, useContext, useEffect, useState } from "react";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface AuthContextType {
  session: Session | null;
  user: User | null;
  isAdmin: boolean;
  isSuperAdmin: boolean;
  loading: boolean;
  makeAdmin: (email: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  // Function to check admin status
  const checkAdminStatus = async (userId: string) => {
    if (!userId) return { isAdmin: false, isSuperAdmin: false };
    
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('is_admin, is_super_admin')
        .eq('id', userId)
        .maybeSingle();
        
      if (error) throw error;
      
      return {
        isAdmin: data?.is_admin === true,
        isSuperAdmin: data?.is_super_admin === true
      };
    } catch (error) {
      console.error("Error checking admin status:", error);
      return { isAdmin: false, isSuperAdmin: false };
    }
  };

  // Function to make a user admin
  const makeAdmin = async (email: string) => {
    try {
      // First get the user's ID
      const { data: userData, error: userError } = await supabase
        .from('profiles')
        .select('id')
        .eq('email', email)
        .single();

      if (userError) throw userError;

      // Then update their admin status
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ is_admin: true })
        .eq('id', userData.id);

      if (updateError) throw updateError;
    } catch (error) {
      console.error("Error making user admin:", error);
      throw error;
    }
  };

  // Function to sign out
  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      setSession(null);
      setUser(null);
      setIsAdmin(false);
      setIsSuperAdmin(false);
    } catch (error) {
      console.error("Error signing out:", error);
      throw error;
    }
  };

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Check admin status when user changes
  useEffect(() => {
    const checkStatus = async () => {
      if (user?.id) {
        const { isAdmin, isSuperAdmin } = await checkAdminStatus(user.id);
        setIsAdmin(isAdmin);
        setIsSuperAdmin(isSuperAdmin);
      } else {
        setIsAdmin(false);
        setIsSuperAdmin(false);
      }
      setLoading(false);
    };

    checkStatus();
  }, [user]);

  return (
    <AuthContext.Provider value={{
      session,
      user,
      isAdmin,
      isSuperAdmin,
      loading,
      makeAdmin,
      signOut
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};