
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

interface VerificationMessageProps {
  onBack: () => void;
}

const VerificationMessage = ({ onBack }: VerificationMessageProps) => {
  return (
    <div className="space-y-4 text-center">
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Hemos enviado un enlace de verificación a tu email. 
          Por favor, revisa tu bandeja de entrada (y la carpeta de spam) para verificar tu cuenta.
        </AlertDescription>
      </Alert>
      <p className="text-sm text-gray-500 mt-4">
        Una vez verificado tu email, podrás iniciar sesión.
      </p>
      <Button 
        variant="outline" 
        className="mt-4" 
        onClick={onBack}
      >
        Volver al inicio de sesión
      </Button>
    </div>
  );
};

export default VerificationMessage;
