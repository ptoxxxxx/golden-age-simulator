import { useTranslation } from "react-i18next";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface ScenarioOption {
  id: number;
  option_text: string;
  effects: Record<string, number>;
  ai_coach_comment?: string;
}

interface ScenarioCardProps {
  scenario: {
    id: number;
    story_prompt: string;
    area?: string;
  };
  options: ScenarioOption[];
  onSelectOption: (optionId: number) => void;
  disabled?: boolean;
}

const ScenarioCard = ({ scenario, options, onSelectOption, disabled }: ScenarioCardProps) => {
  const { t } = useTranslation();
  
  return (
    <Card className="animate-fade-in">
      <CardHeader>
        {scenario.area && (
          <Badge variant="secondary" className="w-fit mb-2">
            {scenario.area}
          </Badge>
        )}
        <CardTitle className="text-2xl text-[#283754]">{t('game.life_decision')}</CardTitle>
        <CardDescription className="text-base mt-4">
          {scenario.story_prompt}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <p className="text-sm font-medium text-muted-foreground mb-2">{t('game.what_will_you_do')}</p>
          {options.map((option) => (
            <Button
              key={option.id}
              onClick={() => onSelectOption(option.id)}
              disabled={disabled}
              variant="outline"
              className="w-full text-left h-auto py-4 px-4 justify-start hover-scale"
            >
              <span className="text-sm">{option.option_text}</span>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ScenarioCard;
