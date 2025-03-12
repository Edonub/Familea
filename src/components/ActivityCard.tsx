
import { Star, Heart, MapPin, Users, Calendar } from "lucide-react";
import { Badge } from "./ui/badge";
import { Link } from "react-router-dom";

export interface ActivityProps {
  id: string;
  title: string;
  location: string;
  category: string;
  price: number;
  rating: number;
  reviewCount: number;
  image: string;
  ageRange: string;
  isPremium?: boolean;
  description?: string;
  schedule?: string;
  duration?: string;
  included?: string[];
  host?: string;
  hostDescription?: string;
}

const ActivityCard = ({
  id,
  title,
  location,
  category,
  price,
  rating,
  reviewCount,
  image,
  ageRange,
  isPremium = false,
}: ActivityProps) => {
  return (
    <div className="overflow-hidden rounded-lg border bg-white shadow-sm transition-all hover:shadow-md">
      <Link to={`/actividad/${id}`} className="block">
        <div className="relative aspect-[4/3]">
          <img 
            src={image} 
            alt={title} 
            className="h-full w-full object-cover"
          />
          <Badge 
            className="absolute left-3 top-3 bg-white text-familyxp-dark"
          >
            {category}
          </Badge>
          
          <button 
            className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/80 text-familyxp-primary hover:bg-white"
          >
            <Heart size={18} />
          </button>
          
          {isPremium && (
            <Badge 
              className="absolute bottom-3 right-3 bg-familyxp-primary text-white"
            >
              Premium
            </Badge>
          )}
        </div>
      </Link>
      
      <div className="p-4">
        <div className="mb-1 flex items-center gap-1 text-sm text-gray-500">
          <MapPin size={14} />
          <span>{location}</span>
        </div>
        
        <Link to={`/actividad/${id}`} className="block">
          <h3 className="line-clamp-2 text-base font-semibold text-gray-800 hover:text-familyxp-primary">
            {title}
          </h3>
        </Link>
        
        <div className="mt-2 flex items-center justify-between">
          <div className="flex items-center gap-1">
            <Star size={16} className="fill-yellow-400 text-yellow-400" />
            <span className="text-sm font-medium">{rating}</span>
            <span className="text-sm text-gray-500">({reviewCount})</span>
          </div>
          
          <div className="flex items-center gap-1">
            <Users size={14} className="text-gray-500" />
            <span className="text-sm text-gray-500">{ageRange}</span>
          </div>
        </div>
        
        <div className="mt-3 flex items-center justify-between">
          <div className="font-semibold">
            {price === 0 ? (
              <span className="text-familyxp-success">Gratis</span>
            ) : (
              <span>{price}€ <span className="text-sm font-normal text-gray-500">/ persona</span></span>
            )}
          </div>
          
          <Link to={`/actividad/${id}`} className="flex items-center gap-1 text-familyxp-primary">
            <Calendar size={14} />
            <span className="text-sm font-medium">Reservar</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ActivityCard;
