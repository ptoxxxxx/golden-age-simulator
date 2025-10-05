import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Globe } from "lucide-react";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const [language, setLanguage] = useState<"en" | "pl">("en");

  useEffect(() => {
    const saved = localStorage.getItem("language");
    if (saved === "pl" || saved === "en") {
      setLanguage(saved);
    }
  }, []);

  const toggleLanguage = () => {
    const newLang = language === "en" ? "pl" : "en";
    setLanguage(newLang);
    localStorage.setItem("language", newLang);
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <h1 className="text-xl font-bold text-primary">Golden Age</h1>
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleLanguage}
            className="gap-2"
          >
            <Globe className="h-4 w-4" />
            {language.toUpperCase()}
          </Button>
        </div>
      </header>
      <main>{children}</main>
    </div>
  );
};

export default Layout;
