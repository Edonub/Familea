
import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

// Imported components
import BlogHeader from "@/components/blog/BlogHeader";
import FeaturedPosts from "@/components/blog/FeaturedPosts";
import BlogCategories from "@/components/blog/BlogCategories";
import NewsletterSection from "@/components/blog/NewsletterSection";

// Imported types and utilities
import { BlogPost, sampleBlogPosts } from "@/components/blog/types";
import { formatDate } from "@/components/blog/BlogUtils";

const BlogPage = () => {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [featuredPosts, setFeaturedPosts] = useState<BlogPost[]>([]);
  const [recentPosts, setRecentPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchBlogPosts();
  }, []);

  const fetchBlogPosts = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('published', true)
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      if (data && data.length > 0) {
        const formattedPosts: BlogPost[] = data.map(post => ({
          id: post.id,
          title: post.title,
          excerpt: post.excerpt,
          category: post.category,
          created_at: formatDate(post.created_at),
          author_name: post.author_name,
          author_title: post.author_title,
          image_url: post.image_url || 'https://images.unsplash.com/photo-1610025763872-76c13223c320?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8d2ludGVyJTIwY2hpbGRyZW58ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60',
          read_time: post.read_time || '5 min',
        }));

        setBlogPosts(formattedPosts);
        setFeaturedPosts(formattedPosts.slice(0, 3));
        setRecentPosts(formattedPosts);
      } else {
        console.log("No se encontraron posts en la base de datos, usando datos de muestra");
        setBlogPosts(sampleBlogPosts);
        setFeaturedPosts(sampleBlogPosts);
        setRecentPosts(sampleBlogPosts);
      }
    } catch (error) {
      console.error('Error fetching blog posts:', error);
      toast({
        title: "Error al cargar el blog",
        description: "No se pudieron cargar los artículos. Por favor, inténtalo de nuevo más tarde.",
        variant: "destructive",
      });
      setBlogPosts(sampleBlogPosts);
      setFeaturedPosts(sampleBlogPosts);
      setRecentPosts(sampleBlogPosts);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (searchTerm: string) => {
    // Future enhancement: Implement actual search functionality
    console.log("Search term:", searchTerm);
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      
      <main className="flex-1 pb-12">
        <BlogHeader onSearch={handleSearch} />
        <FeaturedPosts isLoading={isLoading} featuredPosts={featuredPosts} />
        <BlogCategories 
          isLoading={isLoading} 
          recentPosts={recentPosts} 
          blogPosts={blogPosts} 
        />
        <NewsletterSection />
      </main>
      
      <Footer />
    </div>
  );
};

export default BlogPage;
