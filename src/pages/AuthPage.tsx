
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import LoginForm from "@/components/auth/LoginForm";
import RegisterForm from "@/components/auth/RegisterForm";
import VerificationMessage from "@/components/auth/VerificationMessage";
import AuthErrorAlert from "@/components/auth/AuthErrorAlert";

const AuthPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [verificationSent, setVerificationSent] = useState(false);
  const [loginError, setLoginError] = useState("");

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  // Check if we have a hash in the URL (for password reset or email confirmation)
  useEffect(() => {
    const handleAuthRedirect = async () => {
      const hash = window.location.hash;
      if (hash && hash.includes("access_token")) {
        setLoading(true);
        try {
          const { data, error } = await supabase.auth.getSession();
          if (error) throw error;
          if (data.session) {
            toast.success("¡Autenticación exitosa!");
            navigate("/");
          }
        } catch (error: any) {
          console.error("Error de autenticación:", error);
          toast.error(error.message || "Error de autenticación");
        } finally {
          setLoading(false);
        }
      }
    };
    
    handleAuthRedirect();
  }, [navigate]);

  return (
    <div className="flex min-h-screen justify-center items-center bg-slate-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Acceso a Familea</CardTitle>
          <CardDescription className="text-center">
            Ingresa a tu cuenta o regístrate para comenzar
          </CardDescription>
        </CardHeader>
        <CardContent>
          {verificationSent ? (
            <VerificationMessage onBack={() => setVerificationSent(false)} />
          ) : (
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-4">
                <TabsTrigger value="login">Iniciar Sesión</TabsTrigger>
                <TabsTrigger value="register">Registrarse</TabsTrigger>
              </TabsList>
              
              <AuthErrorAlert error={loginError} />
              
              <TabsContent value="login">
                <LoginForm 
                  email={email}
                  setEmail={setEmail}
                  password={password}
                  setPassword={setPassword}
                  loading={loading}
                  setLoading={setLoading}
                  loginError={loginError}
                  setLoginError={setLoginError}
                />
              </TabsContent>
              <TabsContent value="register">
                <RegisterForm
                  email={email}
                  setEmail={setEmail}
                  password={password}
                  setPassword={setPassword}
                  name={name}
                  setName={setName}
                  loading={loading}
                  setLoading={setLoading}
                  setLoginError={setLoginError}
                  setVerificationSent={setVerificationSent}
                />
              </TabsContent>
            </Tabs>
          )}
        </CardContent>
        <CardFooter className="flex justify-center text-sm text-muted-foreground">
          Familea - Experiencias para familias
        </CardFooter>
      </Card>
    </div>
  );
};

export default AuthPage;
