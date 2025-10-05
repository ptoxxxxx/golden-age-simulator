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
  
  const displayPrompt = isPolish && scenario.story_prompt_pl ? scenario.story_prompt_pl : scenario.story_prompt;
  
  return (
    <Card className="animate-fade-in shadow-modern-lg hover-lift border-0 bg-gradient-subtle overflow-hidden">
      <CardHeader className="space-y-6 pb-4">
        <CardTitle className="text-3xl font-bold text-foreground leading-tight">
          {displayPrompt}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center gap-2 pt-2">
          <div className="h-1 w-12 bg-gradient-primary rounded-full" />
          <h3 className="text-xl font-semibold text-foreground">{t('game.what_will_you_do')}</h3>
        </div>
        <div className="space-y-3">
          {options.map((option) => {
            const displayOptionText = isPolish && option.option_text_pl ? option.option_text_pl : option.option_text;
            return (
              <Button
                key={option.id}
                onClick={() => onSelectOption(option.id)}
                disabled={disabled}
                variant="outline"
                className="w-full text-left h-auto py-5 px-5 justify-start border-border/50 hover:border-primary/30 hover:bg-primary/5 transition-smooth shadow-modern-sm hover:shadow-modern-md group"
              >
                <span className="text-base leading-relaxed group-hover:text-foreground transition-colors">
                  {displayOptionText}
                </span>
              </Button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default ScenarioCard;