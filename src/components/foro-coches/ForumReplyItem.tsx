
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ForumReply } from "./types";

interface ForumReplyItemProps {
  reply: ForumReply;
  getInitials: (name: string) => string;
}

const ForumReplyItem = ({ reply, getInitials }: ForumReplyItemProps) => {
  return (
    <div className="bg-[#3a3a3a] p-3 rounded-md">
      <div className="flex items-center text-sm text-gray-300 mb-2">
        <Avatar className="h-6 w-6 mr-2">
          <AvatarFallback className="bg-[#666] text-[10px]">
            {getInitials(reply.author)}
          </AvatarFallback>
        </Avatar>
        <span>{reply.author}</span>
        <span className="mx-2">•</span>
        <span>{reply.date}</span>
      </div>
      <p className="text-sm whitespace-pre-line">{reply.content}</p>
    </div>
  );
};

export default ForumReplyItem;
