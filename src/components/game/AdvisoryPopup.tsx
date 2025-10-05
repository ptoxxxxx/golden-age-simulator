import { useTranslation } from "react-i18next";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Lightbulb, TrendingUp, TrendingDown } from "lucide-react";

interface AdvisoryPopupProps {
  effects: Record<string, number>;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const EFFECT_LABELS: Record<string, string> = {
  health: "Zdrowie",
  career: "Kariera",
  education_level: "Edukacja",
  entertainment: "Rozrywka",
  relationships: "Relacje",
  saldo: "Saldo",
  savings: "Oszczędności",
  private_investments: "Inwestycje prywatne",
  zus_contributions: "Składki ZUS",
  salary: "Wynagrodzenie",
};

const AdvisoryPopup = ({ effects, open, onOpenChange }: AdvisoryPopupProps) => {
  const { t } = useTranslation();
  
  const renderEffect = (key: string, value: number) => {
    if (value === 0) return null;
    
    const isPositive = value > 0;
    const Icon = isPositive ? TrendingUp : TrendingDown;
    const colorClass = isPositive ? "text-green-600" : "text-red-600";
    
    return (
      <div key={key} className="flex items-center justify-between py-2 border-b last:border-0">
        <span className="text-sm font-medium">{EFFECT_LABELS[key] || key}</span>
        <div className={`flex items-center gap-2 ${colorClass}`}>
          <Icon className="h-4 w-4" />
          <span className="font-semibold">{isPositive ? '+' : ''}{value}</span>
        </div>
      </div>
    );
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-amber-500" />
            {t('game.advisory_title')}
          </DialogTitle>
          <DialogDescription className="text-base pt-4">
            {t('game.advisory_description')}
          </DialogDescription>
        </DialogHeader>
        
        <div className="bg-muted/30 rounded-lg p-4">
          {Object.entries(effects).map(([key, value]) => renderEffect(key, value))}
        </div>
        
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="w-full"
          >
            {t('game.close')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AdvisoryPopup;
