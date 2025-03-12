
export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  created_at: string;
  author_name: string;
  author_title?: string;
  image_url: string;
  read_time: string;
}

export const blogCategories = [
  "Todos", "Consejos", "Educativo", "Entretenimiento", "Gastronomía", 
  "Inspiración", "Entrevistas", "Lugares", "Manualidades", "Salud"
];

export const sampleBlogPosts = [
  {
    id: "1",
    title: "10 actividades imprescindibles para hacer con niños en invierno",
    excerpt: "Descubre las mejores actividades para disfrutar con los más pequeños durante los meses fríos del año.",
    category: "Inspiración",
    created_at: "15 mayo 2023",
    author_name: "María Gómez",
    image_url: "https://images.unsplash.com/photo-1610025763872-76c13223c320?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8d2ludGVyJTIwY2hpbGRyZW58ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60",
    read_time: "5 min"
  },
  {
    id: "2",
    title: "Cómo planificar un viaje familiar perfecto",
    excerpt: "Guía completa con consejos prácticos para organizar un viaje en familia sin estrés y con diversión asegurada.",
    category: "Consejos",
    created_at: "2 junio 2023",
    author_name: "Carlos Martínez",
    image_url: "https://images.unsplash.com/photo-1551655510-955bbd123c5e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8ZmFtaWx5JTIwdHJhdmVsfGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60",
    read_time: "8 min"
  },
  {
    id: "3",
    title: "Entrevista: Ana López, creadora de experiencias educativas",
    excerpt: "Conversamos con Ana López sobre cómo crear experiencias educativas memorables para los más pequeños.",
    category: "Entrevistas",
    created_at: "20 junio 2023",
    author_name: "Paula Vázquez",
    author_title: "Periodista educativa",
    image_url: "https://images.unsplash.com/photo-1544717297-fa95b6ee9643?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8dGVhY2hlcnxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60",
    read_time: "10 min"
  },
];
