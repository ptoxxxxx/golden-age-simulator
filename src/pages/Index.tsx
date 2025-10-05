import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        // Check if user has profile
        const { data: profile } = await supabase
          .from("users")
          .select("nickname")
          .eq("id", session.user.id)
          .maybeSingle();
        
        if (profile?.nickname) {
          navigate("/game-hub");
        } else {
          navigate("/onboarding");
        }
      } else {
        navigate("/auth");
      }
    };
    checkAuth();
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-muted-foreground">Redirecting...</p>
    </div>
  );
};

export default Index;
