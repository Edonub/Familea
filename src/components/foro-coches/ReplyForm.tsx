
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

interface ReplyFormProps {
  postId: string;
  replyContent: string;
  setReplyContent: (content: string) => void;
  onReply: (postId: string) => void;
  onCancel: () => void;
}

const ReplyForm = ({ 
  postId, 
  replyContent, 
  setReplyContent, 
  onReply, 
  onCancel 
}: ReplyFormProps) => {
  const handleReply = () => {
    if (!replyContent.trim()) {
      toast.error("El contenido de la respuesta no puede estar vacío");
      return;
    }
    
    onReply(postId);
  };

  return (
    <div className="mt-4 pt-4 border-t border-[#555]">
      <label htmlFor={`reply-${postId}`} className="block text-sm font-medium mb-2">
        Tu respuesta
      </label>
      <Textarea
        id={`reply-${postId}`}
        value={replyContent}
        onChange={(e) => setReplyContent(e.target.value)}
        placeholder="Escribe tu respuesta..."
        className="min-h-[80px] bg-[#333] border-[#555] text-white mb-2"
      />
      <div className="flex space-x-2">
        <Button 
          onClick={handleReply} 
          className="bg-[#ff4d4d] hover:bg-[#e63939] text-white"
        >
          Enviar
        </Button>
        <Button 
          variant="outline" 
          onClick={onCancel}
          className="border-[#555] text-white hover:bg-[#555]"
        >
          Cancelar
        </Button>
      </div>
    </div>
  );
};

export default ReplyForm;
