
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

interface CreatePostDialogProps {
  activeCategory: ForumCategory;
  onPostCreated: () => void;
}

const CreatePostDialog = ({ activeCategory, onPostCreated }: CreatePostDialogProps) => {
  const [newPostTitle, setNewPostTitle] = useState("");
  const [newPostContent, setNewPostContent] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();

  const handleNewPost = async () => {
    if (!newPostTitle.trim() || !newPostContent.trim()) {
      toast.error("El título y contenido son obligatorios");
      return;
    }
    
    if (newPostTitle.length > 100) {
      toast.error("El título no puede superar los 100 caracteres");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const { error } = await supabase
        .from("comments")
        .insert({
          content: `**${newPostTitle.trim()}**\n\n${newPostContent.trim()}`,
          user_id: user?.id || null,
          category: activeCategory,
        });
      
      if (error) throw error;
      
      toast.success("Tema creado correctamente");
      setNewPostTitle("");
      setNewPostContent("");
      setIsOpen(false);
      onPostCreated();
    } catch (error) {
      console.error("Error creating post:", error);
      toast.error("No se pudo crear el tema. Inténtalo de nuevo.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="bg-familyxp-primary hover:bg-familyxp-primary/90 text-white">
          <Plus className="mr-2 h-4 w-4" /> Nuevo Tema
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-white text-gray-800 border-gray-200">
        <DialogHeader>
          <DialogTitle>Crear nuevo tema</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 mt-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium mb-1">
              Título (máx. 100 caracteres)
            </label>
            <Input
              id="title"
              value={newPostTitle}
              onChange={(e) => setNewPostTitle(e.target.value)}
              maxLength={100}
              placeholder="Escribe un título descriptivo"
              className="border-gray-200"
            />
            <div className="text-xs text-right mt-1 text-gray-500">
              {newPostTitle.length}/100
            </div>
          </div>
          <div>
            <label htmlFor="content" className="block text-sm font-medium mb-1">
              Contenido
            </label>
            <Textarea
              id="content"
              value={newPostContent}
              onChange={(e) => setNewPostContent(e.target.value)}
              placeholder="¿Qué quieres compartir con la comunidad?"
              className="min-h-[150px] border-gray-200"
            />
          </div>
          <Button 
            onClick={handleNewPost} 
            className="w-full bg-familyxp-primary hover:bg-familyxp-primary/90 text-white"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Creando..." : "Crear Tema"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreatePostDialog;
