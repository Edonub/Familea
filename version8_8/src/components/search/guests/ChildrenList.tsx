
import { X } from "lucide-react";
import { Button } from "../../ui/button";
import { Badge } from "../../ui/badge";

interface Child {
  id: number;
  age: number;
}

interface ChildrenListProps {
  childrenDetails: Child[];
  removeChild: (id: number) => void;
}

const ChildrenList = ({ childrenDetails, removeChild }: ChildrenListProps) => {
  if (childrenDetails.length === 0) {
    return null;
  }

  return (
    <div className="space-y-2 mt-2">
      {childrenDetails.map((child) => (
        <div key={child.id} className="flex items-center justify-between bg-gray-50 p-2 rounded">
          <div className="flex items-center">
            <Badge variant="outline" className="mr-2">
              {child.age} {child.age === 1 ? 'año' : 'años'}
            </Badge>
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-6 w-6"
            onClick={(e) => {
              e.stopPropagation();
              removeChild(child.id);
            }}
          >
            <X size={14} />
          </Button>
        </div>
      ))}
    </div>
  );
};

export default ChildrenList;
