
export interface ForumPost {
  id: string;
  title: string;
  author: string;
  date: string;
  content: string;
  category: string;
  replies: ForumReply[];
}

export interface ForumReply {
  id: string;
  author: string;
  date: string;
  content: string;
}
