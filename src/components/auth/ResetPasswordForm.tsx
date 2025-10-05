import { useState } from "react";
import { useTranslation } from "react-i18next";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { resetPasswordSchema, ResetPasswordFormData } from "@/lib/authSchemas";

interface ResetPasswordFormProps {
  onSwitchToSignIn: () => void;
}

const ResetPasswordForm = ({ onSwitchToSignIn }: ResetPasswordFormProps) => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<ResetPasswordFormData>({
    email: "",
  });
  const [errors, setErrors] = useState<Partial<ResetPasswordFormData>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    // Validate with Zod
    const result = resetPasswordSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors: Partial<ResetPasswordFormData> = {};
      result.error.errors.forEach((err) => {
        if (err.path[0]) {
          fieldErrors[err.path[0] as keyof ResetPasswordFormData] = err.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(formData.email, {
        redirectTo: `${window.location.origin}/auth?mode=reset`,
      });

      if (error) throw error;

      toast({
        title: t('auth.check_email'),
        description: t('auth.reset_link_sent'),
      });

      setTimeout(() => {
        onSwitchToSignIn();
      }, 2000);
    } catch (error: any) {
      toast({
        title: t('common.error'),
        description: error.message || t('auth.reset_email_error'),
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="reset-email">{t('auth.email')}</Label>
        <Input
          id="reset-email"
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ email: e.target.value })}
          placeholder={t('auth.email_placeholder')}
          disabled={loading}
        />
        {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
      </div>

      <Button
        type="submit"
        className="w-full bg-[#007834] hover:bg-[#006329]"
        disabled={loading}
      >
        {loading ? t('auth.sending') : t('auth.send_reset_link')}
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        {t('auth.remember_password')}{" "}
        <Button
          type="button"
          variant="link"
          onClick={onSwitchToSignIn}
          className="p-0 h-auto"
        >
          {t('auth.sign_in')}
        </Button>
      </p>
    </form>
  );
};

export default ResetPasswordForm;
