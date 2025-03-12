
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="text-center max-w-md">
        <div className="w-24 h-24 bg-familyxp-tertiary rounded-full flex items-center justify-center mx-auto mb-6">
          <span className="text-familyxp-primary text-5xl font-bold">404</span>
        </div>
        <h1 className="text-3xl font-bold mb-2 text-gray-800">¡Ups! Página no encontrada</h1>
        <p className="text-gray-600 mb-6">
          Lo sentimos, no hemos podido encontrar la página que buscas. Parece que te has aventurado fuera del mapa.
        </p>
        <Link to="/">
          <Button className="bg-familyxp-primary hover:bg-familyxp-secondary">
            Volver al inicio
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
