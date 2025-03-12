
interface Child {
  id: number;
  age: number;
}

interface ChildrenSummaryProps {
  childrenDetails: Child[];
}

const ChildrenSummary = ({ childrenDetails }: ChildrenSummaryProps) => {
  if (childrenDetails.length === 0) {
    return null;
  }

  const getChildrenSummary = () => {
    // Group children by age
    const ageGroups: Record<number, number> = {};
    childrenDetails.forEach(child => {
      ageGroups[child.age] = (ageGroups[child.age] || 0) + 1;
    });
    
    // Create summary text
    const groups = Object.entries(ageGroups).map(([age, count]) => 
      `${count} de ${age} ${count === 1 ? 'año' : 'años'}`
    );
    
    return groups.join(', ');
  };

  return (
    <div className="bg-gray-50 p-2 rounded text-sm">
      <p><strong>Resumen:</strong> {getChildrenSummary()}</p>
    </div>
  );
};

export default ChildrenSummary;
