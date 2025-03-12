
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Navbar from "@/components/Navbar";

const SuperAdminPage = () => {
  const { user, isAdmin, makeAdmin, loading } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  
  // Super admin password - in a real app, this would be stored securely
  const SUPER_ADMIN_PASSWORD = "familea2024admin";

  const handleMakeAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (adminPassword !== SUPER_ADMIN_PASSWORD) {
      toast.error("Contraseña de super administrador incorrecta");
      return;
    }
    
    await makeAdmin(email);
    setEmail("");
    setAdminPassword("");
  };

  // Redirect if not loading and not logged in
  if (!loading && !user) {
    navigate("/auth");
    return null;
  }

  return (
    <>
      <Navbar />
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-6">Panel Super Administrador</h1>
        
        <div className="max-w-md mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>Crear Administrador</CardTitle>
              <CardDescription>
                Otorga privilegios de administrador a una cuenta existente
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleMakeAdmin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email del usuario</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="usuario@ejemplo.com"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="admin-password">Contraseña Super Admin</Label>
                  <Input
                    id="admin-password"
                    type="password"
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    required
                  />
                </div>
                
                <Button type="submit" className="w-full">
                  Otorgar permisos de administrador
                </Button>
              </form>
            </CardContent>
            <CardFooter className="flex justify-center text-sm text-muted-foreground">
              {isAdmin ? 
                "Ya tienes permisos de administrador" : 
                "No tienes permisos de administrador"
              }
            </CardFooter>
          </Card>
        </div>
      </div>
    </>
  );
};

export default SuperAdminPage;
