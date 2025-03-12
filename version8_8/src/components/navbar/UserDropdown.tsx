import React from "react";
import { useNavigate } from "react-router-dom";
import { LogOut, Plus, Settings } from "lucide-react";
import { User as AuthUser } from "@/contexts/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface UserDropdownProps {
  user: AuthUser;
  onSignOut: () => Promise<void>;
}

const UserDropdown = ({ user, onSignOut }: UserDropdownProps) => {
  const navigate = useNavigate();
  
  const handleSignOut = async () => {
    try {
      await onSignOut();
      navigate("/");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="rounded-full p-0 h-10 w-10">
          <Avatar className="h-9 w-9">
            <AvatarImage src={user.user_metadata?.avatar_url} />
            <AvatarFallback className="bg-familyxp-primary text-white">
              {user.email ? user.email.charAt(0).toUpperCase() : "U"}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuItem asChild>
          <Button 
            variant="ghost" 
            className="w-full justify-start" 
            onClick={() => navigate("/perfil")}
          >
            <Settings className="mr-2 h-4 w-4" />
            <span>Mi Perfil</span>
          </Button>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Button 
            variant="ghost" 
            className="w-full justify-start" 
            onClick={() => navigate("/crear-actividad")}
          >
            <Plus className="mr-2 h-4 w-4" />
            <span>Crear Experiencia</span>
          </Button>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer text-red-500 hover:text-red-700 hover:bg-red-50">
          <LogOut className="mr-2 h-4 w-4" />
          <span>Cerrar sesión</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserDropdown;