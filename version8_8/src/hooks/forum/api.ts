
import { supabase } from "@/integrations/supabase/client";
import { Comment } from "@/components/forum/types";
import { ForumCategory } from "@/components/forum/ForumCategories";
import { toast } from "sonner";
import { sampleComments } from "@/components/forum/sampleData";

export const fetchForumComments = async (selectedCategory: ForumCategory): Promise<{
  comments: Comment[];
  showSampleData: boolean;
}> => {
  try {
    // Try to fetch real comments from the database
    const { data, error } = await supabase
      .from("comments")
      .select(`
        id, 
        content, 
        created_at, 
        user_id, 
        parent_id,
        category,
        profiles:user_id(first_name, last_name, avatar_url)
      `)
      .is("parent_id", null)
      .is("activity_id", null)
      .is("post_id", null)
      .eq("category", selectedCategory)
      .order("created_at", { ascending: false });

    if (error) {
      // If there's an error (possibly the category column doesn't exist yet)
      console.error("Error fetching comments:", error);
      const filteredComments = sampleComments.filter(comment => 
        comment.category === selectedCategory
      );
      return {
        comments: filteredComments,
        showSampleData: true
      };
    }

    if (data && data.length > 0) {
      // Process real comments if there are any
      const commentsWithReplies = await Promise.all(
        data.map(async (comment) => {
          // Ensure the category is cast to ForumCategory if possible
          const validCategory = comment.category as ForumCategory;
          
          const { data: replies, error: repliesError } = await supabase
            .from("comments")
            .select(`
              id, 
              content, 
              created_at, 
              user_id, 
              parent_id,
              category,
              profiles:user_id(first_name, last_name, avatar_url)
            `)
            .eq("parent_id", comment.id)
            .order("created_at", { ascending: true });

          if (repliesError) {
            console.error("Error fetching replies:", repliesError);
            return {
              ...comment,
              category: validCategory,
              replies: []
            };
          }

          // Add the parent's category to each reply if missing
          const formattedReplies = replies?.map(reply => ({
            ...reply,
            category: reply.category || validCategory // Use reply's category if it exists, otherwise use parent's
          })) || [];

          return {
            ...comment,
            category: validCategory,
            replies: formattedReplies as Comment[]
          };
        })
      );

      return {
        comments: commentsWithReplies as Comment[],
        showSampleData: false
      };
    } else {
      // No real comments, use sample data
      const filteredComments = sampleComments.filter(comment => 
        comment.category === selectedCategory
      );
      return {
        comments: filteredComments,
        showSampleData: true
      };
    }
  } catch (error) {
    console.error("Error in fetch operation:", error);
    toast.error("Error al cargar los comentarios del foro");
    
    // Fallback to sample data
    const filteredComments = sampleComments.filter(comment => 
      comment.category === selectedCategory
    );
    return {
      comments: filteredComments,
      showSampleData: true
    };
  }
};
