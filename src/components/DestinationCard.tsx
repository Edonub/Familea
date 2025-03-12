
import { Link } from "react-router-dom";

interface DestinationCardProps {
  name: string;
  image: string;
  count: number;
  slug: string;
}

const DestinationCard = ({ name, image, count, slug }: DestinationCardProps) => {
  return (
    <Link to={`/explorar?ubicacion=${slug}`}>
      <div className="relative overflow-hidden rounded-lg group">
        <div className="aspect-video">
          <img 
            src={image} 
            alt={name} 
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-4 text-white">
          <h3 className="text-lg font-semibold">{name}</h3>
          <p className="text-sm opacity-90">{count} actividades</p>
        </div>
      </div>
    </Link>
  );
};

export default DestinationCard;
