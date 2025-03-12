
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { TabsContent } from "@/components/ui/tabs";
import { useForoCochesData } from "@/hooks/use-foro-coches-data";
import ForoCochesCategories from "@/components/foro-coches/ForoCochesCategories";
import CreatePostDialog from "@/components/foro-coches/CreatePostDialog";
import ForumPostList from "@/components/foro-coches/ForumPostList";

const ForoCochesPage = () => {
  const {
    activeCategory,
    setActiveCategory,
    replyContent,
    setReplyContent,
    replyingToPost,
    setReplyingToPost,
    filteredPosts,
    handleNewPost,
    handleReply,
    getInitials
  } = useForoCochesData();
  
  return (
    <div className="flex min-h-screen flex-col bg-[#333] text-white">
      <Navbar />
      
      <main className="flex-1 py-6">
        <div className="container mx-auto px-4">
          <div className="mb-6">
            <h1 className="text-3xl font-bold mb-2">ForoCoches</h1>
            <p className="text-gray-300">
              El foro más random de la web. Comparte, pregunta y participa.
            </p>
          </div>
          
          {/* Categories tabs */}
          <ForoCochesCategories 
            activeCategory={activeCategory} 
            setActiveCategory={setActiveCategory} 
          />
          
          {/* New Thread button */}
          <div className="mt-4 mb-6">
            <CreatePostDialog 
              activeCategory={activeCategory} 
              onPostCreated={handleNewPost} 
            />
          </div>
          
          {/* Content for each tab */}
          <TabsContent value={activeCategory} className="space-y-4">
            <ForumPostList
              filteredPosts={filteredPosts}
              replyingToPost={replyingToPost}
              replyContent={replyContent}
              setReplyContent={setReplyContent}
              setReplyingToPost={setReplyingToPost}
              handleReply={handleReply}
              getInitials={getInitials}
            />
          </TabsContent>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ForoCochesPage;
