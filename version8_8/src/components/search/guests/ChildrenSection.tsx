
import { Badge } from "../../ui/badge";
import AddChildForm from "./AddChildForm";
import ChildrenList from "./ChildrenList";

interface Child {
  id: number;
  age: number;
}

interface ChildrenSectionProps {
  children: number;
  childrenDetails: Child[];
  removeChild: (id: number) => void;
  addChild: (age: number) => void;
}

const ChildrenSection = ({
  children,
  childrenDetails,
  removeChild,
  addChild
}: ChildrenSectionProps) => {
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <div>
          <h3 className="font-medium">Niños</h3>
          <p className="text-sm text-gray-500">De 0 a 12 años</p>
        </div>
        <div className="flex items-center space-x-3">
          <span className="w-5 text-center">{children}</span>
        </div>
      </div>
      
      {/* Lista de niños con sus edades */}
      <ChildrenList childrenDetails={childrenDetails} removeChild={removeChild} />
      
      {/* Formulario para añadir un niño */}
      <AddChildForm addChild={addChild} />
    </div>
  );
};

export default ChildrenSection;
