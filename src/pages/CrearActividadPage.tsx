import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import Navbar from "@/components/Navbar";
import { useExperienceData } from "@/hooks/useExperienceData";
import ExperienceFormWrapper from "@/components/experiences/ExperienceFormWrapper";
import { toast } from "sonner";

const CrearActividadPage = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = !!id;
  
  // Use custom hook to fetch experience data
  const { data, loading: dataLoading, error } = useExperienceData(id, user?.id);
  
  useEffect(() => {
    // Only redirect if auth is finished loading and there's no user
    if (!authLoading && !user) {
      toast.error("Debes iniciar sesión para crear o editar experiencias");
      navigate("/auth");
    }
  }, [user, authLoading, navigate]);

  // Show error state if there's an error fetching data
  if (error) {
    return (
      <>
        <Navbar />
        <div className="container mx-auto p-6 max-w-3xl">
          <div className="text-center py-8">
            <h2 className="text-2xl font-bold text-red-600 mb-4">Error al cargar la experiencia</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Intentar de nuevo
            </button>
          </div>
        </div>
      </>
    );
  }

  // Show loading state while auth or data is loading
  if (authLoading || dataLoading) {
    return (
      <>
        <Navbar />
        <div className="container mx-auto p-6 max-w-3xl">
          <div className="flex justify-center items-center py-16">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-familyxp-primary mx-auto"></div>
              <p className="mt-4 text-gray-600">
                {authLoading ? "Verificando sesión..." : "Cargando experiencia..."}
              </p>
            </div>
          </div>
        </div>
      </>
    );
  }

  // If auth is done loading and there's no user, return null (redirect will happen)
  if (!user) {
    return null;
  }
  
  return (
    <>
      <Navbar />
      <div className="container mx-auto p-6 max-w-3xl">
        <ExperienceFormWrapper 
          isEditMode={isEditMode}
          initialData={data}
          experienceId={id}
          userId={user.id}
        />
      </div>
    </>
  );
};

export default CrearActividadPage;