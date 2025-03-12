import React from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import ExperienceForm from "./ExperienceForm";

interface ExperienceFormWrapperProps {
  isEditMode: boolean;
  initialData: {
    title: string;
    description: string;
    location: string;
    category: string;
    price: string;
    imageUrl: string;
    ageRange: string;
    isPremium: boolean;
  };
  experienceId?: string;
  userId: string;
}

const ExperienceFormWrapper: React.FC<ExperienceFormWrapperProps> = ({
  isEditMode,
  initialData,
  experienceId,
  userId
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">
          {isEditMode ? "Editar Experiencia" : "Crear Nueva Experiencia"}
        </CardTitle>
        <CardDescription>
          {isEditMode 
            ? "Actualiza los detalles de tu experiencia" 
            : "Comparte actividades y experiencias interesantes para familias"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ExperienceForm 
          isEditMode={isEditMode}
          initialData={initialData}
          experienceId={experienceId}
          userId={userId}
        />
      </CardContent>
      <CardFooter className="flex justify-center text-sm text-muted-foreground">
        Gracias por contribuir a la comunidad de Familea
      </CardFooter>
    </Card>
  );
};

export default ExperienceFormWrapper;