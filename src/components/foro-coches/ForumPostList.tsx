
import { Card, CardContent } from "@/components/ui/card";
import { ForumPost } from "./types";
import ForumPostItem from "./ForumPostItem";

interface ForumPostListProps {
  filteredPosts: ForumPost[];
  replyingToPost: string | null;
  replyContent: string;
  setReplyContent: (content: string) => void;
  setReplyingToPost: (postId: string | null) => void;
  handleReply: (postId: string) => void;
  getInitials: (name: string) => string;
}

const ForumPostList = ({
  filteredPosts,
  replyingToPost,
  replyContent,
  setReplyContent,
  setReplyingToPost,
  handleReply,
  getInitials
}: ForumPostListProps) => {
  if (filteredPosts.length === 0) {
    return (
      <Card className="bg-[#444] border-[#555]">
        <CardContent className="pt-6 pb-6 text-center">
          <p>No hay hilos en esta categoría. ¡Sé el primero en crear uno!</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {filteredPosts.map((post) => (
        <ForumPostItem
          key={post.id}
          post={post}
          replyingToPost={replyingToPost}
          replyContent={replyContent}
          setReplyContent={setReplyContent}
          setReplyingToPost={setReplyingToPost}
          handleReply={handleReply}
          getInitials={getInitials}
        />
      ))}
    </div>
  );
};

export default ForumPostList;
