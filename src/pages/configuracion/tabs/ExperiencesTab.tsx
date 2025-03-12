import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { TabProps } from "@/components/configuration/types";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { CalendarDays, Clock, Euro, Users } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";

// Tipos
interface Experience {
  id: string;
  title: string;
  price: number;
  status: string;
  created_at: string;
  creator_id: string;
  creator_name?: string;
  description: string;
  image_url?: string;
  location: string;
  category: string;
  age_range: string;
  is_premium: boolean;
  rating?: number;
  review_count?: number;
}

interface Schedule {
  id: string;
  activity_id: string;
  date: string;
  start_time: string;
  end_time: string;
  available_spots: number;
  booked_spots: number;
  price_override: number | null;
  created_at: string;
  updated_at: string;
}

// Componentes de tabla
const ExperienceTable = ({ experiences, onSelectExperience, isLoading }: {
  experiences: Experience[];
  onSelectExperience: (id: string) => void;
  isLoading: boolean;
}) => (
  <div className="overflow-x-auto">
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="min-w-[150px]">Actividad</TableHead>
          <TableHead className="min-w-[100px]">Precio</TableHead>
          <TableHead className="min-w-[100px]">Estado</TableHead>
          <TableHead className="min-w-[100px]">Reservas</TableHead>
          <TableHead className="min-w-[100px]">Acciones</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {experiences.map((exp) => (
          <TableRow key={exp.id}>
            <TableCell className="font-medium truncate max-w-[150px]">{exp.title}</TableCell>
            <TableCell>{exp.price}€</TableCell>
            <TableCell>
              <StatusBadge status={exp.status} />
            </TableCell>
            <TableCell>
              {exp.review_count || 0} reseñas
            </TableCell>
            <TableCell>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onSelectExperience(exp.id)}
                className="text-xs md:text-sm"
              >
                Gestionar
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </div>
);

const StatusBadge = ({ status }: { status: string }) => (
  <span className={`px-2 py-1 rounded-full text-xs ${
    status === 'published' ? 'bg-green-100 text-green-800' :
    status === 'draft' ? 'bg-gray-100 text-gray-800' :
    'bg-orange-100 text-orange-800'
  }`}>
    {status === 'published' ? 'Publicada' :
     status === 'draft' ? 'Borrador' : 'Pendiente'}
  </span>
);

const ScheduleTable = ({ schedules }: { schedules: Schedule[] }) => (
  <div className="overflow-x-auto">
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="min-w-[100px]">Fecha</TableHead>
          <TableHead className="min-w-[100px]">Horario</TableHead>
          <TableHead className="min-w-[100px]">Plazas</TableHead>
          <TableHead className="min-w-[100px]">Precio</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {schedules.map((schedule) => (
          <TableRow key={schedule.id}>
            <TableCell className="text-sm md:text-base">
              {format(new Date(schedule.date), "dd/MM/yyyy")}
            </TableCell>
            <TableCell className="text-sm md:text-base">
              {schedule.start_time.slice(0, 5)} - {schedule.end_time.slice(0, 5)}
            </TableCell>
            <TableCell className="text-sm md:text-base">
              {schedule.booked_spots}/{schedule.available_spots}
            </TableCell>
            <TableCell className="text-sm md:text-base">
              {schedule.price_override ? 
                `${schedule.price_override}€` : 
                "Precio base"
              }
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </div>
);

// Componentes de diálogo y formulario
const CreateExperienceDialog = ({ 
  open, 
  onOpenChange, 
  onCreateExperience 
}: { 
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreateExperience: (data: {
    title: string;
    price: number;
    creator_id: string;
    is_premium: boolean;
    description: string;
    location: string;
    category: string;
    age_range: string;
  }) => void;
}) => {
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCreateExperience({
      title,
      price: parseFloat(price),
      creator_id: "",
      is_premium: false,
      description: "",
      location: "",
      category: "other",
      age_range: "all"
    });
    setTitle("");
    setPrice("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Crear nueva actividad</DialogTitle>
          <DialogDescription>
            Ingresa los detalles básicos de la actividad. Podrás editar más información después.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Título</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ej: Taller de arte para niños"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="price">Precio base (€)</Label>
            <Input
              id="price"
              type="number"
              min="0"
              step="0.01"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="0.00"
              required
            />
          </div>
          <DialogFooter>
            <Button type="submit">Crear actividad</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

const AddScheduleDialog = ({
  open,
  onOpenChange,
  onAddSchedule,
  experienceId
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddSchedule: (data: { date: string; startTime: string; endTime: string; availableSpots: number; priceOverride?: number }) => void;
  experienceId: string;
}) => {
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [availableSpots, setAvailableSpots] = useState("");
  const [priceOverride, setPriceOverride] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddSchedule({
      date,
      startTime,
      endTime,
      availableSpots: parseInt(availableSpots),
      priceOverride: priceOverride ? parseFloat(priceOverride) : undefined
    });
    setDate("");
    setStartTime("");
    setEndTime("");
    setAvailableSpots("");
    setPriceOverride("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Agregar horario</DialogTitle>
          <DialogDescription>
            Configura un nuevo horario para esta actividad.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="date">Fecha</Label>
            <Input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startTime">Hora inicio</Label>
              <Input
                id="startTime"
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endTime">Hora fin</Label>
              <Input
                id="endTime"
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                required
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="availableSpots">Plazas disponibles</Label>
            <Input
              id="availableSpots"
              type="number"
              min="1"
              value={availableSpots}
              onChange={(e) => setAvailableSpots(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="priceOverride">Precio especial (opcional)</Label>
            <Input
              id="priceOverride"
              type="number"
              min="0"
              step="0.01"
              value={priceOverride}
              onChange={(e) => setPriceOverride(e.target.value)}
              placeholder="Dejar vacío para usar precio base"
            />
          </div>
          <DialogFooter>
            <Button type="submit">Agregar horario</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

// Hooks personalizados
const useExperiences = (userId: string) => {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [error, setError] = useState<string | null>(null);

  const loadExperiences = async (pageNum: number = 1) => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('activities')
        .select('*')
        .eq('creator_id', userId)
        .order('created_at', { ascending: false })
        .range((pageNum - 1) * ITEMS_PER_PAGE, pageNum * ITEMS_PER_PAGE - 1);

      if (error) throw error;

      const experiencesWithStatus = data.map(exp => ({
        ...exp,
        status: exp.is_premium ? 'published' : 'draft'
      }));

      if (pageNum === 1) {
        setExperiences(experiencesWithStatus);
      } else {
        setExperiences(prev => [...prev, ...experiencesWithStatus]);
      }

      setHasMore(data.length === ITEMS_PER_PAGE);
      setPage(pageNum);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar las actividades');
      toast.error('Error al cargar las actividades');
    } finally {
      setIsLoading(false);
    }
  };

  const createExperience = async (data: {
    title: string;
    price: number;
    creator_id: string;
    is_premium: boolean;
    description: string;
    location: string;
    category: string;
    age_range: string;
  }) => {
    try {
      const { error } = await supabase
        .from('activities')
        .insert([data]);

      if (error) throw error;

      toast.success('Actividad creada exitosamente');
      loadExperiences(1);
    } catch (err) {
      toast.error('Error al crear la actividad');
      throw err;
    }
  };

  return {
    experiences,
    isLoading,
    hasMore,
    page,
    error,
    loadExperiences,
    createExperience
  };
};

const useSchedules = (experienceId: string | null) => {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadSchedules = async () => {
    if (!experienceId) return;

    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('activity_schedules')
        .select('*')
        .eq('activity_id', experienceId)
        .order('date', { ascending: true });

      if (error) throw error;

      setSchedules(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar los horarios');
      toast.error('Error al cargar los horarios');
    } finally {
      setIsLoading(false);
    }
  };

  const addSchedule = async (data: {
    date: string;
    startTime: string;
    endTime: string;
    availableSpots: number;
    priceOverride?: number;
  }) => {
    try {
      const { error } = await supabase
        .from('activity_schedules')
        .insert([{
          activity_id: experienceId,
          date: data.date,
          start_time: data.startTime,
          end_time: data.endTime,
          available_spots: data.availableSpots,
          booked_spots: 0,
          price_override: data.priceOverride
        }]);

      if (error) throw error;

      toast.success('Horario agregado exitosamente');
      loadSchedules();
    } catch (err) {
      toast.error('Error al agregar el horario');
      throw err;
    }
  };

  return {
    schedules,
    isLoading,
    error,
    loadSchedules,
    addSchedule
  };
};

// Constantes
const ITEMS_PER_PAGE = 10;
const LOADING_TIMEOUT = 10000;

const ExperiencesTab = ({ userProfile, user }: TabProps) => {
  const [selectedExperience, setSelectedExperience] = useState<string | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isAddScheduleDialogOpen, setIsAddScheduleDialogOpen] = useState(false);
  const [isLoadingExperiences, setIsLoadingExperiences] = useState(false);

  const {
    experiences,
    isLoading: isLoadingExperiencesList,
    hasMore,
    page,
    error,
    loadExperiences,
    createExperience
  } = useExperiences(user.id);

  const {
    schedules,
    isLoading: isLoadingSchedules,
    error: schedulesError,
    loadSchedules,
    addSchedule
  } = useSchedules(selectedExperience);

  useEffect(() => {
    loadExperiences();
  }, []);

  useEffect(() => {
    if (selectedExperience) {
      loadSchedules();
    }
  }, [selectedExperience]);

  const handleCreateExperience = async (data: {
    title: string;
    price: number;
    creator_id: string;
    is_premium: boolean;
    description: string;
    location: string;
    category: string;
    age_range: string;
  }) => {
    try {
      await createExperience({
        ...data,
        creator_id: user.id
      });
      setIsCreateDialogOpen(false);
    } catch (err) {
      console.error('Error creating experience:', err);
    }
  };

  const handleAddSchedule = async (data: {
    date: string;
    startTime: string;
    endTime: string;
    availableSpots: number;
    priceOverride?: number;
  }) => {
    try {
      await addSchedule(data);
      setIsAddScheduleDialogOpen(false);
    } catch (err) {
      console.error('Error adding schedule:', err);
    }
  };

  const handleLoadMore = () => {
    if (!hasMore || isLoadingExperiencesList) return;
    setIsLoadingExperiences(true);
    loadExperiences(page + 1);
  };

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Mis Actividades</h2>
          <p className="text-sm text-muted-foreground">
            Gestiona tus actividades y sus horarios
          </p>
        </div>
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          Crear actividad
        </Button>
      </div>

      {error ? (
        <div className="text-center py-4 bg-red-50 text-red-600 rounded-lg">
          {error}
        </div>
      ) : isLoadingExperiencesList ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : experiences.length > 0 ? (
        <>
          <ExperienceTable
            experiences={experiences}
            onSelectExperience={setSelectedExperience}
            isLoading={isLoadingExperiencesList}
          />
          {hasMore && (
            <div className="flex justify-center mt-4">
              <Button
                variant="outline"
                onClick={handleLoadMore}
                disabled={isLoadingExperiences}
                className="text-sm md:text-base"
              >
                Cargar más
              </Button>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-8 bg-gray-50 rounded-lg">
          <p className="text-gray-500">No tienes actividades creadas</p>
        </div>
      )}

      {selectedExperience && (
        <div className="mt-8">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold">Horarios</h3>
            <Button onClick={() => setIsAddScheduleDialogOpen(true)}>
              Agregar horario
            </Button>
          </div>

          {schedulesError ? (
            <div className="text-center py-4 bg-red-50 text-red-600 rounded-lg">
              {schedulesError}
            </div>
          ) : isLoadingSchedules ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : schedules.length > 0 ? (
            <ScheduleTable schedules={schedules} />
          ) : (
            <div className="text-center py-4 bg-gray-50 rounded-lg">
              <p className="text-gray-500">No hay horarios configurados</p>
            </div>
          )}
        </div>
      )}

      <CreateExperienceDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onCreateExperience={handleCreateExperience}
      />

      <AddScheduleDialog
        open={isAddScheduleDialogOpen}
        onOpenChange={setIsAddScheduleDialogOpen}
        onAddSchedule={handleAddSchedule}
        experienceId={selectedExperience || ''}
      />
    </div>
  );
};

export default ExperiencesTab;