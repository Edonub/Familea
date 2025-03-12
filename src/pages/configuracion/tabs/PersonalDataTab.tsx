import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { TabProps } from "@/components/configuration/types";
import AvatarSelector from "@/components/auth/AvatarSelector";

const PersonalDataTab = ({ userProfile, user }: TabProps) => {
  const [firstName, setFirstName] = useState(userProfile?.first_name || "");
  const [lastName, setLastName] = useState(userProfile?.last_name || "");
  const [avatarUrl, setAvatarUrl] = useState(userProfile?.avatar_url || "");
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [showAvatarSelector, setShowAvatarSelector] = useState(false);
  
  const updateProfile = async () => {
    try {
      setIsUpdatingProfile(true);
      
      const { error } = await supabase
        .from('profiles')
        .update({
          first_name: firstName,
          last_name: lastName,
          avatar_url: avatarUrl,
          updated_at: new Date().toISOString()
        })
        .eq('id', user?.id);
        
      if (error) throw error;
      
      toast.success("Perfil actualizado correctamente");
    } catch (error) {
      console.error("Error actualizando el perfil:", error);
      toast.error("Error al actualizar el perfil. Inténtalo de nuevo más tarde.");
    } finally {
      setIsUpdatingProfile(false);
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Datos personales</CardTitle>
        <CardDescription>
          Actualiza tu información personal y foto de perfil
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-col sm:flex-row gap-6">
          <div className="flex flex-col items-center gap-3">
            <Avatar className="h-24 w-24">
              <AvatarImage src={avatarUrl} />
              <AvatarFallback className="bg-familyxp-primary text-white text-xl">
                {firstName ? firstName.charAt(0).toUpperCase() : user?.email?.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setShowAvatarSelector(!showAvatarSelector)}
            >
              {showAvatarSelector ? "Cerrar selector" : "Cambiar avatar"}
            </Button>
          </div>
          
          <div className="flex-1 space-y-4">
            {showAvatarSelector && (
              <div className="mb-4">
                <AvatarSelector 
                  selectedAvatar={avatarUrl}
                  onSelect={(url) => setAvatarUrl(url)}
                />
              </div>
            )}
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">Nombre</Label>
                <Input
                  id="firstName"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="Tu nombre"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Apellidos</Label>
                <Input
                  id="lastName"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Tus apellidos"
                />
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex justify-end">
          <Button 
            onClick={updateProfile} 
            disabled={isUpdatingProfile}
          >
            {isUpdatingProfile ? "Guardando..." : "Guardar cambios"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default PersonalDataTab;