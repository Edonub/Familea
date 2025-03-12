
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export function useRegister() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const register = async (email: string, password: string, name: string) => {
    setLoading(true);
    setError("");

    try {
      const { error, data } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: name,
          },
          emailRedirectTo: `${window.location.origin}/auth`,
        },
      });

      if (error) throw error;
      
      toast.success("Se ha enviado un email de verificación a tu correo. Por favor, confírmalo para continuar.");
      return { success: true };
    } catch (error: any) {
      console.error("Error al registrarse:", error.message);
      setError(error.message || "Error al registrarse");
      toast.error(error.message || "Error al registrarse");
      return { success: false };
    } finally {
      setLoading(false);
    }
  };

  return {
    register,
    loading,
    error,
    setError
  };
}
