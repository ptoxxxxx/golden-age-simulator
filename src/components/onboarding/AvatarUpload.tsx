import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";

interface AvatarUploadProps {
  value: File | null;
  onChange: (file: File | null) => void;
  error?: string;
}

const AvatarUpload = ({ value, onChange, error }: AvatarUploadProps) => {
  const { t } = useTranslation();
  const [preview, setPreview] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const validTypes = ["image/jpeg", "image/png", "image/webp", "image/jpg"];
    if (!validTypes.includes(file.type)) {
      toast({
        title: t('onboarding.invalid_file_type'),
        description: t('onboarding.upload_image_type'),
        variant: "destructive",
      });
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: t('onboarding.file_too_large'),
        description: t('onboarding.max_file_size'),
        variant: "destructive",
      });
      return;
    }

    onChange(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleRemove = () => {
    onChange(null);
    setPreview(null);
  };

  return (
    <div className="space-y-2">
      <Label htmlFor="avatar">{t('onboarding.avatar')} ({t('onboarding.recommended')})</Label>
      <div className="flex items-center gap-4">
        {preview ? (
          <div className="relative">
            <img
              src={preview}
              alt="Avatar preview"
              className="w-24 h-24 rounded-full object-cover border-2 border-primary"
            />
            <Button
              type="button"
              variant="destructive"
              size="icon"
              className="absolute -top-2 -right-2 h-6 w-6 rounded-full"
              onClick={handleRemove}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <label
            htmlFor="avatar"
            className="w-24 h-24 rounded-full border-2 border-dashed border-muted-foreground hover:border-primary flex items-center justify-center cursor-pointer transition-colors bg-muted"
          >
            <Upload className="h-6 w-6 text-muted-foreground" />
          </label>
        )}
        <input
          id="avatar"
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="hidden"
          onChange={handleFileChange}
        />
        <div className="text-sm text-muted-foreground">
          <p>JPG, PNG, or WEBP</p>
          <p>Max 5MB</p>
        </div>
      </div>
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
};

export default AvatarUpload;
