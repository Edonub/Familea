
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { User } from "@/contexts/AuthContext";
import UserDropdown from "./UserDropdown";

interface DesktopNavProps {
  user: User | null;
  onSignOut: () => Promise<void>;
}

const DesktopNav = ({ user, onSignOut }: DesktopNavProps) => {
  return (
    <div className="hidden md:flex items-center space-x-4">
      <Link to="/" className="text-gray-700 hover:text-familyxp-primary font-medium">
        Experiencias
      </Link>
      <Link
        to="/foro"
        className="text-gray-700 hover:text-familyxp-primary font-medium"
      >
        Foro
      </Link>
      <Link
        to="/blog"
        className="text-gray-700 hover:text-familyxp-primary font-medium"
      >
        Blog
      </Link>
      {user ? (
        <UserDropdown user={user} onSignOut={onSignOut} />
      ) : (
        <Link to="/auth">
          <Button variant="default" size="sm">
            Iniciar sesión
          </Button>
        </Link>
      )}
    </div>
  );
};

export default DesktopNav;
