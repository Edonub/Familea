
import { useEffect, useState } from "react";

type LogoProps = {
  variant?: "default" | "white";
  showText?: boolean;
  size?: "sm" | "md" | "lg";
};

const FamilyLogo = ({ variant = "default", showText = true, size = "md" }: LogoProps) => {
  const textColor = variant === "white" ? "text-white" : "text-familyxp-primary";
  
  const logoSizes = {
    sm: {
      container: "h-6",
      logoHeight: "h-6",
      text: "text-sm",
      spacing: "ml-1",
    },
    md: {
      container: "h-8",
      logoHeight: "h-8",
      text: "text-xl",
      spacing: "ml-2",
    },
    lg: {
      container: "h-10",
      logoHeight: "h-10",
      text: "text-2xl",
      spacing: "ml-3",
    },
  };

  return (
    <div className="flex items-center">
      <div className={`flex items-center justify-center ${logoSizes[size].container} bg-white rounded-md p-1`}>
        <img 
          src="/lovable-uploads/fd36a416-2d6f-40f2-9c3b-5b483c9410a2.png" 
          alt="Familea Logo" 
          className={`${logoSizes[size].logoHeight} w-auto`}
        />
      </div>
      {showText && (
        <span className={`${logoSizes[size].spacing} ${logoSizes[size].text} font-bold ${textColor}`}>
          Familea
        </span>
      )}
    </div>
  );
};

export default FamilyLogo;
