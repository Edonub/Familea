
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tables } from "@/integrations/supabase/types";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Pencil, Trash2 } from "lucide-react";
import Navbar from "@/components/Navbar";

const AdminPage = () => {
  const { user, isAdmin, loading } = useAuth();
  const navigate = useNavigate();
  const [blogPosts, setBlogPosts] = useState<Tables<"blog_posts">[]>([]);
  const [activities, setActivities] = useState<Tables<"activities">[]>([]);
  const [activeTab, setActiveTab] = useState("blog");

  // Form states for blog posts
  const [blogTitle, setBlogTitle] = useState("");
  const [blogExcerpt, setBlogExcerpt] = useState("");
  const [blogContent, setBlogContent] = useState("");
  const [blogCategory, setBlogCategory] = useState("");
  const [blogImage, setBlogImage] = useState("");
  const [blogReadTime, setBlogReadTime] = useState("");
  const [blogPublished, setBlogPublished] = useState(false);
  const [editingBlogId, setEditingBlogId] = useState<string | null>(null);

  // Form states for activities
  const [activityTitle, setActivityTitle] = useState("");
  const [activityDescription, setActivityDescription] = useState("");
  const [activityLocation, setActivityLocation] = useState("");
  const [activityCategory, setActivityCategory] = useState("");
  const [activityImage, setActivityImage] = useState("");
  const [activityPrice, setActivityPrice] = useState("0");
  const [activityAgeRange, setActivityAgeRange] = useState("");
  const [activityIsPremium, setActivityIsPremium] = useState(false);
  const [editingActivityId, setEditingActivityId] = useState<string | null>(null);

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

  // Fetch blog posts and activities
  useEffect(() => {
    const fetchData = async () => {
      if (user) {
        // Fetch blog posts
        const { data: posts, error: postsError } = await supabase
          .from("blog_posts")
          .select("*")
          .order("created_at", { ascending: false });

        if (postsError) {
          toast.error("Error al cargar las publicaciones del blog");
        } else {
          setBlogPosts(posts || []);
        }

        // Fetch activities
        const { data: activities, error: activitiesError } = await supabase
          .from("activities")
          .select("*")
          .order("created_at", { ascending: false });

        if (activitiesError) {
          toast.error("Error al cargar las actividades");
        } else {
          setActivities(activities || []);
        }
      }
    };

    fetchData();
  }, [user]);

  // Handle blog post form submission
  const handleBlogSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const blogData = {
        title: blogTitle,
        excerpt: blogExcerpt,
        content: blogContent,
        category: blogCategory,
        image_url: blogImage,
        read_time: blogReadTime,
        published: blogPublished,
        author_name: user?.email?.split('@')[0] || "Admin",
      };

      if (editingBlogId) {
        // Update existing blog post
        const { error } = await supabase
          .from("blog_posts")
          .update(blogData)
          .eq("id", editingBlogId);

        if (error) throw error;
        toast.success("Publicación actualizada exitosamente");
      } else {
        // Create new blog post
        const { error } = await supabase
          .from("blog_posts")
          .insert([blogData]);

        if (error) throw error;
        toast.success("Publicación creada exitosamente");
      }

      // Reset form and refresh posts
      resetBlogForm();
      fetchBlogPosts();
    } catch (error: any) {
      toast.error(error.message || "Error al guardar la publicación");
    }
  };

  // Handle activity form submission
  const handleActivitySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const activityData = {
        title: activityTitle,
        description: activityDescription,
        location: activityLocation,
        category: activityCategory,
        image_url: activityImage,
        price: parseFloat(activityPrice),
        age_range: activityAgeRange,
        is_premium: activityIsPremium,
        creator_id: user?.id,
      };

      if (editingActivityId) {
        // Update existing activity
        const { error } = await supabase
          .from("activities")
          .update(activityData)
          .eq("id", editingActivityId);

        if (error) throw error;
        toast.success("Actividad actualizada exitosamente");
      } else {
        // Create new activity
        const { error } = await supabase
          .from("activities")
          .insert([activityData]);

        if (error) throw error;
        toast.success("Actividad creada exitosamente");
      }

      // Reset form and refresh activities
      resetActivityForm();
      fetchActivities();
    } catch (error: any) {
      toast.error(error.message || "Error al guardar la actividad");
    }
  };

  // Fetch blog posts
  const fetchBlogPosts = async () => {
    const { data, error } = await supabase
      .from("blog_posts")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      toast.error("Error al cargar las publicaciones");
    } else {
      setBlogPosts(data || []);
    }
  };

  // Fetch activities
  const fetchActivities = async () => {
    const { data, error } = await supabase
      .from("activities")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      toast.error("Error al cargar las actividades");
    } else {
      setActivities(data || []);
    }
  };

  // Edit blog post
  const editBlogPost = (post: Tables<"blog_posts">) => {
    setBlogTitle(post.title);
    setBlogExcerpt(post.excerpt);
    setBlogContent(post.content);
    setBlogCategory(post.category);
    setBlogImage(post.image_url || "");
    setBlogReadTime(post.read_time || "");
    setBlogPublished(post.published || false);
    setEditingBlogId(post.id);
    setActiveTab("blog");
    window.scrollTo(0, 0);
  };

  // Delete blog post
  const deleteBlogPost = async (id: string) => {
    if (window.confirm("¿Estás seguro de que quieres eliminar esta publicación?")) {
      try {
        const { error } = await supabase
          .from("blog_posts")
          .delete()
          .eq("id", id);

        if (error) throw error;
        toast.success("Publicación eliminada exitosamente");
        fetchBlogPosts();
      } catch (error: any) {
        toast.error(error.message || "Error al eliminar la publicación");
      }
    }
  };

  // Edit activity
  const editActivity = (activity: Tables<"activities">) => {
    setActivityTitle(activity.title);
    setActivityDescription(activity.description);
    setActivityLocation(activity.location);
    setActivityCategory(activity.category);
    setActivityImage(activity.image_url || "");
    setActivityPrice(activity.price.toString());
    setActivityAgeRange(activity.age_range);
    setActivityIsPremium(activity.is_premium || false);
    setEditingActivityId(activity.id);
    setActiveTab("activities");
    window.scrollTo(0, 0);
  };

  // Delete activity
  const deleteActivity = async (id: string) => {
    if (window.confirm("¿Estás seguro de que quieres eliminar esta actividad?")) {
      try {
        const { error } = await supabase
          .from("activities")
          .delete()
          .eq("id", id);

        if (error) throw error;
        toast.success("Actividad eliminada exitosamente");
        fetchActivities();
      } catch (error: any) {
        toast.error(error.message || "Error al eliminar la actividad");
      }
    }
  };

  // Reset blog form
  const resetBlogForm = () => {
    setBlogTitle("");
    setBlogExcerpt("");
    setBlogContent("");
    setBlogCategory("");
    setBlogImage("");
    setBlogReadTime("");
    setBlogPublished(false);
    setEditingBlogId(null);
  };

  // Reset activity form
  const resetActivityForm = () => {
    setActivityTitle("");
    setActivityDescription("");
    setActivityLocation("");
    setActivityCategory("");
    setActivityImage("");
    setActivityPrice("0");
    setActivityAgeRange("");
    setActivityIsPremium(false);
    setEditingActivityId(null);
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Cargando...</div>;
  }

  return (
    <>
      <Navbar />
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">Panel de Administración</h1>
        
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="blog">Blog</TabsTrigger>
            <TabsTrigger value="activities">Actividades</TabsTrigger>
          </TabsList>
          
          <TabsContent value="blog">
            <div className="grid md:grid-cols-2 gap-8">
              {/* Blog Post Form */}
              <Card>
                <CardHeader>
                  <CardTitle>{editingBlogId ? "Editar Publicación" : "Nueva Publicación"}</CardTitle>
                  <CardDescription>
                    {editingBlogId ? "Actualiza la información de la publicación" : "Crea una nueva publicación para el blog"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleBlogSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="blog-title">Título</Label>
                      <Input
                        id="blog-title"
                        value={blogTitle}
                        onChange={(e) => setBlogTitle(e.target.value)}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="blog-excerpt">Extracto</Label>
                      <Textarea
                        id="blog-excerpt"
                        value={blogExcerpt}
                        onChange={(e) => setBlogExcerpt(e.target.value)}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="blog-content">Contenido</Label>
                      <Textarea
                        id="blog-content"
                        className="min-h-[200px]"
                        value={blogContent}
                        onChange={(e) => setBlogContent(e.target.value)}
                        required
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="blog-category">Categoría</Label>
                        <Input
                          id="blog-category"
                          value={blogCategory}
                          onChange={(e) => setBlogCategory(e.target.value)}
                          required
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="blog-read-time">Tiempo de lectura</Label>
                        <Input
                          id="blog-read-time"
                          value={blogReadTime}
                          onChange={(e) => setBlogReadTime(e.target.value)}
                          placeholder="5 min"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="blog-image">URL de la imagen</Label>
                      <Input
                        id="blog-image"
                        value={blogImage}
                        onChange={(e) => setBlogImage(e.target.value)}
                        placeholder="https://ejemplo.com/imagen.jpg"
                      />
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="blog-published"
                        checked={blogPublished}
                        onCheckedChange={(checked) => setBlogPublished(checked as boolean)}
                      />
                      <Label htmlFor="blog-published">Publicar</Label>
                    </div>
                    
                    <div className="flex justify-between pt-2">
                      <Button type="button" variant="outline" onClick={resetBlogForm}>
                        Cancelar
                      </Button>
                      <Button type="submit">
                        {editingBlogId ? "Actualizar Publicación" : "Crear Publicación"}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
              
              {/* Blog Posts List */}
              <div>
                <Card>
                  <CardHeader>
                    <CardTitle>Publicaciones del Blog</CardTitle>
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
                            <TableHead>Publicada</TableHead>
                            <TableHead className="text-right">Acciones</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {blogPosts.length > 0 ? (
                            blogPosts.map((post) => (
                              <TableRow key={post.id}>
                                <TableCell className="font-medium">{post.title}</TableCell>
                                <TableCell>{post.category}</TableCell>
                                <TableCell>
                                  {post.published ? (
                                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">Sí</span>
                                  ) : (
                                    <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs">No</span>
                                  )}
                                </TableCell>
                                <TableCell className="text-right space-x-2">
                                  <Button 
                                    variant="ghost" 
                                    size="sm"
                                    onClick={() => editBlogPost(post)}
                                  >
                                    <Pencil size={16} />
                                  </Button>
                                  <Button 
                                    variant="ghost" 
                                    size="sm"
                                    onClick={() => deleteBlogPost(post.id)}
                                    className="text-red-500 hover:text-red-700"
                                  >
                                    <Trash2 size={16} />
                                  </Button>
                                </TableCell>
                              </TableRow>
                            ))
                          ) : (
                            <TableRow>
                              <TableCell colSpan={4} className="text-center py-4">
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
          </TabsContent>
          
          <TabsContent value="activities">
            <div className="grid md:grid-cols-2 gap-8">
              {/* Activity Form */}
              <Card>
                <CardHeader>
                  <CardTitle>{editingActivityId ? "Editar Actividad" : "Nueva Actividad"}</CardTitle>
                  <CardDescription>
                    {editingActivityId ? "Actualiza la información de la actividad" : "Crea una nueva actividad para las familias"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleActivitySubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="activity-title">Título</Label>
                      <Input
                        id="activity-title"
                        value={activityTitle}
                        onChange={(e) => setActivityTitle(e.target.value)}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="activity-description">Descripción</Label>
                      <Textarea
                        id="activity-description"
                        value={activityDescription}
                        onChange={(e) => setActivityDescription(e.target.value)}
                        required
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="activity-location">Ubicación</Label>
                        <Input
                          id="activity-location"
                          value={activityLocation}
                          onChange={(e) => setActivityLocation(e.target.value)}
                          required
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="activity-category">Categoría</Label>
                        <Input
                          id="activity-category"
                          value={activityCategory}
                          onChange={(e) => setActivityCategory(e.target.value)}
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="activity-price">Precio (€)</Label>
                        <Input
                          id="activity-price"
                          type="number"
                          min="0"
                          step="0.01"
                          value={activityPrice}
                          onChange={(e) => setActivityPrice(e.target.value)}
                          required
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="activity-age-range">Rango de edad</Label>
                        <Input
                          id="activity-age-range"
                          value={activityAgeRange}
                          onChange={(e) => setActivityAgeRange(e.target.value)}
                          placeholder="3-12 años"
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="activity-image">URL de la imagen</Label>
                      <Input
                        id="activity-image"
                        value={activityImage}
                        onChange={(e) => setActivityImage(e.target.value)}
                        placeholder="https://ejemplo.com/imagen.jpg"
                      />
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="activity-premium"
                        checked={activityIsPremium}
                        onCheckedChange={(checked) => setActivityIsPremium(checked as boolean)}
                      />
                      <Label htmlFor="activity-premium">Actividad Premium</Label>
                    </div>
                    
                    <div className="flex justify-between pt-2">
                      <Button type="button" variant="outline" onClick={resetActivityForm}>
                        Cancelar
                      </Button>
                      <Button type="submit">
                        {editingActivityId ? "Actualizar Actividad" : "Crear Actividad"}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
              
              {/* Activities List */}
              <div>
                <Card>
                  <CardHeader>
                    <CardTitle>Actividades</CardTitle>
                    <CardDescription>
                      Gestiona las actividades existentes
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="max-h-[600px] overflow-y-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Título</TableHead>
                            <TableHead>Ubicación</TableHead>
                            <TableHead>Precio</TableHead>
                            <TableHead className="text-right">Acciones</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {activities.length > 0 ? (
                            activities.map((activity) => (
                              <TableRow key={activity.id}>
                                <TableCell className="font-medium">{activity.title}</TableCell>
                                <TableCell>{activity.location}</TableCell>
                                <TableCell>{activity.price}€</TableCell>
                                <TableCell className="text-right space-x-2">
                                  <Button 
                                    variant="ghost" 
                                    size="sm"
                                    onClick={() => editActivity(activity)}
                                  >
                                    <Pencil size={16} />
                                  </Button>
                                  <Button 
                                    variant="ghost" 
                                    size="sm"
                                    onClick={() => deleteActivity(activity.id)}
                                    className="text-red-500 hover:text-red-700"
                                  >
                                    <Trash2 size={16} />
                                  </Button>
                                </TableCell>
                              </TableRow>
                            ))
                          ) : (
                            <TableRow>
                              <TableCell colSpan={4} className="text-center py-4">
                                No hay actividades disponibles
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
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
};

export default AdminPage;
