
import { Comment } from "@/components/forum/types";
import { ForumCategory } from "@/components/forum/ForumCategories";

// Sample comments data with categories
export const sampleComments: Comment[] = [
  {
    id: "sample-1",
    content: "**¡Hola a todos! ¿Alguien tiene recomendaciones para viajar con niños a Portugal?**\n\nEstamos pensando en ir a Portugal este verano con nuestros hijos de 5 y 7 años. ¿Qué zonas nos recomendáis que sean family-friendly? ¿Y alojamientos? Gracias de antemano, foreros.",
    created_at: new Date(Date.now() - 86400000 * 2).toISOString(), // 2 days ago
    user_id: "sample-user-1",
    parent_id: null,
    category: "viajes",
    profiles: {
      first_name: "María",
      last_name: "García",
      avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=Maria"
    },
    replies: [
      {
        id: "sample-1-reply-1",
        content: "¡Hola María! Lisboa es genial para ir con niños. Tiene el Oceanário que es espectacular, el barrio de Belém con sus pasteles de nata, tranvías... También te recomiendo la zona de Cascais, tiene buenas playas y está cerca de Sintra que tiene castillos que parecen de cuento.",
        created_at: new Date(Date.now() - 86400000 * 1.5).toISOString(), // 1.5 days ago
        user_id: "sample-user-2",
        parent_id: "sample-1",
        category: "viajes",
        profiles: {
          first_name: "Carlos",
          last_name: "Rodríguez",
          avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=Carlos"
        }
      },
      {
        id: "sample-1-reply-2",
        content: "Nosotros estuvimos en el Algarve el año pasado con los niños y fue espectacular. Las playas son muy seguras y hay muchos alojamientos tipo apartamento que van genial con peques. Si os gusta la naturaleza también, la zona de Comporta es brutal aunque menos turística.",
        created_at: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
        user_id: "sample-user-3",
        parent_id: "sample-1",
        category: "viajes",
        profiles: {
          first_name: "Ana",
          last_name: "Martínez",
          avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ana"
        }
      }
    ]
  },
  {
    id: "sample-2",
    content: "**Estamos planeando un viaje familiar a la costa este verano**\n\n¿Alguien tiene experiencia con destinos child-friendly en la costa mediterránea? Queremos algo tranquilo pero con opciones para los niños cuando se aburran de la playa.",
    created_at: new Date(Date.now() - 86400000 * 3).toISOString(), // 3 days ago
    user_id: "sample-user-4",
    parent_id: null,
    category: "viajes",
    profiles: {
      first_name: "Javier",
      last_name: "López",
      avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=Javier"
    },
    replies: [
      {
        id: "sample-2-reply-1",
        content: "Peñíscola es genial para familias. Tiene playas tranquilas, un bonito casco antiguo y muchas actividades para niños. Además hay parques acuáticos cerca como AquaLandia.",
        created_at: new Date(Date.now() - 86400000 * 2.5).toISOString(), // 2.5 days ago
        user_id: "sample-user-5",
        parent_id: "sample-2",
        category: "viajes",
        profiles: {
          first_name: "Laura",
          last_name: "Fernández",
          avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=Laura"
        }
      }
    ]
  },
  {
    id: "sample-3",
    content: "**¿Qué opináis de las clases de natación para bebés?**\n\n¿Merecen la pena? Mi hija tiene 10 meses y estoy pensando en apuntarla pero no sé si es demasiado pronto.",
    created_at: new Date(Date.now() - 86400000 * 1).toISOString(), // 1 day ago
    user_id: "sample-user-6",
    parent_id: null,
    category: "general",
    profiles: {
      first_name: "Elena",
      last_name: "Sánchez",
      avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=Elena"
    },
    replies: [
      {
        id: "sample-3-reply-1",
        content: "Nosotros empezamos con mi hijo a los 9 meses y fue una experiencia genial. A él le encantaba y notamos mucha diferencia en su confianza en el agua cuando íbamos a la piscina o la playa.",
        created_at: new Date(Date.now() - 86400000 * 0.5).toISOString(),
        user_id: "sample-user-8",
        parent_id: "sample-3",
        category: "general",
        profiles: {
          first_name: "Pablo",
          last_name: "Martín",
          avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=Pablo"
        }
      }
    ]
  },
  {
    id: "sample-4",
    content: "**¿Algún hotel con habitaciones familiares en Barcelona?**\n\nNecesitamos espacio para 2 adultos y 3 niños. Los hoteles que estoy mirando solo tienen habitaciones para 4 personas como máximo.",
    created_at: new Date(Date.now() - 86400000 * 4).toISOString(), // 4 days ago
    user_id: "sample-user-7",
    parent_id: null,
    category: "alojamientos",
    profiles: {
      first_name: "Miguel",
      last_name: "González",
      avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=Miguel"
    },
    replies: [
      {
        id: "sample-4-reply-1",
        content: "Te recomiendo que mires apartamentos turísticos en vez de hoteles. Nosotros fuimos 5 y encontramos muchas más opciones así. Además, tener cocina con niños siempre viene bien.",
        created_at: new Date(Date.now() - 86400000 * 3.5).toISOString(),
        user_id: "sample-user-9",
        parent_id: "sample-4",
        category: "alojamientos",
        profiles: {
          first_name: "Lucía",
          last_name: "Fernández",
          avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=Lucia"
        }
      },
      {
        id: "sample-4-reply-2",
        content: "El Barcelona Princess tiene habitaciones familiares para 5 personas. Estuvimos allí el año pasado y muy bien, tiene buena piscina también para los peques.",
        created_at: new Date(Date.now() - 86400000 * 3).toISOString(),
        user_id: "sample-user-10",
        parent_id: "sample-4",
        category: "alojamientos",
        profiles: {
          first_name: "Alberto",
          last_name: "Díaz",
          avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alberto"
        }
      }
    ]
  },
  {
    id: "sample-5",
    content: "**¿Cuál ha sido el mayor desastre que habéis tenido viajando con niños?**\n\nYo olvidé el osito de peluche de mi hijo y fue un drama total 😂 Tuvimos que comprar uno nuevo pero \"no era igual\" según él. Noche de lágrimas...",
    created_at: new Date(Date.now() - 86400000 * 5).toISOString(), // 5 days ago
    user_id: "sample-user-8",
    parent_id: null,
    category: "humor",
    profiles: {
      first_name: "Paula",
      last_name: "Martín",
      avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=Paula"
    },
    replies: [
      {
        id: "sample-5-reply-1",
        content: "¡Jajaja! Una vez mi hija de 4 años le dijo al camarero que su comida estaba asquerosa. Quería morirme de vergüenza! El camarero por suerte se lo tomó bien y le trajo un helado \"para compensar\" 🤣",
        created_at: new Date(Date.now() - 86400000 * 4.5).toISOString(), // 4.5 days ago
        user_id: "sample-user-9",
        parent_id: "sample-5",
        category: "humor",
        profiles: {
          first_name: "Diego",
          last_name: "Pérez",
          avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=Diego"
        }
      },
      {
        id: "sample-5-reply-2",
        content: "En un vuelo de 3 horas mi hijo vomitó nada más despegar. No llevaba ropa de cambio y tuve que comprarle una camiseta XXXL en el duty free que le llegaba a los tobillos. Fue vestido así durante todo el viaje 😅",
        created_at: new Date(Date.now() - 86400000 * 4).toISOString(),
        user_id: "sample-user-11",
        parent_id: "sample-5",
        category: "humor",
        profiles: {
          first_name: "Carmen",
          last_name: "Vega",
          avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=Carmen"
        }
      }
    ]
  },
  {
    id: "sample-6",
    content: "**¿Netflix o Disney+ para niños pequeños?**\n\nEstoy pensando en suscribirme a uno y no sé cuál tiene mejor contenido para niños de 3-6 años.",
    created_at: new Date(Date.now() - 86400000 * 6).toISOString(), // 6 days ago
    user_id: "sample-user-10",
    parent_id: null,
    category: "offtopic",
    profiles: {
      first_name: "Lucía",
      last_name: "Jiménez",
      avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=Lucia"
    },
    replies: [
      {
        id: "sample-6-reply-1",
        content: "Sin duda Disney+ para esa edad. Tiene todo el catálogo de Disney, Pixar, más series específicas para niños pequeños. Netflix tiene buen contenido pero menos orientado a esas edades.",
        created_at: new Date(Date.now() - 86400000 * 5.5).toISOString(),
        user_id: "sample-user-12",
        parent_id: "sample-6",
        category: "offtopic",
        profiles: {
          first_name: "Roberto",
          last_name: "Torres",
          avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=Roberto"
        }
      },
      {
        id: "sample-6-reply-2",
        content: "Yo tengo los dos y mis hijos usan mucho más Disney+. La interfaz además es más sencilla para ellos y puedes poner perfiles infantiles con restricciones de contenido por edad.",
        created_at: new Date(Date.now() - 86400000 * 5).toISOString(),
        user_id: "sample-user-13",
        parent_id: "sample-6",
        category: "offtopic",
        profiles: {
          first_name: "Sara",
          last_name: "López",
          avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sara"
        }
      }
    ]
  },
  {
    id: "sample-7",
    content: "**Buscando recomendaciones de restaurantes con zona infantil en Madrid**\n\nVamos a Madrid el mes que viene con mis hijos y me gustaría saber qué sitios recomendáis para comer que tengan zona de juegos o sean especialmente family-friendly.",
    created_at: new Date(Date.now() - 86400000 * 2.3).toISOString(),
    user_id: "sample-user-14",
    parent_id: null,
    category: "general",
    profiles: {
      first_name: "Daniel",
      last_name: "Ruiz",
      avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=Daniel"
    },
    replies: [
      {
        id: "sample-7-reply-1",
        content: "El Ocho y Medio en Chamberí tiene una zona infantil muy chula y la comida está bien. Es bastante grande y no suele haber problema para reservar.",
        created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
        user_id: "sample-user-15",
        parent_id: "sample-7",
        category: "general",
        profiles: {
          first_name: "Isabel",
          last_name: "Navarro",
          avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=Isabel"
        }
      }
    ]
  },
  {
    id: "sample-8",
    content: "**Estoy harto de conducir 3 horas diarias para llevar a mis hijos al colegio**\n\nMe he mudado hace poco y ahora tardo 1,5h en llegar al colegio de mis hijos ¿Alguien ha pasado por algo similar? ¿Cambio de colegio o me aguanto?",
    created_at: new Date(Date.now() - 86400000 * 4.2).toISOString(),
    user_id: "sample-user-16",
    parent_id: null,
    category: "offtopic",
    profiles: {
      first_name: "Jorge",
      last_name: "Moreno",
      avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jorge"
    },
    replies: [
      {
        id: "sample-8-reply-1",
        content: "Yo pasé por algo parecido y al final cambié a los niños de cole. Es que 3h diarias es una locura, piensa que son 15h a la semana, ¡60h al mes! Es como un trabajo a media jornada solo conduciendo...",
        created_at: new Date(Date.now() - 86400000 * 4).toISOString(),
        user_id: "sample-user-17",
        parent_id: "sample-8",
        category: "offtopic",
        profiles: {
          first_name: "Marta",
          last_name: "Gil",
          avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=Marta"
        }
      }
    ]
  },
  {
    id: "sample-9",
    content: "**¿Cómo gestionáis los caprichos de los niños cuando salís de compras?**\n\nMi hijo de 4 años quiere comprarse algo cada vez que entramos en una tienda. Estoy intentando enseñarle el valor del dinero pero es complicado a su edad.",
    created_at: new Date(Date.now() - 86400000 * 3.7).toISOString(),
    user_id: "sample-user-18",
    parent_id: null,
    category: "general",
    profiles: {
      first_name: "Raúl",
      last_name: "Torres",
      avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=Raul"
    },
    replies: [
      {
        id: "sample-9-reply-1",
        content: "Nosotros establecimos el sistema de \"un capricho al mes\". Le damos una pequeña paga y puede elegir en qué gastársela, pero solo una vez. Le ayuda a valorar más lo que tiene y a pensárselo antes de pedir.",
        created_at: new Date(Date.now() - 86400000 * 3.2).toISOString(),
        user_id: "sample-user-19",
        parent_id: "sample-9",
        category: "general",
        profiles: {
          first_name: "Claudia",
          last_name: "Hernández",
          avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=Claudia"
        }
      }
    ]
  },
  {
    id: "sample-10",
    content: "**¿Alguna actividad extraescolar recomendable para niños tímidos?**\n\nMi hija tiene 7 años y le cuesta mucho relacionarse con otros niños. Me gustaría apuntarla a algo que le ayude a socializar pero que no le resulte demasiado abrumador.",
    created_at: new Date(Date.now() - 86400000 * 7.5).toISOString(),
    user_id: "sample-user-20",
    parent_id: null,
    category: "general",
    profiles: {
      first_name: "Sofía",
      last_name: "Flores",
      avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sofia"
    },
    replies: [
      {
        id: "sample-10-reply-1",
        content: "El teatro infantil funcionó genial con mi hijo que también era muy tímido. Empezó algo forzado pero al final se soltó muchísimo y ahora tiene muchos amigos.",
        created_at: new Date(Date.now() - 86400000 * 7).toISOString(),
        user_id: "sample-user-21",
        parent_id: "sample-10",
        category: "general",
        profiles: {
          first_name: "Adrián",
          last_name: "Castro",
          avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=Adrian"
        }
      },
      {
        id: "sample-10-reply-2",
        content: "Puedes probar con actividades más estructuradas como robótica o ajedrez, donde la interacción es más limitada al principio pero igual pueden hacer amigos con intereses similares.",
        created_at: new Date(Date.now() - 86400000 * 6.8).toISOString(),
        user_id: "sample-user-22",
        parent_id: "sample-10",
        category: "general",
        profiles: {
          first_name: "Marina",
          last_name: "Blanco",
          avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=Marina"
        }
      }
    ]
  }
];
