
import { useState } from "react";
import { Link } from "react-router-dom";
import { Heart, Star } from "lucide-react";

interface PropertyCardProps {
  id: string;
  title: string;
  location: string;
  host: string;
  dates: string;
  price: number;
  rating: number;
  images: string[];
}

const PropertyCard = ({ id, title, location, host, dates, price, rating, images }: PropertyCardProps) => {
  const [currentImage, setCurrentImage] = useState(0);
  const [liked, setLiked] = useState(false);

  const nextImage = () => {
    setCurrentImage((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImage((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="group">
      <Link to={`/actividad/${id}`} className="block relative">
        <div className="relative aspect-square rounded-xl overflow-hidden">
          <img
            src={images[currentImage]}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          
          {images.length > 1 && (
            <>
              <button 
                onClick={(e) => { e.preventDefault(); prevImage(); }} 
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <span className="sr-only">Anterior</span>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                </svg>
              </button>
              <button 
                onClick={(e) => { e.preventDefault(); nextImage(); }} 
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <span className="sr-only">Siguiente</span>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                </svg>
              </button>
            </>
          )}
          
          <button 
            onClick={(e) => { e.preventDefault(); setLiked(!liked); }} 
            className="absolute top-3 right-3 z-10"
          >
            <Heart 
              size={24} 
              className={`${liked ? 'fill-red-500 text-red-500' : 'text-white stroke-[1.5px]'} drop-shadow-sm`} 
            />
          </button>
          
          <div className="absolute bottom-3 left-3 flex space-x-1">
            {images.length > 1 && images.map((_, index) => (
              <div 
                key={index} 
                className={`w-1.5 h-1.5 rounded-full ${currentImage === index ? 'bg-white' : 'bg-white/50'}`}
              />
            ))}
          </div>
        </div>
        
        <div className="mt-3">
          <div className="flex justify-between">
            <h3 className="font-medium text-gray-900">{title}, {location}</h3>
            <div className="flex items-center">
              <Star size={14} className="fill-current text-black" />
              <span className="text-sm ml-1">{rating.toFixed(1)}</span>
            </div>
          </div>
          <p className="text-gray-500 text-sm">Anfitrión: {host}</p>
          <p className="text-gray-500 text-sm">{dates}</p>
          <p className="mt-1 font-semibold">{price.toFixed(0)} € <span className="font-normal">noche</span></p>
        </div>
      </Link>
    </div>
  );
};

export default PropertyCard;
