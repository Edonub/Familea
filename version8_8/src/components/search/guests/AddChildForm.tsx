import { Plus } from "lucide-react";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import React, { useState } from "react";

interface AddChildFormProps {
  addChild: (age: number) => void;
}

const AddChildForm = ({ addChild }: AddChildFormProps) => {
  const [childAge, setChildAge] = useState<number>(2);

  const handleAgeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    // Remove leading zeros
    value = value.replace(/^0+/, '');
    // Convert to number, default to empty string if NaN
    const numberValue = value === '' ? 0 : parseInt(value);
    setChildAge(numberValue);
  };

  const handleAddChild = (e: React.MouseEvent) => {
    e.stopPropagation();
    addChild(childAge);
    setChildAge(2); // Reset age input for next child
  };

  return (
    <div className="flex items-center gap-2 mt-3">
      <div className="flex-1 relative">
        <Input
          type="number"
          min="0"
          max="12"
          value={childAge || ''}
          onChange={handleAgeChange}
          className="w-full pr-12"
          placeholder="Edad del niño"
        />
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-500">
          años
        </span>
      </div>
      <Button 
        variant="outline"
        onClick={handleAddChild}
        className="whitespace-nowrap"
      >
        <Plus size={16} className="mr-1" />
        Añadir niño
      </Button>
    </div>
  );
};

export default AddChildForm;
