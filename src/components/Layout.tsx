import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Globe, LogOut, BarChart3 } from "lucide-react";
import { User } from "@supabase/supabase-js";
import { toast } from "@/hooks/use-toast";
import { useTranslation } from "react-i18next";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { i18n, t } = useTranslation('common');
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const toggleLanguage = () => {
    const newLang = i18n.language === "en" ? "pl" : "en";
    i18n.changeLanguage(newLang);
  };

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Logged out",
        description: "You have been successfully logged out",
      });
      navigate("/auth");
    }
  };

  const isAuthPage = location.pathname === "/auth";
  const isGameOrSummaryPage = location.pathname === "/game" || location.pathname === "/summary";

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex flex-col">
            <h1 className="text-xl font-bold text-foreground">Golden Age Simulator</h1>
            <p className="text-xs font-light text-muted-foreground">Your Race to a Better Tomorrow</p>
          </div>
          <div className="flex items-center gap-2">
            {user && isGameOrSummaryPage && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/game-hub")}
                className="gap-2"
                aria-label="Game Hub"
              >
                <BarChart3 className="h-4 w-4" />
                {t("layout.game_hub")}
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleLanguage}
              className="gap-2"
              aria-label="Toggle language"
            >
              <Globe className="h-4 w-4" />
              {i18n.language.toUpperCase()}
            </Button>
            {user && !isAuthPage && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="gap-2"
                aria-label="Logout"
              >
                <LogOut className="h-4 w-4" />
                {t('auth.signOut')}
              </Button>
            )}
          </div>
        </div>
      </header>
      <main>{children}</main>
    </div>
  );
};

export default Layout;
