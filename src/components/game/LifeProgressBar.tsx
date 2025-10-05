import { Progress } from "@/components/ui/progress";
import { useTranslation } from "react-i18next";
import { Calendar } from "lucide-react";

interface LifeProgressBarProps {
  age: number;
}

const LifeProgressBar = ({ age }: LifeProgressBarProps) => {
  const { t } = useTranslation();
  
  const MIN_AGE = 20;
  const MAX_AGE = 100;
  const progress = ((age - MIN_AGE) / (MAX_AGE - MIN_AGE)) * 100;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-primary" />
          <span className="text-lg font-semibold text-foreground">
            {t('game.life_progress')}
          </span>
        </div>
        <span className="text-3xl font-bold text-primary">
          {age} {t('game.years_old')}
        </span>
      </div>
      <Progress value={progress} className="h-3" />
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>{MIN_AGE}</span>
        <span>{MAX_AGE}</span>
      </div>
    </div>
  );
};

export default LifeProgressBar;
