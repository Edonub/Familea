
import { useState, useEffect } from 'react';
import { Comment } from "@/components/forum/types";
import { ForumCategory } from "@/components/forum/ForumCategories";
import { fetchForumComments } from "@/hooks/forum/api";

export const useForumData = (selectedCategory: ForumCategory) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [showSampleData, setShowSampleData] = useState(false);

  const fetchComments = async () => {
    setLoading(true);
    try {
      const result = await fetchForumComments(selectedCategory);
      setComments(result.comments);
      setShowSampleData(result.showSampleData);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [selectedCategory]);

  return {
    comments,
    loading,
    showSampleData,
    fetchComments
  };
};
