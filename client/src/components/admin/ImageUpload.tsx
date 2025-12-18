// 📤 COMPONENTE IMAGE UPLOAD
// Arquivo: client/src/components/admin/ImageUpload.tsx

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Upload, X, Image as ImageIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ImageUploadProps {
  value?: string;
  onChange: (url: string) => void;
  onRemove?: () => void;
}

export function ImageUpload({ value, onChange, onRemove }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(value || null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validações
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      toast({
        title: "Erro",
        description: "Imagem muito grande. Máximo 5MB.",
        variant: "destructive",
      });
      return;
    }

    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      toast({
        title: "Erro",
        description: "Formato não suportado. Use JPG, PNG ou WEBP.",
        variant: "destructive",
      });
      return;
    }

    // Preview local
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Upload para servidor
    try {
      setUploading(true);

      const formData = new FormData();
      formData.append("image", file);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Erro ao fazer upload");
      }

      const data = await response.json();

      // Atualizar URL
      onChange(data.url);

      toast({
        title: "Sucesso",
        description: "Imagem enviada com sucesso!",
      });
    } catch (error) {
      console.error("Erro no upload:", error);
      toast({
        title: "Erro",
        description: "Falha ao enviar imagem. Tente novamente.",
        variant: "destructive",
      });
      setPreview(null);
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = () => {
    setPreview(null);
    if (onRemove) onRemove();
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-4">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/webp"
        onChange={handleFileSelect}
        className="hidden"
      />

      {preview ? (
        <div className="relative">
          <div className="relative aspect-square w-full max-w-sm rounded-lg overflow-hidden border-2 border-border">
            <img
              src={preview}
              alt="Preview"
              className="w-full h-full object-cover"
            />
          </div>
          <Button
            type="button"
            variant="destructive"
            size="icon"
            className="absolute top-2 right-2"
            onClick={handleRemove}
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      ) : (
        <div
          onClick={() => fileInputRef.current?.click()}
          className="relative aspect-square w-full max-w-sm rounded-lg border-2 border-dashed border-border hover:border-primary transition-colors cursor-pointer bg-muted/50 hover:bg-muted flex flex-col items-center justify-center gap-2"
        >
          <ImageIcon className="w-12 h-12 text-muted-foreground" />
          <p className="text-sm text-muted-foreground text-center px-4">
            Clique para selecionar uma imagem
          </p>
          <p className="text-xs text-muted-foreground">
            JPG, PNG ou WEBP (máx. 5MB)
          </p>
        </div>
      )}

      <Button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        disabled={uploading}
        variant="outline"
        className="w-full max-w-sm"
      >
        {uploading ? (
          <>
            <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin mr-2" />
            Enviando...
          </>
        ) : (
          <>
            <Upload className="w-4 h-4 mr-2" />
            {preview ? "Trocar Imagem" : "Selecionar Imagem"}
          </>
        )}
      </Button>
    </div>
  );
}