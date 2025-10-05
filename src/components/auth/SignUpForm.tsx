import { useState } from "react";
import { useTranslation } from "react-i18next";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { signUpSchema, SignUpFormData } from "@/lib/authSchemas";

interface SignUpFormProps {
  onSwitchToSignIn: () => void;
}

const SignUpForm = ({ onSwitchToSignIn }: SignUpFormProps) => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<SignUpFormData>({
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<Partial<SignUpFormData>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    // Validate with Zod
    const result = signUpSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors: Partial<SignUpFormData> = {};
      result.error.errors.forEach((err) => {
        if (err.path[0]) {
          fieldErrors[err.path[0] as keyof SignUpFormData] = err.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
        },
      });

      if (error) {
        if (error.message.includes("already registered")) {
          toast({
            title: t('auth.account_exists'),
            description: t('auth.email_registered'),
            variant: "destructive",
          });
        } else {
          throw error;
        }
        return;
      }

      // User will be automatically redirected to onboarding by Auth.tsx
      // when the session is detected
    } catch (error: any) {
      toast({
        title: t('common.error'),
        description: error.message || t('auth.create_account_error'),
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="signup-email">{t('auth.email')}</Label>
        <Input
          id="signup-email"
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          placeholder={t('auth.email_placeholder')}
          disabled={loading}
        />
        {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="signup-password">{t('auth.password')}</Label>
        <Input
          id="signup-password"
          type="password"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          placeholder="••••••••"
          disabled={loading}
        />
        {errors.password ? (
          <p className="text-sm text-destructive">{errors.password}</p>
        ) : (
          <p className="text-xs text-muted-foreground">{t('auth.password_hint')}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirm-password">{t('auth.confirm_password')}</Label>
        <Input
          id="confirm-password"
          type="password"
          value={formData.confirmPassword}
          onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
          placeholder="••••••••"
          disabled={loading}
        />
        {errors.confirmPassword && (
          <p className="text-sm text-destructive">{errors.confirmPassword}</p>
        )}
      </div>

      <Button
        type="submit"
        className="w-full bg-[#007834] hover:bg-[#006329]"
        disabled={loading}
      >
        {loading ? t('auth.creating_account') : t('auth.sign_up')}
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        {t('auth.have_account')}{" "}
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

export default SignUpForm;
