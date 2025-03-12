
import ActivityCard from "@/components/ActivityCard";
import { ActivityProps } from "@/components/ActivityCard";

interface ActivityListProps {
  activities: ActivityProps[];
  loading: boolean;
}

const ActivityList = ({ activities, loading }: ActivityListProps) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-gray-100 rounded-lg h-64 animate-pulse"></div>
        ))}
      </div>
    );
  }

  if (activities.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-xl font-medium mb-2">No se encontraron actividades</h3>
        <p className="text-gray-500">Intenta modificar los filtros de búsqueda</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {activities.map((activity) => (
        <ActivityCard key={activity.id} {...activity} />
      ))}
    </div>
  );
};

export default ActivityList;
