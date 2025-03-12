import { Skeleton } from "@/components/ui/skeleton";

const LoadingState = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-center items-center mb-4">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-familyxp-primary mr-2"></div>
        <p>Cargando tu perfil...</p>
      </div>
      
      <div className="bg-white rounded-lg border p-6">
        <div className="flex items-center space-x-4 mb-6">
          <Skeleton className="h-16 w-16 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-24" />
          </div>
        </div>
        
        <div className="space-y-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-3/4" />
        </div>
      </div>
    </div>
  );
};

export default LoadingState;