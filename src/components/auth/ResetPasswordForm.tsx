import { useState } from "react";
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
        title: "Check your email",
        description: "We've sent you a password reset link",
      });

      setTimeout(() => {
        onSwitchToSignIn();
      }, 2000);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to send reset email",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="reset-email">Email</Label>
        <Input
          id="reset-email"
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ email: e.target.value })}
          placeholder="your@email.com"
          disabled={loading}
        />
        {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
      </div>

      <Button
        type="submit"
        className="w-full bg-[#007834] hover:bg-[#006329]"
        disabled={loading}
      >
        {loading ? "Sending..." : "Send Reset Link"}
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        Remember your password?{" "}
        <Button
          type="button"
          variant="link"
          onClick={onSwitchToSignIn}
          className="p-0 h-auto"
        >
          Sign in
        </Button>
      </p>
    </form>
  );
};

export default ResetPasswordForm;
