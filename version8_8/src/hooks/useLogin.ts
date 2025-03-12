
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export function useLogin() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const login = async (email: string, password: string) => {
    setLoading(true);
    setError("");

    try {
      console.log("Attempting sign in with:", email);
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      
      toast.success("Inicio de sesión exitoso!");
      return { success: true };
    } catch (error: any) {
      console.error("Error al iniciar sesión:", error.message);
      
      if (error.message.includes("Email not confirmed")) {
        setError("Tu email no ha sido verificado. Por favor, revisa tu bandeja de entrada y confirma tu email.");
        
        // Reenviar email de verificación
        const { error: resendError } = await supabase.auth.resend({
          type: 'signup',
          email,
        });
        
        if (!resendError) {
          toast.info("Hemos reenviado el email de verificación a tu correo.");
        }
      } else {
        setError(error.message || "Error al iniciar sesión");
        toast.error(error.message || "Error al iniciar sesión");
      }
      return { success: false };
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (email: string) => {
    if (!email) {
      toast.error("Por favor, introduce tu email para restablecer la contraseña");
      return { success: false };
    }
    
    setLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth`,
      });
      
      if (error) throw error;
      toast.success("Se ha enviado un email para restablecer tu contraseña");
      return { success: true };
    } catch (error: any) {
      toast.error(error.message || "Error al enviar el email de recuperación");
      return { success: false };
    } finally {
      setLoading(false);
    }
  };

  return {
    login,
    resetPassword,
    loading,
    error,
    setError
  };
}
