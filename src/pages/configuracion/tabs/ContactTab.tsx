
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { TabProps } from "@/components/configuration/types";

const ContactTab = ({ userProfile, user }: TabProps) => {
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState(userProfile?.phone || "");
  const [address, setAddress] = useState(userProfile?.address || "");
  const [isUpdatingContact, setIsUpdatingContact] = useState(false);
  
  useEffect(() => {
    if (user) {
      setEmail(user.email || "");
    }
  }, [user]);
  
  const updateContact = async () => {
    try {
      setIsUpdatingContact(true);
      
      // Update email in auth
      if (email !== user?.email) {
        const { error: authError } = await supabase.auth.updateUser({
          email: email
        });
        
        if (authError) throw authError;
      }
      
      // Update phone & address in profile
      const { error } = await supabase
        .from('profiles')
        .update({
          phone,
          address,
          updated_at: new Date().toISOString()
        })
        .eq('id', user?.id);
        
      if (error) throw error;
      
      toast.success("Datos de contacto actualizados correctamente");
    } catch (error) {
      console.error("Error actualizando los datos de contacto:", error);
      toast.error("Error al actualizar los datos de contacto. Inténtalo de nuevo más tarde.");
    } finally {
      setIsUpdatingContact(false);
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Datos de contacto</CardTitle>
        <CardDescription>
          Actualiza tu email y datos de contacto
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              Si cambias tu email, recibirás un correo de verificación en la nueva dirección.
            </p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="phone">Teléfono</Label>
            <Input
              id="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Tu número de teléfono"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="address">Dirección</Label>
            <Input
              id="address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Tu dirección"
            />
          </div>
        </div>
        
        <div className="flex justify-end">
          <Button 
            onClick={updateContact} 
            disabled={isUpdatingContact}
          >
            {isUpdatingContact ? "Guardando..." : "Guardar cambios"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ContactTab;
