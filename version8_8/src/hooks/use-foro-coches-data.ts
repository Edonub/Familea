
import { useState, useEffect } from "react";
import { ForumPost } from "@/components/foro-coches/types";
import { toast } from "sonner";

// Sample data generator for initial forum content
const generateSampleData = (): ForumPost[] => {
  const authors = [
    "User123", "ForeroX", "AmigoViajero", "PlazaForero", 
    "Aventurero99", "MrForo", "PaseanteDeMadrid", "ViajeroLoco", 
    "FamiliaFeliz", "PadreModerno", "MamaViajera"
  ];
  
  const getRandomAuthor = () => authors[Math.floor(Math.random() * authors.length)];
  const getRandomDate = () => "08/03/2025";
  
  return [
    // General category
    {
      id: "1",
      title: "Bienvenidos al nuevo foro",
      author: "Admin",
      date: getRandomDate(),
      content: "Hola a todos los foreros. Este es el nuevo foro de nuestra web. Esperamos que os guste y participéis activamente. A darle caña!",
      category: "General",
      replies: [
        {
          id: "1-1",
          author: getRandomAuthor(),
          date: getRandomDate(),
          content: "Por fin un foro decente! Ya era hora, a ver si esto se anima."
        },
        {
          id: "1-2",
          author: getRandomAuthor(),
          date: getRandomDate(),
          content: "Yo llevo años esperando algo así. Saludos desde Valencia!"
        }
      ]
    },
    {
      id: "2",
      title: "Reglas del sitio",
      author: "Admin",
      date: getRandomDate(),
      content: "Prohibido insultar, prohibido spam, prohibido contenido ilegal. Todo lo demás está permitido. A disfrutar del foro!",
      category: "General",
      replies: [
        {
          id: "2-1",
          author: getRandomAuthor(),
          date: getRandomDate(),
          content: "Menos mal que hay reglas, en otros foros es una jungla."
        }
      ]
    },
    {
      id: "3",
      title: "Charla libre",
      author: getRandomAuthor(),
      date: getRandomDate(),
      content: "Abro hilo para hablar de lo que sea. ¿Qué tal el día? ¿Algún plan para el finde? Venga, animaos!",
      category: "General",
      replies: [
        {
          id: "3-1",
          author: getRandomAuthor(),
          date: getRandomDate(),
          content: "Yo me voy a la playa este finde, a ver si no llueve como siempre."
        }
      ]
    },
    
    // Viajes category
    {
      id: "4",
      title: "Mejor destino 2025",
      author: getRandomAuthor(),
      date: getRandomDate(),
      content: "Venga, que alguien me diga un sitio guapo para irme de viaje, que estoy harto de mi pueblo. A ver si hay suerte.",
      category: "Viajes",
      replies: [
        {
          id: "4-1",
          author: getRandomAuthor(),
          date: getRandomDate(),
          content: "Prueba Sevilla, tio. Es la ostia y se come mejor que en ningún lado."
        },
        {
          id: "4-2",
          author: getRandomAuthor(),
          date: getRandomDate(),
          content: "Nah, mejor quédate en casa, jaja. Todo está carísimo ahora mismo."
        }
      ]
    },
    {
      id: "5",
      title: "Trucos para viajar barato",
      author: getRandomAuthor(),
      date: getRandomDate(),
      content: "¿Alguien tiene trucos para viajar sin dejarse el sueldo? Estoy mirando destinos y me da algo ver los precios.",
      category: "Viajes",
      replies: [
        {
          id: "5-1",
          author: getRandomAuthor(),
          date: getRandomDate(),
          content: "Yo siempre uso Skyscanner y busco vuelos en modo incógnito. Funciona de lujo."
        }
      ]
    },
    {
      id: "6",
      title: "Sevilla es la ostia",
      author: getRandomAuthor(),
      date: getRandomDate(),
      content: "Acabo de volver de Sevilla y os lo digo: es la ostia. Esas calles, la comida, el ambiente... Volvería mañana mismo.",
      category: "Viajes",
      replies: [
        {
          id: "6-1",
          author: getRandomAuthor(),
          date: getRandomDate(),
          content: "Yo fui el año pasado y no me gustó tanto. Hacía un calor que te mueres."
        },
        {
          id: "6-2",
          author: getRandomAuthor(),
          date: getRandomDate(),
          content: "Es que no hay que ir en agosto, jaja. En primavera es perfecta."
        }
      ]
    },
    {
      id: "7",
      title: "Rutas épicas",
      author: getRandomAuthor(),
      date: getRandomDate(),
      content: "Estoy planeando hacer una ruta por el norte. ¿Alguna recomendación de sitios que no me pueda perder? Graciñas.",
      category: "Viajes",
      replies: [
        {
          id: "7-1",
          author: getRandomAuthor(),
          date: getRandomDate(),
          content: "La costa de Asturias es BRUTAL. No te la pierdas por nada del mundo."
        }
      ]
    },
    
    // Alojamientos category
    {
      id: "8",
      title: "Cabañas baratas",
      author: getRandomAuthor(),
      date: getRandomDate(),
      content: "Busco cabañas en el monte que no cuesten un riñón. Para ir con la parienta un finde. ¿Alguna recomendación?",
      category: "Alojamientos",
      replies: [
        {
          id: "8-1",
          author: getRandomAuthor(),
          date: getRandomDate(),
          content: "Mira en Airbnb en la zona de Gredos. Hay chollos si reservas con tiempo."
        }
      ]
    },
    {
      id: "9",
      title: "Mansiones de lujo",
      author: getRandomAuthor(),
      date: getRandomDate(),
      content: "Si ganamos la primitiva, ¿qué mansión alquilaríais para una fiesta? Yo me pido una con piscina infinity y helipuerto.",
      category: "Alojamientos",
      replies: [
        {
          id: "9-1",
          author: getRandomAuthor(),
          date: getRandomDate(),
          content: "Yo me iría a una de esas de Ibiza con DJ privado y mayordomos. YOLO."
        },
        {
          id: "9-2",
          author: getRandomAuthor(),
          date: getRandomDate(),
          content: "Sí, claro, y luego a despertar de la siesta... 😂"
        }
      ]
    },
    {
      id: "10",
      title: "Casas Domo, alguien las probó?",
      author: getRandomAuthor(),
      date: getRandomDate(),
      content: "He visto esas casas con forma de iglú que parecen del futuro. ¿Alguien se ha alojado en una? ¿Merecen la pena?",
      category: "Alojamientos",
      replies: [
        {
          id: "10-1",
          author: getRandomAuthor(),
          date: getRandomDate(),
          content: "Yo estuve en una el año pasado. Están guapas para la foto de Instagram y poco más."
        }
      ]
    },
    {
      id: "11",
      title: "Hoteles cutres",
      author: getRandomAuthor(),
      date: getRandomDate(),
      content: "Recopilatorio de hoteles a evitar. Empiezo yo: Hotel Las Dunas en Torremolinos, una pesadilla con patas.",
      category: "Alojamientos",
      replies: [
        {
          id: "11-1",
          author: getRandomAuthor(),
          date: getRandomDate(),
          content: "El Hostal del Mar en Benidorm. Cucarachas de mascota y bonus track de moho en la ducha."
        }
      ]
    },
    
    // Offtopic category
    {
      id: "12",
      title: "Memes random",
      author: getRandomAuthor(),
      date: getRandomDate(),
      content: "Hilo para compartir memes. Que sean buenos o ban. Empiezo yo con un clásico: el de 'no sé Rick, parece falso'.",
      category: "Offtopic",
      replies: [
        {
          id: "12-1",
          author: getRandomAuthor(),
          date: getRandomDate(),
          content: "Ese meme ya está más quemado que la comida de mi suegra, jajaja."
        }
      ]
    },
    {
      id: "13",
      title: "Debatamos algo",
      author: getRandomAuthor(),
      date: getRandomDate(),
      content: "¿Tortilla con o sin cebolla? Yo soy team con cebolla y no acepto discusión. Cambiar mi opinión: imposible.",
      category: "Offtopic",
      replies: [
        {
          id: "13-1",
          author: getRandomAuthor(),
          date: getRandomDate(),
          content: "SIN CEBOLLA. La tortilla es sagrada y la cebolla la arruina. Venid de uno en uno."
        },
        {
          id: "13-2",
          author: getRandomAuthor(),
          date: getRandomDate(),
          content: "Yo la hago mitad y mitad para no pelearme con mi pareja. Diplomacia patria."
        }
      ]
    },
    
    // Humor category
    {
      id: "14",
      title: "Chistes malos",
      author: getRandomAuthor(),
      date: getRandomDate(),
      content: "¿Qué hace un perro con un taladro? Taladrando. Si os habéis reído, sois parte del problema.",
      category: "Humor",
      replies: [
        {
          id: "14-1",
          author: getRandomAuthor(),
          date: getRandomDate(),
          content: "¿Sabéis por qué los de Lepe ponen una escalera en el mar? Para subir la marea 🤣"
        }
      ]
    },
    {
      id: "15",
      title: "Fails de viaje",
      author: getRandomAuthor(),
      date: getRandomDate(),
      content: "Contad vuestros fails viajeros. Yo empiezo: me dormí en el tren y acabé en Francia cuando iba a Valencia. Premio a la estupidez.",
      category: "Humor",
      replies: [
        {
          id: "15-1",
          author: getRandomAuthor(),
          date: getRandomDate(),
          content: "Yo reservé un hotel para las vacaciones y me equivoqué de mes. Llegamos y no había reserva. Cara de tontos nivel: experto."
        },
        {
          id: "15-2",
          author: getRandomAuthor(),
          date: getRandomDate(),
          content: "Me fui a Canarias y me llevé ropa de esquiar porque no miré el tiempo. 30 grados y yo con plumífero."
        }
      ]
    }
  ];
};

export const useForoCochesData = () => {
  const [posts, setPosts] = useState<ForumPost[]>([]);
  const [activeCategory, setActiveCategory] = useState("General");
  const [newPostTitle, setNewPostTitle] = useState("");
  const [newPostContent, setNewPostContent] = useState("");
  const [replyContent, setReplyContent] = useState("");
  const [replyingToPost, setReplyingToPost] = useState<string | null>(null);
  
  // Load posts from localStorage or generate sample data on initial render
  useEffect(() => {
    const savedPosts = localStorage.getItem("forochochesPosts");
    if (savedPosts) {
      setPosts(JSON.parse(savedPosts));
    } else {
      const sampleData = generateSampleData();
      setPosts(sampleData);
      localStorage.setItem("forochochesPosts", JSON.stringify(sampleData));
    }
  }, []);
  
  // Save posts to localStorage whenever they change
  useEffect(() => {
    if (posts.length > 0) {
      localStorage.setItem("forochochesPosts", JSON.stringify(posts));
    }
  }, [posts]);
  
  // Filter posts by active category
  const filteredPosts = posts.filter(post => post.category === activeCategory);
  
  // Handle submitting a new post
  const handleNewPost = (title: string, content: string) => {
    const newPost: ForumPost = {
      id: Date.now().toString(),
      title: title,
      author: "TúMismo", // Could be dynamic if we had authentication
      date: "08/03/2025", // Fixed date as per requirements
      content: content,
      category: activeCategory,
      replies: []
    };
    
    setPosts([newPost, ...posts]);
    toast.success("Hilo creado correctamente");
  };
  
  // Handle submitting a reply to a post
  const handleReply = (postId: string) => {
    const updatedPosts = posts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          replies: [
            ...post.replies,
            {
              id: `${postId}-${post.replies.length + 1}`,
              author: "TúMismo", // Could be dynamic if we had authentication
              date: "08/03/2025", // Fixed date as per requirements
              content: replyContent.trim()
            }
          ]
        };
      }
      return post;
    });
    
    setPosts(updatedPosts);
    setReplyContent("");
    setReplyingToPost(null);
    toast.success("Respuesta enviada correctamente");
  };
  
  // Get initials for avatar
  const getInitials = (name: string) => {
    return name.substring(0, 2).toUpperCase();
  };

  return {
    posts,
    setPosts,
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
  };
};
