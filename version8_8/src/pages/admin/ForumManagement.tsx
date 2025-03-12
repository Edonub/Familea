import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Pencil, Trash2, MessageSquare, Lock, Unlock } from "lucide-react";
import Navbar from "@/components/Navbar";

interface ForumPost {
  id: string;
  title: string;
  content: string;
  author_name: string;
  created_at: string;
  is_locked: boolean;
  is_pinned: boolean;
  category: string;
  reply_count: number;
}

const ForumManagement = () => {
  const { user, isAdmin, loading } = useAuth();
  const navigate = useNavigate();
  const [posts, setPosts] = useState<ForumPost[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [newCategory, setNewCategory] = useState("");
  const [selectedPost, setSelectedPost] = useState<ForumPost | null>(null);

  // Check authentication and admin status
  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth");
      return;
    }

    if (!loading && !isAdmin) {
      toast.error("Acceso restringido. Solo administradores.");
      navigate("/");
      return;
    }
  }, [user, isAdmin, loading, navigate]);

  // Fetch forum posts and categories
  useEffect(() => {
    const fetchData = async () => {
      if (user) {
        // Fetch posts
        const { data: postsData, error: postsError } = await supabase
          .from("forum_posts")
          .select("*")
          .order("created_at", { ascending: false });

        if (postsError) {
          toast.error("Error al cargar las publicaciones del foro");
        } else {
          setPosts(postsData || []);
        }

        // Fetch categories
        const { data: categoriesData, error: categoriesError } = await supabase
          .from("forum_categories")
          .select("name");

        if (categoriesError) {
          toast.error("Error al cargar las categorías");
        } else {
          setCategories(categoriesData?.map(cat => cat.name) || []);
        }
      }
    };

    fetchData();
  }, [user]);

  // Handle category creation
  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const { error } = await supabase
        .from("forum_categories")
        .insert([{ name: newCategory }]);

      if (error) throw error;
      
      setCategories([...categories, newCategory]);
      setNewCategory("");
      toast.success("Categoría creada exitosamente");
    } catch (error: any) {
      toast.error(error.message || "Error al crear la categoría");
    }
  };

  // Handle post actions
  const handleToggleLock = async (postId: string, currentLocked: boolean) => {
    try {
      const { error } = await supabase
        .from("forum_posts")
        .update({ is_locked: !currentLocked })
        .eq("id", postId);

      if (error) throw error;

      setPosts(posts.map(post => 
        post.id === postId 
          ? { ...post, is_locked: !currentLocked }
          : post
      ));
      
      toast.success(`Post ${currentLocked ? 'desbloqueado' : 'bloqueado'} exitosamente`);
    } catch (error: any) {
      toast.error(error.message || "Error al cambiar el estado del post");
    }
  };

  const handleTogglePin = async (postId: string, currentPinned: boolean) => {
    try {
      const { error } = await supabase
        .from("forum_posts")
        .update({ is_pinned: !currentPinned })
        .eq("id", postId);

      if (error) throw error;

      setPosts(posts.map(post => 
        post.id === postId 
          ? { ...post, is_pinned: !currentPinned }
          : post
      ));
      
      toast.success(`Post ${currentPinned ? 'desfijado' : 'fijado'} exitosamente`);
    } catch (error: any) {
      toast.error(error.message || "Error al cambiar el estado del post");
    }
  };

  const handleDeletePost = async (postId: string) => {
    if (window.confirm("¿Estás seguro de que quieres eliminar este post?")) {
      try {
        const { error } = await supabase
          .from("forum_posts")
          .delete()
          .eq("id", postId);

        if (error) throw error;

        setPosts(posts.filter(post => post.id !== postId));
        toast.success("Post eliminado exitosamente");
      } catch (error: any) {
        toast.error(error.message || "Error al eliminar el post");
      }
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Cargando...</div>;
  }

  return (
    <>
      <Navbar />
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">Gestión del Foro</h1>
        
        <div className="grid md:grid-cols-2 gap-8">
          {/* Categories Management */}
          <Card>
            <CardHeader>
              <CardTitle>Categorías del Foro</CardTitle>
              <CardDescription>
                Gestiona las categorías disponibles
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreateCategory} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="new-category">Nueva Categoría</Label>
                  <div className="flex gap-2">
                    <Input
                      id="new-category"
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value)}
                      placeholder="Nombre de la categoría"
                      required
                    />
                    <Button type="submit">Añadir</Button>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label>Categorías Existentes</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {categories.map((category) => (
                      <div
                        key={category}
                        className="bg-gray-100 px-3 py-2 rounded text-sm"
                      >
                        {category}
                      </div>
                    ))}
                  </div>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Posts Management */}
          <Card>
            <CardHeader>
              <CardTitle>Publicaciones del Foro</CardTitle>
              <CardDescription>
                Gestiona las publicaciones existentes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="max-h-[600px] overflow-y-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Título</TableHead>
                      <TableHead>Categoría</TableHead>
                      <TableHead>Autor</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead className="text-right">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {posts.length > 0 ? (
                      posts.map((post) => (
                        <TableRow key={post.id}>
                          <TableCell className="font-medium">{post.title}</TableCell>
                          <TableCell>{post.category}</TableCell>
                          <TableCell>{post.author_name}</TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              {post.is_locked && (
                                <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs">
                                  Bloqueado
                                </span>
                              )}
                              {post.is_pinned && (
                                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                                  Fijado
                                </span>
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="text-right space-x-2">
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleToggleLock(post.id, post.is_locked)}
                            >
                              {post.is_locked ? <Unlock size={16} /> : <Lock size={16} />}
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleTogglePin(post.id, post.is_pinned)}
                            >
                              <MessageSquare size={16} />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleDeletePost(post.id)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <Trash2 size={16} />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-4">
                          No hay publicaciones disponibles
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default ForumManagement; 