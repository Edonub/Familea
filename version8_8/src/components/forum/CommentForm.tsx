
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Comment } from "./types";
import { ForumCategory } from "./ForumCategories";

interface CommentFormProps {
  replyTo: Comment | null;
  setReplyTo: (comment: Comment | null) => void;
  onCommentSubmitted: () => void;
  category: ForumCategory;
}

const CommentForm = ({ replyTo, setReplyTo, onCommentSubmitted, category }: CommentFormProps) => {
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!content.trim()) {
      toast.error("El contenido no puede estar vacío");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const { error } = await supabase
        .from("comments")
        .insert({
          content: content.trim(),
          user_id: user?.id || null,
          parent_id: replyTo?.id || null,
          category
        });
      
      if (error) throw error;
      
      toast.success(replyTo ? "Respuesta enviada" : "Comentario publicado");
      setContent("");
      if (replyTo) setReplyTo(null);
      onCommentSubmitted();
    } catch (error) {
      console.error("Error submitting comment:", error);
      toast.error("Error al enviar el comentario. Inténtalo de nuevo.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-white p-4 rounded-md border border-gray-200 shadow-sm">
      <div className="flex-1">
        <Textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder={replyTo ? "Escribe tu respuesta..." : "¿Qué quieres compartir?"}
          className="min-h-[100px] resize-y border-gray-200"
        />
      </div>
      
      <div className="flex justify-end gap-2">
        {replyTo && (
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => setReplyTo(null)}
            className="border-gray-200 text-gray-500"
          >
            Cancelar
          </Button>
        )}
        <Button 
          type="submit"
          className="bg-familyxp-primary hover:bg-familyxp-primary/90 text-white"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Enviando...' : replyTo ? 'Responder' : 'Publicar'}
        </Button>
      </div>
    </form>
  );
};

export default CommentForm;
