
import { Link } from "react-router-dom";

interface CategoryCardProps {
  title: string;
  image: string;
  count: number;
  slug: string;
}

const CategoryCard = ({ title, image, count, slug }: CategoryCardProps) => {
  return (
    <Link to={`/explorar?categoria=${slug}`}>
      <div className="relative overflow-hidden rounded-lg group">
        <div className="aspect-square">
          <img 
            src={image} 
            alt={title} 
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-4 text-white">
          <h3 className="text-lg font-semibold">{title}</h3>
          <p className="text-sm opacity-90">{count} actividades</p>
        </div>
      </div>
    </Link>
  );
};

export default CategoryCard;
