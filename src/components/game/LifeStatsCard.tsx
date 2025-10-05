import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Heart, Smile, Users } from "lucide-react";

interface LifeStatsCardProps {
  health: number;
  happiness: number;
  relationships: number;
}

const getValueColor = (value: number) => {
  if (value >= 67) return "bg-green-500";
  if (value >= 34) return "bg-orange-500";
  return "bg-red-500";
};

const getTextColor = (value: number) => {
  if (value >= 67) return "text-green-600";
  if (value >= 34) return "text-orange-600";
  return "text-red-600";
};

const LifeStatsCard = ({ health, happiness, relationships }: LifeStatsCardProps) => {
  const { t } = useTranslation();

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-lg">{t('game.life_parameters')}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Heart className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">{t('game.health')}</span>
            </div>
            <span className={`text-sm font-bold ${getTextColor(health)}`}>{health}%</span>
          </div>
          <Progress value={health} className="h-2" indicatorClassName={getValueColor(health)} />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Smile className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">{t('game.happiness')}</span>
            </div>
            <span className={`text-sm font-bold ${getTextColor(happiness)}`}>{happiness}%</span>
          </div>
          <Progress value={happiness} className="h-2" indicatorClassName={getValueColor(happiness)} />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">{t('game.relationships')}</span>
            </div>
            <span className={`text-sm font-bold ${getTextColor(relationships)}`}>{relationships}%</span>
          </div>
          <Progress value={relationships} className="h-2" indicatorClassName={getValueColor(relationships)} />
        </div>
      </CardContent>
    </Card>
  );
};

export default LifeStatsCard;
