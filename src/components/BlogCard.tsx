
import { Calendar, User } from "lucide-react";
import { Badge } from "./ui/badge";
import { Link } from "react-router-dom";

interface BlogCardProps {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  author: string;
  authorTitle?: string;
  image: string;
  readTime: string;
}

const BlogCard = ({
  id,
  title,
  excerpt,
  category,
  date,
  author,
  authorTitle,
  image,
  readTime,
}: BlogCardProps) => {
  return (
    <div className="overflow-hidden rounded-lg border bg-white shadow-sm transition-all hover:shadow-md">
      <Link to={`/blog/${id}`} className="block">
        <div className="relative aspect-video">
          <img 
            src={image} 
            alt={title} 
            className="h-full w-full object-cover"
          />
          <Badge 
            className="absolute left-3 top-3 bg-familyxp-primary text-white"
          >
            {category}
          </Badge>
        </div>
      </Link>
      
      <div className="p-4">
        <div className="mb-2 flex items-center gap-3 text-sm text-gray-500">
          <div className="flex items-center gap-1">
            <Calendar size={14} />
            <span>{date}</span>
          </div>
          <div className="flex items-center gap-1">
            <User size={14} />
            <span>{author}</span>
          </div>
        </div>
        
        <Link to={`/blog/${id}`} className="block">
          <h3 className="line-clamp-2 text-lg font-semibold text-gray-800 hover:text-familyxp-primary">
            {title}
          </h3>
        </Link>
        
        <p className="mt-2 line-clamp-2 text-sm text-gray-600">
          {excerpt}
        </p>
        
        <div className="mt-3 flex items-center justify-between">
          {authorTitle && (
            <span className="text-xs text-gray-500 italic">Por {author}, {authorTitle}</span>
          )}
          <span className="text-xs text-gray-500">{readTime} de lectura</span>
        </div>
        
        <Link to={`/blog/${id}`} className="mt-3 inline-block text-sm font-medium text-familyxp-primary hover:text-familyxp-secondary">
          Leer más →
        </Link>
      </div>
    </div>
  );
};

export default BlogCard;
