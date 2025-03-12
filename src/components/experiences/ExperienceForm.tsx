import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Checkbox } from "@/components/ui/checkbox";
import ImageUploader from "./ImageUploader";

interface ExperienceFormProps {
  isEditMode: boolean;
  initialData: {
    title: string;
    description: string;
    location: string;
    category: string;
    price: string;
    imageUrl: string;
    ageRange: string;
    isPremium: boolean;
  };
  experienceId?: string;
  userId: string;
}

const ExperienceForm = ({ 
  isEditMode, 
  initialData,
  experienceId,
  userId
}) => {
  const navigate = useNavigate();
  
  const [title, setTitle] = useState(initialData.title);
  const [description, setDescription] = useState(initialData.description);
  const [location, setLocation] = useState(initialData.location);
  const [category, setCategory] = useState(initialData.category);
  const [price, setPrice] = useState(initialData.price);
  const [imageUrl, setImageUrl] = useState(initialData.imageUrl);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [ageRange, setAgeRange] = useState(initialData.ageRange);
  const [isPremium, setIsPremium] = useState(initialData.isPremium);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!userId) {
      toast.error("Debes iniciar sesión para crear experiencias");
      navigate("/auth");
      return;
    }
    
    if (!title || !description || !location || !category || !ageRange) {
      toast.error("Por favor completa todos los campos requeridos");
      return;
    }
    
    setLoading(true);
    
    try {
      let finalImageUrl = imageUrl;

      // Upload image if a file is selected
      if (selectedFile) {
        const fileExt = selectedFile.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
        
        const { error: uploadError, data } = await supabase.storage
          .from('activity_images')
          .upload(fileName, selectedFile);
          
        if (uploadError) throw uploadError;
        
        const { data: { publicUrl } } = supabase.storage
          .from('activity_images')
          .getPublicUrl(fileName);
          
        finalImageUrl = publicUrl;
      }
      
      const activityData = {
        title: title.trim(),
        description: description.trim(),
        location: location.trim(),
        category: category.trim(),
        price: parseFloat(price) || 0,
        image_url: finalImageUrl,
        age_range: ageRange.trim(),
        is_premium: isPremium,
        creator_id: userId,
        status: 'draft'
      };

      if (isEditMode && experienceId) {
        const { error } = await supabase
          .from('activities')
          .update(activityData)
          .eq('id', experienceId)
          .eq('creator_id', userId);
          
        if (error) throw error;
        toast.success("Experiencia actualizada correctamente");
      } else {
        const { error } = await supabase
          .from('activities')
          .insert([activityData]);
          
        if (error) throw error;
        toast.success("Experiencia creada correctamente");
      }

      navigate("/perfil");
    } catch (error: any) {
      console.error("Error saving experience:", error);
      toast.error(error.message || "Error al guardar la experiencia");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="title">Título de la Experiencia</Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          placeholder="Taller de manualidades en familia"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="description">Descripción</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          placeholder="Describe la experiencia, qué incluye, qué van a aprender los niños, etc."
          className="min-h-[150px]"
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="location">Ubicación</Label>
          <Input
            id="location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            required
            placeholder="Madrid, Centro Cultural"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="category">Categoría</Label>
          <Input
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
            placeholder="Arte, Naturaleza, Educación..."
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="price">Precio (€)</Label>
          <Input
            id="price"
            type="number"
            min="0"
            step="0.01"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="ageRange">Rango de Edad Recomendado</Label>
          <Input
            id="ageRange"
            value={ageRange}
            onChange={(e) => setAgeRange(e.target.value)}
            required
            placeholder="3-8 años"
          />
        </div>
      </div>
      
      <ImageUploader 
        imageUrl={imageUrl}
        setImageUrl={setImageUrl}
        selectedFile={selectedFile}
        setSelectedFile={setSelectedFile}
      />
      
      <div className="flex items-center space-x-2">
        <Checkbox
          id="isPremium"
          checked={isPremium}
          onCheckedChange={(checked) => setIsPremium(checked as boolean)}
        />
        <Label htmlFor="isPremium">Marcar como Experiencia Premium</Label>
      </div>
    
      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? (isEditMode ? "Actualizando..." : "Creando...") : (isEditMode ? "Actualizar Experiencia" : "Crear Experiencia")}
      </Button>
    </form>
  );
};

export default ExperienceForm;