
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Plus } from "lucide-react";
import { toast } from "sonner";

interface CreatePostDialogProps {
  activeCategory: string;
  onPostCreated: (title: string, content: string) => void;
}

const CreatePostDialog = ({ activeCategory, onPostCreated }: CreatePostDialogProps) => {
  const [newPostTitle, setNewPostTitle] = useState("");
  const [newPostContent, setNewPostContent] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const handleNewPost = () => {
    if (!newPostTitle.trim() || !newPostContent.trim()) {
      toast.error("El título y contenido son obligatorios");
      return;
    }
    
    if (newPostTitle.length > 50) {
      toast.error("El título no puede superar los 50 caracteres");
      return;
    }
    
    onPostCreated(newPostTitle.trim(), newPostContent.trim());
    setNewPostTitle("");
    setNewPostContent("");
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="bg-[#ff4d4d] hover:bg-[#e63939] text-white">
          <Plus className="mr-2 h-4 w-4" /> Nuevo Hilo
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-[#444] text-white border-[#555]">
        <DialogHeader>
          <DialogTitle>Crear nuevo hilo</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 mt-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium mb-1">
              Título (máx. 50 caracteres)
            </label>
            <Input
              id="title"
              value={newPostTitle}
              onChange={(e) => setNewPostTitle(e.target.value)}
              maxLength={50}
              placeholder="Escribe un título llamativo"
              className="bg-[#333] border-[#555] text-white"
            />
            <div className="text-xs text-right mt-1">
              {newPostTitle.length}/50
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
              placeholder="¿Qué quieres compartir?"
              className="min-h-[100px] bg-[#333] border-[#555] text-white"
            />
          </div>
          <Button 
            onClick={handleNewPost} 
            className="w-full bg-[#ff4d4d] hover:bg-[#e63939] text-white"
          >
            Crear Hilo
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreatePostDialog;
