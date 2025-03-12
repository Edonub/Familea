
import { Loader2 } from "lucide-react";
import BlogCard from "@/components/BlogCard";
import { BlogPost } from "./types";

interface FeaturedPostsProps {
  isLoading: boolean;
  featuredPosts: BlogPost[];
}

const FeaturedPosts = ({ isLoading, featuredPosts }: FeaturedPostsProps) => {
  return (
    <section className="py-10">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Artículos destacados</h2>
        
        {isLoading ? (
          <div className="flex justify-center items-center h-40">
            <Loader2 className="h-8 w-8 animate-spin text-familyxp-primary" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredPosts.map((post) => (
              <BlogCard 
                key={post.id}
                id={post.id}
                title={post.title}
                excerpt={post.excerpt}
                category={post.category}
                date={post.created_at}
                author={post.author_name}
                authorTitle={post.author_title}
                image={post.image_url}
                readTime={post.read_time}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedPosts;
