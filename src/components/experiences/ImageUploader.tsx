
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";

interface ImageUploaderProps {
  imageUrl: string;
  setImageUrl: (url: string) => void;
  selectedFile: File | null;
  setSelectedFile: (file: File | null) => void;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({
  imageUrl,
  setImageUrl,
  selectedFile,
  setSelectedFile
}) => {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
      // Clear the URL input when a file is selected
      setImageUrl("");
    }
  };

  return (
    <div className="space-y-2">
      <Label htmlFor="image">Imagen de la Experiencia</Label>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label className="text-sm text-muted-foreground">Subir una imagen</Label>
          <div className="flex items-center gap-4">
            <Button 
              type="button"
              variant="outline"
              className="w-full"
              onClick={() => document.getElementById('file-upload')?.click()}
            >
              <Upload className="mr-2 h-4 w-4" />
              Seleccionar Archivo
            </Button>
            <Input
              id="file-upload"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
          </div>
          {selectedFile && (
            <p className="text-sm text-green-600 mt-1">
              Archivo seleccionado: {selectedFile.name}
            </p>
          )}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="imageUrl" className="text-sm text-muted-foreground">
            O introducir URL de una imagen
          </Label>
          <Input
            id="imageUrl"
            value={imageUrl}
            onChange={(e) => {
              setImageUrl(e.target.value);
              setSelectedFile(null);
            }}
            placeholder="https://ejemplo.com/imagen.jpg"
            disabled={!!selectedFile}
          />
        </div>
      </div>
      {imageUrl && (
        <div className="mt-2">
          <img 
            src={imageUrl} 
            alt="Preview" 
            className="max-h-32 border rounded-md"
            onError={(e) => {
              e.currentTarget.src = "https://placehold.co/600x400?text=Error+al+cargar";
            }}
          />
        </div>
      )}
      <p className="text-sm text-muted-foreground mt-1">
        Añade una imagen para ilustrar la experiencia
      </p>
    </div>
  );
};

export default ImageUploader;
