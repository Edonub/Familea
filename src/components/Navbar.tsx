
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import FamilyLogo from "./FamilyLogo";
import DesktopNav from "./navbar/DesktopNav";
import MobileNav from "./navbar/MobileNav";
import MobileMenu from "./navbar/MobileMenu";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <FamilyLogo />
            </Link>
          </div>

          {/* Desktop navigation */}
          <DesktopNav user={user} onSignOut={handleSignOut} />

          {/* Mobile menu button */}
          <MobileNav 
            user={user} 
            isMenuOpen={isMenuOpen} 
            toggleMenu={toggleMenu} 
          />
        </div>

        {/* Mobile menu, show/hide based on menu state */}
        <MobileMenu 
          isOpen={isMenuOpen} 
          onClose={() => setIsMenuOpen(false)} 
          user={user} 
          onSignOut={handleSignOut} 
        />
      </div>
    </nav>
  );
};

export default Navbar;
