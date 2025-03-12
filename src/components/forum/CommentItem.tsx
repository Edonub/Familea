
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";
import { MessageSquare } from "lucide-react";
import { Comment } from "./types";
import ReactMarkdown from 'react-markdown';

interface CommentItemProps {
  comment: Comment;
  onReply: (comment: Comment) => void;
  isThread?: boolean;
  isReply?: boolean;
}

const CommentItem = ({ comment, onReply, isThread = false, isReply = false }: CommentItemProps) => {
  const getInitials = (name: string = "Usuario") => {
    return name.substring(0, 2).toUpperCase();
  };

  // Function to extract title from content if it's formatted with markdown
  const extractTitleAndContent = (content: string) => {
    // Check if content starts with bold text (markdown format)
    const titleMatch = content.match(/^\*\*(.*?)\*\*/);
    if (titleMatch) {
      const title = titleMatch[1];
      const mainContent = content.replace(/^\*\*(.*?)\*\*\n*/, '').trim();
      return { title, content: mainContent };
    }
    return { title: null, content };
  };

  const { title, content } = extractTitleAndContent(comment.content || "");
  const formattedDate = comment.created_at 
    ? formatDistanceToNow(new Date(comment.created_at), { addSuffix: true, locale: es })
    : "hace un momento";

  return (
    <Card className={`bg-white border-gray-200 shadow-sm ${isReply ? 'mb-2' : 'mb-4'}`}>
      {(isThread && title) ? (
        <CardHeader className="pb-2 bg-gray-50 border-b border-gray-100">
          <CardTitle className="text-lg font-semibold text-gray-900">
            {title}
          </CardTitle>
        </CardHeader>
      ) : null}
      
      <CardContent className={`${isReply ? 'p-3' : 'p-4'}`}>
        <div className="flex items-center gap-2 mb-2 text-sm text-gray-600">
          <Avatar className="h-8 w-8">
            <AvatarImage src={comment.profiles?.avatar_url} />
            <AvatarFallback className="bg-familyxp-primary text-white">
              {getInitials(comment.profiles?.first_name)}
            </AvatarFallback>
          </Avatar>
          <span className="font-medium text-gray-900">
            {comment.profiles?.first_name || "Usuario"} {comment.profiles?.last_name || ""}
          </span>
          <span className="text-gray-400">•</span>
          <span>{formattedDate}</span>
        </div>
        
        <div className="mt-2 text-gray-800 whitespace-pre-line">
          <ReactMarkdown>
            {title ? content : comment.content || ""}
          </ReactMarkdown>
        </div>
        
        {!isReply && (
          <div className="mt-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onReply(comment)}
              className="text-gray-600 hover:text-familyxp-primary hover:bg-gray-50"
            >
              <MessageSquare className="mr-1 h-4 w-4" />
              Responder
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CommentItem;
