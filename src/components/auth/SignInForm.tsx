import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { signInSchema, SignInFormData } from "@/lib/authSchemas";

interface SignInFormProps {
  onSwitchToSignUp: () => void;
  onSwitchToReset: () => void;
}

const SignInForm = ({ onSwitchToSignUp, onSwitchToReset }: SignInFormProps) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<SignInFormData>({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<Partial<SignInFormData>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    // Validate with Zod
    const result = signInSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors: Partial<SignInFormData> = {};
      result.error.errors.forEach((err) => {
        if (err.path[0]) {
          fieldErrors[err.path[0] as keyof SignInFormData] = err.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (error) {
        if (error.message.includes("Invalid login credentials")) {
          toast({
            title: t('auth.sign_in_failed'),
            description: t('auth.invalid_credentials'),
            variant: "destructive",
          });
        } else {
          throw error;
        }
        return;
      }

      toast({
        title: t('auth.welcome_back'),
        description: t('auth.sign_in_success'),
      });

      navigate("/");
    } catch (error: any) {
      toast({
        title: t('common.error'),
        description: error.message || t('auth.sign_in_error'),
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">{t('auth.email')}</Label>
        <Input
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          placeholder={t('auth.email_placeholder')}
          disabled={loading}
        />
        {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">{t('auth.password')}</Label>
        <Input
          id="password"
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

      <Button
        type="submit"
        className="w-full bg-[#007834] hover:bg-[#006329]"
        disabled={loading}
      >
        {loading ? t('auth.signing_in') : t('auth.sign_in')}
      </Button>

      <div className="text-center space-y-2">
        <Button
          type="button"
          variant="link"
          onClick={onSwitchToReset}
          className="text-sm"
        >
          {t('auth.forgot_password')}
        </Button>
        <p className="text-sm text-muted-foreground">
          {t('auth.no_account')}{" "}
          <Button
            type="button"
            variant="link"
            onClick={onSwitchToSignUp}
            className="p-0 h-auto"
          >
            {t('auth.sign_up')}
          </Button>
        </p>
      </div>
    </form>
  );
};

export default SignInForm;
