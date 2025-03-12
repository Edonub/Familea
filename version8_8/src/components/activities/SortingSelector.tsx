
interface SortingSelectorProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

const SortingSelector = ({ value, onChange }: SortingSelectorProps) => {
  return (
    <select 
      className="p-2 rounded-md border border-gray-300 bg-white"
      value={value}
      onChange={onChange}
    >
      <option value="relevancia">Ordenar por: Recomendados</option>
      <option value="precio-asc">Precio: menor a mayor</option>
      <option value="precio-desc">Precio: mayor a menor</option>
      <option value="valoracion">Mejor valorados</option>
    </select>
  );
};

export default SortingSelector;
