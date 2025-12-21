import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Upload, X, Image as ImageIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ImageUploadProps {
  value?: string;
  onChange: (url: string) => void;
  onRemove?: () => void;
}

const CLOUD_NAME = "dddtjacew";
const UPLOAD_PRESET = "elatho_unsigned";

export function ImageUpload({ value, onChange, onRemove }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(value || null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
  
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      toast({ title: "Imagem muito grande (máx 5MB)", variant: "destructive" });
      return;
    }
  
    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      toast({ title: "Formato inválido", variant: "destructive" });
      return;
    }
  
    setUploading(true);
  
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "elatho_unsigned");
  
      const res = await fetch(
        "https://api.cloudinary.com/v1_1/dddtjacew/image/upload",
        {
          method: "POST",
          body: formData,
        }
      );
  
      if (!res.ok) throw new Error("Upload falhou");
  
      const data = await res.json();
  
      setPreview(data.secure_url);
      onChange(data.secure_url);
  
      toast({ title: "Imagem enviada com sucesso!" });
    } catch (err) {
      console.error(err);
      toast({
        title: "Erro ao enviar imagem",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };  

  const handleRemove = () => {
    setPreview(null);
    onRemove?.();
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-4">
      <input
        ref={fileInputRef}
        type="file"
