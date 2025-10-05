import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import SignInForm from "@/components/auth/SignInForm";
import SignUpForm from "@/components/auth/SignUpForm";
import ResetPasswordForm from "@/components/auth/ResetPasswordForm";

type AuthMode = "sign-in" | "sign-up" | "reset";

const Auth = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [mode, setMode] = useState<AuthMode>(
    (searchParams.get("mode") as AuthMode) || "sign-in"
  );

  // Check if user is already authenticated and has profile
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        // Check if user has completed profile
        const { data: profile } = await supabase
          .from("users")
          .select("nickname, avatar_url")
          .eq("id", session.user.id)
          .maybeSingle();
        
        if (profile?.nickname) {
          navigate("/game-hub");
        } else {
          navigate("/onboarding");
        }
      }
    };
    checkAuth();
  }, [navigate]);

  const handleModeChange = (newMode: AuthMode) => {
    setMode(newMode);
    setSearchParams({ mode: newMode });
  };

  const getTitle = () => {
    switch (mode) {
      case "sign-up":
        return t('auth.create_account');
      case "reset":
        return t('auth.reset_password');
      default:
        return t('auth.welcome_back');
    }
  };

  const getDescription = () => {
    switch (mode) {
      case "sign-up":
        return t('auth.create_account_desc');
      case "reset":
        return t('auth.reset_password_desc');
      default:
        return t('auth.sign_in_desc');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#F5F7FA]">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl text-[#283754]">{getTitle()}</CardTitle>
          <CardDescription>{getDescription()}</CardDescription>
        </CardHeader>
        <CardContent>
          {mode === "sign-in" && (
            <SignInForm
              onSwitchToSignUp={() => handleModeChange("sign-up")}
              onSwitchToReset={() => handleModeChange("reset")}
            />
          )}
          {mode === "sign-up" && (
            <SignUpForm onSwitchToSignIn={() => handleModeChange("sign-in")} />
          )}
          {mode === "reset" && (
            <ResetPasswordForm onSwitchToSignIn={() => handleModeChange("sign-in")} />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;
