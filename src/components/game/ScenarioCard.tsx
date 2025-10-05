import { useTranslation } from "react-i18next";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface ScenarioOption {
  id: number;
  option_text: string;
  option_text_pl?: string;
  effects: Record<string, number>;
  ai_coach_comment?: string;
  ai_coach_comment_pl?: string;
}

interface ScenarioCardProps {
  scenario: {
    id: number;
    story_prompt: string;
    story_prompt_pl?: string;
    area?: string;
    area_pl?: string;
  };
  options: ScenarioOption[];
  onSelectOption: (optionId: number) => void;
  disabled?: boolean;
  language?: string;
}

const ScenarioCard = ({ scenario, options, onSelectOption, disabled, language = 'en' }: ScenarioCardProps) => {
  const { t } = useTranslation();
  const isPolish = language === 'pl';
  
  const displayArea = isPolish && scenario.area_pl ? scenario.area_pl : scenario.area;
  const displayPrompt = isPolish && scenario.story_prompt_pl ? scenario.story_prompt_pl : scenario.story_prompt;
  
  return (
    <Card className="animate-fade-in">
      <CardHeader>
        {displayArea && (
          <Badge variant="secondary" className="w-fit mb-2">
            {displayArea}
          </Badge>
        )}
        <CardTitle className="text-2xl text-[#283754]">{t('game.life_decision')}</CardTitle>
        <CardDescription className="text-base mt-4">
          {displayPrompt}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <p className="text-sm font-medium text-muted-foreground mb-2">{t('game.what_will_you_do')}</p>
          {options.map((option) => {
            const displayOptionText = isPolish && option.option_text_pl ? option.option_text_pl : option.option_text;
            return (
              <Button
                key={option.id}
                onClick={() => onSelectOption(option.id)}
                disabled={disabled}
                variant="outline"
                className="w-full text-left h-auto py-4 px-4 justify-start hover-scale"
              >
                <span className="text-sm">{displayOptionText}</span>
              </Button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default ScenarioCard;
