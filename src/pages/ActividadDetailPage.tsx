
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { useToast } from "@/components/ui/use-toast";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { 
  Star, 
  MapPin, 
  Users, 
  CalendarDays, 
  Clock, 
  Heart, 
  Share, 
  ChevronRight,
  Info,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { ActivityProps } from "@/components/ActivityCard";

const ActividadDetailPage = () => {
  const { id } = useParams();
  const [activity, setActivity] = useState<ActivityProps | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [participants, setParticipants] = useState(1);
  const [totalPrice, setTotalPrice] = useState(0);
  const { toast } = useToast();

  useEffect(() => {
    async function fetchActivity() {
      setLoading(true);
      try {
        // Try to fetch from Supabase first
        const { data, error } = await supabase
          .from('activities')
          .select('*')
          .eq('id', id)
          .single();

        if (error) {
          throw error;
        }

        if (data) {
          const activityData: ActivityProps = {
            id: data.id,
            title: data.title,
            location: data.location,
            category: data.category,
            price: data.price,
            rating: data.rating || 0,
            reviewCount: data.review_count || 0,
            image: data.image_url || "https://images.unsplash.com/photo-1596464716127-f2a82984de30?q=80&w=1170&auto=format&fit=crop",
            ageRange: data.age_range,
            isPremium: data.is_premium || false
          };
          
          setActivity(activityData);
          setTotalPrice(data.price);
        }
      } catch (error) {
        console.error('Error fetching activity:', error);
        
        // Fallback to sample data if Supabase fetch fails
        const sampleActivities = [
          {
            id: "1",
            title: "Taller de cocina familiar: ¡Ricos churros!",
            location: "Madrid",
            category: "Gastronomía",
            price: 15,
            rating: 4.8,
            reviewCount: 124,
            image: "https://images.unsplash.com/photo-1626803775151-61d756612f97?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8Y2h1cnJvc3xlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60",
            ageRange: "4-12 años",
            description: "Aprende a hacer deliciosos churros con chocolate junto a tus hijos en este divertido taller gastronómico. Un clásico español que encantará a toda la familia. Incluye todos los ingredientes y materiales necesarios.",
            schedule: "Disponible lunes a viernes, 17:00 - 19:00, sábados y domingos 11:00 - 13:00",
            duration: "2 horas",
            included: ["Todos los ingredientes", "Delantal para cada participante", "Receta impresa", "Degustación final"],
            host: "María García",
            hostDescription: "Chef especializada en repostería tradicional con 15 años de experiencia enseñando a familias."
          },
          {
            id: "2",
            title: "Aventura en el bosque: Escapada del tesoro",
            location: "Barcelona",
            category: "Aventura",
            price: 0,
            rating: 4.9,
            reviewCount: 67,
            image: "https://images.unsplash.com/photo-1448375240586-882707db888b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Zm9yZXN0fGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60",
            ageRange: "Todas las edades",
            description: "Una aventura gratuita para toda la familia en la que tendréis que resolver enigmas y encontrar un tesoro escondido en plena naturaleza. Perfecto para niños curiosos y padres aventureros.",
            schedule: "Disponible todos los días de 9:00 a 18:00",
            duration: "3 horas",
            included: ["Mapa del tesoro", "Brújula por grupo", "Botella de agua"],
            host: "Parque Natural Collserola",
            hostDescription: "El Parque Natural de Collserola organiza actividades educativas para familias desde 1997."
          },
          {
            id: "3",
            title: "Visita guiada: Museo interactivo para niños",
            location: "Valencia",
            category: "Cultural",
            price: 12,
            rating: 4.7,
            reviewCount: 89,
            image: "https://images.unsplash.com/photo-1468131965815-992b740c51c6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fGNoaWxkcmVuJTIwbXVzZXVtfGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60",
            ageRange: "3-12 años",
            description: "Visita nuestro museo interactivo donde los niños son los protagonistas. Con exposiciones diseñadas para tocar, experimentar y aprender jugando. Una experiencia cultural divertida para toda la familia.",
            schedule: "Martes a domingo, 10:00 - 19:00. Cerrado los lunes.",
            duration: "90 minutos",
            included: ["Entrada al museo", "Guía especializado en público infantil", "Kit de experimentos para llevar a casa"],
            host: "Museo de las Ciencias",
            hostDescription: "Un espacio educativo donde la ciencia, el arte y la tecnología se unen para ofrecer experiencias únicas a los más pequeños."
          },
          {
            id: "4",
            title: "Taller de ciencia: Experimentos asombrosos",
            location: "Sevilla",
            category: "Educativo",
            price: 20,
            rating: 4.9,
            reviewCount: 56,
            image: "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8c2NpZW5jZSUyMGV4cGVyaW1lbnR8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60",
            ageRange: "5-14 años",
            isPremium: true,
            description: "Taller premium donde los niños aprenderán conceptos científicos a través de experimentos sorprendentes y seguros. Explosiones controladas, reacciones químicas coloridas y mucho más.",
            schedule: "Sábados y domingos, sesiones a las 11:00, 13:00 y 16:00",
            duration: "2 horas",
            included: ["Materiales para los experimentos", "Gafas protectoras", "Bata de laboratorio", "Certificado de científico junior"],
            host: "Dr. Roberto Jiménez",
            hostDescription: "Doctor en Física y divulgador científico con experiencia en programas educativos para niños."
          },
          {
            id: "5",
            title: "Excursión al lago para familias",
            location: "Madrid",
            category: "Naturaleza",
            price: 8,
            rating: 4.5,
            reviewCount: 42,
            image: "https://images.unsplash.com/photo-1527856263669-12c3a0af2aa6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8bGFrZSUyMGZhbWlseXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60",
            ageRange: "Todas las edades",
            description: "Disfruta de un día en familia en nuestro hermoso lago. Podrás dar un paseo en barca, observar aves y participar en actividades guiadas sobre la fauna y flora local.",
            schedule: "Lunes a domingo, de 9:00 a 19:00 (mayo-septiembre) y de 10:00 a 17:00 (octubre-abril)",
            duration: "Día completo (acceso libre)",
            included: ["Guía de naturaleza", "Alquiler de prismáticos", "Actividad de anillamiento de aves (sábados)"],
            host: "Reserva Natural Los Laguitos",
            hostDescription: "Espacio natural protegido con más de 200 especies de aves y programas educativos para visitantes de todas las edades."
          },
          {
            id: "6",
            title: "Clase de yoga para padres e hijos",
            location: "Barcelona",
            category: "Deporte",
            price: 18,
            rating: 4.6,
            reviewCount: 38,
            image: "https://images.unsplash.com/photo-1588286840104-8957b019727f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8eW9nYSUyMGNoaWxkcmVufGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60",
            ageRange: "4-12 años",
            description: "Una clase especial donde padres e hijos practican yoga juntos, fortaleciendo el vínculo familiar mientras mejoran su flexibilidad, concentración y bienestar emocional.",
            schedule: "Miércoles 17:30 y sábados 10:30",
            duration: "60 minutos",
            included: ["Esterillas para todos los participantes", "Botella de agua", "Certificado de participación"],
            host: "Ana Martínez",
            hostDescription: "Instructora certificada de yoga infantil y familiar con formación en pedagogía Montessori."
          },
          {
            id: "7",
            title: "Taller de pintura: Crea tu obra maestra",
            location: "Valencia",
            category: "Arte",
            price: 15,
            rating: 4.9,
            reviewCount: 65,
            image: "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8Y2hpbGRyZW4lMjBwYWludGluZ3xlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60",
            ageRange: "3-12 años",
            description: "Taller de expresión artística donde cada niño podrá crear su propia obra de arte usando diferentes técnicas de pintura. Los padres pueden participar o simplemente observar el proceso creativo.",
            schedule: "Martes y jueves 17:00, sábados 11:00 y 16:00",
            duration: "90 minutos",
            included: ["Todos los materiales artísticos", "Delantal protector", "Marco para la obra terminada"],
            host: "Elena Ruiz",
            hostDescription: "Artista plástica y educadora con más de 10 años de experiencia en talleres creativos para niños."
          },
          {
            id: "8",
            title: "Aventura de escalada en árbol para familias",
            location: "Madrid",
            category: "Aventura",
            price: 25,
            rating: 4.8,
            reviewCount: 73,
            image: "https://images.unsplash.com/photo-1502418606274-177739f6eaa4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8Y2xpbWJpbmclMjB0cmVlfGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60",
            ageRange: "6+ años",
            isPremium: true,
            description: "Experiencia premium de escalada en árboles con diferentes niveles de dificultad. Incluye tirolinas, puentes colgantes y plataformas de observación. Todo con el máximo nivel de seguridad.",
            schedule: "Viernes, sábados y domingos, sesiones a las 10:00, 12:30 y 15:00",
            duration: "2.5 horas",
            included: ["Equipo completo de seguridad", "Instructor especializado", "Bebida y snack energético", "Fotografías digitales de la experiencia"],
            host: "Aventura Forestal",
            hostDescription: "Empresa especializada en actividades de aventura al aire libre con certificación de seguridad internacional."
          }
        ];
        
        const foundActivity = sampleActivities.find(act => act.id === id);
        
        if (foundActivity) {
          setActivity(foundActivity as ActivityProps);
          setTotalPrice(foundActivity.price);
        } else {
          toast({
            title: "Actividad no encontrada",
            description: "No hemos podido encontrar la actividad solicitada.",
            variant: "destructive",
          });
        }
      } finally {
        setLoading(false);
      }
    }

    fetchActivity();
  }, [id, toast]);

  useEffect(() => {
    if (activity && participants > 0) {
      setTotalPrice(activity.price * participants);
    }
  }, [participants, activity]);

  const handleParticipantsChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(event.target.value);
    if (!isNaN(value) && value > 0 && value <= 10) {
      setParticipants(value);
    }
  };

  const handleReservation = () => {
    if (!selectedDate) {
      toast({
        title: "Fecha no seleccionada",
        description: "Por favor, selecciona una fecha para continuar.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "¡Reserva realizada!",
      description: `Has reservado ${activity?.title} para ${participants} ${participants === 1 ? 'persona' : 'personas'} el ${format(selectedDate, 'dd MMMM yyyy', {locale: es})}.`,
    });
  };

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin mb-4 mx-auto h-8 w-8 text-familyxp-primary">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 12a9 9 0 1 1-6.219-8.56" />
              </svg>
            </div>
            <p className="text-gray-500">Cargando actividad...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!activity) {
    return (
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Actividad no encontrada</h2>
            <p className="text-gray-500 mb-6">Lo sentimos, no hemos podido encontrar la actividad que buscas.</p>
            <Link to="/explorar">
              <Button className="bg-familyxp-primary">Ver todas las actividades</Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const {
    title,
    location,
    category,
    price,
    rating,
    reviewCount,
    image,
    ageRange,
    isPremium,
    description = "Una experiencia única para disfrutar en familia. Esta actividad ha sido diseñada para crear recuerdos inolvidables mientras aprendes y te diviertes.",
    schedule = "Horarios disponibles todos los días, consulta el calendario",
    duration = "2 horas",
    included = ["Equipo necesario", "Instructor profesional", "Seguro de actividad"],
    host = "Equipo Familea",
    hostDescription = "Expertos en actividades familiares con amplia experiencia en atención a niños de todas las edades."
  } = activity as any;

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      
      <main className="flex-1 pb-12">
        {/* Breadcrumb */}
        <div className="bg-gray-50 py-3">
          <div className="container mx-auto px-4">
            <div className="flex items-center text-sm text-gray-500">
              <Link to="/" className="hover:text-familyxp-primary">Inicio</Link>
              <ChevronRight className="mx-1" size={14} />
              <Link to="/explorar" className="hover:text-familyxp-primary">Explorar</Link>
              <ChevronRight className="mx-1" size={14} />
              <span className="text-gray-700">{title}</span>
            </div>
          </div>
        </div>
        
        {/* Hero section */}
        <div className="container mx-auto px-4 py-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left column: Image */}
            <div className="lg:col-span-2">
              <div className="relative rounded-xl overflow-hidden">
                <img 
                  src={image} 
                  alt={title} 
                  className="w-full h-[400px] object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.onerror = null;
                    target.src = "https://images.unsplash.com/photo-1596464716127-f2a82984de30?q=80&w=1170&auto=format&fit=crop";
                  }}
                />
                
                <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                  <Badge className="bg-white text-familyxp-dark">
                    {category}
                  </Badge>
                  
                  {isPremium && (
                    <Badge className="bg-familyxp-primary text-white">
                      Premium
                    </Badge>
                  )}
                </div>
                
                <div className="absolute top-4 right-4 flex gap-2">
                  <button className="h-10 w-10 rounded-full bg-white/90 flex items-center justify-center hover:bg-white transition-colors">
                    <Heart size={20} className="text-familyxp-primary" />
                  </button>
                  <button className="h-10 w-10 rounded-full bg-white/90 flex items-center justify-center hover:bg-white transition-colors">
                    <Share size={20} className="text-familyxp-primary" />
                  </button>
                </div>
              </div>
            </div>
            
            {/* Right column: Booking */}
            <div>
              <Card className="sticky top-4">
                <CardContent className="pt-6">
                  <h3 className="text-xl font-semibold mb-4">Reserva tu experiencia</h3>
                  
                  <div className="mb-4">
                    {price === 0 ? (
                      <div className="text-2xl font-bold text-familyxp-success mb-1">Gratis</div>
                    ) : (
                      <div className="text-2xl font-bold mb-1">{price}€ <span className="text-sm font-normal text-gray-500">/ persona</span></div>
                    )}
                    <div className="flex items-center text-sm">
                      <Star size={16} className="mr-1 fill-yellow-400 text-yellow-400" />
                      <span className="font-medium">{rating}</span>
                      <span className="text-gray-500 ml-1">({reviewCount} valoraciones)</span>
                    </div>
                  </div>
                  
                  <Separator className="mb-4" />
                  
                  {/* Date picker */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-2">Fecha</label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full justify-start text-left font-normal"
                        >
                          <CalendarDays className="mr-2 h-4 w-4" />
                          {selectedDate ? (
                            format(selectedDate, "PPP", { locale: es })
                          ) : (
                            <span>Seleccionar fecha</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={selectedDate}
                          onSelect={setSelectedDate}
                          initialFocus
                          className={cn("p-3 pointer-events-auto")}
                          disabled={(date) => date < new Date()}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  
                  {/* Participants */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium mb-2">Personas</label>
                    <div className="flex">
                      <Input
                        type="number"
                        min="1"
                        max="10"
                        value={participants}
                        onChange={handleParticipantsChange}
                        className="w-full"
                      />
                    </div>
                  </div>
                  
                  {/* Total */}
                  <div className="mb-6">
                    <h4 className="font-medium mb-1">Total</h4>
                    {price === 0 ? (
                      <div className="text-xl font-bold text-familyxp-success">Gratis</div>
                    ) : (
                      <div className="text-xl font-bold">{totalPrice}€</div>
                    )}
                  </div>
                  
                  <Button 
                    onClick={handleReservation} 
                    className="w-full bg-familyxp-primary hover:bg-familyxp-dark"
                  >
                    {price === 0 ? 'Reservar plaza' : 'Reservar ahora'}
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
        
        {/* Details section */}
        <div className="container mx-auto px-4 py-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">{title}</h1>
              
              <div className="flex flex-wrap items-center gap-4 mb-6">
                <div className="flex items-center text-gray-600">
                  <MapPin size={18} className="mr-1" />
                  <span>{location}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Users size={18} className="mr-1" />
                  <span>{ageRange}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Clock size={18} className="mr-1" />
                  <span>{duration}</span>
                </div>
              </div>
              
              <div className="mb-8">
                <h2 className="text-xl font-semibold mb-3">Sobre esta actividad</h2>
                <p className="text-gray-600 mb-4">{description}</p>
                
                <h3 className="text-lg font-semibold mb-2">Horarios</h3>
                <p className="text-gray-600 mb-4">{schedule}</p>
                
                <h3 className="text-lg font-semibold mb-2">¿Qué está incluido?</h3>
                <ul className="list-disc list-inside text-gray-600 mb-4">
                  {included.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>
              
              <div className="mb-8">
                <h2 className="text-xl font-semibold mb-3">Tu anfitrión</h2>
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                    <img
                      src={`https://ui-avatars.com/api/?name=${host.replace(/\s+/g, '+')}&background=random`}
                      alt={host}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="font-semibold">{host}</h3>
                    <p className="text-gray-600">{hostDescription}</p>
                  </div>
                </div>
              </div>
              
              <div className="mb-8">
                <h2 className="text-xl font-semibold mb-3">Valoraciones</h2>
                <div className="flex items-center gap-2 mb-4">
                  <div className="text-2xl font-bold">{rating}</div>
                  <div>
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          size={20} 
                          className={`${i < Math.floor(rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`} 
                        />
                      ))}
                    </div>
                    <div className="text-sm text-gray-500">{reviewCount} valoraciones</div>
                  </div>
                </div>
                
                {/* Example review */}
                <div className="bg-gray-50 p-4 rounded-lg mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                      <img
                        src="https://ui-avatars.com/api/?name=Laura+Sánchez&background=random"
                        alt="Laura Sánchez"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <div className="font-medium">Laura Sánchez</div>
                      <div className="text-xs text-gray-500">Hace 2 semanas</div>
                    </div>
                  </div>
                  <div className="flex mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={16} className="fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-gray-600 text-sm">
                    Una experiencia increíble. Mis hijos lo pasaron en grande y aprendieron mucho. El anfitrión fue muy atento y paciente con los niños. ¡Repetiremos seguro!
                  </p>
                </div>
                
                <Button variant="outline" className="w-full">Ver todas las valoraciones</Button>
              </div>
            </div>
            
            <div className="hidden lg:block">
              {/* Information box */}
              <div className="bg-gray-50 p-4 rounded-lg mb-6">
                <div className="flex items-start gap-3">
                  <Info size={24} className="text-familyxp-primary shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold mb-1">Política de cancelación</h3>
                    <p className="text-sm text-gray-600">
                      Cancelación gratuita hasta 48 horas antes. Después de este periodo no se realizan reembolsos.
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Similar activities teaser */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Actividades similares</h3>
                <div className="space-y-4">
                  <Link to="/actividad/6" className="block group">
                    <div className="flex gap-3">
                      <div className="w-20 h-20 rounded-lg overflow-hidden">
                        <img 
                          src="https://images.unsplash.com/photo-1588286840104-8957b019727f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8eW9nYSUyMGNoaWxkcmVufGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60" 
                          alt="Clase de yoga para padres e hijos" 
                          className="w-full h-full object-cover transition-transform group-hover:scale-105"
                        />
                      </div>
                      <div>
                        <h4 className="font-medium text-sm group-hover:text-familyxp-primary">Clase de yoga para padres e hijos</h4>
                        <div className="text-sm text-gray-600">Barcelona</div>
                        <div className="text-sm font-medium">18€/persona</div>
                      </div>
                    </div>
                  </Link>
                  
                  <Link to="/actividad/7" className="block group">
                    <div className="flex gap-3">
                      <div className="w-20 h-20 rounded-lg overflow-hidden">
                        <img 
                          src="https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8Y2hpbGRyZW4lMjBwYWludGluZ3xlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60" 
                          alt="Taller de pintura: Crea tu obra maestra" 
                          className="w-full h-full object-cover transition-transform group-hover:scale-105"
                        />
                      </div>
                      <div>
                        <h4 className="font-medium text-sm group-hover:text-familyxp-primary">Taller de pintura: Crea tu obra maestra</h4>
                        <div className="text-sm text-gray-600">Valencia</div>
                        <div className="text-sm font-medium">15€/persona</div>
                      </div>
                    </div>
                  </Link>
                </div>
                
                <Button variant="outline" className="w-full mt-4">
                  <Link to="/explorar">Ver más actividades</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ActividadDetailPage;
