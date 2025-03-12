
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { ForumCategory } from "./ForumCategories";

interface CreateForumPostDialogProps {
  activeCategory: ForumCategory;
  onPostCreated: () => void;
}

const CreateForumPostDialog = ({ activeCategory, onPostCreated }: CreateForumPostDialogProps) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();

  const handleNewPost = async () => {
    if (!title.trim() || !content.trim()) {
      toast.error("El título y contenido son obligatorios");
      return;
    }
    
    if (title.length > 100) {
      toast.error("El título no puede superar los 100 caracteres");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const { error } = await supabase
        .from("comments")
        .insert({
          content: `**${title.trim()}**\n\n${content.trim()}`,
          user_id: user?.id || null,
          parent_id: null,
          category: activeCategory
        });
      
      if (error) throw error;
      
      toast.success("Tema publicado con éxito");
      setTitle("");
      setContent("");
      setIsOpen(false);
      onPostCreated();
    } catch (error) {
      console.error("Error creando tema:", error);
      toast.error("Error al crear el tema. Inténtalo de nuevo.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          className="bg-familyxp-primary hover:bg-familyxp-primary/90 text-white"
        >
          <Plus className="mr-2 h-4 w-4" /> Nuevo Tema
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-white border-gray-200 sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Crear nuevo tema</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 mt-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium mb-1 text-gray-700">
              Título (máx. 100 caracteres)
            </label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={100}
              placeholder="Escribe un título descriptivo"
              className="border-gray-300"
            />
            <div className="text-xs text-right mt-1 text-gray-500">
              {title.length}/100
            </div>
          </div>
          <div>
            <label htmlFor="content" className="block text-sm font-medium mb-1 text-gray-700">
              Contenido
            </label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="¿Qué quieres compartir?"
              className="min-h-[150px] resize-y border-gray-300"
            />
          </div>
          <div className="flex justify-end pt-2">
            <Button 
              onClick={() => setIsOpen(false)} 
              variant="outline" 
              className="mr-2 border-gray-300"
            >
              Cancelar
            </Button>
            <Button 
              onClick={handleNewPost} 
              className="bg-familyxp-primary hover:bg-familyxp-primary/90 text-white"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Publicando...' : 'Publicar Tema'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreateForumPostDialog;
