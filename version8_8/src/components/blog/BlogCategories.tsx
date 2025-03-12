
import { Loader2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import BlogCard from "@/components/BlogCard";
import { Button } from "@/components/ui/button";
import { BlogPost, blogCategories } from "./types";

interface BlogCategoriesProps {
  isLoading: boolean;
  recentPosts: BlogPost[];
  blogPosts: BlogPost[];
}

const BlogCategories = ({ isLoading, recentPosts, blogPosts }: BlogCategoriesProps) => {
  return (
    <section className="py-8">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Explora nuestro contenido</h2>
        
        <Tabs defaultValue="todos">
          <TabsList className="mb-6 flex flex-wrap">
            {blogCategories.map((category) => (
              <TabsTrigger key={category} value={category.toLowerCase()}>
                {category}
              </TabsTrigger>
            ))}
          </TabsList>
          
          <TabsContent value="todos" className="mt-2">
            {isLoading ? (
              <div className="flex justify-center items-center h-40">
                <Loader2 className="h-8 w-8 animate-spin text-familyxp-primary" />
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {recentPosts.map((post) => (
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
            
            <div className="text-center mt-8">
              <Button className="bg-familyxp-primary">Cargar más artículos</Button>
            </div>
          </TabsContent>
          
          {blogCategories.slice(1).map((category) => (
            <TabsContent key={category} value={category.toLowerCase()} className="mt-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {blogPosts
                  .filter(post => post.category === category)
                  .map((post) => (
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
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </section>
  );
};

export default BlogCategories;
