import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface ExperienceData {
  title: string;
  description: string;
  location: string;
  category: string;
  price: string;
  imageUrl: string;
  ageRange: string;
  isPremium: boolean;
}

const initialData: ExperienceData = {
  title: "",
  description: "",
  location: "",
  category: "",
  price: "0",
  imageUrl: "",
  ageRange: "",
  isPremium: false
};

export const useExperienceData = (experienceId: string | undefined, userId: string | undefined) => {
  const [data, setData] = useState<ExperienceData>(initialData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchExperienceData = async () => {
      // Only fetch if we're editing an existing experience
      if (!userId || !experienceId) {
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const { data: experienceData, error } = await supabase
          .from("activities")
          .select("*")
          .eq("id", experienceId)
          .eq("creator_id", userId)
          .single();

        if (error) throw error;

        if (experienceData) {
          setData({
            title: experienceData.title || "",
            description: experienceData.description || "",
            location: experienceData.location || "",
            category: experienceData.category || "",
            price: experienceData.price ? experienceData.price.toString() : "0",
            imageUrl: experienceData.image_url || "",
            ageRange: experienceData.age_range || "",
            isPremium: experienceData.is_premium || false,
          });
        }
      } catch (err) {
        console.error("Error fetching experience:", err);
        setError(err instanceof Error ? err.message : "Error al cargar la experiencia");
        toast.error("Error al cargar la experiencia");
      } finally {
        setLoading(false);
      }
    };

    if (experienceId) {
      fetchExperienceData();
    } else {
      // If we're creating a new experience, just reset to initial state
      setData(initialData);
      setLoading(false);
    }
  }, [experienceId, userId]);

  return { data, loading, error };
};