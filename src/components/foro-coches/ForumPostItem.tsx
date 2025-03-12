
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { MessageSquare } from "lucide-react";
import { ForumPost } from "./types";
import ReplyForm from "./ReplyForm";
import ForumReplyItem from "./ForumReplyItem";

interface ForumPostItemProps {
  post: ForumPost;
  replyingToPost: string | null;
  replyContent: string;
  setReplyContent: (content: string) => void;
  setReplyingToPost: (postId: string | null) => void;
  handleReply: (postId: string) => void;
  getInitials: (name: string) => string;
}

const ForumPostItem = ({ 
  post, 
  replyingToPost, 
  replyContent, 
  setReplyContent, 
  setReplyingToPost, 
  handleReply,
  getInitials
}: ForumPostItemProps) => {
  return (
    <Card key={post.id} className="bg-[#444] border-[#555] overflow-hidden">
      <CardHeader className="pb-3 bg-[#3a3a3a]">
        <CardTitle className="text-xl">
          {post.title}
        </CardTitle>
        <div className="flex items-center text-sm text-gray-300 mt-1">
          <Avatar className="h-6 w-6 mr-2">
            <AvatarFallback className="bg-[#ff4d4d] text-[10px]">
              {getInitials(post.author)}
            </AvatarFallback>
          </Avatar>
          <span>{post.author}</span>
          <span className="mx-2">•</span>
          <span>{post.date}</span>
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        <p className="whitespace-pre-line mb-4">{post.content}</p>
        
        {/* Replies */}
        {post.replies.length > 0 && (
          <div className="mt-6 space-y-4 pt-4 border-t border-[#555]">
            <h4 className="text-sm font-medium text-gray-300 mb-2">
              Respuestas ({post.replies.length})
            </h4>
            {post.replies.map((reply) => (
              <ForumReplyItem key={reply.id} reply={reply} getInitials={getInitials} />
            ))}
          </div>
        )}
        
        {/* Reply form */}
        {replyingToPost === post.id ? (
          <ReplyForm
            postId={post.id}
            replyContent={replyContent}
            setReplyContent={setReplyContent}
            onReply={handleReply}
            onCancel={() => setReplyingToPost(null)}
          />
        ) : (
          <Button 
            onClick={() => setReplyingToPost(post.id)} 
            variant="outline"
            className="mt-4 border-[#555] text-white hover:bg-[#555]"
          >
            <MessageSquare className="mr-2 h-4 w-4" /> Responder
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default ForumPostItem;
