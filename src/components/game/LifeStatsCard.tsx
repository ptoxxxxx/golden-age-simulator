import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Heart, Briefcase, GraduationCap, Gamepad2, Users } from "lucide-react";

interface LifeStatsCardProps {
  health: number;
  career: number;
  education_level: number;
  entertainment: number;
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

const LifeStatsCard = ({ health, career, education_level, entertainment, relationships }: LifeStatsCardProps) => {
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
              <Briefcase className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">{t('game.career')}</span>
            </div>
            <span className={`text-sm font-bold ${getTextColor(career)}`}>{career}%</span>
          </div>
          <Progress value={career} className="h-2" indicatorClassName={getValueColor(career)} />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <GraduationCap className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">{t('game.education_level')}</span>
            </div>
            <span className={`text-sm font-bold ${getTextColor(education_level)}`}>{education_level}%</span>
          </div>
          <Progress value={education_level} className="h-2" indicatorClassName={getValueColor(education_level)} />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Gamepad2 className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">{t('game.entertainment')}</span>
            </div>
            <span className={`text-sm font-bold ${getTextColor(entertainment)}`}>{entertainment}%</span>
          </div>
          <Progress value={entertainment} className="h-2" indicatorClassName={getValueColor(entertainment)} />
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
