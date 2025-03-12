
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";

interface BlogHeaderProps {
  onSearch: (searchTerm: string) => void;
}

const BlogHeader = ({ onSearch }: BlogHeaderProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchTerm);
    toast({
      title: "Búsqueda realizada",
      description: `Has buscado: ${searchTerm}`,
    });
  };

  return (
    <section className="bg-familea-tertiary py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div>
            <Badge className="bg-white text-familea-primary mb-4">Blog Familea</Badge>
            <h1 className="text-4xl font-bold text-familea-primary mb-4">
              Ideas, consejos y experiencias para familias
            </h1>
            <p className="text-gray-700 mb-6">
              Descubre artículos sobre crianza, educación, actividades y mucho más para disfrutar al máximo de la vida en familia.
            </p>
            <form onSubmit={handleSearch} className="relative">
              <Input 
                placeholder="Buscar en el blog..." 
                className="pl-4 pr-10 py-2 rounded-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Button type="submit" className="absolute right-0 top-0 rounded-r-full h-full bg-familea-primary">
                Buscar
              </Button>
            </form>
          </div>
          <div className="hidden lg:block">
            <img 
              src="https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?auto=format&fit=crop&w=2069&q=80" 
              alt="Familia disfrutando en la playa" 
              className="rounded-lg shadow-lg max-h-80 w-full object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.onerror = null;
                target.src = "https://images.unsplash.com/photo-1540479859555-17af45c78602?auto=format&fit=crop&w=1200&q=80";
              }}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default BlogHeader;
